import { Page } from '@playwright/test';
import { SelectorLoader } from '../utils/selector-loader';
import { WaitHelpers } from '../utils/wait-helpers';
import { logger } from '../utils/logger';

/**
 * Base class for all Page Objects.
 * Provides common utilities and enforces consistent structure across pages.
 */
export abstract class BasePage {
  protected readonly wait: WaitHelpers;

  constructor(
    protected readonly page: Page,
    protected readonly selectors: SelectorLoader,
  ) {
    this.wait = new WaitHelpers(page);
  }

  async navigateTo(path = ''): Promise<void> {
    const url = `${process.env.BASE_URL ?? 'https://blog.agibank.com.br'}${path}`;
    logger.info(`Navigating to: ${url}`);
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  async getPageTitle(): Promise<string> {
    return this.page.title();
  }
}
