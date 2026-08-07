# Contributing to CivicLens

CivicLens handles public-finance information. Contributions must protect accuracy, source traceability, privacy, and political independence.

## Before contributing

Read:

- `docs/CORE_PRINCIPLES.md`
- `docs/PRODUCT_REQUIREMENTS.md`
- `docs/AEN_FRAMEWORK.md`
- `docs/DATA_MODEL.md`

## Contribution rules

1. Do not add a financial number without an official source and evidence locator.
2. Preserve original labels and source values before normalization.
3. Do not describe a missing record or variance as fraud, waste, abuse, or corruption without authoritative evidence.
4. Separate deterministic calculations from AI-generated explanations.
5. Add tests for parsers, calculations, crosswalks, and reconciliation rules.
6. Do not commit secrets, protected personal data, or unreviewed raw records.
7. Document assumptions and known limitations.

## Suggested workflow

1. Open or select an issue.
2. Create a focused branch.
3. Add or update documentation before implementing a material behavior change.
4. Include source examples and test fixtures that are safe to publish.
5. Run formatting, schema validation, tests, and reconciliation checks.
6. Open a pull request with:
   - Problem statement
   - Approach
   - Sources used
   - Data-quality impact
   - Privacy/security impact
   - Test evidence
   - Known limitations

## Data contributions

A new source entry should include:

- Official publisher
- Canonical URL
- Format
- Update frequency
- Coverage
- Retrieval method
- Legal/technical access notes
- Priority
- Current ingestion status

## AEN contributions

AEN findings must link to evidence and use the approved status vocabulary. Do not use AEN as an automatic political score.

## Corrections

Corrections should not erase history. Explain what changed, why, when, and which published outputs were affected.
