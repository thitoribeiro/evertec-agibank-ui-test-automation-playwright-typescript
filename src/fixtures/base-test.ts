import { test as base } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { SearchPage } from '../pages/search.page';
import { ArticlePage } from '../pages/article.page';
import { NavigationPage } from '../pages/navigation.page';
import { PaginationPage } from '../pages/pagination.page';
import { logger } from '../utils/logger';

type PageObjects = {
  homePage: HomePage;
  searchPage: SearchPage;
  articlePage: ArticlePage;
  navigationPage: NavigationPage;
  paginationPage: PaginationPage;
};

/**
 * Extended Playwright test fixture that injects all Page Objects.
 * Handles automatic logging of test start/end.
 */
export const test = base.extend<PageObjects>({
  homePage: async ({ page }, use) => {
    logger.info(`Setting up HomePage fixture`);
    await use(new HomePage(page));
  },

  searchPage: async ({ page }, use) => {
    await use(new SearchPage(page));
  },

  articlePage: async ({ page }, use) => {
    await use(new ArticlePage(page));
  },

  navigationPage: async ({ page }, use) => {
    await use(new NavigationPage(page));
  },

  paginationPage: async ({ page }, use) => {
    await use(new PaginationPage(page));
  },
});

export { expect } from '@playwright/test';
