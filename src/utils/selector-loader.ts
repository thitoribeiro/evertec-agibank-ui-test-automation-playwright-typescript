import { readFileSync } from 'fs';
import { join } from 'path';

type SelectorMap = Record<string, string>;

/**
 * Loads UI element selectors from a JSON file.
 * Supports %s placeholder replacement for dynamic selectors.
 */
export class SelectorLoader {
  private readonly selectors: SelectorMap;

  constructor(selectorFile: string) {
    const filePath = join(__dirname, '..', 'selectors', `${selectorFile}.selectors.json`);
    const raw = readFileSync(filePath, 'utf-8');
    this.selectors = JSON.parse(raw) as SelectorMap;
  }

  /**
   * Returns the selector for the given key.
   * Throws if the key does not exist.
   */
  get(key: string): string {
    const value = this.selectors[key];
    if (!value) {
      throw new Error(`[SelectorLoader] Key "${key}" not found in selector file.`);
    }
    return value;
  }

  /**
   * Returns the selector with %s replaced by the given argument.
   */
  getWith(key: string, arg: string): string {
    return this.get(key).replace(/%s/g, arg);
  }
}
