import { test, expect } from "@playwright/test";
const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
  "base64",
);

test("rejected file and unsupported decoder preserve manual image and never upload", async ({
  page,
}) => {
  const remote: string[] = [];
  page.on("request", (request) => {
    if (
      /^https?:/.test(request.url()) &&
      new URL(request.url()).hostname !== "127.0.0.1"
    )
      remote.push(request.url());
  });
  await page.goto("/create");
  await page
    .getByLabel(/^Coin image/)
    .setInputFiles({ name: "manual.png", mimeType: "image/png", buffer: PNG });
  const video = page.getByLabel("Local video", { exact: true });
  await video.setInputFiles({
    name: "empty.mp4",
    mimeType: "video/mp4",
    buffer: Buffer.alloc(0),
  });
  await expect(page.getByRole("alert")).toContainText("non-empty video");
  await expect(page.getByTestId("selected-image")).toContainText("manual.png");
  await video.setInputFiles({
    name: "invalid.webm",
    mimeType: "video/webm",
    buffer: Buffer.from("not a video"),
  });
  await expect(page.getByRole("alert")).toContainText("could not decode");
  await expect(page.getByTestId("selected-image")).toContainText("manual.png");
  await expect(
    page.getByRole("button", {
      name: "Launch unavailable in local reconstruction",
    }),
  ).toBeDisabled();
  expect(remote).toEqual([]);
});

test("manual replacement and reset cancel a pending decode rather than publishing stale covers", async ({
  page,
}) => {
  // Deliberately stalled decoder for lifecycle controls, not a real-codec success claim.
  await page.addInitScript(() => {
    HTMLMediaElement.prototype.load = function () {};
  });
  await page.goto("/create");
  const video = page.getByLabel("Local video", { exact: true });
  await video.setInputFiles({
    name: "pending.mp4",
    mimeType: "video/mp4",
    buffer: Buffer.from("synthetic"),
  });
  await expect(page.getByRole("status")).toContainText(
    "Preparing local video covers",
  );
  await page
    .getByLabel(/^Coin image/)
    .setInputFiles({
      name: "new-manual.png",
      mimeType: "image/png",
      buffer: PNG,
    });
  await expect(
    page.getByText("Preparing local video covers…", { exact: true }),
  ).toHaveCount(0);
  await expect(page.getByTestId("selected-image")).toContainText(
    "new-manual.png",
  );
  await video.setInputFiles({
    name: "pending-again.mp4",
    mimeType: "video/mp4",
    buffer: Buffer.from("synthetic"),
  });
  await page.getByRole("button", { name: "Reset draft", exact: true }).click();
  await expect(page.getByTestId("selected-image")).toHaveCount(0);
  await expect(
    page.getByText("Preparing local video covers…", { exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("group", { name: "Video cover choices" }),
  ).toHaveCount(0);
});
