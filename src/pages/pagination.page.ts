import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { SelectorLoader } from '../utils/selector-loader';

/**
 * Page Object for the Blog do Agi article listing pagination.
 * Covers next/prev navigation, direct page access and URL validation.
 */
export class PaginationPage extends BasePage {
  constructor(page: Page) {
    super(page, new SelectorLoader('pagination'));
  }

  async isPaginationVisible(): Promise<boolean> {
    try {
      return (await this.page.locator(this.selectors.get('container')).count()) > 0;
    } catch {
      return false;
    }
  }

  async isNextButtonVisible(): Promise<boolean> {
    try {
      return this.page.locator(this.selectors.get('nextButton')).first().isVisible();
    } catch {
      return false;
    }
  }

  async isPreviousButtonVisible(): Promise<boolean> {
    try {
      return this.page.locator(this.selectors.get('prevButton')).first().isVisible();
    } catch {
      return false;
    }
  }

  async clickNext(): Promise<void> {
    await this.page.locator(this.selectors.get('nextButton')).first().click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickPageNumber(n: number): Promise<void> {
    const selector = this.selectors.getWith('pageNumberLink', String(n));
    const locator = this.page.locator(selector).first();
    if (await locator.isVisible()) {
      await locator.click();
    } else {
      // Fallback: navigate directly when the page number is not in the visible pagination strip
      const baseUrl = process.env.BASE_URL ?? 'https://blog.agibank.com.br';
      await this.page.goto(`${baseUrl}/page/${n}/`);
    }
    await this.page.waitForLoadState('networkidle');
  }

  async getCurrentPageNumber(): Promise<string> {
    try {
      return (
        await this.page.locator(this.selectors.get('currentPage')).first().innerText()
      ).trim();
    } catch {
      const url = await this.getCurrentUrl();
      const match = url.match(/\/page\/(\d+)/);
      return match?.[1] ?? '1';
    }
  }

  async getArticleTitles(): Promise<string[]> {
    return this.page.locator(this.selectors.get('articleTitles')).allInnerTexts();
  }

  async urlContainsPage(n: number): Promise<boolean> {
    const url = await this.getCurrentUrl();
    return url.includes(`/page/${n}`) || url.includes(`paged=${n}`);
  }
}
