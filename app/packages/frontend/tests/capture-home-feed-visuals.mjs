import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "@playwright/test";

const baseURL =
  process.env.HOME_FEED_VISUAL_BASE_URL ?? "http://127.0.0.1:3010";
const output = resolve("visual/home-feed-20261028");

await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  for (const [device, width, height] of [
    ["desktop", 1440, 900],
    ["mobile", 390, 844],
  ]) {
    const page = await browser.newPage({ viewport: { width, height } });
    const violations = [];
    page.on("console", (message) => {
      if (message.type() === "error") violations.push(message.text());
    });
    page.on("pageerror", (error) => violations.push(error.message));
    page.on("request", (request) => {
      const url = new URL(request.url());
      if (
        url.origin !== new URL(baseURL).origin ||
        !["GET", "HEAD"].includes(request.method())
      ) {
        violations.push(`${request.method()} ${request.url()}`);
      }
    });

    await page.goto(`${baseURL}/`, { waitUntil: "networkidle" });
    await page.getByTestId("local-feed-item").first().waitFor();
    await page.screenshot({
      path: resolve(output, `local-${device}-${width}x${height}.png`),
      fullPage: false,
      caret: "initial",
    });
    if (violations.length > 0) {
      throw new Error(
        `${device} capture emitted safety violations:\n${violations.join("\n")}`,
      );
    }
    await page.close();
  }
} finally {
  await browser.close();
}
