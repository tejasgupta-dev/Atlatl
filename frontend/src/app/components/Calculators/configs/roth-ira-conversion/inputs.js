export const inputs = [
  {
    name: 'amountToConvert',
    label: 'Amount to convert',
    type: 'number',
    format: 'currency',
    required: true,
    hint: 'Amount to convert from a traditional IRA to a Roth IRA. Assumes taxes are paid with funds outside the account.'
  },
  {
    name: 'nonDeductibleContributions',
    label: 'Non-deductible contributions',
    type: 'number',
    format: 'currency',
    required: true,
    hint: 'After-tax contributions made to your traditional IRA. These are not taxed again on conversion.'
  },
  {
    name: 'currentAge',
    label: 'Current age',
    type: 'number',
    required: true,
    hint: 'Your current age (must be less than 72 as this calculator does not account for RMDs)'
  },
  {
    name: 'retirementAge',
    label: 'Age at retirement',
    type: 'number',
    required: true,
    hint: 'Age you wish to retire'
  },
  {
    name: 'rateOfReturn',
    label: 'Rate of return',
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    hint: 'Expected annual rate of return for your IRA (compounded annually)'
  },
  {
    name: 'currentTaxRate',
    label: 'Current tax rate',
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    hint: 'Current marginal income tax rate that will apply to the conversion amount'
  },
  {
    name: 'retirementTaxRate',
    label: 'Tax rate at retirement',
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    hint: 'Expected marginal income tax rate at retirement'
  },
  {
    name: 'investmentTaxRate',
    label: 'Investment tax rate',
    type: 'number',
    format: 'percentage',
    step: 0.1,
    required: true,
    hint: 'Expected tax rate on taxable investments (typically long-term capital gains rate)'
  },
];