import { expect, test, type Page } from "@playwright/test";
import { createServer, type Server } from "node:http";
import { createRequire } from "node:module";
import path from "node:path";
import type {} from "./notification-settings.fixture";

let server: Server;
let origin: string;
let pageErrors: string[];
let externalRequests: string[];

test.beforeAll(async ({}, testInfo) => {
  const frontendRoot = path.resolve(path.dirname(testInfo.file), "..");
  // tsx and its esbuild dependency already have exact versions in the app lockfile.
  // Resolve through that declared dependency, without introducing an install or lock change.
  const backendRequire = createRequire(
    path.join(frontendRoot, "../backend/package.json"),
  );
  const tsxRequire = createRequire(backendRequire.resolve("tsx/package.json"));
  const { build } = tsxRequire("esbuild") as {
    build: (options: Record<string, unknown>) => Promise<{
      outputFiles: Array<{ path: string; contents: Uint8Array }>;
    }>;
  };

  const result = await build({
    entryPoints: [
      path.join(frontendRoot, "tests/notification-settings.fixture.tsx"),
    ],
    bundle: true,
    platform: "browser",
    format: "esm",
    jsx: "automatic",
    outdir: "notification-fixture-output",
    write: false,
    define: { "process.env.NODE_ENV": '"development"' },
  });
  const javascript = result.outputFiles!.find((file) =>
    file.path.endsWith(".js"),
  )!.contents;
  const css = result.outputFiles!.find((file) =>
    file.path.endsWith(".css"),
  )!.contents;
  server = createServer((request, response) => {
    if (request.url === "/fixture.js") {
      response
        .writeHead(200, { "content-type": "text/javascript" })
        .end(javascript);
    } else if (request.url === "/fixture.css") {
      response.writeHead(200, { "content-type": "text/css" }).end(css);
    } else if (request.url === "/") {
      response
        .writeHead(200, { "content-type": "text/html" })
        .end(
          '<!doctype html><html><head><meta charset="utf-8"><title>Local notification test</title><link rel="stylesheet" href="/fixture.css"></head><body><div id="root"></div><script type="module" src="/fixture.js"></script></body></html>',
        );
    } else {
      response.writeHead(404).end();
    }
  });
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => resolve());
  });
  const address = server.address();
  if (!address || typeof address === "string")
    throw new Error("Expected local TCP address");
  origin = `http://127.0.0.1:${address.port}`;
});
test.afterAll(async () => {
  if (server)
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
});
test.beforeEach(async ({ page }) => {
  pageErrors = [];
  externalRequests = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.route("**/*", (route) => {
    if (new URL(route.request().url()).origin === origin)
      return route.continue();
    externalRequests.push(route.request().url());
    return route.abort();
  });
  await page.addInitScript(() => {
    if (typeof Notification !== "undefined")
      Object.defineProperty(Notification, "requestPermission", {
        value: () => {
          throw new Error("Unexpected permission request");
        },
      });
    if (navigator.serviceWorker)
      Object.defineProperty(navigator.serviceWorker, "register", {
        value: () => {
          throw new Error("Unexpected service worker registration");
        },
      });
    Storage.prototype.setItem = () => {
      throw new Error("Unexpected storage write");
    };
  });
  await page.goto(origin);
});
test.afterEach(() => {
  expect(pageErrors).toEqual([]);
  expect(externalRequests).toEqual([]);
});
async function activate(page: Page) {
  await page.getByRole("button", { name: "Enable synthetic fixture" }).click();
  await expect(page.getByRole("switch", { name: "Group chats" })).toBeEnabled();
  await expect(
    page.getByText("Synthetic local data — not account settings.", {
      exact: true,
    }),
  ).toBeVisible();
}

