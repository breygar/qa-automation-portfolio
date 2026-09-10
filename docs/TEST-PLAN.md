# Phase 2 Test Plan

**Analysis date:** 2026-09-10
**Cycle:** Application analysis and QA test design
**Execution status:** Design completed; no test cases were executed and no automation was added.

## Features assessed

Authentication, registration, account deletion/state, catalog/search/details, categories, brands,
recommendations, reviews, cart, checkout, practice payment/order confirmation, invoice download,
contact, subscription, navigation, and all officially documented REST APIs.

## Current-cycle objectives

1. Confirm major product areas and official behavior with low-volume, primarily non-mutating
   inspection.
2. Identify feature risks and define a concise scenario catalog with positive, negative, boundary,
   edge, and regression coverage.
3. Select future automation using criticality, determinism, data/cleanup, stability, maintenance,
   and execution-frequency criteria.
4. Define smoke and regression candidates without creating fake executable coverage.
5. Record assumptions and data constraints before Phase 3 implementation decisions.

## Approach

The cycle reviewed the public home, login, products, product detail, category, brand, cart, checkout,
payment, contact, official Test Cases, and API Testing pages. One non-mutating UI search was
observed. Official APIs were inspected with minimal non-mutating/negative requests; account mutation
was not performed. Documented behavior and direct observation are labeled separately.

## Environment and tools

| Item               | Value                                                                |
| ------------------ | -------------------------------------------------------------------- |
| Target             | `https://automationexercise.com`                                     |
| Observation date   | 2026-09-10                                                           |
| Access             | Anonymous HTTP/browser inspection; no database or server access      |
| Repository runtime | Node.js 24 target                                                    |
| Design tooling     | Existing Playwright/TypeScript foundation and Markdown documentation |
| Concurrency        | One worker retained for future execution                             |

## Deliverables

- Functional inventory and observed limitations.
- Risk analysis with qualitative probability, impact, priority, and rationale.
- 52-scenario catalog and one-to-one traceability entries.
- Automation selection with 7 smoke and 38 regression candidates.
- Eight representative documentation-only BDD scenarios.
- Official API analysis and test-data/cleanup strategy.
- Updated strategy, bug status, and recruiter-facing README.

## Planned execution sequence

No test execution belongs to Phase 2. A later approved implementation cycle should proceed:

1. Run static repository checks.
2. Establish non-mutating API/catalog smoke evidence.
3. Establish isolated Chromium cart behavior.
4. Create at most one disposable account for authenticated smoke, then verify deletion.
5. Run the remaining deterministic regression candidates serially.
6. Use explicit manual dispatch for Firefox/WebKit only after Chromium stability.
7. Perform separately approved manual exploration for payment/contact/review/subscription behavior.

## Dependencies and risks

- Public-site availability, mutable catalog content, third-party page assets, and undocumented rate
  limits.
- Disposable account creation and reliable UI/API deletion for authenticated scenarios.
- No documented cleanup for orders, reviews, contact messages, or subscriptions.
- API responses use application-level status conventions that can differ from HTTP status.
- Unresolved input boundaries can make premature assertions incorrect.

## Entry criteria for a future execution cycle

- Phase 3 scope is explicitly approved.
- Selected scenarios have concrete data, assertions, and cleanup.
- Dependencies install under Node.js 24 and quality checks pass.
- The target is stable enough for low-volume use.
- Stateful scenarios have unique data and an observable cleanup path.

## Exit criteria for a future execution cycle

- Planned scenarios run with recorded results and sanitized evidence.
- All Critical/High failures are triaged and environment failures are separated.
- Disposable accounts are deleted, with any cleanup failure surfaced.
- Traceability links only to real implemented tests.
- Limitations and deferred decisions are updated from evidence.
