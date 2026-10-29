import { createPendingLogoutKernel } from "./pending.mjs";
import { createDisplayRestoreKernel } from "./restore.mjs";
export interface DisplayStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}
export interface DisplayReader<T> {
  D(): T | null;
  I(): void;
}
export interface DisplayRequestOptions<TSignal> {
  credentials: "include";
  headers: { "Cache-Control": "no-cache" };
  signal: TSignal;
}
export interface DisplayRestorePorts<TClaims, TTimer, TSignal> {
  storage: DisplayStorage;
  reader: DisplayReader<TClaims>;
  normalize: { S(value: unknown): TClaims | null };
  clientBuilder: {
    K(config: {
      clientServerUrl: string;
    }): (
      operation: "GET /auth/my-profile",
      options: DisplayRequestOptions<TSignal>,
    ) => unknown | PromiseLike<unknown>;
  };
  AbortController: new () => { signal: TSignal; abort(): void };
  setTimeout(callback: () => void, milliseconds: number): TTimer;
  clearTimeout(timer: TTimer): void;
  logger: { info(message: string, metadata: Record<string, never>): void };
}
export interface PendingLogoutState {
  isPending(): boolean;
  markPending(): void;
  consume(): boolean;
}
export interface OriginalDisplayRestore {
  restoreDisplay(config: { clientServerUrl: string }): Promise<boolean>;
  pendingLogout: PendingLogoutState;
}
export const originalDisplayRestoreSource =
  "evidence/web/objects/9bafadffbe6dc98b.js" as const;

/** Original unverified display-state recovery. All external capabilities are explicit. */
export function createOriginalDisplayRestore<TClaims, TTimer, TSignal>(
  source: typeof originalDisplayRestoreSource,
  ports: DisplayRestorePorts<TClaims, TTimer, TSignal>,
): OriginalDisplayRestore {
  if (source !== originalDisplayRestoreSource)
    throw new Error(
      "Explicit supported original display restore source required",
    );
  const pending = createPendingLogoutKernel(ports.storage);
  const restoreDisplay = createDisplayRestoreKernel(
    ports.reader,
    pending,
    ports.clientBuilder,
    ports.normalize,
    ports.storage,
    ports.AbortController,
    ports.setTimeout,
    ports.clearTimeout,
    { y: ports.logger },
  );
  return {
    restoreDisplay,
    pendingLogout: {
      isPending: pending.g,
      markPending: pending.c,
      consume: pending.P,
    },
  };
}
