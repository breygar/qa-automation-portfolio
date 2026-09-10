import type { Locator, Page } from '@playwright/test';

import type { UserCredentials } from '../api/types';

export class LoginPage {
  readonly loginHeading: Locator;
  readonly invalidLoginError: Locator;
  readonly duplicateEmailError: Locator;
  private readonly loginForm: Locator;
  private readonly signupForm: Locator;

  constructor(private readonly page: Page) {
    this.loginHeading = page.getByRole('heading', {
      name: 'Login to your account',
      exact: true,
    });
    this.invalidLoginError = page.getByText('Your email or password is incorrect!', {
      exact: true,
    });
    this.duplicateEmailError = page.getByText('Email Address already exist!', { exact: true });
    this.loginForm = page.locator('form[action="/login"]');
    this.signupForm = page.locator('form[action="/signup"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('/login', { waitUntil: 'domcontentloaded' });
  }

  async loginSuccessfully(credentials: UserCredentials): Promise<void> {
    await this.fillLogin(credentials);
    await Promise.all([
      this.page.waitForURL((url) => url.pathname === '/', {
        waitUntil: 'domcontentloaded',
      }),
      this.loginForm.getByRole('button', { name: 'Login', exact: true }).click(),
    ]);
  }

  async submitInvalidLogin(credentials: UserCredentials): Promise<void> {
    await this.fillLogin(credentials);
    await Promise.all([
      this.page.waitForResponse(
        (response) => response.url().endsWith('/login') && response.request().method() === 'POST',
      ),
      this.loginForm.getByRole('button', { name: 'Login', exact: true }).click(),
    ]);
  }

  async beginRegistration(name: string, email: string): Promise<void> {
    await this.fillSignup(name, email);
    await Promise.all([
      this.page.waitForURL((url) => url.pathname === '/signup', {
        waitUntil: 'domcontentloaded',
      }),
      this.signupForm.getByRole('button', { name: 'Signup', exact: true }).click(),
    ]);
  }

  async submitDuplicateRegistration(name: string, email: string): Promise<void> {
    await this.fillSignup(name, email);
    await Promise.all([
      this.page.waitForResponse(
        (response) => response.url().endsWith('/signup') && response.request().method() === 'POST',
      ),
      this.signupForm.getByRole('button', { name: 'Signup', exact: true }).click(),
    ]);
  }

  private async fillLogin(credentials: UserCredentials): Promise<void> {
    await this.loginForm.locator('input[name="email"]').fill(credentials.email);
    await this.loginForm.locator('input[name="password"]').fill(credentials.password);
  }

  private async fillSignup(name: string, email: string): Promise<void> {
    await this.signupForm.locator('input[name="name"]').fill(name);
    await this.signupForm.locator('input[name="email"]').fill(email);
  }
}
