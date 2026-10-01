import { test, expect } from '../fixtures/testFixtures';

test.describe('Login page', () => {
  test('LOGIN-004 empty username with password entered @negative @regression', async ({
    loginPage,
    loginData,
  }) => {
    await loginPage.gotoLoginPage();
    await loginPage.enterPassword(loginData.emptyUsername.password);
    await loginPage.clickLogin();

    await expect(loginPage.getRequiredFieldErrors()).toHaveCount(1);
  });

  test('LOGIN-005 username entered with empty password @negative @regression', async ({
    loginPage,
    loginData,
  }) => {
    await loginPage.gotoLoginPage();
    await loginPage.enterUsername(loginData.emptyPassword.username);
    await loginPage.clickLogin();

    await expect(loginPage.getRequiredFieldErrors()).toHaveCount(1);
  });

  test('LOGIN-006 both username and password empty @negative @regression', async ({
    loginPage,
    loginData,
  }) => {
    await loginPage.gotoLoginPage();
    await loginPage.enterUsername(loginData.emptyCredentials.username);
    await loginPage.enterPassword(loginData.emptyCredentials.password);
    await loginPage.clickLogin();

    await expect(loginPage.getRequiredFieldErrors()).toHaveCount(2);
  });

  test('LOGIN-007 logout returns to the login page @smoke @regression', async ({
    page,
    loginPage,
    dashboardPage,
    loginData,
  }) => {
    await loginPage.gotoLoginPage();
    await loginPage.login(loginData.validLogin.username, loginData.validLogin.password);
    await expect(dashboardPage.getDashboardHeading()).toBeVisible({ timeout: 15000 });

    await dashboardPage.logout();

    await expect(page).toHaveURL(/auth\/login/);
    await expect(loginPage.getLoginHeading()).toBeVisible();
  });

  test('valid login @smoke @regression', async ({ loginPage, dashboardPage, loginData }) => {
    await loginPage.gotoLoginPage();
    await loginPage.login(loginData.validLogin.username, loginData.validLogin.password);

    await expect(dashboardPage.getDashboardHeading()).toBeVisible({ timeout: 15000 });
  });

  test('invalid login shows an error message @negative @regression', async ({ loginPage, loginData }) => {
    await loginPage.gotoLoginPage();
    await loginPage.login(loginData.invalidLogin.username, loginData.invalidLogin.password);

    await expect(loginPage.getInvalidCredentialsAlert()).toContainText('Invalid credentials', { timeout: 15000 });
  });

  for (const scenario of [
    { name: 'invalid username', dataKey: 'invalidUsername' },
    { name: 'invalid password', dataKey: 'invalidPassword' },
  ] as const) {
    test(`reject ${scenario.name} from JSON test data @negative @regression`, async ({
      loginPage,
      loginData,
    }) => {
      const credentials = loginData[scenario.dataKey];
      await loginPage.gotoLoginPage();
      await loginPage.login(credentials.username, credentials.password);

      await expect(loginPage.getInvalidCredentialsAlert()).toContainText('Invalid credentials');
    });
  }

  test('login page has the expected title @smoke @regression', async ({ page, loginPage }) => {
    await loginPage.gotoLoginPage();

    await expect(page).toHaveTitle('OrangeHRM');
  });
});
