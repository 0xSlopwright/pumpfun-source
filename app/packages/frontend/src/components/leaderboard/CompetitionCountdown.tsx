"use client";

import { useEffect, useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import {
  createCountdownModule,
  useMemoCache,
  type CompetitionTiming,
} from "./original-countdown.mjs";

// Explicit local English labels for the captured translation-key boundary.
// This does not recreate the upstream translation provider or locale selection.
const labels: Record<string, string> = {
  "web.leaderboard.cup.ends_in": "Ends in",
  "web.leaderboard.cup.starts_in": "Starts in",
  "web.leaderboard.cup.unit_days": "Days",
  "web.leaderboard.cup.unit_hours": "Hours",
  "web.leaderboard.cup.unit_minutes": "Minutes",
  "web.leaderboard.cup.unit_seconds": "Seconds",
};
function translate(key: string): string {
  const value = labels[key];
  if (value === undefined) throw new Error("Unsupported countdown label");
  return value;
}
const { Countdown, selectTarget } = createCountdownModule({
  jsx,
  jsxs,
  useMemoCache,
  useState,
  useEffect,
  useTranslation: () => ({ t: translate }),
  Date,
  setInterval: globalThis.setInterval.bind(globalThis),
  clearInterval: globalThis.clearInterval.bind(globalThis),
});

/** Local card adapter: pass documented DTO fields to the actual source selector. */
export function CompetitionCountdown({
  competition,
}: {
  competition?: CompetitionTiming | null;
}) {
  if (!competition) return null;
  const target = selectTarget(competition);
  if (!target) return null;
  return (
    <div className="mb-4">
      <Countdown target={target} />
    </div>
  );
}
