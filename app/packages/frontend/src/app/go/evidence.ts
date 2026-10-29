import "server-only";

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { type GoSnapshot, verifyGoEvidence } from "./go-data";

const evidenceRoot = resolve(process.cwd(), "../../evidence");
const capturePath = resolve(evidenceRoot, "web/objects/e66810e11f481135");
const manifestPath = resolve(evidenceRoot, "web/manifest.json");

export type GoEvidenceResult =
  | { ok: true; snapshot: GoSnapshot }
  | { ok: false; error: string };

export async function loadGoEvidence(): Promise<GoEvidenceResult> {
  try {
    const [bytes, manifestText] = await Promise.all([
      readFile(capturePath),
      readFile(manifestPath, "utf8"),
    ]);
    return {
      ok: true,
      snapshot: verifyGoEvidence(bytes, JSON.parse(manifestText)),
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown GO evidence validation failure",
    };
  }
}
