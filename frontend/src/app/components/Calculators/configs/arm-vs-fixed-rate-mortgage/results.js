export const results = [
  {
    key: 'fixedMonthlyPayment',
    label: 'Fixed-rate monthly payment',
    format: 'currency',
    description: 'Monthly principal and interest payment (stays the same)'
  },
  {
    key: 'armInitialMonthlyPayment',
    label: 'ARM initial monthly payment',
    format: 'currency',
    description: 'Initial monthly payment before adjustments'
  },
  {
    key: 'initialSavings',
    label: 'Initial monthly savings with ARM',
    format: 'currency',
    description: 'How much you save per month initially with the ARM'
  },
  {
    key: 'fixedTotalInterest',
    label: 'Fixed-rate total interest',
    format: 'currency',
    description: 'Total interest paid over the life of the fixed-rate loan'
  },
  {
    key: 'armTotalInterest',
    label: 'ARM total interest',
    format: 'currency',
    description: 'Estimated total interest with expected adjustments'
  },
  {
    key: 'totalInterestDifference',
    label: 'Interest difference (ARM vs Fixed)',
    format: 'currency',
    description: 'Total interest savings or cost with ARM (negative = ARM costs more)'
  },
  {
    key: 'armFinalRate',
    label: 'ARM final rate estimate',
    format: 'percentage',
    description: 'Estimated final interest rate for ARM (subject to cap)'
  },
  {
    key: 'armMaxMonthlyPayment',
    label: 'ARM maximum monthly payment',
    format: 'currency',
    description: 'Highest possible payment if rate reaches the cap'
  },
  {
    key: 'betterChoice',
    label: 'Better choice',
    format: 'text',
    description: 'Based on total interest paid'
  },
];