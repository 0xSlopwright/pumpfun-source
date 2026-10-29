import { expect, test, type Page } from "@playwright/test";
import { createViaShell } from "./shell-controls";

const routes = [
  ["/docs/fees", "Fees", 7, 7],
  ["/docs/privacy-policy", "Privacy Notice", 16, 0],
  ["/docs/terms-and-conditions", "Terms Of Use", 36, 0],
] as const;

const viewports = [
  ["desktop", 1440, 900],
  ["tablet", 768, 1024],
  ["mobile", 390, 844],
  ["small mobile", 375, 812],
] as const;

function watchRequests(page: Page) {
  const external: string[] = [];
  const mutations: string[] = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (url.origin !== "http://127.0.0.1:3010") external.push(request.url());
    if (!["GET", "HEAD", "OPTIONS"].includes(request.method())) {
      mutations.push(`${request.method()} ${request.url()}`);
    }
  });
  return { external, mutations };
}

test("renders the three authenticated documents instead of scaffolds", async ({
  page,
}) => {
  for (const [path, title, h2Count, tableCount] of routes) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);
    await expect(
      page.getByRole("heading", { level: 1, name: title }),
    ).toBeVisible();
    await expect(page.getByTestId("reference-document")).toBeVisible();
    await expect(
      page.locator('[data-product-state="unavailable"]'),
    ).toHaveCount(0);
    await expect(page.getByTestId("reference-evidence-error")).toHaveCount(0);
    await expect(page.getByRole("heading", { level: 2 })).toHaveCount(
      h2Count + 1,
    );
    await expect(page.locator(".reference-document table")).toHaveCount(
      tableCount,
    );
    await expect(
      page.getByText("Last Updated: 17 October 2026", { exact: true }),
    ).toBeVisible();
    await expect(
      page.locator("time[datetime='2026-10-28T10:48:45.546100+00:00']"),
    ).toBeVisible();
  }
});

test("preserves evidence-derived fee content and document hierarchy", async ({
  page,
}) => {
  await page.goto("/docs/fees");
  await expect(
    page.getByRole("columnheader", { name: "Action" }).first(),
  ).toBeVisible();
  await expect(
    page.getByText("Create a coin", { exact: true }).first(),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "Holder Rewards coins" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "Platform Fee" }),
  ).toBeVisible();

  await page.goto("/docs/privacy-policy");
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "Types of Personal Data Collected",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 3, name: "How We Use Cookies" }),
  ).toBeVisible();

  await page.goto("/docs/terms-and-conditions");
  await expect(
    page.getByRole("heading", { level: 2, name: "1. Introduction" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 3, name: "7.3 Hackathon Terms" }),
  ).toBeVisible();
});

test("supports anchor navigation and browser history", async ({ page }) => {
  await page.goto("/docs/fees");
  await page
    .getByRole("navigation", { name: "On this page" })
    .getByRole("link", { name: "Platform Fee" })
    .click();
  await expect(page).toHaveURL(/\/docs\/fees#platform-fee$/);
  await expect(page.locator("#platform-fee")).toBeInViewport();

  await page
    .getByRole("link", {
      name: "https://pump.fun/docs/terms-and-conditions",
      exact: true,
    })
    .first()
    .click();
  await expect(page).toHaveURL(/\/docs\/terms-and-conditions$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Terms Of Use" }),
  ).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/docs\/fees#platform-fee$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/docs\/terms-and-conditions$/);
});

test("uses safe external link semantics and escapes captured content", async ({
  page,
}) => {
  await page.goto("/docs/privacy-policy");
  const official = page.getByRole("link", {
    name: "View the official public page",
  });
  await expect(official).toHaveAttribute(
    "href",
    "https://pump.fun/docs/privacy-policy",
  );
  await expect(official).toHaveAttribute("target", "_blank");
  await expect(official).toHaveAttribute("rel", /noopener/);
  await expect(page.locator(".reference-document script")).toHaveCount(0);
  await expect(page.locator(".reference-document [onclick]")).toHaveCount(0);
});

test("operates offline without external loads, mutations or wallet interaction", async ({
  page,
}) => {
  const requests = watchRequests(page);
  for (const [path] of routes) {
    await page.goto(path);
    await expect(page.getByTestId("reference-document")).toBeVisible();
  }
  expect(requests.external).toEqual([]);
  expect(requests.mutations).toEqual([]);
  await expect(page.getByText(/connect wallet/i)).toHaveCount(0);
  await expect(page.getByText(/accept terms/i)).toHaveCount(0);
});

test("is keyboard navigable with visible focus", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/docs/fees");
  let focusedContents = false;
  for (let index = 0; index < 32; index += 1) {
    await page.keyboard.press("Tab");
    const state = await page.evaluate(() => {
      const element = document.activeElement as HTMLElement | null;
      return {
        text: element?.textContent?.trim() ?? "",
        focusVisible: element?.matches(":focus-visible") ?? false,
        outline: element ? getComputedStyle(element).outlineStyle : "none",
      };
    });
    if (state.text === "Custom Pair coins") {
      focusedContents = true;
      expect(state.focusVisible).toBe(true);
      expect(state.outline).toBe("solid");
      break;
    }
  }
  expect(focusedContents).toBe(true);
});

for (const [name, width, height] of viewports) {
  test(`keeps all reference pages readable without page overflow at ${name}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height });
    for (const [path] of routes) {
      await page.goto(path);
      const dimensions = await page.evaluate(() => ({
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: document.documentElement.clientWidth,
      }));
      expect(dimensions.documentWidth, path).toBeLessThanOrEqual(
        dimensions.viewportWidth,
      );
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(
        page.getByRole("navigation", { name: "On this page" }),
      ).toBeVisible();
    }
  });
}

test("keeps the shell and existing routes intact", async ({ page }) => {
  await page.goto("/docs/fees");
  await expect(
    page.getByRole("complementary", { name: "Application navigation" }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Explore", exact: true }).click();
  await expect(page.getByTestId("historical-coin-card")).toBeVisible();
  await createViaShell(page);
  await expect(page.getByRole("form")).toBeVisible();
  for (const excluded of [
    "/coin/example",
    "/pump-token",
    "/support",
    "/perps",
  ]) {
    const response = await page.goto(excluded);
    expect(response?.status(), excluded).toBe(404);
  }
});

test("emits no console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  for (const [path] of routes) {
    await page.goto(path);
    await expect(page.getByTestId("reference-document")).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test("uncopied reference links use the official site without loading it", async ({
  page,
}) => {
  const requests = watchRequests(page);
  await page.goto("/docs/fees");
  for (const path of ["/docs/charitycoins", "/docs/custom-pairs"]) {
    const link = page.locator(
      `.reference-document a[href="https://pump.fun${path}"]`,
    );
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /noopener/);
  }
  await expect(
    page.locator('.reference-document a[href="/docs/terms-and-conditions"]'),
  ).toHaveCount(1);
  expect(requests.external).toEqual([]);
  expect(requests.mutations).toEqual([]);
});
