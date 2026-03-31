import { test, expect } from '../fixtures/base-test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('deve carregar com título e logo visíveis', async ({ homePage }) => {
    expect(await homePage.isTitleValid()).toBe(true);
    expect(await homePage.isLogoVisible()).toBe(true);
  });

  test('deve exibir artigos no carrossel hero', async ({ homePage }) => {
    expect(await homePage.isHeroVisible()).toBe(true);
  });

  test('deve exibir cards de artigos na seção Últimas do Blog', async ({ homePage }) => {
    const count = await homePage.getArticleCardsCount();
    expect(count).toBeGreaterThan(0);
  });
});
