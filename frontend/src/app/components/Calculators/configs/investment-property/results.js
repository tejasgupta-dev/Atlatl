export const results = [
  // Property Information calculated fields (shown inline in that section)
  { 
    key: 'buildingValue', 
    label: 'Building Value', 
    format: 'currency',
    description: 'Purchase price minus land value',
    section: 'Property Information',
    readonly: true
  },
  { 
    key: 'personalPropertyDepreciation', 
    label: 'Personal property depreciation', 
    format: 'currency',
    description: 'Annual depreciation on personal property',
    section: 'Property Information',
    readonly: true
  },
  { 
    key: 'buildingDepreciation', 
    label: 'Building depreciation', 
    format: 'currency',
    description: 'Annual depreciation on building',
    section: 'Property Information',
    readonly: true
  },
  { 
    key: 'totalDepreciation', 
    label: 'Total depreciation', 
    format: 'currency',
    description: 'Total annual depreciation',
    section: 'Property Information',
    readonly: true
  },
  
  // Financing calculated fields (shown inline in that section)
  { 
    key: 'principalAndInterest1', 
    label: 'Principal and Interest', 
    format: 'currency',
    description: 'Monthly payment for loan 1',
    section: 'Financing the Purchase',
    readonly: true
  },
  { 
    key: 'principalAndInterest2', 
    label: 'Principal and Interest', 
    format: 'currency',
    description: 'Monthly payment for loan 2',
    section: 'Financing the Purchase',
    readonly: true
  },
  
  // Annual Expenses calculated fields (shown inline in that section)
  { 
    key: 'totalOperatingExpense', 
    label: 'Total operating expense', 
    format: 'currency',
    description: 'Total annual operating expenses',
    section: 'Annual Expenses',
    readonly: true
  },
  { 
    key: 'operatingExpenseRatio', 
    label: 'Operating expense ratio', 
    format: 'percentage',
    description: "Percentage based on income, 23-30% is considered average",
    section: 'Annual Expenses',
    readonly: true
  },
  
  // Analysis results (shown inline in Analysis section)
  { 
    key: 'netOperatingIncome', 
    label: 'Net operating income', 
    format: 'currency',
    description: 'Income after operating expenses',
    section: 'Analysis of Operating and Investment Results',
    readonly: true
  },
  { 
    key: 'annualDebtService', 
    label: 'Annual debt service', 
    format: 'currency',
    description: 'Total annual loan payments',
    section: 'Analysis of Operating and Investment Results',
    readonly: true
  },
  { 
    key: 'debtServiceRatio', 
    label: 'Debt service ratio', 
    format: 'percentage',
    description: 'Net operating income divided by annual debt service (DSCR)',
    section: 'Analysis of Operating and Investment Results',
    readonly: true
  },
  { 
    key: 'cashFlowBeforeTax', 
    label: 'Cash flow before tax', 
    format: 'currency',
    description: "What's left after expenses and debt service",
    section: 'Analysis of Operating and Investment Results',
    readonly: true
  },
  { 
    key: 'taxableIncome', 
    label: 'Taxable income', 
    format: 'currency',
    description: 'Income subject to taxation',
    section: 'Analysis of Operating and Investment Results',
    readonly: true
  },
  { 
    key: 'cashFlowAfterTax', 
    label: 'Cash flow after-tax', 
    format: 'currency',
    description: 'Net cash flow after taxes',
    section: 'Analysis of Operating and Investment Results',
    readonly: true
  },
  { 
    key: 'roiWithAppreciation', 
    label: 'ROI with appreciation', 
    format: 'percentage',
    description: 'Return on investment including appreciation',
    section: 'Analysis of Operating and Investment Results',
    readonly: true
  },
  { 
    key: 'roiWithoutAppreciation', 
    label: 'ROI without appreciation', 
    format: 'percentage',
    description: 'Return on investment excluding appreciation',
    section: 'Analysis of Operating and Investment Results',
    readonly: true
  },
  { 
    key: 'capRate', 
    label: 'Cap rate', 
    format: 'percentage',
    description: 'Net operating income divided by purchase price',
    section: 'Analysis of Operating and Investment Results',
    readonly: true
  },
  { 
    key: 'cashOnCash', 
    label: 'Cash on cash', 
    format: 'percentage',
    description: 'Cash flow before tax divided by cash invested',
    section: 'Analysis of Operating and Investment Results',
    readonly: true
  },
];