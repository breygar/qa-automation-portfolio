# BDD Scenarios

**Analysis date:** 2026-09-10
**Status:** Eight representative design scenarios. This is documentation only; Cucumber is not
installed.

The scenarios express verified or officially documented business behavior. Data values and cleanup
must be finalized before implementation.

## AE-AUTH-001 — Valid sign-in

```gherkin
@smoke @regression
Scenario: Registered user signs in
  Given a disposable registered account exists
  When the user signs in with its valid email and password
  Then the navigation identifies the signed-in user
```

## AE-AUTH-002 — Invalid sign-in

```gherkin
@regression
Scenario: Invalid credentials are rejected
  Given the login page is available
  When a user submits a non-existing email and invalid password
  Then the message "Your email or password is incorrect!" is shown
  And no authenticated navigation is shown
```

## AE-REG-001 — Registration

```gherkin
@smoke @regression
Scenario: A unique user completes registration
  Given a unique synthetic email and profile have been prepared
  When the visitor submits all required registration details
  Then account creation is confirmed
  And the visitor is signed in
  And the disposable account can be deleted through a supported flow
```

## AE-PROD-003 — Product search

```gherkin
@smoke @regression
Scenario: Shopper searches for a product
  Given the product catalog is available
  When the shopper searches for a currently valid product term
  Then the searched-products view is shown
  And every displayed result is relevant to the term
```

## AE-CART-002 — Cart totals

```gherkin
@regression
Scenario: Cart totals preserve two selected products
  Given two distinct available products and their displayed prices
  When the shopper adds both products to the cart
  Then both products are present
  And each quantity is correct
  And each line total equals its displayed price multiplied by quantity
```

## AE-CHK-001 — Guest checkout gate

```gherkin
@regression
Scenario: Guest checkout requires authentication
  Given a guest has a product in the cart
  When the guest proceeds to checkout
  Then the site prompts the guest to register or log in
  And no order is confirmed
```

## AE-API-006 — Missing API search parameter

```gherkin
@regression
Scenario: Missing API search parameter is represented in the response body
  When a client posts to "/api/searchProduct" without "search_product"
  Then the HTTP response and content type are recorded
  And the response body contains the documented application response code 400
  And the response body explains that "search_product" is missing
```

## AE-CART-005 — Cart persistence

```gherkin
@regression
Scenario: Cart survives the guest-to-user transition
  Given a guest has selected products in the cart
  When the guest signs in with a disposable registered account
  Then the same products remain in the cart
  And their quantities and totals are unchanged
```

These examples intentionally omit speculative payment validation, subscription persistence, and
other undocumented expected results. Such behavior remains manual or pending clarification in the
scenario catalog.
