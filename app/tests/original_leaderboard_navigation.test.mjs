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
import { createLeaderboardNavigation } from "../reconstruction/leaderboard-navigation/client.mjs";
import { verifyLeaderboardNavigation } from "../scripts/original-leaderboard-navigation.mjs";
const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// A deterministic capability driver, not a React/Next implementation. Separate
// browser qualification uses genuine React hooks and standard History APIs.
function hooks() {
  const components = new Map();
  let current, index, effects;
  const slot = (init) => {
    const key = index++;
    if (!(key in current.slots)) current.slots[key] = init();
    return [current, key];
  };
  const same = (a, b) =>
    a &&
    b &&
    a.length === b.length &&
    a.every((value, i) => Object.is(value, b[i]));
  const react = {
    useRef(value) {
      const [c, i] = slot(() => ({ current: value }));
      return c.slots[i];
    },
    useState(init) {
      const [c, i] = slot(() => (typeof init === "function" ? init() : init));
      if (!c.setters[i])
        c.setters[i] = (value) => {
          c.slots[i] = typeof value === "function" ? value(c.slots[i]) : value;
        };
      return [c.slots[i], c.setters[i]];
    },
    useEffect(fn, deps) {
      const [c, i] = slot(() => ({}));
      const previous = c.slots[i];
      if (!same(previous.deps, deps))
        effects.push(() => {
          previous.cleanup?.();
          previous.cleanup = fn();
          previous.deps = deps;
        });
    },
    useCallback(fn, deps) {
      const [c, i] = slot(() => ({}));
      if (!same(c.slots[i].deps, deps)) c.slots[i] = { value: fn, deps };
      return c.slots[i].value;
    },
  };
  return {
    react,
    useMemoCache(size) {
      const [c, i] = slot(() =>
        Array(size).fill(Symbol.for("react.memo_cache_sentinel")),
      );
      assert.equal(c.slots[i].length, size);
      return c.slots[i];
    },
    render(key, fn) {
      if (!components.has(key)) components.set(key, { slots: [], setters: [] });
      current = components.get(key);
      index = 0;
      effects = [];
      const result = fn();
      for (const effect of effects) effect();
      return result;
    },
    unmount(key) {
      for (const slot of components.get(key)?.slots ?? []) slot?.cleanup?.();
      components.delete(key);
    },
  };
}
function clock() {
  let now = 1000,
    id = 0;
  const tasks = [];
  return {
    performance: { now: () => now },
    setTimeout(fn, delay = 0) {
      tasks.push({ id: ++id, at: now + delay, fn });
      return id;
    },
    runAll() {
      let count = 0;
      while (tasks.length) {
        assert.ok(count++ < 100, "bounded timer drain");
        tasks.sort((a, b) => a.at - b.at || a.id - b.id);
        const task = tasks.shift();
        now = task.at;
        task.fn();
      }
    },
    advance(ms) {
      const target = now + ms;
      while (tasks.some((task) => task.at <= target)) {
        tasks.sort((a, b) => a.at - b.at || a.id - b.id);
        const task = tasks.shift();
        now = task.at;
        task.fn();
      }
      now = target;
    },
    get pending() {
      return tasks.length;
    },
    get now() {
      return now;
    },
  };
}
function harness({
  search = "",
  safari,
  failUpdate,
  rateLimitFactor = 1,
} = {}) {
  const react = hooks(),
    timer = clock();
  let url = new URL(`http://localhost/leaderboard${search}`),
    listData;
  const updates = [],
    logs = [];
  const adapter = {
    searchParams: new URLSearchParams(url.search),
    rateLimitFactor,
    getSearchParamsSnapshot: () => new URLSearchParams(url.search),
    updateUrl(params, options) {
      updates.push({
        params: new URLSearchParams(params),
        options,
        at: timer.now,
      });
      if (failUpdate) throw failUpdate;
      url.search = params.toString();
      adapter.searchParams = new URLSearchParams(url.search);
    },
  };
  const client = createLeaderboardNavigation({
    ...react,
    ...timer,
    react: react.react,
    useUrlAdapter: () => adapter,
    logDebug: (...args) => logs.push(args),
    logParseError: (...args) => logs.push(args),
    formatError: (code) => `error-${code}`,
    console: { error: (...args) => logs.push(args) },
    window: safari ? { GestureEvent: true } : undefined,
    navigator: { userAgent: safari },
    location: {
      get search() {
        return url.search;
      },
    },
    useList(options) {
      assert.equal(options.isVisible, false);
      return { data: listData };
    },
    hasLiveCompetition: (data, kind) =>
      data?.live.some((entry) => entry.kind === kind) ?? false,
  });
  return {
    ...react,
    ...timer,
    client,
    adapter,
    updates,
    logs,
    get url() {
      return url;
    },
    external(search) {
      url.search = search;
      adapter.searchParams = new URLSearchParams(url.search);
    },
    list(data) {
      listData = data;
    },
  };
}

