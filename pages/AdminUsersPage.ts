import { Locator, Page } from '@playwright/test';

export type NewSystemUser = {
  employeeName: string;
  username: string;
  password: string;
};

export class AdminUsersPage {
  private readonly adminNavigation: Locator;
  private readonly addUserButton: Locator;
  private readonly employeeNameInput: Locator;
  private readonly usernameSearchInput: Locator;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly confirmPasswordInput: Locator;
  private readonly saveButton: Locator;
  private readonly searchButton: Locator;
  private readonly userRoleDropdown: Locator;
  private readonly statusDropdown: Locator;

  constructor(private readonly page: Page) {
    this.adminNavigation = page.getByRole('link', { name: 'Admin', exact: true });
    this.addUserButton = page.getByRole('button', { name: /Add/ });
    this.employeeNameInput = page.getByPlaceholder('Type for hints...');
    this.usernameSearchInput = page.locator(
      'div:has(> div > label:text-is("Username")) input',
    );
    this.userRoleDropdown = page
      .locator('div:has(> div > label:text-is("User Role"))')
      .getByText('-- Select --');
    this.statusDropdown = page
      .locator('div:has(> div > label:text-is("Status"))')
      .getByText('-- Select --');
    this.usernameInput = page.locator(
      'div:has(> div > label:text-is("Username")) input[autocomplete="off"]',
    );
    this.passwordInput = page.locator(
      'div:has(> div > label:text-is("Password")) input[type="password"]',
    );
    this.confirmPasswordInput = page.locator(
      'div:has(> div > label:text-is("Confirm Password")) input[type="password"]',
    );
    this.saveButton = page.getByRole('button', { name: 'Save', exact: true });
    this.searchButton = page.getByRole('button', { name: 'Search', exact: true });
  }

  async openAddUserForm(): Promise<void> {
    await this.adminNavigation.click();
    await this.addUserButton.click();
  }

  async createUser(user: NewSystemUser): Promise<void> {
    await this.userRoleDropdown.click();
    await this.page.getByRole('option', { name: 'ESS', exact: true }).click();

    await this.employeeNameInput.fill(user.employeeName);
    await this.page.getByRole('option', { name: user.employeeName, exact: true }).click();

    await this.statusDropdown.click();
    await this.page.getByRole('option', { name: 'Enabled', exact: true }).click();

    await this.usernameInput.fill(user.username);
    await this.passwordInput.fill(user.password);
    await this.confirmPasswordInput.fill(user.password);
    await this.saveButton.click();
    await this.page.waitForURL(/admin\/viewSystemUsers/);
  }

  async submitEmptyUserForm(): Promise<void> {
    await this.saveButton.click();
  }

  getRequiredFieldErrors(): Locator {
    return this.page.getByText('Required', { exact: true });
  }

  async searchByUsername(username: string): Promise<void> {
    await this.usernameSearchInput.fill(username);
    await this.searchButton.click({ noWaitAfter: true });
  }
}
