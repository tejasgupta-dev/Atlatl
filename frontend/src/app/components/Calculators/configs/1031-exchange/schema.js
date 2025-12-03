import { z } from 'zod';

export const schema = z.object({
  // Dates
  dateOfSale: z.string().optional(),
  dateOfPurchase: z.string().optional(),
  description: z.string().optional(),
  
  // Property being sold (relinquished)
  adjustedBasis: z.number().min(0, 'Must be a positive number'),
  salesPrice: z.number().min(0, 'Must be a positive number'),
  salesCosts: z.number().min(0, 'Must be a positive number'),
  liabilitiesSold: z.number().min(0, 'Must be a positive number'),
  
  // Property being purchased (replacement)
  purchasePrice: z.number().min(0, 'Must be a positive number'),
  purchaseCosts: z.number().min(0, 'Must be a positive number'),
  liabilitiesPurchased: z.number().min(0, 'Must be a positive number'),
});