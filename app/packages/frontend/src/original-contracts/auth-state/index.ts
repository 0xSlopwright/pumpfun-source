import { createAuthStateKernel } from './kernel.mjs';

/** Candidate frontend data. No signature, session or permission verification. */
export interface UnverifiedAuthClaimCandidate {
  address?: unknown;
  exp?: unknown;
}
export interface ReauthenticationInput {
  decodedJwt: UnverifiedAuthClaimCandidate | null | undefined;
  privyAuthenticated: boolean;
  publicKeyAddress: string | null | undefined;
  nowMs?: number;
}
export interface WalletChangeInput extends Omit<ReauthenticationInput, 'nowMs'> {
  previousPublicKeyAddress: string | null | undefined;
}
export interface OriginalAuthStatePredicates<TClaims> {
  normalizeUnverifiedClaims(value: unknown): TClaims;
  needsWalletReauthentication(input: ReauthenticationInput): boolean;
  walletChangedAwayFromClaims(input: WalletChangeInput): boolean;
}
export const originalAuthStateSource = 'evidence/web/objects/9bafadffbe6dc98b.js' as const;

/** Explicit original capture + decoder + clock; never selects browser globals. */
export function createOriginalAuthStatePredicates<TClaims>(
  source: typeof originalAuthStateSource,
  decoder: { S(value: unknown): TClaims },
  clock: { now(): number },
): OriginalAuthStatePredicates<TClaims> {
  if (source !== originalAuthStateSource) throw new Error('Explicit supported original auth-state source required');
  const kernel = createAuthStateKernel(decoder, clock);
  return {
    normalizeUnverifiedClaims: kernel.U,
    needsWalletReauthentication: kernel.K,
    walletChangedAwayFromClaims: kernel.O,
  };
}
