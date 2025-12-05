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

export const getDaysBetween = (startDateStr, endDateStr) => {
  if (!startDateStr || !endDateStr || startDateStr === '' || endDateStr === '') {
    return null;
  }
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  return Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
};

export const getMonthsBetween = (startDateStr, endDateStr) => {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);
  return Math.max(0, 
    (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
    (endDate.getMonth() - startDate.getMonth())
  );
};

// FINANCIAL UTILITIES

export const roundCurrency = (amount) => {
  return Math.round(amount * 100) / 100;
};

export const roundToDecimals = (value, decimals = 2) => {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
};

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// MORTGAGE CALCULATION UTILITIES

export const annualRateToMonthly = (annualRatePercent) => {
  return (annualRatePercent / 100) / 12;
};

export const calculateMonthlyPayment = (principal, monthlyRate, totalMonths) => {
  if (monthlyRate === 0) return principal / totalMonths;
  
  return principal * 
    (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
    (Math.pow(1 + monthlyRate, totalMonths) - 1);
};

export const calculateRemainingBalance = (principal, monthlyRate, monthlyPayment, monthsPaid) => {
  if (monthsPaid === 0) return principal;
  
  const totalMonths = Math.log(monthlyPayment / (monthlyPayment - principal * monthlyRate)) / Math.log(1 + monthlyRate);
  const remainingMonths = totalMonths - monthsPaid;
  
  if (remainingMonths <= 0) return 0;
  
  return principal * 
    (Math.pow(1 + monthlyRate, totalMonths) - Math.pow(1 + monthlyRate, monthsPaid)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1);
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