# AI-Assisted QA

**Status:** Governance baseline for responsible assistance.

AI may help draft scenario ideas, identify missing risk questions, explain code, or propose
implementation changes. Every output requires accountable human review against the current product,
source documentation, ethical constraints, and executable evidence.

## Required controls

- Never treat generated scenarios, expected results, or defect descriptions as verified facts.
- Review code for correctness, maintainability, security, privacy, and site impact.
- Do not provide secrets, personal data, proprietary data, or unsanitized traces to AI systems.
- Validate generated selectors and assertions through real execution before acceptance.
- Preserve reviewer attribution and repository review requirements.
- Record uncertainty instead of generating convincing but unsupported claims.

AI assistance does not guarantee quality, coverage, correctness, or release readiness. Human
judgment remains responsible for risk acceptance, defect reporting, and all claims presented by this
portfolio.
