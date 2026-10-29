import "server-only";

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { verifySnapshotProvenance, type CoinSnapshot } from "./coin-data";

const evidenceRoot = resolve(process.cwd(), "../../evidence");
const capturePath = resolve(evidenceRoot, "web/objects/cd3f926d4d318056");
const probesPath = resolve(evidenceRoot, "api-probes.json");
const manifestPath = resolve(evidenceRoot, "web/manifest.json");

export type CoinSnapshotLoadResult =
  | { ok: true; snapshot: CoinSnapshot }
  | { ok: false; error: string };

export async function loadCoinSnapshot(): Promise<CoinSnapshotLoadResult> {
  try {
    const [bytes, probesText, manifestText] = await Promise.all([
      readFile(capturePath),
      readFile(probesPath, "utf8"),
      readFile(manifestPath, "utf8"),
    ]);
    return {
      ok: true,
      snapshot: verifySnapshotProvenance(
        bytes,
        JSON.parse(probesText),
        JSON.parse(manifestText),
      ),
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown captured evidence validation failure",
    };
  }
}
