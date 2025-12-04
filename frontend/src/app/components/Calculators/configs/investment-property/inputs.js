export const inputs = [
  // Property address
  { 
    name: 'propertyAddress', 
    label: 'Property address', 
    type: 'text',
    section: 'Property Information',
    hint: 'Address of the investment property' 
  },
  
  // Property information
  { 
    name: 'purchasePrice', 
    label: 'Purchase Price', 
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Property Information',
    hint: 'Total purchase price of the investment property' 
  },
  { 
    name: 'cashInvested', 
    label: 'Cash Invested', 
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Property Information',
    hint: 'The cash amount out of pocket required for the purchase of this property' 
  },
  
  // Property Information section
  { 
    name: 'landValue', 
    label: 'Land Value', 
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Property Information',
    hint: 'The approximate value of the land that the property sits on. You cannot depreciate land value' 
  },
  { 
    name: 'personalProperty', 
    label: 'Personal Property', 
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Property Information',
    hint: 'Washer/dryer, range, refrigerator, lawn equipment, fixtures and other' 
  },
  // Building Value - CALCULATED (purchasePrice - landValue)
  
  { 
    name: 'annualRent', 
    label: 'Annual Rent', 
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Property Information',
    hint: 'Total annual rental income' 
  },
  { 
    name: 'vacancy', 
    label: 'Vacancy', 
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Property Information',
    hint: 'Expected vacancy loss in dollars' 
  },
  { 
    name: 'personalPropertyDepRate', 
    label: 'Personal property depreciation rate', 
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    section: 'Property Information',
    hint: 'The rate annually you can depreciate on the personal property' 
  },
  { 
    name: 'buildingDepRate', 
    label: 'Building depreciation rate', 
    type: 'number',
    format: 'percentage',
    step: 0.001,
    required: true,
    section: 'Property Information',
    hint: 'Annual depreciation rate for building value' 
  },
  // Personal property depreciation - CALCULATED
  // Building depreciation - CALCULATED
  // Total depreciation - CALCULATED
  
  // Financing the Purchase - Loan 1
  { 
    name: 'loan1Amount', 
    label: 'Loan 1 Amount', 
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Financing the Purchase',
    hint: 'First loan amount' 
  },
  { 
    name: 'interestRate1', 
    label: 'Interest Rate 1', 
    type: 'number',
    format: 'percentage',
    step: 0.01,
    required: true,
    section: 'Financing the Purchase',
    hint: 'Interest rate for first loan' 
  },
  { 
    name: 'termInMonths1', 
    label: 'Term in Months', 
    type: 'number',
    required: true,
    section: 'Financing the Purchase',
    hint: 'Loan term in months for first loan' 
  },
  { 
    name: 'interestOnly1', 
    label: 'Interest only', 
    type: 'checkbox',
    section: 'Financing the Purchase',
    hint: 'Check here for an interest only loan' 
  },
  // Principal and Interest 1 - CALCULATED
  
  // Financing the Purchase - Loan 2
  { 
    name: 'loan2Amount', 
    label: 'Loan 2 Amount', 
    type: 'number',
    format: 'currency',
    section: 'Financing the Purchase',
    hint: 'Second loan amount (optional)' 
  },
  { 
    name: 'interestRate2', 
    label: 'Interest Rate 2', 
    type: 'number',
    format: 'percentage',
    step: 0.01,
    section: 'Financing the Purchase',
    hint: 'Interest rate for second loan' 
  },
  { 
    name: 'termInMonths2', 
    label: 'Term in Months', 
    type: 'number',
    section: 'Financing the Purchase',
    hint: 'Loan term in months for second loan' 
  },
  { 
    name: 'interestOnly2', 
    label: 'Interest only', 
    type: 'checkbox',
    section: 'Financing the Purchase',
    hint: 'Check here for an interest only loan' 
  },
  // Principal and Interest 2 - CALCULATED
  
  // Annual Expenses
  { 
    name: 'realEstateTaxes', 
    label: 'Real Estate Taxes', 
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Annual Expenses',
    hint: 'Annual property taxes' 
  },
  { 
    name: 'utilities', 
    label: 'Utilities', 
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Annual Expenses',
    hint: 'Annual utility costs' 
  },
  { 
    name: 'insurance', 
    label: 'Insurance', 
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Annual Expenses',
    hint: 'Annual property insurance' 
  },
  { 
    name: 'maintenanceRepairs', 
    label: 'Maintenance/Repairs', 
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Annual Expenses',
    hint: 'Annual maintenance and repairs' 
  },
  { 
    name: 'advertising', 
    label: 'Advertising', 
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Annual Expenses',
    hint: 'Annual advertising costs' 
  },
  { 
    name: 'adminLegal', 
    label: 'Admin/Legal', 
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Annual Expenses',
    hint: 'Annual administrative and legal costs' 
  },
  { 
    name: 'supplies', 
    label: 'Supplies', 
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Annual Expenses',
    hint: 'Annual supplies' 
  },
  { 
    name: 'propertyMgmtExpense', 
    label: 'Property management expense', 
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    section: 'Annual Expenses',
    hint: 'Percentage of gross income paid for property management' 
  },
  { 
    name: 'miscellaneous', 
    label: 'Miscellaneous', 
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Annual Expenses',
    hint: 'Other miscellaneous annual expenses' 
  },
  // Total operating expense - CALCULATED
  // Operating expense ratio - CALCULATED
  
  // Analysis of Operating and Investment Results
  { 
    name: 'taxBracket', 
    label: 'Tax bracket', 
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    section: 'Analysis of Operating and Investment Results',
    hint: 'Your marginal income tax rate' 
  },
  { 
    name: 'appreciationRate', 
    label: 'Appreciation rate', 
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    section: 'Analysis of Operating and Investment Results',
    hint: 'The amount the property is appreciating on an annual basis' 
  },
  { 
    name: 'costOfCapital', 
    label: 'Cost of capital for NPV', 
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    section: 'Analysis of Operating and Investment Results',
    hint: 'The rate of return used to calculate the net present value of cash flows' 
  },
  // Net operating income - CALCULATED
  // Annual debt service - CALCULATED
  // Debt service ratio - CALCULATED
  // Cash flow before tax - CALCULATED
  // Taxable income - CALCULATED
  // Cash flow after-tax - CALCULATED
  // ROI with appreciation - CALCULATED
  // ROI without appreciation - CALCULATED
  // Cap rate - CALCULATED
  // Cash on cash - CALCULATED
];