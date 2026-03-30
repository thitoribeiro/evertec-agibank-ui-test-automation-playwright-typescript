import { test, expect } from '../fixtures/base-test';

test.describe('Paginação de artigos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('deve avançar para página 2 com artigos diferentes', async ({ paginationPage }) => {
    expect(await paginationPage.isPaginationVisible()).toBe(true);
    const titlesPage1 = await paginationPage.getArticleTitles();
    expect(await paginationPage.isNextButtonVisible()).toBe(true);
    await paginationPage.clickNext();
    const titlesPage2 = await paginationPage.getArticleTitles();
    expect(titlesPage2.length).toBeGreaterThan(0);
    expect(titlesPage2).not.toEqual(titlesPage1);
  });

  test('deve navegar diretamente para a página 3', async ({ paginationPage }) => {
    const titlesPage1 = await paginationPage.getArticleTitles();
    await paginationPage.clickPageNumber(3);
    const titlesPage3 = await paginationPage.getArticleTitles();
    expect(titlesPage3.length).toBeGreaterThan(0);
    expect(titlesPage3).not.toEqual(titlesPage1);
  });

  test('não deve exibir botão Anterior na página 1', async ({ paginationPage }) => {
    expect(await paginationPage.isPreviousButtonVisible()).toBe(false);
  });

  test('deve atualizar a URL com parâmetro de página ao navegar', async ({ paginationPage }) => {
    await paginationPage.clickNext();
    const url = await paginationPage.getCurrentUrl();
    expect(url).toMatch(/\/page\/2|paged=2|page=2/);
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
