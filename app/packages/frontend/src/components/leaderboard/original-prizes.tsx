"use client";
import type { ComponentType } from "react";
export type Prize = { rankFrom: number; rankTo: number; amount: string };
export function createPrizeDisplay({
  jsx,
  jsxs,
  useMemoCache,
  useTranslation,
  classNames,
  canonicalLocale,
  formatRank,
  formatAmount,
}: {
  jsx: typeof import("react/jsx-runtime").jsx;
  jsxs: typeof import("react/jsx-runtime").jsxs;
  useMemoCache: (size: number) => any[];
  useTranslation: () => {
    t: (key: string, values?: Record<string, string | number>) => string;
    i18n: { language: string };
  };
  classNames: (...parts: Array<string | undefined | false>) => string;
  canonicalLocale: (language: string) => string | null;
  formatRank: (value: number, locale: string) => string;
  formatAmount: (options: { text: string; locale: string }) => string;
}) {
  const a = { jsx, jsxs },
    s = { c: useMemoCache },
    l = { f: useTranslation },
    A = { c: classNames },
    R = { v: canonicalLocale },
    E = { Z: formatRank },
    $ = { k: formatAmount },
    n: { S: Record<number, string | undefined> } = {
      S: { 1: "text-[#FFD700]", 2: "text-[#C0C0C0]", 3: "text-[#CD7F32]" },
    };
  const Tier: ComponentType<{ prize: Prize }> = (e) => {
    let t,
      r,
      i,
      d,
      o,
      c,
      u,
      m = (0, s.c)(20),
      { prize: p } = e,
      { t: x, i18n: b } = (0, l.f)();
    if (
      m[0] !== b.language ||
      m[1] !== p.amount ||
      m[2] !== p.rankFrom ||
      m[3] !== p.rankTo ||
      m[4] !== x
    ) {
      let e,
        s = (0, R.v)(b.language) ?? "en",
        l = p.rankTo > p.rankFrom,
        c = l ? void 0 : n.S[p.rankFrom],
        u = (0, $.k)({ text: p.amount, locale: s });
      ((i = "flex items-center justify-between gap-3 px-4 py-3.5"),
        (d = `cup-tier-${p.rankFrom}`));
      let h = c ?? "text-text-primary";
      (m[10] !== h
        ? ((e = (0, A.c)("text-sm", h)), (m[10] = h), (m[11] = e))
        : (e = m[11]),
        (o = (0, a.jsx)("span", {
          className: e,
          children: l
            ? x("web.leaderboard.cup.tier_range", {
                from: (0, E.Z)(p.rankFrom, s),
                to: (0, E.Z)(p.rankTo, s),
              })
            : x("web.leaderboard.cup.tier_single", {
                rank: (0, E.Z)(p.rankFrom, s),
              }),
        })),
        (t = "text-sm font-semibold text-text-accent"),
        (r = l ? x("web.leaderboard.cup.tier_each", { amount: u }) : u),
        (m[0] = b.language),
        (m[1] = p.amount),
        (m[2] = p.rankFrom),
        (m[3] = p.rankTo),
        (m[4] = x),
        (m[5] = t),
        (m[6] = r),
        (m[7] = i),
        (m[8] = d),
        (m[9] = o));
    } else ((t = m[5]), (r = m[6]), (i = m[7]), (d = m[8]), (o = m[9]));
    return (
      m[12] !== t || m[13] !== r
        ? ((c = (0, a.jsx)("span", { className: t, children: r })),
          (m[12] = t),
          (m[13] = r),
          (m[14] = c))
        : (c = m[14]),
      m[15] !== i || m[16] !== d || m[17] !== o || m[18] !== c
        ? ((u = (0, a.jsxs)("div", {
            className: i,
            "data-testid": d,
            children: [o, c],
          })),
          (m[15] = i),
          (m[16] = d),
          (m[17] = o),
          (m[18] = c),
          (m[19] = u))
        : (u = m[19]),
      u
    );
  };
  const Heading: ComponentType<{ title: string; isCardTop?: boolean }> = (
    e,
  ) => {
    let t,
      r,
      l = (0, s.c)(5),
      { title: n, isCardTop: i } = e,
      d = i ? "pt-4" : "pt-2";
    return (
      l[0] !== d
        ? ((t = (0, A.c)(
            "px-4 pb-1 text-xs font-medium uppercase tracking-wider text-text-tertiary",
            d,
          )),
          (l[0] = d),
          (l[1] = t))
        : (t = l[1]),
      l[2] !== t || l[3] !== n
        ? ((r = (0, a.jsx)("h2", { className: t, children: n })),
          (l[2] = t),
          (l[3] = n),
          (l[4] = r))
        : (r = l[4]),
      r
    );
  };
  const PrizeBadge: ComponentType<{ prize: Prize | null }> = ({ prize: S }) =>
    S
      ? (0, a.jsx)("span", {
          className:
            "rounded-full bg-bg-tertiary px-2 py-0.5 text-[10px] font-semibold text-text-primary",
          "data-testid": "cup-entry-prize",
          children: S.amount,
        })
      : null;
  return { Tier, Heading, PrizeBadge };
}
