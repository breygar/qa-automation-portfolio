# Test Data Strategy

**Analysis date:** 2026-09-10
**Status:** Phase 5 uses generated users, runtime-discovered products, and non-submitting checkout
data.

## Principles

- Use synthetic, non-sensitive data only.
- Keep stateful executions serial and low volume against the public site.
- Generate data only when a scenario needs it; do not maintain shared mutable accounts.
- Delete disposable accounts using an officially supported path after the owning scenario or suite.
- Never use real payment details, personal information, or production credentials.
- Do not claim cleanup for resources that have no documented deletion mechanism.

## Data needs

| Data area                   | Recommended source                                                                               | Isolation and cleanup                                                                                   |
| --------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| Existing user               | Prefer a disposable account created for the current run, not a shared credential.                | Store credentials only in process memory/CI secrets; delete through UI or `DELETE /api/deleteAccount`.  |
| Dynamic user                | Unique plus-addressed or generated test-domain email, synthetic profile/address, run identifier. | Create only for stateful scenarios; guarantee deletion in teardown and record cleanup failures.         |
| Invalid login               | Structurally valid, clearly non-existing synthetic email and non-secret password.                | Non-mutating; avoid repeated attempts that resemble brute force.                                        |
| Products                    | Discover through the catalog/API, then select an available item meeting the scenario oracle.     | Do not assume permanent names, prices, counts, or stock; preserve selected values for later assertions. |
| Search                      | Use an officially documented term such as `jean`, plus a unique no-match token.                  | Reconfirm relevance before hard-coding; blank-search expected behavior is an open question.             |
| Cart                        | New isolated browser context and only the minimum products/quantities required.                  | Remove items or discard the context; never share cart state across parallel workers.                    |
| Checkout/address            | Synthetic identity, address, phone, comment, and disposable account.                             | Delete the account after evidence capture; do not use real addresses or phone numbers.                  |
| Payment/order               | Clearly synthetic practice values only if a separately approved scenario requires them.          | No documented order deletion exists; Phase 5 does not fill payment fields or submit orders.             |
| Contact/review/subscription | Synthetic content only if explicitly approved for a focused check.                               | No documented cleanup exists; avoid routine automation and never submit spam-like volume.               |

## Supported account cleanup

Account deletion is officially documented in both channels:

- UI: authenticated `Delete Account` flow with `ACCOUNT DELETED!` confirmation.
- API: `DELETE /api/deleteAccount` with `email` and `password`.

The API cleanup is the implemented fallback for test-created accounts because it is direct and
observable. Account data is generated from the current timestamp plus a UUID, uses the reserved
`example.com` domain, remains in process memory, and is never committed. Cleanup verifies absence,
deletes only when needed, and verifies absence again. If both an assertion and cleanup fail, the run
surfaces both errors.

The shared fixture user is worker-scoped only for non-destructive login, logout, and
duplicate-registration checks. UI registration and deletion tests own unique accounts. UI deletion
must succeed and be confirmed; API deletion is fallback cleanup, not a substitute assertion.

Cart tests discover products at runtime, preserve observed identifiers/names/prices for exact
assertions, and use a fresh browser context for each scenario. Closing the context discards cart
state without persistent application data.

Each authenticated Phase 5 checkout test owns its own synthetic account. `AE-REG-005` creates that
account through the registration UI so it can validate submitted-field persistence; the remaining
authenticated checkout scenarios use supported API setup. Every account is verified absent through
`DELETE /api/deleteAccount` plus `POST /api/verifyLogin` during teardown. The guest checkout test
creates no account. The comment is synthetic and is not submitted as an order.

The site documents account deletion but no order-deletion endpoint, UI, reset, or database access.
Because `AE-CHK-005` remains `Consider Later`, Phase 5 stops after verifying the payment page and
creates no order record. Synthetic payment values are therefore a policy requirement for any future
approved execution, not data used or stored by the current suite.

## Open data questions

- Server-side length and normalization limits for profile, address, review, and contact fields.
- Whether guest cart state is merged or otherwise preserved across login.
- Whether order history or order deletion exists outside the documented flows.
- Whether subscriptions, contact messages, or reviews have any supported cleanup route.
