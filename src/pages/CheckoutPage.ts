import type { Locator, Page } from '@playwright/test';

import { readCartLineItem, type CartLineItem } from './CartPage';
import { parseCurrencyAmount } from './currency';

export interface CheckoutAddress {
  recipient: string;
  company: string;
  address1: string;
  address2: string;
  cityStatePostcode: string;
  country: string;
  phone: string;
}

function normalizedText(value: string | null, context: string): string {
  const normalized = value?.replace(/\s+/g, ' ').trim();

  if (!normalized) {
    throw new Error(`${context} was missing or empty.`);
  }

  return normalized;
}

export class CheckoutPage {
  readonly addressDetailsHeading: Locator;
  readonly deliveryAddress: Locator;
  readonly billingAddress: Locator;
  readonly orderReviewHeading: Locator;
  readonly summaryRows: Locator;
  private readonly commentInput: Locator;
  private readonly orderSummary: Locator;
  private readonly placeOrderLink: Locator;

  constructor(private readonly page: Page) {
    this.addressDetailsHeading = page.getByRole('heading', {
      name: 'Address Details',
      exact: true,
    });
    this.deliveryAddress = page.locator('#address_delivery');
    this.billingAddress = page.locator('#address_invoice');
    this.orderReviewHeading = page.getByRole('heading', {
      name: 'Review Your Order',
      exact: true,
    });
    this.orderSummary = page.locator('#cart_info');
    this.summaryRows = this.orderSummary.locator('tbody tr[id^="product-"]');
    this.commentInput = page.locator('#ordermsg textarea[name="message"]');
    this.placeOrderLink = page.getByRole('link', { name: 'Place Order', exact: true });
  }

  async address(kind: 'delivery' | 'billing'): Promise<CheckoutAddress> {
    const root = kind === 'delivery' ? this.deliveryAddress : this.billingAddress;
    const addressLines = root.locator('.address_address1.address_address2');

    return {
      recipient: normalizedText(
        await root.locator('.address_firstname.address_lastname').textContent(),
        `${kind} recipient`,
      ),
      company: normalizedText(await addressLines.nth(0).textContent(), `${kind} company`),
      address1: normalizedText(await addressLines.nth(1).textContent(), `${kind} address line 1`),
      address2: normalizedText(await addressLines.nth(2).textContent(), `${kind} address line 2`),
      cityStatePostcode: normalizedText(
        await root.locator('.address_city.address_state_name.address_postcode').textContent(),
        `${kind} city, state, and postcode`,
      ),
      country: normalizedText(
        await root.locator('.address_country_name').textContent(),
        `${kind} country`,
      ),
      phone: normalizedText(await root.locator('.address_phone').textContent(), `${kind} phone`),
    };
  }

  async lineItem(productId: string): Promise<CartLineItem> {
    return readCartLineItem(this.orderSummary.locator(`#product-${productId}`), productId);
  }

  async total(): Promise<number> {
    const totalText = await this.orderSummary
      .locator('tbody tr')
      .filter({ hasText: 'Total Amount' })
      .locator('.cart_total_price')
      .textContent();

    return parseCurrencyAmount(
      normalizedText(totalText, 'Checkout total amount'),
      'Checkout total amount',
    );
  }

  async enterComment(comment: string): Promise<void> {
    await this.commentInput.fill(comment);
  }

  async comment(): Promise<string> {
    return this.commentInput.inputValue();
  }

  async placeOrder(): Promise<void> {
    await Promise.all([
      this.page.waitForURL((url) => url.pathname === '/payment', {
        waitUntil: 'domcontentloaded',
      }),
      this.placeOrderLink.click(),
    ]);
  }
}
