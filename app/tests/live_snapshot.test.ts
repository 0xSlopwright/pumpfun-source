import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  LIVE_ARCHIVED_STREAM_COUNT,
  LIVE_CAPTURED_AT,
  LIVE_CAPTURE_BYTES,
  LIVE_CAPTURE_PATH,
  LIVE_CAPTURE_SHA256,
  LIVE_CAPTURE_URL,
  parseLiveCapture,
  sha256,
  validateArchivedStream,
  verifyLiveEvidence,
} from "../packages/frontend/src/app/live/live-data.ts";
import {
  filterArchivedStreams,
  LIVE_PAGE_SIZE,
  paginateArchivedStreams,
} from "../packages/frontend/src/app/live/live-filter.ts";

const capture = new URL(
  "../evidence/web/objects/c45d40b52df03727",
  import.meta.url,
);
const manifest = new URL("../evidence/web/manifest.json", import.meta.url);

async function realEvidence() {
  const [bytes, manifestValue] = await Promise.all([
    readFile(capture),
    readFile(manifest, "utf8").then(JSON.parse),
  ]);
  return { bytes, manifestValue };
}

test("authenticates the exact captured Live HTML and extracts all 42 bounded first-section records", async () => {
  const { bytes, manifestValue } = await realEvidence();
  assert.equal(bytes.byteLength, LIVE_CAPTURE_BYTES);
  assert.equal(sha256(bytes), LIVE_CAPTURE_SHA256);

  const snapshot = verifyLiveEvidence(bytes, manifestValue);
  assert.equal(snapshot.sourceUrl, LIVE_CAPTURE_URL);
  assert.equal(snapshot.capturedAt, "2026-10-28T10:48:45.546100+00:00");
  assert.equal(snapshot.streams.length, LIVE_ARCHIVED_STREAM_COUNT);
  assert.equal(new Set(snapshot.streams.map((stream) => stream.id)).size, 42);
  assert.deepEqual(
    snapshot.streams.slice(0, 5).map((stream) => stream.viewerCountAtCapture),
    [42, 34, 26, 24, 20],
  );
  assert.equal(snapshot.streams[0]?.title, "M");
  assert.equal(snapshot.streams[0]?.symbol, "$M");
  assert.equal(
    snapshot.streams[0]?.creatorAddress,
    "Aq7jiTAePZ1onBGDV6yUFNF6RnhYG8ALcwfdxBv7EGky",
  );
  assert.equal(snapshot.streams[0]?.wasLiveAtCapture, true);
});

test("rendered symbols and titles match the capture's server-rendered text", async () => {
  const { bytes, manifestValue } = await realEvidence();
  const html = new TextDecoder().decode(bytes);
  for (const stream of verifyLiveEvidence(bytes, manifestValue).streams) {
    assert.ok(!stream.symbol.startsWith("$$"), stream.symbol);
    assert.ok(html.includes(`>${stream.symbol}<`), `symbol ${stream.symbol}`);
    assert.ok(html.includes(`>${stream.title}<`), `title ${stream.title}`);
  }
});

test("unresolved React Flight references fail closed", async () => {
  const { bytes } = await realEvidence();
  const source = new TextDecoder().decode(bytes);
  const escaped = '\\"symbol\\":\\"$$M\\"';
  assert.ok(source.includes(escaped));
  const mutated = new TextEncoder().encode(
    source.replace(escaped, '\\"symbol\\":\\"$@3\\"'),
  );
  assert.throws(
    () => parseLiveCapture(mutated, sha256(mutated)),
    /unresolved Flight reference/,
  );
});

test("keeps external media fields out of the browser-facing data model", async () => {
  const { bytes } = await realEvidence();
  const [stream] = parseLiveCapture(bytes);
  assert.deepEqual(Object.keys(stream).sort(), [
    "creatorAddress",
    "id",
    "mint",
    "symbol",
    "title",
    "viewerCountAtCapture",
    "wasLiveAtCapture",
  ]);
  assert.equal("playlistUrl" in stream, false);
  assert.equal("thumbnail" in stream, false);
});

