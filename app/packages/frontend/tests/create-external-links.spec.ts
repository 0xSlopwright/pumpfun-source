import { expect, test, type Page } from "@playwright/test";

const key = "privacy.confirm-external-links";
const destination = "https://example.com/my-coin";
const dialog = (page: Page) =>
  page.getByRole("dialog", { name: "Open external link?" });
const website = (page: Page) =>
  page
    .getByRole("list", { name: "Draft social links" })
    .getByRole("link", { name: "Website", exact: true });

async function opened(page: Page) {
  return page.evaluate(
    () => (window as unknown as { openedLinks: string[][] }).openedLinks,
  );
}

test.beforeEach(async ({ page, context, baseURL }) => {
  const origin = new URL(baseURL!).origin;
  await context.route("**/*", (route) => {
    const url = new URL(route.request().url());
    return url.origin === origin
      ? route.continue()
      : route.abort();
  });
  await page.addInitScript(() => {
    const calls: string[][] = [];
    (window as unknown as { openedLinks: string[][] }).openedLinks = calls;
    window.open = (url, target, features) => {
      calls.push([String(url), target ?? "", features ?? ""]);
      return null;
    };
  });
});

test("Create draft links ask before opening and cancellation keeps the draft", async ({
  page,
}) => {
  await page.goto("/create");
  await page.getByLabel("Website", { exact: true }).fill(destination);
  await website(page).click();
  await expect(dialog(page)).toBeVisible();
  expect(await opened(page)).toEqual([]);
  await expect(dialog(page)).toContainText(destination);
  await dialog(page).getByRole("checkbox").check();
  await dialog(page)
    .getByRole("button", { name: "Cancel", exact: true })
    .click();
  await expect(dialog(page)).not.toBeVisible();
  expect(await opened(page)).toEqual([]);
  await expect(website(page)).toBeFocused();
  await expect(page.getByLabel("Website", { exact: true })).toHaveValue(
    destination,
  );
  expect(
    await page.evaluate((key) => localStorage.getItem(key), key),
  ).toBeNull();
  await website(page).click();
  await expect(dialog(page).getByRole("checkbox")).not.toBeChecked();
  await page.keyboard.press("Escape");
  await expect(dialog(page)).not.toBeVisible();
  expect(await opened(page)).toEqual([]);
  await website(page).click();
  await dialog(page)
    .getByRole("button", { name: "Open link", exact: true })
    .click();
  await expect(dialog(page)).not.toBeVisible();
  expect(await opened(page)).toEqual([
    [destination, "_blank", "noopener,noreferrer"],
  ]);
});

async function privacySwitch(page: Page) {
  await page
    .getByRole("button", { name: "Open settings", exact: true })
    .click();
  const settings = page.getByRole("dialog", { name: "Settings", exact: true });
  await settings.getByRole("tab", { name: "Privacy", exact: true }).click();
  const control = settings.getByRole("switch", {
    name: "Confirm before opening external links",
  });
  await expect(control).toBeEnabled();
  return { settings, control };
}

test("remembering confirmation updates Settings and survives reload", async ({
  page,
}) => {
  await page.goto("/create");
  await page.getByLabel("Website", { exact: true }).fill(destination);
  await website(page).click();
  await dialog(page).getByRole("checkbox").check();
  await dialog(page)
    .getByRole("button", { name: "Open link", exact: true })
    .click();
  expect(await page.evaluate((key) => localStorage.getItem(key), key)).toBe(
    "false",
  );
  await website(page).click();
  expect(await opened(page)).toHaveLength(2);
  await expect(dialog(page)).not.toBeVisible();
  const { settings, control } = await privacySwitch(page);
  await expect(control).toHaveAttribute("aria-checked", "false");
  await settings.getByRole("button", { name: "Done", exact: true }).click();
  await expect(page).toHaveURL(/\/create$/);
  await page.reload();
  await page.getByLabel("Website", { exact: true }).fill(destination);
  await website(page).click();
  expect(await opened(page)).toEqual([
    [destination, "_blank", "noopener,noreferrer"],
  ]);
  const next = await privacySwitch(page);
  await next.control.click();
  await expect(next.control).toHaveAttribute("aria-checked", "true");
  await next.settings
    .getByRole("button", { name: "Done", exact: true })
    .click();
  await website(page).click();
  await expect(dialog(page)).toBeVisible();
  expect(await opened(page)).toHaveLength(1);
});

