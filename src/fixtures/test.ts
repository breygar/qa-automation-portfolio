import { expect, test as base } from '@playwright/test';

import { ApiClient } from '../api/ApiClient';
import type { UserAccount } from '../api/types';
import { UsersApi } from '../api/UsersApi';
import { env } from '../config/env';
import { createTestUser } from '../data/userFactory';

interface TestFixtures {
  usersApi: UsersApi;
}

interface WorkerFixtures {
  authUser: UserAccount;
}

export const test = base.extend<TestFixtures, WorkerFixtures>({
  usersApi: async ({ request }, use) => {
    await use(new UsersApi(new ApiClient(request)));
  },
  authUser: [
    async ({ playwright }, use, workerInfo) => {
      const request = await playwright.request.newContext({ baseURL: env.baseUrl });
      const usersApi = new UsersApi(new ApiClient(request));
      const user = createTestUser(`Auth Worker ${workerInfo.workerIndex}`);

      try {
        await withAccountCleanup(usersApi, user, async () => {
          await usersApi.createAccount(user);
          await use(user);
        });
      } finally {
        await request.dispose();
      }
    },
    { scope: 'worker' },
  ],
});

function asError(value: unknown, context: string): Error {
  return value instanceof Error ? value : new Error(`${context}: ${String(value)}`);
}

export async function withAccountCleanup<T>(
  usersApi: UsersApi,
  user: UserAccount,
  operation: () => Promise<T>,
): Promise<T> {
  let outcome: { success: true; value: T } | { success: false; error: Error };

  try {
    outcome = { success: true, value: await operation() };
  } catch (error) {
    outcome = {
      success: false,
      error: asError(error, 'Disposable account test operation failed'),
    };
  }

  let cleanupError: Error | undefined;

  try {
    await usersApi.ensureAccountDeleted(user);
  } catch (error) {
    cleanupError = asError(error, 'Disposable account cleanup failed');
  }

  if (!outcome.success && cleanupError) {
    throw new AggregateError(
      [outcome.error, cleanupError],
      'The test operation and disposable account cleanup both failed.',
    );
  }

  if (!outcome.success) {
    throw outcome.error;
  }

  if (cleanupError) {
    throw cleanupError;
  }

  return outcome.value;
}

export { expect };
