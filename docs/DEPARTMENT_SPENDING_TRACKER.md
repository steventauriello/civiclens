# Department Spending Tracker

CivicLens milestone: get every Port St. Lucie department and taxpayer-funded spending function into one source-backed tracker.

## North Star

Follow every public dollar we can verify.

The department tracker is the bridge between high-level fund totals and the questions residents actually ask:

- Which department spent the money?
- How much was budgeted?
- How much was actually spent?
- Which fund paid for it?
- Which contracts, vendors, or projects explain the spending?
- What source proves the number?

## Evidence Standard

CivicLens should not publish a department dollar total until it can show:

1. Official source name and URL.
2. Fiscal year and reporting period.
3. Budget stage: adopted, amended, actual, encumbrance, or payment.
4. Fund or account mapping.
5. Calculation rule, including inclusions and exclusions.
6. Reconciliation status against the official report or audit.

Unknown values stay marked as pending. Missing data is a gap, not a conclusion.

## First Build

The first release adds a department registry to the public interface. It intentionally tracks status before totals:

| Field | Purpose |
| --- | --- |
| Department/function | Names the office, department, or spending function residents need to follow. |
| Public purpose | Explains what the spending area does in plain language. |
| Budget | Placeholder for adopted and amended budget amounts. |
| Actual | Placeholder for year-end spending or payments. |
| Evidence status | Shows whether sources are identified, mapped, reconciled, or missing. |
| Next step | Keeps extraction work visible. |

## Extraction Order

1. Adopted FY 2024-25 budget by department and fund.
2. FY 2024-25 fourth-quarter revenue and expenditure statement.
3. FY 2025 ACFR when available and audited.
4. Council agenda items tied to appropriations, amendments, contracts, and projects.
5. Procurement records, contracts, purchase orders, and vendor payments.
6. Public-records requests for machine-readable exports if public downloads are incomplete.

## Acceptance Criteria

A department is ready for dollar display when CivicLens can answer:

- Adopted budget: sourced?
- Amended budget: sourced?
- Actual spending: sourced?
- Fund mapping: clear?
- Transfers: separated?
- Capital or grant dollars: identified?
- Vendor/payment drilldown: available or documented as unavailable?
- Reconciliation variance: zero, explained, or unresolved?
