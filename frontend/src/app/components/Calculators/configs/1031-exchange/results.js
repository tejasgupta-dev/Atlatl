export const results = [
  { 
    key: 'exchangeQualifies', 
    label: 'Exchange Status', 
    format: 'text',
    description: 'Whether the exchange qualifies for full tax deferral'
  },
  { 
    key: 'daysToComplete', 
    label: 'Days Between Sale and Purchase', 
    format: 'number',
    description: 'Must be ≤180 days to qualify'
  },
  { 
    key: 'netSale', 
    label: 'Net Sale for Property Sold', 
    format: 'currency',
    description: 'Sales price minus sales costs and fees'
  },
  { 
    key: 'netCashReceived', 
    label: 'Net Cash Received', 
    format: 'currency',
    description: 'Cash available for reinvestment (must all be reinvested to avoid tax)'
  },
  { 
    key: 'netCostPurchased', 
    label: 'Net Cost for Property Purchased', 
    format: 'currency',
    description: 'Purchase price plus purchase costs'
  },
  { 
    key: 'netCashReinvested', 
    label: 'Net Cash Reinvested', 
    format: 'currency',
    description: 'Cash reinvested in replacement property'
  },
  { 
    key: 'totalGain', 
    label: 'Total Gain on Sale', 
    format: 'currency',
    description: 'Total gain if no 1031 exchange (Net Sale - Adjusted Basis)'
  },
  { 
    key: 'recognizedGain', 
    label: 'Recognized Gain (Boot)', 
    format: 'currency',
    description: 'Taxable gain due to trading down or taking cash out'
  },
  { 
    key: 'deferredGain', 
    label: 'Deferred Gain', 
    format: 'currency',
    description: 'Capital gains deferred through the 1031 exchange'
  },
  { 
    key: 'newBasis', 
    label: 'Basis of Replacement Property', 
    format: 'currency',
    description: 'New adjusted basis for replacement property'
  },
];