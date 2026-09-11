import type { Page } from '@playwright/test';

import type { UserAccount } from '../../src/api/types';
import { createTestUser } from '../../src/data/userFactory';
import { expect, test, withAccountCleanup } from '../../src/fixtures/test';
import { AccountPage } from '../../src/pages/AccountPage';
import { CartPage, type CartLineItem } from '../../src/pages/CartPage';
import { CheckoutPage, type CheckoutAddress } from '../../src/pages/CheckoutPage';
import { LoginPage } from '../../src/pages/LoginPage';
import { ProductsPage, type SelectedProduct } from '../../src/pages/ProductsPage';
import { RegistrationPage } from '../../src/pages/RegistrationPage';

interface PreparedCheckout {
  cartLineItem: CartLineItem;
  checkoutPage: CheckoutPage;
  selectedProduct: SelectedProduct;
}

function expectedAddress(user: UserAccount): CheckoutAddress {
  return {
    recipient: `${user.title}. ${user.firstName} ${user.lastName}`,
    company: user.company,
    address1: user.address1,
    address2: user.address2,
    cityStatePostcode: `${user.city} ${user.state} ${user.zipcode}`,
    country: user.country,
    phone: user.mobileNumber,
  };
}

async function openCheckout(page: Page, quantity = 1): Promise<PreparedCheckout> {
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);

  await productsPage.goto();

  let selectedProduct: SelectedProduct | undefined;
  for (let count = 0; count < quantity; count += 1) {
    const currentProduct = await productsPage.addProductByIndex(0);
    selectedProduct ??= currentProduct;

    if (count < quantity - 1) {
      await productsPage.continueShopping();
    }
  }

  if (!selectedProduct) {
    throw new Error('Checkout setup requires at least one product.');
  }

  await productsPage.viewCart();
  const cartLineItem = await cartPage.lineItem(selectedProduct.id);
  await cartPage.proceedToCheckout();

  return { cartLineItem, checkoutPage, selectedProduct };
}

async function openAuthenticatedCheckout(
  page: Page,
  user: UserAccount,
  quantity = 1,
): Promise<PreparedCheckout> {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.loginSuccessfully(user);

  return openCheckout(page, quantity);
}

test.describe('Checkout and order review', () => {
  test('AE-CHK-001 @regression @ui prompts a guest to authenticate before checkout', async ({
    page,
  }) => {
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await productsPage.goto();
    await productsPage.addProductByIndex(0);
    await productsPage.viewCart();
    await cartPage.requestCheckout();

    await expect(cartPage.authenticationPrompt).toBeVisible();
    await expect(cartPage.registerOrLoginLink).toBeVisible();
    await expect(cartPage.registerOrLoginLink).toHaveAttribute('href', '/login');
    await expect(page).toHaveURL(/\/view_cart$/);
  });

  test('AE-REG-005 @regression @ui preserves submitted identity and address data', async ({
    page,
    usersApi,
  }) => {
    const user = createTestUser('Checkout Registration Data');
    const loginPage = new LoginPage(page);
    const registrationPage = new RegistrationPage(page);
    const accountPage = new AccountPage(page);

    await withAccountCleanup(usersApi, user, async () => {
      await loginPage.goto();
      await loginPage.beginRegistration(user.name, user.email);
      await registrationPage.complete(user);
      await expect(accountPage.accountCreatedHeading).toBeVisible();
      await accountPage.continueToHome();
      const { checkoutPage } = await openCheckout(page);

      expect(await checkoutPage.address('delivery')).toEqual(expectedAddress(user));
    });
  });

  test('AE-ACCT-002 @regression @ui shows matching delivery and billing addresses', async ({
    page,
    usersApi,
  }) => {
    const user = createTestUser('Checkout Addresses');

    await withAccountCleanup(usersApi, user, async () => {
      await usersApi.createAccount(user);
      const { checkoutPage } = await openAuthenticatedCheckout(page, user);
      const delivery = await checkoutPage.address('delivery');
      const billing = await checkoutPage.address('billing');

      expect(delivery).toEqual(expectedAddress(user));
      expect(billing).toEqual(delivery);
    });
  });

  test('AE-CHK-002 @smoke @regression @critical @ui displays addresses and order review', async ({
    page,
    usersApi,
  }) => {
    const user = createTestUser('Checkout Review');

    await withAccountCleanup(usersApi, user, async () => {
      await usersApi.createAccount(user);
      const { checkoutPage, selectedProduct } = await openAuthenticatedCheckout(page, user);

      await expect(checkoutPage.addressDetailsHeading).toBeVisible();
      await expect(checkoutPage.deliveryAddress).toBeVisible();
      await expect(checkoutPage.billingAddress).toBeVisible();
      await expect(checkoutPage.orderReviewHeading).toBeVisible();
      await expect(checkoutPage.summaryRows).toHaveCount(1);
      expect((await checkoutPage.lineItem(selectedProduct.id)).name).toBe(selectedProduct.name);
    });
  });

  test('AE-CHK-003 @regression @critical @ui keeps cart quantities and totals in checkout', async ({
    page,
    usersApi,
  }) => {
    const user = createTestUser('Checkout Totals');

    await withAccountCleanup(usersApi, user, async () => {
      await usersApi.createAccount(user);
      const { cartLineItem, checkoutPage, selectedProduct } = await openAuthenticatedCheckout(
        page,
        user,
        2,
      );
      const checkoutLine = await checkoutPage.lineItem(selectedProduct.id);

      expect(checkoutLine.name).toBe(selectedProduct.name);
      expect(checkoutLine.price).toBe(selectedProduct.price);
      expect(checkoutLine.quantity).toBe(2);
      expect(checkoutLine.total).toBe(checkoutLine.price * checkoutLine.quantity);
      expect(await checkoutPage.total()).toBe(checkoutLine.total);
      expect(checkoutLine).toEqual(cartLineItem);
    });
  });

  test('AE-CHK-004 @regression @ui accepts an order comment before payment', async ({
    page,
    usersApi,
  }) => {
    const user = createTestUser('Checkout Comment');
    const comment = 'Synthetic QA order comment for checkout validation.';

    await withAccountCleanup(usersApi, user, async () => {
      await usersApi.createAccount(user);
      const { checkoutPage } = await openAuthenticatedCheckout(page, user);

      await checkoutPage.enterComment(comment);
      expect(await checkoutPage.comment()).toBe(comment);
      await checkoutPage.placeOrder();

      await expect(page).toHaveURL(/\/payment$/);
      await expect(page.getByRole('heading', { name: 'Payment', exact: true })).toBeVisible();
    });
  });
});
