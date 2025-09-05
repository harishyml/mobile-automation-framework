const { test, expect } = require('@playwright/test');
const ProductPage = require('../pages/productPage');
const loginSetup = require('../setup/loginSetup');
const productSets = require('../data/products.json');

test('Add Single Product to Cart', async ({ page }) => {
  await loginSetup(page, 'valid');

  const productPage = new ProductPage(page);

  await productPage.scrollDown();

  const productToAdd = productSets[0].name; 
  await productPage.addProductToCart(productToAdd);

  await productPage.goToCart();

  await expect(page.locator('.cart_item')).toHaveCount(1, { timeout: 10000 });
});
