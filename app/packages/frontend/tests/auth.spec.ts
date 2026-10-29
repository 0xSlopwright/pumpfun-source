import { expect, test, type Page } from "@playwright/test";

const dialog = (page: Page) => page.getByTestId("auth-dialog");
const signIn = (page: Page) => page.getByTestId("sign-in-button");
const viewports = [
  { width: 320, height: 640 },
  { width: 375, height: 812 },
  { width: 768, height: 1024 },
  { width: 1440, height: 900 },
];

test("default entrypoint opens a safe chooser, expands wallets and restores focus without URL changes", async ({
  page,
}) => {
  const requests: string[] = [];
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (
      !["localhost", "127.0.0.1"].includes(url.hostname) ||
      !["GET", "HEAD"].includes(request.method())
    )
      requests.push(`${request.method()} ${request.url()}`);
  });
  await page.goto("/explore?q=auth-preserves-this");
  const before = page.url();
  await signIn(page).click();
  await expect(dialog(page)).toBeVisible();
  await expect(dialog(page)).toHaveAttribute("data-auth-state", "ready");
  await expect(dialog(page)).toContainText(
    "Local reconstruction — sign-in is unavailable.",
  );
  await expect(
    dialog(page).getByRole("heading", { name: "Welcome back" }),
  ).toBeVisible();
  for (const provider of ["google", "apple", "github"])
    await expect(page.getByTestId(`auth-${provider}-button`)).toBeDisabled();
  await expect(dialog(page).locator("input, form, textarea")).toHaveCount(0);
  await expect(page.getByTestId("auth-wallet-option")).toHaveCount(2);
  await expect(page.getByTestId("auth-wallet-option").first()).toContainText(
    "Phantom",
  );
  await expect(page.getByTestId("auth-wallet-option").nth(1)).toContainText(
    "Coinbase Wallet",
  );
  for (const row of await page.getByTestId("auth-wallet-option").all())
    await expect(row).toBeDisabled();
  await page.getByTestId("show-all-wallets-button").click();
  await expect(
    dialog(page).getByRole("heading", { name: "Select wallet" }),
  ).toBeVisible();
  await expect(page.getByTestId("auth-wallet-option")).toHaveCount(3);
  await expect(
    dialog(page).getByRole("button", { name: "Back", exact: true }),
  ).toBeFocused();
  await dialog(page).getByRole("button", { name: "Back", exact: true }).click();
  await expect(page.getByTestId("show-all-wallets-button")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog(page)).not.toBeVisible();
  await expect(signIn(page)).toBeFocused();
  await expect(page).toHaveURL(before);
  await signIn(page).click();
  await expect(page.getByTestId("auth-wallet-preview")).toBeVisible();
  await dialog(page)
    .getByRole("button", { name: "Close", exact: true })
    .click();
  await expect(signIn(page)).toBeFocused();
  expect(requests).toEqual([]);
  expect(errors).toEqual([]);
});

