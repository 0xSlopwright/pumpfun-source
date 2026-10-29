import { expect, test, type Page, type Route } from "@playwright/test";
import { openShellSearch } from "./shell-controls";

const MINT = "FwgY7679unGLV64cDpzYyfCtzocr7N2NNfbPnZhepump";

function pageSearch(page: Page) {
  return page.getByRole("searchbox", { name: "Search captured coins" });
}

test("renders the exact verified one-record capture without remote imagery", async ({
  page,
}) => {
  const externalRequests: string[] = [];
  page.on("request", (request) => {
    if (new URL(request.url()).origin !== "http://127.0.0.1:3010") {
      externalRequests.push(request.url());
    }
  });

  const response = await page.goto("/explore");
  expect(response?.status()).toBe(200);
  await expect(
    page.getByRole("heading", { level: 1, name: "Explore" }),
  ).toBeVisible();
  await expect(page.getByText("MotoCross", { exact: true })).toBeVisible();
  await expect(page.getByText("MotoCrose", { exact: true })).toBeVisible();
  await expect(page.getByText(MINT, { exact: true })).toBeVisible();
  await expect(page.getByText("$3,300.03", { exact: true })).toBeVisible();
  await expect(page.getByText(/exactly 1 historical record/)).toBeVisible();
  await expect(page.getByLabel("Local image placeholder")).toBeVisible();
  await expect(page.locator("#main-content img")).toHaveCount(0);
  await expect(page.locator('img:not([src="/pump-logomark.svg"])')).toHaveCount(
    0,
  );
  await expect(
    page.getByText(/never refreshed from a production service/),
  ).toBeVisible();
  expect(externalRequests).toEqual([]);
});

test("searches the captured name, symbol and exact mint from URL state", async ({
  page,
}) => {
  for (const query of ["motocross", "MOTOCROSE", MINT.toLowerCase()]) {
    await page.goto(`/explore?q=${encodeURIComponent(query)}`);
    await expect(page.getByTestId("historical-coin-card")).toHaveCount(1);
    await expect(pageSearch(page)).toHaveValue(query);
  }

  await page.goto("/explore?q=%E7%8C%AB%20%26%20nothing");
  await expect(page.getByTestId("explore-no-results")).toBeVisible();
  await expect(page.getByText("猫 & nothing", { exact: true })).toBeVisible();
  await expect(
    page.getByText(/says nothing about the current live Pump market/),
  ).toBeVisible();
});

test("page search encodes safely, clears predictably and follows Back and Forward", async ({
  page,
}) => {
  await page.goto("/explore");
  const input = pageSearch(page);
  await input.fill("MotoCross & special=value");
  await input.press("Enter");
  await expect(page).toHaveURL(/\/explore\?q=MotoCross\+%26\+special%3Dvalue$/);
  await expect(page.getByTestId("explore-no-results")).toBeVisible();

  await page.getByRole("button", { name: "Clear", exact: true }).click();
  await expect(page).toHaveURL(/\/explore$/);
  await expect(input).toHaveValue("");

  await page.goBack();
  await expect(page).toHaveURL(/special%3Dvalue$/);
  await expect(input).toHaveValue("MotoCross & special=value");
  await page.goForward();
  await expect(page).toHaveURL(/\/explore$/);
  await expect(input).toHaveValue("");

  await input.fill("   ");
  await input.press("Enter");
  await expect(page).toHaveURL(/\/explore$/);
  await expect(page.getByTestId("historical-coin-card")).toHaveCount(1);
});

test("direct links and reload preserve local query results", async ({
  page,
}) => {
  await page.goto("/explore?q=MotoCrose");
  await expect(pageSearch(page)).toHaveValue("MotoCrose");
  await expect(page.getByTestId("historical-coin-card")).toHaveCount(1);
  await page.reload();
  await expect(pageSearch(page)).toHaveValue("MotoCrose");
  await expect(page.getByTestId("historical-coin-card")).toHaveCount(1);
});

test("shared shell search interoperates with the offline Explore query", async ({
  page,
}) => {
  await page.goto("/");
  const shellSearch = await openShellSearch(page);
  await shellSearch.fill("MotoCrose");
  await shellSearch.press("Enter");
  await expect(page).toHaveURL(/\/explore\?q=MotoCrose$/);
  await expect(pageSearch(page)).toHaveValue("MotoCrose");
  await expect(page.getByText("MotoCross", { exact: true })).toBeVisible();
});

test("copy control is keyboard reachable and reports its local result", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"], {
    origin: "http://127.0.0.1:3010",
  });
  await page.goto("/explore");
  const copy = page.getByRole("button", { name: `Copy mint ${MINT}` });
  await copy.focus();
  await expect(copy).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByText("Mint copied", { exact: true })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(MINT);
});

test("all target viewports remain readable without horizontal overflow", async ({
  page,
}) => {
  for (const [width, height] of [
    [320, 640],
    [375, 812],
    [390, 844],
    [768, 1024],
    [1280, 800],
    [1440, 900],
  ] as const) {
    await page.setViewportSize({ width, height });
    await page.goto("/explore?q=MotoCross");
    await expect(pageSearch(page)).toBeVisible();
    await expect(page.getByTestId("historical-coin-card")).toBeVisible();
    await expect(
      page.getByRole("button", { name: `Copy mint ${MINT}` }),
    ).toBeVisible();
    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scrollWidth, `${width}px`).toBeLessThanOrEqual(
      dimensions.clientWidth,
    );
  }
});

test("normal interaction emits no console errors, external requests or mutations", async ({
  page,
}) => {
  const violations: string[] = [];
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (
      url.origin !== "http://127.0.0.1:3010" ||
      !["GET", "HEAD"].includes(request.method())
    ) {
      violations.push(`${request.method()} ${request.url()}`);
    }
  });

  await page.goto("/explore");
  await pageSearch(page).fill("missing coin");
  await pageSearch(page).press("Enter");
  await expect(page.getByTestId("explore-no-results")).toBeVisible();
  await page.getByRole("button", { name: "Clear", exact: true }).click();
  await expect(page.getByTestId("historical-coin-card")).toBeVisible();

  expect(violations).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test("a delayed page search clear preserves a newly typed draft", async ({
  page,
}) => {
  await page.goto("/explore?q=previous", { waitUntil: "networkidle" });
  const input = pageSearch(page);
  await expect(input).toHaveValue("previous");
  const held: Route[] = [];
  let holdClear = true;
  await page.route("**/explore?**", async (route) => {
    if (
      holdClear &&
      new URL(route.request().url()).searchParams.has("_rsc")
    ) {
      held.push(route);
    } else {
      await route.continue();
    }
  });
  try {
    await page.getByRole("button", { name: "Clear", exact: true }).click();
    await expect.poll(() => held.length).toBe(1);
    await input.fill("new draft");
    holdClear = false;
    await Promise.all(held.map((route) => route.continue()));
    await expect(page).toHaveURL(/\/explore$/);
    await expect(input).toHaveValue("new draft");
    await input.press("Enter");
    await expect(page).toHaveURL(/\/explore\?q=new\+draft$/);
    await page.goBack();
    await expect(page).toHaveURL(/\/explore$/);
    await expect(input).toHaveValue("");
    await page.goForward();
    await expect(input).toHaveValue("new draft");
  } finally {
    await page.unrouteAll({ behavior: "ignoreErrors" });
  }
});
