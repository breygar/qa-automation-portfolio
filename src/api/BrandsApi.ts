import { ApiClient } from './ApiClient';
import { asRecord, readNumber, readString } from './decoders';
import type { ApiResult, BrandSummary, BrandsResponse } from './types';

function decodeBrand(value: unknown, index: number): BrandSummary {
  const context = `brands[${index}]`;
  const record = asRecord(value, context);

  return {
    id: readNumber(record, 'id', context),
    brand: readString(record, 'brand', context),
  };
}

function decodeBrandsResponse(value: unknown): BrandsResponse {
  const record = asRecord(value, 'brands response');

  if (!Array.isArray(record.brands)) {
    throw new Error('brands response.brands must be an array.');
  }

  return {
    responseCode: readNumber(record, 'responseCode', 'brands response'),
    brands: record.brands.map(decodeBrand),
  };
}

export class BrandsApi {
  constructor(private readonly client: ApiClient) {}

  getBrands(): Promise<ApiResult<BrandsResponse>> {
    return this.client.get('/api/brandsList', decodeBrandsResponse);
  }
}
