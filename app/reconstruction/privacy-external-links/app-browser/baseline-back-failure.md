# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: settings.spec.ts >> Back dismisses settings without closing the mobile sidebar or Live selection
- Location: tests/settings.spec.ts:44:7

# Error details

```
Error: expect(locator).not.toBeVisible() failed

Locator:  getByRole('dialog', { name: 'Settings', exact: true })
Expected: not visible
Received: visible
Timeout:  5000ms

Call log:
  - Expect "not toBeVisible" getByRole('dialog', { name: 'Settings', exact: true }) with timeout 5000ms
  - waiting for getByRole('dialog', { name: 'Settings', exact: true })
    14 × locator resolved to <dialog open="" id="_R_bkjlb_-dialog" aria-labelledby="_R_bkjlb_-title" class="settings-module__9OoOaq__dialog" aria-describedby="_R_bkjlb_-description">…</dialog>
       - unexpected value "visible"

```

```yaml
- dialog "Settings":
  - banner
  - paragraph: These settings are mapped from captured client code. Account values are unavailable, not off. Nothing here changes preferences, subscribes to notifications or requests browser permission.
  - tabpanel "Notifications"
  - contentinfo
```

# Test source

```ts
  1   | import { expect, test } from "@playwright/test";
  2   | 
  3   | test("query-open survives SSR and hydration without server-rendering a portal", async ({
  4   |   page,
  5   |   request,
  6   | }) => {
  7   |   const response = await request.get("/?settings=notifications");
  8   |   expect(response.status()).toBe(200);
  9   |   // The live shell server-renders its closed native search dialog; no other dialog may be SSR'd.
  10  |   const dialogs = (await response.text()).match(/<dialog\b[^>]*>/g) ?? [];
  11  |   expect(
  12  |     dialogs.filter(
  13  |       (tag) => !tag.includes('aria-label="Search for coins and users"'),
  14  |     ),
  15  |   ).toEqual([]);
  16  |   const errors: string[] = [];
  17  |   page.on("pageerror", (error) => errors.push(error.message));
  18  |   await page.goto("/?settings=notifications");
  19  |   await expect(
  20  |     page.getByRole("dialog", { name: "Settings", exact: true }),
  21  |   ).toBeVisible();
  22  |   expect(errors).toEqual([]);
  23  | });
  24  | 
  25  | test("mobile deep link escapes the hidden sidebar and restores focus to main", async ({
  26  |   page,
  27  | }) => {
  28  |   await page.setViewportSize({ width: 390, height: 844 });
  29  |   await page.goto("/?settings=notifications");
  30  |   await expect(page.locator("#app-sidebar")).toHaveAttribute("inert", "");
  31  |   const dialog = page.getByRole("dialog", { name: "Settings", exact: true });
  32  |   await expect(dialog).toBeVisible();
  33  |   expect(
  34  |     await dialog.evaluate(
  35  |       (node) => node.closest("[aria-hidden=true], [inert]") === null,
  36  |     ),
  37  |   ).toBe(true);
  38  |   await page.keyboard.press("Escape");
  39  |   await expect(dialog).not.toBeVisible();
  40  |   await expect(page.locator("#main-content")).toBeFocused();
  41  | });
  42  | 
  43  | for (const dismissal of ["Escape", "Back"] as const) {
  44  |   test(`${dismissal} dismisses settings without closing the mobile sidebar or Live selection`, async ({
  45  |     page,
  46  |   }) => {
  47  |     await page.setViewportSize({ width: 390, height: 844 });
  48  |     const mint = "7bS1mH6MXbw1GnEkKTU6w5YLTywPkQ1w3YVZXWFupump";
  49  |     await page.goto(`/live?stream=${mint}`);
  50  |     // Streaming can briefly leave a hidden pre-swap copy of the page outside
  51  |     // the live shell's <main>; scope to the rendered page.
  52  |     const playback = page
  53  |       .locator("#main-content")
  54  |       .getByTestId("playback-unavailable");
  55  |     await expect(playback).toBeVisible();
  56  |     const initialOverflow = await page.evaluate(
  57  |       () => document.body.style.overflow,
  58  |     );
  59  |     if (dismissal === "Back") {
  60  |       await page.evaluate(() =>
  61  |         history.pushState(
  62  |           null,
  63  |           "",
  64  |           `${location.pathname}${location.search}&step=2`,
  65  |         ),
  66  |       );
  67  |       await expect(page).toHaveURL(/step=2$/);
  68  |     }
  69  |     await page.getByRole("button", { name: "Open navigation" }).click();
  70  |     const sidebarOverflow = await page.evaluate(
  71  |       () => document.body.style.overflow,
  72  |     );
  73  |     const launcher = page.getByRole("button", { name: "Open settings" });
  74  |     await launcher.click();
  75  |     const dialog = page.getByRole("dialog", { name: "Settings", exact: true });
  76  |     await expect(dialog).toBeVisible();
  77  |     await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  78  |     if (dismissal === "Escape") await page.keyboard.press("Escape");
  79  |     else await page.goBack();
> 80  |     await expect(dialog).not.toBeVisible();
      |                              ^ Error: expect(locator).not.toBeVisible() failed
  81  |     await expect(page.locator("[data-app-shell]")).toHaveAttribute(
  82  |       "data-mobile-navigation",
  83  |       "open",
  84  |     );
  85  |     expect(new URL(page.url()).searchParams.get("stream")).toBe(mint);
  86  |     expect(new URL(page.url()).searchParams.has("settings")).toBe(false);
  87  |     await expect(playback).toBeVisible();
  88  |     await expect(launcher).toBeFocused();
  89  |     expect(await page.evaluate(() => document.body.style.overflow)).toBe(
  90  |       sidebarOverflow,
  91  |     );
  92  |     await page
  93  |       .getByRole("button", { name: "Close navigation", exact: true })
  94  |       .click();
  95  |     await expect(page.locator("[data-app-shell]")).toHaveAttribute(
  96  |       "data-mobile-navigation",
  97  |       "closed",
  98  |     );
  99  |     expect(await page.evaluate(() => document.body.style.overflow)).toBe(
  100 |       initialOverflow,
  101 |     );
  102 |   });
  103 | }
  104 | 
  105 | test("modal temporarily locks body scrolling and restores the previous style", async ({
  106 |   page,
  107 | }) => {
  108 |   await page.goto("/");
  109 |   await page.evaluate(() => {
  110 |     document.body.style.overflow = "clip";
  111 |   });
  112 |   await page.getByRole("button", { name: "Open settings" }).click();
  113 |   const dialog = page.getByRole("dialog", { name: "Settings", exact: true });
  114 |   await expect(dialog).toBeVisible();
  115 |   await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  116 |   await dialog.getByRole("button", { name: "Done", exact: true }).click();
  117 |   await expect(dialog).not.toBeVisible();
  118 |   await expect(page.locator("body")).toHaveCSS("overflow", "clip");
  119 | });
  120 | 
  121 | test("open-modal URL transitions clear stale search before focusing a deep link", async ({
  122 |   page,
  123 | }) => {
  124 |   await page.goto("/?settings=notifications");
  125 |   const dialog = page.getByRole("dialog", { name: "Settings", exact: true });
  126 |   const search = dialog.getByRole("searchbox", { name: "Search settings" });
  127 |   await search.fill("group chats");
  128 |   const panelId = await dialog
  129 |     .getByRole("tab", { name: "Notifications", exact: true })
  130 |     .getAttribute("aria-controls");
  131 |   expect(await dialog.getByRole("tabpanel").getAttribute("id")).toBe(panelId);
  132 |   await page.evaluate(() =>
  133 |     history.pushState(
  134 |       null,
  135 |       "",
  136 |       "/?settings=privacy&setting=privacy.confirmExternalLinks",
  137 |     ),
  138 |   );
  139 |   await expect(search).toHaveValue("");
  140 |   await expect(
  141 |     dialog.locator('[data-setting-id="privacy.confirmExternalLinks"]'),
  142 |   ).toBeFocused();
  143 |   await search.fill("language");
  144 |   await page.goBack();
  145 |   await expect(search).toHaveValue("");
  146 |   await expect(
  147 |     dialog.getByRole("tab", { name: "Notifications", exact: true }),
  148 |   ).toHaveAttribute("aria-selected", "true");
  149 | });
  150 | 
  151 | test("deep link focuses a known setting and close preserves unrelated URL state", async ({
  152 |   page,
  153 | }) => {
  154 |   await page.goto(
  155 |     "/explore?q=alpha&tag=a&settings=privacy&tag=b&setting=privacy.confirmExternalLinks#results",
  156 |   );
  157 |   const dialog = page.getByRole("dialog", { name: "Settings", exact: true });
  158 |   await expect(dialog).toBeVisible();
  159 |   await expect(
  160 |     dialog.locator('[data-setting-id="privacy.confirmExternalLinks"]'),
  161 |   ).toBeFocused();
  162 |   await dialog.getByRole("button", { name: "Close settings" }).click();
  163 |   await expect(dialog).not.toBeVisible();
  164 |   const url = new URL(page.url());
  165 |   expect(url.pathname).toBe("/explore");
  166 |   expect(url.searchParams.get("q")).toBe("alpha");
  167 |   expect(url.searchParams.getAll("tag")).toEqual(["a", "b"]);
  168 |   expect(url.searchParams.has("settings")).toBe(false);
  169 |   expect(url.searchParams.has("setting")).toBe(false);
  170 |   expect(url.hash).toBe("#results");
  171 |   await expect(
  172 |     page.getByRole("button", { name: "Open settings" }),
  173 |   ).toBeFocused();
  174 | });
  175 | 
  176 | test("malformed or privileged section values do not open the modal", async ({
  177 |   page,
  178 | }) => {
  179 |   for (const query of [
  180 |     "settings=",
```