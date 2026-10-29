import { expect, test, type Page } from "@playwright/test";
import { PublicKey } from "@solana/web3.js";
import * as sdk from "@pump-fun/pump-sdk";
const MINT = "So11111111111111111111111111111111111111112";
const mint = new PublicKey(MINT),
  rewardsPda = sdk.holderRewardsPda(mint).toBase58();
function payload(legacy = false) {
  return {
    ok: true,
    mint: MINT,
    programId: sdk.PUMP_PROGRAM_ID.toBase58(),
    globalPda: sdk.GLOBAL_PDA.toBase58(),
    curvePda: sdk.bondingCurvePda(mint).toBase58(),
    holderRewardsPda: rewardsPda,
    cluster: "mainnet-beta",
    commitment: "confirmed",
    contextSlot: 321,
    observedAt: "2026-10-29T03:00:00.000Z",
    endpointHost: "public-rpc.example",
    global: {
      status: "decoded",
      dataBytes: legacy ? 1054 : 1088,
      isHolderRewardEnabled: legacy ? null : false,
      holderRewardClaimAuthority: legacy ? null : MINT,
    },
    curve: {
      status: "decoded",
      dataBytes: legacy ? 124 : 166,
      isHolderReward: legacy ? null : true,
      creator: rewardsPda,
      creatorMatchesHolderRewardsPda: true,
    },
  };
}
async function derive(page: Page) {
  await page.goto("/holder-rewards");
  await page.getByLabel("Solana mint address", { exact: true }).fill(MINT);
  await page
    .getByRole("button", { name: "Derive address", exact: true })
    .click();
}
const read = (page: Page) =>
  page.getByRole("button", { name: "Read public configuration", exact: true });

test("explicit read shows independent stored flags/public authority without eligibility or credential claims", async ({
  page,
}) => {
  const requests: {
    method: string;
    mint: string | null;
    cookie: string | undefined;
  }[] = [];
  await page.route("**/api/holder-rewards/configuration?*", async (route) => {
    requests.push({
      method: route.request().method(),
      mint: new URL(route.request().url()).searchParams.get("mint"),
      cookie: route.request().headers().cookie,
    });
    await route.fulfill({ json: payload() });
  });
  await derive(page);
  expect(requests).toEqual([]);
  await read(page).click();
  const result = page.getByTestId("holder-configuration-result");
  await expect(page.getByTestId("holder-global-flag")).toHaveText(
    "Stored false",
  );
  await expect(page.getByTestId("holder-curve-flag")).toHaveText("Stored true");
  await expect(result).toContainText(MINT);
  await expect(result).toContainText("Response slot 321");
  await expect(result).toContainText(
    "not a general switch for existing-coin payouts",
  );
  await expect(
    page
      .getByTestId("reward-summary")
      .getByText("Unavailable", { exact: true }),
  ).toHaveCount(3);
  await expect(
    page.getByRole("button", { name: /Claim unavailable/ }),
  ).toBeDisabled();
  expect(requests).toEqual([{ method: "GET", mint: MINT, cookie: undefined }]);
});

test("legacy absent fields are unknown instead of SDK default false/zero-key values", async ({
  page,
}) => {
  await page.route("**/api/holder-rewards/configuration?*", (route) =>
    route.fulfill({ json: payload(true) }),
  );
  await derive(page);
  await read(page).click();
  await expect(page.getByTestId("holder-global-flag")).toContainText("Unknown");
  await expect(page.getByTestId("holder-curve-flag")).toContainText("Unknown");
  await expect(
    page.getByTestId("holder-configuration-result"),
  ).not.toContainText("Stored false");
  await expect(
    page.getByTestId("holder-configuration-result"),
  ).not.toContainText("11111111111111111111111111111111");
});

test("missing curve remains an observed missing record, not a disabled holder flag", async ({
  page,
}) => {
  const value = payload();
  await page.route("**/api/holder-rewards/configuration?*", (route) =>
    route.fulfill({
      json: {
        ...value,
        curve: {
          status: "missing",
          dataBytes: null,
          isHolderReward: null,
          creator: null,
          creatorMatchesHolderRewardsPda: null,
        },
      },
    }),
  );
  await derive(page);
  await read(page).click();
  await expect(page.getByTestId("holder-configuration-result")).toContainText(
    "No curve account was returned",
  );
  await expect(page.getByTestId("holder-curve-flag")).toHaveCount(0);
});

test("failure/invalid identity hides provider detail and retry can return a fresh observation", async ({
  page,
}) => {
  let calls = 0;
  await page.route("**/api/holder-rewards/configuration?*", async (route) => {
    calls++;
    await route.fulfill(
      calls === 1
        ? {
            status: 503,
            json: { ok: false, error: { message: "private-provider-body" } },
          }
        : calls === 2
          ? { json: { ...payload(), mint: rewardsPda } }
          : { json: payload() },
    );
  });
  await derive(page);
  await read(page).click();
  const panel = page.getByTestId("holder-configuration");
  await expect(panel.getByRole("alert")).toContainText(
    "unavailable or unsupported",
  );
  await expect(panel).not.toContainText("private-provider-body");
  await read(page).click();
  await expect(panel.getByRole("alert")).toBeVisible();
  await read(page).click();
  await expect(page.getByTestId("holder-configuration-result")).toBeVisible();
  expect(calls).toBe(3);
});

test("mint edit discards pending configuration and clears previous fields", async ({
  page,
}) => {
  let release!: () => void, started!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const pending = new Promise<void>((resolve) => {
    started = resolve;
  });
  await page.route("**/api/holder-rewards/configuration?*", async (route) => {
    started();
    await gate;
    await route.fulfill({ json: payload() }).catch(() => {});
  });
  await derive(page);
  await read(page).click();
  await pending;
  await page
    .getByLabel("Solana mint address", { exact: true })
    .fill("11111111111111111111111111111111");
  release();
  await expect(page.getByTestId("holder-configuration")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Derive address", exact: true })
    .click();
  await expect(page.getByTestId("holder-configuration-result")).toHaveCount(0);
});

for (const width of [320, 1440])
  test(`configuration read remains contained at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: width === 320 ? 640 : 900 });
    await page.route("**/api/holder-rewards/configuration?*", (route) =>
      route.fulfill({ json: payload(true) }),
    );
    await derive(page);
    await read(page).click();
    await expect(page.getByTestId("holder-configuration-result")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page
      .getByTestId("holder-configuration-result")
      .scrollIntoViewIfNeeded();
    await page.screenshot({
      path: `../../artifacts/holder-configuration-${width}.png`,
    });
  });

test("actual Next entrypoint uses the production reader and fails closed without RPC configuration", async ({
  page,
}) => {
  test.skip(
    process.env.HOLDER_CONFIG_TEST_NO_RPC !== "1",
    "Requires isolated runner with existing SOLANA_RPC_URL explicitly empty; no product test flag exists",
  );
  await derive(page);
  const responsePromise = page.waitForResponse(
    (response) =>
      new URL(response.url()).pathname === "/api/holder-rewards/configuration",
  );
  await read(page).click();
  const response = await responsePromise;
  expect(response.status()).toBe(503);
  expect((await response.json()).error.code).toBe("RPC_CONFIGURATION_INVALID");
  expect(response.headers()["cache-control"]).toBe("no-store");
  await expect(
    page.getByTestId("holder-configuration").getByRole("alert"),
  ).toContainText("unavailable or unsupported");
});
