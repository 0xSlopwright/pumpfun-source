import type { AuthProfileClient, UnverifiedSessionResponse } from './index.js';
export function createConsumerKernel<T>(reader: { c(): void }, storage: { removeItem(key: string): void } | undefined,
  setInvalidated: (value: true) => void, clientFactory: { j(): AuthProfileClient<T> },
  revalidation: { f(client: AuthProfileClient<T>): Promise<UnverifiedSessionResponse<T>> }): {
  clearUiState(): void;
  revalidateUiSession(): Promise<'ok' | 'invalid'>;
};
export function visibleUnverifiedClaims<T>(invalidated: boolean, snapshot: T | null | undefined): T | null;
export function capturedAuthReadyFlag(authReady: boolean, snapshot: unknown, invalidated: boolean): boolean;
