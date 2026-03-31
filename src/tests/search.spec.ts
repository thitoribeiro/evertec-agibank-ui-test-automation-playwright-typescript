import { test, expect } from '../fixtures/base-test';

test.describe('Busca de artigos', () => {
  test.beforeEach(async ({ page, homePage }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await homePage.openSearch();
  });

  test('deve retornar resultados para termo válido', async ({ searchPage }) => {
    await searchPage.typeSearchTerm('empréstimo');
    await searchPage.submitByEnter();
    expect(await searchPage.hasResults()).toBe(true);
  });

  test('deve exibir mensagem de nenhum resultado para termo inválido', async ({ searchPage }) => {
    await searchPage.typeSearchTerm('xyzabc123invalido987');
    await searchPage.submitByEnter();
    expect(await searchPage.hasResults()).toBe(false);
    expect(await searchPage.isNoResultsMessageVisible()).toBe(true);
  });

  test('deve aceitar caracteres especiais sem quebrar a página', async ({ page, searchPage }) => {
    await searchPage.typeSearchTerm('@#$%&*!');
    await searchPage.submitByEnter();
    expect(page.url()).toContain('blog.agibank.com.br');
    expect(await page.title()).not.toBe('');
  });

  for (const term of ['INSS', 'Pix', 'cartão']) {
    test(`deve retornar resultados para a categoria: ${term}`, async ({ searchPage }) => {
      await searchPage.typeSearchTerm(term);
      await searchPage.submitByEnter();
      expect(await searchPage.hasResults()).toBe(true);
    });
  }
});