test("fails closed for changed capture bytes and changed provenance", async () => {
  const { bytes, manifestValue } = await realEvidence();
  const changedBytes = Buffer.from(bytes);
  changedBytes[100] ^= 1;
  assert.throws(() => parseLiveCapture(changedBytes), /SHA-256 mismatch/);

  const changedManifest = structuredClone(manifestValue);
  const record = changedManifest.records.find(
    (value: { url?: string }) => value.url === LIVE_CAPTURE_URL,
  );
  record.path = "evidence/web/objects/not-the-live-capture";
  assert.throws(
    () => verifyLiveEvidence(bytes, changedManifest),
    /provenance does not match/,
  );
  assert.equal(LIVE_CAPTURE_PATH, "evidence/web/objects/c45d40b52df03727");
});

test("rejects invalid stream identity, state, counts and unexpected fields", () => {
  const valid = {
    id: "mint",
    mint: "mint",
    title: "Title",
    symbol: "T",
    creator: { address: "creator" },
    isLive: true,
    viewerCount: 2,
    coin: { mint: "mint" },
  };
  assert.equal(validateArchivedStream(valid).viewerCountAtCapture, 2);
  for (const invalid of [
    { ...valid, id: "different" },
    { ...valid, isLive: false },
    { ...valid, viewerCount: -1 },
    { ...valid, viewerCount: 1.5 },
    { ...valid, creator: { address: "creator", verified: true } },
    { ...valid, playlistToken: "secret" },
    { ...valid, coin: { mint: "different" } },
  ]) {
    assert.throws(() => validateArchivedStream(invalid), /Archived stream/);
  }
});

test("searches supported archived identity fields and sorts deterministically", async () => {
  const { bytes } = await realEvidence();
  const streams = parseLiveCapture(bytes);
  assert.equal(filterArchivedStreams(streams, "$major", "viewers").length, 1);
  assert.equal(
    filterArchivedStreams(streams, "EWa9rEDV", "viewers")[0]?.title,
    "A",
  );
  assert.deepEqual(
    filterArchivedStreams(streams, "", "title")
      .slice(0, 3)
      .map((stream) => stream.title),
    ["$RAT - Exfil Rat", "1 Million Circles", "A"],
  );
  assert.deepEqual(
    filterArchivedStreams(streams, "", "viewers")
      .slice(0, 5)
      .map((stream) => stream.viewerCountAtCapture),
    [42, 40, 34, 26, 24],
  );
});

// Independently parse the complete retained Flight row for test oracles and
// corruption controls. Only JSON is interpreted; no captured script is run.
function flightControl(bytes: Uint8Array) {
  const source = new TextDecoder().decode(bytes);
  const match = source.match(
    /<script>self\.__next_f\.push\((.*?)\)<\/script>/su,
  );
  assert.ok(match);
  const push = JSON.parse(match[1]);
  const rows: string[] = push[1].split("\n");
  const rowIndex = rows.findIndex((row) =>
    row.includes('"initialSectionData":'),
  );
  assert.ok(rowIndex >= 0);
  const prefix = rows[rowIndex].slice(0, rows[rowIndex].indexOf(":") + 1);
  const row = JSON.parse(rows[rowIndex].slice(prefix.length));
  const sections = row[1][3].initialSectionData;
  assert.equal(sections.length, 2);
  return {
    sections,
    rewrite(change: (value: Record<string, unknown>[][]) => void): Uint8Array {
      change(sections);
      rows[rowIndex] = prefix + JSON.stringify(row);
      push[1] = rows.join("\n");
      return new TextEncoder().encode(
        source.replace(
          match[0],
          () => `<script>self.__next_f.push(${JSON.stringify(push)})</script>`,
        ),
      );
    },
  };
}

test("uses the complete first section in captured order, without hero/other-section duplicates", async () => {
  const { bytes } = await realEvidence();
  const { sections } = flightControl(bytes);
  assert.equal(sections[0].length, 42);
  assert.equal(sections[1].length, 24);
  const streams = parseLiveCapture(bytes);
  assert.deepEqual(
    streams.map((stream) => stream.id),
    sections[0].map((record: { id: string }) => record.id),
  );
  assert.equal(streams[12].title, "CryptoCasinoWEB3");
  assert.equal(streams[12].viewerCountAtCapture, 40);
  assert.equal(streams[41].title, "Be a U$Dolly visionary!");
  assert.equal(streams[41].viewerCountAtCapture, 0);
  assert.deepEqual(filterArchivedStreams(streams, "", "captured"), streams);
  assert.equal(
    filterArchivedStreams(streams, "cryptocasino", "captured").length,
    1,
  );
  for (const stream of streams) {
    assert.deepEqual(Object.keys(stream).sort(), [
      "creatorAddress",
      "id",
      "mint",
      "symbol",
      "title",
      "viewerCountAtCapture",
      "wasLiveAtCapture",
    ]);
  }
});

