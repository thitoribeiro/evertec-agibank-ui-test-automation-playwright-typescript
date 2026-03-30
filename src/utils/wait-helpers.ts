import { Page, Locator } from '@playwright/test';

/**
 * Collection of reusable wait helpers for Playwright tests.
 */
export class WaitHelpers {
  constructor(private readonly page: Page) {}

  /**
   * Waits for at least one element matching the selector to be visible.
   */
  async waitForVisible(selector: string, timeout = 10_000): Promise<void> {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
  }

  /**
   * Tries multiple selectors and returns the first visible locator.
   */
  async firstVisible(selectors: string[]): Promise<Locator> {
    for (const selector of selectors) {
      try {
        const locator = this.page.locator(selector).first();
        if (await locator.isVisible()) return locator;
      } catch {
        continue;
      }
    }
    throw new Error(`None of the selectors were visible: ${selectors.join(', ')}`);
  }

  /**
   * Waits for navigation to complete after an action.
   */
  async afterNavigation(action: () => Promise<void>): Promise<void> {
    await Promise.all([this.page.waitForLoadState('domcontentloaded'), action()]);
  }
}
