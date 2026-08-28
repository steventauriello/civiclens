# TRACE — Taxpayer Revenue Accountability & Control Engine

> Every dollar. Every document. Every gap.

## Follow Every Public Dollar

TRACE is an evidence-first civic intelligence platform designed to help everyday Americans understand how public money is collected, budgeted, spent, and measured.

The first implementation focuses on the City of Port St. Lucie, Florida. The long-term goal is a reusable platform that can support cities, counties, school districts, states, and other public institutions.

## Core promise

TRACE will trace every public dollar that can be supported by official records and show residents the evidence behind every answer.

## What TRACE will answer

- How much revenue did the city receive?
- Where did the money come from?
- Which funds and departments received it?
- What was budgeted, obligated, and actually spent?
- Which vendors, contracts, and projects received payments?
- What results were reported?
- Does the available evidence satisfy an AEN Review?

## AEN Review

TRACE organizes evidence using three tests:

- **Accountability** — Was the money authorized, traceable, safeguarded, and reported?
- **Effectiveness** — Did the spending accomplish the result it was created to achieve?
- **Need** — Is additional funding truly necessary, or could reform, management, policy, or existing resources solve the problem?

TRACE does not manufacture a political verdict. It presents verified evidence, identifies gaps, and lets residents reach their own conclusions.

## Control Total Trace

TRACE uses control totals as the positive-stop system for financial tracing. For each fiscal year, fund, department, and spending layer, TRACE should capture the official total first, then require extracted records to reconcile back to that total or expose the variance as a public gap.

Formula:

```text
Official control total - mapped detail = variance
```

See [docs/CONTROL_TOTAL_TRACE.md](docs/CONTROL_TOTAL_TRACE.md) for the FY 2024-25 first control set.

## Trust standard

- No unsupported financial claims
- No hidden sources
- No opinion presented as fact
- No AEN conclusion without documented evidence
- Clear separation of budget, actual spending, transfers, debt proceeds, and restricted funds
- Every answer includes a **Show the Evidence** path

## Phase 1: Port St. Lucie

The first milestone is a complete public-finance source inventory covering:

- Annual budgets and amendments
- Quarterly revenue and expenditure statements
- Annual comprehensive financial reports
- Property-tax and millage documents
- Capital improvement plans and project tracking
- Debt, investment, grant, and reserve reports
- Procurement, contracts, solicitations, and vendors
- Council agendas, minutes, resolutions, and approvals
- Public-record requests for missing transaction-level detail

## Repository map

```text
civiclens/
├── README.md
├── docs/
├── data/
│   ├── raw/
│   ├── processed/
│   └── schemas/
├── backend/
├── frontend/
├── ai/
└── scripts/
```

## Current status

**v0.0.1 — Foundation and Port St. Lucie data discovery**

See [`docs/ROADMAP.md`](docs/ROADMAP.md) for the build sequence and [`docs/DATA_CATALOG.md`](docs/DATA_CATALOG.md) for the first official source inventory.

## Independence notice

TRACE is an independent project. It is not affiliated with, endorsed by, or operated by the City of Port St. Lucie or any other government agency.
