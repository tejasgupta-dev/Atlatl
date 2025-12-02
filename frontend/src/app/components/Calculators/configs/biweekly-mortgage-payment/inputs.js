export const inputs = [
  { 
    name: 'mortgageAmount', 
    label: 'Mortgage Amount', 
    type: 'number',
    format: 'currency',
    required: true, 
    hint: 'The total dollar amount for this mortgage' 
  },
  { 
    name: 'interestRate', 
    label: 'Interest Rate', 
    type: 'number',
    format: 'percentage',
    step: 0.01, 
    required: true,
    hint: 'The interest rate on this mortgage' 
  },
  { 
    name: 'originalTermYears', 
    label: 'Original Mortgage Term (Years)', 
    type: 'number',
    required: true,
    hint: 'Number of years over which you would repay this loan with normal monthly payments (typically 15 or 30 years)' 
  },
  { 
    name: 'firstPaymentDate', 
    label: 'First Payment Date', 
    type: 'date',
    required: true,
    hint: 'The date your mortgage started (used to calculate remaining time and balance)' 
  },
  { 
    name: 'monthlyEscrow', 
    label: 'Monthly Escrow Amount (Optional)', 
    type: 'number',
    format: 'currency',
    hint: 'Monthly escrow amount if applicable. With biweekly payments, 1/2 of this amount will be paid every two weeks' 
  },
  { 
    name: 'monthlyPrepayment', 
    label: 'Monthly Prepayment Amount (Optional)', 
    type: 'number',
    format: 'currency',
    hint: 'Additional monthly prepayment amount. With biweekly payments, 1/2 of this amount will be debited every two weeks' 
  },
];