test("rejects dropped, added, duplicate and malformed records anywhere in the expanded section", async () => {
  const { bytes } = await realEvidence();
  const controls: Array<
    [(sections: Record<string, unknown>[][]) => void, RegExp]
  > = [
    [
      (sections) => {
        sections[0].pop();
      },
      /record count/,
    ],
    [
      (sections) => {
        sections[0].push(sections[0][0]);
      },
      /record count/,
    ],
    [
      (sections) => {
        sections[0][41] = sections[0][0];
      },
      /duplicate identities/,
    ],
    [
      (sections) => {
        delete sections[0][41].title;
      },
      /title is invalid/,
    ],
    [
      (sections) => {
        sections[0][41].viewerCount = -1;
      },
      /viewer count/,
    ],
    [
      (sections) => {
        sections[0][41].isLive = false;
      },
      /live-at-capture/,
    ],
    [
      (sections) => {
        sections[0][41].symbol = "$@3";
      },
      /unresolved Flight/,
    ],
  ];
  for (const [change, expected] of controls) {
    const mutated = flightControl(bytes).rewrite(change);
    assert.throws(() => parseLiveCapture(mutated, sha256(mutated)), expected);
  }
});

test("JSON extraction handles escaped quotes, brackets and backslashes as inert text", async () => {
  const { bytes } = await realEvidence();
  const title = 'Text "] }, \\" remains text';
  const mutated = flightControl(bytes).rewrite((sections) => {
    sections[0][41].title = title;
  });
  assert.equal(parseLiveCapture(mutated, sha256(mutated))[41].title, title);
});

test("fails closed on missing/ambiguous Flight pushes, section markers and invalid UTF-8", async () => {
  const { bytes } = await realEvidence();
  const source = new TextDecoder().decode(bytes);
  const script = source.match(
    /<script>self\.__next_f\.push\((.*?)\)<\/script>/su,
  )![0];
  for (const mutatedSource of [
    source.replace(script, ""),
    source + '<script>self.__next_f.push([1,""])</script>',
    source.replace("initialSectionData", "unrecognizedSectionData"),
  ]) {
    const mutated = new TextEncoder().encode(mutatedSource);
    assert.throws(
      () => parseLiveCapture(mutated, sha256(mutated)),
      /Flight payload|section/,
    );
  }
  const invalidUtf8 = new Uint8Array([0xff]);
  assert.throws(
    () => parseLiveCapture(invalidUtf8, sha256(invalidUtf8)),
    /UTF-8/,
  );
  assert.throws(
    () => parseLiveCapture(new Uint8Array(1_000_001)),
    /size limit/,
  );
});

test("pins the observation timestamp instead of presenting relabeled historical viewers", async () => {
  const { bytes, manifestValue } = await realEvidence();
  assert.equal(
    verifyLiveEvidence(bytes, manifestValue).capturedAt,
    LIVE_CAPTURED_AT,
  );
  for (const captured_at of [
    "2026-10-29T10:48:45.546100+00:00",
    "invalid",
    undefined,
  ]) {
    assert.throws(
      () => verifyLiveEvidence(bytes, { ...manifestValue, captured_at }),
      /timestamp does not match/,
    );
  }
});

