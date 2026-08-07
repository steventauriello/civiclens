# CivicLens Product Requirements Document

**Version:** 0.1  
**Pilot jurisdiction:** City of Port St. Lucie, Florida  
**Product stage:** Foundation and discovery

## 1. Product summary

CivicLens is an evidence-first public-finance intelligence platform. It ingests official records, normalizes financial and civic data, connects related evidence, and answers resident questions in plain English with citations.

## 2. Primary problem

Residents cannot easily follow public money because relevant information is fragmented across budgets, financial reports, procurement portals, meeting systems, project trackers, and public-record repositories. The records use specialized accounting language and often describe different stages of the money flow.

## 3. Primary user

A Port St. Lucie resident who wants a trustworthy answer without needing accounting, legal, or data-analysis expertise.

### Secondary users

- Local journalists
- Public officials and staff
- Auditors and oversight organizations
- Researchers and civic groups
- Vendors and contractors seeking public information

## 4. Version 1 objective

Answer this question accurately and transparently:

> Where did Port St. Lucie's public money come from, where was it budgeted, where was it actually spent, and what evidence exists about the results?

## 5. Version 1 user stories

### Revenue

- As a resident, I can see total reported revenue by fiscal year.
- I can distinguish property taxes from utility revenue, grants, fees, intergovernmental revenue, debt proceeds, and transfers.
- I can see which fund received the revenue.

### Spending

- I can compare adopted budget, amended budget, actual expenditure, and variance.
- I can view spending by fund, department, program, category, project, and vendor when records support it.
- I can distinguish operating expenses, capital outlay, debt service, and transfers.

### Property-tax question

- I can see the City's portion of a property-tax bill separately from county, school-board, and special-district portions.
- I can enter an amount paid to receive an estimated allocation based on City revenue and expenditure proportions.
- The estimate is clearly labeled and does not falsely imply that an individual dollar is earmarked when revenue is pooled.

### Evidence

- Every material number has a source.
- I can open the official document and see the relevant page or record.
- I can see when the source was retrieved and whether the number was extracted or calculated.

### AEN Review

- I can open an AEN Review for a program, project, funding request, or tax proposal.
- The review presents Accountability, Effectiveness, and Need evidence separately.
- Missing evidence and contradictory evidence are visible.

## 6. Functional requirements

### FR-1 Source registry

Maintain a versioned catalog of official sources with owner, URL, format, update frequency, access method, coverage, and reliability notes.

### FR-2 Document ingestion

Support PDF, HTML, CSV, XLSX, JSON, GIS/API metadata, and manual public-record uploads.

### FR-3 Source preservation

Store source metadata, retrieval timestamp, content hash, original filename, and canonical URL.

### FR-4 Financial normalization

Normalize fiscal year, fund, department, account, program, project, vendor, transaction type, budget stage, and amount while preserving the original labels.

### FR-5 Entity resolution

Connect alternate names and identifiers for departments, funds, vendors, projects, ordinances, agenda items, and contracts.

### FR-6 Evidence graph

Connect claims and financial records to source passages, approvals, contracts, payments, projects, and outcomes.

### FR-7 Resident search

Provide natural-language search and guided question templates.

### FR-8 Answer composer

Generate plain-English answers using only retrieved evidence. Answers must include qualifications and uncertainty.

### FR-9 Show the Evidence

Display claim-level citations and a reproducible calculation path.

### FR-10 AEN Review

Generate structured evidence reviews without automatically alleging misconduct or issuing political recommendations.

### FR-11 Correction log

Track corrections, affected data, reason, date, and downstream answers.

### FR-12 Data export

Allow download of normalized public data and citation manifests when legally and technically permissible.

## 7. Nonfunctional requirements

### Accuracy

Financial totals must reconcile within documented tolerances. Any unresolved variance must be visible.

### Traceability

Every transformed record must retain its lineage to the original source.

### Security

Secrets must never be committed. Administrative actions require authentication and audit logging.

### Privacy

Avoid collecting resident addresses or tax information unless necessary. Prefer local calculations or coarse inputs. Never expose protected or improperly released personal information.

### Accessibility

Target WCAG 2.2 AA for the public interface.

### Performance

Common questions should return an initial sourced response within five seconds after data is indexed.

### Portability

Jurisdiction-specific ingestion logic must be isolated from the shared CivicLens core.

## 8. Data-quality rules

1. Do not add numbers from different accounting bases without disclosure.
2. Do not treat transfers as external revenue or spending without context.
3. Do not treat an adopted budget as an actual payment.
4. Do not allocate pooled revenue to services without labeling the method as an estimate.
5. Do not combine City taxes with county or school taxes.
6. Preserve negative amounts, reversals, refunds, and amendments.
7. Record fiscal-year definitions and source publication dates.
8. Reconcile totals to the source document before publication.

## 9. Initial acceptance criteria

The Port St. Lucie alpha is ready when:

- At least three fiscal years of adopted budgets are cataloged.
- At least two fiscal years of actual revenue and expenditure data are normalized.
- The latest available audited financial report is cataloged and linked.
- The system can answer ten approved resident questions with claim-level citations.
- Budget-to-actual totals reconcile or show documented variances.
- A user can run one complete AEN Review.
- A public correction process exists.

## 10. Out of scope for the first alpha

- Automated accusations of fraud or corruption
- Predictive policing or resident surveillance
- Individual tax advice
- Replacement of official accounting or audit systems
- Full transaction-level tracing where the City has not published the necessary records
- Political endorsements or voting recommendations

## 11. Pilot success measures

- Percentage of answers with complete claim-level evidence
- Reconciliation success rate
- Time required for a resident to answer a core question
- User comprehension before and after using CivicLens
- Number of source gaps identified and resolved
- Number and severity of corrections
