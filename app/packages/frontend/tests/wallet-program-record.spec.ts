import { expect, test, type Page } from "@playwright/test";
import { PublicKey } from "@solana/web3.js";
import { PUMP_PROGRAM_ID, userVolumeAccumulatorPda } from "@pump-fun/pump-sdk";
const USER = "So11111111111111111111111111111111111111112";
const OTHER = "11111111111111111111111111111111";
function portfolio(address = USER) {
  const group = (program: string, programId: string) => ({
    program,
    programId,
    contextSlot: 300,
    accounts: [],
    mints: [],
  });
  return {
    ok: true,
    address,
    cluster: "mainnet-beta",
    genesisHash: "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d",
    commitment: "confirmed",
    observedAt: "2026-10-29T05:00:00.000Z",
    endpointHost: "public-rpc.example",
    sol: { lamports: "0", amount: "0", contextSlot: 300 },
    splToken: group("spl-token", "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    token2022: group(
      "token-2022",
      "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
    ),
    snapshotAtomic: false,
  };
}
function payload(address = USER) {
  return {
    ok: true,
    address,
    programId: PUMP_PROGRAM_ID.toBase58(),
    recordPda: userVolumeAccumulatorPda(new PublicKey(address)).toBase58(),
    cluster: "mainnet-beta",
    commitment: "confirmed",
    contextSlot: 321,
    endpointHost: "public-rpc.example",
    observedAt: "2026-10-29T05:00:00.000Z",
    dataBytes: 106,
    record: {
      user: address,
      needsClaim: true,
      hasTotalClaimedTokens: false,
      totalUnclaimedTokens: "18446744073709551615",
      totalClaimedTokens: "9007199254740993",
      currentSolVolume: "7",
      lastUpdateTimestamp: "-9",
      cashbackEarned: "2",
      totalCashbackClaimed: "0",
      stableCashbackEarned: "0",
      totalStableCashbackClaimed: "0",
    },
  };
}
async function load(page: Page) {
  await page.route("**/api/portfolio?*", (route) =>
    route.fulfill({
      json: portfolio(
        new URL(route.request().url()).searchParams.get("address")!,
      ),
    }),
  );
  await page.goto(`/portfolio?address=${USER}`);
  await expect(page.getByTestId("portfolio-result")).toBeVisible();
}
const read = (page: Page) =>
  page.getByRole("button", { name: "Read public Pump record", exact: true });
