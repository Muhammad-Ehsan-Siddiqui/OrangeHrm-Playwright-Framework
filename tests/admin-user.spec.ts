import { test, expect } from '../fixtures/testFixtures';
import { createNewUserTestData, saveCreatedUserTestData } from '../utils/userTestData';

test('admin can create a system user for a new employee @regression', async ({
  page,
  loginPage,
  pimPage,
  adminUsersPage,
  loginData,
}) => {
  const user = createNewUserTestData();

  await loginPage.gotoLoginPage();
  await loginPage.login(loginData.validLogin.username, loginData.validLogin.password);

  await pimPage.createEmployee(user.employeeId, user.firstName, user.lastName);
  await adminUsersPage.openAddUserForm();
  await adminUsersPage.createUser(user);
  await adminUsersPage.openSystemUsers();
  await adminUsersPage.searchByUsername(user.username);

  await expect(page).toHaveURL(/admin\/viewSystemUsers/);
  await expect(adminUsersPage.getUserRow(user.username)).toBeVisible();
  await saveCreatedUserTestData(user);
});

test('admin cannot save a user without required details @negative @regression', async ({
  loginPage,
  adminUsersPage,
  loginData,
}) => {
  await loginPage.gotoLoginPage();
  await loginPage.login(loginData.validLogin.username, loginData.validLogin.password);
  await adminUsersPage.openAddUserForm();
  await adminUsersPage.submitEmptyUserForm();

  await expect(adminUsersPage.getRequiredFieldErrors().first()).toBeVisible();
});
