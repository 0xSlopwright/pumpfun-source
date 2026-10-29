/**
 * Runtime environment facts, resolved once. The frontend talks to its own Next
 * route handlers in the browser and to the local backend compatibility harness
 * on the server. There is no production proxy and no credential here, by design
 * (see app/AGENTS.md: never enable a live proxy or put credentials in browser code).
 */

export const isServer = typeof window === 'undefined';

/**
 * Base URL of the backend compatibility harness, used only for server-side reads.
 * Defaults to the local harness. The rewrite in next.config.ts forwards
 * `/api/compat/*` here for the browser; server code calls it directly.
 */
export function backendBaseUrl(): string {
  return process.env.BACKEND_URL ?? 'http://127.0.0.1:3001';
}

/** User agent recorded on server-side upstream reads, matching the capture convention. */
export const USER_AGENT = 'pump-reconstruction/0.1 (+local; read-only)';
