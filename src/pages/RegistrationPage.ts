import type { Locator, Page } from '@playwright/test';

import type { UserAccount } from '../api/types';

export class RegistrationPage {
  readonly heading: Locator;

  constructor(private readonly page: Page) {
    this.heading = page.getByRole('heading', {
      name: 'Enter Account Information',
      exact: true,
    });
  }

  async complete(user: UserAccount): Promise<void> {
    await this.page.locator('#id_gender1').check();
    await this.page.locator('#password').fill(user.password);
    await this.page.locator('#days').selectOption(user.birthDate);
    await this.page.locator('#months').selectOption(user.birthMonth);
    await this.page.locator('#years').selectOption(user.birthYear);
    await this.page.locator('#first_name').fill(user.firstName);
    await this.page.locator('#last_name').fill(user.lastName);
    await this.page.locator('#company').fill(user.company);
    await this.page.locator('#address1').fill(user.address1);
    await this.page.locator('#address2').fill(user.address2);
    await this.page.locator('#country').selectOption({ label: user.country });
    await this.page.locator('#state').fill(user.state);
    await this.page.locator('#city').fill(user.city);
    await this.page.locator('#zipcode').fill(user.zipcode);
    await this.page.locator('#mobile_number').fill(user.mobileNumber);
    await Promise.all([
      this.page.waitForURL((url) => url.pathname === '/account_created', {
        waitUntil: 'domcontentloaded',
      }),
      this.page.getByRole('button', { name: 'Create Account', exact: true }).click(),
    ]);
  }
}