test("explicit public record read omits credentials and preserves exact stored integers without entitlement claims", async ({
  page,
  context,
}) => {
  await context.addCookies([
    {
      name: "private_test_session",
      value: "not-forwarded",
      domain: "127.0.0.1",
      path: "/",
    },
  ]);
  const requests: {
    method: string;
    url: string;
    cookie: string | undefined;
  }[] = [];
  await page.route("**/api/portfolio/pump-record?*", async (route) => {
    requests.push({
      method: route.request().method(),
      url: route.request().url(),
      cookie: route.request().headers().cookie,
    });
    await route.fulfill({ json: payload() });
  });
  await load(page);
  expect(requests).toEqual([]);
  await read(page).click();
  const result = page.getByTestId("public-pump-record-result");
  await expect(result).toContainText("18446744073709551615");
  await expect(result).toContainText("9007199254740993");
  await expect(result).toContainText("-9");
  await expect(result).toContainText("Response slot 321");
  await expect(result).toContainText("not calculated entitlements");
  await expect(result).toContainText("No claim or signing action is enabled");
  expect(requests).toEqual([
    {
      method: "GET",
      url: `http://127.0.0.1:3010/api/portfolio/pump-record?address=${USER}`,
      cookie: undefined,
    },
  ]);
  await expect(page.locator("html")).toHaveAttribute("data-pf-auth", "out");
});
test("missing record stays missing and does not turn into zero rewards", async ({
  page,
}) => {
  await page.route("**/api/portfolio/pump-record?*", (route) =>
    route.fulfill({ json: { ...payload(), record: null, dataBytes: null } }),
  );
  await load(page);
  await read(page).click();
  const result = page.getByTestId("public-pump-record-result");
  await expect(result).toContainText("No Pump record was returned");
  await expect(result).toContainText("not a zero reward balance");
  await expect(result.locator("dl")).toHaveCount(0);
});
test("provider failure and mismatched wallet are hidden; refresh observes a new result", async ({
  page,
}) => {
  let count = 0;
  await page.route("**/api/portfolio/pump-record?*", (route) => {
    count++;
    return route.fulfill(
      count === 1
        ? { status: 503, json: { secret: "private-provider-value" } }
        : count === 2
          ? { json: payload(OTHER) }
          : { json: payload() },
    );
  });
  await load(page);
  const panel = page.getByTestId("public-pump-record");
  await read(page).click();
  await expect(panel.getByRole("alert")).toBeVisible();
  await expect(panel).not.toContainText("private-provider-value");
  await read(page).click();
  await expect(panel.getByRole("alert")).toBeVisible();
  await expect(page.getByTestId("public-pump-record-result")).toHaveCount(0);
  await read(page).click();
  await expect(page.getByTestId("public-pump-record-result")).toBeVisible();
  await page
    .getByRole("button", { name: "Refresh public Pump record", exact: true })
    .click();
  await expect(page.getByTestId("public-pump-record-result")).toBeVisible();
  expect(count).toBe(4);
});
test("wallet navigation cancels a pending record and prevents a stale wallet result", async ({
  page,
}) => {
  let release!: () => void, started!: () => void;
  const gate = new Promise<void>((resolve) => {
      release = resolve;
    }),
    pending = new Promise<void>((resolve) => {
      started = resolve;
    });
  await page.route("**/api/portfolio/pump-record?*", async (route) => {
    started();
    await gate;
    await route.fulfill({ json: payload() }).catch(() => {});
  });
  await load(page);
  await read(page).click();
  await pending;
  await page
    .getByLabel("Solana public-key address", { exact: true })
    .fill(OTHER);
  await page.getByRole("button", { name: "Load wallet", exact: true }).click();
  await expect(read(page)).toBeVisible();
  release();
  await expect(page.getByTestId("public-pump-record-result")).toHaveCount(0);
  await expect(page).toHaveURL(new RegExp(`address=${OTHER}$`));
});
test("finite client deadline shows an honest unavailable state instead of an indefinite spinner", async ({
  page,
}) => {
  await page.clock.install();
  let started!: () => void, release!: () => void;
  const pending = new Promise<void>((resolve) => {
      started = resolve;
    }),
    gate = new Promise<void>((resolve) => {
      release = resolve;
    });
  await page.route("**/api/portfolio/pump-record?*", async (route) => {
    started();
    await gate;
    await route.fulfill({ json: payload() }).catch(() => {});
  });
  await load(page);
  await read(page).click();
  await pending;
  await page.clock.fastForward(20_001);
  await expect(
    page.getByTestId("public-pump-record").getByRole("alert"),
  ).toBeVisible();
  await expect(read(page)).toBeEnabled();
  release();
  await expect(page.getByTestId("public-pump-record-result")).toHaveCount(0);
});
for (const [width, height] of [
  [320, 640],
  [1440, 900],
])
  test(`public record controls and large integers remain contained at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height });
    await page.route("**/api/portfolio/pump-record?*", (route) =>
      route.fulfill({ json: payload() }),
    );
    await load(page);
    await read(page).click();
    const result = page.getByTestId("public-pump-record-result");
    await expect(result).toBeVisible();
    await result.scrollIntoViewIfNeeded();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `../../artifacts/wallet-program-record-${width}.png`,
    });
  });
test("actual SDK-loaded route fails closed when production RPC configuration is absent", async ({
  page,
}) => {
  test.skip(
    process.env.WALLET_RECORD_TEST_NO_RPC !== "1",
    "Requires isolated runner with existing SOLANA_RPC_URL empty; flag selects test only",
  );
  await load(page);
  const response = page.waitForResponse(
    (r) => new URL(r.url()).pathname === "/api/portfolio/pump-record",
  );
  await read(page).click();
  const actual = await response;
  expect(actual.status()).toBe(503);
  expect((await actual.json()).error.code).toBe("RPC_CONFIGURATION_INVALID");
  expect(actual.headers()["cache-control"]).toBe("no-store");
  await expect(
    page.getByTestId("public-pump-record").getByRole("alert"),
  ).toBeVisible();
});
