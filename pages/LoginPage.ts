import { Locator, Page } from '@playwright/test';

export class LoginPage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;

  constructor(private readonly page: Page) {
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  async gotoLoginPage(): Promise<void> {
    await this.page.goto('auth/login', { waitUntil: 'domcontentloaded' });
  }

  async enterUsername(username: string = 'Admin'): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password: string = 'admin123'): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLogin(): Promise<void> {
    await this.loginButton.click({ noWaitAfter: true });
  }

  async login(username: string = 'Admin', password: string = 'admin123'): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }
}
