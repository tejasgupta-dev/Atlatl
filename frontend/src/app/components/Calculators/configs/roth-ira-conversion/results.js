export const results = [
  {
    key: 'taxableAmount',
    label: 'Taxable amount of conversion',
    format: 'currency',
    description: 'Amount subject to income tax (conversion amount minus non-deductible contributions)'
  },
  {
    key: 'conversionTaxes',
    label: 'Taxes owed on conversion',
    format: 'currency',
    description: 'Income tax due on the conversion at your current tax rate'
  },
  {
    key: 'rothBalanceAtRetirement',
    label: 'Roth IRA balance at retirement',
    format: 'currency',
    description: 'Total Roth IRA value at retirement (tax-free withdrawals)'
  },
  {
    key: 'traditionalBalanceAtRetirement',
    label: 'Traditional IRA balance at retirement',
    format: 'currency',
    description: 'Total traditional IRA value at retirement if not converted (before taxes)'
  },
  {
    key: 'traditionalAfterTax',
    label: 'Traditional IRA after-tax value',
    format: 'currency',
    description: 'Traditional IRA value after paying retirement taxes'
  },
  {
    key: 'taxableInvestmentBalance',
    label: 'Taxable investment balance',
    format: 'currency',
    description: 'Value of investing the conversion taxes in a taxable account'
  },
  {
    key: 'taxableInvestmentAfterTax',
    label: 'Taxable investment after-tax value',
    format: 'currency',
    description: 'After-tax value of the taxable investment account'
  },
  {
    key: 'traditionalPlusTaxableInvestment',
    label: 'Traditional IRA + taxable investment',
    format: 'currency',
    description: 'Combined after-tax value if you don\'t convert'
  },
  {
    key: 'conversionAdvantage',
    label: 'Roth conversion advantage',
    format: 'currency',
    description: 'Additional after-tax value from converting to Roth IRA'
  },
  {
    key: 'conversionAdvantagePercent',
    label: 'Advantage percentage',
    format: 'percentage',
    description: 'Percentage advantage of converting'
  },
  {
    key: 'betterChoice',
    label: 'Better choice',
    format: 'text',
    description: 'Whether to convert or keep traditional IRA'
  },
  {
    key: 'yearsToRetirement',
    label: 'Years to retirement',
    format: 'number'
  },
];