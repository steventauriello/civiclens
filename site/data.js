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
      { label: "Official departments", value: "28", note: "City-listed departments now included in the tracker", icon: "DEP", tone: "dark" },
      { label: "Jurisdiction checks", value: "1", note: "Fire/emergency response separated until City vs. Fire District funding is confirmed", icon: "JUR" },
      { label: "Published totals", value: "0", note: "No department total goes live before source checks", icon: "QA" },
      { label: "Funding-source map", value: "Pending", note: "Tax, fee, enterprise, grant, CRA, and internal-service dollars still need mapping", icon: "SRC" }
    ],
    departments: [
      { name: "Animal Control", purpose: "Public safety and animal welfare through enforcement, education, and humane services.", funds: "Likely General Fund; verify budget/fund source", adoptedBudget: "Pending extraction", actualSpending: "Pending extraction", status: "Official department", statusClass: "tag tag--amber", nextStep: "Extract department budget lines and confirm tax-supported share." },
      { name: "Building", purpose: "Construction plan review, permitting, inspections, code-compliant building activity, and records support.", funds: "Building Fund; permit and fee revenue likely applies", adoptedBudget: "Pending extraction", actualSpending: "Pending extraction", status: "Official department", statusClass: "tag tag--amber", nextStep: "Reconcile Building Fund revenue and spending to department activity." },
      { name: "Business Tax", purpose: "Local business tax receipts, licensing, and business compliance support.", funds: "General Fund or fee-supported activity; verify budget/fund source", adoptedBudget: "Pending extraction", actualSpending: "Pending extraction", status: "Official department", statusClass: "tag tag--amber", nextStep: "Find budget location and separate tax receipts from operating costs." },
      { name: "City Attorney's Office", purpose: "Legal counsel, legislation drafting, representation, contract review, litigation, and compliance support.", funds: "General Fund; outside counsel costs may appear separately", adoptedBudget: "Pending extraction", actualSpending: "Pending extraction", status: "Official department", statusClass: "tag tag--amber", nextStep: "Separate in-house legal spending from outside legal vendors." },
      { name: "City Clerk", purpose: "Official records, agendas, minutes, elections support, public records, and legislative documentation.", funds: "General Fund; records systems may apply", adoptedBudget: "Pending extraction", actualSpending: "Pending extraction", status: "Official department", statusClass: "tag tag--amber", nextStep: "Extract Clerk budget and link agenda approvals to spending records." },
      { name: "City Manager", purpose: "Executive administration, policy execution, citywide operations, and department oversight.", funds: "General Fund", adoptedBudget: "Pending extraction", actualSpending: "Pending extraction", status: "Official department", statusClass: "tag tag--amber", nextStep: "Extract executive administration budget and actual spending lines." },
      { name: "Code Compliance", purpose: "Community standards enforcement for health, safety, property maintenance, and neighborhood quality.", funds: "General Fund; fines/fees may apply", adoptedBudget: "Pending extraction", actualSpending: "Pending extraction", status: "Official department", statusClass: "tag tag--amber", nextStep: "Map code compliance costs and related fine or fee revenue." },
      { name: "Communications", purpose: "Public information, media relations, marketing, neighborhood engagement, and digital content.", funds: "General Fund", adoptedBudget: "Pending extraction", actualSpending: "Pending extraction", status: "Official department", statusClass: "tag tag--amber", nextStep: "Extract communications budget lines and identify contract/vendor spending." },
      { name: "Community Redevelopment Agency (CRA)", purpose: "Redevelopment planning, infrastructure investment, and revitalization in designated areas.", funds: "CRA/tax-increment funding; not ordinary citywide General Fund", adoptedBudget: "Pending extraction", actualSpending: "Pending extraction", status: "Official department", statusClass: "tag tag--amber", nextStep: "Separate CRA tax-increment dollars from citywide tax-supported departments." },
      { name: "Emergency Management", purpose: "Preparedness, response, recovery coordination, and disaster resilience operations.", funds: "General Fund; grants may apply", adoptedBudget: "Pending extraction", actualSpending: "Pending extraction", status: "Official department", statusClass: "tag tag--amber", nextStep: "Map emergency management budget and grant-funded activity." },
      { name: "Finance", purpose: "Budgeting, accounting, treasury, financial reporting, debt, grants accounting, and fiscal controls.", funds: "General Fund; internal service activity may apply", adoptedBudget: "Pending extraction", actualSpending: "Pending extraction", status: "Official department", statusClass: "tag tag--amber", nextStep: "Extract operating budget and link to ACFR responsibilities." },
      { name: "Human Resources", purpose: "Recruitment, benefits, training, employee relations, compensation, and workforce administration.", funds: "General Fund; Medical Insurance internal service fund may relate", adoptedBudget: "Pending extraction", actualSpending: "Pending extraction", status: "Official department", statusClass: "tag tag--amber", nextStep: "Keep HR operating costs separate from citywide employee benefit claims." },
      { name: "Information Technology", purpose: "Technology systems, cybersecurity, support services, applications, GIS, and digital operations.", funds: "General Fund; capital and contract spending may apply", adoptedBudget: "Pending extraction", actualSpending: "Pending extraction", status: "Official department", statusClass: "tag tag--amber", nextStep: "Link IT budget lines to software, hardware, and service contracts." },
      { name: "Keep Port St. Lucie Beautiful", purpose: "Beautification, sustainability, cleanup, volunteer programming, and civic pride initiatives.", funds: "General Fund; grants or donations may apply", adoptedBudget: "Pending extraction", actualSpending: "Pending extraction", status: "Official department", statusClass: "tag tag--amber", nextStep: "Confirm organizational placement and funding source." },
      { name: "Lien Services", purpose: "Municipal liens, assessments, and related financial documentation for properties.", funds: "General Fund or assessment/lien-related revenue; verify source", adoptedBudget: "Pending extraction", actualSpending: "Pending extraction", status: "Official department", statusClass: "tag tag--amber", nextStep: "Separate administrative cost from liens, assessments, and pass-through activity." },
      { name: "Mayor & City Council", purpose: "Legislative leadership, policy direction, representation, and public governance.", funds: "General Fund", adoptedBudget: "Pending extraction", actualSpending: "Pending extraction", status: "Official department", statusClass: "tag tag--amber", nextStep: "Extract elected official and legislative office budget lines." },
      { name: "MIDFLORIDA Event Center", purpose: "Community events, conferences, entertainment, and large-scale public venue operations.", funds: "Event Center/enterprise or General Fund support; verify source", adoptedBudget: "Pending extraction", actualSpending: "Pending extraction", status: "Official department", statusClass: "tag tag--amber", nextStep: "Determine whether activity is fee-supported, subsidized, or mixed." },
      { name: "Neighborhood Services", purpose: "Housing programs, neighborhood support, community services, and resident assistance.", funds: "General Fund; grants may apply", adoptedBudget: "Pending extraction", actualSpending: "Pending extraction", status: "Official department", statusClass: "tag tag--amber", nextStep: "Identify grant-funded lines and separate restricted dollars." },
      { name: "Office of Management & Budget", purpose: "Annual budget development, financial planning, management analysis, and resource alignment.", funds: "General Fund", adoptedBudget: "Pending extraction", actualSpending: "Pending extraction", status: "Official department", statusClass: "tag tag--amber", nextStep: "Extract OMB budget and connect to quarterly reports." },
      { name: "Office of Solid Waste", purpose: "Waste collection, recycling, disposal service administration, and related operations.", funds: "Solid Waste operating fund; fees/contracts likely apply", adoptedBudget: "Pending extraction", actualSpending: "Pending extraction", status: "Official department", statusClass: "tag tag--amber", nextStep: "Extract fund activity and identify contracted service payments." },
      { name: "Parks & Recreation", purpose: "Parks, recreation programs, facilities, sports, grounds, and community events.", funds: "General Fund; Golf Course and capital funds may apply", adoptedBudget: "Pending extraction", actualSpending: "Pending extraction", status: "Official department", statusClass: "tag tag--amber", nextStep: "Separate operating costs from capital park projects and golf activity." },
      { name: "Planning & Zoning", purpose: "Growth management, land-use planning, zoning review, development review, and long-range planning.", funds: "General Fund; development-review revenues may apply", adoptedBudget: "Pending extraction", actualSpending: "Pending extraction", status: "Official department", statusClass: "tag tag--amber", nextStep: "Confirm department grouping and map review-related fees." },
      { name: "Police", purpose: "Law enforcement, patrol, investigations, crime prevention, and community policing.", funds: "General Fund; grants and capital may apply", adoptedBudget: "Pending extraction", actualSpending: "Pending extraction", status: "Official department", statusClass: "tag tag--amber", nextStep: "Extract police budget schedules and reconcile to year-end actuals." },
      { name: "Procurement", purpose: "Purchasing, solicitations, vendor processes, contracts support, and procurement policy.", funds: "General Fund; procurement records", adoptedBudget: "Pending extraction", actualSpending: "Pending extraction", status: "Official department", statusClass: "tag tag--amber", nextStep: "Link department cost lines to solicitations, contracts, and vendor records." },
      { name: "Public Works", purpose: "Roads, stormwater, facilities, engineering, traffic, construction, and infrastructure maintenance.", funds: "General Fund; Road & Bridge; Stormwater; capital funds may apply", adoptedBudget: "Pending extraction", actualSpending: "Pending extraction", status: "Official department", statusClass: "tag tag--amber", nextStep: "Map department lines across operating and capital funds." },
      { name: "Risk Management", purpose: "Insurance, liability, safety programs, asset protection, workers' compensation, and compliance.", funds: "General Fund or internal service funds; verify source", adoptedBudget: "Pending extraction", actualSpending: "Pending extraction", status: "Official department", statusClass: "tag tag--amber", nextStep: "Separate administrative risk costs from claims and insurance activity." },
      { name: "Special Events", purpose: "Citywide festivals, ceremonies, community events, sponsorships, and event delivery.", funds: "General Fund; event revenue/sponsorships may apply", adoptedBudget: "Pending extraction", actualSpending: "Pending extraction", status: "Official department", statusClass: "tag tag--amber", nextStep: "Identify event costs, sponsorship revenue, and direct City support." },
      { name: "Utility Systems", purpose: "Water, wastewater, utility operations, maintenance, infrastructure, and customer service.", funds: "Utility Systems enterprise fund; not interchangeable with General Fund taxes", adoptedBudget: "Pending extraction", actualSpending: "Pending extraction", status: "Official department", statusClass: "tag tag--amber", nextStep: "Reconcile enterprise-fund activity to department operating lines." },
      { name: "Fire services / emergency response", purpose: "Emergency response costs residents may ask about, including any City-paid support or transfers.", funds: "Separate jurisdiction check required", adoptedBudget: "Pending jurisdiction check", actualSpending: "Pending jurisdiction check", status: "Jurisdiction check", statusClass: "tag tag--amber", nextStep: "Confirm what belongs to the City versus St. Lucie County Fire District before publishing." }
    ]
  },
  controlTrace: {
    fiscalYear: "FY 2024-25",
    title: "Control Total Trace",
    summary: "The positive-stop reconciliation layer for FY 2024-25. CivicLens captures official control totals first, then traces source rows, departments, vendors, contracts, and payments until mapped detail ties back to the official number or the gap is visible.",
    sourceUrl: "https://www.cityofpsl.com/files/assets/public/v/1/departments/office-of-management-amp-budget/documents/fy-24-25-4th-quarter-statement-of-revenues-and-expenditures.pdf",
    metrics: [
      { label: "Revenue control", value: "$446.7M", note: "Eight Q4 operating-fund totals captured", icon: "IN", tone: "dark" },
      { label: "Spending control", value: "$431.5M", note: "Eight Q4 operating-fund totals captured", icon: "OUT" },
      { label: "Fund tie-outs", value: "16/16", note: "Revenue and spending controls captured from Q4 report", icon: "TIE" },
      { label: "Deep trace status", value: "Partial", note: "Department, vendor, payroll, and invoice detail still needed", icon: "GAP" }
    ],
    rows: [
      { fund: "General Fund", type: "Revenue", controlTotal: "$191,998,152", mappedTotal: "$191,998,152", variance: "$0", status: "Control captured", statusClass: "tag tag--green", source: "Q4 statement, page 1", nextStep: "Break revenue into taxes, permits, intergovernmental, charges, fines, miscellaneous, and transfers." },
      { fund: "General Fund", type: "Expenditures", controlTotal: "$208,680,698", mappedTotal: "$208,680,698", variance: "$0", status: "Control captured", statusClass: "tag tag--green", source: "Q4 statement, page 1", nextStep: "Tie departments, payroll, vendors, capital outlay, debt, and non-operating transfers back to this total." },
      { fund: "Road & Bridge Fund", type: "Revenue", controlTotal: "$22,981,347", mappedTotal: "$22,981,347", variance: "$0", status: "Control captured", statusClass: "tag tag--green", source: "Q4 statement, page 3", nextStep: "Separate taxes, intergovernmental revenue, service charges, and transfers." },
      { fund: "Road & Bridge Fund", type: "Expenditures", controlTotal: "$21,020,152", mappedTotal: "$21,020,152", variance: "$0", status: "Control captured", statusClass: "tag tag--green", source: "Q4 statement, page 3", nextStep: "Map operating, personnel, capital, debt, and transfer detail." },
      { fund: "Solid Waste Operating Fund", type: "Revenue", controlTotal: "$3,850,906", mappedTotal: "$3,850,906", variance: "$0", status: "Control captured", statusClass: "tag tag--green", source: "Q4 statement, page 4", nextStep: "Confirm fee-supported revenue and contract/payment records." },
      { fund: "Solid Waste Operating Fund", type: "Expenditures", controlTotal: "$3,573,810", mappedTotal: "$3,573,810", variance: "$0", status: "Control captured", statusClass: "tag tag--green", source: "Q4 statement, page 4", nextStep: "Tie spending to collection contracts, administration, and service costs." },
      { fund: "Building Fund", type: "Revenue", controlTotal: "$17,216,438", mappedTotal: "$17,216,438", variance: "$0", status: "Control captured", statusClass: "tag tag--green", source: "Q4 statement, page 5", nextStep: "Separate permit revenue, fines, interest, reserves, and other sources." },
      { fund: "Building Fund", type: "Expenditures", controlTotal: "$22,977,600", mappedTotal: "$22,977,600", variance: "$0", status: "Control captured", statusClass: "tag tag--green", source: "Q4 statement, page 5", nextStep: "Explain capital outlay and reserve use, including Peacock Building acquisition note." },
      { fund: "Stormwater Fund", type: "Revenue", controlTotal: "$37,008,749", mappedTotal: "$37,008,749", variance: "$0", status: "Control captured", statusClass: "tag tag--green", source: "Q4 statement, page 6", nextStep: "Trace service charges, grants, reserves, and interfund transfers." },
      { fund: "Stormwater Fund", type: "Expenditures", controlTotal: "$31,295,844", mappedTotal: "$31,295,844", variance: "$0", status: "Control captured", statusClass: "tag tag--green", source: "Q4 statement, page 6", nextStep: "Map drainage operations, capital outlay, debt, and non-operating transfers." },
      { fund: "Utility Systems Fund", type: "Revenue", controlTotal: "$135,116,530", mappedTotal: "$135,116,530", variance: "$0", status: "Control captured", statusClass: "tag tag--green", source: "Q4 statement, page 8", nextStep: "Keep enterprise utility revenue separate from citywide taxes." },
      { fund: "Utility Systems Fund", type: "Expenditures", controlTotal: "$105,332,671", mappedTotal: "$105,332,671", variance: "$0", status: "Control captured", statusClass: "tag tag--green", source: "Q4 statement, page 8", nextStep: "Trace utility operations, debt interest, capital outlay, and transfers." },
      { fund: "Golf Course Fund", type: "Revenue", controlTotal: "$3,601,698", mappedTotal: "$3,601,698", variance: "$0", status: "Control captured", statusClass: "tag tag--green", source: "Q4 statement, page 10", nextStep: "Trace charges for services, miscellaneous revenue, and transfers." },
      { fund: "Golf Course Fund", type: "Expenditures", controlTotal: "$3,244,781", mappedTotal: "$3,244,781", variance: "$0", status: "Control captured", statusClass: "tag tag--green", source: "Q4 statement, page 10", nextStep: "Map personnel, operating, capital, and non-operating costs." },
      { fund: "Medical Insurance Fund", type: "Revenue", controlTotal: "$34,909,396", mappedTotal: "$34,909,396", variance: "$0", status: "Control captured", statusClass: "tag tag--green", source: "Q4 statement, page 11", nextStep: "Keep internal-service health insurance activity separate from resident tax revenue." },
      { fund: "Medical Insurance Fund", type: "Expenditures", controlTotal: "$35,342,962", mappedTotal: "$35,342,962", variance: "$0", status: "Control captured", statusClass: "tag tag--green", source: "Q4 statement, page 11", nextStep: "Trace claims, administrative costs, reserves, and internal-service activity." }
    ],
    gaps: [
      { title: "Citywide funds not complete", detail: "The current control trace covers eight operating funds only. Capital, debt, CRA, grant, assessment, and other funds still need control totals." },
      { title: "Department trace pending", detail: "The department registry is live, but department adopted, amended, and actual totals have not yet been tied back to these controls." },
      { title: "Transaction detail missing", detail: "Vendor payments, check registers, purchase orders, payroll summaries, contracts, and invoices are still needed for dollar-level tracing." },
      { title: "Audit cross-check pending", detail: "The FY 2025 ACFR should be uploaded and used to reconcile Q4 unaudited totals against audited year-end reporting." }
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
    officials: {
      title: "How can public officials use CivicLens?",
      intro: "CivicLens gives public officials and residents a shared factual record for following taxpayer dollars through official records.",
      explanation: "The current Port St. Lucie pilot demonstrates the evidence model: one sourced operating-funds report, a source registry, a department spending tracker, and a private Evidence Vault for preserving records before public claims are made. It is intentionally careful about scope so the tool builds trust instead of overstating what the data proves.",
      facts: [
        ["What works now", "A public dashboard, source-backed operating-funds snapshot, department tracking scaffold, source registry, and secure Evidence Vault."],
        ["Why it matters", "It can reduce confusion around budgets by showing the source, calculation path, and unresolved gaps behind each public claim."],
        ["Best feedback to ask for", "Which records, agencies, spending categories, and public questions should CivicLens prioritize next?"]
      ]
    },
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
      intro: "CivicLens now includes the official City department registry, but it is not publishing department totals until each department is mapped to official budget and funding-source records.",
      explanation: "The tracker lists the City departments residents need to follow, then keeps the dollar fields pending until adopted budget, amended budget, actual spending, contracts, and payment records are extracted and reconciled. It also separates likely tax-supported departments from fee, enterprise, grant, CRA, and jurisdiction-check items until the budget proves the funding source.",
      facts: [
        ["What is live", "The official Port St. Lucie department registry, funding-source notes, evidence status, and extraction queue."],
        ["What is not live yet", "Verified tax-supported totals, department budget-to-actual amounts, vendor-level spending, invoice-level detail, and citywide reconciliation."],
        ["Publication rule", "No department spending number should be displayed until CivicLens can point to the official source and calculation path."]
      ]
    },
    controlTrace: {
      title: "What is the control total trace?",
      intro: "The control total trace is CivicLens's positive-stop reconciliation system for FY 2024-25.",
      explanation: "CivicLens captures official revenue and spending totals first, then requires extracted department, vendor, payroll, contract, invoice, and project detail to add back to those totals. If the mapped detail does not tie out, the difference becomes a visible gap instead of a hidden assumption.",
      facts: [
        ["Current control set", "Eight FY 2024-25 operating-fund revenue and expenditure totals from the City Q4 statement."],
        ["What it proves", "The official fund-level control rows are captured and ready to receive detailed mapping."],
        ["What remains", "Department, vendor, payroll, invoice, capital, debt, CRA, grant, and other citywide control totals still need reconciliation."]
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
