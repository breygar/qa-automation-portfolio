import { CartPage } from '../../src/pages/CartPage';
import { ProductsPage } from '../../src/pages/ProductsPage';
import { expect, test } from '../../src/fixtures/test';

test.describe('Cart state', () => {
  test('AE-CART-001 @smoke @regression @ui adds one product to the cart', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await productsPage.goto();
    const selected = await productsPage.addProductByIndex(0);
    await productsPage.viewCart();

    await expect(page).toHaveURL(/\/view_cart$/);
    await expect(cartPage.row(selected.id)).toBeVisible();
    const lineItem = await cartPage.lineItem(selected.id);
    expect(lineItem.name).toBe(selected.name);
    expect(lineItem.price).toBe(selected.price);
    expect(lineItem.quantity).toBe(1);
    expect(lineItem.total).toBe(selected.price * lineItem.quantity);
  });

  test('AE-CART-002 @regression @critical @ui retains exact values for two products', async ({
    page,
  }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await productsPage.goto();
    const first = await productsPage.addProductByIndex(0);
    await productsPage.continueShopping();
    const second = await productsPage.addProductByIndex(1);
    expect(second.id).not.toBe(first.id);
    expect(second.name).not.toBe(first.name);
    await productsPage.viewCart();

    await expect(cartPage.rows).toHaveCount(2);
    for (const selected of [first, second]) {
      const lineItem = await cartPage.lineItem(selected.id);
      expect(lineItem.name).toBe(selected.name);
      expect(lineItem.price).toBe(selected.price);
      expect(lineItem.quantity).toBe(1);
      expect(lineItem.total).toBe(selected.price * lineItem.quantity);
    }
  });

  test('AE-CART-004 @regression @ui removes only the selected line item', async ({ page }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await productsPage.goto();
    const first = await productsPage.addProductByIndex(0);
    await productsPage.continueShopping();
    const second = await productsPage.addProductByIndex(1);
    expect(second.id).not.toBe(first.id);
    expect(second.name).not.toBe(first.name);
    await productsPage.viewCart();
    await expect(cartPage.rows).toHaveCount(2);

    await cartPage.remove(first.id);

    await expect(cartPage.row(first.id)).toHaveCount(0);
    await expect(cartPage.row(second.id)).toBeVisible();
    await expect(cartPage.rows).toHaveCount(1);
    const remaining = await cartPage.lineItem(second.id);
    expect(remaining.name).toBe(second.name);
    expect(remaining.price).toBe(second.price);
    expect(remaining.quantity).toBe(1);
    expect(remaining.total).toBe(second.price * remaining.quantity);
  });
});
