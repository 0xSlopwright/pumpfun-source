import { createHash } from "node:crypto";

import generatedReferencePages from "./reference-pages.generated.json" with { type: "json" };

export const REFERENCE_CAPTURED_AT = "2026-10-28T10:48:45.546100+00:00";

export const REFERENCE_SOURCES = {
  fees: {
    route: "/docs/fees",
    officialUrl: "https://pump.fun/docs/fees",
    title: "Fees",
    path: "evidence/web/objects/34f7b585a78296af",
    bytes: 370_412,
    sha256:
      "6e0dd8524a735bf232d28e2153ea3e835565dcbf653964acdac8f93168be2f72",
    counts: { h2: 7, h3: 0, p: 19, table: 7, ul: 0 },
  },
  privacy: {
    route: "/docs/privacy-policy",
    officialUrl: "https://pump.fun/docs/privacy-policy",
    title: "Privacy Notice",
    path: "evidence/web/objects/ecde4a73aafb477e",
    bytes: 355_497,
    sha256:
      "babc5695f31c07f667f321e2c4456ae37e478bc77eac77ca2b724878daf13cc7",
    counts: { h2: 16, h3: 7, p: 62, table: 0, ul: 4 },
  },
  terms: {
    route: "/docs/terms-and-conditions",
    officialUrl: "https://pump.fun/docs/terms-and-conditions",
    title: "Terms Of Use",
    path: "evidence/web/objects/1e06d459af096a65",
    bytes: 698_394,
    sha256:
      "f6ffed345dfb40e8f8fc4fec31b522e10663d19783508849ba75642b16dd4be2",
    counts: { h2: 36, h3: 2, p: 482, table: 0, ul: 4 },
  },
} as const;

const localReferenceRoutes = new Set<string>([
  "/",
  ...Object.values(REFERENCE_SOURCES).map((source) => source.route),
]);

/** Preserve the source origin for documents that have no local archive. */
export function referenceLinkHref(href: string): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const official = new URL(href, REFERENCE_SOURCES.fees.officialUrl);
  return localReferenceRoutes.has(official.pathname) ? href : official.href;
}

export type ReferenceKey = keyof typeof REFERENCE_SOURCES;

export type ReferenceInline =
  | string
  | {
      type: "strong" | "link";
      href?: string;
      children: ReferenceInline[];
    };

export type ReferenceBlock =
  | {
      type: "heading";
      level: 2 | 3;
      id: string;
      text: string;
    }
  | { type: "paragraph"; children: ReferenceInline[] }
  | {
      type: "list";
      ordered: boolean;
      items: { children: ReferenceInline[] }[];
    }
  | {
      type: "table";
      rows: {
        cells: { header: boolean; children: ReferenceInline[] }[];
      }[];
    };

export type ReferenceDocument = {
  key: ReferenceKey;
  route: string;
  officialUrl: string;
  title: string;
  source: {
    path: string;
    bytes: number;
    sha256: string;
    capturedAt: string;
    status: number;
    contentType: string;
  };
  blocks: ReferenceBlock[];
  observedCounts: { h2: number; h3: number; p: number; table: number; ul: number };
  contentSha256: string;
};

type UnknownRecord = Record<string, unknown>;

export class ReferenceEvidenceError extends Error {
  override name = "ReferenceEvidenceError";
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function safeText(value: unknown, label: string): string {
  if (
    typeof value !== "string" ||
    value.length === 0 ||
    /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(value)
  ) {
    throw new ReferenceEvidenceError(`${label} must be non-empty safe text`);
  }
  return value;
}

function safeHref(value: unknown): string {
  const href = safeText(value, "Reference link");
  if (href.startsWith("/") && !href.startsWith("//")) return href;
  if (href.startsWith("mailto:")) {
    const address = href.slice("mailto:".length);
    if (/^[^\s@]+@[^\s@]+$/u.test(address)) return href;
  }
  try {
    const parsed = new URL(href);
    if (parsed.protocol === "https:") return href;
  } catch {
    // The explicit error below is clearer than URL's parser error.
  }
  throw new ReferenceEvidenceError(`Unsupported reference link: ${href}`);
}

function inlineNodes(value: unknown, label: string): ReferenceInline[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new ReferenceEvidenceError(`${label} must contain inline content`);
  }
  return value.map((item, index) => {
    if (typeof item === "string") return safeText(item, `${label} text ${index}`);
    if (!isRecord(item) || (item.type !== "strong" && item.type !== "link")) {
      throw new ReferenceEvidenceError(`${label} contains unsupported inline content`);
    }
    return {
      type: item.type,
      ...(item.type === "link" ? { href: safeHref(item.href) } : {}),
      children: inlineNodes(item.children, `${label} ${item.type} ${index}`),
    };
  });
}

