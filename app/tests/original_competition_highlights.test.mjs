import assert from "node:assert/strict";
import { test } from "node:test";
import { createServer } from "node:http";
import { once } from "node:events";
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
import { createCompetitionHighlights } from "../reconstruction/competition-highlights/client.mjs";
import { verifyCompetitionHighlights } from "../scripts/original-competition-highlights.mjs";
const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOL = 0x536f6c4d;
// Explicit synthetic key/query capabilities. The actual original key expressions
// are independently witnessed; these providers do not implement React/TanStack.
const keys = {
  highlights: (id, entry) => ["competitions", "highlights", id, entry],
  entry: (id, entry) => ["competitions", "entry", id, entry],
  highlightMedia: (wallet) => ["competitions", "highlight-media", wallet],
};
const person = (id, extra = {}) => ({
  entryId: id,
  kind: "person",
  rank: 1,
  walletAddress: `wallet-${id}`,
  username: id,
  profileImageUrl: `synthetic-avatar-${id}`,
  pnlUsd: 100,
  topPositions: [{ chainId: SOL, mint: `fallback-${id}` }],
  ...extra,
});
const group = (id, extra = {}) => ({
  entryId: id,
  kind: "group",
  rank: 1,
  username: id,
  pnlUsd: 100,
  ...extra,
});
const leg = (mint = "mint", extra = {}) => ({
  chainId: SOL,
  mint,
  pnlUsd: 20,
  buySpendUsd: 2,
  ...extra,
});
const state = (data) => ({ isPending: false, data });
function projection({
  reels = {},
  rosters = {},
  media = {},
  statuses = {},
} = {}) {
  const calls = [];
  const client = createCompetitionHighlights({
    keys,
    useClientServerContract: () => async () => undefined,
    fetch() {
      throw Error("No direct fetch expected");
    },
    queueMicrotask() {
      throw Error("No task expected");
    },
    useQueries(options) {
      calls.push(options);
      return options.combine(
        options.queries.map((query) => {
          const [, kind, id, entry] = query.queryKey;
          const key = kind === "highlight-media" ? id : entry;
          return (
            statuses[`${kind}:${key}`] ??
            state(
              (kind === "entry"
                ? rosters
                : kind === "highlights"
                  ? reels
                  : media)[key],
            )
          );
        }),
      );
    },
  });
  return {
    client,
    calls,
    render: (entries, competitionId = "cup") =>
      client.useHighlights({ competitionId, entries }),
  };
}
async function server(t, handle) {
  const http = createServer(handle);
  http.listen(0, "127.0.0.1");
  await once(http, "listening");
  t.after(async () => {
    const closed = new Promise((resolve) => http.close(resolve));
    http.closeAllConnections();
    await closed;
  });
  return `http://127.0.0.1:${http.address().port}`;
}

