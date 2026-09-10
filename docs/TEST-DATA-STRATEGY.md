# Test Data Strategy

**Analysis date:** 2026-09-10
**Status:** Phase 2 design; no test data was created during analysis.

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
| Search                      | Use a currently observed stable term such as `top`, plus a unique no-match token.                | Reconfirm relevance before hard-coding; blank-search expected behavior is an open question.             |
| Cart                        | New isolated browser context and only the minimum products/quantities required.                  | Remove items or discard the context; never share cart state across parallel workers.                    |
| Checkout/address            | Synthetic identity, address, phone, and disposable account.                                      | Delete the account after evidence capture; do not use real addresses or phone numbers.                  |
| Payment/order               | Clearly synthetic practice values only and the minimum order volume.                             | No documented order deletion exists; keep execution manual/low frequency until impact is understood.    |
| Contact/review/subscription | Synthetic content only if explicitly approved for a focused check.                               | No documented cleanup exists; avoid routine automation and never submit spam-like volume.               |

## Supported account cleanup

Account deletion is officially documented in both channels:

- UI: authenticated `Delete Account` flow with `ACCOUNT DELETED!` confirmation.
- API: `DELETE /api/deleteAccount` with `email` and `password`.

The API cleanup is the preferred future fallback for test-created accounts because it is direct and
observable. A failed cleanup must fail or alert the owning test run; it must not be silently ignored.
No account was created merely to reconfirm this documentation during Phase 2.

## Open data questions

- Whether repeated use of plus-addressed email aliases is accepted consistently.
- Server-side length and normalization limits for profile, address, review, and contact fields.
- Whether cart state is cookie-backed, server-backed after login, or merged by another mechanism.
- Whether order history or order deletion exists outside the documented flows.
- Whether subscriptions, contact messages, or reviews have any supported cleanup route.
