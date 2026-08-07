# Port St. Lucie Public-Records Plan

CivicLens should use records requests only after checking published sources. Requests should be narrow, machine-readable where possible, date-bounded, and designed to avoid unnecessary staff burden.

## Purpose

The public website provides strong budget and reporting documents, but transaction-level tracing may require records that are not published as downloadable data.

## Request order

### Request 1 — Accounts-payable payment detail

**Objective:** Identify actual vendor payments and connect them to funds, departments, accounts, projects, purchase orders, and contracts.

Requested fields for a completed fiscal year:

- Payment date
- Payment or check identifier
- Vendor identifier
- Vendor name
- Gross amount
- Net amount
- Fund code and name
- Department/division/cost-center code and name
- Account/object code and description
- Project code and name
- Purchase-order number
- Contract number when available
- Invoice number or invoice date when releasable
- Transaction description
- Void or reversal indicator

Preferred format: CSV or XLSX export from the source system with a data dictionary.

### Request 2 — Vendor master crosswalk

**Objective:** Resolve vendor aliases and identifiers without publishing protected details.

Requested fields:

- Vendor identifier
- Public vendor name
- Active/inactive status
- Vendor type or category when maintained
- Duplicate/parent vendor relationships when maintained

Exclude taxpayer identification numbers, bank information, personal contact details, and protected addresses.

### Request 3 — Purchase-order detail

**Objective:** Distinguish commitments from payments.

Requested fields:

- Purchase-order number
- Vendor identifier
- Issue date
- Department
- Fund/account/project
- Original amount
- Current amount
- Amount paid
- Remaining balance
- Status
- Contract or solicitation number

### Request 4 — Capital-project financial detail

**Objective:** Reconcile approved budgets with actual project spending.

Requested fields:

- Project code and title
- Department
- Funding source/fund
- Original budget
- Current budget
- Actual expenditures to date
- Encumbrances
- Remaining balance
- Project status
- Planned and current completion dates

### Request 5 — Contract export

**Objective:** Confirm whether the public contract portal is complete and obtain stable identifiers.

Requested fields:

- Contract number
- Title
- Vendor
- Department
- Procurement method
- Solicitation number
- Original value
- Current value
- Start and end dates
- Renewal options
- Status
- Amendment/change-order identifiers
- Agenda item or approval reference

### Request 6 — Grant register

**Objective:** Connect grant revenue to restricted spending and outcomes.

Requested fields:

- Grant identifier
- Grantor
- Program title
- Award amount
- Match requirement
- Fund and department
- Award period
- Amount received
- Amount spent
- Remaining balance
- Status

## Draft request language

> Please provide an electronic export of the requested records for fiscal year [YEAR] in the most machine-readable format already maintained by the City, preferably CSV or XLSX. This request does not seek the creation of a new report. Please include an existing data dictionary or field definitions if available. Please exclude or redact confidential or exempt information, including bank account information, taxpayer identification numbers, and protected personal information. If the scope is likely to create a substantial cost, please provide an estimate before processing and advise whether narrowing the date range or fields would materially reduce the cost.

## Handling rules

- Do not publish raw files until privacy and exemption review is complete.
- Preserve the original file and retrieval correspondence.
- Record any City explanation of field meanings or limitations.
- Hash each received file.
- Never infer that a redaction or unavailable field indicates misconduct.
- Reconcile exports to published totals before public use.

## Questions to ask before submitting

1. Is the same information already downloadable?
2. Is one completed fiscal year enough for the prototype?
3. Can the request be split into smaller exports?
4. Does the City maintain a data dictionary?
5. Are vendor addresses or names likely to contain protected personal information?
6. Which record is the authoritative source when portals and accounting exports differ?
