import { z } from 'zod';

export const schema = z.object({
  mortgageAmount: z.number().min(0, 'Must be 0 or greater'),
  termInYears: z.number().min(1, 'Must be at least 1 year').max(50, 'Must be 50 years or less'),
  fixedInterestRate: z.number().min(0, 'Must be 0 or greater').max(100, 'Must be 100% or less'),
  armInterestRate: z.number().min(0, 'Must be 0 or greater').max(100, 'Must be 100% or less'),
  monthsRateFixed: z.number().min(1, 'Must be at least 1 month').max(360, 'Must be 360 months or less'),
  expectedAdjustment: z.number().min(-3, 'Must be -3% or greater').max(3, 'Must be 3% or less'),
  monthsBetweenAdjustments: z.number().min(1, 'Must be at least 1 month').max(12, 'Must be 12 months or less'),
  interestRateCap: z.number().min(0, 'Must be 0 or greater').max(100, 'Must be 100% or less'),
});