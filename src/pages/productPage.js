class ProductPage {
    constructor(page) {
        this.page = page;
    }

    async addProductToCart(productName) {
        const button = this.page.locator(`.inventory_item:has-text("${productName}") button`);
        await button.tap(); 
    }

    async goToCart() {
        await this.page.locator('.shopping_cart_link').tap();
    }

    async scrollDown(pixels = 500) {
        await this.page.evaluate((y) => window.scrollBy(0, y), pixels);
    }

    async scrollUp(pixels = 500) {
        await this.page.evaluate((y) => window.scrollBy(0, -y), pixels);
    }

    async scrollToElement(selector) {
        await this.page.locator(selector).scrollIntoViewIfNeeded();
    }
}

module.exports = ProductPage;