for (const viewport of viewports) {
  test(`chooser fits and contains keyboard focus at ${viewport.width}×${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/explore");
    await signIn(page).click();
    await expect(dialog(page)).toHaveAttribute("data-auth-state", "ready");
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press(i % 2 ? "Shift+Tab" : "Tab");
      expect(
        await dialog(page).evaluate((element) =>
          element.contains(document.activeElement),
        ),
      ).toBe(true);
    }
    const bounds = await dialog(page).boundingBox();
    expect(bounds).not.toBeNull();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(viewport.width);
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(viewport.height);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.getByTestId("show-all-wallets-button").click();
    await expect(page.getByTestId("auth-all-wallets")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog(page)).not.toBeVisible();
    await expect(signIn(page)).toBeFocused();
  });
}

test("history navigation dismisses auth instead of reopening it on Forward", async ({
  page,
}) => {
  await page.goto("/explore?q=first");
  await page.goto("/explore?q=second");
  await signIn(page).click();
  await expect(dialog(page)).toBeVisible();
  await page.goBack();
  await expect(dialog(page)).not.toBeVisible();
  await expect(page).toHaveURL(/q=first$/);
  await page.goForward();
  await expect(dialog(page)).not.toBeVisible();
});

test.describe("explicit synthetic adapter fixture (never a product route)", () => {
  test.skip(
    process.env.AUTH_INTERFACE_TEST_MODE !== "1",
    "Run only through with-auth-fixture.mjs in an isolated checkout",
  );

  async function choose(page: Page, scenario: string) {
    await page.goto("/auth-interface-test");
    await page.getByLabel("Test scenario").selectOption(scenario);
    await page
      .getByTestId("auth-fixture-control")
      .getByTestId("sign-in-button")
      .click();
    return page
      .getByTestId("auth-dialog")
      .filter({ hasText: "Synthetic UI test" });
  }

  test("loading → ready preserves synthetic label and captured wallet prioritization", async ({
    page,
  }) => {
    const current = await choose(page, "slow");
    await expect(current).toHaveAttribute("data-auth-state", "loading");
    await expect(current).toContainText("Opening sign in...");
    await expect(current).toHaveAttribute("data-auth-state", "ready");
    const rows = current.getByTestId("auth-wallet-option");
    await expect(rows.first()).toContainText("Test recent");
    await expect(rows.nth(1)).toContainText("Test installed");
    await expect(current).toContainText("not an authenticated account");
  });

  test("failure → retry → ready with generic error copy and no raw provider failure", async ({
    page,
  }) => {
    const current = await choose(page, "retry");
    await expect(current).toHaveAttribute("role", "alertdialog");
    await expect(current).toHaveAttribute("data-auth-state", "error");
    await expect(current).not.toContainText("synthetic read failure");
    await current.getByTestId("sign-in-retry").click();
    await expect(current).toHaveAttribute("data-auth-state", "ready");
    await expect(current).toHaveAttribute("role", "dialog");
    await expect(
      current.getByRole("button", { name: "Close", exact: true }),
    ).toBeFocused();
  });

  test("captured fifteen-second timeout offers recovery and can be dismissed", async ({
    page,
  }) => {
    await page.clock.install();
    const current = await choose(page, "timeout");
    await expect(current).toHaveAttribute("data-auth-state", "loading");
    await page.clock.fastForward(15_001);
    await expect(current).toHaveAttribute("data-auth-state", "error");
    await expect(current).toContainText(
      "It's taking longer than expected to load.",
    );
    await expect(current.getByTestId("sign-in-reload")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(current).not.toBeVisible();
  });

  test("close/reopen blocks a stale read from replacing newer expired-session presentation", async ({
    page,
  }) => {
    const current = await choose(page, "stale");
    await expect(current).toHaveAttribute("data-auth-state", "loading");
    await current.getByRole("button", { name: "Close", exact: true }).click();
    await page
      .getByTestId("auth-fixture-control")
      .getByTestId("sign-in-button")
      .click();
    await expect(current).toContainText("Your session has expired.");
    await page.waitForTimeout(2_100);
    await expect(current).toContainText("Your session has expired.");
  });

  test("malformed read response remains an error; no signed-in state is rendered", async ({
    page,
  }) => {
    const current = await choose(page, "invalid");
    await expect(current).toHaveAttribute("data-auth-state", "error");
    await expect(current).not.toContainText("Signed in");
  });

  test("empty wallet list is an honest unavailable state, not a claim of browser detection", async ({
    page,
  }) => {
    const current = await choose(page, "empty");
    await expect(current).toContainText(
      "Wallet extensions have not been checked.",
    );
    await expect(current.getByTestId("auth-wallet-option")).toHaveCount(0);
  });

  test("long synthetic wallet lists remain scrollable on small screens", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    const current = await choose(page, "many");
    await current.getByTestId("show-all-wallets-button").click();
    await expect(current.getByTestId("auth-wallet-option")).toHaveCount(40);
    const list = current.getByTestId("auth-all-wallets");
    expect(
      await list.evaluate(
        (element) => element.scrollHeight > element.clientHeight,
      ),
    ).toBe(true);
    expect(
      await current.evaluate(
        (element) => element.scrollWidth <= element.clientWidth,
      ),
    ).toBe(true);
  });
});
