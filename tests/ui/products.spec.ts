import { expect, test } from '@playwright/test';

import { HomePage } from '../../src/pages/HomePage';
import { ProductsPage } from '../../src/pages/ProductsPage';

test.describe('Product discovery', () => {
  test('AE-PROD-001 @smoke @regression @ui opens a usable product catalog', async ({ page }) => {
    const homePage = new HomePage(page);
    const productsPage = new ProductsPage(page);

    await homePage.goto();
    await homePage.openProducts();

    await expect(page).toHaveURL(/\/products$/);
    await expect(productsPage.heading).toBeVisible();
    await expect(productsPage.productCards.first()).toBeVisible();
    expect(await productsPage.productCards.count()).toBeGreaterThan(0);
  });

  test('AE-PROD-003 @smoke @regression @ui returns the selected product in search results', async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const productsPage = new ProductsPage(page);

    await homePage.goto();
    await homePage.openProducts();
    const productName = await productsPage.firstProductName();
    await productsPage.searchFor(productName);

    await expect(productsPage.searchedProductsHeading).toBeVisible();
    await expect(productsPage.productNames.first()).toBeVisible();
    expect(new URL(page.url()).searchParams.get('search')).toBe(productName);
    expect(
      (await productsPage.productNames.allTextContents()).map((name) => name.trim()),
    ).toContain(productName);
  });
});
