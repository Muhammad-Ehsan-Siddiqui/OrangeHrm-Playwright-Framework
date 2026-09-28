import { test, expect } from '../fixtures/testFixtures';

test.describe('Login page', () => {
  test('valid login @smoke @regression', async ({ loginPage, dashboardPage }) => {
    await loginPage.gotoLoginPage();
    await loginPage.login('Admin', 'admin123');

    await expect(dashboardPage.getDashboardHeading()).toBeVisible({ timeout: 15000 });
   // expect(await dashboardPage.isDashboardDisplayed()).toBe(true);
  });

  test('invalid login shows an error message @negative @regression', async ({ page, loginPage }) => {
    await loginPage.gotoLoginPage();
    await loginPage.login('Admin', 'wrong-password');

    await expect(page.getByRole('alert')).toContainText('Invalid credentials', { timeout: 15000 });
  });

  test('login page has the expected title @smoke @regression', async ({ page, loginPage }) => {
    await loginPage.gotoLoginPage();

    await expect(page).toHaveTitle('OrangeHRM');
  });
});