function inlineText(nodes: readonly ReferenceInline[]): string {
  return nodes
    .map((node) => (typeof node === "string" ? node : inlineText(node.children)))
    .join("");
}

function validateBlocks(value: unknown): ReferenceBlock[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new ReferenceEvidenceError("Reference document blocks are missing");
  }
  const ids = new Set<string>();
  return value.map((block, index) => {
    if (!isRecord(block) || typeof block.type !== "string") {
      throw new ReferenceEvidenceError(`Reference block ${index} is malformed`);
    }
    if (block.type === "heading") {
      if (block.level !== 2 && block.level !== 3) {
        throw new ReferenceEvidenceError(`Reference heading ${index} has an invalid level`);
      }
      const id = safeText(block.id, `Reference heading ${index} id`);
      const text = safeText(block.text, `Reference heading ${index} text`);
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(id)) {
        throw new ReferenceEvidenceError(`Reference heading ${index} has an unsafe id`);
      }
      if (ids.has(id)) {
        throw new ReferenceEvidenceError(`Duplicate reference section identity: ${id}`);
      }
      ids.add(id);
      return { type: "heading", level: block.level, id, text };
    }
    if (block.type === "paragraph") {
      return {
        type: "paragraph",
        children: inlineNodes(block.children, `Reference paragraph ${index}`),
      };
    }
    if (block.type === "list") {
      if (typeof block.ordered !== "boolean" || !Array.isArray(block.items) || !block.items.length) {
        throw new ReferenceEvidenceError(`Reference list ${index} is malformed`);
      }
      return {
        type: "list",
        ordered: block.ordered,
        items: block.items.map((item, itemIndex) => {
          if (!isRecord(item)) {
            throw new ReferenceEvidenceError(`Reference list ${index} item ${itemIndex} is malformed`);
          }
          return {
            children: inlineNodes(item.children, `Reference list ${index} item ${itemIndex}`),
          };
        }),
      };
    }
    if (block.type === "table") {
      if (!Array.isArray(block.rows) || !block.rows.length) {
        throw new ReferenceEvidenceError(`Reference table ${index} is empty`);
      }
      const rows = block.rows.map((row, rowIndex) => {
        if (!isRecord(row) || !Array.isArray(row.cells) || !row.cells.length) {
          throw new ReferenceEvidenceError(`Reference table ${index} row ${rowIndex} is malformed`);
        }
        return {
          cells: row.cells.map((cell, cellIndex) => {
            if (!isRecord(cell) || typeof cell.header !== "boolean") {
              throw new ReferenceEvidenceError(`Reference table ${index} cell ${cellIndex} is malformed`);
            }
            return {
              header: cell.header,
              children: inlineNodes(cell.children, `Reference table ${index} cell ${cellIndex}`),
            };
          }),
        };
      });
      const width = rows[0]?.cells.length;
      if (!width || rows.some((row) => row.cells.length !== width)) {
        throw new ReferenceEvidenceError(`Reference table ${index} has inconsistent rows`);
      }
      return { type: "table", rows };
    }
    throw new ReferenceEvidenceError(`Reference block ${index} has unsupported type ${block.type}`);
  });
}

function numberField(record: UnknownRecord, name: string): number {
  const value = record[name];
  if (!Number.isSafeInteger(value) || (value as number) < 0) {
    throw new ReferenceEvidenceError(`${name} must be a non-negative integer`);
  }
  return value as number;
}

