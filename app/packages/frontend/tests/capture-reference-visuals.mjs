import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "@playwright/test";

const state = process.argv[2];
if (state !== "baseline" && state !== "local") {
  throw new Error("Usage: node tests/capture-reference-visuals.mjs baseline|local");
}

const baseURL = process.env.REFERENCE_BASE_URL ?? "http://127.0.0.1:3010";
const output = resolve("visual/reference-pages-20261028");
const routes = [
  ["fees", "/docs/fees"],
  ["privacy", "/docs/privacy-policy"],
  ["terms", "/docs/terms-and-conditions"],
];
const viewports = [
  ["desktop-1440x900", 1440, 900],
  ["tablet-768x1024", 768, 1024],
  ["mobile-390x844", 390, 844],
  ["small-mobile-375x812", 375, 812],
];

await mkdir(output, { recursive: true });
const browser = await chromium.launch();
try {
  for (const [routeName, path] of routes) {
    for (const [viewportName, width, height] of viewports) {
      const page = await browser.newPage({ viewport: { width, height } });
      const consoleErrors = [];
      page.on("console", (message) => {
        if (message.type() === "error") consoleErrors.push(message.text());
      });
      const response = await page.goto(`${baseURL}${path}`);
      if (response?.status() !== 200) {
        throw new Error(`${path} returned ${response?.status() ?? "no response"}`);
      }
      await page.screenshot({
        path: resolve(output, `${state}-${routeName}-${viewportName}.png`),
        animations: "disabled",
        caret: "initial",
      });
      if (consoleErrors.length > 0 && state === "local") {
        throw new Error(`${path} logged console errors: ${consoleErrors.join(" | ")}`);
      }
      if (consoleErrors.length > 0) {
        process.stderr.write(
          `${path}: retained ${consoleErrors.length} baseline console error(s)\n`,
        );
      }
      await page.close();
    }
  }
} finally {
  await browser.close();
}
