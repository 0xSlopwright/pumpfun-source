import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "@playwright/test";

const baseURL = process.env.LIVE_VISUAL_BASE_URL ?? "http://127.0.0.1:3011";
const output = resolve("visual/live-20261028");

async function capture(browser, name, width, height, prepare) {
  const page = await browser.newPage({ viewport: { width, height } });
  const errors = [];
  const external = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => {
    if (new URL(request.url()).origin !== new URL(baseURL).origin) {
      external.push(request.url());
    }
  });
  await page.goto(`${baseURL}/live`);
  await page.getByTestId("archived-stream-card").first().waitFor();
  if (prepare) await prepare(page);
  await page.screenshot({
    path: resolve(output, `${name}-${width}x${height}.png`),
    fullPage: false,
    caret: "initial",
  });
  if (errors.length || external.length) {
    throw new Error(
      `${name} failed safety checks:\n${[...errors, ...external].join("\n")}`,
    );
  }
  await page.close();
}

await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  await capture(browser, "discovery-desktop", 1440, 900);
  await capture(browser, "discovery-laptop", 1280, 800);
  await capture(browser, "discovery-tablet", 768, 1024);
  await capture(browser, "discovery-mobile", 375, 812);
  await capture(browser, "discovery-small-mobile", 320, 640);
  await capture(
    browser,
    "playback-unavailable-mobile",
    375,
    812,
    async (page) => {
      await page
        .getByRole("button", { name: "Inspect archived stream M $M" })
        .click();
      const panel = page.getByTestId("playback-unavailable");
      await panel.waitFor();
      await panel.scrollIntoViewIfNeeded();
    },
  );
  await capture(browser, "keyboard-focus-mobile", 375, 812, async (page) => {
    await page
      .getByRole("searchbox", { name: "Search captured streams" })
      .focus();
  });
} finally {
  await browser.close();
}
