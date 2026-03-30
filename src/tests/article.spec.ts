import { test, expect } from '../fixtures/base-test';

test.describe('Leitura de artigo', () => {
  test.beforeEach(async ({ page, homePage, searchPage }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await homePage.openSearch();
    await searchPage.typeSearchTerm('empréstimo');
    await searchPage.submitByEnter();
    const hasResults = await searchPage.hasResults();
    expect(hasResults, 'Precondição: busca deve retornar resultados').toBe(true);
    await searchPage.clickFirstResult();
  });

  test('deve abrir o artigo correto ao clicar no resultado', async ({ articlePage }) => {
    expect(await articlePage.isTitleVisible()).toBe(true);
    expect(await articlePage.hasArticleSlugInUrl()).toBe(true);
  });

  test('deve exibir título, autor e data de publicação', async ({ articlePage }) => {
    expect(await articlePage.isTitleVisible()).toBe(true);
    expect(await articlePage.hasAuthor()).toBe(true);
    expect(await articlePage.hasPublicationDate()).toBe(true);
  });

  test('deve exibir breadcrumb com link Home', async ({ articlePage }) => {
    expect(await articlePage.hasBreadcrumb()).toBe(true);
    expect(await articlePage.breadcrumbHasHomeLink()).toBe(true);
  });

  test('deve ter URL com slug do artigo', async ({ articlePage }) => {
    const url = await articlePage.getCurrentUrl();
    expect(url).toContain('blog.agibank.com.br/');
    expect(url).not.toContain('?s=');
  });

  test('deve conter corpo de texto legível', async ({ articlePage }) => {
    expect(await articlePage.hasContent()).toBe(true);
  });
});
