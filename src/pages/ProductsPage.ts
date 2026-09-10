import type { Locator, Page } from '@playwright/test';

export interface SelectedProduct {
  id: string;
  name: string;
  price: number;
}

function parsePrice(value: string): number {
  const numericText = value.replace(/[^0-9.]/g, '');
  const price = Number(numericText);

  if (!/\d/.test(numericText) || !Number.isFinite(price)) {
    throw new Error(`Product price did not contain a valid amount: "${value}".`);
  }

  return price;
}

export class ProductsPage {
  readonly heading: Locator;
  readonly productCards: Locator;
  readonly productNames: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly searchedProductsHeading: Locator;
  private readonly addedModal: Locator;
  private readonly continueShoppingButton: Locator;
  private readonly viewCartLink: Locator;

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
    this.addedModal = page.locator('#cartModal');
    this.continueShoppingButton = this.addedModal.getByRole('button', {
      name: 'Continue Shopping',
      exact: true,
    });
    this.viewCartLink = this.addedModal.getByRole('link', {
      name: 'View Cart',
      exact: true,
    });
  }

  async goto(): Promise<void> {
    await this.page.goto('/products', { waitUntil: 'domcontentloaded' });
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

  async addProductByIndex(index: number): Promise<SelectedProduct> {
    const card = this.productCards.nth(index);
    const details = card.locator('.productinfo.text-center');
    const addButton = details.locator('a.add-to-cart');
    const id = await addButton.getAttribute('data-product-id');
    const name = (await details.locator('p').textContent())?.trim().replace(/\s+/g, ' ');
    const priceText = (await details.locator('h2').textContent())?.trim();

    if (!id || !name || !priceText) {
      throw new Error(`Product card ${index} is missing id, name, or price.`);
    }

    await addButton.click();
    await this.addedModal.waitFor({ state: 'visible' });

    return {
      id,
      name,
      price: parsePrice(priceText),
    };
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
    await this.addedModal.waitFor({ state: 'hidden' });
  }

  async viewCart(): Promise<void> {
    await Promise.all([
      this.page.waitForURL((url) => url.pathname === '/view_cart', {
        waitUntil: 'domcontentloaded',
      }),
      this.viewCartLink.click(),
    ]);
  }
}
