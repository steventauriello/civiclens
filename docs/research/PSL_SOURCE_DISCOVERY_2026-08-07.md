# Port St. Lucie Source Discovery — 2026-08-07

This research note records the first document-level source discovery pass for CivicLens Issue #1. It is intentionally conservative: unknown fields remain unknown, and a document missing from a current webpage is recorded as a gap to investigate rather than proof that the document does not exist.

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

### FY 2024-25 reporting gap to investigate

The current Annual Budget page does not list a 2nd Quarter Statement of Revenues & Expenditures for FY 2024-25. CivicLens should search City archives and legislative records before deciding whether a public-record request is needed.

## Multi-year adopted budget coverage

Direct official PDF URLs were confirmed for:

- FY 2025-26 Adopted Budget
- FY 2024-25 Adopted Budget
- FY 2023-24 Adopted Budget
- FY 2022-23 Adopted Budget

This satisfies the Issue #1 requirement to enumerate at least three fiscal years of adopted budget documents, although hashes and full ingestion metadata still need to be added after preservation in the Evidence Vault.

## Audited financial reporting

The Finance Department currently lists Annual Comprehensive Financial Reports for 2025 through 2017. The latest listed report is:

- Annual Comprehensive Financial Report 2025 — 7 MB

A direct official PDF URL was captured from the City Finance page.

The 2024 ACFR was opened successfully during research. It is a 254-page native-text PDF for the fiscal year ended September 30, 2024. Its table of contents includes government-wide statements, governmental and proprietary fund statements, budget-to-actual schedules, notes, combining schedules, statistical information, debt information, and compliance reports. This makes it a strong extraction and reconciliation source.

## Popular Annual Financial Reports

The Finance page currently lists:

- Popular Annual Financial Report 2024 — 4 MB
- Popular Annual Financial Report 2023 — 2 MB

No 2025 PAFR was visible on the current Finance page during this pass.

## Treasury reports

Latest reports currently listed on the Finance page:

- Annual Debt Management Report FY 2023-2024 — 657 KB
- Annual Investments Report FY 2023-2024 — 2 MB

The page also lists FY 2022-23, FY 2021-22, and FY 2020-21 versions of both report types. No FY 2024-25 debt or investment report was visible on the current Finance page during this pass.

## Finance policies located

Direct official PDF URLs were confirmed for:

- Capital Asset Policy
- Debt Management Policy
- Investment Policy (City Council Directed Policy #2023-01)

These documents will be useful when CivicLens interprets capitalization, debt, treasury, and accounting treatment.

## Procurement controls located

The City Procurement page lists a Procurement Manual, Purchasing Thresholds, ethics documents, supporting-document requirements, terms and conditions, and vendor guidance. A direct official PDF URL was confirmed for the current Procurement Policy and Procedure Manual.

## Manifest created

The document-level manifest is stored at:

`data/manifests/port_st_lucie_financial_documents.csv`

The first pass includes confirmed direct URLs, discovery-page URLs, listed file sizes, retrieval date, ingestion priority, status, and extraction notes. SHA-256 fields remain blank until the actual files are preserved and fingerprinted.

## Next discovery pass

1. Capture direct PDF URLs for every FY 2024-25 document currently marked `listed_direct_url_pending`.
2. Locate the missing FY 2024-25 Q2 revenue/expenditure statement through archives, agenda attachments, or records channels.
3. Enumerate FY 2024-25 proposed budget and any additional amendments.
4. Enumerate FY 2023-24 Budget in Brief, CIP, amendment, millage analysis, and all four quarterly statements.
5. Capture direct PAFR URLs.
6. Enumerate the older debt and investment reports at document level.
7. Add Purchasing Thresholds and other procurement-control documents.
8. Preserve priority documents in the Evidence Vault and fill in SHA-256 hashes.
9. Record publication dates where the official document or page establishes them.
10. Mark duplicate, superseded, or replaced documents explicitly rather than deleting history.
