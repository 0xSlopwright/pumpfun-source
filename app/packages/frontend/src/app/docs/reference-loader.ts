import "server-only";

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import {
  REFERENCE_SOURCES,
  verifyReferenceProvenance,
  type ReferenceDocument,
  type ReferenceKey,
} from "./reference-data";

export type ReferenceLoadResult =
  | { ok: true; document: ReferenceDocument }
  | { ok: false; error: string };

export async function loadReferenceDocument(
  key: ReferenceKey,
): Promise<ReferenceLoadResult> {
  const evidenceRoot = resolve(process.cwd(), "../../evidence");
  try {
    const [bytes, manifestText] = await Promise.all([
      readFile(resolve(evidenceRoot, REFERENCE_SOURCES[key].path.replace("evidence/", ""))),
      readFile(resolve(evidenceRoot, "web/manifest.json"), "utf8"),
    ]);
    return {
      ok: true,
      document: verifyReferenceProvenance(key, bytes, JSON.parse(manifestText)),
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown reference evidence validation failure",
    };
  }
}
