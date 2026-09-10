# Risk Analysis

**Analysis date:** 2026-09-10
**Status:** Phase 2 risk model based on official workflows and low-volume observation.

Probability and impact use qualitative ratings. Priority reflects customer/business consequence and
test urgency, not proof that a defect or vulnerability exists.

| Risk ID | Feature risk                                                                                    | Probability | Impact | Priority | Reason and response                                                                                                        |
| ------- | ----------------------------------------------------------------------------------------------- | ----------- | ------ | -------- | -------------------------------------------------------------------------------------------------------------------------- |
| R-001   | Valid users cannot authenticate or logout cleanly.                                              | Medium      | High   | High     | Account access gates checkout and cleanup; cover valid, invalid, and logout states without repeated credential attempts.   |
| R-002   | Registration creates incorrect data, rejects valid users, or leaves disposable accounts behind. | Medium      | High   | Critical | Registration feeds identity/address data and creates persistent state; use unique users and guaranteed supported deletion. |
| R-003   | Account deletion fails or a deleted account remains usable.                                     | Low         | High   | Critical | Deletion is both a user lifecycle expectation and the primary cleanup control for this portfolio.                          |
| R-004   | Catalog, detail, search, category, or brand results become unavailable or misleading.           | Medium      | Medium | High     | Product discovery is a purchase-path entry point; favor non-mutating UI/API contract checks.                               |
| R-005   | Cart items, quantities, or totals are lost, duplicated, or calculated incorrectly.              | Medium      | High   | Critical | Cart integrity directly affects order review and is vulnerable to session transitions.                                     |
| R-006   | Guest-to-user transition loses cart contents.                                                   | Medium      | High   | Critical | The official flow expects searched products to remain after login; exercise serially with isolated context.                |
| R-007   | Checkout addresses or order totals differ from registration/cart data.                          | Medium      | High   | Critical | Users rely on the final review before placing an order; compare captured source data end to end.                           |
| R-008   | Practice payment input produces a false success or no clear order confirmation.                 | Low         | High   | High     | The flow is business-critical but mutating and incompletely documented; begin with controlled manual evidence.             |
| R-009   | Contact, review, or subscription automation pollutes externally visible data.                   | Medium      | Medium | High     | No cleanup is documented; defer routine automation and minimize any approved exploratory submission.                       |
| R-010   | API clients misread application-level `responseCode` values as transport status.                | High        | Medium | High     | Observed API responses can return HTTP 200 while the JSON body represents 400/404/405; assert both layers explicitly.      |
| R-011   | Live catalog/test data changes make assertions brittle.                                         | High        | Medium | High     | Discover data at runtime and assert relational outcomes instead of fixed counts/prices where possible.                     |
| R-012   | Parallel automation interferes through accounts, carts, or shared public state.                 | Medium      | High   | Critical | Keep one worker and unique data until isolation is demonstrated; never load test the public target.                        |
| R-013   | Browser-specific behavior blocks a critical UI journey.                                         | Low         | Medium | Medium   | Stabilize Chromium first, then use explicit manual-dispatch Firefox/WebKit regression.                                     |
| R-014   | Public-site availability, ads, or third-party assets create non-product failures.               | High        | Low    | Medium   | Separate environment incidents from product defects and avoid assertions on third-party content.                           |

## Priority response

- **Critical:** design coverage first; stateful execution must include cleanup and isolation.
- **High:** include in planned regression or focused manual exploration based on determinism.
- **Medium:** cover after critical flows are stable or when a change increases exposure.
- **Low:** retain as exploratory/usability coverage unless evidence raises the risk.

The scenario catalog contains **8 Critical, 26 High, 16 Medium, and 2 Low** scenarios. Scores and
priorities must be revised from verified execution evidence, not from assumptions or test failures
caused by the external environment.