test("source gate authenticates complete used queue/hooks and actual leaderboard consumers", async () => {
  const c = await verifyLeaderboardNavigation();
  assert.equal(c.adapters.length, 4);
  assert.equal(c.adapters[0].retainedAsts.length, 14);
  assert.ok(
    c.witnesses.some((row) =>
      row.label.includes("actual trader board consumes"),
    ),
  );
  assert.ok(c.witnesses.every((row) => row.sha256 && row.utf16 && row.utf8));
});
test("maintained URL queue and provenance drift are independently rejected", async (t) => {
  const temporary = await mkdtemp(
    path.join(os.tmpdir(), "leaderboard-nav-source-"),
  );
  t.after(() => rm(temporary, { recursive: true, force: true }));
  const c = JSON.parse(
    await readFile(
      path.join(APP, "reconstruction/leaderboard-navigation/contract.json"),
    ),
  );
  const names = new Set([
    "scripts/original-contracts/source.mjs",
    "evidence/web/manifest.json",
    "recovered/modules.json",
    ...c.source.selectedIndexEntries.flatMap((row) =>
      row.origins.map((origin) => origin.source),
    ),
    ...c.adapters.map(
      (row) => "reconstruction/leaderboard-navigation/" + row.path,
    ),
    "reconstruction/leaderboard-navigation/client.mjs",
    "reconstruction/leaderboard-navigation/contract.json",
  ]);
  for (const name of names) {
    const out = path.join(temporary, name);
    await mkdir(path.dirname(out), { recursive: true });
    await copyFile(path.join(APP, name), out);
  }
  const file = path.join(
      temporary,
      "reconstruction/leaderboard-navigation/query-state.mjs",
    ),
    original = await readFile(file, "utf8");
  assert.ok(original.includes('history: "replace"'));
  await writeFile(
    file,
    original.replace('history: "replace"', 'history: "push"'),
  );
  await assert.rejects(
    verifyLeaderboardNavigation(temporary),
    /maintained AST differs/,
  );
  await writeFile(file, original);
  const document = path.join(
    temporary,
    "reconstruction/leaderboard-navigation/contract.json",
  );
  await writeFile(
    document,
    JSON.stringify({ ...c, scope: "changed" }, null, 2) + "\n",
  );
  await assert.rejects(
    verifyLeaderboardNavigation(temporary),
    /source contract differs/,
  );
});
test("period enum/server parser preserve first value, strict options, defaults and exact link interpolation", () => {
  const h = harness(),
    p = h.client.parseEnum(["daily", "weekly"]);
  assert.equal(p.parse("weekly"), "weekly");
  assert.equal(p.parse("Weekly"), null);
  assert.equal(p.parseServerSide(["weekly", "daily"]), "weekly");
  assert.equal(p.parseServerSide([undefined, "daily"]), null);
  assert.equal(p.withDefault("daily").parseServerSide("invalid"), "daily");
  assert.equal(p.withOptions({ throttleMs: 100 }).throttleMs, 100);
  assert.equal(h.client.periodHref("cup"), "/leaderboard?period=cup");
  assert.equal(
    h.client.periodHref("daily&x=1"),
    "/leaderboard?period=daily&x=1",
  );
});
test("real URLSearchParams tab+period flow batches, removes default traders and preserves unrelated keys/hash", async () => {
  const h = harness({ search: "?tab=rewards&period=weekly&other=stay#anchor" });
  let state = h.render("page", () => ({
    ...h.client.useTab(),
    ...h.client.usePeriod(),
  }));
  assert.equal(state.urlTab, "rewards");
  assert.equal(state.urlPeriod, "weekly");
  const first = state.setUrlTab("traders"),
    second = state.setUrlPeriod("monthly");
  assert.equal(first, second);
  assert.equal(h.updates.length, 0);
  state = h.render("page", () => ({
    ...h.client.useTab(),
    ...h.client.usePeriod(),
  }));
  assert.equal(state.urlTab, null);
  assert.equal(state.urlPeriod, "monthly");
  h.runAll();
  await first;
  assert.equal(h.url.search, "?period=monthly&other=stay");
  assert.equal(h.url.hash, "#anchor");
  assert.deepEqual(h.updates[0].options, {
    history: "replace",
    scroll: false,
    shallow: true,
  });
});
test("same-key hooks synchronize immediately; external URL changes parse after effect and cleanup unsubscribes", async () => {
  const h = harness({ search: "?period=daily" });
  const a = h.render("a", () => h.client.usePeriod()),
    b = h.render("b", () => h.client.usePeriod());
  assert.equal(a.urlPeriod, "daily");
  assert.equal(b.urlPeriod, "daily");
  const pending = a.setUrlPeriod("cup");
  assert.equal(h.render("b", () => h.client.usePeriod()).urlPeriod, "cup");
  h.runAll();
  await pending;
  h.external("?period=invalid");
  h.render("b", () => h.client.usePeriod());
  assert.equal(h.render("b", () => h.client.usePeriod()).urlPeriod, null);
  h.unmount("b");
  const next = h
    .render("a", () => h.client.usePeriod())
    .setUrlPeriod("monthly");
  h.runAll();
  await next;
  assert.equal(h.url.search, "?period=monthly");
});
test("single-query functional updates, default clearing and invalid read/write distinction remain exact", async () => {
  const h = harness({ search: "?x=daily" }),
    parser = h.client.parseEnum(["daily", "weekly"]).withDefault("daily");
  let value = h.render("x", () => h.client.useQueryState("x", parser));
  const first = value[1]((current) =>
    current === "daily" ? "weekly" : "daily",
  );
  h.runAll();
  await first;
  assert.equal(h.url.search, "?x=weekly");
  value = h.render("x", () => h.client.useQueryState("x", parser));
  const clear = value[1]("daily");
  h.runAll();
  await clear;
  assert.equal(h.url.search, "");
  value = h.render("x", () => h.client.useQueryState("x", parser));
  assert.equal(value[0], "daily");
  const invalid = value[1]("not-an-enum");
  h.runAll();
  await invalid;
  assert.equal(h.url.search, "?x=not-an-enum");
  assert.equal(
    h.render("x", () => h.client.useQueryState("x", parser))[0],
    "not-an-enum",
  );
});
test("throttle uses actual used queue timing and combines push/scroll/nonshallow plus transitions", async () => {
  const h = harness();
  const [_, set] = h.render("one", () => h.client.useQueryState("one"));
  const first = set("a");
  h.runAll();
  await first;
  const transitions = [];
  const pending = set("b", {
    history: "push",
    scroll: true,
    shallow: false,
    startTransition: (fn) => {
      transitions.push("first");
      fn();
    },
  });
  const [, other] = h.render("two", () => h.client.useQueryState("two"));
  const same = other("c", {
    startTransition: (fn) => {
      transitions.push("second");
      fn();
    },
  });
  assert.equal(pending, same);
  h.advance(0);
  assert.equal(h.updates.length, 1);
  h.advance(49);
  assert.equal(h.updates.length, 1);
  h.advance(1);
  await pending;
  assert.deepEqual(h.updates[1].options, {
    history: "push",
    scroll: true,
    shallow: false,
  });
  assert.deepEqual(transitions, ["first", "second"]);
  assert.equal(h.updates[1].at - h.updates[0].at, 50);
});
test("Safari throttle thresholds and adapter rate-limit factor preserve observed constructor semantics", async () => {
  for (const [safari, delay, factor] of [
    ["Version/17.1 Safari", 120, 1],
    ["Version/16.5 Safari", 320, 1],
    ["not a Safari version", 320, 1],
    [undefined, 50, 2],
  ]) {
    const h = harness({ safari, rateLimitFactor: factor });
    const [, set] = h.render("x", () => h.client.useQueryState("x"));
    const first = set("a");
    h.runAll();
    await first;
    const next = set("b");
    h.advance(0);
    h.advance(delay * factor - 1);
    assert.equal(h.updates.length, 1);
    h.advance(1);
    await next;
    assert.equal(h.updates.length, 2);
  }
});
test("Infinity throttle resolves without flushing; next finite update drains retained values", async () => {
  const h = harness();
  const [, set] = h.render("x", () => h.client.useQueryState("x"));
  const paused = set("retained", { throttleMs: Infinity });
  assert.equal((await paused).get("x"), null);
  assert.equal(h.updates.length, 0);
  h.runAll();
  const [, setY] = h.render("y", () => h.client.useQueryState("y"));
  const next = setY("now");
  h.runAll();
  await next;
  assert.equal(h.url.search, "?x=retained&y=now");
});
test("adapter throw preserves original rejected URLSearchParams value and logs exact error capability", async () => {
  const failure = Error("synthetic adapter error"),
    h = harness({ failUpdate: failure });
  const [, set] = h.render("x", () => h.client.useQueryState("x"));
  const pending = set("a"),
    check = assert.rejects(
      pending,
      (error) => error instanceof URLSearchParams && error.get("x") === "a",
    );
  h.runAll();
  await check;
  assert.ok(h.logs.some((row) => row[0] === "error-429" && row[2] === failure));
  assert.equal(h.url.search, "");
});
test("parser exceptions become null through explicit diagnostics; missing/duplicate URL reads use original first-value semantics", () => {
  const h = harness({ search: "?x=first&x=second" });
  assert.equal(h.render("x", () => h.client.useQueryState("x"))[0], "first");
  assert.equal(
    h.render("bad", () =>
      h.client.useQueryState("bad", {
        parse() {
          throw Error("synthetic parse");
        },
      }),
    )[0],
    null,
  );
  h.external("?bad=value");
  h.render("bad", () =>
    h.client.useQueryState("bad", {
      parse() {
        throw Error("synthetic parse");
      },
    }),
  );
  assert.equal(
    h.render("bad", () =>
      h.client.useQueryState("bad", {
        parse() {
          throw Error("synthetic parse");
        },
      }),
    )[0],
    null,
  );
  assert.ok(
    h.logs.some((row) => String(row[0]).includes("Error while parsing")),
  );
});
test("source page fallback keeps squads flag and desktop callouts independent of stored URL choice", () => {
  const { client } = harness();
  assert.equal(
    client.resolveTab({ urlTab: null, squadsEnabled: false, isDesktop: false }),
    "traders",
  );
  assert.equal(
    client.resolveTab({
      urlTab: "squads",
      squadsEnabled: false,
      isDesktop: false,
    }),
    "traders",
  );
  assert.equal(
    client.resolveTab({
      urlTab: "squads",
      squadsEnabled: true,
      isDesktop: true,
    }),
    "squads",
  );
  assert.equal(
    client.resolveTab({
      urlTab: "callouts",
      squadsEnabled: true,
      isDesktop: true,
    }),
    "traders",
  );
  assert.equal(
    client.resolveTab({
      urlTab: "callouts",
      squadsEnabled: false,
      isDesktop: false,
    }),
    "callouts",
  );
  assert.equal(
    client.resolveTab({
      urlTab: "rewards",
      squadsEnabled: false,
      isDesktop: true,
    }),
    "rewards",
  );
});
test("live-Cup landing updates with returned buckets until an explicit timeframe is selected or cleared", () => {
  const h = harness();
  let value = h.render("landing", () =>
    h.client.useLanding("daily", "person", null),
  );
  assert.equal(value.timeframe, "daily");
  h.list({ live: [{ kind: "person" }] });
  value = h.render("landing", () =>
    h.client.useLanding("daily", "person", null),
  );
  assert.equal(value.landing, "cup");
  assert.equal(value.timeframe, "cup");
  value.setTimeframe("weekly");
  value = h.render("landing", () =>
    h.client.useLanding("daily", "person", null),
  );
  assert.equal(value.timeframe, "weekly");
  h.list({ live: [] });
  value = h.render("landing", () =>
    h.client.useLanding("daily", "person", null),
  );
  assert.equal(value.landing, "daily");
  assert.equal(value.timeframe, "weekly");
  value.setTimeframe(null);
  assert.equal(
    h.render("landing", () => h.client.useLanding("daily", "person", null))
      .timeframe,
    "daily",
  );
  assert.equal(
    h.render("initial", () => h.client.useLanding("daily", "person", "monthly"))
      .timeframe,
    "monthly",
  );
});
