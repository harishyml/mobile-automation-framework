const { test, expect } = require('@playwright/test');
const ProductPage = require('../pages/productPage');
const HomePage = require('../pages/homePage');
const loginSetup = require('../setup/loginSetup');

test('Intentional Failure - Logout should show a fake element', async ({ page }) => {
  await loginSetup(page, 'valid');

  const productPage = new ProductPage(page);
  const homePage = new HomePage(page);

  await productPage.scrollDown();
  await homePage.logout();

  await expect(page.getByRole('button', { name: 'NonExistingButton' }))
    .toBeVisible({ timeout: 5000 });
});
