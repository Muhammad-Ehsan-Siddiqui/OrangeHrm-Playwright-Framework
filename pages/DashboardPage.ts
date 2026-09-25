import { Locator, Page } from '@playwright/test';

export class DashboardPage {
  private readonly dashboardHeading: Locator;

  constructor(private readonly page: Page) {
    this.dashboardHeading = page.getByRole('heading', { name: 'Dashboard' });
  }

  async isDashboardDisplayed(): Promise<boolean> {
    return this.dashboardHeading.isVisible();
  }

  getDashboardHeading(): Locator {
    return this.dashboardHeading;
  }
}