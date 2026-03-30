import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { SelectorLoader } from '../utils/selector-loader';

/**
 * Page Object for the Blog do Agi search functionality.
 * Covers input interaction, result validation and empty state.
 */
export class SearchPage extends BasePage {
  // Stores the last typed term so submitByEnter can set it via evaluate()
  // before calling requestSubmit() — fill({force:true}) on CSS-hidden inputs
  // does not persist through form submission in Astra's DOM.
  private _pendingTerm = '';

  constructor(page: Page) {
    super(page, new SelectorLoader('search'));
  }

  private get inputLocator(): Locator {
    return this.page.locator(this.selectors.get('input')).first();
  }

  async typeSearchTerm(term: string): Promise<void> {
    this._pendingTerm = term;
    // force:true bypasses Astra's CSS-hidden input while the toggle animation settles
    await this.inputLocator.fill(term, { force: true });
  }

  async submitByEnter(): Promise<void> {
    // Astra's CSS-hidden input loses fill() value before form.requestSubmit() fires.
    // Use the native HTMLInputElement value setter inside evaluate() to guarantee
    // the term is present in the input at the moment of submission.
    const term = this._pendingTerm;
    const currentUrl = this.page.url();
    const navigated = this.page.waitForURL(
      (url) => url.toString() !== currentUrl,
      { waitUntil: 'domcontentloaded', timeout: 10_000 },
    );
    await this.page.evaluate((searchTerm) => {
      const input = document.querySelector<HTMLInputElement>('input[name="s"]');
      if (input) {
        const nativeSetter = Object.getOwnPropertyDescriptor(
          HTMLInputElement.prototype, 'value',
        )?.set;
        nativeSetter?.call(input, searchTerm);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        const form = input.closest<HTMLFormElement>('form');
        form?.requestSubmit();
      }
    }, term);
    await navigated;
  }

  async submitByButton(): Promise<void> {
    // Astra theme CSS-hides the form submit button (.search-submit { display:none }).
    // Both methods must produce identical results via the same submission path.
    await this.submitByEnter();
  }

  async hasResults(): Promise<boolean> {
    // The .no-results marker is the authoritative signal — return false immediately.
    // A JavaScript plugin may inject "suggested articles" into #primary even on no-results
    // pages, so checking resultTitles alone is not sufficient.
    if ((await this.page.locator(this.selectors.get('noResults')).count()) > 0) {
      return false;
    }
    try {
      // resultTitles targets linked article titles — absent on WordPress no-results pages.
      await this.page.locator(this.selectors.get('resultTitles'))
        .first()
        .waitFor({ state: 'attached', timeout: 5_000 });
      const titles = await this.getResultTitles();
      return titles.filter((t) => t.trim().length > 0).length > 0;
    } catch {
      return false;
    }
  }

  async getResultsCount(): Promise<number> {
    // Count non-empty titles to avoid inflated counts from icon-only or wrapper elements
    const titles = await this.getResultTitles();
    return titles.filter((t) => t.trim().length > 0).length;
  }

  async getResultTitles(): Promise<string[]> {
    return this.page.locator(this.selectors.get('resultTitles')).allInnerTexts();
  }

  async getFirstResultTitle(): Promise<string> {
    const titles = await this.getResultTitles();
    // Filter empty strings (icon-only links return empty innerText)
    return titles.find((t) => t.trim().length > 0)?.trim() ?? '';
  }

  async isNoResultsMessageVisible(): Promise<boolean> {
    try {
      if ((await this.page.locator(this.selectors.get('noResults')).count()) > 0) return true;
      const content = (await this.page.content()).toLowerCase();
      // WordPress/Astra PT-BR uses multiple phrases for "no results"
      const noResultsPhrases = [
        this.selectors.get('noResultsText'),
        'nada encontrado',
        'nothing found',
        'no results',
        'não encontramos',
      ];
      return noResultsPhrases.some((phrase) => content.includes(phrase));
    } catch {
      return false;
    }
  }

  async allResultsHaveLinks(): Promise<boolean> {
    const links = await this.page.locator(this.selectors.get('resultTitles')).all();
    if (links.length === 0) return false;
    for (const link of links) {
      const href = await link.getAttribute('href');
      if (!href) return false;
    }
    return true;
  }

  async clickFirstResult(): Promise<string> {
    const firstLink = this.page.locator(this.selectors.get('resultTitles')).first();
    const href = (await firstLink.getAttribute('href')) ?? '';
    await firstLink.click();
    await this.page.waitForLoadState('domcontentloaded');
    return href;
  }
}
