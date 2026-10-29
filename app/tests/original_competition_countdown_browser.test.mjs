import assert from "node:assert/strict";
import { test } from "node:test";
import { readFile, mkdir } from "node:fs/promises";
import { createServer } from "node:http";
import { once } from "node:events";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { parse } from "@babel/parser";
import {
  findNodes,
  exactlyOne,
} from "../scripts/original-contracts/source.mjs";
import { chromium } from "../packages/frontend/node_modules/@playwright/test/index.mjs";
const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."),
  FRONTEND = path.join(APP, "packages/frontend"),
  EPOCH = Date.parse("2030-05-01T00:00:00.000Z");
const sdk = createRequire(path.join(APP, "packages/sdk/package.json"));
const { build } = createRequire(sdk.resolve("tsup"))("esbuild");
const frontend = createRequire(path.join(FRONTEND, "package.json"));
const postcss = frontend("postcss"),
  tailwind = frontend("tailwindcss"),
  loadConfig = frontend("tailwindcss/loadConfig.js");
async function bundle(variant) {
  const source = await readFile(
    path.join(
      APP,
      variant === "before"
        ? "reconstruction/competition-countdown/reference/leaderboard-client.base.tsx"
        : "packages/frontend/src/app/leaderboard/leaderboard-client.tsx",
    ),
    "utf8",
  );
  const ast = parse(source, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
  });
  const functionText = (name) => {
    const node = exactlyOne(
      findNodes(
        ast,
        (node) => node.type === "FunctionDeclaration" && node.id?.name === name,
      ),
      name,
    );
    return source.slice(node.start, node.end);
  };
  const compact = exactlyOne(
    findNodes(
      ast,
      (node) =>
        node.type === "VariableDeclarator" && node.id?.name === "compact",
    ),
    "actual compact formatter",
  );
  const code = `import React from 'react';${variant === "after" ? `import {CompetitionCountdown} from ${JSON.stringify(path.join(FRONTEND, "src/components/leaderboard/CompetitionCountdown.tsx"))};` : ""}const Link=({href,children,...props})=>React.createElement('a',{href,...props},children);const ${source.slice(compact.start, compact.end)};${functionText("safeDate")}export ${functionText("CompetitionCards")}`;
  const result = await build({
    entryPoints: [
      path.join(APP, "tests/fixtures/competition-countdown-browser.mjs"),
    ],
    bundle: true,
    write: false,
    format: "iife",
    platform: "browser",
    jsx: "automatic",
    nodePaths: [path.join(FRONTEND, "node_modules")],
    define: { "process.env.NODE_ENV": '"production"' },
    plugins: [
      {
        name: "actual-maintained-product-cards",
        setup(build) {
          build.onResolve({ filter: /^product-cards$/ }, () => ({
            path: "product-cards",
            namespace: "product-cards",
          }));
          build.onLoad({ filter: /.*/, namespace: "product-cards" }, () => ({
            contents: code,
            loader: "tsx",
            resolveDir: FRONTEND,
          }));
        },
      },
    ],
  });
  return result.outputFiles[0].contents;
}
async function css() {
  let globals = await readFile(
    path.join(FRONTEND, "src/app/globals.css"),
    "utf8",
  );
  for (const name of [
    "recovered-tokens.css",
    "recovered-fonts.css",
    "captured-root.css",
  ])
    globals = globals.replace(
      `@import "./${name}";`,
      await readFile(path.join(FRONTEND, "src/app", name), "utf8"),
    );
  const config = loadConfig(path.join(FRONTEND, "tailwind.config.ts"));
  config.content = [
    {
      raw: await readFile(
        path.join(
          FRONTEND,
          "src/components/leaderboard/original-countdown.mjs",
        ),
        "utf8",
      ),
      extension: "js",
    },
    {
      raw: await readFile(
        path.join(
          FRONTEND,
          "src/components/leaderboard/CompetitionCountdown.tsx",
        ),
        "utf8",
      ),
      extension: "tsx",
    },
  ];
  return (
    await postcss([tailwind(config)]).process(globals, { from: undefined })
  ).css;
}
test("actual product cards before/after: correct loading/phase displays, real React timers, expired zero, cleanup and responsive fit", async (t) => {
  const scripts = {
      before: await bundle("before"),
      after: await bundle("after"),
    },
    style = await css();
  const server = createServer(async (req, res) => {
    if (req.url === "/style.css") {
      res.setHeader("content-type", "text/css");
      res.end(style);
      return;
    }
    if (req.url === "/before.js" || req.url === "/after.js") {
      res.setHeader("content-type", "text/javascript");
      res.end(scripts[req.url.slice(1, -3)]);
      return;
    }
    if (req.url.startsWith("/fonts/")) {
      try {
        res.setHeader("content-type", "font/woff2");
        res.end(await readFile(path.join(FRONTEND, "public", req.url)));
      } catch {
        res.statusCode = 404;
        res.end();
      }
      return;
    }
    const variant = req.url.startsWith("/before") ? "before" : "after";
    res.setHeader("content-type", "text/html");
    res.end(
      `<!doctype html><html><head><link rel="stylesheet" href="/style.css"></head><body><div id="root"></div><script>window.__activeIntervals=new Set();const oldSet=window.setInterval,oldClear=window.clearInterval;window.setInterval=function(...args){const id=oldSet(...args);window.__activeIntervals.add(id);return id};window.clearInterval=function(id){window.__activeIntervals.delete(id);return oldClear(id)};</script><script src="/${variant}.js"></script></body></html>`,
    );
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(async () => {
    const closed = new Promise((resolve) => server.close(resolve));
    server.closeAllConnections();
    await closed;
  });
  const origin = `http://127.0.0.1:${server.address().port}`;
  const browser = await chromium.launch({
    headless: true,
    executablePath: chromium.executablePath(),
  });
  t.after(() => browser.close());
  const errors = [],
    requests = [];
  for (const [name, viewport] of [
    ["desktop", { width: 1280, height: 900 }],
    ["mobile", { width: 375, height: 812 }],
  ])
    for (const variant of ["before", "after"]) {
      const page = await browser.newPage({ viewport });
      page.on("pageerror", (error) => errors.push(error.message));
      await page.route("**/*", (route) => {
        const request = route.request();
        requests.push({ url: request.url(), method: request.method() });
        return new URL(request.url()).origin === origin
          ? route.continue()
          : route.abort();
      });
      await page.clock.install({ time: new Date(EPOCH - 1000) });
      await page.clock.pauseAt(EPOCH);
      await page.goto(`${origin}/${variant}`);
      await page.waitForSelector("#loading");
      assert.equal(await page.getByTestId("cup-countdown").count(), 0);
      assert.equal(await page.evaluate(() => window.__activeIntervals.size), 0);
      await page.click("#load");
      await page.waitForSelector(".competition-card");
      assert.equal(await page.locator(".competition-card").count(), 8);
      if (variant === "before") {
        assert.equal(await page.getByTestId("cup-countdown").count(), 0);
        assert.equal(
          await page.evaluate(() => window.__activeIntervals.size),
          0,
        );
      } else {
        assert.equal(await page.getByTestId("cup-countdown").count(), 4);
        assert.equal(
          await page.evaluate(() => window.__activeIntervals.size),
          4,
        );
        const card = (id) =>
          page
            .locator(".competition-card")
            .filter({
              has: page.getByRole("heading", {
                name: `Synthetic ${id}`,
                exact: true,
              }),
            });
        assert.ok((await card("live").textContent()).includes("Ends in"));
        for (const id of ["upcoming", "registration"])
          assert.ok((await card(id).textContent()).includes("Starts in"));
        for (const id of ["ended", "unknown", "missing", "invalid"])
          assert.equal(await card(id).getByTestId("cup-countdown").count(), 0);
        const digits = (id) =>
          card(id)
            .locator(
              '[data-testid="cup-countdown"] > div > div > span:first-child',
            )
            .allTextContents();
        assert.deepEqual(await digits("live"), ["01", "01", "01", "01"]);
        assert.deepEqual(await digits("expired"), ["00", "00", "00", "00"]);
        await page.clock.runFor(1000);
        assert.deepEqual(await digits("live"), ["01", "01", "01", "00"]);
        assert.deepEqual(await digits("expired"), ["00", "00", "00", "00"]);
      }
      const bounds = await page
        .locator(".competition-card")
        .evaluateAll((cards) =>
          cards.map((card) => ({
            width: card.clientWidth,
            scroll: card.scrollWidth,
          })),
        );
      assert.ok(
        bounds.every((card) => card.scroll <= card.width + 1),
        JSON.stringify({ variant, name, bounds }),
      );
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      await page.evaluate(() => document.fonts.ready);
      if (process.env.COUNTDOWN_SCREENSHOTS_DIR) {
        await mkdir(process.env.COUNTDOWN_SCREENSHOTS_DIR, { recursive: true });
        await page.screenshot({
          path: path.join(
            process.env.COUNTDOWN_SCREENSHOTS_DIR,
            `${variant}-${name}.png`,
          ),
          fullPage: true,
        });
      }
      await page.click("#clear");
      await page.waitForSelector("#loading");
      assert.equal(await page.evaluate(() => window.__activeIntervals.size), 0);
      await page.clock.runFor(2000);
      assert.equal(await page.getByTestId("cup-countdown").count(), 0);
      await page.close();
    }
  assert.deepEqual(errors, []);
  assert.ok(
    requests.every(
      (request) =>
        new URL(request.url).origin === origin && request.method === "GET",
    ),
  );
});
