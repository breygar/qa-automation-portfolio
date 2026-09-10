import type { Locator, Page } from '@playwright/test';

export class ProductsPage {
  readonly heading: Locator;
  readonly productCards: Locator;
  readonly productNames: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly searchedProductsHeading: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'All Products', exact: true });
    this.productCards = page.locator('.features_items .product-image-wrapper');
    this.productNames = page.locator('.features_items .productinfo.text-center p');
    this.searchInput = page.getByPlaceholder('Search Product');
    this.searchButton = page.locator('#submit_search');
    this.searchedProductsHeading = page.getByRole('heading', {
      name: 'Searched Products',
      exact: true,
    });
  }

  async firstProductName(): Promise<string> {
    const name = (await this.productNames.first().textContent())?.trim();

    if (!name) {
      throw new Error('The product catalog did not expose a usable first product name.');
    }

    return name;
  }

  async searchFor(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await Promise.all([
      this.page.waitForURL(
        (url) => url.pathname === '/products' && url.searchParams.get('search') === term,
        { waitUntil: 'domcontentloaded' },
      ),
      this.searchButton.click(),
    ]);
  }
}
