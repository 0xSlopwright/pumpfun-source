import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "@playwright/test";

const baseURL = process.env.CREATE_VISUAL_BASE_URL ?? "http://127.0.0.1:3011";
const output = resolve("visual/create-coin-20261028");
const png = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
  "base64",
);

async function populate(page) {
  await page.getByLabel(/^Coin name/).fill("Daybreak Coin");
  await page.getByLabel(/^Ticker/).fill("DAY");
  await page
    .getByLabel(/^Description/)
    .fill("A local metadata draft with no wallet or launch action.");
  await page
    .getByLabel("Website", { exact: true })
    .fill("https://example.com/coin");
  await page.getByLabel("X / Twitter").fill("https://x.com/daybreak");
  await page
    .getByLabel("Telegram", { exact: true })
    .fill("https://t.me/daybreak");
  await page.getByLabel(/^Coin image/).setInputFiles({
    name: "daybreak.png",
    mimeType: "image/png",
    buffer: png,
  });
}

async function capture(browser, device, width, height, state, prepare) {
  const page = await browser.newPage({ viewport: { width, height } });
  const browserErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") browserErrors.push(message.text());
  });
  page.on("pageerror", (error) => browserErrors.push(error.message));
  await page.goto(`${baseURL}/create`);
  if (prepare) await prepare(page);
  await page.screenshot({
    path: resolve(output, `${state}-${device}-${width}x${height}.png`),
    fullPage: false,
    caret: "initial",
  });
  if (browserErrors.length) {
    throw new Error(
      `${state}-${device} emitted browser errors:\n${browserErrors.join("\n")}`,
    );
  }
  await page.close();
}

await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  for (const [device, width, height] of [
    ["desktop", 1440, 900],
    ["mobile", 390, 844],
  ]) {
    await capture(browser, device, width, height, "default");
    await capture(browser, device, width, height, "populated", populate);
    await capture(browser, device, width, height, "invalid", async (page) => {
      await page.getByRole("button", { name: "Preview draft" }).click();
      await page.getByText("Enter a coin name.").waitFor();
      await page.evaluate(() => window.scrollTo(0, 0));
    });
    await capture(browser, device, width, height, "preview", async (page) => {
      await populate(page);
      await page.getByText("Inspect draft JSON").click();
      await page.getByRole("button", { name: "Preview draft" }).click();
      await page.locator(".create-preview").scrollIntoViewIfNeeded();
    });
  }
} finally {
  await browser.close();
}
