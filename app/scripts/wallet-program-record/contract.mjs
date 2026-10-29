/** Published SDK source attribution; captured frontend JavaScript is never evaluated. */
import assert from "node:assert/strict";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { parse } from "@babel/parser";
import {
  decodeSource,
  exactlyOne,
  findNodes,
  sha256,
} from "../original-contracts/source.mjs";

const root = new URL("../../", import.meta.url);
const archive = new URL("evidence/sdk/pump-sdk-4.3.1.tgz", root);
assert.equal(
  sha256(await readFile(archive)),
  "c8ff4e850651c81e9f488bfc6dffb4513a041bb4bca0819879dc19d9a72a4641",
);
const paths = [
  "src/idl/pump.json",
  "src/sdk.ts",
  "src/onlineSdk.ts",
  "src/pda.ts",
  "src/state.ts",
  "src/tokenIncentives.ts",
];
const sources = new Map();
for (const path of paths) {
  const bytes = await readFile(new URL(`packages/sdk/${path}`, root));
  assert.deepEqual(
    bytes,
    execFileSync("tar", ["-xOf", archive.pathname, `package/${path}`]),
  );
  const source = decodeSource(bytes);
  sources.set(path, {
    ...source,
    bytes,
    ast: path.endsWith(".ts")
      ? parse(source.text, { sourceType: "module", plugins: ["typescript"] })
      : null,
  });
}
const idl = JSON.parse(sources.get("src/idl/pump.json").text);
const account = exactlyOne(
  idl.accounts.filter((x) => x.name === "UserVolumeAccumulator"),
  "account",
);
const type = exactlyOne(
  idl.types.filter((x) => x.name === account.name),
  "layout",
).type;
assert.equal(type.kind, "struct");
const widths = { pubkey: 32, bool: 1, u64: 8, i64: 8 };
let end = 8;
const fields = type.fields.map((field) => {
  const width = widths[field.type];
  assert.ok(width, `unsupported field ${field.name}`);
  const start = end;
  end += width;
  return {
    name: field.name,
    decoded: field.name.replace(/_([a-z])/g, (_, c) => c.toUpperCase()),
    type: field.type,
    bytes: [start, end],
  };
});
const pdaFunction = exactlyOne(
  findNodes(
    sources.get("src/pda.ts").ast,
    (n) =>
      n.type === "FunctionDeclaration" &&
      n.id?.name === "userVolumeAccumulatorPda",
  ),
  "PDA helper",
);
const pdaSeed = exactlyOne(
  [
    ...new Set(
      findNodes(pdaFunction, (n) => n.type === "StringLiteral").map(
        (n) => n.value,
      ),
    ),
  ],
  "same literal seed in both program branches",
);
assert.equal(pdaSeed, "user_volume_accumulator");
const contract = {
  sdkVersion: "4.3.1",
  programId: idl.address,
  pdaSeed,
  account: account.name,
  discriminator: account.discriminator,
  minimumBytes: end,
  fields,
};
const rpc = await readFile(
  new URL("packages/frontend/src/app/portfolio/rpc.ts", root),
);
const rpcSource = decodeSource(rpc),
  rpcAst = parse(rpcSource.text, {
    sourceType: "module",
    plugins: ["typescript"],
  });
const factory = exactlyOne(
  findNodes(
    rpcAst,
    (n) =>
      n.type === "FunctionDeclaration" && n.id?.name === "createPinnedRpcCall",
  ),
  "existing used transport",
);
const bodySha256 = sha256(
  rpc.subarray(
    rpcSource.byteOffsets[factory.body.start],
    rpcSource.byteOffsets[factory.body.end],
  ),
);
assert.equal(
  bodySha256,
  "49c42e491310e985a652dbfdcb553a9edfdbb58c16acd3005f63e7daafa41ab1",
);
function witness(path, predicate, label) {
  const s = sources.get(path),
    n = exactlyOne(findNodes(s.ast, predicate), label);
  const utf8 = [s.byteOffsets[n.start], s.byteOffsets[n.end]];
  return {
    path: `packages/sdk/${path}`,
    label,
    utf16: [n.start, n.end],
    utf8,
    sha256: sha256(s.bytes.subarray(...utf8)),
  };
}
const method = (name) => (n) =>
  n.type === "ClassMethod" &&
  n.key.type === "Identifier" &&
  n.key.name === name;
const fn = (name) => (n) =>
  n.type === "FunctionDeclaration" && n.id?.name === name;
const proof = {
  authority:
    "Published npm SDK/IDL only; independent public-account inspection, not original frontend or private rewards API parity",
  archiveSha256: sha256(await readFile(archive)),
  transport: {
    base: "c3b6530dab32b79ce0feb8977a4d50768ad38d7e",
    sourceSha256: sha256(rpc),
    unchangedFactoryBodySha256: bodySha256,
    delta:
      "export existing factory; add readonly getAccountInfo to TypeScript method union. Shared export and Node agent-package boundary credited to #893.",
  },
  sources: paths.map((path) => ({
    path: `packages/sdk/${path}`,
    sha256: sha256(sources.get(path).bytes),
  })),
  witnesses: [
    witness(
      "src/pda.ts",
      fn("userVolumeAccumulatorPda"),
      "Pump-specific wallet PDA; alternate program branch is not queried",
    ),
    witness(
      "src/sdk.ts",
      method("decodeUserVolumeAccumulator"),
      "Strict public account decoder; no padding or nullable-error swallowing",
    ),
    witness(
      "src/onlineSdk.ts",
      method("fetchUserVolumeAccumulator"),
      "Actual nullable public per-wallet account fetch",
    ),
    witness(
      "src/onlineSdk.ts",
      method("fetchUserVolumeAccumulatorTotalStats"),
      "SDK aggregation substitutes missing records; this inspector deliberately does not aggregate or substitute",
    ),
    witness(
      "src/onlineSdk.ts",
      method("getTotalUnclaimedTokens"),
      "Current incentive calculation also needs Global account; this inspector does not invoke it",
    ),
    witness(
      "src/tokenIncentives.ts",
      fn("totalUnclaimedTokens"),
      "Stored counter is not necessarily the current calculated reward amount",
    ),
  ],
  limits: [
    "Only Pump program account, not AMM or other quote-specific records",
    "Raw stored fields are not current entitlements, balances, PnL, eligibility or signing authority",
    "Unsupported old layouts fail without zero extension",
    "No token decimals or cross-counter totals inferred",
  ],
};
for (const [path, value] of [
  ["packages/frontend/src/app/wallet-program-record/contract.json", contract],
  ["research/wallet-program-record-20261029/SOURCE.json", proof],
]) {
  const target = new URL(path, root),
    text = JSON.stringify(value, null, 2) + "\n";
  if (process.argv.includes("--check"))
    assert.equal(await readFile(target, "utf8"), text, path);
  else {
    await mkdir(new URL(".", target), { recursive: true });
    await writeFile(target, text);
  }
}
console.log(
  "Wallet record contract: 6 archive-equal sources, 6 exact static witnesses, fixed-width IDL field layout",
);
