import { expect, test } from '@playwright/test';
import { openShellSearch } from './shell-controls';

for (const [label, width, height] of [['desktop', 1280, 800], ['mobile', 375, 812]] as const) {
  test(`Escape dismisses populated global search without changing URL at ${label} size`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto('/explore?q=retained&tag=a&tag=b#results');
    const before = page.url();
    const trigger = page.getByRole('button', { name: 'Search for coins and users', exact: true });
    const search = await openShellSearch(page);
    const dialog = page.getByRole('dialog', { name: 'Search for coins and users', exact: true });
    await search.fill('unsubmitted search');
    await expect(search).toBeFocused();
    await search.press('Escape');
    await expect(dialog).not.toBeVisible();
    expect(page.url()).toBe(before);
    await expect(trigger).toBeFocused();
    await trigger.click();
    await expect(dialog).toBeVisible();
    await expect(search).toHaveValue('unsubmitted search');
    await search.press('Escape');
    await expect(dialog).not.toBeVisible();
    expect(page.url()).toBe(before);
  });
}
