import type { Locator, Page } from '@playwright/test';

export interface CartLineItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

function parseAmount(value: string, context: string): number {
  const numericText = value.replace(/[^0-9.]/g, '');
  const amount = Number(numericText);

  if (!/\d/.test(numericText) || !Number.isFinite(amount)) {
    throw new Error(`${context} did not contain a valid amount: "${value}".`);
  }

  return amount;
}

function parseQuantity(value: string): number {
  const quantity = Number(value.trim());

  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error(`Cart quantity must be a positive integer; received "${value}".`);
  }

  return quantity;
}

export class CartPage {
  readonly rows: Locator;

  constructor(private readonly page: Page) {
    this.rows = page.locator('#cart_info_table tbody tr');
  }

  row(productId: string): Locator {
    return this.page.locator(`#product-${productId}`);
  }

  async lineItem(productId: string): Promise<CartLineItem> {
    const row = this.row(productId);
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
      price: parseAmount(priceText, `Cart row ${productId} price`),
      quantity: parseQuantity(quantityText),
      total: parseAmount(totalText, `Cart row ${productId} total`),
    };
  }

  async remove(productId: string): Promise<void> {
    const row = this.row(productId);
    await row.locator('.cart_delete a').click();
    await row.waitFor({ state: 'detached' });
  }
}
