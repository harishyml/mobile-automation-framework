const { test, expect } = require('@playwright/test');
const loginSetup = require('../setup/loginSetup');
const users = require('../data/users.json'); 

for (const user of users) {
  if (user.valid) {
    test(`Valid Login- ${user.username}`, async ({ page }) => {
      await loginSetup(page, 'valid'); 
      await page.waitForLoadState('networkidle');

      const productsTitle = page.getByText('Products');
      await expect(productsTitle).toBeVisible({ timeout: 10000 });
    });
  } else {
    test(`Invalid Login Error - ${user.username}`, async ({ page }) => {
      const { loginPage } = await loginSetup(page, 'invalid'); 

      loginPage.errorMsg = page.locator('h3[data-test="error"]');
      await expect(loginPage.errorMsg).toBeVisible({ timeout: 10000 });

      await expect(loginPage.errorMsg).toHaveText(
        'Epic sadface: Sorry, this user has been locked out.'
      );
    });
  }
}

