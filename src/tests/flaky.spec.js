const { test, expect } = require('@playwright/test');
const ProductPage = require('../pages/productPage');
const HomePage = require('../pages/homePage');
const loginSetup = require('../setup/loginSetup');

test('Flaky Test Example - Fails first, passes second', async ({ page }, testInfo) => {
  await loginSetup(page, 'valid');

  const productPage = new ProductPage(page);
  const homePage = new HomePage(page);

  await productPage.scrollDown();

  if (testInfo.retry === 0) {
    console.log('Failing first attempt to simulate flaky test');
    expect(false).toBe(true); // force fail
  }

  await homePage.logout();
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible({ timeout: 10000 });
}); 
