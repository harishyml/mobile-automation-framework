const { test, expect } = require('@playwright/test');
const ProductPage = require('../pages/productPage');
const CartPage = require('../pages/cartPage');
const loginSetup = require('../setup/loginSetup');

test('Checkout Flow', async ({ page }) => {
  await loginSetup(page, 'valid');

  const productPage = new ProductPage(page);
  const cartPage = new CartPage(page);

  await productPage.scrollDown();
  await productPage.addProductToCart('Sauce Labs Backpack');
  await productPage.goToCart();

  await cartPage.checkout();
  await expect(page).toHaveURL(/checkout-step-one.html/);
});

