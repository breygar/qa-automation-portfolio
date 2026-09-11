import { ApiClient } from './ApiClient';
import { asRecord, readNumber, readString } from './decoders';
import type { AccountOperationResponse, ApiResult, UserAccount, UserCredentials } from './types';

type CleanupResult = 'already-absent' | 'deleted';

function decodeOperationResponse(value: unknown): AccountOperationResponse {
  const record = asRecord(value, 'account operation response');

  return {
    responseCode: readNumber(record, 'responseCode', 'account operation response'),
    message: readString(record, 'message', 'account operation response'),
  };
}

function accountForm(user: UserAccount): Record<string, string> {
  return {
    name: user.name,
    email: user.email,
    password: user.password,
    title: user.title,
    birth_date: user.birthDate,
    birth_month: user.birthMonth,
    birth_year: user.birthYear,
    firstname: user.firstName,
    lastname: user.lastName,
    company: user.company,
    address1: user.address1,
    address2: user.address2,
    country: user.country,
    zipcode: user.zipcode,
    state: user.state,
    city: user.city,
    mobile_number: user.mobileNumber,
  };
}

function credentialsForm(credentials: UserCredentials): Record<string, string> {
  return {
    email: credentials.email,
    password: credentials.password,
  };
}

function assertTransport(result: ApiResult<AccountOperationResponse>, operation: string): void {
  if (result.httpStatus !== 200) {
    throw new Error(`${operation} returned HTTP ${result.httpStatus}; expected HTTP 200.`);
  }

  if (!result.contentType.toLowerCase().includes('text/html')) {
    throw new Error(
      `${operation} returned ${result.contentType || 'no content type'}; expected the observed text/html JSON convention.`,
    );
  }
}

function assertApplication(
  result: ApiResult<AccountOperationResponse>,
  operation: string,
  responseCode: number,
  message: string,
): void {
  assertTransport(result, operation);

  if (result.body.responseCode !== responseCode || result.body.message !== message) {
    throw new Error(
      `${operation} returned application ${result.body.responseCode} "${result.body.message}"; expected ${responseCode} "${message}".`,
    );
  }
}

export class UsersApi {
  constructor(private readonly client: ApiClient) {}

  async createAccount(user: UserAccount): Promise<void> {
    const result = await this.client.postForm(
      '/api/createAccount',
      accountForm(user),
      decodeOperationResponse,
    );
    assertApplication(result, 'createAccount', 201, 'User created!');
  }

  async accountExists(credentials: UserCredentials): Promise<boolean> {
    const result = await this.verifyLogin(credentials);
    assertTransport(result, 'verifyLogin');

    if (result.body.responseCode === 200 && result.body.message === 'User exists!') {
      return true;
    }

    if (result.body.responseCode === 404 && result.body.message === 'User not found!') {
      return false;
    }

    throw new Error(
      `verifyLogin returned application ${result.body.responseCode} "${result.body.message}"; expected an existing or absent account response.`,
    );
  }

  verifyLogin(credentials: UserCredentials): Promise<ApiResult<AccountOperationResponse>> {
    return this.client.postForm(
      '/api/verifyLogin',
      credentialsForm(credentials),
      decodeOperationResponse,
    );
  }

  async deleteAccount(credentials: UserCredentials): Promise<void> {
    const result = await this.client.deleteForm(
      '/api/deleteAccount',
      credentialsForm(credentials),
      decodeOperationResponse,
    );
    assertApplication(result, 'deleteAccount', 200, 'Account deleted!');
  }

  async ensureAccountDeleted(credentials: UserCredentials): Promise<CleanupResult> {
    if (!(await this.accountExists(credentials))) {
      return 'already-absent';
    }

    await this.deleteAccount(credentials);

    if (await this.accountExists(credentials)) {
      throw new Error('deleteAccount reported success, but verifyLogin still finds the account.');
    }

    return 'deleted';
  }
}
