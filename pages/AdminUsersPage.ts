import { Locator, Page } from '@playwright/test';
import { AdminPage } from './AdminPage';

export type NewSystemUser = {
  employeeName: string;
  username: string;
  password: string;
};

export class AdminUsersPage extends AdminPage {
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
  private readonly saveConfirmation: Locator;

  constructor(page: Page) {
    super(page);
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
    this.saveConfirmation = page.getByText('Successfully Saved', { exact: true });
  }

  async openAddUserForm(): Promise<void> {
    await this.navigateToSystemUsers();
    await this.click(this.addUserButton, 'Add system user');
  }

  async createUser(user: NewSystemUser): Promise<void> {
    await this.click(this.userRoleDropdown, 'User Role dropdown');
    await this.click(this.page.getByRole('option', { name: 'ESS', exact: true }), 'ESS role option');

    await this.fill(this.employeeNameInput, user.employeeName, 'linked employee name');
    await this.click(this.page.getByRole('option', { name: user.employeeName, exact: true }), 'employee suggestion');

    await this.click(this.statusDropdown, 'Status dropdown');
    await this.click(this.page.getByRole('option', { name: 'Enabled', exact: true }), 'Enabled status option');

    await this.fill(this.usernameInput, user.username, 'system username');
    await this.fill(this.passwordInput, user.password, 'system password');
    await this.fill(this.confirmPasswordInput, user.password, 'confirm system password');
    await this.click(this.saveButton, 'Save system user');
    await this.waitForElement(this.saveConfirmation);
  }

  async openSystemUsers(): Promise<void> {
    await this.navigateToSystemUsers();
  }

  async submitEmptyUserForm(): Promise<void> {
    await this.click(this.saveButton, 'Submit empty system-user form');
  }

  getRequiredFieldErrors(): Locator {
    return this.page.getByText('Required', { exact: true });
  }

  getUserRow(username: string): Locator {
    return this.page
      .getByRole('row')
      .filter({ has: this.page.getByRole('cell', { name: username, exact: true }) });
  }

  async searchByUsername(username: string): Promise<void> {
    await this.fill(this.usernameSearchInput, username, 'username search');
    await this.click(this.searchButton, 'Search system users');
  }
}
