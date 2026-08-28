# Port St. Lucie Source Discovery — 2026-08-07

This research note records the document-level source discovery pass for TRACE Issue #1. It is intentionally conservative: unknown fields remain unknown, and a document missing from a current webpage is recorded as a gap to investigate rather than proof that the document does not exist.

## Verification rule

TRACE distinguishes between two source states:

- **Listed by the City** — the official City page names the document, but the exact standalone PDF URL has not yet been independently opened and confirmed.
- **Confirmed direct URL** — the exact official `cityofpsl.com` PDF URL has been opened successfully or otherwise directly confirmed from the City's own source index.

This distinction is important for later evidence provenance and chain-of-custody work.

## Official discovery pages reviewed

- City of Port St. Lucie Annual Budget
- City of Port St. Lucie Finance Department
- City of Port St. Lucie Procurement

## FY 2024-25 budget package located

The current Annual Budget page lists the following FY 2024-25 documents:

- Adopted Budget FY 24/25 — 21 MB
- Proposed Budget FY 24/25 — 32 MB
- Adopted Budget in Brief FY 24/25 — 244 KB
- Proposed Capital Improvement Projects (CIP) Budget FY 24/25 — 23 MB
- Budget Amendment #1 FY 24/25 — 363 KB
- Millage Rate Analysis FY 24/25 — 676 KB
- Statement of Revenues & Expenditures — 1st Quarter — 824 KB
- Statement of Revenues & Expenditures — 3rd Quarter — 300 KB
- Statement of Revenues & Expenditures — 4th Quarter — 337 KB

Direct official PDF URLs are confirmed for the FY 2024-25 adopted budget, proposed budget, proposed Budget in Brief, proposed CIP budget, Budget Amendment #1, millage analysis, 1st Quarter statement, and 3rd Quarter statement.

The FY 2024-25 Q1 PDF opened successfully as a 9-page official report. Its memorandum is dated February 21, 2025, and identifies the first-quarter reporting period as the quarter ended December 31, 2024. The report compares budget to actual results across major operating funds.

The FY 2024-25 Q3 PDF also opened successfully as an official 8-page report.

The adopted Budget in Brief remains listed on the City's Annual Budget page, but its exact standalone PDF URL still needs verification because search indexing currently conflates its content with the adopted budget PDF. The Q4 statement is also still listed but its exact standalone URL remains unconfirmed in this pass.

### FY 2024-25 reporting gap to investigate

The current Annual Budget page does not list a 2nd Quarter Statement of Revenues & Expenditures for FY 2024-25. TRACE should search City archives, legislative records, agenda attachments, and records channels before deciding whether a public-record request is needed.

## FY 2023-24 package verification

The Annual Budget page lists the adopted budget, proposed budget, Budget in Brief, CIP plan, Budget Amendment #1, millage analysis, Budget Breakdown fact sheet, and all four quarterly revenue/expenditure statements.

This pass confirmed direct official URLs for:

- Adopted Budget FY 23/24
- Budget Amendment #1 FY 23/24
- Millage Rate Analysis FY 23/24
- 1st Quarter Statement of Revenues & Expenditures
- 2nd Quarter Statement of Revenues & Expenditures
- 3rd Quarter Statement of Revenues & Expenditures
- 4th Quarter Statement of Revenues & Expenditures

The Q2 PDF opened as an official 8-page report and the Q4 PDF opened as an official City PDF. The proposed budget, Budget in Brief, CIP plan, and Budget Breakdown remain listed but still need exact standalone URL verification.

## FY 2022-23 package verification

The Annual Budget page lists the adopted budget, Budget in Brief, two budget amendments, millage analysis, proposed budget presentation, and all four quarterly revenue/expenditure statements.

This pass confirmed direct official URLs for:

- Adopted Budget FY 22/23
- Budget Amendment #1 FY 22/23
- Budget Amendment #2 FY 22/23

The remaining FY 2022-23 listed documents stay marked as URL-pending until their exact standalone PDFs are independently verified.

## Multi-year adopted budget coverage

Direct official PDF URLs are confirmed for:

