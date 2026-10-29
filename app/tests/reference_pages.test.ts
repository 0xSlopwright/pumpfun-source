import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import generatedReferencePages from "../packages/frontend/src/app/docs/reference-pages.generated.json" with { type: "json" };
import {
  REFERENCE_CAPTURED_AT,
  REFERENCE_SOURCES,
  referenceLinkHref,
  sha256,
  validateReferenceDataset,
  verifyReferenceProvenance,
} from "../packages/frontend/src/app/docs/reference-data.ts";

const manifestUrl = new URL("../evidence/web/manifest.json", import.meta.url);

async function evidence(key: keyof typeof REFERENCE_SOURCES) {
  const source = REFERENCE_SOURCES[key];
  const [bytes, manifest] = await Promise.all([
    readFile(new URL(`../${source.path}`, import.meta.url)),
    readFile(manifestUrl, "utf8").then(JSON.parse),
  ]);
  return { source, bytes, manifest };
}

function changedDataset(): typeof generatedReferencePages {
  return structuredClone(generatedReferencePages);
}

test("authenticates all three exact captured reference documents", async () => {
  const documents = validateReferenceDataset(generatedReferencePages);
  assert.deepEqual(Object.keys(documents), ["fees", "privacy", "terms"]);

  for (const key of Object.keys(REFERENCE_SOURCES) as (keyof typeof REFERENCE_SOURCES)[]) {
    const { source, bytes, manifest } = await evidence(key);
    assert.equal(bytes.byteLength, source.bytes);
    assert.equal(sha256(bytes), source.sha256);
    const document = verifyReferenceProvenance(key, bytes, manifest);
    assert.equal(document.key, key);
    assert.equal(document.title, source.title);
    assert.equal(document.source.capturedAt, REFERENCE_CAPTURED_AT);
  }
});

test("rejects missing or corrupted captured bytes", async () => {
  const { bytes, manifest } = await evidence("fees");
  assert.throws(
    () => verifyReferenceProvenance("fees", new Uint8Array(), manifest),
    /bytes do not match/,
  );
  const corrupted = Buffer.from(bytes);
  corrupted[corrupted.length - 1] ^= 1;
  assert.throws(
    () => verifyReferenceProvenance("fees", corrupted, manifest),
    /bytes do not match/,
  );
});

test("rejects altered and duplicate manifest provenance", async () => {
  const { bytes, manifest } = await evidence("privacy");
  const altered = structuredClone(manifest);
  const record = altered.records.find(
    (candidate: { url?: string }) => candidate.url === REFERENCE_SOURCES.privacy.officialUrl,
  );
  record.bytes += 1;
  assert.throws(
    () => verifyReferenceProvenance("privacy", bytes, altered),
    /provenance does not match/,
  );

  const duplicated = structuredClone(manifest);
  duplicated.records.push(structuredClone(record));
  assert.throws(
    () => verifyReferenceProvenance("privacy", bytes, duplicated),
    /missing or duplicated/,
  );
});

test("rejects unsupported versions, missing titles and malformed blocks", () => {
  const version = changedDataset();
  version.schemaVersion = 2;
  assert.throws(() => validateReferenceDataset(version), /schema or capture timestamp/);

  const title = changedDataset();
  title.documents[1]!.title = "";
  assert.throws(() => validateReferenceDataset(title), /identity does not match/);

  const malformed = changedDataset();
  malformed.documents[2]!.blocks[0] = { type: "unknown" } as never;
  assert.throws(() => validateReferenceDataset(malformed), /unsupported type/);
});

test("rejects duplicate section identities and incomplete structure", () => {
  const duplicate = changedDataset();
  const headings = duplicate.documents[1]!.blocks.filter(
    (block): block is Extract<(typeof duplicate.documents)[number]["blocks"][number], { type: "heading" }> =>
      block.type === "heading",
  );
  headings[1]!.id = headings[0]!.id;
  assert.throws(() => validateReferenceDataset(duplicate), /Duplicate reference section identity/);

  const incomplete = changedDataset();
  incomplete.documents[0]!.blocks.splice(2, 1);
  assert.throws(() => validateReferenceDataset(incomplete), /extracted structure is incomplete/);
});

test("rejects missing required fee data and changed content hashes", () => {
  const fees = changedDataset();
  const serialized = JSON.stringify(fees).replaceAll("Creator fee", "Creator amount");
  assert.throws(
    () => validateReferenceDataset(JSON.parse(serialized)),
    /fee data is missing Creator fee/,
  );

  const hash = changedDataset();
  hash.documents[2]!.contentSha256 = "0".repeat(64);
  assert.throws(() => validateReferenceDataset(hash), /content SHA-256 does not match/);
});

test("rejects untrusted link schemes and unsafe section ids", () => {
  const links = changedDataset();
  const paragraph = links.documents[0]!.blocks.find(
    (block): block is Extract<(typeof links.documents)[number]["blocks"][number], { type: "paragraph" }> =>
      block.type === "paragraph" && block.children.some((child) => typeof child !== "string" && child.type === "link"),
  );
  const link = paragraph?.children.find(
    (child): child is Exclude<(typeof paragraph.children)[number], string> =>
      typeof child !== "string" && child.type === "link",
  );
  if (!link) throw new Error("Test fixture is missing a captured link");
  link.href = "javascript:alert(1)";
  assert.throws(() => validateReferenceDataset(links), /Unsupported reference link/);

  const identity = changedDataset();
  const heading = identity.documents[1]!.blocks.find((block) => block.type === "heading");
  if (!heading || heading.type !== "heading") throw new Error("Test fixture is missing a heading");
  heading.id = "unsafe id";
  assert.throws(() => validateReferenceDataset(identity), /unsafe id/);
});

test("uncopied document links retain the official origin instead of a local 404", () => {
  const destinations = [
    "/docs/charitycoins",
    "/docs/custom-pairs",
    "/docs/livestream-moderation-policy",
    "/docs/dmca-policy",
    "/docs/trademark-guidelines",
    "/docs/tokenized-agent-disclaimer",
    "/docs/go-fun-terms",
    "/docs/referral-rewards",
    "/docs/app-competition-terms",
  ];
  const retained = JSON.stringify(generatedReferencePages.documents);
  for (const href of destinations) {
    assert.ok(retained.includes(JSON.stringify(href)), `${href} is captured`);
    assert.equal(referenceLinkHref(href), `https://pump.fun${href}`);
  }
  assert.equal(
    referenceLinkHref("/docs/custom-pairs?source=fees#rewards"),
    "https://pump.fun/docs/custom-pairs?source=fees#rewards",
  );
});

test("copied reference routes stay local and recorded external links stay unchanged", () => {
  for (const href of [
    "/",
    ...Object.values(REFERENCE_SOURCES).map((source) => source.route),
    "/docs/fees?source=terms#platform-fee",
    "https://www.allaboutcookies.org",
    "mailto:legal@pump.fun",
  ]) {
    assert.equal(referenceLinkHref(href), href);
  }
});
