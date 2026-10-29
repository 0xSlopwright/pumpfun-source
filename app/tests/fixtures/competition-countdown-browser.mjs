import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { CompetitionCards } from "product-cards";
const epoch = Date.parse("2030-05-01T00:00:00.000Z"),
  iso = (delta) => new Date(epoch + delta).toISOString();
const template = {
  kind: "person",
  description: "Synthetic local timer fixture; no actual competition or funds.",
  prizeCopy: "No prize",
  registrationOpensAt: null,
  registrationClosesAt: null,
  maxEntries: 10,
  entriesCount: 0,
  participants: 0,
  joinable: false,
  isFinal: false,
};
const entries = [
  ["live", "live", iso(0), iso(90061000)],
  ["upcoming", "upcoming", iso(65000), iso(900000)],
  ["registration", "registration", iso(5000), iso(900000)],
  ["expired", "live", iso(-100000), iso(-1)],
  ["ended", "ended", iso(-100000), iso(-1)],
  ["unknown", "unknown", iso(5000), iso(900000)],
  ["missing", "live", iso(0), null],
  ["invalid", "live", iso(0), "not-a-date"],
].map(([id, phase, startsAt, endsAt]) => ({
  ...template,
  id,
  slug: id,
  title: `Synthetic ${id}`,
  phase,
  startsAt,
  endsAt,
}));
function App() {
  const [loaded, setLoaded] = useState(false);
  return React.createElement(
    "main",
    { style: { maxWidth: 1000, margin: "0 auto", padding: 16 } },
    React.createElement("h1", {}, "Maintained competition-card timer fixture"),
    React.createElement(
      "button",
      { id: "load", onClick: () => setLoaded(true) },
      "Load synthetic cards",
    ),
    React.createElement(
      "button",
      { id: "clear", onClick: () => setLoaded(false) },
      "Clear cards",
    ),
    loaded
      ? React.createElement(CompetitionCards, {
          competitions: entries,
          detailHref: (competition) => `#${competition.id}`,
        })
      : React.createElement("p", { id: "loading" }, "Loading synthetic cards"),
  );
}
createRoot(document.getElementById("root")).render(React.createElement(App));
