import { expect, test } from '@playwright/test';

import { ApiClient } from '../../src/api/ApiClient';
import { BrandsApi } from '../../src/api/BrandsApi';
import { ProductsApi } from '../../src/api/ProductsApi';
import { UsersApi } from '../../src/api/UsersApi';
import { createTestUser } from '../../src/data/userFactory';

test.describe('Official catalog and authentication APIs', () => {
  test('AE-API-003 @regression @api returns usable brand data', async ({ request }) => {
    const brandsApi = new BrandsApi(new ApiClient(request));

    const response = await brandsApi.getBrands();

    expect(response.httpStatus).toBe(200);
    expect(response.contentType).toContain('text/html');
    expect(response.body.responseCode).toBe(200);
    expect(response.body.brands.length).toBeGreaterThan(0);

    for (const brand of response.body.brands) {
      expect(brand.id).toBeGreaterThan(0);
      expect(brand.brand.trim().length).toBeGreaterThan(0);
    }
  });

  test('AE-API-005 @regression @api returns products matching a valid search', async ({
    request,
  }) => {
    const productsApi = new ProductsApi(new ApiClient(request));
    const searchTerm = 'jean';

    const response = await productsApi.search(searchTerm);

    expect(response.httpStatus).toBe(200);
    expect(response.contentType).toContain('text/html');
    expect(response.body.responseCode).toBe(200);
    expect(response.body.products.length).toBeGreaterThan(0);

    for (const product of response.body.products) {
      expect(product.id).toBeGreaterThan(0);
      expect(product.name.toLowerCase()).toContain(searchTerm);
      expect(product.price).toMatch(/^Rs\.\s*\d+/);
    }
  });

  test('AE-API-008 @regression @api rejects invalid credentials', async ({ request }) => {
    const usersApi = new UsersApi(new ApiClient(request));
    const invalidCredentials = createTestUser('Invalid API Login');

    const response = await usersApi.verifyLogin(invalidCredentials);

    expect(response.httpStatus).toBe(200);
    expect(response.contentType).toContain('text/html');
    expect(response.body.responseCode).toBe(404);
    expect(response.body.message).toBe('User not found!');
  });
});
