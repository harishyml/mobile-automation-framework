const { test, expect } = require('@playwright/test');
const ProductPage = require('../pages/productPage');
const loginSetup = require('../setup/loginSetup');
const productSets = require('../data/products.json');

test('Add All Products to Cart', async ({ page }) => {
 
  await loginSetup(page, 'valid');

  const productPage = new ProductPage(page);

  await productPage.scrollDown();

  for (const product of productSets) {
    await productPage.addProductToCart(product.name);
  }

  await productPage.goToCart();

  await expect(page.locator('.cart_item')).toHaveCount(productSets.length, { timeout: 10000 });
});
