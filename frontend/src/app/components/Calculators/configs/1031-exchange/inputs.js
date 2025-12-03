export const inputs = [
  // Dates and Description
  { 
    name: 'dateOfSale', 
    label: 'Date of Sale', 
    type: 'date',
    section: 'Exchange Timeline',
    hint: 'Date the investment real estate will be sold' 
  },
  { 
    name: 'dateOfPurchase', 
    label: 'Date of Purchase', 
    type: 'date',
    section: 'Exchange Timeline',
    hint: 'Exchange must be completed within 180 days from date of sale' 
  },
  { 
    name: 'description', 
    label: 'Description of Property (Optional)', 
    type: 'text',
    section: 'Exchange Timeline',
    hint: 'Brief description of the property involved in this exchange' 
  },

  // Property Being Sold
  { 
    name: 'adjustedBasis', 
    label: 'Adjusted Cost Basis', 
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Property Being Sold',
    hint: 'The adjusted basis of investment real estate being sold' 
  },
  { 
    name: 'salesPrice', 
    label: 'Sales Price', 
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Property Being Sold',
    hint: 'Contracted sales price of the investment property sold' 
  },
  { 
    name: 'salesCosts', 
    label: 'Sales Cost, Commissions and Exchange Fee', 
    type: 'number',
    format: 'currency',
    section: 'Property Being Sold',
    hint: 'Commissions, title insurance, closing costs, exchange fee, etc.' 
  },
  { 
    name: 'liabilitiesSold', 
    label: 'Less Liabilities/Mortgages', 
    type: 'number',
    format: 'currency',
    section: 'Property Being Sold',
    hint: 'Any liabilities or mortgages on the property being sold' 
  },

  // Property Being Purchased
  { 
    name: 'purchasePrice', 
    label: 'Purchase Price', 
    type: 'number',
    format: 'currency',
    required: true,
    section: 'Replacement Property Being Purchased',
    hint: 'Contracted purchase price of the replacement investment real estate' 
  },
  { 
    name: 'purchaseCosts', 
    label: 'Purchase Costs and Commissions', 
    type: 'number',
    format: 'currency',
    section: 'Replacement Property Being Purchased',
    hint: 'Commissions, title insurance, closing costs, etc.' 
  },
  { 
    name: 'liabilitiesPurchased', 
    label: 'Plus Liabilities/Mortgages', 
    type: 'number',
    format: 'currency',
    section: 'Replacement Property Being Purchased',
    hint: 'Any liabilities or mortgages on the replacement property' 
  },
];