function validateDocument(value: unknown, key: ReferenceKey): ReferenceDocument {
  if (!isRecord(value) || value.key !== key) {
    throw new ReferenceEvidenceError(`Reference document ${key} is missing`);
  }
  const expected = REFERENCE_SOURCES[key];
  if (
    value.route !== expected.route ||
    value.officialUrl !== expected.officialUrl ||
    value.title !== expected.title
  ) {
    throw new ReferenceEvidenceError(`Reference document ${key} identity does not match`);
  }
  if (!isRecord(value.source)) {
    throw new ReferenceEvidenceError(`Reference document ${key} source is missing`);
  }
  const expectedSource = {
    path: expected.path,
    bytes: expected.bytes,
    sha256: expected.sha256,
    capturedAt: REFERENCE_CAPTURED_AT,
    status: 200,
    contentType: "text/html; charset=utf-8",
  };
  for (const [field, expectedValue] of Object.entries(expectedSource)) {
    if (value.source[field] !== expectedValue) {
      throw new ReferenceEvidenceError(`Reference document ${key} ${field} does not match`);
    }
  }
  const blocks = validateBlocks(value.blocks);
  if (!isRecord(value.observedCounts)) {
    throw new ReferenceEvidenceError(`Reference document ${key} counts are missing`);
  }
  const observedCounts = {
    h2: numberField(value.observedCounts, "h2"),
    h3: numberField(value.observedCounts, "h3"),
    p: numberField(value.observedCounts, "p"),
    table: numberField(value.observedCounts, "table"),
    ul: numberField(value.observedCounts, "ul"),
  };
  if (JSON.stringify(observedCounts) !== JSON.stringify(expected.counts)) {
    throw new ReferenceEvidenceError(`Reference document ${key} structure does not match`);
  }
  const derivedCounts = {
    h2: blocks.filter((block) => block.type === "heading" && block.level === 2).length,
    h3: blocks.filter((block) => block.type === "heading" && block.level === 3).length,
    p: blocks.filter((block) => block.type === "paragraph").length,
    table: blocks.filter((block) => block.type === "table").length,
    ul: blocks.filter((block) => block.type === "list" && !block.ordered).length,
  };
  if (JSON.stringify(derivedCounts) !== JSON.stringify(expected.counts)) {
    throw new ReferenceEvidenceError(`Reference document ${key} extracted structure is incomplete`);
  }
  const body = blocks
    .map((block) => {
      if (block.type === "heading") return block.text;
      if (block.type === "paragraph") return inlineText(block.children);
      if (block.type === "list") return block.items.map((item) => inlineText(item.children)).join(" ");
      return block.rows.flatMap((row) => row.cells.map((cell) => inlineText(cell.children))).join(" ");
    })
    .join("\n");
  if (!body.includes("Last Updated: 17 October 2026")) {
    throw new ReferenceEvidenceError(`Reference document ${key} has an unsupported version`);
  }
  if (key === "fees") {
    for (const marker of ["Creator fee", "Protocol fee", "LP fee", "Total fee", "Holder Rewards coins", "Platform Fee"]) {
      if (!body.includes(marker)) {
        throw new ReferenceEvidenceError(`Reference fee data is missing ${marker}`);
      }
    }
  }
  const contentSha256 = safeText(value.contentSha256, `${key} content SHA-256`);
  const actualContentSha256 = createHash("sha256")
    .update(JSON.stringify(value.blocks))
    .digest("hex");
  if (contentSha256 !== actualContentSha256) {
    throw new ReferenceEvidenceError(`Reference document ${key} content SHA-256 does not match`);
  }
  return {
    key,
    route: expected.route,
    officialUrl: expected.officialUrl,
    title: expected.title,
    source: expectedSource,
    blocks,
    observedCounts,
    contentSha256,
  };
}

export function validateReferenceDataset(input: unknown): Record<ReferenceKey, ReferenceDocument> {
  if (!isRecord(input) || input.schemaVersion !== 1 || input.capturedAt !== REFERENCE_CAPTURED_AT) {
    throw new ReferenceEvidenceError("Reference dataset schema or capture timestamp is unsupported");
  }
  if (!Array.isArray(input.documents) || input.documents.length !== 3) {
    throw new ReferenceEvidenceError("Reference dataset must contain exactly three documents");
  }
  const values = new Map(input.documents.map((document) => [isRecord(document) ? document.key : undefined, document]));
  if (values.size !== 3) {
    throw new ReferenceEvidenceError("Reference dataset contains duplicate document identities");
  }
  return {
    fees: validateDocument(values.get("fees"), "fees"),
    privacy: validateDocument(values.get("privacy"), "privacy"),
    terms: validateDocument(values.get("terms"), "terms"),
  };
}

export function sha256(bytes: Uint8Array): string {
  return createHash("sha256").update(bytes).digest("hex");
}

export function verifyReferenceProvenance(
  key: ReferenceKey,
  bytes: Uint8Array,
  manifest: unknown,
  dataset: unknown = generatedReferencePages,
): ReferenceDocument {
  const source = REFERENCE_SOURCES[key];
  if (bytes.byteLength !== source.bytes || sha256(bytes) !== source.sha256) {
    throw new ReferenceEvidenceError(`Captured ${key} document bytes do not match`);
  }
  if (!isRecord(manifest) || manifest.captured_at !== REFERENCE_CAPTURED_AT || !Array.isArray(manifest.records)) {
    throw new ReferenceEvidenceError("Reference capture manifest is malformed");
  }
  const records = manifest.records.filter(
    (record): record is UnknownRecord => isRecord(record) && record.url === source.officialUrl,
  );
  if (records.length !== 1) {
    throw new ReferenceEvidenceError(`Captured ${key} manifest record is missing or duplicated`);
  }
  const record = records[0];
  if (
    record.final_url !== source.officialUrl ||
    record.status !== 200 ||
    record.path !== source.path ||
    record.bytes !== source.bytes ||
    record.sha256 !== source.sha256 ||
    !isRecord(record.headers) ||
    record.headers["content-type"] !== "text/html; charset=utf-8"
  ) {
    throw new ReferenceEvidenceError(`Captured ${key} manifest provenance does not match`);
  }
  return validateReferenceDataset(dataset)[key];
}
