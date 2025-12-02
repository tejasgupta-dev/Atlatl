export const inputs = [
  {
    name: 'mortgageAmount',
    label: 'Mortgage amount',
    type: 'number',
    format: 'currency',
    required: true,
    hint: 'Original or expected balance for your mortgage'
  },
  {
    name: 'termInYears',
    label: 'Term in years',
    type: 'number',
    required: true,
    hint: 'Number of years to repay the loan (common terms: 15, 20, 30 years)'
  },
  {
    name: 'fixedInterestRate',
    label: 'Fixed-rate interest rate',
    type: 'number',
    format: 'percentage',
    step: 0.01,
    required: true,
    hint: 'Annual interest rate for the fixed-rate mortgage'
  },
  {
    name: 'armInterestRate',
    label: 'ARM initial interest rate',
    type: 'number',
    format: 'percentage',
    step: 0.01,
    required: true,
    hint: 'Initial interest rate for the ARM (typically lower than fixed-rate)'
  },
  {
    name: 'monthsRateFixed',
    label: 'Months rate fixed',
    type: 'number',
    required: true,
    hint: 'Number of months the ARM rate remains fixed before adjusting'
  },
  {
    name: 'expectedAdjustment',
    label: 'Expected adjustment',
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    hint: 'Expected annual rate change after fixed period (-3% to +3%)'
  },
  {
    name: 'monthsBetweenAdjustments',
    label: 'Months between adjustments',
    type: 'number',
    required: true,
    hint: 'Number of months between rate adjustments (12 = annual, 6 = semi-annual)'
  },
  {
    name: 'interestRateCap',
    label: 'Interest rate cap',
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    hint: 'Maximum allowable interest rate for the ARM'
  },
];