import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  private readonly dashboardHeading: Locator;
  private readonly sidePanelNavigation: Locator;
  private readonly profilePicture: Locator;
  private readonly logoutMenuItem: Locator;

  constructor(page: Page) {
    super(page);
    this.dashboardHeading = page.getByRole('heading', { name: 'Dashboard' });
    this.sidePanelNavigation = page.getByRole('navigation', { name: 'Sidepanel' });
    this.profilePicture = page.getByRole('img', { name: 'profile picture' });
    this.logoutMenuItem = page.getByRole('menuitem', { name: 'Logout' });
  }

  async isDashboardDisplayed(): Promise<boolean> {
    return this.isVisible(this.dashboardHeading);
  }

  async verifyDashboardUrl(): Promise<void> {
    await this.waitForUrl(/dashboard\/index/);
  }

  getDashboardHeading(): Locator {
    return this.dashboardHeading;
  }

  getNavigationItem(name: string): Locator {
    return this.sidePanelNavigation.getByRole('link', { name, exact: true });
  }

  async logout(): Promise<void> {
    await this.click(this.profilePicture, 'profile menu');
    await this.click(this.logoutMenuItem, 'Logout menu item');
  }
}