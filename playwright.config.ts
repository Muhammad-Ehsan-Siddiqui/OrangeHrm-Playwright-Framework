import { defineConfig, devices } from '@playwright/test';
import { frameworkConfig } from './utils/configReader';

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  timeout: frameworkConfig.timeout,
  expect: {
    timeout: frameworkConfig.expectTimeout,
  },
  // Retries absorb transient CI/network noise only; locally a failure must surface immediately.
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : frameworkConfig.workers,
  forbidOnly: Boolean(process.env.CI),
  reporter: [
    [process.env.CI ? 'dot' : 'list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['allure-playwright', { resultsDir: 'reports/allure-results' }],
  ],
  use: {
    baseURL: frameworkConfig.baseURL,
    browserName: frameworkConfig.browser,
    headless: frameworkConfig.headless,
    actionTimeout: frameworkConfig.actionTimeout,
    navigationTimeout: frameworkConfig.navigationTimeout,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: frameworkConfig.browser,
      use: { ...devices['Desktop Chrome'], browserName: frameworkConfig.browser },
    },
  ],
});
