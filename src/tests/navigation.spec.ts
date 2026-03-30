import { test, expect } from '../fixtures/base-test';

test.describe('Navegação por menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('deve exibir submenu ao fazer hover em Produtos', async ({ navigationPage }) => {
    await navigationPage.hoverMenuItem('Produtos');
    expect(await navigationPage.isSubmenuVisible('Produtos')).toBe(true);
    const items = await navigationPage.getSubmenuItems('Produtos');
    expect(items.length).toBeGreaterThan(0);
  });

  test('deve exibir Consignado e Pessoal ao hover em Empréstimos', async ({
    page,
    navigationPage,
  }) => {
    await navigationPage.hoverMenuItem('Produtos');
    await page.waitForTimeout(300);
    await navigationPage.hoverMenuItem('Empréstimos');
    const items = await navigationPage.getSubmenuItems('Empréstimos');
    const itemsText = items.map((i) => i.toLowerCase()).join(' ');
    expect(itemsText).toMatch(/consignado|pessoal/);
  });

  test('deve navegar para categoria e exibir artigos', async ({ page, navigationPage }) => {
    await navigationPage.hoverMenuItem('Produtos');
    await page.waitForTimeout(300);
    await navigationPage.clickSubmenuItem('Conta Corrente');
    expect(page.url()).toContain('blog.agibank.com.br');
    expect(await navigationPage.categoryPageHasArticles()).toBe(true);
  });

  test('deve exibir submenu do O Agibank com Colunas, Notícias e Carreira', async ({
    navigationPage,
  }) => {
    await navigationPage.hoverMenuItem('O Agibank');
    expect(await navigationPage.isSubmenuVisible('O Agibank')).toBe(true);
    const items = await navigationPage.getSubmenuItems('O Agibank');
    const itemsText = items.map((i) => i.toLowerCase()).join(' ');
    expect(itemsText).toMatch(/colunas|notícias|carreira/);
  });
});
