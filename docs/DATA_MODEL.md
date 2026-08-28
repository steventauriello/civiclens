# Data Model

The TRACE data model must preserve official accounting meaning while making records comparable across years and jurisdictions.

## Core entities

### Jurisdiction

A government or public body whose records are being analyzed.

Key fields:

- `jurisdiction_id`
- `name`
- `jurisdiction_type`
- `state`
- `fiscal_year_start`
- `official_website`

### Source

A recurring official publication, portal, dataset, or records channel.

- `source_id`
- `jurisdiction_id`
- `publisher`
- `title`
- `canonical_url`
- `format`
- `update_frequency`
- `access_method`
- `status`

### Document

A specific retrieved version of a source artifact.

- `document_id`
- `source_id`
- `published_at`
- `retrieved_at`
- `fiscal_year`
- `content_hash`
- `storage_uri`
- `mime_type`
- `version_label`

### Evidence locator

A precise location inside a document or dataset.

- `evidence_id`
- `document_id`
- `page`
- `section`
- `table`
- `row`
- `cell`
- `quoted_text`
- `structured_value`

### Fund

A fiscal and accounting entity with a self-balancing set of accounts.

- `fund_id`
- `official_code`
- `official_name`
- `canonical_name`
- `fund_type`
- `restricted_status`
- `effective_dates`

### Organization unit

Department, division, office, program, or cost center.

- `org_unit_id`
- `parent_org_unit_id`
- `official_code`
- `official_name`
- `unit_type`
- `effective_dates`

### Account

Revenue, expenditure, asset, liability, or other accounting classification.

- `account_id`
- `official_code`
- `official_name`
- `canonical_category`
- `account_type`

### Financial record

A budget or actual amount tied to a period and accounting dimensions.

- `financial_record_id`
- `fiscal_year`
- `period`
- `basis`
- `stage`
- `fund_id`
- `org_unit_id`
- `account_id`
- `program_id`
- `project_id`
- `vendor_id`
- `contract_id`
- `amount`
- `currency`
- `source_label`
- `evidence_id`

Valid `stage` values should include:

- proposed budget
- adopted budget
- amended budget
- encumbrance
- actual expenditure
- cash payment
- revenue recognized
- cash receipt
- transfer
- year-end adjustment

### Vendor

- `vendor_id`
- `official_name`
- `normalized_name`
- `public_identifier`
- `address_visibility`
- `alias_list`

### Contract

- `contract_id`
- `contract_number`
- `vendor_id`
- `title`
- `procurement_method`
- `authorized_amount`
- `start_date`
- `end_date`
- `status`
- `approval_record_id`

### Project

- `project_id`
- `official_project_number`
- `name`
- `description`
- `department_id`
- `location`
- `planned_start`
- `planned_end`
- `actual_end`
- `approved_budget`
- `current_budget`
- `actual_spending`
- `status`

### Legislative record

- `legislative_record_id`
- `meeting_date`
- `body`
- `agenda_item_number`
- `title`
- `action`
- `vote_result`
- `document_id`

### Performance measure

- `measure_id`
- `program_id`
- `name`
- `definition`
- `baseline_value`
- `target_value`
- `actual_value`
- `period`
- `evidence_id`

### Claim

A statement shown to a user.

- `claim_id`
- `claim_text`
- `claim_type`
- `calculation_id`
- `confidence_status`
- `created_at`

Each claim must link to one or more evidence locators or deterministic calculations.

### AEN Review

- `review_id`
- `subject_type`
- `subject_id`
- `question`
- `scope_start`
- `scope_end`
- `accountability_status`
- `effectiveness_status`
- `need_status`
- `reviewer_status`
- `published_at`

### AEN finding

- `finding_id`
- `review_id`
- `test`
- `finding_type`
- `statement`
- `evidence_ids`
- `limitations`

## Lineage requirements

Every normalized record must preserve:

1. Original source label
2. Source document and version
3. Exact evidence locator
4. Parser version
5. Transformation rule
6. Reviewer status
7. Correction history

## Money-flow relationships

TRACE should represent relationships without pretending that all public money is individually earmarked.

```text
Revenue source → Fund → Budget authority → Department/program/project
                                      ↓
                               Obligation/contract
                                      ↓
                                  Expenditure
                                      ↓
                                   Payment
                                      ↓
                              Reported output/outcome
```

Some links will be direct, some allocated, and some unavailable. Every relationship needs a `relationship_method` such as:

- direct official identifier
- official crosswalk
- deterministic join
- proportional allocation
- analyst-reviewed match
- unresolved

## Reconciliation records

A reconciliation should store:

- Scope
- Expected total
- Calculated total
- Difference
- Tolerance
- Status
- Explanation
- Supporting evidence

No unreconciled dataset should silently power a public total.
