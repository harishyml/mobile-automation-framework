class HomePage {
  constructor(page) {
    this.page = page;
    this.productsTitle = page.getByRole('heading', { name: 'Products' });
    this.menuBtn = page.getByRole('button', { name: 'Open Menu' });
    this.logoutBtn = page.getByRole('link', { name: 'Logout' });
  }

  async logout() {
    await this.menuBtn.tap();
    await this.logoutBtn.tap();
  }
}

module.exports = HomePage;
