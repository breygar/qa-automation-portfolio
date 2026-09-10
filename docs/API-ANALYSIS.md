# Official API Analysis

**Analysis date:** 2026-09-10
**Source:** [Automation Exercise APIs List for practice](https://automationexercise.com/api_list)
**Method:** Official-document review plus 10 spaced, non-mutating direct requests. No account was
created, updated, or deleted.

The official page documents **14 scenarios across 11 method/path pairs and 7 unique paths**. It does
not publish an OpenAPI schema, versioning policy, rate limits, token authentication, or a complete
required/optional parameter matrix.

## Status and content convention

All 10 inspected requests returned HTTP `200` and `Content-Type: text/html; charset=utf-8`, while the
body parsed as JSON. The body's `responseCode` carried the documented application status
(`200`, `400`, `404`, or `405`). Future tests must assert transport status, parseability, application
status, and message/data separately; they must not assume the body code is the HTTP status.

This convention is confirmed only for the requests listed below. It must not be generalized to
untested mutations, rate limiting, or infrastructure failures.

## Endpoint inventory

| Method and path                 | Parameters                                                                                                                                                                                                                                            | Officially documented behavior                                                                              | Direct observation                                                                                                                      | Candidate coverage                                                                                 |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `GET /api/productsList`         | None                                                                                                                                                                                                                                                  | Body `responseCode: 200`; all products list.                                                                | HTTP 200; HTML content type; body keys `responseCode`, `products`; 34 products at observation time.                                     | AE-API-001: array and essential product-record contract without fixed count.                       |
| `POST /api/productsList`        | None                                                                                                                                                                                                                                                  | Body `responseCode: 405`; `This request method is not supported.`                                           | HTTP 200; HTML content type; documented body code/message matched.                                                                      | AE-API-002: transport/application status and exact stable message.                                 |
| `GET /api/brandsList`           | None                                                                                                                                                                                                                                                  | Body `responseCode: 200`; all brands list.                                                                  | HTTP 200; HTML content type; body keys `responseCode`, `brands`; 34 brands at observation time.                                         | AE-API-003: array and essential brand-record contract without fixed count.                         |
| `PUT /api/brandsList`           | None                                                                                                                                                                                                                                                  | Body `responseCode: 405`; unsupported-method message.                                                       | HTTP 200; HTML content type; documented body code/message matched.                                                                      | AE-API-004: transport/application status and message.                                              |
| `POST /api/searchProduct`       | `search_product` is documented as required; examples include `top`, `tshirt`, `jean`.                                                                                                                                                                 | With value: body `responseCode: 200` and products. Missing field: body `400` and missing-parameter message. | `top`: HTTP 200/body 200 with 14 products. Missing field: HTTP 200/body 400 with documented message.                                    | AE-API-005/006: positive search, shape/relevance, and missing parameter.                           |
| `POST /api/verifyLogin`         | `email`, `password` are documented as required.                                                                                                                                                                                                       | Valid: body 200, `User exists!`; missing value: body 400; invalid details: body 404, `User not found!`.     | Invalid synthetic credentials returned HTTP 200/body 404. Password-only request returned HTTP 200/body 400. Valid login was not called. | AE-API-007/008/009: controlled valid account, invalid account, and missing parameters.             |
| `DELETE /api/verifyLogin`       | None for unsupported method.                                                                                                                                                                                                                          | Body `responseCode: 405`; unsupported-method message.                                                       | HTTP 200; HTML content type; documented body code/message matched.                                                                      | AE-API-009: unsupported method combined with required-input contract.                              |
| `POST /api/createAccount`       | `name`, `email`, `password`, `title`, `birth_date`, `birth_month`, `birth_year`, `firstname`, `lastname`, `company`, `address1`, `address2`, `country`, `zipcode`, `state`, `city`, `mobile_number`. Required/optional distinction is not documented. | Body `responseCode: 201`; `User created!`.                                                                  | Not called because it creates persistent state.                                                                                         | AE-API-010: one disposable lifecycle; later field-boundary work only after requirements are known. |
| `DELETE /api/deleteAccount`     | `email`, `password`; requiredness is implied but not explicitly defined.                                                                                                                                                                              | Body `responseCode: 200`; `Account deleted!`.                                                               | Not called because it is destructive.                                                                                                   | AE-API-010 cleanup; invalid/not-found behavior is an open question.                                |
| `PUT /api/updateAccount`        | Same 18 listed fields as create; required/partial semantics are not documented.                                                                                                                                                                       | Body `responseCode: 200`; `User updated!`.                                                                  | Not called because it mutates state.                                                                                                    | AE-API-010: controlled full update followed by read and delete.                                    |
| `GET /api/getUserDetailByEmail` | `email`; requiredness is not explicitly stated.                                                                                                                                                                                                       | Body `responseCode: 200`; user detail. No schema is published.                                              | Nonexistent reserved email returned HTTP 200/body 404: `Account not found with this email, try another email!`                          | AE-API-010: positive lifecycle read; later missing/invalid cases if justified.                     |

## Account lifecycle dependency

`POST /api/createAccount` creates the prerequisite for valid login verification, update, positive
detail lookup, and deletion. Future lifecycle coverage should use one unique disposable account,
execute serially, and call the supported deletion endpoint even when an intermediate assertion
fails. Cleanup failure must be visible.

No bearer token, API key, session-token response, or other API authentication mechanism is
documented. Email/password parameters identify account operations where listed.

## Positive and negative design

- **Implemented in Phase 3:** product-list success and missing search-parameter behavior.
- **Automate next when approved:** remaining non-mutating product/brand reads, supported searches,
  missing login parameters, invalid login, and documented unsupported methods.
- **Consider later:** valid login plus create/read/update/delete lifecycle, after cleanup and request
  encoding are proven.
- **Do not speculate:** duplicate-account response, partial update semantics, field limits, email
  normalization, invalid delete response, user-detail schema, or search matching rules.

Additional search boundaries such as no match, whitespace, case, repeated fields, and JSON versus
form encoding are open questions, not current requirements.

## `API_BASE_URL` decision

A dedicated `API_BASE_URL` is **not necessary**. Every official API URL and every direct probe use
the same `https://automationexercise.com` origin already represented by `BASE_URL`; future request
contexts can use relative `/api/...` paths. Do not add a duplicate setting now. Reconsider only if
the UI and API are deployed to different origins in a future environment.

## Observed limitations

- JSON bodies are served with an HTML content type.
- Application errors were represented inside HTTP 200 responses for all inspected negative cases.
- Account field requiredness, encoding rules, validation boundaries, and failure contracts are
  incomplete.
- Product/brand counts and records are live mutable data.
- Pagination, sorting, API versioning, rate limits, and formal schemas are not documented.
- Successful account mutations were intentionally not exercised.
- Only official routes were considered; no undocumented endpoint discovery was attempted.
