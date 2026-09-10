export interface ApiResult<T> {
  httpStatus: number;
  contentType: string;
  body: T;
}

export interface ProductSummary {
  id: number;
  name: string;
  price: string;
}

export interface ProductsResponse {
  responseCode: number;
  products: ProductSummary[];
}

export interface ApiErrorResponse {
  responseCode: number;
  message: string;
}
