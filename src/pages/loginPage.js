class LoginPage {
  constructor(page) {
    this.page = page;
    this.username = page.getByRole('textbox', { name: 'Username' });
    this.password = page.getByRole('textbox', { name: 'Password' });
    this.loginBtn = page.getByRole('button', { name: 'Login' });
    this.errorMsg = page.getByRole('alert'); 
  }

  async login(user, pass) {
    await this.username.fill(user);
    await this.password.fill(pass);
    await this.loginBtn.tap(); 
    await this.page.waitForLoadState('networkidle');
  }
}

module.exports = LoginPage;
