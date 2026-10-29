import { t as requestRevalidation } from './request.mjs';
import { createConsumerKernel, visibleUnverifiedClaims, capturedAuthReadyFlag } from './consumer.mjs';

export interface CapturedAuthResponse { status?: unknown }
export interface AuthProfileRequestOptions {
  credentials: 'include';
  headers: { 'Cache-Control': 'no-cache' };
  throwHttpErrors: false;
  hooks: { afterResponse: ((request: unknown, options: unknown, response: CapturedAuthResponse | null | undefined) => void)[] };
}
export type AuthProfileClient<TPayload> = (
  operation: 'GET /auth/my-profile', options: AuthProfileRequestOptions,
) => TPayload | PromiseLike<TPayload>;
export interface UnverifiedSessionResponse<TPayload> {
  verdict: 'ok' | 'rejected' | 'inconclusive';
  status: unknown | null;
  payload: TPayload | undefined;
  error: unknown;
}
export interface AuthRevalidationPorts<TPayload> {
  getClient(): AuthProfileClient<TPayload>;
  clearAuthCookie(): void;
  storage?: { removeItem(key: string): void };
  setInvalidated(value: true): void;
}
export interface OriginalAuthRevalidation<TPayload> {
  requestSession(client: AuthProfileClient<TPayload>): Promise<UnverifiedSessionResponse<TPayload>>;
  revalidateUiSession(): Promise<'ok' | 'invalid'>;
  clearUiState(): void;
  visibleUnverifiedClaims<T>(invalidated: boolean, snapshot: T | null | undefined): T | null;
  capturedAuthReadyFlag(authReady: boolean, snapshot: unknown, invalidated: boolean): boolean;
}
export const originalAuthRevalidationSource = 'evidence/web/objects/9bafadffbe6dc98b.js' as const;

/** Original client UI flow only. The injected client supplies any actual transport. */
export function createOriginalAuthRevalidation<TPayload>(
  source: typeof originalAuthRevalidationSource,
  ports: AuthRevalidationPorts<TPayload>,
): OriginalAuthRevalidation<TPayload> {
  if (source !== originalAuthRevalidationSource) throw new Error('Explicit supported original auth revalidation source required');
  const consumer = createConsumerKernel({ c: ports.clearAuthCookie }, ports.storage, ports.setInvalidated,
    { j: ports.getClient }, { f: requestRevalidation });
  return { requestSession: requestRevalidation, ...consumer, visibleUnverifiedClaims, capturedAuthReadyFlag };
}
