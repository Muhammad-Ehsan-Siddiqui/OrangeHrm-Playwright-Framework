import { test as base, expect } from '@playwright/test';
import { AdminPage } from '../pages/AdminPage';
import { AdminUsersPage } from '../pages/AdminUsersPage';
import { DashboardPage } from '../pages/DashboardPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { LoginPage } from '../pages/LoginPage';
import { PimPage } from '../pages/PimPage';
import { logger } from '../utils/logger';
import { readLoginTestData, LoginTestData } from '../utils/testDataReader';

type Fixtures = {
  adminPage: AdminPage;
  adminUsersPage: AdminUsersPage;
  dashboardPage: DashboardPage;
  forgotPasswordPage: ForgotPasswordPage;
  loginPage: LoginPage;
  loginData: LoginTestData;
  pimPage: PimPage;
  testLifecycle: void;
};

export const test = base.extend<Fixtures>({
  adminPage: async ({ page }, use) => {
    await use(new AdminPage(page));
  },

  adminUsersPage: async ({ page }, use) => {
    await use(new AdminUsersPage(page));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  forgotPasswordPage: async ({ page }, use) => {
    await use(new ForgotPasswordPage(page));
  },

  pimPage: async ({ page }, use) => {
    await use(new PimPage(page));
  },

  loginData: async ({}, use) => {
    await use(readLoginTestData());
  },

  testLifecycle: [
    async ({}, use, testInfo) => {
      await logger.info(`Test started: ${testInfo.title}`);
      try {
        await use();
      } finally {
        const status = testInfo.status ?? 'unknown';
        const summary = `Test finished: ${testInfo.title}; status=${status}; retry=${testInfo.retry}`;
        if (status !== testInfo.expectedStatus) {
          await logger.error(`${summary}; ${testInfo.errors.map((error) => error.message).join(' | ')}`);
        } else {
          await logger.info(summary);
        }
      }
    },
    { auto: true },
  ],
});

export { expect };