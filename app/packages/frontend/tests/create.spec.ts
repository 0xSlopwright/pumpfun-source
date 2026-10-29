import { expect, test, type Page } from "@playwright/test";
import { createViaShell } from "./shell-controls";

const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
  "base64",
);

const inputs = {
  name: (page: Page) => page.getByLabel(/^Coin name/),
  ticker: (page: Page) => page.getByLabel(/^Ticker/),
  description: (page: Page) => page.getByLabel(/^Description/),
  website: (page: Page) => page.getByLabel("Website", { exact: true }),
  twitter: (page: Page) => page.getByLabel("X / Twitter"),
  telegram: (page: Page) => page.getByLabel("Telegram", { exact: true }),
  image: (page: Page) => page.getByLabel(/^Coin image/),
};

async function selectImage(page: Page, name = "coin.png") {
  await inputs.image(page).setInputFiles({
    name,
    mimeType: "image/png",
    buffer: PNG,
  });
}

async function fillValidDraft(page: Page) {
  await inputs.name(page).fill("Daybreak Coin");
  await inputs.ticker(page).fill("DAY");
  await inputs
    .description(page)
    .fill("An offline metadata draft.\nNo launch occurs.");
  await inputs.website(page).fill("https://example.com/coin");
  await inputs.twitter(page).fill("https://x.com/daybreak");
  await inputs.telegram(page).fill("https://t.me/daybreak");
  await selectImage(page);
}

test("/create serves an editable form instead of the unavailable scaffold", async ({
  page,
}) => {
  const response = await page.goto("/create");
  expect(response?.status()).toBe(200);
  await expect(
    page.getByRole("heading", { level: 1, name: "Create a coin" }),
  ).toBeVisible();
  await expect(page.getByRole("form")).toBeVisible();
  await expect(page.locator('[data-product-state="unavailable"]')).toHaveCount(
    0,
  );
  await expect(inputs.name(page)).toBeEditable();
  await expect(inputs.ticker(page)).toBeEditable();
  await expect(inputs.description(page)).toBeEditable();
  await expect(
    page.getByText("Local draft preview", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", {
      name: "Launch unavailable in local reconstruction",
    }),
  ).toBeDisabled();
});

test("desktop and mobile shell navigation reach the form", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await createViaShell(page);
  await expect(page).toHaveURL(/\/create$/);
  await expect(page.getByRole("form")).toBeVisible();

  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await createViaShell(page);
  await expect(page).toHaveURL(/\/create$/);
  await expect(page.getByRole("form")).toBeVisible();
});

test("controlled fields and local preview retain multiline and Unicode input", async ({
  page,
}) => {
  await page.goto("/create");
  await inputs.name(page).fill("猫のコイン 🐈");
  await inputs.ticker(page).fill("猫币");
  await inputs.description(page).fill("first line\nsecond line 🚀");
  await expect(
    page.getByRole("heading", { name: "猫のコイン 🐈" }),
  ).toBeVisible();
  await expect(page.getByText("猫币", { exact: true })).toBeVisible();
  await expect(page.locator(".preview-description")).toContainText(
    "first line",
  );
  await page.getByText("Inspect draft JSON").click();
  const json = page.locator(".metadata-json pre");
  await expect(json).toContainText('"symbol": "猫币"');
  await expect(json).toContainText("second line 🚀");
  await expect(json).not.toContainText("metadataUri");
  await expect(json).not.toContainText("mint");
  await expect(json).not.toContainText("transaction");
});

test("required and whitespace-only fields expose associated inline errors", async ({
  page,
}) => {
  await page.goto("/create");
  await inputs.name(page).fill("   ");
  await inputs.ticker(page).fill("\t ");
  await page.getByRole("button", { name: "Preview draft" }).click();
  await expect(page.getByText("Enter a coin name.")).toBeVisible();
  await expect(page.getByText("Enter a ticker.")).toBeVisible();
  await expect(
    page.getByText("Select an image for the local preview."),
  ).toBeVisible();
  await expect(inputs.name(page)).toHaveAttribute("aria-invalid", "true");
  await expect(inputs.name(page)).toHaveAttribute(
    "aria-describedby",
    /name-error/,
  );
  await expect(inputs.image(page)).toHaveAttribute(
    "aria-describedby",
    /image-error/,
  );
  await expect(inputs.name(page)).toBeFocused();
});

test("captured input maxima are enforced without inventing ticker rules", async ({
  page,
}) => {
  await page.goto("/create");
  await inputs.name(page).fill("n".repeat(40));
  await inputs.ticker(page).fill("💚".repeat(10));
  await inputs.description(page).fill("d".repeat(2_100));
  expect((await inputs.name(page).inputValue()).length).toBe(32);
  expect((await inputs.ticker(page).inputValue()).length).toBe(10);
  expect((await inputs.description(page).inputValue()).length).toBe(2_000);
  await inputs.ticker(page).fill("$? 混合");
  await inputs.ticker(page).blur();
  await expect(inputs.ticker(page)).toHaveAttribute("aria-invalid", "false");
});

