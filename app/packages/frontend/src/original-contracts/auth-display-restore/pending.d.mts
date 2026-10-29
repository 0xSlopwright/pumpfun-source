import type { DisplayStorage } from "./index.js";
export function createPendingLogoutKernel(storage: DisplayStorage): {
  P(): boolean;
  g(): boolean;
  c(): void;
};
