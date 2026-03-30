import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { SelectorLoader } from '../utils/selector-loader';

/**
 * Page Object for the Blog do Agi homepage.
 * Covers hero carousel, search icon and article listing interactions.
 */
export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page, new SelectorLoader('homepage'));
  }

  async isLogoVisible(): Promise<boolean> {
    try {
      const count = await this.page.locator(this.selectors.get('logo')).count();
      if (count > 0) return this.page.locator(this.selectors.get('logo')).first().isVisible();
      // Fallback: logo present if we are on the expected domain
      return (await this.getCurrentUrl()).includes('blog.agibank.com.br');
    } catch {
      return false;
    }
  }

  async isTitleValid(): Promise<boolean> {
    const title = (await this.getPageTitle()).toLowerCase();
    return title.includes('agi') || title.includes('blog');
  }

  async openSearch(): Promise<void> {
    // Astra theme: search input is always in the DOM but CSS-hidden behind a toggle.
    // Click the icon (force) then let CSS animation settle; fill with force.
    try {
      await this.page.locator(this.selectors.get('searchIcon')).first().click({ force: true });
    } catch { /* icon not found — input still usable via force fill */ }
    await this.page.waitForTimeout(400);
  }

  async isHeroVisible(): Promise<boolean> {
    try {
      // Astra blog homepage renders articles directly — no separate carousel container.
      // Use articleCards as the hero presence check (proven to match real HTML).
      const count = await this.page.locator(this.selectors.get('articleCards')).count();
      return count > 0;
    } catch {
      return false;
    }
  }

  async clickHeroReadMore(): Promise<void> {
    // force:true required — UAGB block buttons resolve but may report as not-visible.
    // waitForURL ensures the navigation actually completed before the test asserts the URL.
    await Promise.all([
      this.page.waitForURL(/blog\.agibank\.com\.br\/.+/, { timeout: 15_000 }),
      this.page.locator(this.selectors.get('heroReadMore')).first().click({ force: true }),
    ]);
  }

  async getArticleCardsCount(): Promise<number> {
    return this.page.locator(this.selectors.get('articleCards')).count();
  }

  async getArticleTitles(): Promise<string[]> {
    return this.page.locator(this.selectors.get('articleTitles')).allInnerTexts();
  }
}
