export const results = [
  { 
    key: 'monthlyPayment', 
    label: 'Monthly Principal & Interest Payment', 
    format: 'currency',
    description: 'Your standard monthly mortgage payment (principal and interest only)'
  },
  { 
    key: 'biweeklyPayment', 
    label: 'Biweekly Payment Amount', 
    format: 'currency',
    description: 'Amount paid every two weeks (1/2 of monthly payment)'
  },
  { 
    key: 'currentBalance', 
    label: 'Current Remaining Balance', 
    format: 'currency',
    description: 'Outstanding principal balance as of today'
  },
  { 
    key: 'remainingMonthlyPayments', 
    label: 'Remaining Payments (Monthly)', 
    format: 'number',
    description: 'Number of monthly payments remaining on original schedule'
  },
  { 
    key: 'remainingBiweeklyPayments', 
    label: 'Remaining Payments (Biweekly)', 
    format: 'number',
    description: 'Number of biweekly payments remaining with biweekly plan'
  },
  { 
    key: 'monthlyInterestPaid', 
    label: 'Interest Paid (Monthly Schedule)', 
    format: 'currency',
    description: 'Total interest you will pay if you continue monthly payments'
  },
  { 
    key: 'biweeklyInterestPaid', 
    label: 'Interest Paid (Biweekly Schedule)', 
    format: 'currency',
    description: 'Total interest you will pay with biweekly payments'
  },
  { 
    key: 'interestSavings', 
    label: 'Interest Savings', 
    format: 'currency',
    description: 'Total interest saved by switching to biweekly payments'
  },
  { 
    key: 'timeSavedYears', 
    label: 'Time Saved (Years)', 
    format: 'number',
    description: 'Years saved by paying biweekly instead of monthly'
  },
];