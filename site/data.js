window.CIVICLENS_DATA = {
  periods: {
    fy2025: {
      label: "FY 2024–25 operating funds",
      metrics: [
        { label: "Operating-fund revenue", value: "$446.7M", note: "Eight funds reported by the City", icon: "IN", tone: "dark" },
        { label: "Operating-fund spending", value: "$431.5M", note: "Includes reported non-operating outflows", icon: "OUT" },
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
      intro: "CivicLens cannot yet provide an official Port St. Lucie allocation because the verified financial records have not been ingested.",
      explanation: "The production answer will first separate the City's portion of a tax bill from county, school board, and special-district amounts. It will then estimate how pooled City property-tax revenue supported services, clearly labeling the calculation as an estimate rather than claiming an individual dollar was earmarked.",
      facts: [
        ["What is known", "Official budget, audited financial, millage, and quarterly-report entry points are cataloged."],
        ["What is missing", "Verified fiscal-year totals, fund restrictions, actual expenditures, and the City's exact share of a resident's tax bill."],
        ["How the answer will be calculated", "City property-tax amount × verified service-spending proportions, with transfers and restricted funds excluded where appropriate."]
      ]
    },
    publicSafety: {
      title: "How much was spent on public safety?",
      intro: "No official public-safety spending total has been released through CivicLens yet.",
      explanation: "A trustworthy total must identify the reporting period, funds included, budget stage, department definitions, internal transfers, capital spending, and actual payments. CivicLens will not combine those categories without disclosure.",
      facts: [
        ["Required source set", "Adopted budget, amended budget, year-end actuals, audited financial report, and department or fund schedules."],
        ["Key distinction", "Budget authority is not the same as an actual expenditure or vendor payment."],
        ["Evidence status", "Source locations are known; detailed values still require extraction and reconciliation."]
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
      title: "CivicLens is still building the evidence base",
      intro: "That question is valid, but the current prototype does not yet have enough verified Port St. Lucie financial data to answer it responsibly.",
      explanation: "CivicLens is designed to answer only from official records, deterministic calculations, and visible source lineage. Unsupported conclusions will be withheld.",
      facts: [
        ["Current stage", "Functional public interface and official-source catalog."],
        ["Next stage", "Document collection, extraction, normalization, and reconciliation."],
        ["Publication rule", "No material number is published until it can be traced and checked."]
      ]
    }
  }
};