test("default has exact unavailable fallbacks; explicit StrictMode fixture loads without enabling push or unknown values", async ({
  page,
}) => {
  await expect(
    page.getByText("Default values unavailable.", { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("switch")).toHaveCount(0);
  expect(
    await page.evaluate(() => window.notificationFixture.first.calls()),
  ).toEqual([]);
  await activate(page);
  await expect(
    page.getByRole("switch", { name: "Group chats" }),
  ).toHaveAttribute("aria-checked", "false");
  await expect(
    page.locator('[data-setting-id="notifications.browserPush"] .unavailable'),
  ).toBeVisible();
  await expect(
    page.locator(
      '[data-setting-id="topics.quiet_trending_searches"] .unavailable',
    ),
  ).toBeVisible();
  const calls = await page.evaluate(() =>
    window.notificationFixture.first.calls(),
  );
  expect(
    calls.filter((call) => call.operation === "readSettings").length,
  ).toBeGreaterThanOrEqual(2);
  await page.getByRole("button", { name: "Use unavailable adapter" }).click();
  await expect(page.getByRole("switch")).toHaveCount(0);
  await expect(
    page.getByText("Default values unavailable.", { exact: true }),
  ).toBeVisible();
});

test("preference pending state survives filtering while topic controls remain independent", async ({
  page,
}) => {
  await activate(page);
  await page.evaluate(() => window.notificationFixture.first.holdSettings());
  await page.getByRole("switch", { name: "Group chats" }).click();
  await expect(
    page.getByRole("switch", { name: "Group chats" }),
  ).toBeDisabled();
  await expect(
    page.getByRole("switch", { name: "Trending livestreams" }),
  ).toBeEnabled();
  await page.getByLabel("Filter controls").fill("followers");
  await expect(page.getByRole("switch", { name: "Group chats" })).toHaveCount(
    0,
  );
  await expect(
    page.getByRole("switch", { name: "New followers" }),
  ).toBeDisabled();
  await page.getByLabel("Filter controls").clear();
  await expect(
    page.getByRole("switch", { name: "Group chats" }),
  ).toBeDisabled();
  await page.evaluate(() => window.notificationFixture.first.releaseSettings());
  await expect(
    page.getByRole("switch", { name: "Group chats" }),
  ).toHaveAttribute("aria-checked", "true");
  const writes = await page.evaluate(() =>
    window.notificationFixture.first
      .calls()
      .filter((call) => call.operation === "writeSettings"),
  );
  expect(writes).toHaveLength(1);
  expect(writes[0].payload).toEqual({
    chat: { allowGroupNotifications: true, extra: { keep: "group" } },
    social: { allowFollowerNotifications: false },
    coins: { allowCalloutNotifications: false },
  });
});

test("failed preference and topic writes retain values and retry explicitly", async ({
  page,
}) => {
  await activate(page);
  await page.evaluate(() => window.notificationFixture.first.failSettings());
  await page.getByRole("switch", { name: "Group chats" }).click();
  await expect(
    page
      .getByRole("alert")
      .filter({ hasText: "Local preference change failed" }),
  ).toBeVisible();
  await expect(
    page.getByRole("switch", { name: "Group chats" }),
  ).toHaveAttribute("aria-checked", "false");
  await page
    .getByRole("button", { name: "Retry preference change", exact: true })
    .click();
  await expect(
    page.getByRole("switch", { name: "Group chats" }),
  ).toHaveAttribute("aria-checked", "true");
  await page.evaluate(() => window.notificationFixture.first.failTopic());
  await page.getByRole("switch", { name: "Trending livestreams" }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "Local topic change failed" }),
  ).toBeVisible();
  await expect(
    page.getByRole("switch", { name: "Trending livestreams" }),
  ).toHaveAttribute("aria-checked", "false");
  await page
    .getByRole("button", { name: "Retry topic change", exact: true })
    .click();
  await expect(
    page.getByRole("switch", { name: "Trending livestreams" }),
  ).toHaveAttribute("aria-checked", "true");
});

test("failed post-mutation refresh renders topic unavailable until explicit read retry", async ({
  page,
}) => {
  await activate(page);
  await page.evaluate(() => window.notificationFixture.first.failTopicsRead());
  await page.getByRole("switch", { name: "Trending livestreams" }).click();
  await expect(
    page
      .getByRole("alert")
      .filter({ hasText: "Local topics could not be refreshed" }),
  ).toBeVisible();
  await expect(
    page.getByRole("switch", { name: "Trending livestreams" }),
  ).toHaveCount(0);
  await expect(
    page.locator('[data-setting-id="topics.trending"] .unavailable'),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Retry local topics", exact: true })
    .click();
  await expect(
    page.getByRole("switch", { name: "Trending livestreams" }),
  ).toHaveAttribute("aria-checked", "true");
});

test("close/reopen and session changes discard pending completion without remounting filtered rows", async ({
  page,
}) => {
  await activate(page);
  await page.evaluate(() => window.notificationFixture.first.holdSettings());
  await page.getByRole("switch", { name: "Group chats" }).click();
  await expect(
    page.getByRole("switch", { name: "Group chats" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Close fixture" }).click();
  await expect(
    page.getByRole("switch", { name: "Group chats" }),
  ).not.toBeVisible();
  await page.getByRole("button", { name: "Open fixture" }).click();
  await expect(page.getByRole("switch", { name: "Group chats" })).toBeEnabled();
  await expect(
    page.getByRole("switch", { name: "Group chats" }),
  ).toHaveAttribute("aria-checked", "false");
  await page.getByRole("button", { name: "Change local session" }).click();
  await expect(page.getByLabel("Local session")).toHaveText("second");
  await expect(page.getByRole("switch", { name: "Group chats" })).toBeEnabled();
  await page.evaluate(() => window.notificationFixture.first.releaseSettings());
  await expect
    .poll(() =>
      page.evaluate(() =>
        window.notificationFixture.first
          .calls()
          .some((call) => call.operation === "writeSettings:completed"),
      ),
    )
    .toBe(true);
  await expect(
    page.getByRole("switch", { name: "Group chats" }),
  ).toHaveAttribute("aria-checked", "false");
  await expect(page.getByRole("alert")).toHaveCount(0);
});

for (const width of [360, 1280]) {
  test(`synthetic control fixture fits ${width}px without horizontal overflow`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await activate(page);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    const bounds = await page
      .getByRole("switch", { name: "Group chats" })
      .boundingBox();
    expect(bounds?.height).toBeGreaterThanOrEqual(44);
    await page.screenshot({
      path: testInfo.outputPath(`notification-fixture-${width}.png`),
      fullPage: true,
    });
  });
}
