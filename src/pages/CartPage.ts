import type { Locator, Page } from '@playwright/test';

import { parseCurrencyAmount } from './currency';

export interface CartLineItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

function parseQuantity(value: string): number {
  const quantity = Number(value.trim());

  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error(`Cart quantity must be a positive integer; received "${value}".`);
  }

  return quantity;
}

export async function readCartLineItem(row: Locator, productId: string): Promise<CartLineItem> {
  const name = (await row.locator('.cart_description h4 a').textContent())?.trim();
  const priceText = (await row.locator('.cart_price p').textContent())?.trim();
  const quantityText = (await row.locator('.cart_quantity button').textContent())?.trim();
  const totalText = (await row.locator('.cart_total p').textContent())?.trim();

  if (!name || !priceText || !quantityText || !totalText) {
    throw new Error(`Cart row ${productId} is missing required line-item data.`);
  }

  return {
    productId,
    name,
    price: parseCurrencyAmount(priceText, `Cart row ${productId} price`),
    quantity: parseQuantity(quantityText),
    total: parseCurrencyAmount(totalText, `Cart row ${productId} total`),
  };
}

export class CartPage {
  readonly authenticationPrompt: Locator;
  readonly registerOrLoginLink: Locator;
  readonly rows: Locator;
  private readonly proceedToCheckoutButton: Locator;

  constructor(private readonly page: Page) {
    const checkoutModal = page.locator('#checkoutModal');

    this.authenticationPrompt = checkoutModal.getByText(
      'Register / Login account to proceed on checkout.',
      { exact: true },
    );
    this.registerOrLoginLink = checkoutModal.getByRole('link', {
      name: 'Register / Login',
      exact: true,
    });
    this.rows = page.locator('#cart_info_table tbody tr');
    this.proceedToCheckoutButton = page.getByText('Proceed To Checkout', { exact: true });
  }

  row(productId: string): Locator {
    return this.page.locator(`#product-${productId}`);
  }

  async lineItem(productId: string): Promise<CartLineItem> {
    return readCartLineItem(this.row(productId), productId);
  }

  async requestCheckout(): Promise<void> {
    await this.proceedToCheckoutButton.click();
  }

  async proceedToCheckout(): Promise<void> {
    await Promise.all([
      this.page.waitForURL((url) => url.pathname === '/checkout', {
        waitUntil: 'domcontentloaded',
      }),
      this.proceedToCheckoutButton.click(),
    ]);
  }

  async remove(productId: string): Promise<void> {
    const row = this.row(productId);
    await row.locator('.cart_delete a').click();
    await row.waitFor({ state: 'detached' });
  }
}
