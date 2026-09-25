import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'https://opensource-demo.orangehrmlive.com/web/index.php/',
    headless: true,
  },
});
