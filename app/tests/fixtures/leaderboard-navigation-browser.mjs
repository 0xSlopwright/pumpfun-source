// Standalone synthetic capability harness; this is not a product page or the
// original Next adapter. The navigation code under test is source-adapted.
import React, { useState, useSyncExternalStore } from "react";
import { createRoot } from "react-dom/client";
import { c as useMemoCache } from "react/compiler-runtime";
import { createLeaderboardNavigation } from "../../reconstruction/leaderboard-navigation/client.mjs";
const urlListeners = new Set(),
  liveListeners = new Set();
let live = false;
const notify = () => {
  for (const fn of urlListeners) fn();
};
addEventListener("popstate", notify);
const updateUrl = (params, options) => {
  history[options.history === "push" ? "pushState" : "replaceState"](
    {},
    "",
    `${location.pathname}${params.size ? "?" + params : ""}${location.hash}`,
  );
  notify();
};
function useUrlAdapter() {
  useSyncExternalStore(
    (fn) => {
      urlListeners.add(fn);
      return () => urlListeners.delete(fn);
    },
    () => location.search,
    () => "",
  );
  return {
    searchParams: new URLSearchParams(location.search),
    getSearchParamsSnapshot: () => new URLSearchParams(location.search),
    updateUrl,
  };
}
const navigation = createLeaderboardNavigation({
  useMemoCache,
  react: React,
  useUrlAdapter,
  window,
  navigator,
  location,
  performance,
  setTimeout,
  console,
  logDebug() {},
  logParseError() {},
  formatError: (code) => `synthetic-error-${code}`,
  useList(options) {
    if (options.isVisible !== false)
      throw Error("Expected exact original polling-disabled list call");
    const current = useSyncExternalStore(
      (fn) => {
        liveListeners.add(fn);
        return () => liveListeners.delete(fn);
      },
      () => live,
      () => false,
    );
    return { data: { live: current ? [{ kind: "person" }] : [] } };
  },
  hasLiveCompetition: (data, kind) =>
    data?.live.some((row) => row.kind === kind) ?? false,
});
const element = React.createElement;
function Mirror() {
  const { urlPeriod } = navigation.usePeriod();
  return element("output", { id: "mirror" }, urlPeriod ?? "null");
}
function App() {
  const tab = navigation.useTab(),
    period = navigation.usePeriod(),
    landing = navigation.useLanding("daily", "person", null),
    [desktop, setDesktop] = useState(false),
    [squads, setSquads] = useState(false);
  return element(
    "main",
    {},
    element(
      "output",
      { id: "state" },
      JSON.stringify({
        tab: tab.urlTab,
        period: period.urlPeriod,
        landing: landing.landing,
        timeframe: landing.timeframe,
        resolved: navigation.resolveTab({
          urlTab: tab.urlTab,
          isDesktop: desktop,
          squadsEnabled: squads,
        }),
        href: navigation.periodHref("cup"),
      }),
    ),
    element(
      "button",
      { id: "rewards", onClick: () => tab.setUrlTab("rewards") },
      "Rewards",
    ),
    element(
      "button",
      { id: "traders", onClick: () => tab.setUrlTab("traders") },
      "Traders",
    ),
    element(
      "button",
      { id: "weekly", onClick: () => period.setUrlPeriod("weekly") },
      "Weekly",
    ),
    element(
      "button",
      { id: "clear-period", onClick: () => period.setUrlPeriod(null) },
      "Clear period",
    ),
    element(
      "button",
      {
        id: "live",
        onClick: () => {
          live = !live;
          for (const fn of liveListeners) fn();
        },
      },
      "Toggle live Cup",
    ),
    element(
      "button",
      { id: "monthly", onClick: () => landing.setTimeframe("monthly") },
      "Manual monthly",
    ),
    element(
      "button",
      { id: "clear-landing", onClick: () => landing.setTimeframe(null) },
      "Clear manual period",
    ),
    element(
      "button",
      { id: "desktop", onClick: () => setDesktop((value) => !value) },
      "Toggle desktop",
    ),
    element(
      "button",
      { id: "squads-enabled", onClick: () => setSquads((value) => !value) },
      "Toggle squads",
    ),
    element(
      "button",
      {
        id: "external",
        onClick: () => {
          history.pushState(
            {},
            "",
            "?tab=callouts&period=monthly&other=stay#anchor",
          );
          dispatchEvent(new PopStateEvent("popstate"));
        },
      },
      "External history",
    ),
    element(Mirror),
  );
}
createRoot(document.getElementById("root")).render(element(App));
