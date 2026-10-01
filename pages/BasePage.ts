import type { Locator, Page } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { logger } from '../utils/logger';

type LocatorWaitState = NonNullable<Parameters<Locator['waitFor']>[0]>['state'];
type PageLoadState = Parameters<Page['waitForLoadState']>[0];
type PageNavigationOptions = NonNullable<Parameters<Page['goto']>[1]>;
type SelectOptionValue = Parameters<Locator['selectOption']>[0];

export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async click(locator: Locator, description = 'page element'): Promise<void> {
    await logger.debug(`Click: ${description}`);
    await locator.click();
  }

  async fill(locator: Locator, value: string, description = 'field'): Promise<void> {
    await logger.debug(`Fill: ${description}`);
    await locator.fill(value);
  }

  async waitForElement(
    locator: Locator,
    state: LocatorWaitState = 'visible',
  ): Promise<void> {
    await locator.waitFor({ state });
  }

  async getText(locator: Locator): Promise<string> {
    return locator.innerText();
  }

  async isVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible();
  }

  async takeScreenshot(name: string): Promise<string> {
    const safeName = name.replace(/[<>:"/\\|?*]/g, '_');
    const screenshotDirectory = resolve(process.cwd(), 'screenshots');
    await mkdir(screenshotDirectory, { recursive: true });
    const screenshotPath = resolve(screenshotDirectory, `${safeName}-${Date.now()}.png`);
    await this.page.screenshot({ path: screenshotPath, fullPage: true });
    await logger.info(`Screenshot saved: ${screenshotPath}`);
    return screenshotPath;
  }

  async navigate(url: string, options: PageNavigationOptions = {}): Promise<void> {
    await logger.info(`Navigate to: ${url}`);
    await this.page.goto(url, { waitUntil: 'domcontentloaded', ...options });
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async waitForUrl(url: string | RegExp): Promise<void> {
    await this.page.waitForURL(url);
  }

  async press(locator: Locator, key: string): Promise<void> {
    await locator.press(key);
  }

  async selectOption(
    locator: Locator,
    values: SelectOptionValue,
  ): Promise<string[]> {
    return locator.selectOption(values);
  }

  async waitForPageLoad(state: PageLoadState = 'domcontentloaded'): Promise<void> {
    await this.page.waitForLoadState(state);
  }
}
