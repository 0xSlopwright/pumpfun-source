import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "@playwright/test";

const baseURL = process.env.MAYHEM_VISUAL_BASE_URL ?? "http://127.0.0.1:3010";
const output = resolve("visual/mayhem-20261028");
const fixture = {
  source: "synthetic-test",
  coins: [
    {
      mint: "MayhemVisualMint111111111111111111111111111111",
      name: "Local Mayhem example",
      symbol: "LOCAL",
      state: "active",
      mode: "auto",
      createdTimestamp: 1761624000000,
      marketCapUsd: 12000,
      volumeUsd24h: 3400,
    },
  ],
};

await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  for (const [label, width, height] of [
    ["small-mobile", 320, 640],
    ["mobile", 375, 812],
    ["tablet", 768, 1024],
    ["desktop", 1440, 900],
  ]) {
    const page = await browser.newPage({ viewport: { width, height } });
    const violations = [];
    page.on("request", (request) => {
      const url = new URL(request.url());
      if (
        url.origin !== new URL(baseURL).origin ||
        !["GET", "HEAD"].includes(request.method())
      ) {
        violations.push(`${request.method()} ${request.url()}`);
      }
    });
    await page.route("**/api/mayhem-screener?*", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(fixture),
      }),
    );
    await page.goto(`${baseURL}/mayhem?state=active&sort=mcap`, {
      waitUntil: "networkidle",
    });
    await page.getByTestId("mayhem-coin-row").waitFor();
    await page.screenshot({
      path: resolve(output, `reconstructed-${label}-${width}x${height}.png`),
      fullPage: false,
      caret: "initial",
    });
    if (violations.length) throw new Error(violations.join("\n"));
    await page.close();
  }
} finally {
  await browser.close();
}
