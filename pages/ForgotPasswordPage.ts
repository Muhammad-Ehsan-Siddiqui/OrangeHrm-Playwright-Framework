import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ForgotPasswordPage extends BasePage {
  private readonly forgotPasswordLink: Locator;
  private readonly resetPasswordHeading: Locator;
  private readonly requestConfirmationHeading: Locator;
  private readonly requestConfirmationText: Locator;
  private readonly usernameInput: Locator;
  private readonly resetPasswordButton: Locator;
  private readonly cancelButton: Locator;
  private readonly requiredFieldError: Locator;

  constructor(page: Page) {
    super(page);
    this.forgotPasswordLink = page.getByText('Forgot your password?', { exact: true });
    this.resetPasswordHeading = page.getByRole('heading', { name: 'Reset Password' });
    this.requestConfirmationHeading = page.getByRole('heading', {
      name: 'Reset Password link sent successfully',
    });
    this.requestConfirmationText = page.getByText(
      'A reset password link has been sent to you via email.',
      { exact: true },
    );
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.resetPasswordButton = page.getByRole('button', { name: 'Reset Password' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel', exact: true });
    this.requiredFieldError = page.getByText('Required', { exact: true });
  }

  async openFromLoginPage(): Promise<void> {
    await this.click(this.forgotPasswordLink, 'Forgot Password link');
    await this.waitForElement(this.resetPasswordHeading);
  }

  async enterUsername(username: string): Promise<void> {
    await this.fill(this.usernameInput, username, 'recovery username');
  }

  async submitResetRequest(): Promise<void> {
    await this.click(this.resetPasswordButton, 'Reset Password button');
  }

  async returnToLoginPage(): Promise<void> {
    await this.click(this.cancelButton, 'Cancel recovery');
  }

  getResetPasswordHeading(): Locator {
    return this.resetPasswordHeading;
  }

  getRequestConfirmationHeading(): Locator {
    return this.requestConfirmationHeading;
  }

  getRequestConfirmationText(): Locator {
    return this.requestConfirmationText;
  }

  getRequiredFieldError(): Locator {
    return this.requiredFieldError;
  }
}
