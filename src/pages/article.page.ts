import { Page } from '@playwright/test';
import { BasePage } from './base.page';
import { SelectorLoader } from '../utils/selector-loader';

/**
 * Page Object for individual blog article pages.
 * Covers metadata validation, breadcrumb and content verification.
 */
export class ArticlePage extends BasePage {
  constructor(page: Page) {
    super(page, new SelectorLoader('article'));
  }

  async getTitle(): Promise<string> {
    try {
      return (await this.page.locator(this.selectors.get('title')).first().innerText()).trim();
    } catch {
      return this.getPageTitle();
    }
  }

  async isTitleVisible(): Promise<boolean> {
    return (await this.getTitle()).length > 0;
  }

  async hasAuthor(): Promise<boolean> {
    try {
      return (await this.page.locator(this.selectors.get('author')).count()) > 0;
    } catch {
      return false;
    }
  }

  async hasPublicationDate(): Promise<boolean> {
    try {
      return (await this.page.locator(this.selectors.get('date')).count()) > 0;
    } catch {
      return false;
    }
  }

  async hasBreadcrumb(): Promise<boolean> {
    try {
      return (await this.page.locator(this.selectors.get('breadcrumb')).count()) > 0;
    } catch {
      return false;
    }
  }

  async breadcrumbHasHomeLink(): Promise<boolean> {
    try {
      const items = await this.page.locator(this.selectors.get('breadcrumbItems')).allInnerTexts();
      return items.some(
        (i) =>
          i.toLowerCase() === 'home' ||
          i.toLowerCase() === 'início' ||
          i.toLowerCase() === 'inicio',
      );
    } catch {
      return false;
    }
  }

  async hasArticleSlugInUrl(): Promise<boolean> {
    const url = await this.getCurrentUrl();
    return (
      !url.endsWith('blog.agibank.com.br/') &&
      !url.includes('?s=') &&
      url.includes('blog.agibank.com.br/')
    );
  }

  async hasContent(): Promise<boolean> {
    try {
      const text = await this.page.locator(this.selectors.get('content')).first().innerText();
      return text.trim().length > 50;
    } catch {
      return false;
    }
  }
}
