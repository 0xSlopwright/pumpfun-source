import assert from "node:assert/strict";
import { test } from "node:test";
import { readFile, mkdir } from "node:fs/promises";
import { createServer } from "node:http";
import { once } from "node:events";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { chromium } from "../packages/frontend/node_modules/@playwright/test/index.mjs";
import { validateAgainstSchema } from "../packages/backend/src/schema-validator.ts";
import { prizeNumberVariants } from "../packages/frontend/src/components/leaderboard/original-prize-formats.mjs";
const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."),
  FRONTEND = path.join(APP, "packages/frontend");
const sdk = createRequire(path.join(APP, "packages/sdk/package.json")),
  { build } = createRequire(sdk.resolve("tsup"))("esbuild"),
  frontend = createRequire(path.join(FRONTEND, "package.json"));
async function css() {
  let source = await readFile(
    path.join(FRONTEND, "src/app/globals.css"),
    "utf8",
  );
  for (const name of [
    "recovered-tokens.css",
    "recovered-fonts.css",
    "captured-root.css",
  ])
    source = source.replace(
      `@import "./${name}";`,
      await readFile(path.join(FRONTEND, "src/app", name), "utf8"),
    );
  const config = frontend("tailwindcss/loadConfig.js")(
    path.join(FRONTEND, "tailwind.config.ts"),
  );
  config.content = await Promise.all(
    ["original-prizes.tsx", "CompetitionPrizeDisplay.tsx"].map(
      async (name) => ({
        raw: await readFile(
          path.join(FRONTEND, "src/components/leaderboard", name),
          "utf8",
        ),
        extension: "tsx",
      }),
    ),
  );
  return (
    await frontend("postcss")([frontend("tailwindcss")(config)]).process(
      source,
      { from: undefined },
    )
  ).css;
}
test("complete prize components in real React/Chromium: explicit contexts, props admission, locale updates, optional rank badges and responsive layout", async (t) => {
  const spec = JSON.parse(
      await readFile(path.join(APP, "contracts/developer.openapi.json")),
    ),
    schema =
      spec.paths["/competitions/{idOrSlug}"].get.responses["200"].content[
        "application/json"
      ].schema.properties.competition.properties.prizes;
  const props = [
    { rankFrom: 1, rankTo: 1, amount: "1000" },
    { rankFrom: 3, rankTo: 5, amount: "2 SOL" },
  ];
  const result = await build({
      entryPoints: [
        path.join(APP, "tests/fixtures/competition-prize-display-browser.mjs"),
      ],
      bundle: true,
      write: false,
      format: "iife",
      platform: "browser",
      jsx: "automatic",
      nodePaths: [path.join(FRONTEND, "node_modules")],
      define: { "process.env.NODE_ENV": '"production"' },
    }),
    style = await css();
  const admitted = [];
  const server = createServer(async (req, res) => {
    if (req.url.startsWith("/fixture/")) {
      const body =
          req.url === "/fixture/valid"
            ? props
            : [{ rankFrom: 1, rankTo: 1, amount: 42 }],
        errors = validateAgainstSchema(body, schema, "$", spec);
      admitted.push({ path: req.url, valid: errors.length === 0 });
      res.statusCode = errors.length ? 422 : 200;
      res.setHeader("content-type", "application/json");
      res.end(
        JSON.stringify(
          errors.length ? { error: "invalid fixture props" } : body,
        ),
      );
      return;
    }
    if (req.url === "/app.js") {
      res.setHeader("content-type", "text/javascript");
      res.end(result.outputFiles[0].contents);
      return;
    }
    if (req.url === "/style.css") {
      res.setHeader("content-type", "text/css");
      res.end(style);
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
    res.setHeader("content-type", "text/html");
    res.end(
      '<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="/style.css"></head><body><div id="root"></div><script src="/app.js"></script></body></html>',
    );
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(async () => {
    const closed = new Promise((resolve) => server.close(resolve));
    server.closeAllConnections();
    await closed;
  });
  const origin = `http://127.0.0.1:${server.address().port}`,
    browser = await chromium.launch({
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
    for (const variant of prizeNumberVariants) {
      const page = await browser.newPage({ viewport });
      page.on("pageerror", (error) => errors.push(error.message));
      await page.route("**/*", (route) => {
        const request = route.request();
        requests.push({ url: request.url(), method: request.method() });
        return new URL(request.url()).origin === origin
          ? route.continue()
          : route.abort();
      });
      await page.goto(`${origin}/?source=${variant.sha256}`);
      await page.waitForSelector("#empty");
      assert.equal(await page.getByTestId("cup-entry-prize").count(), 0);
      await page.click("#load");
      await page.waitForSelector("#display");
      assert.equal(
        await page
          .getByRole("heading", { name: "caller-provided-title", exact: true })
          .count(),
        1,
      );
      assert.equal(
        await page.getByTestId("cup-tier-1").textContent(),
        "fixture-single:1$1,000",
      );
      assert.equal(
        await page.getByTestId("cup-tier-3").textContent(),
        "fixture-range:3/5fixture-each:2 SOL",
      );
      assert.deepEqual(
        await page.getByTestId("cup-entry-prize").allTextContents(),
        ["1000", "2 SOL", "2 SOL", "2 SOL"],
      );
      for (const rank of [0, 2, 6])
        assert.equal(
          await page
            .locator(`[data-rank="${rank}"]`)
            .getByTestId("cup-entry-prize")
            .count(),
          0,
        );
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      const bounds = await page
        .locator("#display")
        .evaluate((element) => ({
          width: element.clientWidth,
          scroll: element.scrollWidth,
        }));
      assert.ok(bounds.scroll <= bounds.width + 1, JSON.stringify(bounds));
      await page.evaluate(() => document.fonts.ready);
      if (process.env.PRIZE_DISPLAY_SCREENSHOTS_DIR) {
        await mkdir(process.env.PRIZE_DISPLAY_SCREENSHOTS_DIR, {
          recursive: true,
        });
        await page.screenshot({
          path: path.join(
            process.env.PRIZE_DISPLAY_SCREENSHOTS_DIR,
            `display-${name}-${variant.sha256.slice(0, 12)}.png`,
          ),
          fullPage: true,
        });
      }
      await page.click("#locale");
      await page.waitForFunction(() =>
        document
          .querySelector('[data-testid="cup-tier-1"]')
          .textContent.includes("1.000"),
      );
      assert.ok(
        (await page.getByTestId("cup-tier-1").textContent()).includes(
          "1.000 $",
        ),
      );
      assert.equal(
        await page
          .locator('[data-rank="1"]')
          .getByTestId("cup-entry-prize")
          .textContent(),
        "1000",
      );
      await page.click("#invalid");
      await page.waitForSelector('[role="alert"]');
      assert.equal(await page.locator("#display").count(), 0);
      await page.click("#clear");
      await page.waitForSelector("#empty");
      assert.equal(await page.locator('[role="alert"]').count(), 0);
      await page.close();
    }
  assert.deepEqual(errors, []);
  assert.equal(admitted.filter((row) => row.valid).length, 4);
  assert.equal(admitted.filter((row) => !row.valid).length, 4);
  assert.ok(
    requests.every(
      (request) =>
        new URL(request.url).origin === origin && request.method === "GET",
    ),
  );
});
