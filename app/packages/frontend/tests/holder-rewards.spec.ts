import { expect, test, type Page } from "@playwright/test";

const MINT = "So11111111111111111111111111111111111111112";
const PDA = "54SthQvXp5vQrse2JBjVUgsZVU3RrCtPAKQhqcn7XJnh";

function mintInput(page: Page) {
  return page.getByRole("textbox", { name: "Solana mint address" });
}

async function derive(page: Page, mint = MINT) {
  await mintInput(page).fill(mint);
  await page.getByRole("button", { name: "Derive address" }).click();
}

test("holder rewards route replaces the scaffold with an offline inspector", async ({ page }) => {
  const response = await page.goto("/holder-rewards");
  expect(response?.status()).toBe(200);
  await expect(page.getByTestId("holder-rewards-inspector")).toBeVisible();
  await expect(page.getByText("Feature unavailable")).toHaveCount(0);
  await expect(page.getByTestId("holder-rewards-no-result")).toBeVisible();
  await expect(page.getByRole("button", { name: /Claim unavailable/ })).toBeDisabled();
  await expect(page.getByTestId("reward-summary").getByText("Unavailable", { exact: true })).toHaveCount(3);
  await expect(page.getByTestId("reward-summary")).not.toContainText("SOL");
});

test("valid mint derives the exact SDK-backed address and normalizes whitespace", async ({ page }) => {
  await page.goto("/holder-rewards");
  await derive(page, `  ${MINT}\n`);
  const result = page.getByTestId("holder-rewards-result");
  await expect(result).toBeVisible();
  await expect(result.getByText(MINT, { exact: true })).toBeVisible();
  await expect(result.getByText(PDA, { exact: true })).toBeVisible();
  await expect(page.getByText("Computed locally", { exact: true })).toBeVisible();
});

test("empty and malformed keys are rejected without a derived address", async ({ page }) => {
  await page.goto("/holder-rewards");
  const input = mintInput(page);
  await page.getByRole("button", { name: "Derive address" }).click();
  await expect(page.locator("#holder-rewards-mint-error")).toHaveText("Enter a Solana mint address.");
  await expect(input).toHaveAttribute("aria-invalid", "true");
  await expect(input).toHaveAttribute("aria-describedby", /holder-rewards-mint-error/);

  for (const invalid of ["not base58 0OIl", "111", "1".repeat(45)]) {
    await input.fill(invalid);
    await page.getByRole("button", { name: "Derive address" }).click();
    await expect(page.locator("#holder-rewards-mint-error")).toContainText("valid Base58 Solana public key");
    await expect(page.getByTestId("holder-rewards-result")).toHaveCount(0);
  }
});

test("edits invalidate stale results and clear resets the inspector", async ({ page }) => {
  await page.goto("/holder-rewards");
  await derive(page);
  await expect(page.getByText(PDA, { exact: true })).toBeVisible();
  await mintInput(page).fill("11111111111111111111111111111111");
  await expect(page.getByTestId("holder-rewards-result")).toHaveCount(0);
  await page.getByRole("button", { name: "Derive address" }).click();
  await expect(page.getByText("Cxpv3PFKz8jFfeQHUFQRTXCyNUz6WScMG8XrM8wLwBun", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Clear" }).click();
  await expect(mintInput(page)).toHaveValue("");
  await expect(page.getByTestId("holder-rewards-no-result")).toBeVisible();
});

test("copy controls are keyboard reachable and announce their result", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"], {
    origin: "http://127.0.0.1:3010",
  });
  await page.goto("/holder-rewards");
  await derive(page);
  const copy = page.getByRole("button", { name: "Copy holder-rewards pda" });
  await copy.focus();
  await expect(copy).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator('p[aria-hidden="true"]').filter({ hasText: "Holder-rewards PDA copied." })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(PDA);
});

test("form can be completed with the keyboard and preserves shell navigation", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Holder rewards" }).click();
  await expect(page).toHaveURL(/\/holder-rewards$/);
  await mintInput(page).focus();
  await page.keyboard.type(MINT);
  await page.keyboard.press("Enter");
  await expect(page.getByText(PDA, { exact: true })).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.getByRole("link", { name: "Holder rewards" }).click();
  await expect(page).toHaveURL(/\/holder-rewards$/);
  await expect(mintInput(page)).toBeVisible();
});

test("target viewports have no horizontal overflow", async ({ page }) => {
  for (const [width, height] of [
    [1440, 900],
    [1280, 800],
    [768, 1024],
    [390, 844],
    [375, 667],
  ] as const) {
    await page.setViewportSize({ width, height });
    await page.goto("/holder-rewards");
    await derive(page);
    await expect(page.getByText(PDA, { exact: true })).toBeVisible();
    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scrollWidth, `${width}px`).toBeLessThanOrEqual(dimensions.clientWidth);
  }
});

test("inspection performs no external request, mutation, wallet prompt or transaction", async ({ page, context }) => {
  const violations: string[] = [];
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (url.origin !== "http://127.0.0.1:3010" || !["GET", "HEAD"].includes(request.method())) {
      violations.push(`${request.method()} ${request.url()}`);
    }
  });

  await context.grantPermissions(["clipboard-read", "clipboard-write"], {
    origin: "http://127.0.0.1:3010",
  });
  await page.goto("/holder-rewards");
  await derive(page);
  await page.getByRole("button", { name: "Copy normalized mint" }).click();
  await expect(page.locator('p[aria-hidden="true"]').filter({ hasText: "Normalized mint copied." })).toBeVisible();
  await expect(page.getByText(/connect wallet/i)).toHaveCount(0);
  await expect(page.getByText(/transaction submitted/i)).toHaveCount(0);

  expect(violations).toEqual([]);
  expect(consoleErrors).toEqual([]);
});
