import { AccountPage } from '../../src/pages/AccountPage';
import { LoginPage } from '../../src/pages/LoginPage';
import { RegistrationPage } from '../../src/pages/RegistrationPage';
import { createTestUser } from '../../src/data/userFactory';
import { expect, test, withAccountCleanup } from '../../src/fixtures/test';

test.describe('Authentication and account lifecycle', () => {
  test('AE-AUTH-001 @smoke @regression @ui signs in a registered user', async ({
    page,
    authUser,
  }) => {
    const loginPage = new LoginPage(page);
    const accountPage = new AccountPage(page);

    await loginPage.goto();
    await loginPage.loginSuccessfully(authUser);

    await expect(page).toHaveURL('/');
    await expect(accountPage.loggedInUser(authUser.name)).toBeVisible();
  });

  test('AE-AUTH-002 @regression @ui rejects invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const invalidUser = createTestUser('Invalid Login');

    await loginPage.goto();
    await loginPage.submitInvalidLogin(invalidUser);

    await expect(page).toHaveURL(/\/login$/);
    await expect(loginPage.invalidLoginError).toBeVisible();
  });

  test('AE-AUTH-003 @regression @ui logs out an authenticated user', async ({ page, authUser }) => {
    const loginPage = new LoginPage(page);
    const accountPage = new AccountPage(page);

    await loginPage.goto();
    await loginPage.loginSuccessfully(authUser);
    await expect(accountPage.loggedInUser(authUser.name)).toBeVisible();
    await accountPage.logout();

    await expect(page).toHaveURL(/\/login$/);
    await expect(loginPage.loginHeading).toBeVisible();
    await expect(accountPage.loggedInUser(authUser.name)).toHaveCount(0);
  });

  test('AE-REG-001 @smoke @regression @critical @ui registers a unique user', async ({
    page,
    usersApi,
  }) => {
    const user = createTestUser('UI Registration');
    const loginPage = new LoginPage(page);
    const registrationPage = new RegistrationPage(page);
    const accountPage = new AccountPage(page);

    await withAccountCleanup(usersApi, user, async () => {
      await loginPage.goto();
      await loginPage.beginRegistration(user.name, user.email);
      await expect(registrationPage.heading).toBeVisible();
      await registrationPage.complete(user);

      await expect(accountPage.accountCreatedHeading).toBeVisible();
      await accountPage.continueToHome();
      await expect(accountPage.loggedInUser(user.name)).toBeVisible();
    });
  });

  test('AE-REG-002 @regression @ui rejects an existing email', async ({ page, authUser }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.submitDuplicateRegistration(authUser.name, authUser.email);

    await expect(loginPage.duplicateEmailError).toBeVisible();
  });

  test('AE-ACCT-003 @regression @critical @ui deletes an account and denies later login', async ({
    page,
    usersApi,
  }) => {
    const user = createTestUser('UI Account Deletion');
    const loginPage = new LoginPage(page);
    const accountPage = new AccountPage(page);

    await withAccountCleanup(usersApi, user, async () => {
      await usersApi.createAccount(user);
      await loginPage.goto();
      await loginPage.loginSuccessfully(user);
      await expect(accountPage.loggedInUser(user.name)).toBeVisible();
      await accountPage.deleteAccount();

      await expect(accountPage.accountDeletedHeading).toBeVisible();
      expect(await usersApi.accountExists(user)).toBe(false);

      await loginPage.goto();
      await loginPage.submitInvalidLogin(user);
      await expect(loginPage.invalidLoginError).toBeVisible();
    });
  });
});
