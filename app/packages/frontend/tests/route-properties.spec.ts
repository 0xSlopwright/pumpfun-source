import { expect, test } from '@playwright/test';

test('Object prototype names are unknown routes, not product pages', async ({ request }) => {
  for (const path of ['/constructor', '/__proto__', '/toString', '/valueOf', '/hasOwnProperty']) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(404);
    expect(await response.text()).toContain('Page not reconstructed');
  }
});
