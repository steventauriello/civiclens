# Architecture

## Architectural goals

CivicLens must be evidence-first, jurisdiction-portable, reproducible, secure, and understandable to nontechnical users.

## System overview

```text
Official sources
    ↓
Source registry and scheduled collectors
    ↓
Immutable source archive + metadata + hashes
    ↓
Parsing and extraction
    ↓
Normalization and reconciliation
    ↓
Relational financial store + evidence graph + search index
    ↓
Retrieval and calculation services
    ↓
Guarded AI answer composer + AEN Review engine
    ↓
Public web application and administrative review console
```

## Proposed technology direction

The final stack will be selected after data discovery, but the initial reference architecture assumes:

- **Frontend:** Next.js with TypeScript
- **API:** Python/FastAPI or TypeScript service layer
- **Primary database:** PostgreSQL
- **Object storage:** S3-compatible storage for source documents
- **Search:** PostgreSQL full-text initially; dedicated search/vector index only when justified
- **Data processing:** Python
- **Background jobs:** Queue-based workers
- **Authentication:** Managed identity provider for administrative users
- **Deployment:** Containerized services with separate development, staging, and production environments

This is a direction, not a locked vendor decision.

## Core components

### 1. Source registry

Stores canonical source definitions:

- Jurisdiction
- Publishing agency
- Dataset name
- Canonical URL
- Format
- Update schedule
- Access method
- Coverage dates
- Terms and restrictions
- Ingestion status
- Owner and reviewer

### 2. Collector layer

Jurisdiction adapters retrieve public documents and datasets. Each adapter must be idempotent, respectful of source-system limits, and capable of detecting changes.

### 3. Source archive

The original record is preserved with:

- Retrieval timestamp
- Content hash
- MIME type
- Source URL
- Published date when known
- Fiscal period
- Version identifier

### 4. Parsing layer

Parsers extract text, tables, metadata, and structured records while retaining page, row, cell, and section coordinates.

OCR should be a fallback, not the default.

### 5. Normalization layer

Maps source labels to canonical CivicLens concepts without deleting the original labels.

Examples:

- `General Fund`, fund code, and source-specific identifiers
- `Adopted Budget`, `Amended Budget`, `Actual`
- Department and program name changes across years
- Vendor aliases

### 6. Reconciliation service

Tests whether:

- Detailed records sum to published totals
- Fund totals reconcile to government-wide reports where appropriate
- Budget stages are not mixed
- Transfers are balanced
- Fiscal periods match

Reconciliation failures are first-class records, not hidden logs.

### 7. Evidence graph

Connects:

- Claims
- Financial records
- Source passages
- Funds
- Departments
- Programs
- Projects
- Vendors
- Contracts
- Agenda items
- Votes
- Outcomes
- AEN findings

### 8. Query and calculation service

Handles deterministic calculations before AI explanation. The language model should not perform unverified arithmetic when a calculation service can do it reproducibly.

### 9. AI answer composer

The AI receives retrieved evidence and structured calculations. It must:

- Cite every material claim
- Preserve accounting qualifications
- Identify missing evidence
- Refuse unsupported conclusions
- Separate fact, calculation, and inference

### 10. AEN Review engine

Builds a structured evidence packet for Accountability, Effectiveness, and Need. Initial versions should be reviewer-assisted rather than fully automated.

### 11. Public web application

Initial interface:

- Search bar
- Guided resident questions
- Revenue and spending explorer
- Property-tax explainer
- Project and vendor pages
- AEN Review pages
- Show the Evidence drawer
- Data-quality and correction notices

### 12. Administrative console

Required for:

- Source approval
- Extraction review
- Entity matching
- Reconciliation resolution
- AEN evidence review
- Correction publishing

## Repository direction

```text
frontend/                 Public and administrative interfaces
backend/                  API, domain logic, authentication
ai/                       Prompts, retrieval rules, evaluations
data/schemas/             Versioned interchange schemas
scripts/                  Collectors, parsers, migrations, QA tools
docs/                     Product, policy, and architecture decisions
```

## Architecture decisions still open

- Monorepo tooling
- Cloud provider
- Exact ingestion scheduler
- Search/vector infrastructure
- Public API strategy
- Document-retention policy
- Licensing model

Decisions should be recorded as Architecture Decision Records before implementation.