test("complete used workflow/helper ASTs and actual consumer/route witnesses are authenticated", async () => {
  const contract = await verifyCompetitionHighlights();
  assert.equal(contract.adapter.retainedAsts.length, 11);
  assert.deepEqual(contract.factory.ids, [590407]);
  assert.equal(contract.dependencies.length, 3);
  assert.ok(
    contract.witnesses.some(
      (row) =>
        row.label === "actual e3 component invokes the retained data workflow",
    ),
  );
  assert.ok(
    contract.witnesses.every(
      (row) => row.sha256 && row.sourceSha256 && row.utf16 && row.utf8,
    ),
  );
});
test("source gate rejects client projection drift and independent contract drift", async (t) => {
  const temporary = await mkdtemp(
    path.join(os.tmpdir(), "competition-highlights-source-"),
  );
  t.after(() => rm(temporary, { recursive: true, force: true }));
  const contract = JSON.parse(
    await readFile(
      path.join(APP, "reconstruction/competition-highlights/contract.json"),
    ),
  );
  const names = new Set([
    "scripts/original-contracts/source.mjs",
    "evidence/web/manifest.json",
    "recovered/modules.json",
    ...contract.source.selectedIndexEntries.flatMap((row) =>
      row.origins.map((origin) => origin.source),
    ),
    "reconstruction/competition-highlights/client.mjs",
    "reconstruction/competition-highlights/contract.json",
  ]);
  for (const name of names) {
    const out = path.join(temporary, name);
    await mkdir(path.dirname(out), { recursive: true });
    await copyFile(path.join(APP, name), out);
  }
  const file = path.join(
      temporary,
      "reconstruction/competition-highlights/client.mjs",
    ),
    original = await readFile(file, "utf8");
  assert.ok(original.includes("0.1 * t"));
  await writeFile(file, original.replace("0.1 * t", "0.2 * t"));
  await assert.rejects(
    verifyCompetitionHighlights(temporary),
    /maintained AST differs/,
  );
  await writeFile(file, original);
  const document = path.join(
    temporary,
    "reconstruction/competition-highlights/contract.json",
  );
  await writeFile(
    document,
    JSON.stringify({ ...contract, behavior: {} }, null, 2) + "\n",
  );
  await assert.rejects(
    verifyCompetitionHighlights(temporary),
    /source contract differs/,
  );
});
test("actual request plans preserve rank/wallet filters, person10/group5 caps, params, keys, signals and stale times", async () => {
  const seen = [];
  const h = projection(); // Replace only the explicit contract provider in this capture harness.
  const plans = [];
  const client = createCompetitionHighlights({
    keys,
    useClientServerContract:
      () =>
      async (...args) => {
        seen.push(args);
        return {};
      },
    useQueries(options) {
      plans.push(options);
      return options.combine(options.queries.map(() => ({ isPending: true })));
    },
  });
  const entries = [
    person("unranked", { rank: 0 }),
    person("null-wallet", { walletAddress: null }),
    ...Array.from({ length: 12 }, (_, i) => person(`p${i}`)),
    ...Array.from({ length: 7 }, (_, i) => group(`g${i}`)),
  ];
  assert.deepEqual(
    client.useHighlights({ competitionId: "cup-id", entries }),
    [],
  );
  assert.deepEqual(
    plans.map((plan) => plan.queries.length),
    [10, 5, 5, 0],
  );
  const controller = new AbortController();
  for (const plan of plans.slice(0, 3))
    for (const query of plan.queries) {
      assert.equal(query.staleTime, 60000);
      await query.queryFn({ signal: controller.signal });
    }
  assert.equal(seen.length, 20);
  assert.ok(
    seen.every(
      ([, options]) =>
        options.signal === controller.signal && options.params.id === "cup-id",
    ),
  );
  assert.equal(
    seen.filter(([operation]) => operation.endsWith("/highlights")).length,
    15,
  );
  assert.ok(
    seen
      .filter(([operation]) => operation.endsWith("/highlights"))
      .every(([, options]) => options.query.limit === 10),
  );
  assert.deepEqual(plans[2].queries[0].queryKey, [
    "competitions",
    "entry",
    "cup-id",
    "g0",
  ]);
  assert.equal(plans[3].queries.length, 0);
  assert.equal(h.calls.length, 0);
});
test("pending truncates each person/group prefix; settled missing/error data becomes null without blocking later rows", () => {
  const rows = [person("a"), person("b"), person("c")];
  const h = projection({
    statuses: {
      "highlights:a": state(undefined),
      "highlights:b": { isPending: true },
    },
    media: {},
  });
  assert.deepEqual(
    h.render(rows).map((row) => row.key),
    ["a"],
  );
  const done = projection({
    statuses: {
      "highlights:a": state(undefined),
      "highlights:b": { isPending: false, error: Error("synthetic") },
    },
  });
  assert.deepEqual(
    done.render(rows).map((row) => row.key),
    ["a", "b", "c"],
  );
  const groups = [group("one"), group("two")];
  const g = projection({
    reels: { one: { tokens: [] }, two: { tokens: [] } },
    statuses: { "entry:one": { isPending: true } },
    rosters: { two: { members: [] } },
  });
  assert.deepEqual(g.render(groups), []);
});
test("person selection preserves first positive Solana leg, inclusive contribution threshold and raw coin fields", () => {
  const row = person("a");
  const h = projection({
    reels: {
      a: {
        tokens: [
          leg("first", { pnlUsd: 10, buySpendUsd: -2.5 }),
          leg("larger", { pnlUsd: 80 }),
        ],
      },
    },
  });
  const [out] = h.render([row]);
  assert.equal(out.mint, "first");
  assert.deepEqual(out.coinPnl, { pnlUsd: 10, buySpendUsd: -2.5 });
  assert.equal(out.pnlUsd, 100);
  assert.equal(row.topPositions[0].mint, "fallback-a");
  const blocked = projection({
    reels: {
      a: {
        tokens: [
          leg("other-chain", { chainId: 1, pnlUsd: 50 }),
          leg("below", { pnlUsd: 9 }),
          leg("later", { pnlUsd: 80 }),
        ],
      },
    },
  });
  assert.deepEqual(blocked.render([row]), []); // first positive Solana leg is below threshold; no replacement search.
  const fallback = projection({
    reels: { a: { tokens: [leg("below", { pnlUsd: 9 })] } },
  });
  assert.equal(fallback.render([row])[0].mint, "fallback-a");
  assert.equal(fallback.render([row])[0].coinPnl, null);
  const negative = projection({
    reels: { a: { tokens: [leg("positive", { pnlUsd: 0.001 })] } },
  });
  assert.equal(
    negative.render([person("a", { pnlUsd: -10 })])[0].mint,
    "positive",
  );
});
test("squad projection sorts a copied roster, matches members, retains first tied leg and caps two contributing members", () => {
  const members = [
    {
      userId: "c",
      walletAddress: "c",
      pnlUsd: 5,
      username: "C",
      profileImageUrl: "C",
    },
    {
      userId: "a",
      walletAddress: "a",
      pnlUsd: 100,
      username: "A",
      profileImageUrl: "A",
    },
    {
      userId: "b",
      walletAddress: "b",
      pnlUsd: 50,
      username: "B",
      profileImageUrl: "B",
    },
    { userId: "no", walletAddress: null, pnlUsd: 1000 },
  ];
  const original = structuredClone(members);
  const h = projection({
    rosters: { s: { members } },
    reels: {
      s: {
        tokens: [
          leg("first", {
            members: [
              { userId: "a", pnlUsd: 10, buySpendUsd: 4 },
              { userId: "b", pnlUsd: 5, buySpendUsd: 3 },
              { userId: "c", pnlUsd: 2, buySpendUsd: 2 },
            ],
          }),
          leg("tied", {
            members: [{ userId: "a", pnlUsd: 10, buySpendUsd: 9 }],
          }),
        ],
      },
    },
  });
  const out = h.render([group("s")]);
  assert.deepEqual(
    out.map((row) => row.key),
    ["s:a", "s:b"],
  );
  assert.deepEqual(
    out.map((row) => row.mint),
    ["first", "first"],
  );
  assert.deepEqual(
    out.map((row) => row.squadName),
    ["s", "s"],
  );
  assert.deepEqual(out[0].coinPnl, { pnlUsd: 10, buySpendUsd: 4 });
  assert.deepEqual(members, original);
});
test("media queries deduplicate wallets; pending hides rows, string UID wins, failed/missing UID falls back to image", () => {
  const same = [
    person("a", { walletAddress: "shared" }),
    person("b", { walletAddress: "shared" }),
  ];
  const h = projection({ media: { shared: { pnlLoop: { uid: "clip" } } } });
  const out = h.render(same);
  assert.equal(h.calls[3].queries.length, 1);
  assert.equal(h.calls[3].queries[0].staleTime, 1800000);
  assert.equal(h.calls[3].queries[0].retry, false);
  assert.ok(
    out.every(
      (row) =>
        row.thumbnail.type === "avatar_clip" && row.thumbnail.uid === "clip",
    ),
  );
  assert.deepEqual(
    projection({
      statuses: { "highlight-media:shared": { isPending: true } },
    }).render(same),
    [],
  );
  for (const uid of ["", 42, null, undefined]) {
    const rows = projection({ media: { shared: { pnlLoop: { uid } } } }).render(
      same,
    );
    assert.ok(rows.every((row) => row.thumbnail.type === "image"));
  }
  assert.deepEqual(
    projection().render([person("none", { profileImageUrl: null })]),
    [],
  );
});
test("output limit applies after media query planning and preserves trader-before-squad order", () => {
  const entries = Array.from({ length: 10 }, (_, i) => person(`p${i}`));
  const rosters = {},
    reels = {};
  for (let i = 0; i < 5; i++) {
    const id = `g${i}`;
    entries.push(group(id));
    rosters[id] = {
      members: [
        { userId: id, walletAddress: id, pnlUsd: 100, profileImageUrl: id },
      ],
    };
    reels[id] = {
      tokens: [
        leg(id, { members: [{ userId: id, pnlUsd: 20, buySpendUsd: 1 }] }),
      ],
    };
  }
  const h = projection({ rosters, reels });
  const out = h.render(entries);
  assert.equal(h.calls[3].queries.length, 15);
  assert.deepEqual(
    out.map((row) => row.key),
    Array.from({ length: 10 }, (_, i) => `p${i}`),
  );
});

