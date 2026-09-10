import type { APIRequestContext, APIResponse } from '@playwright/test';

import type { ApiResult } from './types';

type Decoder<T> = (value: unknown) => T;

export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async get<T>(path: string, decode: Decoder<T>): Promise<ApiResult<T>> {
    const response = await this.request.get(path);
    return this.decodeResponse(response, `GET ${path}`, decode);
  }

  async postForm<T>(
    path: string,
    form: Record<string, string>,
    decode: Decoder<T>,
  ): Promise<ApiResult<T>> {
    const response = await this.request.post(path, { form });
    return this.decodeResponse(response, `POST ${path}`, decode);
  }

  async deleteForm<T>(
    path: string,
    form: Record<string, string>,
    decode: Decoder<T>,
  ): Promise<ApiResult<T>> {
    const response = await this.request.delete(path, { form });
    return this.decodeResponse(response, `DELETE ${path}`, decode);
  }

  private async decodeResponse<T>(
    response: APIResponse,
    operation: string,
    decode: Decoder<T>,
  ): Promise<ApiResult<T>> {
    const text = await response.text();
    let parsed: unknown;

    try {
      parsed = JSON.parse(text);
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      throw new Error(
        `${operation} returned malformed JSON (HTTP ${response.status()}, ${response.headers()['content-type'] ?? 'unknown content type'}): ${reason}`,
      );
    }

    let body: T;

    try {
      body = decode(parsed);
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      throw new Error(`${operation} returned an unexpected payload: ${reason}`);
    }

    return {
      httpStatus: response.status(),
      contentType: response.headers()['content-type'] ?? '',
      body,
    };
  }
}