test("trusted destinations bypass confirmation while social links use it", async ({
  page,
}) => {
  await page.goto("/create");
  await page
    .getByLabel("Website", { exact: true })
    .fill("https://www.pump.fun/");
  await website(page).click();
  expect(await opened(page)).toEqual([
    ["https://www.pump.fun/", "_blank", "noopener,noreferrer"],
  ]);
  await expect(dialog(page)).not.toBeVisible();
  await page.getByLabel("X / Twitter").fill("https://x.com/local-draft");
  await page
    .getByLabel("Telegram", { exact: true })
    .fill("https://t.me/local-draft");
  const links = page.getByRole("list", { name: "Draft social links" });
  for (const [label, url] of [
    ["X / Twitter", "https://x.com/local-draft"],
    ["Telegram", "https://t.me/local-draft"],
  ]) {
    await links.getByRole("link", { name: label, exact: true }).click();
    await expect(dialog(page)).toContainText(url);
    await dialog(page)
      .getByRole("button", { name: "Cancel", exact: true })
      .click();
  }
  expect(await opened(page)).toHaveLength(1);
  await page.getByLabel("Website", { exact: true }).fill("http://example.com/");
  await expect(website(page)).toHaveCount(0);
});

test("Settings and Create share the page fallback when browser storage fails", async ({
  page,
}) => {
  await page.addInitScript((fixedKey) => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (key === fixedKey)
        throw new DOMException("Synthetic failure", "QuotaExceededError");
      return original.call(this, key, value);
    };
  }, key);
  await page.goto("/create");
  await page.getByLabel("Website", { exact: true }).fill(destination);
  const { settings, control } = await privacySwitch(page);
  await control.click();
  await expect(control).toHaveAttribute("aria-checked", "false");
  await expect(
    settings
      .getByRole("status")
      .filter({ hasText: "browser storage could not be confirmed" }),
  ).toBeVisible();
  await settings.getByRole("button", { name: "Done", exact: true }).click();
  await website(page).click();
  await expect(dialog(page)).not.toBeVisible();
  expect(await opened(page)).toEqual([
    [destination, "_blank", "noopener,noreferrer"],
  ]);
  expect(
    await page.evaluate((key) => localStorage.getItem(key), key),
  ).toBeNull();
  await expect(page).toHaveURL(/\/create$/);
  await page.reload();
  await page.getByLabel("Website", { exact: true }).fill(destination);
  await website(page).click();
  await expect(dialog(page)).toBeVisible();
});

test("confirmation remains usable at desktop and mobile widths and releases scrolling", async ({
  page,
}, testInfo) => {
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/create");
    await page.getByLabel("Website", { exact: true }).fill(destination);
    await website(page).click();
    await expect(dialog(page)).toBeVisible();
    await expect(
      dialog(page).getByRole("button", { name: "Cancel", exact: true }),
    ).toBeFocused();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe(
      "hidden",
    );
    const rect = await dialog(page).boundingBox();
    expect(rect).not.toBeNull();
    expect(rect!.x).toBeGreaterThanOrEqual(0);
    expect(rect!.x + rect!.width).toBeLessThanOrEqual(width);
    await page.screenshot({
      path: testInfo.outputPath(`confirmation-${width}.png`),
    });
    await page.keyboard.press("Escape");
    await expect(dialog(page)).not.toBeVisible();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
    expect(await opened(page)).toEqual([]);
  }
});
