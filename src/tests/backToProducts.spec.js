const { test, expect } = require('@playwright/test');
const ProductPage = require('../pages/productPage');
const loginSetup = require('../setup/loginSetup');


test('Back to Products', async ({ page }) => {
  
  await loginSetup(page);
  const productPage = new ProductPage(page);


  await productPage.goToCart();
  await page.locator('[data-test="continue-shopping"]').scrollIntoViewIfNeeded();
  await page.locator('[data-test="continue-shopping"]').tap();

  await expect(page.locator('.inventory_list')).toBeVisible();
});
