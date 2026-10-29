import React, { createContext, useContext, useState } from "react";
import { createRoot } from "react-dom/client";
import { createCompetitionPrizeComponents } from "../../packages/frontend/src/components/leaderboard/CompetitionPrizeDisplay.tsx";
import { prizeNumberVariants } from "../../packages/frontend/src/components/leaderboard/original-prize-formats.mjs";

const translations = createContext(null);
function translate(key, values = {}) {
  switch (key) {
    case "web.leaderboard.cup.tier_single":
      return `fixture-single:${values.rank}`;
    case "web.leaderboard.cup.tier_range":
      return `fixture-range:${values.from}/${values.to}`;
    case "web.leaderboard.cup.tier_each":
      return `fixture-each:${values.amount}`;
    default:
      throw Error("Unexpected fixture translation key");
  }
}
const selected = new URL(location.href).searchParams.get("source"),
  variant = prizeNumberVariants.find((row) => row.sha256 === selected);
if (!variant) throw Error("Explicit reviewed source context required");
const { PrizeTier, PrizeHeading, RankPrize } = createCompetitionPrizeComponents(
  {
    numberVariant: variant.sha256,
    useTranslation: () => useContext(translations),
  },
);
function App() {
  const [prizes, setPrizes] = useState(null),
    [language, setLanguage] = useState("en-US"),
    [error, setError] = useState(false);
  async function load(kind) {
    setPrizes(null);
    setError(false);
    const response = await fetch(`/fixture/${kind}`);
    if (!response.ok) {
      setError(true);
      return;
    }
    setPrizes(await response.json());
  }
  return React.createElement(
    translations.Provider,
    { value: { t: translate, i18n: { language } } },
    React.createElement(
      "main",
      { style: { maxWidth: 640, margin: "0 auto", padding: 16 } },
      React.createElement("h1", {}, "Original prize renderer — synthetic host"),
      React.createElement(
        "p",
        {},
        "Provided props and labels; no competition, rank calculation or payout.",
      ),
      React.createElement(
        "button",
        { id: "load", onClick: () => load("valid") },
        "Load fixture",
      ),
      React.createElement(
        "button",
        { id: "invalid", onClick: () => load("invalid") },
        "Reject invalid fixture",
      ),
      React.createElement(
        "button",
        { id: "locale", onClick: () => setLanguage("de-DE") },
        "Use German number format",
      ),
      React.createElement(
        "button",
        {
          id: "clear",
          onClick: () => {
            setPrizes(null);
            setError(false);
          },
        },
        "Clear",
      ),
      error
        ? React.createElement(
            "p",
            { role: "alert" },
            "Fixture admission failed",
          )
        : null,
      prizes
        ? React.createElement(
            "section",
            {
              id: "display",
              className: "rounded-xl border border-border-primary",
            },
            React.createElement(PrizeHeading, {
              title: "caller-provided-title",
              isCardTop: true,
            }),
            ...prizes.map((prize) =>
              React.createElement(PrizeTier, { key: prize.rankFrom, prize }),
            ),
            ...Array.from({ length: 7 }, (_, rank) =>
              React.createElement(
                "div",
                {
                  key: `rank-${rank}`,
                  "data-rank": rank,
                  className: "flex justify-between px-4 py-2",
                },
                React.createElement("span", {}, `caller-rank:${rank}`),
                React.createElement(RankPrize, { prizes, rank }),
              ),
            ),
          )
        : React.createElement("p", { id: "empty" }, "No props supplied"),
    ),
  );
}
createRoot(document.getElementById("root")).render(React.createElement(App));
