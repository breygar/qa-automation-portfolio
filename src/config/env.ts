import 'dotenv/config';

const DEFAULT_BASE_URL = 'https://automationexercise.com';

function parseBaseUrl(value: string | undefined): string {
  const candidate = value?.trim() || DEFAULT_BASE_URL;
  const url = new URL(candidate);

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('BASE_URL must use the http or https protocol.');
  }

  return url.origin;
}

export const env = Object.freeze({
  baseUrl: parseBaseUrl(process.env.BASE_URL),
});
