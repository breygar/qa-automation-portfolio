import { expect, test } from '@playwright/test';

import { ApiClient } from '../../src/api/ApiClient';
import { ProductsApi } from '../../src/api/ProductsApi';

test.describe('Official product API', () => {
  test('AE-API-001 @smoke @regression @api returns usable product data', async ({ request }) => {
    const productsApi = new ProductsApi(new ApiClient(request));

    const response = await productsApi.getProducts();

    expect(response.httpStatus).toBe(200);
    expect(response.contentType).toContain('text/html');
    expect(response.body.responseCode).toBe(200);
    expect(response.body.products.length).toBeGreaterThan(0);

    for (const product of response.body.products) {
      expect(product.id).toBeGreaterThan(0);
      expect(product.name.trim().length).toBeGreaterThan(0);
      expect(product.price).toMatch(/^Rs\.\s*\d+/);
    }
  });

  test('AE-API-006 @regression @api reports a missing search parameter', async ({ request }) => {
    const productsApi = new ProductsApi(new ApiClient(request));

    const response = await productsApi.searchWithoutRequiredTerm();

    expect(response.httpStatus).toBe(200);
    expect(response.contentType).toContain('text/html');
    expect(response.body.responseCode).toBe(400);
    expect(response.body.message).toBe(
      'Bad request, search_product parameter is missing in POST request.',
    );
  });
});
