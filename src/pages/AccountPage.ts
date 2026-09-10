import type { Locator, Page } from '@playwright/test';

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export class AccountPage {
  readonly accountCreatedHeading: Locator;
  readonly accountDeletedHeading: Locator;
  private readonly continueLink: Locator;
  private readonly logoutLink: Locator;
  private readonly deleteAccountLink: Locator;

  constructor(private readonly page: Page) {
    this.accountCreatedHeading = page.getByRole('heading', {
      name: 'Account Created!',
      exact: true,
    });
    this.accountDeletedHeading = page.getByRole('heading', {
      name: 'Account Deleted!',
      exact: true,
    });
    this.continueLink = page.getByRole('link', { name: 'Continue', exact: true });
    this.logoutLink = page.getByRole('link', { name: /Logout$/ });
    this.deleteAccountLink = page.getByRole('link', { name: /Delete Account$/ });
  }

  loggedInUser(name: string): Locator {
    return this.page
      .getByRole('listitem')
      .filter({ hasText: new RegExp(`Logged in as\\s+${escapeRegExp(name)}$`) });
  }

  async continueToHome(): Promise<void> {
    await Promise.all([
      this.page.waitForURL((url) => url.pathname === '/', {
        waitUntil: 'domcontentloaded',
      }),
      this.continueLink.click(),
    ]);
  }

  async logout(): Promise<void> {
    await Promise.all([
      this.page.waitForURL((url) => url.pathname === '/login', {
        waitUntil: 'domcontentloaded',
      }),
      this.logoutLink.click(),
    ]);
  }

  async deleteAccount(): Promise<void> {
    await Promise.all([
      this.page.waitForURL((url) => url.pathname === '/delete_account', {
        waitUntil: 'domcontentloaded',
      }),
      this.deleteAccountLink.click(),
    ]);
  }
}