test("optional social links use URL parsing and reject unsafe schemes and hosts", async ({
  page,
}) => {
  await page.goto("/create");
  for (const unsafe of [
    "javascript:alert(1)",
    "data:text/html,hello",
    "file:///tmp/coin",
    "http://example.com",
  ]) {
    await inputs.website(page).fill(unsafe);
    await inputs.website(page).blur();
    await expect(inputs.website(page)).toHaveAttribute("aria-invalid", "true");
  }
  await inputs.twitter(page).fill("https://example.com/not-x");
  await inputs.twitter(page).blur();
  await expect(page.getByText(/Use an x.com or twitter.com/)).toBeVisible();
  await inputs.telegram(page).fill("https://x.com/not-telegram");
  await inputs.telegram(page).blur();
  await expect(page.getByText(/Use a t.me or telegram.me/)).toBeVisible();

  await inputs.website(page).fill("https://example.com/path?q=coin");
  await inputs.twitter(page).fill("https://x.com/daybreak");
  await inputs.telegram(page).fill("https://t.me/daybreak");
  for (const input of [
    inputs.website(page),
    inputs.twitter(page),
    inputs.telegram(page),
  ]) {
    await input.blur();
    await expect(input).toHaveAttribute("aria-invalid", "false");
  }
  await expect(page.getByRole("link", { name: "Website" })).toHaveAttribute(
    "href",
    "https://example.com/path?q=coin",
  );
});

test("local image selection, replacement, removal and validation are bounded", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const revoke = URL.revokeObjectURL.bind(URL);
    Object.defineProperty(window, "__revokedObjectUrls", {
      value: [] as string[],
      writable: false,
    });
    URL.revokeObjectURL = (url: string) => {
      (
        window as typeof window & { __revokedObjectUrls: string[] }
      ).__revokedObjectUrls.push(url);
      revoke(url);
    };
  });
  await page.goto("/create");
  await selectImage(page, "first.png");
  await expect(page.getByTestId("selected-image")).toContainText("first.png");
  await expect(page.getByRole("img", { name: /Local preview/ })).toBeVisible();

  await selectImage(page, "replacement.png");
  await expect(page.getByTestId("selected-image")).toContainText(
    "replacement.png",
  );
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as typeof window & { __revokedObjectUrls: string[] })
            .__revokedObjectUrls.length,
      ),
    )
    .toBeGreaterThanOrEqual(1);

  await page.getByRole("button", { name: "Remove image" }).click();
  await expect(page.getByTestId("selected-image")).toHaveCount(0);
  await expect(page.getByLabel("No local image selected")).toBeVisible();

  await inputs.image(page).setInputFiles({
    name: "notes.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("not an image"),
  });
  await expect(page.getByText(/Choose a JPEG, PNG, GIF or WebP/)).toBeVisible();

  await inputs.image(page).setInputFiles({
    name: "too-large.png",
    mimeType: "image/png",
    buffer: Buffer.alloc(4_500_001),
  });
  await expect(page.getByText(/smaller than 4.5 MB/)).toBeVisible();
});

test("preview validation succeeds locally and reset clears every draft value", async ({
  page,
}) => {
  await page.goto("/create");
  await fillValidDraft(page);
  await page.getByRole("button", { name: "Preview draft" }).click();
  await expect(
    page.getByText(
      "Local draft is ready to review. Nothing has been uploaded.",
    ),
  ).toBeVisible();
  await page.getByText("Inspect draft JSON").click();
  await expect(page.locator(".metadata-json pre")).toContainText(
    '"uploadStatus": "not uploaded"',
  );

  await page.getByRole("button", { name: "Reset draft" }).click();
  await expect(inputs.name(page)).toHaveValue("");
  await expect(inputs.ticker(page)).toHaveValue("");
  await expect(inputs.description(page)).toHaveValue("");
  await expect(inputs.website(page)).toHaveValue("");
  await expect(page.getByTestId("selected-image")).toHaveCount(0);
  await expect(page.getByText("Draft cleared.")).toBeVisible();
});

test("form interactions perform no external, mutation, wallet or upload requests", async ({
  page,
}) => {
  const requests: string[] = [];
  page.on("request", (request) => {
    const url = new URL(request.url());
    if (
      url.origin !== "http://127.0.0.1:3010" ||
      !["GET", "HEAD"].includes(request.method())
    ) {
      requests.push(`${request.method()} ${request.url()}`);
    }
  });
  await page.goto("/create");
  await fillValidDraft(page);
  await page.getByRole("button", { name: "Preview draft" }).click();
  await page.getByRole("button", { name: "Reset draft" }).click();
  await expect(page.locator("iframe")).toHaveCount(0);
  await expect(page.getByText(/connect wallet/i)).toHaveCount(0);
  await expect(
    page.getByRole("button", {
      name: "Launch unavailable in local reconstruction",
    }),
  ).toBeDisabled();
  expect(requests).toEqual([]);
});

test("keyboard order, focus indication and requested widths remain usable", async ({
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
    await page.goto("/create");
    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scrollWidth, `${width}px`).toBeLessThanOrEqual(
      dimensions.clientWidth,
    );
    await expect(inputs.name(page)).toBeVisible();
    await expect(
      page.getByText("Local draft preview", { exact: true }),
    ).toBeVisible();
  }

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/create");
  await inputs.name(page).focus();
  await page.keyboard.press("Tab");
  await expect(inputs.ticker(page)).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(inputs.description(page)).toBeFocused();
  expect(
    await inputs
      .description(page)
      .evaluate((element) => element.matches(":focus-visible")),
  ).toBe(true);
});

test("the complete interaction emits no unexpected console errors", async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  await page.goto("/create");
  await fillValidDraft(page);
  await page.getByRole("button", { name: "Preview draft" }).click();
  await page.getByText("Inspect draft JSON").click();
  await page.getByRole("button", { name: "Remove image" }).click();
  expect(consoleErrors).toEqual([]);
});
