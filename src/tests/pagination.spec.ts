import { test, expect } from '../fixtures/base-test';

test.describe('Paginação de artigos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('não deve exibir botão Anterior na página 1', async ({ paginationPage }) => {
    expect(await paginationPage.isPreviousButtonVisible()).toBe(false);
  });

  test('deve exibir botão Anterior na página 2 e voltar à página 1', async ({
    page,
    paginationPage,
  }) => {
    await paginationPage.clickNext();
    expect(await paginationPage.isPreviousButtonVisible()).toBe(true);
    const titlesPage2 = await paginationPage.getArticleTitles();
    await page.goBack({ waitUntil: 'domcontentloaded' });
    const titlesPage1 = await paginationPage.getArticleTitles();
    expect(titlesPage1).not.toEqual(titlesPage2);
  });
});
