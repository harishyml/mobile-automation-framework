const { test, expect } = require('@playwright/test');
const loginSetup = require('../setup/loginSetup');

test('Responsive layout / mobile viewport', async ({ page }) => {
  await loginSetup(page, 'valid');

  await expect(page.getByRole('button', { name: 'Open Menu' })).toBeVisible();

  await page.evaluate(() => window.scrollBy(0, 1000));
  await expect(page.getByRole('contentinfo')).toBeVisible(); 
});
