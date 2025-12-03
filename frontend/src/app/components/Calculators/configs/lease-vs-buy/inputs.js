export const inputs = [
  // ===== Common Fields =====
  { 
    name: 'purchasePrice', 
    label: 'Purchase Price', 
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Vehicle Information',
    hint: 'Total purchase price (after any manufacturer\'s rebate)' 
  },
  { 
    name: 'downPayment', 
    label: 'Down Payment / Capital Reduction', 
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Vehicle Information',
    hint: 'Amount paid upfront (for leases, this is often called capital reduction)' 
  },
  { 
    name: 'salesTaxRate', 
    label: 'Sales Tax Rate', 
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    section: 'Vehicle Information',
    hint: 'Sales tax is included in each lease payment. For buying, it\'s charged on the total sale amount.' 
  },
  { 
    name: 'investmentReturnRate', 
    label: 'Investment Rate of Return', 
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    section: 'Vehicle Information',
    hint: 'Expected annual return if you invest your down payment instead' 
  },
  
  // ===== Buy Option =====
  { 
    name: 'loanTermMonths', 
    label: 'Loan Term (Months)', 
    type: 'number',
    required: true,
    section: 'Buy Option',
    hint: 'Typical terms are 36, 48, 60, or 72 months' 
  },
  { 
    name: 'loanInterestRate', 
    label: 'Loan Interest Rate', 
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    section: 'Buy Option',
    hint: 'Annual interest rate for your auto loan' 
  },
  { 
    name: 'buyOtherFees', 
    label: 'Other Fees (Buy)', 
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Buy Option',
    hint: 'License, title transfer fees, etc. paid at time of purchase' 
  },
  { 
    name: 'annualDepreciationRate', 
    label: 'Annual Depreciation Rate', 
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    section: 'Buy Option',
    hint: 'High: 20%, Medium: 15%, Low: 10%' 
  },
  
  // ===== Lease Option =====
  { 
    name: 'leaseTermMonths', 
    label: 'Lease Term (Months)', 
    type: 'number',
    required: true,
    section: 'Lease Option',
    hint: 'Term in months for your auto lease' 
  },
  { 
    name: 'leaseInterestRate', 
    label: 'Lease Interest Rate', 
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    section: 'Lease Option',
    hint: 'Annual interest rate (money factor × 2400) for your lease' 
  },
  { 
    name: 'leaseOtherFees', 
    label: 'Other Fees (Lease)', 
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Lease Option',
    hint: 'License, title transfer fees, etc. paid at close of lease' 
  },
  { 
    name: 'residualPercent', 
    label: 'Residual Value (%)', 
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    section: 'Lease Option',
    hint: 'Remaining value after lease term expires. Higher = lower lease payment' 
  },
  { 
    name: 'securityDeposit', 
    label: 'Security Deposit', 
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Lease Option',
    hint: 'Refundable security deposit required at time of lease' 
  },
];