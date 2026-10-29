import type { Prize } from "./original-prizes";
// Heterogeneous compiler-generated cache slots have no recovered original TS type.
export function useMemoCache(size: number): any[];
export const prizeNumberVariants: ReadonlyArray<{
  sha256: string;
  path: string;
  source: string;
}>;
export function createPrizeFormats(capabilities: {
  numberVariant: string;
  Intl: typeof Intl;
}): {
  canonicalLocale: (language: string) => string | null;
  formatRank: (rank: number, locale: string) => string;
  formatAmount: (options: { text: string; locale: string }) => string;
  findPrize: (prizes: Prize[], rank: number) => Prize | null;
};
