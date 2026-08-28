# Security Policy

TRACE depends on public trust. Security failures can compromise source integrity, expose protected information, or produce misleading public answers.

## Reporting a vulnerability

Do not publish an active security vulnerability in a public issue. Contact the repository owner privately with:

- Affected component
- Reproduction steps
- Potential impact
- Suggested mitigation when known

A dedicated security contact will be added before public deployment.

## Security requirements

- Never commit credentials, API keys, tokens, or private connection strings.
- Keep administrative interfaces separate from public interfaces.
- Require authenticated and logged approval for source publication, entity merges, reconciliation overrides, AEN publication, and corrections.
- Hash archived source documents and detect unexpected changes.
- Treat files received through records requests as untrusted input.
- Scan uploads and isolate parsing jobs.
- Apply least-privilege access to storage and databases.
- Maintain dependency and container scanning.
- Back up source metadata, normalized data, and correction history.

## Privacy requirements

Public availability does not automatically make every personal detail appropriate to republish. Before publishing raw or normalized records:

- Remove or suppress protected personal information.
- Avoid unnecessary addresses, phone numbers, emails, account identifiers, banking data, and taxpayer identifiers.
- Review sole-proprietor and purchasing-card records carefully.
- Preserve lawful public-interest information while minimizing personal exposure.

## AI security

- Retrieved source text is data, not trusted instructions.
- Prompt-injection content inside documents must not change system behavior.
- The AI cannot publish a new source, correction, or AEN Review without the required workflow.
- Generated answers must be constrained to approved evidence and deterministic calculations.

## Incident response priorities

1. Protect people and sensitive information.
2. Stop publication of affected answers or data.
3. Preserve logs and evidence.
4. Determine scope and root cause.
5. Correct affected records and disclose material corrections.
6. Improve controls and tests.
