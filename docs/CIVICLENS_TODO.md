# TRACE Working Todo

This is the live working checklist for the Port St. Lucie pilot. Keep this document focused on the core TRACE path:

```text
Original source -> Control total -> Extracted detail -> Variance -> Public answer
```

## Current Truth

- TRACE is an alpha proof of concept, not a completed full-city audit.
- The evidence vault can preserve original PDFs as immutable source records.
- Public pages currently show an FY 2024-25 operating-fund slice, not the full Port St. Lucie citywide ledger.
- The control-total trace exists for the first operating-fund layer.
- Department totals, vendor payments, payroll, contracts, invoices, CRA details, grants, capital, debt, and ACFR cross-checks still need reconciliation before any full-dollar claim.

## Product Rule

Build one trace pipeline. Do not create separate dashboards or duplicate systems that answer the same question with different numbers.

Every new feature should support at least one of these jobs:

- Store original evidence.
- Verify source metadata.
- Extract numbers from source documents.
- Tie extracted numbers to official control totals.
- Explain variances and gaps.
- Produce a source-backed public answer.
- Support AEN review after the money trail is established.

## Document Todo

### Core FY 2024-25 Source Packet

- [x] Adopted Budget FY 2024-25
- [x] Budget Amendment #1 FY 2024-25
- [x] Q1 Statement of Revenues and Expenditures
- [ ] Q2 Statement of Revenues and Expenditures
- [x] Q3 Statement of Revenues and Expenditures
- [x] Q4 Statement of Revenues and Expenditures
- [x] Annual Comprehensive Financial Report 2025
- [x] Millage Rate Analysis FY 2024-25
- [x] Capital Improvement Plan budget
- [x] CRA Annual Report FY 2024-25

### Dollar-Level Records Still Needed

- [ ] Vendor or check registers for FY 2024-25
- [ ] Payroll or personnel spending summaries
- [ ] Contracts and procurement files
- [ ] Invoice or payment detail
- [ ] Purchase orders and change orders
- [ ] Department-level actual spending schedules
- [ ] Debt service schedules
- [ ] Grant award and grant spending records
- [ ] Capital project spending records
- [ ] CRA revenue and expenditure detail

## Revenue Trace Todo

Goal: isolate the taxpayer, resident, business, permit, fee, assessment, fine, and customer-paid revenue total.

Do not mix these with grants, debt proceeds, transfers, investment earnings, or beginning fund balance without labeling them separately.

- [ ] Extract revenue lines from Q4 Statement of Revenues and Expenditures.
- [ ] Extract revenue lines from ACFR 2025.
- [ ] Compare Q4 operating-fund revenue to audited ACFR revenue schedules.
- [ ] Classify each revenue line as tax, fee, permit, license, utility charge, assessment, fine, service charge, grant, transfer, debt, investment income, fund balance, or other.
- [ ] Calculate taxpayer / resident / business-paid revenue subtotal.
- [ ] Calculate other public funding subtotal.
- [ ] Identify transfers and other items that should not be double-counted.
- [ ] Publish only reconciled totals, with page and table citations.

## Spending Trace Todo

- [ ] Confirm full FY 2024-25 spending control totals by fund.
- [ ] Extract department-level budget and actual spending.
- [ ] Tie each department to fund source: taxes, fees, enterprise revenue, grants, CRA, internal service, or mixed.
- [ ] Calculate trace percentage by department.
- [ ] Show unresolved dollar gaps by department.
- [ ] Add vendor/payment detail only after fund and department controls are stable.

## Evidence Vault Hardening Todo

The vault is TRACE infrastructure. Treat it as a protected system, not a casual feature.

- [ ] Add automated tests for immutable original PDF fields.
- [ ] Test that metadata edits cannot change original file hash, object key, size, MIME type, upload timestamp, or original filename.
- [ ] Test that remove/archive preserves the original source object.
- [ ] Test that AI scan is blocked unless the record is approved for AI research.
- [ ] Test that unauthenticated users cannot list, update, archive, upload, or scan records.
- [ ] Test that malformed records fail safely.
- [ ] Test that coverage-map errors do not break vault record access.
- [ ] Add a vault recovery note describing how to inspect metadata without modifying originals.

## Vault Inventory and Research Queue

Recommended next feature: make TRACE easier to operate without loosening security.

- [ ] Show every uploaded document in a clear inventory table.
- [ ] Show status columns: verified, awaiting review, AI approved, scanned, needs scan, archived.
- [ ] Let official public budget documents be bulk-approved for AI research.
- [ ] Keep content scanning blocked for sensitive or unapproved documents.
- [ ] Add a “missing records” queue tied to the Evidence Coverage Map.
- [ ] Add a “scan next” queue for revenue control documents.

## Smart Uploader Todo

Goal: make document intake smarter before the record is finalized, so the owner can drag in a PDF and TRACE helps classify it correctly.

The smart uploader should assist with metadata and extraction, but the final vault record still needs human approval before it becomes official evidence.

- [ ] Add an upload staging screen before final vault submission.
- [ ] Preview extracted title, publisher, fiscal year, reporting period, document type, and likely source category.
- [ ] Detect visible dates such as fiscal year ended, adopted budget year, quarter, meeting date, or report date.
- [ ] Suggest a clean TRACE title and filename.
- [ ] Suggest tags such as budget, audit, quarterly statement, millage, CRA, capital, vendor, payroll, contract, invoice, or grant.
- [ ] Extract likely control totals and show page/table evidence before submission.
- [ ] Let the owner add or confirm the official source URL.
- [ ] Show confidence levels and require manual confirmation for low-confidence fields.
- [ ] Keep the original PDF immutable after submission.
- [ ] Do not publish extracted findings until human review is complete.

## AEN Demo Todo

AEN should be demonstrated after TRACE has at least one source-backed money trail.

- [ ] Build the first AEN demo from a real source packet.
- [ ] Separate facts, calculations, agency claims, conflicts, and gaps.
- [ ] Cite original source document, page, and table for each material claim.
- [ ] Keep language as review, not accusation.
- [ ] Show how AI reduces research workload while human review keeps legitimacy.
- [ ] Use the demo to answer Anthony Bonna's implementation concern with a working Port St. Lucie pilot.

## Public Language Guardrails

Use these phrases:

- “Operating-fund slice,” not “all city money,” until citywide reconciliation is complete.
- “Core trace packet records present,” not “all records present.”
- “Unresolved gap,” not “fraud,” unless evidence supports that conclusion.
- “AI research scan,” not “AI verification.”
- “Original source PDF,” not “AI source.”
- “Human review required,” before any public claim is released.

## Next Best Move

1. Find and upload the missing FY 2024-25 Q2 revenue and expenditure statement.
2. Build the Smart Uploader staging flow so new PDFs can be classified before final vault submission.
3. Run AI research scans on Q4 and ACFR 2025 after record-level approval.
4. Extract and classify revenue lines into taxpayer-paid versus grants, transfers, debt, and other sources.
5. Build the first Revenue Intake Control Report.
6. Only then move into department spending trace.
