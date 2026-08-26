window.CIVICLENS_DATA = {
  periods: {
    fy2025: {
      label: "FY 2024–25 operating funds",
      metrics: [
        { label: "Operating-fund revenue", value: "$446.7M", note: "Eight funds reported by the City", icon: "IN", tone: "dark" },
        { label: "Operating-fund spending", value: "$431.5M", note: "Rounded fund rows; includes reported non-operating outflows", icon: "OUT" },
        { label: "Funds reported", value: "8", note: "Not yet the entire City government", icon: "FND" },
        { label: "Evidence status", value: "Sourced", note: "FY 2024–25 fourth-quarter City report", icon: "SRC" }
      ],
      revenue: [
        { name: "General Fund", share: 43.0, amount: "$192.0M", note: "Citywide operating fund; revenue includes taxes, permits, intergovernmental revenue, charges, fines, miscellaneous, and other." },
        { name: "Utility Systems", share: 30.2, amount: "$135.1M", note: "Enterprise operating fund. Its money is not interchangeable with the General Fund." },
        { name: "Stormwater", share: 8.3, amount: "$37.0M", note: "Dedicated operating fund reported separately by the City." },
        { name: "Medical Insurance", share: 7.8, amount: "$34.9M", note: "Internal-service operating fund; not resident tax revenue." },
        { name: "Road & Bridge", share: 5.1, amount: "$23.0M", note: "Restricted transportation-related operating fund." },
        { name: "Building", share: 3.9, amount: "$17.2M", note: "Permit and building-service operating fund." },
        { name: "Other two operating funds", share: 1.7, amount: "$7.5M", note: "Solid Waste and Golf Course combined." }
      ],
      spending: [
        { name: "General Fund", share: 48.4, amount: "$208.7M" },
        { name: "Utility Systems", share: 24.4, amount: "$105.3M" },
        { name: "Medical Insurance", share: 8.2, amount: "$35.3M" },
        { name: "Stormwater", share: 7.3, amount: "$31.3M" },
        { name: "Building", share: 5.3, amount: "$23.0M" },
        { name: "Road & Bridge", share: 4.9, amount: "$21.0M" },
        { name: "Other two operating funds", share: 1.5, amount: "$6.8M" }
      ]
    },
    fy2024: {
      label: "FY 2024 demonstration",
      metrics: [
        { label: "Official source systems", value: "12", note: "Cataloged for the Port St. Lucie pilot", icon: "SRC", tone: "dark" },
        { label: "Verified records", value: "0", note: "No financial records published yet", icon: "CHK" },
        { label: "Target fiscal years", value: "3", note: "Budget and actual data planned", icon: "FY" },
        { label: "Evidence standard", value: "Claim-level", note: "Every material claim must be traceable", icon: "EV" }
      ],
      revenue: [
        { name: "Property and other taxes", share: 29, note: "Must separate City taxes from county, school board, and special districts." },
        { name: "Utility and enterprise revenue", share: 26, note: "Restricted to the applicable enterprise or service system." },
        { name: "Fees, permits, and charges", share: 16, note: "Includes service-linked revenue that may be legally restricted." },
        { name: "State, federal, and grant revenue", share: 14, note: "May include purpose-specific conditions and reporting requirements." },
        { name: "Debt proceeds and financing", share: 9, note: "Financing is not recurring operating revenue and creates obligations." },
        { name: "Other revenue", share: 6, note: "Must be reviewed by fund and accounting classification." }
      ],
      spending: [
        { name: "Public safety", share: 33 },
        { name: "Utilities and public services", share: 25 },
        { name: "Infrastructure and mobility", share: 19 },
        { name: "General government", share: 10 },
        { name: "Parks and community services", share: 7 },
        { name: "Debt service", share: 6 }
      ]
    }
  },
  flow: {
    revenue: [
      { name: "Reported revenue", share: 100 }
    ],
    funds: [
      { name: "Eight operating funds", share: 100 }
    ],
    uses: [
      { name: "Reported spending", share: 96.6 },
      { name: "Net reported change", share: 3.4 }
    ]
  },
  departmentTracker: {
    metrics: [
      { label: "Department registry", value: "18", note: "Initial City departments and spending functions to reconcile", icon: "DEP", tone: "dark" },
      { label: "Budget fields", value: "3", note: "Adopted budget, amended budget, and actual spending", icon: "BUD" },
      { label: "Published totals", value: "0", note: "No department total goes live before source checks", icon: "QA" },
      { label: "Source path", value: "Identified", note: "Budget, Q4 report, ACFR, agendas, procurement, and records requests", icon: "SRC" }
    ],
    departments: [
      { name: "Police Department", purpose: "Law enforcement, patrol, investigations, and public-safety operations.", funds: "General Fund; grants and capital may apply", adoptedBudget: "Pending extraction", actualSpending: "Pending extraction", status: "Source identified", statusClass: "tag tag--amber", nextStep: "Extract police budget schedules and reconcile to year-end actuals." },
      { name: "Public Works", purpose: "Transportation, road maintenance, engineering, traffic, and public infrastructure operations.", funds: "General Fund; Road & Bridge; capital funds may apply", adoptedBudget: "Pending extraction", actualSpending: "Pending extraction", status: "Source identified", statusClass: "tag tag--amber", nextStep: "Map department lines to operating and capital funds." },
      { name: "Parks & Recreation", purpose: "Parks, recreation programs, facilities, grounds, and community services.", funds: "General Fund; Golf Course; capital funds may apply", adoptedBudget: "Pending extraction", actualSpending: "Pending extraction", status: "Source identified", statusClass: "tag tag--amber", nextStep: "Separate operating costs from capital park projects." },
      { name: "Utility Systems", purpose: "Water, wastewater, utility operations, maintenance, and customer service.", funds: "Utility Systems enterprise fund", adoptedBudget: "Pending extraction", actualSpending: "Pending extraction", status: "Source identified", statusClass: "tag tag--amber", nextStep: "Reconcile enterprise-fund activity to department operating lines." },
      { name: "Building Department", purpose: "Permitting, plan review, inspections, code-related building services, and customer support.", funds: "Building Fund", adoptedBudget: "Pending extraction", actualSpending: "Pending extraction", status: "Source identified", statusClass: "tag tag--amber", nextStep: "Extract Building Fund budget-to-actual lines." },
      { name: "Planning & Zoning", purpose: "Land-use planning, zoning review, development review, and long-range planning.", funds: "General Fund; development-review revenues may apply", adoptedBudget: "Pending extraction", actualSpending: "Pending extraction", status: "Needs mapping", statusClass: "tag tag--amber", nextStep: "Confirm whether costs sit under a standalone department or broader development services grouping." },
      { name: "Neighborhood Services", purpose: "Neighborhood programs, housing support, community services, and code-related activity where applicable.", funds: "General Fund; grants may apply", adoptedBudget: "Pending extraction", actualSpending: "Pending extraction", status: "Needs mapping", statusClass: "tag tag--amber", nextStep: "Identify grant-funded lines and separate restricted dollars." },
      { name: "Finance Department", purpose: "Accounting, financial reporting, treasury, debt, grants accounting, and financial controls.", funds: "General Fund; internal service activity may apply", adoptedBudget: "Pending extraction", actualSpending: "Pending extraction", status: "Source identified", statusClass: "tag tag--amber", nextStep: "Extract operating budget and link to ACFR reporting responsibilities." },
      { name: "Office of Management & Budget", purpose: "Budget preparation, performance tracking, management analysis, and citywide financial planning.", funds: "General Fund", adoptedBudget: "Pending extraction", actualSpending: "Pending extraction", status: "Source identified", statusClass: "tag tag--amber", nextStep: "Extract OMB budget and connect to published quarterly reports." },
      { name: "Procurement", purpose: "Purchasing, solicitations, vendor processes, contracts support, and procurement policy.", funds: "General Fund; procurement system records", adoptedBudget: "Pending extraction", actualSpending: "Pending extraction", status: "Source identified", statusClass: "tag tag--amber", nextStep: "Link department cost lines to solicitations, contracts, and vendor records." },
      { name: "City Manager", purpose: "Executive administration, citywide operations, policy execution, and department oversight.", funds: "General Fund", adoptedBudget: "Pending extraction", actualSpending: "Pending extraction", status: "Source identified", statusClass: "tag tag--amber", nextStep: "Extract executive administration cost lines." },
      { name: "City Clerk", purpose: "Agendas, minutes, public records, elections support, records retention, and legislative documentation.", funds: "General Fund; records systems", adoptedBudget: "Pending extraction", actualSpending: "Pending extraction", status: "Source identified", statusClass: "tag tag--amber", nextStep: "Extract Clerk budget and connect agenda approvals to spending records." },
      { name: "City Attorney", purpose: "Legal services, litigation, contract review, ordinances, and legal risk management.", funds: "General Fund; outside counsel costs may appear separately", adoptedBudget: "Pending extraction", actualSpending: "Pending extraction", status: "Needs mapping", statusClass: "tag tag--amber", nextStep: "Separate in-house costs from outside legal vendor spending." },
      { name: "Human Resources", purpose: "Hiring, benefits, employee relations, training, compensation, and workforce administration.", funds: "General Fund; Medical Insurance internal service fund may relate", adoptedBudget: "Pending extraction", actualSpending: "Pending extraction", status: "Needs reconciliation", statusClass: "tag tag--amber", nextStep: "Keep HR operating costs separate from citywide employee benefit claims." },
      { name: "Information Technology", purpose: "Technology operations, security, applications, hardware, networks, and digital services.", funds: "General Fund; capital and contract spending may apply", adoptedBudget: "Pending extraction", actualSpending: "Pending extraction", status: "Needs mapping", statusClass: "tag tag--amber", nextStep: "Link department costs to software, hardware, and service contracts." },
      { name: "Communications", purpose: "Public information, resident communications, media, and outreach.", funds: "General Fund", adoptedBudget: "Pending extraction", actualSpending: "Pending extraction", status: "Needs mapping", statusClass: "tag tag--amber", nextStep: "Confirm current department name and extract budget lines." },
      { name: "Solid Waste", purpose: "Residential waste service administration and related operating activity.", funds: "Solid Waste operating fund", adoptedBudget: "Pending extraction", actualSpending: "Pending extraction", status: "Source identified", statusClass: "tag tag--amber", nextStep: "Extract fund activity and identify contracted service payments." },
      { name: "Fire services / emergency response", purpose: "Emergency response costs residents may ask about, including any City-paid support or transfers.", funds: "Separate jurisdiction check required", adoptedBudget: "Pending jurisdiction check", actualSpending: "Pending jurisdiction check", status: "Jurisdiction check", statusClass: "tag tag--amber", nextStep: "Confirm what belongs to the City versus St. Lucie County Fire District before publishing." }
    ]
  },
  sources: [
    {
      code: "TR",
      title: "Transparency and Data",
      publisher: "City of Port St. Lucie",
      detail: "Master discovery index for public dashboards, reports, plans, and records.",
      url: "https://www.cityofpsl.com/Government/Discover-Us/Transparency-Data"
    },
    {
      code: "BD",
      title: "Annual Budget",
      publisher: "Office of Management and Budget",
      detail: "Adopted budgets, budget-in-brief publications, and quarterly reporting entry point.",
      url: "https://www.cityofpsl.com/Government/Your-City-Government/Departments/Office-of-Management-Budget/Annual-Budget"
    },
    {
      code: "FN",
      title: "Finance Department",
      publisher: "City of Port St. Lucie Finance Department",
      detail: "Financial reporting, debt, investment, audit, and policy resources.",
      url: "https://www.cityofpsl.com/Government/Your-City-Government/Departments/Finance"
    },
    {
      code: "AC",
      title: "Annual Comprehensive Financial Reports",
      publisher: "City of Port St. Lucie Finance Department",
      detail: "Audited annual financial statements and government-wide reporting.",
      url: "https://www.cityofpsl.com/Government/Your-City-Government/Departments/Finance/Annual-Comprehensive-Financial-Reports"
    },
    {
      code: "PR",
      title: "Procurement",
      publisher: "Office of Management and Budget",
      detail: "Purchasing policies, solicitation information, and procurement portal access.",
      url: "https://www.cityofpsl.com/Government/Your-City-Government/Departments/Office-of-Management-Budget/Procurement"
    },
    {
      code: "AG",
      title: "Agendas and Meetings",
      publisher: "City Clerk",
      detail: "Council agenda items, supporting documents, minutes, and legislative records.",
      url: "https://www.cityofpsl.com/Government/Your-City-Government/Departments/City-Clerk/Agendas-Meetings"
    },
    {
      code: "RR",
      title: "Public Records Requests",
      publisher: "City Clerk",
      detail: "Official request channel for machine-readable records not already published.",
      url: "https://www.cityofpsl.com/Government/Your-City-Government/Departments/City-Clerk/Public-Records-Requests"
    }
  ],
  answers: {
    propertyTax: {
      title: "Where did my property taxes go?",
      intro: "CivicLens has one sourced FY 2024–25 operating-funds report, but it cannot yet provide a property-tax allocation.",
      explanation: "A responsible property-tax answer still needs the City's portion of the tax bill separated from county, school-board, and special-district taxes. It also needs citywide spending categories reconciled beyond the eight operating funds before estimating how pooled City property-tax revenue supported services.",
      facts: [
        ["What is known", "The FY 2024–25 fourth-quarter report supports a starting view of eight operating funds."],
        ["What is missing", "Citywide reconciliation, fund restrictions, capital/debt/grant/CRA/assessment funds, and the City's exact share of a resident's tax bill."],
        ["How the answer will be calculated", "City property-tax amount × verified service-spending proportions, with transfers and restricted funds excluded where appropriate."]
      ]
    },
    publicSafety: {
      title: "How much was spent on public safety?",
      intro: "CivicLens does not yet have a verified public-safety service-area total.",
      explanation: "The current sourced view is organized by operating fund, not by police, fire, emergency management, or other public-safety service areas. A trustworthy public-safety total must identify the reporting period, funds included, department definitions, transfers, capital spending, and actual payments before publishing a number.",
      facts: [
        ["Current evidence", "One FY 2024–25 operating-funds report has been extracted for review."],
        ["Key distinction", "Fund-level spending is not the same as service-area, department, vendor, or transaction-level spending."],
        ["Next requirement", "Map official departments and accounts to public-safety categories and reconcile them to source totals."]
      ]
    },
    departments: {
      title: "Which departments spend public money?",
      intro: "CivicLens is starting the department tracker now, but it is not publishing department totals until they are extracted from official records.",
      explanation: "The first tracker release identifies the departments and spending functions that must be reconciled to adopted budget, amended budget, actual spending, contracts, and payment records. Pending values are shown as gaps on purpose so the public can see what has been sourced and what still needs extraction.",
      facts: [
        ["What is live", "A department/function registry, evidence status, and extraction queue for the Port St. Lucie pilot."],
        ["What is not live yet", "Verified department budget-to-actual totals, vendor-level spending, invoice-level detail, and citywide reconciliation."],
        ["Publication rule", "No department spending number should be displayed until CivicLens can point to the official source and calculation path."]
      ]
    },
    contracts: {
      title: "Show contracts and vendor payments",
      intro: "CivicLens has identified the official procurement and meeting systems, but transaction-level coverage has not yet been confirmed.",
      explanation: "The goal is to connect solicitations, contracts, amendments, purchase orders, invoices, payments, projects, agenda approvals, and vendors. Any missing link will be shown as a documented data gap rather than treated as evidence of wrongdoing.",
      facts: [
        ["Cataloged", "Procurement portal, procurement department, City Clerk meetings, and public-records request channel."],
        ["Still testing", "Export availability, contract identifiers, vendor master records, check register, purchase orders, and change orders."],
        ["Next action", "Request existing machine-readable exports for records that are not publicly downloadable."]
      ]
    },
    generic: {
      title: "CivicLens is building the evidence base",
      intro: "That question is valid, but the current public view only supports a narrow FY 2024–25 operating-funds answer.",
      explanation: "CivicLens is designed to answer only from official records, deterministic calculations, and visible source lineage. The next stage is citywide collection, extraction, normalization, and reconciliation so unsupported conclusions stay off the page.",
      facts: [
        ["Current stage", "Functional public interface, official-source catalog, and one sourced operating-funds report."],
        ["Next stage", "Document collection, extraction, normalization, and reconciliation across the full citywide ledger."],
        ["Publication rule", "No material number is published until it can be traced and checked."]
      ]
    }
  }
};
