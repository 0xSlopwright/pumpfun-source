import { defineConfig } from "@playwright/test";

/** Standalone local React fixture; no Next route or production backend is started. */
export default defineConfig({
  testDir: "./tests",
  testMatch: "notification-settings.spec.ts",
  outputDir: "../../artifacts/playwright-notifications",
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  workers: 1,
  reporter: "line",
  use: {
    browserName: "chromium",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
});
