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

export interface AccountOperationResponse {
  responseCode: number;
  message: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserAccount extends UserCredentials {
  name: string;
  title: 'Mr';
  birthDate: string;
  birthMonth: string;
  birthYear: string;
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  zipcode: string;
  state: string;
  city: string;
  mobileNumber: string;
}
