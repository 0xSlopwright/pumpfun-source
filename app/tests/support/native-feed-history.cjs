const assert = require("node:assert/strict");
const test = require("node:test");
const path = require("node:path");
const { createRequire } = require("node:module");
const root = path.resolve(__dirname, "../..");
const backend = createRequire(path.join(root, "packages/backend/package.json"));
const frontend = createRequire(
  path.join(root, "packages/frontend/package.json"),
);
const { buildApp } = backend("./src/app.ts");
const { HomeFeedStore } = backend("./src/home-feed-store.ts");
const seed = backend("./src/home-feed-seed.json");
const React = frontend("react");
const { renderToStaticMarkup } = frontend("react-dom/server");
const { NativeCalloutFeed } = frontend(
  "./src/components/feed/NativeCalloutFeed.tsx",
);
const { nativeFeedHref, parseNativeFeedNavigation } = frontend(
  "./src/components/feed/native-feed-navigation.ts",
);
const { validateNativeFeedPage } = frontend(
  "./src/components/feed/native-feed-data.ts",
);

function parseHref(href) {
  const url = new URL(href, "http://127.0.0.1:3010");
  assert.equal(url.origin, "http://127.0.0.1:3010");
  assert.equal(url.pathname, "/");
  assert.equal(url.searchParams.get("tab"), "local-callouts");
  return parseNativeFeedNavigation({
    nativeView: url.searchParams.get("nativeView") ?? undefined,
    nativeCursor: url.searchParams.get("nativeCursor") ?? undefined,
    nativeTrail: url.searchParams.getAll("nativeTrail"),
  });
}
function link(html, rel) {
  // Read only the actual React SSR anchor attributes, not a browser/DOM claim.
  const anchor = [...html.matchAll(/<a\b([^>]*)>/gu)].find((match) =>
    match[1].includes(`rel="${rel}"`),
  );
  return anchor?.[1].match(/href="([^"]*)"/u)?.[1].replaceAll("&amp;", "&");
}
async function page(app, kind, href) {
  const navigation = parseHref(href);
  assert.equal(navigation.kind, kind);
  const query = new URLSearchParams({ pageSize: "3" });
  if (navigation.cursor) query.set("pageToken", navigation.cursor);
  const response = await app.inject({
    method: "GET",
    url: `/services/frontend/home-feed${kind === "newest" ? "/new" : ""}?${query}`,
  });
  assert.equal(response.statusCode, 200);
  assert.equal(
    response.headers["x-reconstruction-data-source"],
    "synthetic-home-feed-local-v1",
  );
  assert.equal(
    response.headers["x-reconstruction-compatibility"],
    "local-unqualified",
  );
  assert.match(response.headers["cache-control"], /no-store/u);
  const data = validateNativeFeedPage(response.json(), kind);
  const html = renderToStaticMarkup(
    React.createElement(NativeCalloutFeed, {
      ...navigation,
      result: { ok: true, page: data },
    }),
  );
  return { navigation, data, html };
}
function largeSeed() {
  return {
    datasetId: "synthetic-navigation-boundary-test",
    observedAt: seed.observedAt,
    records: Array.from({ length: 500 }, (_, index) => ({
      ...seed.records[0],
      recordId: `synthetic-record-${index}`,
      calloutId: `00000000-0000-4000-8000-${String(index).padStart(12, "0")}`,
      coinMint: `SYNTHETIC_MINT_${index}`,
      coinName: `Synthetic Coin ${index}`,
      symbol: `S${index}`,
      localRank: index + 1,
      thesis: "Synthetic local navigation test, not a production callout.",
    })),
  };
}
for (const kind of ["ranked", "newest"]) {
  test(`${kind}: valid 500-row store stops forward history at page22 but keeps Previous and reset`, async () => {
    // The existing documented test injection accepts up to500 records. No default
    // seed is changed, no cursor is manufactured, and no network listener starts.
    const app = buildApp([], { homeFeedStore: new HomeFeedStore(largeSeed()) });
    try {
      let href = nativeFeedHref(kind);
      let current;
      for (let number = 1; number <= 22; number++) {
        current = await page(app, kind, href);
        assert.equal(current.data.coins.length, 3);
        assert.match(current.html, new RegExp(`Local page ${number}<`, "u"));
        if (number < 22) {
          const next = link(current.html, "next");
          assert.ok(next);
          assert.equal(parseHref(next).cursor, current.data.nextPageToken);
          href = next;
        }
      }
      assert.equal(current.navigation.trail.length, 20);
      assert.ok(
        current.data.nextPageToken,
        "the backend still has more records",
      );
      assert.equal(
        link(current.html, "next"),
        undefined,
        "page22 must not emit its own rejected21-entry trail",
      );
      assert.match(current.html, /More local records are available/u);
      assert.doesNotMatch(current.html, /End of local list/u);
      const previous = link(current.html, "prev");
      assert.ok(previous);
      const back = await page(app, kind, previous);
      assert.equal(back.navigation.trail.length, 19);
      assert.equal(
        link(back.html, "next"),
        href,
        "back/forward preserves the exact current cursor and trail",
      );
      const reset = [
        ...current.html.matchAll(
          /<a\b([^>]*)>return to the first local page<\/a>/gu,
        ),
      ][0]?.[1]
        .match(/href="([^"]*)"/u)?.[1]
        .replaceAll("&amp;", "&");
      assert.equal(reset, nativeFeedHref(kind));
      assert.deepEqual(parseHref(reset), {
        kind,
        trail: [],
        cursor: undefined,
      });
      const first = await page(app, kind, reset);
      assert.equal(first.data.coins.length, 3);
      assert.equal(first.navigation.kind, kind);
      assert.throws(
        () =>
          parseNativeFeedNavigation({
            nativeView: kind,
            nativeCursor: current.data.nextPageToken,
            nativeTrail: [
              ...current.navigation.trail,
              current.navigation.cursor,
            ],
          }),
        /exceeds the local page bound/u,
        "unsupported history still fails closed",
      );
      const terminalHtml = renderToStaticMarkup(
        React.createElement(NativeCalloutFeed, {
          ...current.navigation,
          result: {
            ok: true,
            page: { ...current.data, nextPageToken: undefined },
          },
        }),
      );
      assert.match(terminalHtml, /End of local list/u);
      assert.doesNotMatch(
        terminalHtml,
        /More local records|Local navigation limit/u,
      );
      assert.ok(link(terminalHtml, "prev"));
    } finally {
      await app.close();
    }
  });
  test(`${kind}: unchanged default seed reaches its real end, not the history limit`, async () => {
    const app = buildApp();
    try {
      let href = nativeFeedHref(kind),
        count = 0;
      for (let attempts = 0; attempts < 4; attempts++) {
        const current = await page(app, kind, href);
        count += current.data.coins.length;
        assert.doesNotMatch(
          current.html,
          /Local navigation limit|More local records/u,
        );
        const next = link(current.html, "next");
        if (!next) {
          assert.match(current.html, /End of local list/u);
          assert.ok(count > 0 && count <= 8);
          return;
        }
        href = next;
      }
      assert.fail(
        "default seed did not terminate within its existing bounded pages",
      );
    } finally {
      await app.close();
    }
  });
}
