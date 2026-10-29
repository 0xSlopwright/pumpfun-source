import { test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
const root = new URL("../../../", import.meta.url);
const hash = (bytes: string | Buffer) =>
  createHash("sha256").update(bytes).digest("hex");
const records = [
  {
    file: "evidence/web/objects/a73dd4b5aeff6202.js",
    bytes: 23591,
    hash: "811da914c6edb027447bdeec30e6c5d789c65a7267c97e8924799dec820aad6f",
    factories: [
      [
        5470,
        6802,
        "9c9f618b76fb17141d8f9e484d08c037906da8c060c223efcd32bfee111f54cb",
      ],
    ],
  },
  {
    file: "evidence/web/objects/2b47dd0b38a1608f.js",
    bytes: 507700,
    hash: "e78d2f38b06f971847c18dd05457c75afc85208135f50d6e4022a5f197e8839d",
    factories: [
      [
        391539,
        392690,
        "fb9c61590f587e16e63242c58f343055cdcb029d2a2c6931df051f78f41b6876",
      ],
      [
        384184,
        391531,
        "e3a474234fdd438c6c6d64c063aabb960c880fb0f5562d29e8af92e4f6550a16",
      ],
      [
        470885,
        484647,
        "81460139322676a0f9685f4807f169ef30b84aded29a0f148b9f1bca4f6f1dda",
      ],
    ],
  },
];
for (const record of records)
  test(`position evidence remains bound to captured bytes and UTF-16 factory ranges: ${record.file}`, () => {
    const bytes = readFileSync(new URL(record.file, root));
    assert.equal(bytes.length, record.bytes);
    assert.equal(hash(bytes), record.hash);
    const source = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    for (const [start, end, sha] of record.factories)
      assert.equal(hash(source.slice(start as number, end as number)), sha);
    // Only decoding/slicing/hashing. Captured JavaScript is never evaluated.
  });
