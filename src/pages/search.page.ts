import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { SelectorLoader } from '../utils/selector-loader';

/**
 * Page Object for the Blog do Agi search functionality.
 * Covers input interaction, result validation and empty state.
 */
export class SearchPage extends BasePage {
  constructor(page: Page) {
    super(page, new SelectorLoader('search'));
  }

  private get inputLocator(): Locator {
    return this.page.locator(this.selectors.get('input')).first();
  }

  async typeSearchTerm(term: string): Promise<void> {
    await this.inputLocator.fill(term);
  }

  async submitByEnter(): Promise<void> {
    await this.inputLocator.press('Enter');
    await this.page.waitForLoadState('networkidle');
  }

  async submitByButton(): Promise<void> {
    try {
      const btn = this.page.locator(this.selectors.get('submitButton')).first();
      if (await btn.isVisible()) {
        await btn.click();
        await this.page.waitForLoadState('networkidle');
        return;
      }
    } catch { /* fallback to Enter */ }
    await this.submitByEnter();
  }

  async hasResults(): Promise<boolean> {
    try {
      await this.page.locator(this.selectors.get('resultItems'))
        .first()
        .waitFor({ state: 'visible', timeout: 5_000 });
      return (await this.page.locator(this.selectors.get('resultItems')).count()) > 0;
    } catch {
      return false;
    }
  }

  async getResultsCount(): Promise<number> {
    return this.page.locator(this.selectors.get('resultItems')).count();
  }

  async getResultTitles(): Promise<string[]> {
    return this.page.locator(this.selectors.get('resultTitles')).allInnerTexts();
  }

  async getFirstResultTitle(): Promise<string> {
    const titles = await this.getResultTitles();
    return titles[0]?.trim() ?? '';
  }

  async isNoResultsMessageVisible(): Promise<boolean> {
    try {
      if ((await this.page.locator(this.selectors.get('noResults')).count()) > 0) return true;
      const content = (await this.page.content()).toLowerCase();
      return content.includes(this.selectors.get('noResultsText'));
    } catch {
      return false;
    }
  }

  async allResultsHaveLinks(): Promise<boolean> {
    const links = await this.page.locator(this.selectors.get('resultTitles')).all();
    if (links.length === 0) return false;
    for (const link of links) {
      const href = await link.getAttribute('href');
      if (!href) return false;
    }
    return true;
  }

  async clickFirstResult(): Promise<string> {
    const firstLink = this.page.locator(this.selectors.get('resultTitles')).first();
    const href = (await firstLink.getAttribute('href')) ?? '';
    await firstLink.click();
    await this.page.waitForLoadState('networkidle');
    return href;
  }
}