// A deterministic cache runner invokes the actual adapted queryFns. It does not
// pretend to be React/TanStack, authenticate a viewer or infer server semantics.
function queryRunner({ contract, sendMedia }) {
  const cache = new Map(),
    tasks = [],
    requests = [],
    pending = [];
  const client = createCompetitionHighlights({
    keys,
    useClientServerContract: () => contract,
    fetch: sendMedia,
    queueMicrotask: (fn) => tasks.push(fn),
    useQueries(options) {
      requests.push(options);
      const results = options.queries.map((query) => {
        const key = JSON.stringify(query.queryKey);
        if (!cache.has(key)) {
          const value = { isPending: true };
          cache.set(key, value);
          const operation = Promise.resolve()
            .then(() => query.queryFn({ signal: new AbortController().signal }))
            .then(
              (data) => Object.assign(value, { isPending: false, data }),
              (error) => Object.assign(value, { isPending: false, error }),
            );
          pending.push(operation);
        }
        return cache.get(key);
      });
      return options.combine(results);
    },
  });
  return {
    client,
    requests,
    cache,
    render: (entries) =>
      client.useHighlights({ competitionId: "synthetic-cup", entries }),
    async settle() {
      await Promise.all(pending.splice(0));
    },
    flush() {
      for (const task of tasks.splice(0)) task();
    },
    tasks,
  };
}
test("real loopback reel/roster GETs then original generated-media POST produce exact carousel data", async (t) => {
  const requests = [];
  const base = await server(t, async (req, res) => {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = Buffer.concat(chunks).toString();
    requests.push({
      method: req.method,
      url: req.url,
      headers: req.headers,
      body,
    });
    res.setHeader("content-type", "application/json");
    if (req.method === "POST") {
      const ids = JSON.parse(body).ids;
      res.end(
        JSON.stringify(
          Object.fromEntries(
            ids.map((id) => [id, { pnlLoop: { uid: `clip-${id}` } }]),
          ),
        ),
      );
    } else if (req.url.includes("/p/highlights"))
      res.end(JSON.stringify({ tokens: [leg("person-mint")] }));
    else if (req.url.includes("/s/highlights"))
      res.end(
        JSON.stringify({
          tokens: [
            leg("squad-mint", {
              members: [{ userId: "member", pnlUsd: 20, buySpendUsd: 3 }],
            }),
          ],
        }),
      );
    else
      res.end(
        JSON.stringify({
          members: [
            {
              userId: "member",
              walletAddress: "member-wallet",
              pnlUsd: 100,
              username: "member",
              profileImageUrl: "avatar",
            },
          ],
        }),
      );
  });
  const runner = queryRunner({
    contract: async (operation, options) => {
      const { id, entryId } = options.params;
      const suffix = operation.endsWith("/highlights") ? "/highlights" : "";
      const url = new URL(
        `/competitions/${encodeURIComponent(id)}/entries/${encodeURIComponent(entryId)}${suffix}`,
        base,
      );
      if (options.query)
        url.searchParams.set("limit", String(options.query.limit));
      return (await fetch(url, { signal: options.signal })).json();
    },
    sendMedia: (url, options) => {
      assert.equal(url, "/api/profiles/generated-media");
      assert.equal(options.method, "POST");
      assert.equal(options.credentials, undefined);
      return fetch(new URL(url, base), options);
    },
  });
  const entries = [person("p"), group("s")];
  assert.deepEqual(runner.render(entries), []);
  await runner.settle();
  assert.deepEqual(runner.render(entries), []);
  await Promise.resolve();
  assert.equal(runner.tasks.length, 1);
  runner.flush();
  await runner.settle();
  const out = runner.render(entries);
  assert.deepEqual(
    out.map((row) => [row.key, row.mint, row.thumbnail.uid]),
    [
      ["p", "person-mint", "clip-wallet-p"],
      ["s:member", "squad-mint", "clip-member-wallet"],
    ],
  );
  assert.equal(requests.length, 4);
  assert.equal(requests.filter((req) => req.method === "GET").length, 3);
  assert.ok(
    requests.filter((req) => req.url.endsWith("limit=10")).length === 2,
  );
  assert.deepEqual(
    JSON.parse(requests.find((req) => req.method === "POST").body),
    { ids: ["wallet-p", "member-wallet"] },
  );
  assert.ok(
    requests.every((req) => !req.headers.cookie && !req.headers.authorization),
  );
});

