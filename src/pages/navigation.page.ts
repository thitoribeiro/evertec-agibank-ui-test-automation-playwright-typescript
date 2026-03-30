import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { SelectorLoader } from '../utils/selector-loader';

/**
 * Page Object for the Blog do Agi navigation menu.
 * Covers single and multi-level dropdown hover interactions.
 */
export class NavigationPage extends BasePage {
  constructor(page: Page) {
    super(page, new SelectorLoader('navigation'));
  }

  async hoverMenuItem(text: string): Promise<void> {
    const selector = this.selectors.getWith('menuItemWrapper', text);
    await this.page.locator(selector).first().hover();
    await this.page.waitForTimeout(500);
  }

  async isSubmenuVisible(parentText: string): Promise<boolean> {
    // Delegate to getSubmenuItems to avoid strict-mode violations when multiple
    // ul.sub-menu elements are present under the same parent li.
    const items = await this.getSubmenuItems(parentText);
    return items.length > 0;
  }

  async getSubmenuItems(parentText: string): Promise<string[]> {
    try {
      const parent = this.page
        .locator(this.selectors.getWith('menuItemWrapper', parentText))
        .first();
      return parent.locator(this.selectors.get('submenuItems')).allInnerTexts();
    } catch {
      return [];
    }
  }

  async clickSubmenuItem(itemText: string): Promise<void> {
    const selector = this.selectors.getWith('submenuItemLink', itemText);
    await this.page.locator(selector).first().click();
    await this.page.waitForLoadState('networkidle');
  }

  async categoryPageHasArticles(): Promise<boolean> {
    try {
      return (await this.page.locator(this.selectors.get('categoryArticles')).count()) > 0;
    } catch {
      return false;
    }
  }
}
