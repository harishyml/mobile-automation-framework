const { devices } = require('@playwright/test');

module.exports = {
  retries: 2,
  reporter: [['html', { outputFolder: 'reports/html' }]],
  projects: [
    {
      name: 'iPhone 13',
      use: {
        browserName: 'webkit',
        viewport: { width: 390, height: 844 },
        userAgent: devices['iPhone 13'].userAgent,
        hasTouch: true,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
      },
    },
    {
      name: 'Pixel 5 (Android)',
      use: {
        browserName: 'chromium',
        viewport: { width: 393, height: 851 },
        userAgent: devices['Pixel 5'].userAgent,
         hasTouch: true,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
      },
    },
  ],
  use: {
    baseURL: 'https://www.saucedemo.com',
  },
};
