import { test as base, expect } from '@playwright/test';
import { AdminUsersPage } from '../pages/AdminUsersPage';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { PimPage } from '../pages/PimPage';

type Fixtures = {
  adminUsersPage: AdminUsersPage;
  dashboardPage: DashboardPage;
  loginPage: LoginPage;
  pimPage: PimPage;
};

export const test = base.extend<Fixtures>({
  adminUsersPage: async ({ page }, use) => {
    await use(new AdminUsersPage(page));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  pimPage: async ({ page }, use) => {
    await use(new PimPage(page));
  },
});

export { expect };