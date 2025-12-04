import { z } from 'zod';

// DATE UTILITIES

export const parseDate = (dateStr) => {
  const d = new Date(dateStr + 'T00:00:00');
  return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
};

export const calculateAge = (birthDate, referenceDate) => {
  let age = referenceDate.year - birthDate.year;
  if (referenceDate.month < birthDate.month ||
    (referenceDate.month === birthDate.month && referenceDate.day < birthDate.day)) {
    age--;
  }
  return age;
};

// FINANCIAL UTILITIES

export const roundCurrency = (amount) => {
  return Math.round(amount * 100) / 100;
};

// VALIDATION UTILITIES (Zod Schemas)

export const createDateValidator = (fieldName) => {
  return z.string()
    .min(1, `${fieldName} is required`)
    .refine(
      val => !isNaN(new Date(val + 'T00:00:00').getTime()),
      'Invalid date - use MM/DD/YYYY format'
    );
};