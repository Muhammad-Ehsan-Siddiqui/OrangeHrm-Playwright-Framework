import { Locator, Page } from '@playwright/test';

export class PimPage {
  private readonly pimNavigation: Locator;
  private readonly addEmployeeButton: Locator;
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly employeeIdInput: Locator;
  private readonly saveButton: Locator;
  private readonly personalDetailsHeading: Locator;

  constructor(private readonly page: Page) {
    this.pimNavigation = page.getByRole('link', { name: 'PIM', exact: true });
    this.addEmployeeButton = page.getByRole('button', { name: /Add/ });
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
    this.employeeIdInput = page.locator(
      'div:has(> div > label:text-is("Employee Id")) input',
    );
    this.saveButton = page.getByRole('button', { name: 'Save', exact: true });
    this.personalDetailsHeading = page.getByRole('heading', { name: 'Personal Details' });
  }

  async createEmployee(employeeId: string, firstName: string, lastName: string): Promise<void> {
    await this.pimNavigation.click();
    await this.addEmployeeButton.click();
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.employeeIdInput.fill(employeeId);
    await this.saveButton.click();
    await this.personalDetailsHeading.waitFor({ state: 'visible' });
  }
}