- FY 2025-26 Adopted Budget
- FY 2024-25 Adopted Budget
- FY 2023-24 Adopted Budget
- FY 2022-23 Adopted Budget

This satisfies the Issue #1 requirement to enumerate at least three fiscal years of adopted budget documents, although SHA-256 values still need to be added after preservation in the Evidence Vault.

## Audited financial reporting

The manifest includes the City's Annual Comprehensive Financial Reports used for year-end reconciliation. The 2024 ACFR was opened successfully during research. It is a 254-page native-text PDF for the fiscal year ended September 30, 2024. Its table of contents includes government-wide statements, governmental and proprietary fund statements, budget-to-actual schedules, notes, combining schedules, statistical information, debt information, and compliance reports.

That makes the ACFR one of the strongest sources for reconciling adopted and amended budgets against audited year-end results.

## Popular Annual Financial Reports

The Finance page lists Popular Annual Financial Reports for 2024 and 2023. The exact official PDF URL for the 2024 PAFR is now confirmed and added to the manifest. The report is a resident-facing summary of the fiscal year ended September 30, 2024.

## Treasury reports

The Finance page lists:

- Annual Debt Management Report FY 2023-2024 — 657 KB
- Annual Debt Management Report FY 2022-2023 — 497 KB
- Annual Debt Management Report FY 2021-2022 — 379 KB
- Annual Debt Management Report FY 2020-2021 — 3 MB
- Annual Investments Report FY 2023-2024 — 2 MB
- Annual Investments Report FY 2022-2023 — 260 KB
- Annual Investments Report FY 2021-2022 — 464 KB
- Annual Investments Report FY 2020-2021 — 6 MB

Direct official URLs are already confirmed in the manifest for the FY 2023-24 debt and investment reports. The older reports remain a later document-level enumeration target.

## Finance policies located

Direct official PDF URLs are confirmed for:

- Capital Asset Policy
- Debt Management Policy
- Investment Policy (City Council Directed Policy #2023-01)

These documents will be useful when TRACE interprets capitalization, debt, treasury, and accounting treatment.

## Procurement controls located

The City Procurement page lists a Procurement Manual, Purchasing Thresholds, ethics documents, supporting-document requirements, terms and conditions, and vendor guidance. A direct official PDF URL is confirmed for the current Procurement Policy and Procedure Manual.

## Manifest status after this pass

The document-level manifest is stored at:

`data/manifests/port_st_lucie_financial_documents.csv`

It now contains 42 document/gap rows plus the header. After the current verification pass:

- 27 rows have confirmed direct official PDF URLs.
- 13 rows remain listed by the City but need exact standalone URL verification.
- 1 row is an explicit missing-document gap: FY 2024-25 Q2.
- 1 row is retained as a City-listed direct-source entry pending a separate retrieval/extraction confirmation.

SHA-256 fields remain blank until the actual files are preserved and fingerprinted in the Evidence Vault.

## Next discovery pass

1. Confirm the FY 2024-25 adopted Budget in Brief direct PDF URL.
2. Confirm the FY 2024-25 Q4 direct PDF URL.
3. Locate the missing FY 2024-25 Q2 statement through archives, agenda attachments, or records channels.
4. Determine whether FY 2024-25 has any additional budget amendments beyond Amendment #1.
5. Confirm remaining FY 2023-24 proposed-budget, Budget in Brief, CIP, and Budget Breakdown URLs.
6. Confirm remaining FY 2022-23 Budget in Brief, millage, presentation, and quarterly-report URLs.
7. Enumerate older debt and investment reports at document level.
8. Add Purchasing Thresholds and other procurement-control documents.
9. Preserve priority documents in the Evidence Vault and fill in SHA-256 hashes.
10. Record publication dates where the official document or page establishes them.
11. Mark duplicate, superseded, or replaced documents explicitly rather than deleting history.

## Flagship investigation handoff

Once the critical FY 2024-25 financial backbone is preserved, TRACE will use the Port St. Lucie outdoor-gym project as the first end-to-end taxpayer-money trace. That investigation should connect budget authority, amendments, council action, procurement, vendor/contract records, payments, completion, and final cost back to preserved official evidence.
