import { expect, test } from '@playwright/test';

const dialog = (page: import('@playwright/test').Page) => page.getByRole('dialog', { name: 'Search for coins and users', exact: true });

// This unit tests the mounted handler, not the separate pre-load/hydration path.
// Observe the actual public open listener, installed in the same effect as keys.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const add = window.addEventListener;
    window.addEventListener = function (...args: Parameters<typeof window.addEventListener>) {
      const result = Reflect.apply(add, this, args);
      if (args[0] === 'pump:open-search') Reflect.set(window, '__localSearchMounted', true);
      return result;
    };
  });
});
const mounted = (page: import('@playwright/test').Page) => page.waitForFunction(() => Reflect.get(window, '__localSearchMounted') === true);

test('bare slash opens global search from non-editor focus and prevents the typed slash', async ({ page }) => {
  await page.goto('/explore?q=retained');
  await mounted(page);
  await page.getByRole('heading', { name: 'Explore', exact: true }).click();
  await page.keyboard.press('/');
  await expect(dialog(page)).toBeVisible();
  await expect(dialog(page).getByRole('searchbox')).toBeFocused();
  await expect(dialog(page).getByRole('searchbox')).toHaveValue('retained');
  await expect(page).toHaveURL(/\/explore\?q=retained$/);
});

test('Ctrl-K toggles the mounted dialog from an editor while additional modifiers do not match', async ({ page }) => {
  await page.goto('/explore?q=retained');
  await mounted(page);
  const editor = page.getByRole('searchbox', { name: 'Search captured coins' });
  await editor.focus();
  await page.keyboard.press('Control+Shift+k');
  await expect(dialog(page)).not.toBeVisible();
  await expect(editor).toBeFocused();
  await page.keyboard.press('Control+k');
  await expect(dialog(page)).toBeVisible();
  await dialog(page).getByRole('searchbox').fill('draft');
  await page.keyboard.press('Control+k');
  await expect(dialog(page)).not.toBeVisible();
  await expect(editor).toBeFocused();
  await expect(page).toHaveURL(/\/explore\?q=retained$/);
  await page.getByRole('button', { name: 'Search for coins and users', exact: true }).click();
  await expect(dialog(page).getByRole('searchbox')).toHaveValue('');
});

test('bare slash remains text in an editor and does not open the dialog', async ({ page }) => {
  await page.goto('/explore');
  await mounted(page);
  const editor = page.getByRole('searchbox', { name: 'Search captured coins' });
  await editor.fill('editing');
  await page.keyboard.press('/');
  await expect(editor).toHaveValue('editing/');
  await expect(dialog(page)).not.toBeVisible();
});
