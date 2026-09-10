import { ApiClient } from './ApiClient';
import { asRecord, readNumber, readString } from './decoders';
import type { ApiErrorResponse, ApiResult, ProductSummary, ProductsResponse } from './types';

function decodeProduct(value: unknown, index: number): ProductSummary {
  const context = `products[${index}]`;
  const record = asRecord(value, context);

  return {
    id: readNumber(record, 'id', context),
    name: readString(record, 'name', context),
    price: readString(record, 'price', context),
  };
}

function decodeProductsResponse(value: unknown): ProductsResponse {
  const record = asRecord(value, 'products response');

  if (!Array.isArray(record.products)) {
    throw new Error('products response.products must be an array.');
  }

  return {
    responseCode: readNumber(record, 'responseCode', 'products response'),
    products: record.products.map(decodeProduct),
  };
}

function decodeApiErrorResponse(value: unknown): ApiErrorResponse {
  const record = asRecord(value, 'API error response');

  return {
    responseCode: readNumber(record, 'responseCode', 'API error response'),
    message: readString(record, 'message', 'API error response'),
  };
}

export class ProductsApi {
  constructor(private readonly client: ApiClient) {}

  getProducts(): Promise<ApiResult<ProductsResponse>> {
    return this.client.get('/api/productsList', decodeProductsResponse);
  }

  searchWithoutRequiredTerm(): Promise<ApiResult<ApiErrorResponse>> {
    return this.client.postForm('/api/searchProduct', {}, decodeApiErrorResponse);
  }
}
