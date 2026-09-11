# Automation Strategy

**Analysis date:** 2026-09-10
**Status:** Phase 5 implements 22 of 52 designed scenarios.

## Decision model

A scenario is marked:

- **Automate** when it covers meaningful risk, repeats often, has a deterministic observable result,
  can use isolated data, and is maintainable at the appropriate layer.
- **Manual** when visual/browser-native behavior, exploratory judgment, or undocumented validation
  makes human investigation more valuable.
- **Consider Later** when automation could be useful but currently creates persistent public data,
  depends on a mutating order/account lifecycle, or lacks a stable oracle/cleanup path.

The catalog currently contains **38 Automate, 5 Manual, and 9 Consider Later** decisions.

## Implemented automation

| Scenario group                        | Layer       | Implementation                    |
| ------------------------------------- | ----------- | --------------------------------- |
| AE-API-001, AE-API-006                | API         | `tests/api/products.spec.ts`      |
| AE-PROD-001, AE-PROD-003              | Chromium UI | `tests/ui/products.spec.ts`       |
| AE-AUTH-001, AE-AUTH-002, AE-AUTH-003 | Chromium UI | `tests/ui/user-lifecycle.spec.ts` |
| AE-REG-001, AE-REG-002, AE-ACCT-003   | Chromium UI | `tests/ui/user-lifecycle.spec.ts` |
| AE-CART-001, AE-CART-002, AE-CART-004 | Chromium UI | `tests/ui/cart.spec.ts`           |
| AE-REG-005, AE-ACCT-002               | Chromium UI | `tests/ui/checkout.spec.ts`       |
| AE-CHK-001, AE-CHK-002                | Chromium UI | `tests/ui/checkout.spec.ts`       |
| AE-CHK-003, AE-CHK-004                | Chromium UI | `tests/ui/checkout.spec.ts`       |
| AE-API-003, AE-API-005, AE-API-008    | API         | `tests/api/catalog-auth.spec.ts`  |

API parsing explicitly separates HTTP status from body-level `responseCode` and validates only
consumed fields, including account setup, verification, and teardown responses. Brand and product
search payloads model only fields asserted by the suite. Small page objects encapsulate only
interactions used by current tests. A worker-scoped disposable user is shared only by non-destructive
login, logout, and duplicate-registration tests; destructive registration and deletion scenarios own
separate users. Each authenticated checkout scenario owns a separate disposable user and verifies
API deletion after its assertions. Every UI test retains Playwright's fresh browser context.

## Selection by scenario class

| Scenario class                                          | Decision       | Rationale                                                                                   |
| ------------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------- |
| Product/brand collection API contracts                  | Automate       | Fast, deterministic, non-mutating, and useful on every change.                              |
| API search and documented error conventions             | Automate       | Stable parameter/method contracts; assert HTTP and application status separately.           |
| Invalid API login                                       | Automate       | Non-mutating when request volume remains minimal.                                           |
| API valid login and account lifecycle                   | Consider Later | Needs one disposable account, serialized mutation, and guaranteed deletion.                 |
| Catalog, product detail, search, category, and brand UI | Automate       | Repeatable customer discovery paths with low data impact.                                   |
| Valid/invalid login and logout                          | Automate       | High-value session boundaries, using isolated credentials.                                  |
| Registration and deletion                               | Automate       | Critical lifecycle with documented cleanup; execute serially and sparingly.                 |
| Cart and pre-payment checkout                           | Automate       | High-risk calculations and transitions with browser-context isolation.                      |
| Payment confirmation and invoice                        | Consider Later | Creates order state with no documented order cleanup; no automated submission is performed. |
| Required-field and payment validation UX                | Manual         | Browser-native feedback and undocumented boundaries need exploratory judgment.              |
| Contact, review, and subscription success               | Consider Later | Can persist public/external content with no documented deletion route.                      |
| Scrolling/navigation presentation                       | Manual         | Low-risk visual behavior is inexpensive to inspect and brittle to automate.                 |

## Planned smoke suite

The seven `@smoke` candidates answer whether the environment is healthy enough for broader testing:

| Scenario    | Gate answered                                               | Status      |
| ----------- | ----------------------------------------------------------- | ----------- |
| AE-API-001  | Is the product API reachable and structurally usable?       | Implemented |
| AE-PROD-001 | Does the catalog render usable product cards?               | Implemented |
| AE-PROD-003 | Does core product discovery return results?                 | Implemented |
| AE-AUTH-001 | Can an existing disposable user authenticate?               | Implemented |
| AE-REG-001  | Can required new test state be created and cleaned up?      | Implemented |
| AE-CART-001 | Can a shopper establish cart state?                         | Implemented |
| AE-CHK-002  | Can an authenticated shopper reach a coherent order review? | Implemented |

Each smoke candidate also carries `@regression`. The suite should stop broader execution when a
state-creation or environment gate fails, while still guaranteeing account cleanup.

## Planned regression scope

The **38 `@regression` candidates** are exactly the scenarios currently marked `Automate`; 22 are
implemented and 16 remain planned. Regression is intended to cover:

- API product, brand, search, login-error, parameter, and method contracts;
- authentication, account state, registration data, and supported deletion;
- catalog/detail/search/category/brand/recommendation behavior;
- cart additions, quantities, calculations, removal, empty state, and login persistence;
- checkout gating, address/order review, totals, and comments.

Manual and Consider Later scenarios are excluded until their execution or data questions are
resolved. Cross-browser regression should begin with Chromium and expand to Firefox/WebKit only
through the existing explicit manual dispatch after stability is proven.

## Reliability and data controls

- Keep Playwright at one worker until broader stateful and cross-browser isolation is proven.
- Use a fresh browser context per scenario. Share a disposable user only across non-destructive
  consumers with fixture-owned teardown; destructive flows own unique users.
- Prefer API setup/cleanup only when the same official behavior is itself validated and failures are
  surfaced.
- Discover products at runtime and carry observed name/price/quantity into downstream assertions.
- Do not use hard waits, test ordering, shared mutable accounts, real personal data, or real payment
  data.
- Retries remain diagnostic and CI-only; a retry must not substitute for root-cause analysis.

## Order-persistence policy

The official documentation provides account deletion but no supported order deletion or reset.
Phase 5 therefore automates only the approved pre-payment scenarios: guest authorization gating,
registration/address propagation, delivery/billing equivalence, order review, cart-to-checkout
quantity and total integrity, and comment entry through arrival at the payment page. It does not
fill payment fields or submit an order. `AE-CHK-005` remains `Consider Later`, so no uncleanable
order is created locally, in repeat runs, or in CI.

## Execution policy

Zero discovered tests fails in normal scripts and CI. Chromium is the local/default UI target;
Firefox and WebKit remain explicit cross-browser runs to limit traffic against the public site.
