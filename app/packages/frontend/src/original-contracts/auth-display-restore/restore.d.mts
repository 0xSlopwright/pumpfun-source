import type { DisplayRestorePorts } from "./index.js";
export function createDisplayRestoreKernel<T, TTimer, TSignal>(
  reader: DisplayRestorePorts<T, TTimer, TSignal>["reader"],
  pending: { g(): boolean },
  builder: DisplayRestorePorts<T, TTimer, TSignal>["clientBuilder"],
  normalize: DisplayRestorePorts<T, TTimer, TSignal>["normalize"],
  storage: DisplayRestorePorts<T, TTimer, TSignal>["storage"],
  AbortController: DisplayRestorePorts<T, TTimer, TSignal>["AbortController"],
  setTimeout: DisplayRestorePorts<T, TTimer, TSignal>["setTimeout"],
  clearTimeout: DisplayRestorePorts<T, TTimer, TSignal>["clearTimeout"],
  logger: { y: DisplayRestorePorts<T, TTimer, TSignal>["logger"] },
): (config: { clientServerUrl: string }) => Promise<boolean>;
