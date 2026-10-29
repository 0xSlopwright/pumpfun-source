// Exercise the actual authored Settings UI on an explicitly started loopback app.
// This is not a captured visual reference or an upstream compatibility oracle.
import assert from "node:assert/strict";
import { readFile, writeFile, mkdir, mkdtemp, rm } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import os from "node:os";
import { createHash } from "node:crypto";
import { verify } from "../scripts/original-privacy-external-links.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
const args = process.argv.slice(2);
const option = (name) => {
  const at = args.indexOf(name);
  assert.ok(at >= 0 && args[at + 1], `Missing ${name}`);
  return args[at + 1];
};
const base = new URL(option("--base-url"));
assert.ok(
  base.protocol === "http:" &&
    base.hostname === "127.0.0.1" &&
    !base.username &&
    !base.password,
  "Only an explicit loopback HTTP app is allowed",
);
const output = path.resolve(option("--output"));
await mkdir(path.dirname(output), { recursive: true });
await verify(root);
const require = createRequire(
  new URL("../packages/frontend/package.json", import.meta.url),
);
const { chromium, expect } = require("@playwright/test");
const profile = await mkdtemp(path.join(os.tmpdir(), "pump-privacy-settings-"));
const key = "privacy.confirm-external-links";
const errors = [],
  external = [],
  checks = [];
const route = new URL(
  "/?settings=privacy&setting=privacy.confirmExternalLinks",
  base,
).href;
let context;
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

async function launch(viewport, failWrites = false) {
  context = await chromium.launchPersistentContext(profile, {
    headless: true,
    viewport,
  });
  await context.addCookies([
    {
      name: "clickwrap_accepted",
      value: "true",
      url: base.origin,
      expires: Math.floor(Date.now() / 1000) + 3600,
    },
  ]);
  await context.route("**/*", (request) => {
    if (new URL(request.request().url()).origin === base.origin)
      return request.continue();
    external.push(request.request().url());
    return request.abort();
  });
  context.on("page", (page) =>
    page.on("pageerror", (error) => errors.push(error.message)),
  );
  if (failWrites)
    await context.addInitScript((fixedKey) => {
      const original = Storage.prototype.setItem;
      Storage.prototype.setItem = function (key, value) {
        if (key === fixedKey)
          throw new DOMException(
            "Synthetic storage failure",
            "QuotaExceededError",
          );
        return original.call(this, key, value);
      };
    }, key);
  const page = context.pages()[0] ?? (await context.newPage());
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(route);
  return page;
}
function control(page) {
  return page
    .getByRole("dialog", { name: "Settings", exact: true })
    .getByRole("switch", {
      name: "Confirm before opening external links",
      exact: true,
    });
}
try {
  let page = await launch({ width: 1280, height: 900 });
  await expect(control(page)).toBeEnabled();
  await expect(control(page)).toHaveAttribute("aria-checked", "true");
  await expect(
    page.getByText("App links are not yet connected to this choice.", {
      exact: false,
    }),
  ).toBeVisible();
  await page.evaluate(() =>
    localStorage.setItem("privacy-ui-unrelated", "preserve"),
  );
  await control(page).focus();
  await page.keyboard.press("Space");
  await expect(control(page)).toHaveAttribute("aria-checked", "false");
  await expect(
    page.getByRole("status").filter({ hasText: "Saved in this browser." }),
  ).toBeVisible();
  assert.equal(
    await page.evaluate((key) => localStorage.getItem(key), key),
    "false",
  );
  await page.screenshot({
    path: path.join(path.dirname(output), "settings-desktop.png"),
  });
  await page.reload();
  await expect(control(page)).toBeEnabled();
  await expect(control(page)).toHaveAttribute("aria-checked", "false");
  checks.push(
    "actual Settings switch hydrates, supports keyboard input, writes JSON false and retains it on reload",
  );
  await context.close();
  context = null;
  page = await launch({ width: 1280, height: 900 });
  await expect(control(page)).toBeEnabled();
  await expect(control(page)).toHaveAttribute("aria-checked", "false");
  assert.equal(
    await page.evaluate(() => localStorage.getItem("privacy-ui-unrelated")),
    "preserve",
  );
  checks.push(
    "full browser-process restart with isolated persistent profile retains choice and unrelated browser data",
  );
  const second = await context.newPage();
  await second.goto(route);
  await expect(control(second)).toBeEnabled();
  await expect(control(second)).toHaveAttribute("aria-checked", "false");
  await control(second).click();
  await expect(control(second)).toHaveAttribute("aria-checked", "true");
  await expect(control(page)).toHaveAttribute("aria-checked", "true");
  checks.push(
    "a second actual Settings page updates the first through a native cross-tab storage event",
  );
  await context.close();
  context = null;
  page = await launch({ width: 390, height: 844 }, true);
  await expect(control(page)).toBeEnabled();
  await expect(control(page)).toHaveAttribute("aria-checked", "true");
  await control(page).click();
  await expect(control(page)).toHaveAttribute("aria-checked", "false");
  await expect(
    page
      .getByRole("status")
      .filter({ hasText: "browser storage could not be confirmed" }),
  ).toBeVisible();
  await expect(
    page.getByRole("status").filter({ hasText: "Saved in this browser." }),
  ).toHaveCount(0);
  assert.equal(
    await page.evaluate((key) => localStorage.getItem(key), key),
    "true",
  );
  await page.screenshot({
    path: path.join(
      path.dirname(output),
      "settings-mobile-storage-failure.png",
    ),
  });
  await page.reload();
  await expect(control(page)).toBeEnabled();
  await expect(control(page)).toHaveAttribute("aria-checked", "true");
  checks.push(
    "mobile actual Settings write failure keeps page fallback, reports unconfirmed persistence and restores stored choice after reload",
  );
  assert.deepEqual(errors, []);
  assert.deepEqual(external, []);
  const sourceInputs = {};
  for (const relative of [
    "reconstruction/privacy-external-links/client.mjs",
    "reconstruction/privacy-external-links/client.d.mts",
    "reconstruction/privacy-external-links/contract.json",
    "packages/frontend/src/components/settings/privacy-setting-control.tsx",
    "packages/frontend/src/components/settings/privacy-setting-control.module.css",
    "packages/frontend/src/components/settings/settings-control.tsx",
    "tests/original_privacy_settings.browser.mjs",
  ])
    sourceInputs[relative] = sha256(await readFile(path.join(root, relative)));
  const screenshots = {};
  for (const name of [
    "settings-desktop.png",
    "settings-mobile-storage-failure.png",
  ])
    screenshots[name] = sha256(
      await readFile(path.join(path.dirname(output), name)),
    );
  const receipt = {
    result: "PASS",
    classification:
      "Actual authored app Settings workflow; no captured visual parity or outbound-consumer integration claim",
    origin: base.origin,
    browser: context.browser()?.version(),
    viewports: [
      [1280, 900],
      [390, 844],
    ],
    browserProcessRestarts: 2,
    checks,
    sourceInputs,
    screenshots,
    pageErrors: errors,
    externalRequests: external,
    capturedCodeExecuted: false,
    outboundConsumersConnected: false,
    serverCompatibilityClaimed: false,
  };
  await writeFile(output, JSON.stringify(receipt, null, 2) + "\n");
  console.log(JSON.stringify(receipt, null, 2));
} finally {
  await context?.close();
  await rm(profile, { recursive: true, force: true });
}
