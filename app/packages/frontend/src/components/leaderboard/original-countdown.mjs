"use client";
export { c as useMemoCache } from "react/compiler-runtime";
// Complete source-adapted React display, digit component and used selectors.
// Capability bindings are local; captured runtime factories are never executed.
export function createCountdownModule({
  jsx,
  jsxs,
  useMemoCache,
  useState,
  useEffect,
  useTranslation,
  Date,
  setInterval,
  clearInterval,
}) {
  const a = { jsx, jsxs },
    s = { c: useMemoCache },
    i = { useState, useEffect },
    l = { f: useTranslation };
  const { selectTarget, countdown } = (() => {
    let l = (e) => {
      if (null === e) return null;
      let t = Date.parse(e);
      return Number.isFinite(t) ? t : null;
    };
    return {
      selectTarget: (e) => {
        if ("live" === e.phase) {
          let t = l(e.endsAt);
          return null === t ? null : { kind: "ends", atMs: t };
        }
        if ("upcoming" === e.phase || "registration" === e.phase) {
          let t = l(e.startsAt);
          return null === t ? null : { kind: "starts", atMs: t };
        }
        return null;
      },
      countdown: (e, t) => {
        let r = Math.max(0, Math.floor((e - t) / 1e3));
        return {
          days: Math.floor(r / 86400),
          hours: Math.floor(r / 3600) % 24,
          minutes: Math.floor(r / 60) % 60,
          seconds: r % 60,
        };
      },
    };
  })();
  const $ = { v: countdown };
  function et() {
    return Date.now();
  }
  let Y = (e) => {
      let t,
        r,
        l,
        n,
        i = (0, s.c)(9),
        { value: d, label: o } = e;
      return (
        i[0] !== d
          ? ((t = String(d).padStart(2, "0")), (i[0] = d), (i[1] = t))
          : (t = i[1]),
        i[2] !== t
          ? ((r = (0, a.jsx)("span", {
              className:
                "text-lg font-bold leading-6 tabular-nums text-text-primary",
              children: t,
            })),
            (i[2] = t),
            (i[3] = r))
          : (r = i[3]),
        i[4] !== o
          ? ((l = (0, a.jsx)("span", {
              className:
                "text-[10px] font-medium uppercase tracking-wider text-text-tertiary",
              children: o,
            })),
            (i[4] = o),
            (i[5] = l))
          : (l = i[5]),
        i[6] !== r || i[7] !== l
          ? ((n = (0, a.jsxs)("div", {
              className:
                "flex w-14 flex-col items-center rounded-xl border border-border-secondary bg-bg-primary/80 pb-1 pt-1.5",
              children: [r, l],
            })),
            (i[6] = r),
            (i[7] = l),
            (i[8] = n))
          : (n = i[8]),
        n
      );
    },
    ee = (e) => {
      let t,
        r,
        n,
        d,
        o,
        c,
        u,
        m,
        p,
        x,
        b,
        h,
        f,
        g,
        y,
        w = (0, s.c)(38),
        { target: j } = e,
        { t: v } = (0, l.f)(),
        [N, _] = (0, i.useState)(et);
      (w[0] === Symbol.for("react.memo_cache_sentinel")
        ? ((t = () => {
            let e = setInterval(() => _(Date.now()), 1e3);
            return () => clearInterval(e);
          }),
          (r = []),
          (w[0] = t),
          (w[1] = r))
        : ((t = w[0]), (r = w[1])),
        (0, i.useEffect)(t, r),
        w[2] !== N || w[3] !== j.atMs
          ? ((n = (0, $.v)(j.atMs, N)), (w[2] = N), (w[3] = j.atMs), (w[4] = n))
          : (n = w[4]));
      let k = n;
      (w[5] !== v || w[6] !== j.kind
        ? ((d = v(
            "ends" === j.kind
              ? "web.leaderboard.cup.ends_in"
              : "web.leaderboard.cup.starts_in",
          )),
          (w[5] = v),
          (w[6] = j.kind),
          (w[7] = d))
        : (d = w[7]),
        w[8] !== d
          ? ((o = (0, a.jsx)("span", {
              className:
                "text-xs font-medium uppercase tracking-wider text-text-secondary",
              children: d,
            })),
            (w[8] = d),
            (w[9] = o))
          : (o = w[9]));
      let z = k.days;
      (w[10] !== v
        ? ((c = v("web.leaderboard.cup.unit_days")), (w[10] = v), (w[11] = c))
        : (c = w[11]),
        w[12] !== k.days || w[13] !== c
          ? ((u = (0, a.jsx)(Y, { value: z, label: c })),
            (w[12] = k.days),
            (w[13] = c),
            (w[14] = u))
          : (u = w[14]));
      let I = k.hours;
      (w[15] !== v
        ? ((m = v("web.leaderboard.cup.unit_hours")), (w[15] = v), (w[16] = m))
        : (m = w[16]),
        w[17] !== k.hours || w[18] !== m
          ? ((p = (0, a.jsx)(Y, { value: I, label: m })),
            (w[17] = k.hours),
            (w[18] = m),
            (w[19] = p))
          : (p = w[19]));
      let U = k.minutes;
      (w[20] !== v
        ? ((x = v("web.leaderboard.cup.unit_minutes")),
          (w[20] = v),
          (w[21] = x))
        : (x = w[21]),
        w[22] !== k.minutes || w[23] !== x
          ? ((b = (0, a.jsx)(Y, { value: U, label: x })),
            (w[22] = k.minutes),
            (w[23] = x),
            (w[24] = b))
          : (b = w[24]));
      let A = k.seconds;
      return (
        w[25] !== v
          ? ((h = v("web.leaderboard.cup.unit_seconds")),
            (w[25] = v),
            (w[26] = h))
          : (h = w[26]),
        w[27] !== k.seconds || w[28] !== h
          ? ((f = (0, a.jsx)(Y, { value: A, label: h })),
            (w[27] = k.seconds),
            (w[28] = h),
            (w[29] = f))
          : (f = w[29]),
        w[30] !== p || w[31] !== b || w[32] !== f || w[33] !== u
          ? ((g = (0, a.jsxs)("div", {
              className: "flex gap-1.5",
              children: [u, p, b, f],
            })),
            (w[30] = p),
            (w[31] = b),
            (w[32] = f),
            (w[33] = u),
            (w[34] = g))
          : (g = w[34]),
        w[35] !== g || w[36] !== o
          ? ((y = (0, a.jsxs)("div", {
              className: "flex flex-col gap-2",
              "data-testid": "cup-countdown",
              children: [o, g],
            })),
            (w[35] = g),
            (w[36] = o),
            (w[37] = y))
          : (y = w[37]),
        y
      );
    };
  return { Countdown: ee, selectTarget, countdown };
}
