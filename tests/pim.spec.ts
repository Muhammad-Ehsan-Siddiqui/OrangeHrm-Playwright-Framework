import { faker } from '@faker-js/faker';
import { test, expect } from '../fixtures/testFixtures';
import { LoginPage } from '../pages/LoginPage';
import { PimPage } from '../pages/PimPage';
import { createNewUserTestData } from '../utils/userTestData';
import type { LoginTestData } from '../utils/testDataReader';

async function createTestEmployee(
  loginPage: LoginPage,
  pimPage: PimPage,
  loginData: LoginTestData,
) {
  const employee = createNewUserTestData();

  await loginPage.gotoLoginPage();
  await loginPage.login(loginData.validLogin.username, loginData.validLogin.password);
  await pimPage.createEmployee(employee.employeeId, employee.firstName, employee.lastName);

  return employee;
}

test('PIM-003 search for an automation-created employee by ID @smoke @regression', async ({
  loginPage,
  pimPage,
  loginData,
}) => {
  const employee = await createTestEmployee(loginPage, pimPage, loginData);

  await pimPage.searchByEmployeeId(employee.employeeId);

  await expect(pimPage.getEmployeeRow(employee.employeeId)).toBeVisible();
});

test('PIM-004 search for a nonexistent employee @negative @regression', async ({
  loginPage,
  pimPage,
  loginData,
}) => {
  const nonexistentEmployeeId = faker.string.numeric(12);

  await loginPage.gotoLoginPage();
  await loginPage.login(loginData.validLogin.username, loginData.validLogin.password);
  await pimPage.searchByEmployeeId(nonexistentEmployeeId);

  await expect(pimPage.getEmployeeDataRows()).toHaveCount(0);
});

test('PIM-005 reset employee search filters @regression', async ({ loginPage, pimPage, loginData }) => {
  const employee = await createTestEmployee(loginPage, pimPage, loginData);

  await pimPage.searchByEmployeeId(employee.employeeId);
  await expect(pimPage.getEmployeeRow(employee.employeeId)).toBeVisible();
  await pimPage.resetSearchFilters();

  await expect(pimPage.getEmployeeIdInput()).toHaveValue('');
});

test('PIM-006 open an employee profile from search results @regression', async ({
  loginPage,
  pimPage,
  loginData,
}) => {
  const employee = await createTestEmployee(loginPage, pimPage, loginData);

  await pimPage.searchByEmployeeId(employee.employeeId);
  await pimPage.openEmployeeProfile(employee.employeeId);

  await expect(pimPage.getFirstNameInput()).toHaveValue(employee.firstName);
  await expect(pimPage.getLastNameInput()).toHaveValue(employee.lastName);
});

test('PIM-007 edit employee personal details @regression', async ({ loginPage, pimPage, loginData }) => {
  const employee = await createTestEmployee(loginPage, pimPage, loginData);
  const updatedFirstName = `${employee.firstName}Updated`;
  const updatedLastName = `${employee.lastName.slice(0, 20)}Updated`;

  await pimPage.searchByEmployeeId(employee.employeeId);
  await pimPage.openEmployeeProfile(employee.employeeId);
  await expect(pimPage.getFirstNameInput()).toHaveValue(employee.firstName);
  await expect(pimPage.getLastNameInput()).toHaveValue(employee.lastName);
  await pimPage.updatePersonalDetails(updatedFirstName, updatedLastName);
  await pimPage.reloadEmployeeProfile();

  await expect(pimPage.getFirstNameInput()).toHaveValue(updatedFirstName, { timeout: 15000 });
  await expect(pimPage.getLastNameInput()).toHaveValue(updatedLastName, { timeout: 15000 });
});

test('PIM-009 reject a duplicate employee ID @negative @regression', async ({
  loginPage,
  pimPage,
  loginData,
}) => {
  const employee = await createTestEmployee(loginPage, pimPage, loginData);
  const duplicateDetails = createNewUserTestData();

  await pimPage.openAddEmployeeForm();
  await pimPage.fillEmployeeForm(
    employee.employeeId,
    duplicateDetails.firstName,
    duplicateDetails.lastName,
  );
  await pimPage.submitEmployeeForm();

  await expect(pimPage.getDuplicateEmployeeIdError()).toBeVisible();
});

test('PIM-011 filter employees by employee name @regression', async ({ loginPage, pimPage, loginData }) => {
  const employee = await createTestEmployee(loginPage, pimPage, loginData);

  await pimPage.searchByEmployeeName(employee.employeeName);

  await expect(pimPage.getEmployeeRow(employee.employeeId)).toBeVisible();
});
