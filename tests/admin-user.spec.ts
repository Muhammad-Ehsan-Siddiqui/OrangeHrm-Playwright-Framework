import { test, expect } from '../fixtures/testFixtures';
import { createNewUserTestData, saveCreatedUserTestData } from '../utils/userTestData';

test('admin can create a system user for a new employee @regression', async ({
  page,
  loginPage,
  pimPage,
  adminUsersPage,
}) => {
  const user = createNewUserTestData();

  await loginPage.gotoLoginPage();
  await loginPage.login();

  await pimPage.createEmployee(user.employeeId, user.firstName, user.lastName);
  await adminUsersPage.openAddUserForm();
  await adminUsersPage.createUser(user);
  await adminUsersPage.searchByUsername(user.username);

  await expect(page).toHaveURL(/admin\/viewSystemUsers/);
  await expect(page.getByRole('row').filter({ hasText: user.username })).toBeVisible();
  await saveCreatedUserTestData(user);
});

test('admin cannot save a user without required details @negative @regression', async ({
  loginPage,
  adminUsersPage,
}) => {
  await loginPage.gotoLoginPage();
  await loginPage.login();
  await adminUsersPage.openAddUserForm();
  await adminUsersPage.submitEmptyUserForm();

  await expect(adminUsersPage.getRequiredFieldErrors().first()).toBeVisible();
});
