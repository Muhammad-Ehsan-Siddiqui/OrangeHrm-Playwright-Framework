import { Locator, Page } from '@playwright/test';
import { logger } from '../utils/logger';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly loginHeading: Locator;
  private readonly requiredFieldErrors: Locator;
  private readonly invalidCredentialsAlert: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.loginHeading = page.getByRole('heading', { name: 'Login' });
    this.requiredFieldErrors = page.getByText('Required', { exact: true });
    this.invalidCredentialsAlert = page.getByRole('alert');
  }

  async gotoLoginPage(): Promise<void> {
    await this.navigate('auth/login');
  }

  async enterUsername(username: string): Promise<void> {
    await this.fill(this.usernameInput, username, 'login username');
  }

  async enterPassword(password: string): Promise<void> {
    await this.fill(this.passwordInput, password, 'login password');
  }

  async clickLogin(): Promise<void> {
    await logger.info('Submit login form');
    await this.click(this.loginButton, 'Login button');
  }

  async loginWithInvalidCredentials(username: string, password: string): Promise<void> {
    await this.login(username, password);
  }

  async isLoginPageDisplayed(): Promise<boolean> {
    return this.isVisible(this.loginHeading);
  }

  async getErrorMessage(): Promise<string> {
    return this.getText(this.invalidCredentialsAlert);
  }

  getLoginHeading(): Locator {
    return this.loginHeading;
  }

  getRequiredFieldErrors(): Locator {
    return this.requiredFieldErrors;
  }

  getInvalidCredentialsAlert(): Locator {
    return this.invalidCredentialsAlert;
  }

  async login(username: string, password: string): Promise<void> {
    await logger.info('Attempt login');
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }
}
