"use client";

import { jsx, jsxs } from "react/jsx-runtime";
import { createPrizeDisplay, type Prize } from "./original-prizes";
import { createPrizeFormats, useMemoCache } from "./original-prize-formats.mjs";

/**
 * Stable component factory for one original source context. The host supplies
 * its legitimate translation hook and already-validated prize/rank props.
 * This does not infer a page's viewer, ranking, parser, language or API provider.
 */
export function createCompetitionPrizeComponents({
  numberVariant,
  useTranslation,
}: {
  numberVariant: string;
  useTranslation: () => {
    t: (key: string, values?: Record<string, string | number>) => string;
    i18n: { language: string };
  };
}) {
  const format = createPrizeFormats({ numberVariant, Intl });
  const { Tier, Heading, PrizeBadge } = createPrizeDisplay({
    jsx,
    jsxs,
    useMemoCache,
    useTranslation,
    // Only the original display's nonconflicting size/color strings occur.
    // This binding is not the complete captured class-merge implementation.
    classNames: (...parts) => parts.filter(Boolean).join(" "),
    ...format,
  });
  function RankPrize({ prizes, rank }: { prizes: Prize[]; rank: number }) {
    return <PrizeBadge prize={format.findPrize(prizes, rank)} />;
  }
  return { PrizeTier: Tier, PrizeHeading: Heading, RankPrize };
}
