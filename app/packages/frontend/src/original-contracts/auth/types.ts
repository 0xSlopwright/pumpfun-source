/** Parsed browser claims, with NO JWT signature or server-session verification. */
export interface UnverifiedUiClaims {
  address: string;
  userId?: string;
  roles: unknown[];
  permissions?: string[];
  exp: number;
  iat: number;
}

export type UiSnapshot = UnverifiedUiClaims | null;
export type StoreListener = () => void;

/** Capabilities must be supplied by the caller; this module never reads globals. */
export interface SessionBrowserPorts {
  document?: {
    cookie: string;
    addEventListener(type: string, listener: StoreListener): void;
    removeEventListener(type: string, listener: StoreListener): void;
  };
  window?: {
    addEventListener(type: string, listener: StoreListener): void;
    removeEventListener(type: string, listener: StoreListener): void;
  };
  localStorage?: { getItem(key: string): string | null };
  location?: { hostname: string };
  Date: { now(): number };
  atob(value: string): string;
}

export interface ReaderReact {
  useSyncExternalStore(
    subscribe: (listener: StoreListener) => () => void,
    getSnapshot: () => UiSnapshot,
    getServerSnapshot: () => null,
  ): UiSnapshot;
}

export interface DecoderKernel {
  S(value: unknown): UiSnapshot;
  e(value: unknown): UiSnapshot;
}

/** Original export letters retained only at the source-adaptation boundary. */
export interface ReaderKernel {
  c(): void;
  i(value: unknown, now?: number): false;
  I(): void;
  D(): UiSnapshot;
  s(): UiSnapshot;
  subscribe(listener: StoreListener): () => void;
  getServerSnapshot(): null;
}

export interface OriginalUiSessionReader {
  /** Does not verify signatures, freshness, roles or backend authorization. */
  getUnverifiedSnapshot(): UiSnapshot;
  getServerSnapshot(): null;
  subscribe(listener: StoreListener): () => void;
  useUnverifiedSnapshot(): UiSnapshot;
  notify(): void;
  clearAuthCookie(): void;
  /** Always false in these three captured variants; not a security policy. */
  capturedExpiryPredicate(value: unknown, now?: number): false;
  normalizeUnverifiedClaims(value: unknown): UiSnapshot;
  decodeUnverifiedToken(value: unknown): UiSnapshot;
}
