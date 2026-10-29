import assert from "node:assert/strict";
import { test } from "node:test";
import { createServer } from "node:http";
import { once } from "node:events";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "../packages/frontend/node_modules/@playwright/test/index.mjs";
const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// Reuse the unchanged locked SDK toolchain dependency; no install/SDK build.
const sdkRequire = createRequire(path.join(APP, "packages/sdk/package.json"));
const { build } = createRequire(sdkRequire.resolve("tsup"))("esbuild");
test("actual React/compiler hooks and standard browser History execute the original tab/period/Cup state flow", async (t) => {
  const output = await build({
    entryPoints: [
      path.join(APP, "tests/fixtures/leaderboard-navigation-browser.mjs"),
    ],
    bundle: true,
    write: false,
    format: "iife",
    platform: "browser",
    nodePaths: [path.join(APP, "packages/frontend/node_modules")],
    define: { "process.env.NODE_ENV": '"production"' },
  });
  assert.equal(output.outputFiles.length, 1);
  const script = output.outputFiles[0].contents;
  const server = createServer((req, res) => {
    if (req.url === "/bundle.js") {
      res.setHeader("content-type", "text/javascript");
      res.end(script);
    } else {
      res.setHeader("content-type", "text/html");
      res.end(
        '<!doctype html><div id="root"></div><script src="/bundle.js"></script>',
      );
    }
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const origin = `http://127.0.0.1:${server.address().port}`;
  t.after(async () => {
    const closed = new Promise((resolve) => server.close(resolve));
    server.closeAllConnections();
    await closed;
  });
  const browser = await chromium.launch({
    headless: true,
    executablePath: chromium.executablePath(),
  });
  t.after(() => browser.close());
  const page = await browser.newPage();
  const errors = [],
    requests = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/*", (route) => {
    const request = route.request();
    requests.push({ url: request.url(), method: request.method() });
    if (new URL(request.url()).origin !== origin) return route.abort();
    return route.continue();
  });
  await page.goto(`${origin}/leaderboard?other=stay#anchor`);
  const read = () => page.locator("#state").textContent().then(JSON.parse);
  await page.waitForFunction(() =>
    document
      .querySelector("#state")
      ?.textContent?.includes('"timeframe":"daily"'),
  );
  assert.deepEqual(await read(), {
    tab: null,
    period: null,
    landing: "daily",
    timeframe: "daily",
    resolved: "traders",
    href: "/leaderboard?period=cup",
  });
  await page.click("#rewards");
  await page.waitForURL((url) => url.searchParams.get("tab") === "rewards");
  await page.click("#weekly");
  await page.waitForURL((url) => url.searchParams.get("period") === "weekly");
  await page.waitForFunction(
    () => document.querySelector("#mirror")?.textContent === "weekly",
  );
  assert.equal((await read()).tab, "rewards");
  await page.click("#traders");
  await page.waitForURL((url) => !url.searchParams.has("tab"));
  assert.equal(new URL(page.url()).searchParams.get("other"), "stay");
  assert.equal(new URL(page.url()).hash, "#anchor");
  await page.click("#clear-period");
  await page.waitForURL((url) => !url.searchParams.has("period"));
  await page.click("#live");
  await page.waitForFunction(() =>
    document
      .querySelector("#state")
      ?.textContent?.includes('"timeframe":"cup"'),
  );
  await page.click("#monthly");
  await page.click("#live");
  assert.equal((await read()).landing, "daily");
  assert.equal((await read()).timeframe, "monthly");
  await page.click("#clear-landing");
  assert.equal((await read()).timeframe, "daily");
  await page.click("#external");
  await page.waitForFunction(
    () => document.querySelector("#mirror")?.textContent === "monthly",
  );
  assert.equal((await read()).resolved, "callouts");
  await page.click("#desktop");
  assert.equal((await read()).resolved, "traders");
  assert.equal(new URL(page.url()).searchParams.get("tab"), "callouts");
  await page.goBack();
  await page.waitForFunction(
    () => document.querySelector("#mirror")?.textContent === "null",
  );
  assert.equal((await read()).tab, null);
  assert.equal(new URL(page.url()).searchParams.get("other"), "stay");
  assert.deepEqual(errors, []);
  assert.ok(requests.length >= 2);
  assert.ok(
    requests.every(
      (request) =>
        new URL(request.url).origin === origin && request.method === "GET",
    ),
  );
});
