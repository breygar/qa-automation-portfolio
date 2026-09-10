import type { Locator, Page } from '@playwright/test';

export class HomePage {
  readonly productsLink: Locator;

  constructor(private readonly page: Page) {
    this.productsLink = page.getByRole('link', { name: /Products$/ });
  }

  async goto(): Promise<void> {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
  }

  async openProducts(): Promise<void> {
    await Promise.all([
      this.page.waitForURL((url) => url.pathname === '/products', {
        waitUntil: 'domcontentloaded',
      }),
      this.productsLink.click(),
    ]);
  }
}
