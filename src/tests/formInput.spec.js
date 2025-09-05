const { test, expect } = require('@playwright/test');
const loginSetup = require('../setup/loginSetup');
const CartPage = require('../pages/cartPage');
const ProductPage = require('../pages/productPage');

test('Form input on checkout', async ({ page }) => {
  await loginSetup(page, 'valid');

  const productPage = new ProductPage(page);
  const cartPage = new CartPage(page);

  await productPage.scrollDown();
  await productPage.addProductToCart('Sauce Labs Backpack');
  await productPage.goToCart();

  await cartPage.checkout();

  await page.getByRole('textbox', { name: 'First Name' }).fill('John');
  await page.getByRole('textbox', { name: 'Last Name' }).fill('Doe');
  await page.getByRole('textbox', { name: 'Postal Code' }).fill('12345');

  await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
});

