import { expect, test, type Page } from "@playwright/test";

function collectSafetyViolations(page: Page) {
  const requests: string[] = [];
  const consoleErrors: string[] = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (
      url.origin !== "http://127.0.0.1:3010" ||
      !["GET", "HEAD"].includes(request.method())
    ) {
      requests.push(`${request.method()} ${request.url()}`);
    }
  });
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  return { requests, consoleErrors };
}

test("resolves an exact user id into a disclosed read-only profile", async ({
  page,
}) => {
  const safety = collectSafetyViolations(page);
  const response = await page.goto("/profile/user-001");
  expect(response?.status()).toBe(200);

  await expect(
    page.getByText("Local synthetic example — not a real Pump.fun user", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 1, name: "alice_pump" }),
  ).toBeVisible();
  await expect(page.getByTestId("profile-header")).toContainText(
    "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
  );
  await expect(page.getByTestId("local-feed-item")).toHaveCount(1);
  await expect(page.getByTestId("local-feed-item")).toContainText(
    "First post on synthetic pump!",
  );
  await expect(page.getByText("Reply 3 to Alice")).toHaveCount(0);
  await expect(page.locator("main img")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Follow unavailable" }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Copy wallet address" }),
  ).toBeEnabled();

  expect(safety.requests).toEqual([]);
  expect(safety.consoleErrors).toEqual([]);
});

test("resolves exact wallet addresses and preserves browser history", async ({
  page,
}) => {
  const wallet = "HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH";
  await page.goto("/profile/user-001");
  await page.goto(`/profile/${wallet}`);
  await expect(
    page.getByRole("heading", { level: 1, name: "chad_group" }),
  ).toBeVisible();
  await expect(page.getByText("Local group example")).toBeVisible();
  await expect(page.getByText("Members")).toBeVisible();
  await expect(page.getByText("42", { exact: true })).toBeVisible();

  await page.goBack();
  await expect(page).toHaveURL(/\/profile\/user-001$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "alice_pump" }),
  ).toBeVisible();
  await page.goForward();
  await expect(page).toHaveURL(new RegExp(`/profile/${wallet}$`));
  await page.reload();
  await expect(
    page.getByRole("heading", { level: 1, name: "chad_group" }),
  ).toBeVisible();
});

test("renders fallback, empty and banned identity states honestly", async ({
  page,
}) => {
  await page.goto("/profile/user-003");
  await expect(
    page.getByRole("heading", { level: 1, name: "9WzDXw…AWWM" }),
  ).toBeVisible();
  await expect(page.getByText("No local bio was recorded.")).toBeVisible();
  await expect(page.getByTestId("local-feed-empty")).toContainText(
    "No local example posts",
  );

  await page.goto("/profile/user-005");
  await expect(page.getByTestId("banned-profile")).toBeVisible();
  await expect(page.getByTestId("local-feed-item")).toHaveCount(0);
  await expect(page.getByText("Hidden post")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Follow unavailable" }),
  ).toHaveCount(0);
});

test("unknown, username and malformed identifiers do not select another user", async ({
  page,
}) => {
  for (const path of [
    "/profile/unknown-user",
    "/profile/alice_pump",
    "/profile/%20user-001",
    `/profile/${"a".repeat(129)}`,
  ]) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(404);
    await expect(page.getByText("Page not reconstructed")).toBeVisible();
  }
});

test("profile interaction stays local, read-only and free of external media", async ({
  page,
}) => {
  const safety = collectSafetyViolations(page);
  await page.goto("/profile/user-004");
  await page.getByRole("button", { name: "Copy wallet address" }).focus();
  await expect(
    page.getByRole("button", { name: "Copy wallet address" }),
  ).toBeFocused();
  await expect(
    page.getByText("Synthetic example", { exact: true }),
  ).toHaveCount(1);
  await page.getByRole("link", { name: "Home", exact: true }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Feed" }),
  ).toBeVisible();

  expect(safety.requests).toEqual([]);
  expect(safety.consoleErrors).toEqual([]);
});

test("required viewports keep identity and posts readable without overflow", async ({
  page,
}) => {
  for (const [width, height] of [
    [320, 640],
    [375, 812],
    [768, 1024],
    [1280, 800],
    [1440, 900],
  ] as const) {
    await page.setViewportSize({ width, height });
    await page.goto("/profile/user-001");
    await expect(page.getByTestId("profile-header")).toBeVisible();
    await expect(page.getByTestId("local-feed-item")).toBeVisible();
    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      clippedHeader:
        document.querySelector("[data-testid=profile-header]")!.scrollWidth >
        document.querySelector("[data-testid=profile-header]")!.clientWidth,
    }));
    expect(dimensions.scrollWidth, `${width}px document`).toBeLessThanOrEqual(
      dimensions.clientWidth,
    );
    expect(dimensions.clippedHeader, `${width}px profile header`).toBe(false);
    const copyButton = await page
      .getByRole("button", { name: "Copy wallet address" })
      .boundingBox();
    expect(copyButton?.height, `${width}px copy target`).toBeGreaterThanOrEqual(
      width < 768 ? 44 : 36,
    );
  }
});
