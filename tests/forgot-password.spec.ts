import { faker } from '@faker-js/faker';
import { test, expect } from '../fixtures/testFixtures';
import { loadCreatedUserTestData } from '../utils/userTestData';

async function getKnownUsername(): Promise<string> {
  try {
    return (await loadCreatedUserTestData()).username;
  } catch (error) {
    if (
      error instanceof Error &&
      'code' in error &&
      error.code === 'ENOENT'
    ) {
      return 'Admin';
    }

    throw error;
  }
}

test('FP-001 open Forgot Password from the login page @smoke @regression', async ({
  page,
  loginPage,
  forgotPasswordPage,
}) => {
  await loginPage.navigateToLoginPage();
  await forgotPasswordPage.openFromLoginPage();

  await expect(page).toHaveURL(/auth\/requestPasswordResetCode/);
  await expect(forgotPasswordPage.getResetPasswordHeading()).toBeVisible();
});

test('FP-002 submit reset request for a known username @regression', async ({
  page,
  loginPage,
  forgotPasswordPage,
}) => {
  const username = await getKnownUsername();

  await loginPage.navigateToLoginPage();
  await forgotPasswordPage.openFromLoginPage();
  await forgotPasswordPage.enterUsername(username);
  await forgotPasswordPage.submitResetRequest();

  await expect(page).toHaveURL(/auth\/sendPasswordReset/);
  await expect(forgotPasswordPage.getRequestConfirmationHeading()).toBeVisible();
  await expect(forgotPasswordPage.getRequestConfirmationText()).toBeVisible();
});

test('FP-003 empty username shows required validation @negative @regression', async ({
  loginPage,
  forgotPasswordPage,
}) => {
  await loginPage.navigateToLoginPage();
  await forgotPasswordPage.openFromLoginPage();
  await forgotPasswordPage.submitResetRequest();

  await expect(forgotPasswordPage.getRequiredFieldError()).toBeVisible();
});

test('FP-004 unknown username receives safe reset-form response @negative @regression', async ({
  page,
  loginPage,
  forgotPasswordPage,
}) => {
  const unknownUsername = `unknown_${faker.string.uuid().replaceAll('-', '')}`;

  await loginPage.navigateToLoginPage();
  await forgotPasswordPage.openFromLoginPage();
  await forgotPasswordPage.enterUsername(unknownUsername);
  await forgotPasswordPage.submitResetRequest();

  await expect(page).toHaveURL(/auth\/sendPasswordReset/);
  await expect(forgotPasswordPage.getRequestConfirmationHeading()).toBeVisible();
  await expect(forgotPasswordPage.getRequestConfirmationText()).toBeVisible();
});

test('FP-005 cancel returns to the login page @regression', async ({
  page,
  loginPage,
  forgotPasswordPage,
}) => {
  await loginPage.navigateToLoginPage();
  await forgotPasswordPage.openFromLoginPage();
  await forgotPasswordPage.returnToLoginPage();

  await expect(page).toHaveURL(/auth\/login/);
  await expect(loginPage.getLoginHeading()).toBeVisible();
});

