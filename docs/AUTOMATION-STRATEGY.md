# Automation Strategy

**Analysis date:** 2026-09-10
**Status:** Phase 3 foundation implements 4 of 52 designed scenarios.

## Decision model

A scenario is marked:

- **Automate** when it covers meaningful risk, repeats often, has a deterministic observable result,
  can use isolated data, and is maintainable at the appropriate layer.
- **Manual** when visual/browser-native behavior, exploratory judgment, or undocumented validation
  makes human investigation more valuable.
- **Consider Later** when automation could be useful but currently creates persistent public data,
  depends on a mutating order/account lifecycle, or lacks a stable oracle/cleanup path.

The catalog currently contains **38 Automate, 5 Manual, and 9 Consider Later** decisions.

## Phase 3 implementation

| Scenario    | Layer       | Implementation               |
| ----------- | ----------- | ---------------------------- |
| AE-API-001  | API         | `tests/api/products.spec.ts` |
| AE-API-006  | API         | `tests/api/products.spec.ts` |
| AE-PROD-001 | Chromium UI | `tests/ui/products.spec.ts`  |
| AE-PROD-003 | Chromium UI | `tests/ui/products.spec.ts`  |

These four tests are non-mutating. API parsing explicitly separates HTTP status from body-level
`responseCode` and validates only consumed fields. `HomePage` and `ProductsPage` encapsulate the
navigation and catalog interactions used by the UI tests. No custom fixture is justified at this
size: Playwright's built-in `page` and `request` fixtures plus direct object construction keep
lifecycle and ownership visible.

## Selection by scenario class

| Scenario class                                          | Decision       | Rationale                                                                                    |
| ------------------------------------------------------- | -------------- | -------------------------------------------------------------------------------------------- |
| Product/brand collection API contracts                  | Automate       | Fast, deterministic, non-mutating, and useful on every change.                               |
| API search and documented error conventions             | Automate       | Stable parameter/method contracts; assert HTTP and application status separately.            |
| Invalid API login                                       | Automate       | Non-mutating when request volume remains minimal.                                            |
| API valid login and account lifecycle                   | Consider Later | Needs one disposable account, serialized mutation, and guaranteed deletion.                  |
| Catalog, product detail, search, category, and brand UI | Automate       | Repeatable customer discovery paths with low data impact.                                    |
| Valid/invalid login and logout                          | Automate       | High-value session boundaries, using isolated credentials.                                   |
| Registration and deletion                               | Automate       | Critical lifecycle with documented cleanup; execute serially and sparingly.                  |
| Cart and pre-payment checkout                           | Automate       | High-risk calculations and transitions with browser-context isolation.                       |
| Payment confirmation and invoice                        | Consider Later | Creates order state with no documented order cleanup; begin with controlled manual evidence. |
| Required-field and payment validation UX                | Manual         | Browser-native feedback and undocumented boundaries need exploratory judgment.               |
| Contact, review, and subscription success               | Consider Later | Can persist public/external content with no documented deletion route.                       |
| Scrolling/navigation presentation                       | Manual         | Low-risk visual behavior is inexpensive to inspect and brittle to automate.                  |

## Planned smoke suite

The seven `@smoke` candidates answer whether the environment is healthy enough for broader testing:

| Scenario    | Gate answered                                               | Status          |
| ----------- | ----------------------------------------------------------- | --------------- |
| AE-API-001  | Is the product API reachable and structurally usable?       | Implemented     |
| AE-PROD-001 | Does the catalog render usable product cards?               | Implemented     |
| AE-PROD-003 | Does core product discovery return results?                 | Implemented     |
| AE-AUTH-001 | Can an existing disposable user authenticate?               | Not Implemented |
| AE-REG-001  | Can required new test state be created and cleaned up?      | Not Implemented |
| AE-CART-001 | Can a shopper establish cart state?                         | Not Implemented |
| AE-CHK-002  | Can an authenticated shopper reach a coherent order review? | Not Implemented |

Each smoke candidate also carries `@regression`. The suite should stop broader execution when a
state-creation or environment gate fails, while still guaranteeing account cleanup.

## Planned regression scope

The **38 `@regression` candidates** are exactly the scenarios currently marked `Automate`; 4 are
implemented and 34 remain planned. Regression is intended to cover:

- API product, brand, search, login-error, parameter, and method contracts;
- authentication, account state, registration data, and supported deletion;
- catalog/detail/search/category/brand/recommendation behavior;
- cart additions, quantities, calculations, removal, empty state, and login persistence;
- checkout gating, address/order review, totals, and comments.

Manual and Consider Later scenarios are excluded until their execution or data questions are
resolved. Cross-browser regression should begin with Chromium and expand to Firefox/WebKit only
through the existing explicit manual dispatch after stability is proven.

## Reliability and data controls

- Keep Playwright at one worker until account, cart, and order isolation is proven.
- Use a fresh browser context per scenario and a unique account per stateful flow.
- Prefer API setup/cleanup only when the same official behavior is itself validated and failures are
  surfaced.
- Discover products at runtime and carry observed name/price/quantity into downstream assertions.
- Do not use hard waits, test ordering, shared mutable accounts, real personal data, or real payment
  data.
- Retries remain diagnostic and CI-only; a retry must not substitute for root-cause analysis.

## Phase transition rule

Phase 3 removed `--pass-with-no-tests` from normal scripts and CI. Zero discovered tests now fails,
protecting the repository from false-green execution.