function batched({ send }) {
  const tasks = [],
    promises = [],
    plans = [];
  const client = createCompetitionHighlights({
    keys,
    useClientServerContract: () => async () => undefined,
    fetch: send,
    queueMicrotask: (fn) => tasks.push(fn),
    useQueries(options) {
      plans.push(options);
      return options.combine(
        options.queries.map((query) => {
          if (query.queryKey[1] === "highlight-media") {
            const promise = query.queryFn();
            promises.push(
              promise.then(
                (data) => ({ status: "fulfilled", data }),
                (error) => ({ status: "rejected", error }),
              ),
            );
            return { isPending: true };
          }
          return state(null);
        }),
      );
    },
  });
  return {
    tasks,
    promises,
    plans,
    enqueue(wallet) {
      client.useHighlights({
        competitionId: "cup",
        entries: [person(wallet, { walletAddress: wallet })],
      });
    },
    flush() {
      for (const task of tasks.splice(0)) task();
    },
  };
}
test("module-local microtask coalesces duplicates, batches200 and continues after a rejected first batch", async () => {
  const sent = [];
  const h = batched({
    send: async (url, options) => {
      sent.push({ url, options, ids: JSON.parse(options.body).ids });
      return sent.length === 1
        ? new Response("failure", { status: 503 })
        : Response.json(
            Object.fromEntries(
              JSON.parse(options.body).ids.map((id) => [id, { id }]),
            ),
          );
    },
  });
  for (let i = 0; i < 250; i++) h.enqueue(`w${i}`);
  h.enqueue("w0");
  assert.equal(h.tasks.length, 1);
  assert.equal(sent.length, 0);
  h.flush();
  const outcomes = await Promise.all(h.promises);
  assert.deepEqual(
    sent.map((row) => row.ids.length),
    [200, 50],
  );
  assert.equal(new Set(sent.flatMap((row) => row.ids)).size, 250);
  assert.equal(outcomes.filter((row) => row.status === "rejected").length, 201);
  assert.ok(
    outcomes
      .filter((row) => row.status === "rejected")
      .every((row) => row.error.message === "generated media 503"),
  );
  assert.equal(outcomes[200].data.id, "w200");
});
test("missing media resolves null; parse/network errors reject their batch with original error identity", async () => {
  const missing = batched({ send: async () => Response.json({}) });
  missing.enqueue("missing");
  missing.flush();
  assert.equal((await missing.promises[0]).data, null);
  const failure = Error("synthetic network");
  const network = batched({
    send: async () => {
      throw failure;
    },
  });
  network.enqueue("network");
  network.flush();
  assert.equal((await network.promises[0]).error, failure);
  const malformed = batched({ send: async () => new Response("not JSON") });
  malformed.enqueue("bad-json");
  malformed.flush();
  assert.ok((await malformed.promises[0]).error instanceof SyntaxError);
});
test("drain clears pending map before awaiting fetch; later requests schedule a separate drain and module instances stay isolated", async () => {
  const sends = [];
  let resolveFirst;
  const first = new Promise((resolve) => {
    resolveFirst = resolve;
  });
  const h = batched({
    send: async (_url, options) => {
      sends.push(JSON.parse(options.body).ids);
      if (sends.length === 1) return first;
      return Response.json({});
    },
  });
  h.enqueue("first");
  h.flush();
  h.enqueue("second");
  assert.equal(h.tasks.length, 1);
  h.flush();
  resolveFirst(Response.json({}));
  await Promise.all(h.promises);
  assert.deepEqual(sends, [["first"], ["second"]]);
  const a = batched({ send: async () => Response.json({}) }),
    b = batched({ send: async () => Response.json({}) });
  a.enqueue("same");
  b.enqueue("same");
  assert.equal(a.tasks.length, 1);
  assert.equal(b.tasks.length, 1);
  a.flush();
  b.flush();
  await Promise.all([...a.promises, ...b.promises]);
});
test("actual original GET query functions preserve abort/failure without inventing auth or status triage", async (t) => {
  let entered;
  const started = new Promise((resolve) => {
    entered = resolve;
  });
  const base = await server(t, () => entered());
  const plans = [];
  const client = createCompetitionHighlights({
    keys,
    useClientServerContract: () => async (_operation, options) => {
      return fetch(base, { signal: options.signal });
    },
    useQueries(options) {
      plans.push(options);
      return options.combine(options.queries.map(() => ({ isPending: true })));
    },
  });
  client.useHighlights({ competitionId: "cup", entries: [person("p")] });
  const controller = new AbortController(),
    promise = plans[0].queries[0].queryFn({ signal: controller.signal });
  await started;
  controller.abort();
  await assert.rejects(promise, (error) => error.name === "AbortError");
  assert.equal(plans[0].queries[0].retry, undefined);
});
