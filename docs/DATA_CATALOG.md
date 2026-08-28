# Port St. Lucie Data Catalog v0.1

This catalog identifies official sources for the TRACE Port St. Lucie pilot. It is an inventory, not a claim that every source has already been ingested or reconciled.

## Status legend

- **Confirmed** — Official source located and suitable for discovery.
- **Needs extraction test** — Source exists, but table structure or automation method must be tested.
- **Needs public-record request** — The public website does not yet appear to provide the required detail.
- **Research needed** — Ownership, completeness, or access method remains unresolved.

## 1. Master transparency sources

| Source | Owner | What it provides | Format | Cadence | Status |
|---|---|---|---|---|---|
| [Transparency & Data](https://www.cityofpsl.com/Government/Discover-Us/Transparency-Data) | City of Port St. Lucie | Master index to budgets, finance, projects, open data, metrics, meetings, and public records | HTML links | Ongoing | Confirmed |
| City Data Catalog | City data team | Published city datasets and metadata | Portal/API/exports | Varies | Needs extraction test |
| Open Data GIS Portal | City GIS | Geographic datasets and maps | GIS services | Varies | Needs extraction test |

## 2. Budget and in-year financial reporting

| Source | Owner | What it provides | Format | Cadence | Status |
|---|---|---|---|---|---|
| [Annual Budget](https://www.cityofpsl.com/Government/Your-City-Government/Departments/Office-of-Management-Budget/Annual-Budget) | Office of Management & Budget | Adopted and proposed budgets, budget-in-brief, amendments, millage analysis, CIP plans, quarterly statements | PDF | Annual/quarterly | Confirmed |
| Adopted Budget FY 2025-26 | OMB | Legal and operating budget by fund and department | PDF | Annual | Needs extraction test |
| Adopted Budget in Brief FY 2025-26 | OMB | Resident-oriented summary | PDF | Annual | Needs extraction test |
| Statements of Revenues & Expenditures | OMB | In-year revenue and expenditure reporting | PDF | Quarterly | Needs extraction test |
| Millage Rate Analysis | OMB | Property-tax rate analysis and comparisons | PDF | Annual | Needs extraction test |
| Budget amendments | OMB / City Council | Changes between adopted and amended budget | PDF / agenda records | As needed | Needs extraction test |

## 3. Audited and year-end financial reporting

| Source | Owner | What it provides | Format | Cadence | Status |
|---|---|---|---|---|---|
| [Finance Department](https://www.cityofpsl.com/Government/Your-City-Government/Departments/Finance) | Finance | Accounting, reporting, debt, investments, grants, audit, treasury, and policy links | HTML/PDF | Ongoing | Confirmed |
| [Annual Comprehensive Financial Reports](https://www.cityofpsl.com/Government/Your-City-Government/Departments/Finance/Annual-Comprehensive-Financial-Reports) | Finance | Audited government-wide and fund financial statements, notes, schedules, and statistics | PDF | Annual | Confirmed; document links need enumeration |
| [Popular Annual Financial Reports](https://www.cityofpsl.com/Government/Your-City-Government/Departments/Finance/Popular-Annual-Financial-Reports) | Finance | Plain-language year-end financial summaries | PDF | Annual | Confirmed; document links need enumeration |
| Annual Debt Management Reports | Finance/Treasury | Debt obligations, structure, and management | PDF | Annual | Confirmed |
| Annual Investment Reports | Finance/Treasury | Portfolio and investment reporting | PDF | Annual | Confirmed |
| Finance policies | Finance | Debt, investment, and capital-asset policies | PDF | As amended | Confirmed |

## 4. Property taxes and resident allocation

| Source | Owner | What it provides | Format | Cadence | Status |
|---|---|---|---|---|---|
| City millage analysis and budget documents | OMB | City millage rates, taxable values, and budgeted ad valorem revenue | PDF | Annual | Confirmed |
| St. Lucie County Property Appraiser | County constitutional office | Parcel values and exemptions | Web/search/download | Annual/ongoing | Research needed |
| St. Lucie County Tax Collector | County constitutional office | Tax bills and taxing-authority breakdowns | Web/PDF | Annual | Research needed |
| Florida Department of Revenue TRIM data | State | Certified taxable value and millage information | Files/reports | Annual | Research needed |

### Important limitation

A property-tax bill includes multiple taxing authorities. TRACE must isolate the City of Port St. Lucie portion before estimating how a resident's City taxes relate to City services. Pooled General Fund revenue cannot be represented as individually earmarked pennies; allocations must be labeled as estimates based on an explicit method.

## 5. Procurement, contracts, and vendors

| Source | Owner | What it provides | Format | Cadence | Status |
|---|---|---|---|---|---|
| [Procurement](https://www.cityofpsl.com/Government/Your-City-Government/Departments/Office-of-Management-Budget/Procurement) | OMB Procurement | Procurement policies, thresholds, manuals, vendor tools, and portal links | HTML/PDF | Ongoing | Confirmed |
| [OpenGov procurement portal](https://procurement.opengov.com/portal/cityofpsl) | City/OpenGov | Solicitations, notices, and procurement records | Web portal | Ongoing | Needs extraction and terms review |
| OpenGov Contract Search | City/OpenGov | Searchable contract records | Web portal | Ongoing | Needs extraction and completeness review |
| Procurement Manual | Procurement | Required purchasing processes and controls | PDF | As amended | Confirmed |
| Vendor master file | Finance/Procurement | Canonical vendors and identifiers | Data export | Ongoing | Needs public-record request |
| Accounts-payable payment detail/check register | Finance | Transaction-level vendor payments | CSV/XLSX/data export | Ongoing | Needs public-record request |
| Purchase-order detail | Procurement/Finance | Commitments before payment | Data export | Ongoing | Needs public-record request |
| P-card transaction detail | Finance/Procurement | Purchasing-card spending | Data export | Ongoing | Needs public-record request and privacy review |

## 6. Capital projects

| Source | Owner | What it provides | Format | Cadence | Status |
|---|---|---|---|---|---|
| Capital Improvement Plan documents | OMB | Multi-year proposed project budgets and funding sources | PDF | Annual | Confirmed |
| Capital Improvement Projects Tracker Map | City | Project locations, descriptions, status, and selected costs | Map/web | Ongoing | Needs extraction test |
| PSLinProgress | City | Public project and progress information | Web | Ongoing | Research needed |
| Contracts, amendments, and change orders | Procurement/City Clerk | Vendor obligations and project changes | Portal/agenda records | As approved | Needs linking strategy |
| Project actuals | Finance/project departments | Actual expenditures by project | Data export/report | Monthly/quarterly | Needs public-record request if not published |

## 7. Council authorization and legislative evidence

| Source | Owner | What it provides | Format | Cadence | Status |
|---|---|---|---|---|---|
| [Agendas & Meetings](https://www.cityofpsl.com/Government/Your-City-Government/Departments/City-Clerk/Agendas-Meetings) | City Clerk | Agendas, minutes, attachments, videos, and legislative records | Legistar/web/PDF | Per meeting | Confirmed |
| [City Clerk](https://www.cityofpsl.com/Government/Your-City-Government/Departments/City-Clerk) | City Clerk | Official records, minutes, ordinances, and public-record services | HTML/PDF | Ongoing | Confirmed |
| Ordinances and resolutions | City Clerk | Legal authority and approvals | Web/PDF | As adopted | Needs extraction test |
| Agenda item attachments | Departments/City Clerk | Staff reports, contracts, fiscal impact, and recommendations | PDF | Per item | Needs extraction test |
| Vote records | City Council/Legistar | Member votes and outcomes | Web/PDF | Per item | Needs extraction test |

## 8. Outcomes and performance evidence

| Source | Owner | What it provides | Format | Cadence | Status |
|---|---|---|---|---|---|
| Strategic Plan | City Manager/Council | Goals, initiatives, and planned outcomes | PDF/web | Periodic | Confirmed via transparency index |
| High Impact Plans | City departments | Department priorities and project plans | PDF/web | Annual | Confirmed |
| Service Metrics | City | Performance metrics for service requests | Dashboard | Ongoing | Needs extraction test |
| Annual Report | City Manager | Reported accomplishments and outcomes | PDF/web | Annual | Confirmed via transparency index |
| Community Survey | City | Resident satisfaction and priorities | Report/data | Periodic | Confirmed via transparency index |

## 9. Public-record request channel

| Source | Owner | What it provides | Format | Cadence | Status |
|---|---|---|---|---|---|
| [Public Records Requests](https://www.cityofpsl.com/Government/Your-City-Government/Departments/City-Clerk/Public-Records-Requests) | City Clerk / Police | Requests for records not already published | Portal/email/other | On request | Confirmed |

## Priority ingestion order

1. Adopted Budget FY 2025-26 and Budget in Brief
2. FY 2024-25 fourth-quarter revenue and expenditure statement
3. Latest available ACFR
4. FY 2024-25 and FY 2023-24 adopted budgets
5. Millage analyses and property-tax fact sheets
6. Latest debt and investment reports
7. Capital Improvement Plan and project tracker
8. Procurement manual, contract search, and selected major contracts
9. Council records tied to major budget and contract decisions
10. Public-record request for vendor-payment and project-actual detail

## First reconciliation target

For one completed fiscal year, reconcile:

```text
Beginning fund balance
+ revenues and other financing sources
- expenditures and other financing uses
= ending fund balance
```

The accounting presentation may differ by fund and report. TRACE must document the exact reconciliation used rather than force every source into a single formula.

## Known gaps

- Transaction-level vendor payments have not yet been confirmed as a downloadable public dataset.
- Contract-search completeness and automated access have not yet been tested.
- The latest ACFR document list still needs to be enumerated and downloaded.
- A complete mapping between City funds, departments, programs, and capital projects has not yet been built.
- Property-level estimates require data from taxing authorities outside the City website.
