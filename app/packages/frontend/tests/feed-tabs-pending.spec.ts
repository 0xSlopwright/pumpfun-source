import { expect, test } from "@playwright/test";

for (const direction of ["ArrowRight", "ArrowLeft"] as const) {
  test(`two ${direction} presses wrap while the first feed navigation is pending`, async ({
    page,
  }) => {
    let release!: () => void;
    const held = new Promise<void>((resolve) => {
      release = resolve;
    });
    let requested = false;
    await page.route("**/*", async (route) => {
      const request = route.request();
      if (
        new URL(request.url()).searchParams.get("tab") === "following" &&
        request.headers().rsc === "1"
      ) {
        requested = true;
        await held;
      }
      await route.continue();
    });

    // The settings dialog forces hydration before keyboard input.
    await page.goto("/?settings=notifications");
    await expect(
      page.getByRole("dialog", { name: "Settings", exact: true }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("button", { name: "Open settings", exact: true }),
    ).toBeFocused();

    const tabs = page.getByRole("tablist", { name: "Feed views" });
    const forYou = tabs.getByRole("tab", { name: "For you", exact: true });
    const following = tabs.getByRole("tab", { name: "Following", exact: true });
    await expect(forYou).toHaveAttribute("aria-selected", "true");

    try {
      await forYou.focus();
      await expect(forYou).toBeFocused();
      await page.keyboard.press(direction);
      await expect.poll(() => requested).toBe(true);
      // The first navigation is still held, so the committed tab is unchanged.
      await expect(forYou).toHaveAttribute("aria-selected", "true");
      await page.keyboard.press(direction);
    } finally {
      release();
    }

    await page.waitForLoadState("networkidle");
    // For you -> Following -> For you.
    await expect(forYou).toHaveAttribute("aria-selected", "true");
    await expect(following).toHaveAttribute("aria-selected", "false");
    await expect(page).not.toHaveURL(/tab=following/);
    await expect(forYou).toBeFocused();
  });
}

test("single keys, pointer activation and Back resynchronize the requested tab", async ({
  page,
}) => {
  await page.goto("/?settings=notifications");
  await expect(
    page.getByRole("dialog", { name: "Settings", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Open settings", exact: true }),
  ).toBeFocused();

  const tabs = page.getByRole("tablist", { name: "Feed views" });
  const forYou = tabs.getByRole("tab", { name: "For you", exact: true });
  const following = tabs.getByRole("tab", { name: "Following", exact: true });

  await forYou.focus();
  await forYou.press("ArrowRight");
  await expect(following).toHaveAttribute("aria-selected", "true");
  await expect(following).toBeFocused();

  // Pointer activation must replace the pending keyboard intent.
  await forYou.click();
  await expect(forYou).toHaveAttribute("aria-selected", "true");
  await forYou.press("ArrowRight");
  await expect(following).toHaveAttribute("aria-selected", "true");

  await page.goBack();
  await expect(forYou).toHaveAttribute("aria-selected", "true");
  await forYou.press("ArrowRight");
  await expect(following).toHaveAttribute("aria-selected", "true");
  await expect(following).toBeFocused();
});
