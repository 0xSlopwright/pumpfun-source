import type { OriginalAuthStatePredicates, ReauthenticationInput, WalletChangeInput } from './index.js';
export function createAuthStateKernel<TClaims>(decoder: { S(value: unknown): TClaims }, clock: { now(): number }): {
  U: OriginalAuthStatePredicates<TClaims>['normalizeUnverifiedClaims'];
  K(input: ReauthenticationInput): boolean;
  O(input: WalletChangeInput): boolean;
};
