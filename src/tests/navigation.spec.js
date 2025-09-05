const { test, expect } = require('@playwright/test');
const ProductPage = require('../pages/productPage');
const HomePage = require('../pages/homePage'); // Use correct class
const loginSetup = require('../setup/loginSetup');

test('Navigation & Logout', async ({ page }) => {

  await loginSetup(page, 'valid');

  const productPage = new ProductPage(page);
  const homePage = new HomePage(page); 

  await productPage.scrollDown();

  await homePage.logout();

  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible({ timeout: 10000 });
});
