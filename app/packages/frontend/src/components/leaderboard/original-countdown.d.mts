import type { ComponentType } from "react";

export type CountdownTarget = { kind: "starts" | "ends"; atMs: number };
export type CompetitionTiming = {
  phase: string;
  startsAt: string | null;
  endsAt: string | null;
};
export function useMemoCache(size: number): unknown[];
export function createCountdownModule(capabilities: {
  jsx: typeof import("react/jsx-runtime").jsx;
  jsxs: typeof import("react/jsx-runtime").jsxs;
  useMemoCache: typeof useMemoCache;
  useState: typeof import("react").useState;
  useEffect: typeof import("react").useEffect;
  useTranslation: () => { t: (key: string) => string };
  Date: Pick<DateConstructor, "now" | "parse">;
  setInterval: typeof globalThis.setInterval;
  clearInterval: typeof globalThis.clearInterval;
}): {
  Countdown: ComponentType<{ target: CountdownTarget }>;
  selectTarget: (competition: CompetitionTiming) => CountdownTarget | null;
  countdown: (
    atMs: number,
    nowMs: number,
  ) => {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
};
