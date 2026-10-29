import { expect, test } from "@playwright/test";

test("local follow lists show recorded relations and navigate to exact profiles", async ({
  page,
}) => {
  const unexpected: string[] = [];
  page.on("request", (request) => {
    if (
      new URL(request.url()).origin !== "http://127.0.0.1:3010" ||
      !["GET", "HEAD"].includes(request.method())
    )
      unexpected.push(request.url());
  });
  await page.goto("/profile/user-001");
  const graph = page.getByRole("region", { name: "Local follow graph" });
  await expect(graph).toBeVisible();
  await expect(graph).toContainText(
    "These seeded relationships are separate from the recorded profile counts above.",
  );
  await expect(page.getByLabel("Local example profile counts")).toContainText(
    "1,200",
  );
  const followers = graph.getByRole("region", { name: "Local followers (4)" });
  await expect(followers.getByRole("link")).toHaveText([
    "chad_group",
    "bob_degen",
    "banned_user",
    "9WzDXw…AWWM",
  ]);
  const following = graph.getByRole("region", { name: "Local following (2)" });
  await expect(following.getByRole("link")).toHaveText([
    "chad_group",
    "bob_degen",
  ]);
  await following
    .getByRole("link", { name: "chad_group", exact: true })
    .click();
  await expect(page).toHaveURL(/\/profile\/user-004$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "chad_group",
  );
  await page.goBack();
  await expect(page).toHaveURL(/\/profile\/user-001$/);
  await expect(
    page.getByRole("region", { name: "Local followers (4)" }),
  ).toBeVisible();
  expect(unexpected).toEqual([]);
});

test("wallet aliases share the graph and empty sides stay explicit", async ({
  page,
}) => {
  await page.goto("/profile/7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU");
  await expect(
    page.getByRole("region", { name: "Local followers (4)" }).getByRole("link"),
  ).toHaveCount(4);
  await page.goto("/profile/user-003");
  await expect(
    page.getByRole("region", { name: "Local followers (0)" }),
  ).toContainText("No followers are recorded in this local graph.");
  await expect(
    page.getByRole("region", { name: "Local following (3)" }).getByRole("link"),
  ).toHaveCount(3);
  await page.goto("/profile/user-005");
  await expect(
    page.getByRole("region", { name: "Local followers (0)" }),
  ).toBeVisible();
  await expect(
    page.getByRole("region", { name: "Local following (2)" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Follow unavailable" }),
  ).toHaveCount(0);
});

test("local graph remains readable at narrow and desktop widths", async ({
  page,
}) => {
  for (const width of [320, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/profile/user-001");
    await expect(
      page.getByRole("region", { name: "Local follow graph" }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    await expect(
      page
        .getByRole("region", { name: "Local following (2)" })
        .getByRole("link", { name: "bob_degen" }),
    ).toBeVisible();
  }
});
