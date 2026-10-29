import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = fileURLToPath(new URL("..", import.meta.url));
const require = createRequire(new URL("../packages/sdk/package.json", import.meta.url));
const { PublicKey } = require("@solana/web3.js");
const published = mkdtempSync(join(tmpdir(), "pump-sdk-holder-rewards-"));
mkdirSync(join(published, "swap"));
symlinkSync(
  join(root, "packages/sdk/node_modules"),
  join(published, "node_modules"),
  process.platform === "win32" ? "junction" : "dir",
);
for (const subpath of ["index.js", "swap/index.js"]) {
  writeFileSync(
    join(published, subpath),
    execFileSync("tar", [
      "-xOf",
      join(root, "evidence/sdk/pump-sdk-4.3.1.tgz"),
      `package/dist/${subpath}`,
    ]),
  );
}
process.on("exit", () => rmSync(published, { recursive: true, force: true }));

const referenceRoot = require(join(published, "index.js"));
const referenceSwap = require(join(published, "swap/index.js"));
const { deriveHolderRewardsAddress } = await import(
  "../packages/frontend/src/app/holder-rewards-derivation.ts"
);

const vectors = [
  {
    mint: "11111111111111111111111111111111",
    pda: "Cxpv3PFKz8jFfeQHUFQRTXCyNUz6WScMG8XrM8wLwBun",
  },
  {
    mint: "So11111111111111111111111111111111111111112",
    pda: "54SthQvXp5vQrse2JBjVUgsZVU3RrCtPAKQhqcn7XJnh",
  },
  {
    mint: "4Nd1mY1vZ1tcWgUYQX1Qh5dNdV1ugpVQZQvQ4wzXyV9Y",
    pda: "2GEkrTkBKRWgDaPbZwEWgHYjPcxpGaXWLDUtyKmVSGUU",
  },
];

test("offline adapter matches published root and swap SDK exports", () => {
  for (const vector of vectors) {
    const key = new PublicKey(vector.mint);
    const rootPda = referenceRoot.holderRewardsPda(key).toBase58();
    const swapPda = referenceSwap.holderRewardsPda(key).toBase58();
    const result = deriveHolderRewardsAddress(vector.mint);
    assert.equal(result.ok, true);
    assert.equal(rootPda, vector.pda);
    assert.equal(swapPda, vector.pda);
    assert.deepEqual(result, {
      ok: true,
      mint: vector.mint,
      holderRewardsPda: vector.pda,
    });
  }
});

test("offline adapter trims whitespace and remains deterministic", () => {
  const mint = vectors[1].mint;
  const first = deriveHolderRewardsAddress(` \n${mint}\t `);
  const second = deriveHolderRewardsAddress(mint);
  assert.deepEqual(first, second);
  assert.equal(first.ok, true);
  assert.equal(first.mint, mint);
});

test("offline adapter rejects empty, malformed and wrong-length keys", () => {
  for (const value of [
    "",
    "   ",
    "not a public key",
    "0OIl",
    "111",
    "1".repeat(45),
  ]) {
    const result = deriveHolderRewardsAddress(value);
    assert.equal(result.ok, false, JSON.stringify(value));
    assert.equal("holderRewardsPda" in result, false);
  }
});

test("default public key is accepted only as a syntactic computation input", () => {
  const result = deriveHolderRewardsAddress(PublicKey.default.toBase58());
  assert.deepEqual(result, {
    ok: true,
    mint: PublicKey.default.toBase58(),
    holderRewardsPda: vectors[0].pda,
  });
});
