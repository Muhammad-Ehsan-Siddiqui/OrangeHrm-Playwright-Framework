import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class PimPage extends BasePage {
  private readonly pimNavigation: Locator;
  private readonly employeeInformationHeading: Locator;
  private readonly addEmployeeLink: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly employeeIdInput: Locator;
  private readonly employeeNameSearchInput: Locator;
  private readonly saveButton: Locator;
  private readonly personalDetailsSaveButton: Locator;
  private readonly addEmployeeHeading: Locator;
  private readonly personalDetailsHeading: Locator;
  private readonly searchButton: Locator;
  private readonly resetButton: Locator;
  private readonly duplicateEmployeeIdError: Locator;
  private readonly saveConfirmation: Locator;
  private readonly updateConfirmation: Locator;

  constructor(page: Page) {
    super(page);
    this.pimNavigation = page.getByRole('link', { name: 'PIM', exact: true });
    this.employeeInformationHeading = page.getByRole('heading', { name: 'Employee Information' });
    this.addEmployeeLink = page.getByRole('link', { name: 'Add Employee', exact: true });
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
    this.employeeIdInput = page.locator(
      'div:has(> div > label:text-is("Employee Id")) input',
    );
    this.employeeNameSearchInput = page.locator(
      'div:has(> div > label:text-is("Employee Name")) input[placeholder="Type for hints..."]',
    );
    this.saveButton = page.getByRole('button', { name: 'Save', exact: true });
    this.personalDetailsSaveButton = page.getByRole('button', { name: 'Save', exact: true }).first();
    this.addEmployeeHeading = page.getByRole('heading', { name: 'Add Employee' });
    this.personalDetailsHeading = page.getByRole('heading', { name: 'Personal Details' });
    this.searchButton = page.getByRole('button', { name: 'Search', exact: true });
    this.resetButton = page.getByRole('button', { name: 'Reset', exact: true });
    this.duplicateEmployeeIdError = page.getByText('Employee Id already exists', { exact: true });
    this.saveConfirmation = page.getByText('Successfully Saved', { exact: true });
    this.updateConfirmation = page.getByText('Successfully Updated', { exact: true });
  }

  async createEmployee(employeeId: string, firstName: string, lastName: string): Promise<void> {
    await this.openAddEmployeeForm();
    await this.fillEmployeeForm(employeeId, firstName, lastName);
    await this.click(this.saveButton, 'Save new employee');
    await this.waitForElement(this.saveConfirmation);
  }

  async openEmployeeList(): Promise<void> {
    await this.click(this.pimNavigation, 'PIM navigation');
    await this.waitForElement(this.employeeInformationHeading);
  }

  async openAddEmployeeForm(): Promise<void> {
    await this.openEmployeeList();
    await this.click(this.addEmployeeLink, 'Add Employee link');
    await this.waitForElement(this.addEmployeeHeading);
  }

  async fillEmployeeForm(employeeId: string, firstName: string, lastName: string): Promise<void> {
    await this.fill(this.firstNameInput, firstName, 'employee first name');
    await this.fill(this.lastNameInput, lastName, 'employee last name');
    await this.fill(this.employeeIdInput, employeeId, 'employee ID');
  }

  async searchByEmployeeId(employeeId: string): Promise<void> {
    await this.openEmployeeList();
    await this.fill(this.employeeIdInput, employeeId, 'employee ID search');
    await this.click(this.searchButton, 'Search employees');
  }

  async searchByEmployeeName(employeeName: string): Promise<void> {
    await this.openEmployeeList();
    await this.fill(this.employeeNameSearchInput, employeeName, 'employee name search');
    await this.click(this.page.getByRole('option', { name: employeeName, exact: true }), 'employee suggestion');
    await this.click(this.searchButton, 'Search employees');
  }

  async resetSearchFilters(): Promise<void> {
    await this.click(this.resetButton, 'Reset employee search');
  }

  async openEmployeeProfile(employeeId: string): Promise<void> {
    await this.getEmployeeRow(employeeId).click();
    await this.waitForElement(this.personalDetailsHeading);
  }

  async updatePersonalDetails(firstName: string, lastName: string): Promise<void> {
    await this.fill(this.firstNameInput, firstName, 'updated employee first name');
    await this.fill(this.lastNameInput, lastName, 'updated employee last name');
    await this.click(this.personalDetailsSaveButton, 'Save personal details');
    await this.waitForElement(this.updateConfirmation);
  }

  async reloadEmployeeProfile(): Promise<void> {
    await this.page.reload({ waitUntil: 'domcontentloaded' });
    await this.waitForElement(this.personalDetailsHeading);
  }

  async submitEmployeeForm(): Promise<void> {
    await this.click(this.saveButton, 'Submit employee form');
  }

  getEmployeeRow(employeeId: string): Locator {
    return this.page
      .getByRole('row')
      .filter({ has: this.page.getByRole('cell', { name: employeeId, exact: true }) });
  }

  getEmployeeDataRows(): Locator {
    return this.page
      .getByRole('table')
      .getByRole('row')
      .filter({ has: this.page.getByRole('cell') });
  }

  getEmployeeIdInput(): Locator {
    return this.employeeIdInput;
  }

  getFirstNameInput(): Locator {
    return this.firstNameInput;
  }

  getLastNameInput(): Locator {
    return this.lastNameInput;
  }

  getDuplicateEmployeeIdError(): Locator {
    return this.duplicateEmployeeIdError;
  }
}
