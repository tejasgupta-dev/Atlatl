import { z } from 'zod';

export const schema = z.object({
  mortgageAmount: z.number().min(0, 'Must be 0 or greater'),
  interestRate: z.number().min(0, 'Must be 0 or greater').max(100, 'Must be 100% or less'),
  originalTermYears: z.number().min(1, 'Must be at least 1 year').max(50, 'Must be 50 years or less'),
  firstPaymentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be a valid date in YYYY-MM-DD format'),
  monthlyEscrow: z.number().min(0, 'Must be 0 or greater'),
  monthlyPrepayment: z.number().min(0, 'Must be 0 or greater'),
});