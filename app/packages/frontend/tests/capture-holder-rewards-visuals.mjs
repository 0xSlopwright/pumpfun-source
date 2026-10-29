import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "@playwright/test";

const baseURL = process.env.HOLDER_REWARDS_VISUAL_BASE_URL ?? "http://127.0.0.1:3011";
const output = resolve("visual/holder-rewards-20261028");
const mint = "So11111111111111111111111111111111111111112";

async function capture(browser, name, width, height, prepare) {
  const page = await browser.newPage({ viewport: { width, height } });
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${baseURL}/holder-rewards`);
  if (prepare) await prepare(page);
  await page.screenshot({
    path: resolve(output, `${name}-${width}x${height}.png`),
    fullPage: false,
    caret: "initial",
  });
  if (errors.length) {
    throw new Error(`${name} emitted browser errors:\n${errors.join("\n")}`);
  }
  await page.close();
}

async function derive(page) {
  await page.getByRole("textbox", { name: "Solana mint address" }).fill(mint);
  await page.getByRole("button", { name: "Derive address" }).click();
  await page.getByTestId("holder-rewards-result").waitFor();
}

await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  await capture(browser, "default-desktop", 1440, 900);
  await capture(browser, "derived-laptop", 1280, 800, derive);
  await capture(browser, "derived-tablet", 768, 1024, derive);
  await capture(browser, "invalid-mobile", 390, 844, async (page) => {
    await page.getByRole("textbox", { name: "Solana mint address" }).fill("not base58 0OIl");
    await page.getByRole("button", { name: "Derive address" }).click();
    await page.locator("#holder-rewards-mint-error").waitFor();
  });
  await capture(browser, "derived-small-mobile", 375, 667, async (page) => {
    await derive(page);
    await page.getByTestId("holder-rewards-result").scrollIntoViewIfNeeded();
  });
} finally {
  await browser.close();
}
