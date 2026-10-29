import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { chromium } from "@playwright/test";

const baseUrl = process.env.PORTFOLIO_BASE_URL ?? "http://localhost:3010";
const address =
  process.env.PORTFOLIO_LIVE_ADDRESS ??
  "HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH";
const screenshotPath = resolve(
  process.env.PORTFOLIO_LIVE_SCREENSHOT ??
    "visual/portfolio-live-20261028/mainnet-1440x900.png",
);
const mobileScreenshotPath = resolve(
  process.env.PORTFOLIO_LIVE_MOBILE_SCREENSHOT ??
    "visual/portfolio-live-20261028/mainnet-390x844.png",
);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const consoleErrors = [];
const pageErrors = [];
const browserRequests = [];
const portfolioResponses = [];

page.on("console", (message) => {
  if (message.type() === "error") consoleErrors.push(message.text());
});
page.on("pageerror", (error) => pageErrors.push(error.message));
page.on("request", (request) => {
  browserRequests.push({ method: request.method(), url: request.url() });
});
page.on("response", async (response) => {
  if (!new URL(response.url()).pathname.endsWith("/api/portfolio")) return;
  try {
    portfolioResponses.push(await response.json());
  } catch {
    portfolioResponses.push({ ok: false, parseFailure: true });
  }
});

try {
  await page.goto(`${baseUrl}/portfolio`, { waitUntil: "networkidle" });
  await page.getByLabel("Solana public-key address").fill(address);
  await page.getByRole("button", { name: "Load wallet" }).click();
  await page.getByTestId("portfolio-result").waitFor({ timeout: 30_000 });
  await page.getByRole("heading", { name: "Solana mainnet-beta" }).waitFor();
  const firstCount = portfolioResponses.length;
  assert(
    firstCount >= 1,
    "the live browser did not receive a portfolio response",
  );
  const refreshResponse = page.waitForResponse(
    (response) =>
      new URL(response.url()).pathname.endsWith("/api/portfolio") &&
      response.status() === 200,
    { timeout: 30_000 },
  );
  await page.getByRole("button", { name: "Refresh live balances" }).click();
  const refreshResult = await refreshResponse;
  const refreshPayload = await refreshResult.json();
  assert.equal(
    refreshPayload?.ok,
    true,
    "refresh did not return a live result",
  );
  await page.waitForTimeout(250);

  await mkdir(dirname(screenshotPath), { recursive: true });
  await page.screenshot({ path: screenshotPath, fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  const mobileResponse = page.waitForResponse(
    (response) =>
      new URL(response.url()).pathname.endsWith("/api/portfolio") &&
      response.status() === 200,
    { timeout: 30_000 },
  );
  await page.reload({ waitUntil: "networkidle" });
  await mobileResponse;
  await page.getByTestId("portfolio-result").waitFor({ timeout: 30_000 });
  assert.equal(
    await page
      .locator("[data-app-shell]")
      .getAttribute("data-mobile-navigation"),
    "closed",
  );
  const mobileDimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  assert(
    mobileDimensions.scrollWidth <= mobileDimensions.clientWidth,
    "the live mobile page has horizontal overflow",
  );
  await page.screenshot({ path: mobileScreenshotPath, fullPage: true });

  const successful = portfolioResponses.filter((value) => value?.ok === true);
  assert(
    successful.length >= 3,
    "live load, refresh and mobile reload did not all succeed",
  );
  const latest = successful.at(-1);
  assert.equal(latest.cluster, "mainnet-beta");
  assert.equal(
    latest.genesisHash,
    "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d",
  );
  assert.equal(latest.address, address);
  assert.equal(latest.commitment, "confirmed");
  assert.equal(typeof latest.sol.lamports, "string");
  assert(Number.isSafeInteger(latest.sol.contextSlot));
  assert(Number.isSafeInteger(latest.splToken.contextSlot));
  assert(Number.isSafeInteger(latest.token2022.contextSlot));

  const baseOrigin = new URL(baseUrl).origin;
  assert.deepEqual(
    browserRequests.filter(({ url }) => new URL(url).origin !== baseOrigin),
    [],
    "the browser contacted an external origin",
  );
  assert.equal(
    browserRequests.some(({ method }) =>
      ["POST", "PUT", "PATCH", "DELETE"].includes(method),
    ),
    false,
    "the browser issued a mutation request",
  );
  assert.deepEqual(consoleErrors, []);
  assert.deepEqual(pageErrors, []);
  console.log(
    JSON.stringify(
      {
        verifiedAt: new Date().toISOString(),
        address,
        browserRequests: browserRequests.length,
        livePortfolioResponses: successful.length,
        screenshot: screenshotPath,
        mobileScreenshot: mobileScreenshotPath,
        result: {
          observedAt: latest.observedAt,
          cluster: latest.cluster,
          genesisHash: latest.genesisHash,
          commitment: latest.commitment,
          endpointHost: latest.endpointHost,
          sol: latest.sol,
          splToken: {
            contextSlot: latest.splToken.contextSlot,
            accounts: latest.splToken.accounts.length,
            mints: latest.splToken.mints.length,
          },
          token2022: {
            contextSlot: latest.token2022.contextSlot,
            accounts: latest.token2022.accounts.length,
            mints: latest.token2022.mints.length,
          },
        },
      },
      null,
      2,
    ),
  );
} finally {
  await page.close();
  await browser.close();
}
