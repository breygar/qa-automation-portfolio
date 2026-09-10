# Test Strategy

**Analysis date:** 2026-09-10
**Status:** Phase 2 policy with four non-mutating Phase 3 foundation tests implemented.

## Objective

Provide risk-based confidence in Automation Exercise's documented customer journeys and official
APIs while demonstrating maintainable quality engineering. Evidence must distinguish product
behavior from public-environment, test-data, and automation failures.

## Scope

- Authentication, registration, authenticated state, logout, and supported account deletion.
- Product catalog, details, UI/API search, categories, brands, recommendations, and reviews.
- Cart add/remove, quantity, calculations, empty state, and guest-to-user persistence.
- Checkout gating, address/order review, comments, practice payment confirmation, and invoice.
- Contact, subscription, navigation, and the official API surface.
- Chromium-first UI behavior and planned manual-dispatch Firefox/WebKit regression.

## Out of scope

- Direct database access or database validation.
- Load, stress, soak, destructive, or exploit-focused security testing.
- Real purchases, payment credentials, personal information, or production customer data.
- Undocumented/private endpoints and third-party advertising behavior.
- Native mobile applications, email-delivery verification, and external back-office processing.
- Claims of accessibility conformance; a future accessibility assessment needs explicit scope and
  appropriate tooling.

## Testing approach and types

| Type               | Purpose                                                                                                 |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| API contract       | Validate documented paths, parameters, body shape, and both transport/application status.               |
| UI functional      | Exercise behavior that requires browser rendering, navigation, session state, or downloads.             |
| Integration        | Check registration-to-checkout data, guest-cart-to-login persistence, and cart-to-order review.         |
| Negative/boundary  | Cover invalid credentials, duplicate email, missing parameters, empty states, and quantities.           |
| Exploratory/manual | Investigate visual/browser-native validation, payment boundaries, and externally persisted submissions. |
| Cross-browser      | Re-run stable critical UI regression on Firefox/WebKit by explicit dispatch.                            |

## Risk strategy

Critical risks center on account lifecycle/cleanup, cart integrity, guest-session continuity,
checkout data, and interference with shared public state. High-risk discovery, authentication, and
API-contract behavior follows. The 52-scenario catalog contains 8 Critical, 26 High, 16 Medium, and
2 Low scenarios. Priority can change only with new documented behavior or execution evidence.

## Automation strategy

Automate deterministic, repeatable, responsibly isolated checks at the lowest useful layer. The
design identifies 38 Automate, 5 Manual, and 9 Consider Later scenarios. Phase 3 implements two API
and two Chromium product scenarios. Page Objects and API services are limited to those used by these
tests; no custom fixture is justified yet. See `AUTOMATION-STRATEGY.md` for suite membership and
selection rationale.

## API strategy

Treat `/api/*` responses as a distinct contract even though they share the UI origin. Assert:

1. HTTP status and content type as observed.
2. Parseability and top-level response shape.
3. Application-level `responseCode` and message independently.
4. Essential product/brand/user fields without brittle full-payload snapshots.
5. Documented missing-parameter and unsupported-method behavior.

Account mutations remain serial and must delete the created account. `API_BASE_URL` is not needed
while the API shares the configured `BASE_URL`; revisit only if deployment origins diverge.

## Browser strategy

Chromium is the default confidence browser. Keep one worker, fresh contexts, web-first assertions,
and no hard waits. Use failure-only screenshots/video and first-retry traces. Firefox and WebKit run
only through explicit cross-browser dispatch until data isolation and stability justify expansion.
Third-party ads are not assertion targets.

## Environment

The system under test is `https://automationexercise.com`, observed on 2026-09-10 through anonymous
HTTP/page inspection. Node.js 24, Playwright, TypeScript, and GitHub Actions form the planned
execution environment. The site is externally controlled; availability and data can change without
notice.

## Test data

Use unique disposable users, synthetic profile/address/payment values, runtime-discovered products,
and isolated browser contexts. Supported account cleanup exists through UI and
`DELETE /api/deleteAccount`. No cleanup is documented for orders, contact messages, reviews, or
subscriptions, so those flows are manual or deferred. See `TEST-DATA-STRATEGY.md`.

## Entry criteria

- Target is reachable without signs that testing would worsen an incident.
- Scenario expected result is documented or its assumption is explicitly accepted.
- Required synthetic data and cleanup are available.
- Environment/configuration checks pass and no unresolved blocker affects the selected scope.

## Exit criteria

- Selected risk coverage has completed with attributable evidence.
- Critical/High failures are triaged; no test-infrastructure failure is presented as a product defect.
- Created accounts are deleted or cleanup failure is explicitly reported.
- Known limitations, deferred scenarios, and environment incidents are visible.

Passing automation alone will not constitute release readiness.

## Defect management and reporting

Reproduce against current documented/observed behavior, capture sanitized evidence, state impact and
environment, and separate site defects from automation/data/availability issues. Playwright's line
and HTML reporters are configured for future execution. `BUG-REPORTS.md` remains the source of
verified defects; none are currently recorded.

## CI/CD

The existing single workflow runs static quality checks plus real API/Chromium tests on pull requests
and pushes to `main`; manual dispatch adds Firefox/WebKit. There is no schedule to avoid unnecessary
traffic, and zero discovered tests fails.

## Known limitations

- Automated coverage is limited to four non-mutating product/API scenarios; the other 48 designs
  remain unimplemented.
- Stateful authenticated, order, contact, review, and subscription behavior was not submitted.
- Official UI test descriptions are examples, not a complete product specification.
- Validation boundaries, rate limits, data retention, and order cleanup are undocumented.
- Direct checkout/payment URLs returned pages without a prepared session, but intended behavior
  outside the documented flow is unknown.
