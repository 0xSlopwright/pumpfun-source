import { expect, test } from "@playwright/test";

// Synthetic, read-only adapter responses; no production endpoint or credentials.
const competition = {
  id: "synthetic-rules",
  slug: "synthetic-rules",
  kind: "group",
  title: "Synthetic rules fixture",
  description: "",
  prizeCopy: "1000",
  minMembers: 2,
  maxMembers: 10,
  prizes: [
    { rankFrom: 1, rankTo: 1, amount: "1000" },
    { rankFrom: 2, rankTo: 5, amount: "10" },
  ],
  registrationOpensAt: "2026-10-01T00:00:00Z",
  registrationClosesAt: "2026-10-10T01:00:00Z",
  startsAt: "2026-10-11T00:00:00Z",
  endsAt: "2026-10-20T02:00:00Z",
  maxEntries: 100,
  entriesCount: 0,
  participants: 0,
  joinable: false,
  phase: "upcoming",
  isFinal: false,
};

for (const width of [390, 1280]) {
  test(`competition rules open, trap focus and close at ${width}px without extra requests`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    const unexpected: string[] = [];
    let adapterReads = 0;
    await page.route("**/*", async (route) => {
      const request = route.request(),
        url = new URL(request.url());
      if (
        url.origin !== "http://127.0.0.1:3010" ||
        !["GET", "HEAD"].includes(request.method())
      ) {
        unexpected.push(request.method() + " " + url.origin + url.pathname);
        await route.abort();
        return;
      }
      if (url.pathname === "/api/leaderboard") {
        adapterReads++;
        await route.fulfill({
          contentType: "application/json",
          body: JSON.stringify({
            ok: true,
            source: {
              mode: "developer-api",
              label: "Pump developer API",
              fetchedAt: "2026-10-28T00:00:00Z",
            },
            data: {
              kind: "competition-detail",
              competition,
              entries: [],
              totalRanked: 0,
              builtAtMs: 1,
              isFinal: false,
            },
          }),
        });
        return;
      }
      await route.continue();
    });
    await page.goto(
      "/leaderboard?category=competitions&competition=synthetic-rules",
    );
    const launcher = page.getByRole("button", {
      name: "Schedule, scoring, eligibility and rules",
    });
    await expect(launcher).toBeEnabled();
    const readsBefore = adapterReads;
    await launcher.click();
    const dialog = page.getByRole("dialog", { name: "Competition rules" });
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole("button", { name: "Close", exact: true }),
    ).toBeFocused();
    await expect(dialog).toContainText("Times shown in UTC");
    await expect(dialog).toContainText("Top 5 get paid");
    await expect(
      dialog.getByTestId("cup-rules-list").locator("li"),
    ).toHaveCount(6);
    await expect(dialog.locator("input, select, textarea, form")).toHaveCount(
      0,
    );
    const terms = dialog.getByRole("link", {
      name: "Competition terms and conditions",
    });
    await expect(terms).toHaveAttribute(
      "href",
      "https://pump.fun/docs/app-competition-terms",
    );
    await page.keyboard.press("Shift+Tab");
    await expect(terms).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(
      dialog.getByRole("button", { name: "Close", exact: true }),
    ).toBeFocused();
    // Exercise both boundaries and the browser's ordinary interior tab order.
    for (let cycle = 0; cycle < 2; cycle++) {
      await page.keyboard.press("Tab");
      await expect(terms).toBeFocused();
      await page.keyboard.press("Tab");
      await expect(
        dialog.getByRole("button", { name: "Close", exact: true }),
      ).toBeFocused();
      await page.keyboard.press("Shift+Tab");
      await expect(terms).toBeFocused();
      await page.keyboard.press("Shift+Tab");
      await expect(
        dialog.getByRole("button", { name: "Close", exact: true }),
      ).toBeFocused();
    }
    const box = await dialog.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(width);
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(launcher).toBeFocused();
    await expect(page).toHaveURL(/competition=synthetic-rules/);
    await launcher.click();
    await dialog.getByRole("button", { name: "Close", exact: true }).click();
    await expect(launcher).toBeFocused();
    expect(adapterReads).toBe(readsBefore);
    expect(unexpected).toEqual([]);
  });
}


test("competition rules keep the background still and restore scrolling on close or unmount", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 640 });
  await page.route("**/api/leaderboard?**", (route) =>
    route.fulfill({
      json: {
        ok: true,
        source: {
          mode: "developer-api",
          label: "Pump developer API",
          fetchedAt: "2026-10-28T00:00:00Z",
        },
        data: new URL(route.request().url()).searchParams.has("id")
          ? {
              kind: "competition-detail",
              competition,
              entries: [],
              totalRanked: 0,
              builtAtMs: 1,
              isFinal: false,
            }
          : { kind: "competitions", live: [], upcoming: [competition], past: [] },
      },
    }),
  );
  await page.goto("/leaderboard?category=competitions&status=upcoming");
  const detail = page.getByRole("link", { name: "View ranked entries" });
  await detail.click();
  const launcher = page.getByRole("button", {
    name: "Schedule, scoring, eligibility and rules",
  });
  await expect(launcher).toBeEnabled();
  await launcher.click();
  const dialog = page.getByRole("dialog", { name: "Competition rules" });
  await expect(dialog).toBeVisible();
  const backgroundTop = await page.evaluate(() => window.scrollY);
  expect(
    await page.evaluate(() => document.documentElement.scrollHeight),
  ).toBeGreaterThan(640);
  await page.mouse.move(2, 2);
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(250);
  expect(await page.evaluate(() => window.scrollY)).toBe(backgroundTop);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.mouse.move(2, 2);
  await page.mouse.wheel(0, 500);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);

  await launcher.click();
  await expect(dialog).toBeVisible();
  await page.goBack();
  await expect(detail).toBeVisible();
  await expect(dialog).toHaveCount(0);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.mouse.move(2, 2);
  await page.mouse.wheel(0, 500);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
});
