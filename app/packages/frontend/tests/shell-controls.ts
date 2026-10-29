import { expect, type Page } from "@playwright/test";

/** Captured top-bar controls open a dialog; the maintained query still belongs to Explore. */
export async function openShellSearch(page: Page) {
  const dialog = page.getByRole("dialog", {
    name: "Search for coins and users",
    exact: true,
  });
  if (!(await dialog.isVisible()))
    await page
      .getByRole("button", { name: "Search for coins and users", exact: true })
      .click();
  await expect(dialog).toBeVisible();
  return dialog.getByRole("searchbox", {
    name: "Search for coins and users",
    exact: true,
  });
}

/** Factory29306 exposes /create through the Create menu, rather than a direct sidebar link. */
export async function createViaShell(page: Page) {
  await page
    .getByRole("complementary", { name: "Application navigation" })
    .getByRole("button", { name: "Create a coin", exact: true })
    .click();
  await page
    .getByRole("menu", { name: "Create", exact: true })
    .getByRole("menuitem", { name: "Create coin", exact: true })
    .click();
}
