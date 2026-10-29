import assert from "node:assert/strict";
import { test } from "node:test";
import {
  mkdtemp,
  mkdir,
  readFile,
  writeFile,
  copyFile,
  rm,
} from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";
import React from "../packages/frontend/node_modules/react/index.js";
import {
  jsx,
  jsxs,
} from "../packages/frontend/node_modules/react/jsx-runtime.js";
import { renderToStaticMarkup } from "../packages/frontend/node_modules/react-dom/server.node.js";
import {
  createCountdownModule,
  useMemoCache,
} from "../packages/frontend/src/components/leaderboard/original-countdown.mjs";
import { verifyCompetitionCountdown } from "../scripts/original-competition-countdown.mjs";
const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const labels = {
  "web.leaderboard.cup.starts_in": "Starts in",
  "web.leaderboard.cup.ends_in": "Ends in",
  "web.leaderboard.cup.unit_days": "Days",
  "web.leaderboard.cup.unit_hours": "Hours",
  "web.leaderboard.cup.unit_minutes": "Minutes",
  "web.leaderboard.cup.unit_seconds": "Seconds",
};
function module(now = 0) {
  return createCountdownModule({
    jsx,
    jsxs,
    useMemoCache,
    useState: React.useState,
    useEffect: React.useEffect,
    useTranslation: () => ({ t: (key) => labels[key] }),
    Date: { parse: Date.parse, now: () => now },
    setInterval() {
      throw Error("SSR must not schedule an effect");
    },
    clearInterval() {
      throw Error("SSR must not clear an interval");
    },
  });
}
test("complete original React components/selectors and actual hero/DTO witnesses are authenticated", async () => {
  const c = await verifyCompetitionCountdown();
  assert.equal(c.component.retainedAsts.length, 6);
  assert.ok(
    c.witnesses.some(
      (row) => row.label === "complete countdown DISPLAY component",
    ),
  );
  assert.ok(
    c.witnesses.some((row) => row.label.includes("actual hero uses $.H")),
  );
  assert.ok(c.witnesses.some((row) => row.label.includes("DTO startsAt")));
  assert.ok(c.witnesses.every((row) => row.sha256 && row.utf16 && row.utf8));
});
test("source gate rejects changed DISPLAY code and independent provenance drift", async (t) => {
  const temp = await mkdtemp(path.join(os.tmpdir(), "countdown-source-"));
  t.after(() => rm(temp, { recursive: true, force: true }));
  const c = JSON.parse(
    await readFile(
      path.join(APP, "reconstruction/competition-countdown/contract.json"),
    ),
  );
  const names = new Set([
    "scripts/original-contracts/source.mjs",
    "evidence/web/manifest.json",
    "recovered/modules.json",
    ...c.source.selectedIndexEntries.flatMap((row) =>
      row.origins.map((origin) => origin.source),
    ),
    c.component.path,
    c.maintainedBefore.path,
    "reconstruction/competition-countdown/contract.json",
  ]);
  for (const name of names) {
    const out = path.join(temp, name);
    await mkdir(path.dirname(out), { recursive: true });
    await copyFile(path.join(APP, name), out);
  }
  const file = path.join(temp, c.component.path),
    original = await readFile(file, "utf8");
  assert.ok(original.includes("setInterval(() => _(Date.now()), 1e3)"));
  await writeFile(
    file,
    original.replace(
      "setInterval(() => _(Date.now()), 1e3)",
      "setInterval(() => _(Date.now()), 2e3)",
    ),
  );
  await assert.rejects(
    verifyCompetitionCountdown(temp),
    /component AST differs/,
  );
  await writeFile(file, original);
  const doc = path.join(
    temp,
    "reconstruction/competition-countdown/contract.json",
  );
  await writeFile(doc, JSON.stringify({ ...c, behavior: {} }, null, 2) + "\n");
  await assert.rejects(
    verifyCompetitionCountdown(temp),
    /source contract differs/,
  );
});
test("actual phase mapping passes source date strings unchanged and omits unknown/missing/invalid/ended targets", () => {
  const { selectTarget } = module(),
    startsAt = "2030-01-01T00:00:00Z",
    endsAt = "2030-02-01T00:00:00Z";
  for (const phase of ["upcoming", "registration"])
    assert.deepEqual(selectTarget({ phase, startsAt, endsAt }), {
      kind: "starts",
      atMs: Date.parse(startsAt),
    });
  assert.deepEqual(selectTarget({ phase: "live", startsAt, endsAt }), {
    kind: "ends",
    atMs: Date.parse(endsAt),
  });
  for (const phase of ["ended", "unknown", "LIVE", ""])
    assert.equal(selectTarget({ phase, startsAt, endsAt }), null);
  for (const endsAt of [null, "invalid-date"])
    assert.equal(selectTarget({ phase: "live", startsAt, endsAt }), null);
  assert.equal(
    selectTarget({ phase: "upcoming", startsAt: null, endsAt }),
    null,
  );
});
test("countdown preserves floor/zero clamp and exact day/hour/minute/second projection", () => {
  const { countdown } = module();
  assert.deepEqual(countdown(90061999, 0), {
    days: 1,
    hours: 1,
    minutes: 1,
    seconds: 1,
  });
  assert.deepEqual(countdown(999, 0), {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  assert.deepEqual(countdown(-1, 0), {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  assert.deepEqual(countdown(0, 1000), {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
});
test("real React server render retains complete digit boxes/labels and schedules no timer", () => {
  const { Countdown } = module(0);
  const html = renderToStaticMarkup(
    React.createElement(Countdown, {
      target: { kind: "starts", atMs: 90061000 },
    }),
  );
  assert.ok(html.includes('data-testid="cup-countdown"'));
  for (const label of ["Starts in", "Days", "Hours", "Minutes", "Seconds"])
    assert.ok(html.includes(label));
  assert.equal((html.match(/>01<\/span>/g) ?? []).length, 4);
  const expired = renderToStaticMarkup(
    React.createElement(Countdown, { target: { kind: "ends", atMs: -1 } }),
  );
  assert.ok(expired.includes("Ends in"));
  assert.equal((expired.match(/>00<\/span>/g) ?? []).length, 4);
});
