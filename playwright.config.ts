import { defineConfig, devices } from '@playwright/test';

import { env } from './src/config/env';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  outputDir: 'test-results',
  reporter: [['line'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL: env.baseUrl,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'api',
      testMatch: ['api/**/*.spec.ts'],
    },
    {
      name: 'chromium',
      testMatch: ['ui/**/*.spec.ts', 'integration/**/*.spec.ts'],
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      testMatch: ['ui/**/*.spec.ts', 'integration/**/*.spec.ts'],
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      testMatch: ['ui/**/*.spec.ts', 'integration/**/*.spec.ts'],
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
