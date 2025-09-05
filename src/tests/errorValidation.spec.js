const { test, expect } = require('@playwright/test');
const ProductPage = require('../pages/productPage');
const loginSetup = require('../setup/loginSetup');

test('Error validation - product not found in page', async ({ page }) => {
  await loginSetup(page, 'valid');

  const productPage = new ProductPage(page);
  await productPage.scrollDown();

  const invalidProduct = 'Non Existing Product';
  const button = page.locator(`.inventory_item:has-text("${invalidProduct}") button`);

  await expect(button).toHaveCount(0);
});

