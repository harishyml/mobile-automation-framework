const users = require('../data/users.json');
const LoginPage = require('../pages/loginPage');
const HomePage = require('../pages/homePage');

async function loginSetup(page, loginType = 'valid') {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);

  let user;
  if (loginType === 'valid') {
    user = users.find(u => u.valid);
    if (!user) throw new Error('No valid user found in users.json');
  } else {
    user = users.find(u => !u.valid);
    if (!user) throw new Error('No invalid user found in users.json');
  }

  await page.goto('/');

  await loginPage.login(user.username, user.password);

  if (loginType === 'valid') {
    // Wait for either Products heading OR URL contains inventory.html
    await page.waitForFunction(() => {
      const heading = document.querySelector('div.inventory_container h1, div.inventory_container h2');
      return heading?.innerText.includes('Products') || window.location.href.includes('inventory.html');
    }, { timeout: 30000 });
  }

  return { loginPage, homePage, user };
}

module.exports = loginSetup;
