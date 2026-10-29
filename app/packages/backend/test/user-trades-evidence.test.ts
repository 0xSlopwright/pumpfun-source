import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const root = new URL("../../../", import.meta.url);
const hash = (value: string | Buffer) =>
  createHash("sha256").update(value).digest("hex");
const file = "evidence/web/objects/2b47dd0b38a1608f.js";
const sourceHash =
  "e78d2f38b06f971847c18dd05457c75afc85208135f50d6e4022a5f197e8839d";
const factories = [
  {
    id: 76439,
    start: 392697,
    end: 400473,
    hash: "642430c1c84a3f311085643fd76b01a98c17055d2399aedc37e35b736f7e277b",
  },
  {
    id: 785036,
    start: 36328,
    end: 36794,
    hash: "7608705120b4cecaeb64242df384fa1d8de743375557ff6251a868d03f0d9b5a",
  },
  {
    id: 183184,
    start: 3127,
    end: 3228,
    hash: "6a7355492303729b121c0e5311fe0fcef22b6d960942fa94eb67baf0a4b6fd26",
  },
];

test("trade history contract, scope helper and route helper are bound to physical capture ranges", () => {
  const bytes = readFileSync(new URL(file, root));
  assert.equal(bytes.length, 507700);
  assert.equal(hash(bytes), sourceHash);
  const source = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  const manifest = JSON.parse(
    readFileSync(new URL("evidence/web/manifest.json", root), "utf8"),
  );
  assert.ok(
    manifest.records.some(
      (row: any) =>
        row.path === file &&
        row.sha256 === sourceHash &&
        row.url ===
          "https://pump.fun/_next/static/immutable/chunks/2cr_aqnw2j4n5.js",
    ),
  );
  const modules = JSON.parse(
    readFileSync(new URL("recovered/modules.json", root), "utf8"),
  );
  for (const factory of factories) {
    assert.equal(hash(source.slice(factory.start, factory.end)), factory.hash);
    assert.ok(
      modules.modules.some(
        (row: any) =>
          row.ids.includes(factory.id) &&
          row.sha256 === factory.hash &&
          row.origins.some(
            (origin: any) =>
              origin.source === file &&
              origin.start === factory.start &&
              origin.end === factory.end,
          ),
      ),
    );
  }
  const contract = source.slice(factories[0].start, factories[0].end);
  assert.ok(
    contract.includes(
      '"GET /user-trades/{id}":(0,s.publicRead)("positions.read"',
    ),
  );
  assert.ok(contract.includes("Transaction signature — not unique by itself"));
  assert.ok(contract.includes("26-digit zero-padded chain-ordered id"));
  assert.ok(contract.includes("cc serves 50 when omitted"));
  assert.ok(
    contract.includes("amountUsd/priceUsd/amountSol each null independently"),
  );
  const bindings = JSON.parse(
    readFileSync(new URL("contracts/developer-bindings.json", root), "utf8"),
  );
  const binding = bindings.bindings.find(
    (row: any) => row.operation === "GET /user-trades/{id}",
  );
  assert.equal(binding.scope, "positions.read");
  assert.equal(binding.origin.declared, "https://api.pump.fun/v1");
  assert.equal(binding.evidence.contract.sha256, sourceHash);
  assert.equal(binding.evidence.contract.start, 395375);
  assert.equal(binding.evidence.contract.end, 395432);
  // Decode/slice/hash/inspect strings only. Never evaluate captured JavaScript.
});
