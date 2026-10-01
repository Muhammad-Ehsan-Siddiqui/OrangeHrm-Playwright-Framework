import { test, expect } from '../fixtures/testFixtures';

const criticalNavigationItems = ['Admin', 'PIM', 'Leave', 'Time'];

test('DASH-002 critical dashboard navigation entries are available @regression', async ({
  loginPage,
  dashboardPage,
  loginData,
}) => {
  await loginPage.navigateToLoginPage();
  await loginPage.login(loginData.validLogin.username, loginData.validLogin.password);
  await expect(dashboardPage.getDashboardHeading()).toBeVisible();

  for (const item of criticalNavigationItems) {
    await expect(dashboardPage.getNavigationItem(item)).toBeVisible();
  }
});
