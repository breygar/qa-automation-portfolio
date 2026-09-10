# Traceability Matrix

**Analysis date:** 2026-09-10
**Status:** 13 scenarios are implemented through Phase 4; 39 remain `Not Implemented` with empty
automated-test paths.

| Feature / Requirement           | Risk         | Scenario ID    | Scenario                                     | Priority | Automation Decision | Automation Status | Automated Test                    |
| ------------------------------- | ------------ | -------------- | -------------------------------------------- | -------- | ------------------- | ----------------- | --------------------------------- |
| Authentication / valid access   | R-001        | AE-AUTH-001    | Valid registered-user sign-in                | High     | Automate            | Implemented       | `tests/ui/user-lifecycle.spec.ts` |
| Authentication / invalid access | R-001        | AE-AUTH-002    | Invalid credentials rejected                 | High     | Automate            | Implemented       | `tests/ui/user-lifecycle.spec.ts` |
| Authentication / session end    | R-001        | AE-AUTH-003    | Logout clears authenticated navigation       | High     | Automate            | Implemented       | `tests/ui/user-lifecycle.spec.ts` |
| Authentication / identity       | R-001        | AE-AUTH-004    | Signed-in user identified in navigation      | Medium   | Automate            | Not Implemented   |                                   |
| Authentication / validation     | R-001        | AE-AUTH-005    | Malformed email blocked or rejected          | Medium   | Manual              | Not Implemented   |                                   |
| Registration / account creation | R-002        | AE-REG-001     | Unique user created and signed in            | Critical | Automate            | Implemented       | `tests/ui/user-lifecycle.spec.ts` |
| Registration / uniqueness       | R-002        | AE-REG-002     | Existing email rejected                      | High     | Automate            | Implemented       | `tests/ui/user-lifecycle.spec.ts` |
| Registration / required data    | R-002        | AE-REG-003     | Incomplete registration prevented            | High     | Manual              | Not Implemented   |                                   |
| Registration / preferences      | R-002        | AE-REG-004     | Optional preferences selected independently  | Medium   | Consider Later      | Not Implemented   |                                   |
| Registration / data integrity   | R-002        | AE-REG-005     | Identity/address preserved                   | High     | Automate            | Not Implemented   |                                   |
| Account / authorized actions    | R-001        | AE-ACCT-001    | Account actions follow auth state            | High     | Automate            | Not Implemented   |                                   |
| Account / address data          | R-007        | AE-ACCT-002    | Checkout addresses reflect registration      | High     | Automate            | Not Implemented   |                                   |
| Account / deletion              | R-003        | AE-ACCT-003    | Deleted account cannot log in                | Critical | Automate            | Implemented       | `tests/ui/user-lifecycle.spec.ts` |
| Catalog / listing               | R-004        | AE-PROD-001    | Catalog shows products, names, and prices    | High     | Automate            | Implemented       | `tests/ui/products.spec.ts`       |
| Catalog / details               | R-004        | AE-PROD-002    | Product detail contract displayed            | High     | Automate            | Not Implemented   |                                   |
| Search / matching               | R-004        | AE-PROD-003    | Valid term returns relevant results          | High     | Automate            | Implemented       | `tests/ui/products.spec.ts`       |
| Search / no match               | R-004        | AE-PROD-004    | No-match state is usable                     | Medium   | Automate            | Not Implemented   |                                   |
| Search / blank boundary         | R-004        | AE-PROD-005    | Blank search remains stable                  | Medium   | Consider Later      | Not Implemented   |                                   |
| Categories / filter             | R-004        | AE-PROD-006    | Category heading and products correspond     | Medium   | Automate            | Not Implemented   |                                   |
| Categories / switch             | R-004        | AE-PROD-007    | Category switch replaces prior results       | Medium   | Automate            | Not Implemented   |                                   |
| Brands / filter                 | R-004        | AE-PROD-008    | Brand heading and products correspond        | Medium   | Automate            | Not Implemented   |                                   |
| Brands / switch                 | R-004        | AE-PROD-009    | Brand switch replaces prior results          | Medium   | Automate            | Not Implemented   |                                   |
| Recommendations / cart          | R-004        | AE-PROD-010    | Recommended product enters cart              | High     | Automate            | Not Implemented   |                                   |
| Navigation / scrolling          | R-014        | AE-PROD-011    | Both return-to-top paths work                | Low      | Manual              | Not Implemented   |                                   |
| Reviews / submission            | R-009        | AE-PROD-012    | Review receives confirmation                 | Medium   | Consider Later      | Not Implemented   |                                   |
| Cart / add                      | R-005        | AE-CART-001    | One item enters cart                         | High     | Automate            | Implemented       | `tests/ui/cart.spec.ts`           |
| Cart / calculations             | R-005        | AE-CART-002    | Two line items retain correct values         | Critical | Automate            | Implemented       | `tests/ui/cart.spec.ts`           |
| Cart / quantity                 | R-005        | AE-CART-003    | Multi-quantity value is preserved            | High     | Automate            | Not Implemented   |                                   |
| Cart / removal                  | R-005        | AE-CART-004    | Only selected line is removed                | High     | Automate            | Implemented       | `tests/ui/cart.spec.ts`           |
| Cart / login transition         | R-006        | AE-CART-005    | Guest cart survives login                    | Critical | Automate            | Not Implemented   |                                   |
| Cart / duplicate add            | R-005        | AE-CART-006    | Repeated add has consistent quantity/total   | High     | Automate            | Not Implemented   |                                   |
| Cart / empty state              | R-005        | AE-CART-007    | Empty cart offers product recovery           | Medium   | Automate            | Not Implemented   |                                   |
| Checkout / guest gate           | R-007        | AE-CHK-001     | Guest is prompted to authenticate            | High     | Automate            | Not Implemented   |                                   |
| Checkout / review               | R-007        | AE-CHK-002     | Addresses and order review are visible       | Critical | Automate            | Not Implemented   |                                   |
| Checkout / calculations         | R-007        | AE-CHK-003     | Checkout matches cart values                 | Critical | Automate            | Not Implemented   |                                   |
| Checkout / comment              | R-007        | AE-CHK-004     | Comment accepted before order placement      | High     | Automate            | Not Implemented   |                                   |
| Payment / confirmation          | R-008        | AE-CHK-005     | Practice payment leads to confirmation       | Critical | Consider Later      | Not Implemented   |                                   |
| Payment / invalid data          | R-008        | AE-CHK-006     | Invalid payment cannot report success        | High     | Manual              | Not Implemented   |                                   |
| Order / invoice                 | R-008        | AE-CHK-007     | Confirmed-order invoice opens                | High     | Consider Later      | Not Implemented   |                                   |
| Contact / submission            | R-009        | AE-CONTACT-001 | Valid contact and attachment confirmed       | Medium   | Consider Later      | Not Implemented   |                                   |
| Contact / validation            | R-009        | AE-CONTACT-002 | Missing/invalid contact data rejected        | Medium   | Manual              | Not Implemented   |                                   |
| Subscription / submission       | R-009        | AE-CONTACT-003 | Subscription confirmed on two pages          | Low      | Consider Later      | Not Implemented   |                                   |
| API / products contract         | R-010        | AE-API-001     | Product collection returned                  | High     | Automate            | Implemented       | `tests/api/products.spec.ts`      |
| API / products method           | R-010        | AE-API-002     | Unsupported product method represented       | Medium   | Automate            | Not Implemented   |                                   |
| API / brands contract           | R-010        | AE-API-003     | Brand collection returned                    | Medium   | Automate            | Not Implemented   |                                   |
| API / brands method             | R-010        | AE-API-004     | Unsupported brand method represented         | Medium   | Automate            | Not Implemented   |                                   |
| API / search                    | R-010        | AE-API-005     | Valid search returns matching products       | High     | Automate            | Not Implemented   |                                   |
| API / search validation         | R-010        | AE-API-006     | Missing search parameter represented         | High     | Automate            | Implemented       | `tests/api/products.spec.ts`      |
| API / valid login               | R-001        | AE-API-007     | Valid disposable account verified            | High     | Consider Later      | Not Implemented   |                                   |
| API / invalid login             | R-001        | AE-API-008     | Invalid credentials rejected                 | High     | Automate            | Not Implemented   |                                   |
| API / login contract            | R-010        | AE-API-009     | Missing parameters/method represented        | High     | Automate            | Not Implemented   |                                   |
| API / account lifecycle         | R-002, R-003 | AE-API-010     | Disposable account create/read/update/delete | Critical | Consider Later      | Not Implemented   |                                   |

## Coverage interpretation

All 52 designed scenarios map to at least one identified risk. Thirteen scenarios have
implementations through Phase 4; the remaining 39 retain `Not Implemented` status and empty test
paths. Scenario wording and decisions are authoritative in `TEST-SCENARIOS.md`.
