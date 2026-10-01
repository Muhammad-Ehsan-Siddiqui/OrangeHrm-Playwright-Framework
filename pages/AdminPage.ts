import type { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class AdminPage extends BasePage {
  private readonly adminNavigation: Locator;
  private readonly adminHeading: Locator;
  private readonly systemUsersHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.adminNavigation = page.getByRole('link', { name: 'Admin', exact: true });
    this.adminHeading = page.getByRole('heading', { name: 'Admin', exact: true });
    this.systemUsersHeading = page.getByRole('heading', { name: 'System Users' });
  }

  async navigateToAdmin(): Promise<void> {
    await this.click(this.adminNavigation, 'Admin navigation');
    await this.waitForElement(this.adminHeading);
  }

  async navigateToSystemUsers(): Promise<void> {
    await this.navigateToAdmin();
    await this.waitForElement(this.systemUsersHeading);
  }

  async isAdminPageDisplayed(): Promise<boolean> {
    return this.isVisible(this.adminHeading);
  }

  getAdminPageHeading(): Locator {
    return this.adminHeading;
  }

  getSystemUsersHeading(): Locator {
    return this.systemUsersHeading;
  }
}
