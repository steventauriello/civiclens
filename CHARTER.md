# TRACE Project Charter

> **TRACE** stands for **Taxpayer Revenue Accountability & Control Engine**.

**Status:** Active north-star document  
**Pilot jurisdiction:** City of Port St. Lucie, Florida  
**Owner:** Steven Tauriello / YoLogics

## 1. North Star

TRACE exists to help everyday Americans understand, verify, and follow public dollars through official records so government spending becomes more transparent, accountable, efficient, and understandable.

Our simplest promise is:

> Follow every public dollar we can verify.

## 2. The problem

Public financial information is fragmented across budgets, audits, procurement portals, meeting records, project systems, public-record repositories, scanned documents, and accounting reports. The information is technically public but often too difficult for an ordinary resident to find, connect, and understand.

TRACE turns those records into clear, searchable, evidence-backed explanations without replacing the official source.

## 3. Mission

TRACE will:

- Help residents see where public money comes from and where it goes.
- Separate adopted budgets, amended budgets, obligations, actual expenditures, payments, transfers, debt, and reserves.
- Link every material claim to official evidence.
- Make complex government finance understandable without hiding important qualifications.
- Help expose waste, fraud, abuse, duplication, poor performance, and weak controls when the evidence supports those conclusions.
- Recognize effective programs and responsible spending when the evidence supports them.
- Give residents, journalists, auditors, and public officials a shared factual foundation.

## 4. AEN Framework

TRACE organizes reviews around three tests:

### Accountability

- Who authorized the spending?
- What funding source was used?
- Where did the money go?
- Were controls, procurement rules, and reporting requirements followed?
- Can the public verify the transaction or decision?

### Effectiveness

- What result was the program, project, or expenditure intended to produce?
- Were measurable outcomes defined?
- What results were reported?
- Did the program accomplish what it was created to do?

### Need

- What problem justified the spending or request for additional revenue?
- Is lack of funding actually the problem?
- Could policy reform, management changes, consolidation, deregulation, or another alternative address the need?
- Is additional funding genuinely necessary?

AEN is an evidence review, not an automatic political score or accusation.

## 5. First product objective

The Port St. Lucie pilot must answer:

> Where did Port St. Lucie's public money come from, where was it budgeted, where was it actually spent, and what evidence exists about the results?

The first resident-facing flagship question is:

> Where did my property-tax dollars go?

When revenue is pooled, TRACE must clearly label any personal tax-dollar allocation as an estimate rather than claiming an individual dollar was earmarked.

### Core Port St. Lucie financial census requirement

TRACE must build a complete, reconciled financial picture for the City of Port St. Lucie for each covered fiscal year.

That means:

- Identify and total **all City revenue/income**, by source and fund, including taxes, fees, charges for services, grants, intergovernmental revenue, utility or enterprise revenue, investment income, debt proceeds, and other material inflows.
- Keep external revenue distinct from internal transfers and financing movements so totals are not inflated by double-counting.
- Identify and total **all City expenditures/outflows**, reconciled to official City totals.
- Organize expenditures into understandable resident-facing categories and subcategories, such as police/public safety, transportation and infrastructure, parks and recreation, utilities, general government/administration, debt service, capital projects, housing/community development, and other material functions supported by the records.
- Preserve the official accounting dimensions behind every category, including fund, department, function, program, project, object/account, vendor, and funding source when available.
- Show both the high-level category totals and the underlying detailed records used to calculate them.
- Track school-related expenditures only when they are actually City of Port St. Lucie expenditures or City transfers/programs; St. Lucie County School Board revenue and spending must remain a separate jurisdiction and must not be presented as City spending.
- Reconcile categorized expenditures back to the complete City expenditure total and categorized revenues back to the complete City revenue total, with any unresolved difference clearly disclosed.

The goal is that a resident can move from a simple question such as **“How much did Port St. Lucie spend on police or infrastructure?”** to the exact official records supporting the answer, while also seeing the City's complete revenue and expenditure picture for that fiscal year.

## 6. Evidence standard

TRACE follows these rules:

1. If we cannot trace it, we do not claim it.
2. Official records remain the source of truth.
3. Every material number must include source lineage.
4. Facts, calculations, estimates, and inferences must be labeled separately.
5. Missing data is not proof of misconduct.
6. Contradictory evidence must remain visible.
7. Budget authority is not the same as an actual payment.
8. Transfers must not be double-counted as outside revenue or spending.
9. City taxes must not be confused with county, school-board, or special-district taxes.
10. Unresolved reconciliation differences must be disclosed.

## 7. Source strategy

TRACE will use official records first, including:

- Annual budgets and budget-in-brief reports
- Budget amendments
- Quarterly revenue and expenditure reports
- Annual Comprehensive Financial Reports
- Popular Annual Financial Reports
- Capital Improvement Plans
- Millage analyses
- Debt and investment reports
- Procurement records, solicitations, awards, and contracts
- Accounts-payable, purchase-order, check-register, and vendor exports when available
- Council agendas, minutes, ordinances, resolutions, and votes
- Project trackers, grants, audits, strategic plans, and performance reports
- Public-record responses

## 8. Physical and scanned documents

TRACE must eventually support upload and review of:

- Digital PDFs
- Scanned PDFs
- Photographs of paper records
- JPEG, PNG, and TIFF images
- CSV, XLSX, JSON, and structured exports

The system must preserve the original file, retrieval or upload metadata, content hash, page images, extracted text, table coordinates, and confidence indicators. OCR is a fallback for image-based records, and low-confidence extraction requires human review before publication.

## 9. Product experience

The interface should feel simple, calm, authoritative, and modern—high-quality governmental software without unnecessary complexity.

Residents should be able to:

- Ask a question in plain English.
- Explore revenue, funds, departments, programs, projects, vendors, contracts, and payments.
- Compare budgeted and actual values.
- Follow a money trail from revenue source to fund, use, contract, vendor, and payment when records permit.
- Open a Show the Evidence view for every claim.
- See whether data is verified, estimated, incomplete, or awaiting review.
- Run or inspect an AEN Review.

## 10. What TRACE is not

TRACE is not:

- A partisan campaign platform.
- A replacement for government accounting or independent audits.
- An automated accusation engine.
- A source of fabricated or uncited financial claims.
- A system for resident surveillance.
- A tool that hides uncertainty to make an answer sound stronger.

## 11. Architecture principles

- Evidence-first
- Jurisdiction-portable
- Modular source adapters
- Immutable source preservation
- Versioned normalized data
- Deterministic calculations before AI explanation
- Claim-level citations
- Human review for uncertain extraction and sensitive conclusions
- WCAG 2.2 AA accessibility target
- Clear separation between public data, administrative review, and AI composition

## 12. Current state

Completed:

- Product foundation and documentation
- Initial data schemas and source registry
- Public-record acquisition plan
- Functional responsive TRACE prototype
- Netlify deployment for the Port St. Lucie pilot

Current prototype limitation:

- Dashboard financial figures are illustrative demonstration data and are not verified City totals.

## 13. Immediate roadmap

### Milestone 1 — Official document manifest

Enumerate and preserve the actual Port St. Lucie budget, quarterly, ACFR, millage, capital, debt, investment, procurement, and performance documents for at least three fiscal years.

### Milestone 2 — First reconciled fiscal year and financial census

Extract and normalize one completed fiscal year, keeping adopted budget, amended budget, actual revenue, actual expenditure, transfers, reserves, and debt distinct. Reconcile detailed values to official totals.

For that fiscal year, TRACE must also:

- Produce the complete City revenue total and categorize every material revenue source.
- Produce the complete City expenditure total and categorize every material expenditure into understandable functions such as public safety/police, infrastructure/transportation, parks and recreation, utilities, general government, debt service, capital projects, and other applicable categories.
- Maintain mappings from resident-facing categories back to the City's official funds, departments, functions, programs, projects, and accounts.
- Verify that category totals reconcile to the City's official totals without double-counting transfers.
- Document exclusions, jurisdiction boundaries, missing records, and unresolved reconciliation differences.

### Milestone 3 — Replace demonstration data

Replace prototype figures only when the corresponding real values have passed source review and reconciliation.

### Milestone 4 — Transaction-level gap analysis

Determine what vendor-payment, purchase-order, check-register, contract, project, grant, and invoice-level data is publicly available. Prepare narrow public-record requests for missing machine-readable exports.

### Milestone 5 — Evidence-backed resident search

Answer the first approved resident questions using deterministic calculations and claim-level citations.

### Milestone 6 — Document upload and review console

Add secure upload, OCR fallback, extraction review, source approval, correction logging, and evidence publishing.

## 14. Decision test

Before building a feature, ask:

- Does this help an ordinary resident understand public money?
- Can its claims be verified?
- Does it preserve accounting context?
- Does it reduce confusion rather than add complexity?
- Is it useful to residents and credible to auditors, journalists, and public officials?
- Does it move TRACE closer to verified real-world data?

If the answer is no, it is not the next priority.

## 15. Long-term vision

Start with Port St. Lucie. Prove the model. Then make the TRACE core reusable for cities, counties, school districts, special districts, states, and federal agencies.

The long-term goal is not merely to publish more information. It is to democratize the ability to understand institutions and hold them accountable using evidence.
