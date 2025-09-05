class CartPage {
  constructor(page) {
    this.page = page;
    this.checkoutBtn = page.getByRole('button', { name: 'Checkout' });
  }

  async checkout() {
    await this.checkoutBtn.tap();
  }
}

module.exports = CartPage;