test("local pages partition all captured records without loss, duplication or input mutation", async () => {
  const { bytes } = await realEvidence();
  const streams = parseLiveCapture(bytes);
  const original = structuredClone(streams);
  const pages = [1, 2, 3, 4].map((page) =>
    paginateArchivedStreams(streams, [String(page)]),
  );
  assert.equal(LIVE_PAGE_SIZE, 12);
  assert.deepEqual(
    pages.map((page) => page.streams.length),
    [12, 12, 12, 6],
  );
  assert.deepEqual(
    pages.map(({ start, end }) => [start, end]),
    [
      [1, 12],
      [13, 24],
      [25, 36],
      [37, 42],
    ],
  );
  assert.ok(pages.every((page) => page.valid && page.pageCount === 4));
  assert.deepEqual(
    pages.flatMap((page) => page.streams),
    streams,
  );
  assert.deepEqual(paginateArchivedStreams(streams, []), pages[0]);
  for (const sort of ["captured", "title", "viewers"] as const) {
    const sorted = filterArchivedStreams(streams, "", sort);
    assert.deepEqual(
      [1, 2, 3, 4].flatMap(
        (page) => paginateArchivedStreams(sorted, [String(page)]).streams,
      ),
      sorted,
    );
  }
  assert.deepEqual(streams, original);
});

test("pagination rejects malformed, duplicate and out-of-range pages including filtered and empty views", async () => {
  const { bytes } = await realEvidence();
  const streams = parseLiveCapture(bytes);
  for (const values of [
    [""],
    ["0"],
    ["-1"],
    ["01"],
    ["1.5"],
    ["1e0"],
    ["+1"],
    [" 1"],
    ["5"],
    ["999999999999"],
    ["1", "1"],
    ["1", "2"],
  ]) {
    const result = paginateArchivedStreams(streams, values);
    assert.equal(result.valid, false, JSON.stringify(values));
    assert.deepEqual(result.streams, []);
  }
  const filtered = filterArchivedStreams(streams, "$major", "captured");
  assert.equal(paginateArchivedStreams(filtered, []).total, 1);
  assert.equal(paginateArchivedStreams(filtered, ["2"]).valid, false);
  const empty = paginateArchivedStreams([], []);
  assert.equal(empty.valid, true);
  assert.equal(empty.pageCount, 1);
  assert.equal(empty.start, 0);
  assert.equal(empty.end, 0);
  assert.deepEqual(empty.streams, []);
  assert.equal(paginateArchivedStreams([], ["2"]).valid, false);
});

test("authenticates the retained section-index mapping without executing captured factories", async () => {
  const { bytes, manifestValue } = await realEvidence();
  const html = new TextDecoder().decode(bytes);
  const push = JSON.parse(
    html.match(/<script>self\.__next_f\.push\((.*?)\)<\/script>/su)![1],
  );
  const rows: string[] = push[1].split("\n");
  assert.ok(
    rows.some(
      (row) =>
        row.startsWith("116:I[31113,") && row.endsWith(',"LiveHomepage"]'),
    ),
  );
  const references = [
    {
      path: "8cb897425bbbb845.js",
      start: 118,
      end: 3161,
      hash: "aa72011769a3b4ed93846aa469860c5b661aafea0e98fbf5da8432305f2348c5",
      text: "initialData:v?.[s]",
    },
    {
      path: "0ba78d0f42544445.js",
      start: 13588,
      end: 21847,
      hash: "1c56dd013720ae62a9c8ec316ebf1921d9fb13dc436bd75f7eefacdaad40aecb",
      text: "let z=[{id:t.f.MOST_VIEWERS",
    },
    {
      path: "44a65b4313e51497.js",
      start: 25697,
      end: 25933,
      hash: "db885fc927427d144544ada8524614dc33547634693bc8824951e2a65c25f6f0",
      text: 't.MOST_VIEWERS="most-viewers"',
    },
  ];
  for (const reference of references) {
    const path = `evidence/web/objects/${reference.path}`;
    const records = manifestValue.records.filter(
      (record: { path?: string }) => record.path === path,
    );
    assert.equal(records.length, 1);
    const sourceBytes = await readFile(new URL(`../${path}`, import.meta.url));
    assert.equal(sourceBytes.byteLength, records[0].bytes);
    assert.equal(sha256(sourceBytes), records[0].sha256);
    const source = new TextDecoder("utf-8", { fatal: true }).decode(
      sourceBytes,
    );
    const factory = source.slice(reference.start, reference.end);
    assert.equal(sha256(new TextEncoder().encode(factory)), reference.hash);
    assert.ok(factory.includes(reference.text));
  }
});
