import { test, expect } from '../fixtures/testFixtures';

test.describe('Login page', () => {
  test('valid login', async ({ page, loginPage }) => {
    await loginPage.gotoLoginPage();
    await loginPage.login('Admin', 'admin123');

    await expect(page).toHaveURL(/dashboard\/index/);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 15000 });
  });

  test('invalid login shows an error message', async ({ page, loginPage }) => {
    await loginPage.gotoLoginPage();
    await loginPage.login('Admin', 'wrong-password');

    await expect(page.getByRole('alert')).toContainText('Invalid credentials', { timeout: 15000 });
  });

  test('login page has the expected title', async ({ page, loginPage }) => {
    await loginPage.gotoLoginPage();

    await expect(page).toHaveTitle('OrangeHRM');
  });
});
