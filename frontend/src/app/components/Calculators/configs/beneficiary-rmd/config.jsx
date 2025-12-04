import { z } from 'zod';
import { singleLifeTable } from './singleLifeTable';
import { uniformLifeTable } from './uniformLifeTable';

// Schema validation
export const schema = z.object({
  yearOfRMD: z.number()
    .int('Year must be a whole number')
    .min(2020, 'Year must be 2020 or later')
    .max(2100, 'Year too far in future'),
  beneficiaryType: z.enum([
    'longest-timeframe',
    '10-year-rule',
    'surviving-spouse',
    'disabled-chronically-ill',
    'child-under-21'
  ]),
  beneficiaryName: z.string().optional(),
  ownerName: z.string().optional(),
  accountName: z.string().optional(),
  beneficiaryBirthdate: z.string()
    .min(1, 'Beneficiary birthdate is required')
    .refine(val => !isNaN(new Date(val + 'T00:00:00').getTime()), 'Invalid date - use MM/DD/YYYY format'),
  rateOfReturn: z.number().min(-50, 'Rate too low').max(100, 'Rate too high'),
  accountBalance: z.number().min(0, 'Balance must be positive'),
  ownerDeathDate: z.string()
    .min(1, 'Death date is required')
    .refine(val => !isNaN(new Date(val + 'T00:00:00').getTime()), 'Invalid date - use MM/DD/YYYY format'),
  planType: z.enum([
    'traditional-ira',
    'roth-ira',
    'sep-ira',
    'simple-ira',
    '401k',
    'roth-401k',
    '403b',
    '457',
    'profit-sharing',
    'money-purchase',
    'defined-benefit',
    'keogh',
    'tsp',
    'other'
  ]),
  ownerBirthdate: z.string()
    .min(1, 'Owner birthdate is required')
    .refine(val => !isNaN(new Date(val + 'T00:00:00').getTime()), 'Invalid date - use MM/DD/YYYY format'),
});

// Default values
export const defaults = {
  yearOfRMD: 2025,
  beneficiaryType: 'longest-timeframe',
  beneficiaryName: '',
  ownerName: '',
  accountName: '',
  beneficiaryBirthdate: '1952-11-24',
  rateOfReturn: 4,
  accountBalance: 10000,
  ownerDeathDate: '2024-11-24',
  planType: 'traditional-ira',
  ownerBirthdate: '1952-11-24',
};

// Input fields
export const inputs = [
  { name: 'yearOfRMD', label: 'Year of RMD', type: 'number', required: true, hint: 'The year to calculate the Required Minimum Distribution. This is typically the current year.' },
  { name: 'beneficiaryType', label: 'Beneficiary Type', type: 'select', required: true, options: [
      { value: 'longest-timeframe', label: 'Non-spouse choosing longest distribution time-frame' },
      { value: '10-year-rule', label: 'Person choosing 10-year RMD rule (if available)' },
      { value: 'surviving-spouse', label: 'Surviving spouse' },
      { value: 'disabled-chronically-ill', label: 'Disabled or chronically ill person' },
      { value: 'child-under-21', label: "Account owner's child" }
    ] 
  },
  { name: 'beneficiaryName', label: "Beneficiary's Name", type: 'text', hint: 'Enter the beneficiary\'s name if you would like it to appear on the report' },
  { name: 'ownerName', label: "Owner's Name", type: 'text', hint: 'Enter the account owner\'s name if you would like it to appear on the report' },
  { name: 'accountName', label: 'Name of Account', type: 'text', hint: 'Please enter the name of the account for this analysis' },
  { name: 'beneficiaryBirthdate', label: "Beneficiary's Birthdate", type: 'date', required: true, hint: 'Enter the beneficiary\'s birthdate. This is used for calculating life expectancy.' },
  { name: 'rateOfReturn', label: 'Hypothetical Rate of Return', type: 'number', format: 'percentage', step: 0.1, required: true, hint: 'Expected annual growth rate for future projections' },
  { name: 'accountBalance', label: 'Amount Subject to RMD', type: 'number', format: 'currency', required: true, hint: 'Fair market value as of December 31st of the previous year. For example, to determine the RMD for 2020 the account balance on 12/31/2019 would be used.' },
  { name: 'ownerDeathDate', label: "Date of the Original Account Owner's Death", type: 'date', required: true, hint: 'Please enter the date of the original account owner\'s death' },
  { name: 'planType', label: 'Plan Type', type: 'select', required: true, options: [
      { value: 'traditional-ira', label: 'Traditional IRA' },
      { value: 'roth-ira', label: 'Roth IRA' },
      { value: 'sep-ira', label: 'SEP IRA' },
      { value: 'simple-ira', label: 'SIMPLE IRA' },
      { value: '401k', label: '401(k)' },
      { value: 'roth-401k', label: 'Roth 401(k)' },
      { value: '403b', label: '403(b)' },
      { value: '457', label: '457 Plan' },
      { value: 'profit-sharing', label: 'Profit Sharing Plan' },
      { value: 'money-purchase', label: 'Money Purchase Pension Plan' },
      { value: 'defined-benefit', label: 'Defined Benefit Plan' },
      { value: 'keogh', label: 'Keogh Plan' },
      { value: 'tsp', label: 'Thrift Savings Plan (TSP)' },
      { value: 'other', label: 'Other Qualified Plan' }
    ], hint: 'The plan type can affect distributions if the account owner is younger than the beneficiary and RMDs have already begun' 
  },
  { name: 'ownerBirthdate', label: "Original Account Owner's Birthdate", type: 'date', required: true, hint: 'Please enter the original account owner\'s birthdate' }
];

// Result fields
export const results = [
  { key: 'yearOfRMD', label: 'Year of RMD', format: 'text' },  
  { key: 'calculationMethod', label: 'Calculation Method', format: 'text' },
  { key: 'beneficiaryName', label: 'Beneficiary Name', format: 'text' },
  { key: 'ownerName', label: 'Owner Name', format: 'text' },
  { key: 'accountName', label: 'Account Name', format: 'text' },
  { key: 'planType', label: 'Plan Type', format: 'text' },
  { key: 'accountBalance', label: 'Account Balance (Dec 31 Prior Year)', format: 'currency' },
  { key: 'beneficiaryAge', label: 'Beneficiary Age (Dec 31 of RMD Year)', format: 'number' },
  { key: 'lifeExpectancyDivisor', label: 'Life Expectancy Divisor', format: 'text' },
  { key: 'requiredMinimumDistribution', label: 'Required Minimum Distribution', format: 'currency' },
  { key: 'ownerAgeAtDeath', label: 'Owner Age at Death', format: 'number' },
  { key: 'beneficiaryAgeAtDec31Next', label: 'Beneficiary Age (Dec 31 following death)', format: 'number' },
  { key: 'ownerHadStartedRMDs', label: 'Owner Had Started RMDs', format: 'text' }
];

// Main configuration
export const config = {
  title: 'Beneficiary Required Minimum Distributions (RMD)',
  description: 'Calculate beneficiary RMDs using SECURE Act rules and IRS life expectancy tables',

  schema,
  defaultValues: defaults,
  inputs,
  results,

  calculate: (data) => {
    const parseDate = (dateStr) => {
      const d = new Date(dateStr + 'T00:00:00');
      return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
    };

    const ownerBirth = parseDate(data.ownerBirthdate);
    const ownerDeath = parseDate(data.ownerDeathDate);
    const benefBirth = parseDate(data.beneficiaryBirthdate);

    // Calculate owner's age at death
    let ownerAgeAtDeath = ownerDeath.year - ownerBirth.year;
    if (ownerDeath.month < ownerBirth.month ||
      (ownerDeath.month === ownerBirth.month && ownerDeath.day < ownerBirth.day)) {
      ownerAgeAtDeath--;
    }

    // Calculate beneficiary's age on Dec 31 of year following death
    // This is used for initial life expectancy lookup
    let benefAgeAtDec31YearAfterDeath = (ownerDeath.year + 1) - benefBirth.year;

    const getRBDAge = (year, month, day) => {
      // Born before July 1, 1949: RBD age is 70.5
      if (year < 1949 || (year === 1949 && month < 7)) return 70.5;
      // Born July 1, 1949 through Dec 31, 1950: RBD age is 72
      if (year < 1951) return 72;
      // Born Jan 1, 1951 through Dec 31, 1959: RBD age is 73
      if (year >= 1951 && year <= 1959) return 73;
      // Born Jan 1, 1960 or later: RBD age is 75
      return 75;
    };

    const ownerRBDAge = getRBDAge(ownerBirth.year, ownerBirth.month, ownerBirth.day);
    const ownerStartedRMDs = ownerAgeAtDeath >= ownerRBDAge;

    const isPreSecure = ownerDeath.year <= 2019;
    const benefYoungerByYears = ownerBirth.year - benefBirth.year;
    const isNotMoreThan10YearsYounger = benefYoungerByYears <= 10 && benefBirth.year <= ownerBirth.year;
    const isBenefOlderThanOwner = benefBirth.year < ownerBirth.year;

    const rate = data.rateOfReturn / 100;
    const yearsSinceDeath = data.yearOfRMD - (ownerDeath.year + 1);

    if (yearsSinceDeath < 0) {
      return {
        error: true,
        message: `RMD calculations begin in ${ownerDeath.year + 1}. Cannot calculate for ${data.yearOfRMD}.`
      };
    }

    let method = '';
    const notes = [];
    let divisor = 'N/A';
    let rmd = 0;

    // Current beneficiary age for the year being calculated
    let beneficiaryAge = benefAgeAtDec31YearAfterDeath + yearsSinceDeath;

    if (data.beneficiaryType === 'surviving-spouse') {
      method = 'Surviving Spouse - Treats Account as Own';
      notes.push('RMDs calculated using Uniform Lifetime Table');
      notes.push('Recalculates life expectancy each year');
      const spouseRBDAge = getRBDAge(benefBirth.year, benefBirth.month, benefBirth.day);
      if (beneficiaryAge < spouseRBDAge) {
        rmd = 0;
        divisor = 'N/A';
        notes.push(`No RMD required until age ${spouseRBDAge}`);
      } else {
        divisor = uniformLifeTable[Math.min(120, beneficiaryAge)] || 0;
        rmd = divisor > 0 ? data.accountBalance / divisor : data.accountBalance;
      }
    } else if (data.beneficiaryType === 'child-under-21') {
      // Account owner's child: Life expectancy until age 21, then 10-year rule
      if (beneficiaryAge <= 21) {
        method = "Account Owner's Child - Life Expectancy Method (Until Age 21)";
        notes.push('Uses Single Life Expectancy Table');
        notes.push('Life expectancy looked up once in year following death, then reduced by 1 each year');
        notes.push('10-year rule will apply starting the year after turning 21');
        
        const ageForInitialLookup = benefAgeAtDec31YearAfterDeath;
        const initialDivisor = singleLifeTable[Math.min(120, ageForInitialLookup)] || 1;
        divisor = Math.max(1, initialDivisor - yearsSinceDeath);
        rmd = data.accountBalance / divisor;
      } else {
        // After age 21, 10-year rule applies
        method = "Account Owner's Child - 10-Year Rule (After Age 21)";
        notes.push('Child reached age 21 - 10-year distribution rule now applies');
        
        // Calculate years since turning 21
        const yearTurned21 = benefBirth.year + 21;
        const yearAfterTurning21 = yearTurned21 + 1;
        const yearsSinceTurning21 = data.yearOfRMD - yearAfterTurning21;
        
        if (yearsSinceTurning21 >= 10) {
          rmd = 0;
          divisor = 'N/A';
          notes.push('10-year distribution period has ended');
        } else if (yearsSinceTurning21 === 9) {
          rmd = data.accountBalance;
          divisor = 'N/A';
          notes.push('Final year - entire balance must be withdrawn');
        } else if (ownerStartedRMDs) {
          // Use beneficiary's age in year after turning 21 for initial lookup
          const benefAgeInYearAfterTurning21 = 22;
          const initialDivisor = singleLifeTable[Math.min(120, benefAgeInYearAfterTurning21)] || 1;
          divisor = Math.max(1, initialDivisor - yearsSinceTurning21);
          rmd = data.accountBalance / divisor;
          notes.push('Annual RMDs required (years 1-9) since owner had started RMDs');
        } else {
          rmd = 0;
          divisor = 'N/A';
          notes.push('No annual RMD required (owner had not started RMDs)');
        }
      }
    } else if (data.beneficiaryType === 'disabled-chronically-ill' ||
      (data.beneficiaryType === 'longest-timeframe' && (isPreSecure || isNotMoreThan10YearsYounger))) {

      method = data.beneficiaryType === 'disabled-chronically-ill'
        ? 'Disabled or Chronically Ill - Life Expectancy Method'
        : isPreSecure
          ? 'Pre-SECURE Act - Life Expectancy Method'
          : 'Life Expectancy Method - Not More Than 10 Years Younger';

      notes.push('Uses Single Life Expectancy Table');
      notes.push('Life expectancy looked up once in year following death, then reduced by 1 each year');

      // Always use age in the FIRST RMD year (year after death) for initial lookup
      let ageForInitialLookup = benefAgeAtDec31YearAfterDeath;

      // Special case: beneficiary older than owner AND owner had started RMDs
      // In this case, can use owner's age for the calculation
      if (isBenefOlderThanOwner && ownerStartedRMDs) {
        let ownerAgeAtDec31YearAfterDeath = (ownerDeath.year + 1) - ownerBirth.year;

        if (ownerAgeAtDec31YearAfterDeath < benefAgeAtDec31YearAfterDeath) {
          ageForInitialLookup = ownerAgeAtDec31YearAfterDeath;
          notes.push(`Using owner's life expectancy (age ${ageForInitialLookup} in first RMD year) for lower RMD`);
        }
      }

      // Look up the initial life expectancy value
      const initialDivisor = singleLifeTable[Math.min(120, ageForInitialLookup)] || 1;
      // Subtract 1 for each year that has passed since the first RMD year
      divisor = Math.max(1, initialDivisor - yearsSinceDeath);
      rmd = data.accountBalance / divisor;
    } else {
      // 10-Year Rule (SECURE Act)
      method = '10-Year Rule (SECURE Act)';
      notes.push('Account must be fully distributed by end of 10th year after death');

      if (yearsSinceDeath >= 10) {
        rmd = 0;
        divisor = 'N/A';
        notes.push('10-year distribution period has ended');
      } else if (yearsSinceDeath === 9) {
        // Year 10: Must withdraw entire balance
        rmd = data.accountBalance;
        divisor = 'N/A';
        notes.push('Final year - entire balance must be withdrawn');
      } else if (ownerStartedRMDs) {
        // Years 1-9: Annual RMDs required if owner had started RMDs
        const initialDivisor = singleLifeTable[Math.min(120, benefAgeAtDec31YearAfterDeath)] || 1;
        divisor = Math.max(1, initialDivisor - yearsSinceDeath);
        rmd = data.accountBalance / divisor;
        notes.push('Annual RMDs required (years 1-9) since owner had started RMDs');
      } else {
        // Years 1-9: No annual RMDs required if owner had not started RMDs
        rmd = 0;
        divisor = 'N/A';
        notes.push('No annual RMD required (owner had not started RMDs)');
      }
    }

    // Generate projection data for charts
    const projections = generateProjections(data, {
      ownerBirth,
      ownerDeath,
      benefBirth,
      ownerAgeAtDeath,
      benefAgeAtDec31YearAfterDeath,
      ownerStartedRMDs,
      isPreSecure,
      isNotMoreThan10YearsYounger,
      isBenefOlderThanOwner,
      getRBDAge
    });

    // Format plan type for display
    const planTypeLabels = {
      'traditional-ira': 'Traditional IRA',
      'roth-ira': 'Roth IRA',
      'sep-ira': 'SEP IRA',
      'simple-ira': 'SIMPLE IRA',
      '401k': '401(k)',
      'roth-401k': 'Roth 401(k)',
      '403b': '403(b)',
      '457': '457 Plan',
      'profit-sharing': 'Profit Sharing Plan',
      'money-purchase': 'Money Purchase Pension Plan',
      'defined-benefit': 'Defined Benefit Plan',
      'keogh': 'Keogh Plan',
      'tsp': 'Thrift Savings Plan (TSP)',
      'other': 'Other Qualified Plan'
    };

    return {
      calculationMethod: method,
      yearOfRMD: data.yearOfRMD,
      beneficiaryName: data.beneficiaryName || 'N/A',
      ownerName: data.ownerName || 'N/A',
      accountName: data.accountName || 'N/A',
      beneficiaryAge,
      ownerAgeAtDeath,
      beneficiaryAgeAtDec31Next: benefAgeAtDec31YearAfterDeath,
      ownerHadStartedRMDs: ownerStartedRMDs ? 'Yes' : 'No',
      accountBalance: data.accountBalance,
      lifeExpectancyDivisor: typeof divisor === 'number' ? divisor.toFixed(1) : divisor,
      requiredMinimumDistribution: Math.round(rmd * 100) / 100,
      planType: planTypeLabels[data.planType] || data.planType.toUpperCase(),
      notes,
      projections
    };
  },

  charts: [
    {
      type: 'area',
      title: 'Account Balance Projection',
      xKey: 'year',
      format: 'currency',
      height: 350,
      areas: [
        { key: 'endingBalance', name: 'Account Balance', color: '#378CE7', opacity: 0.6 }
      ],
      data: (results) => results.projections || [],
      description: 'Projected account balance over time after RMDs and growth'
    },
    {
      type: 'bar',
      title: 'Annual Required Minimum Distributions',
      xKey: 'year',
      format: 'currency',
      height: 350,
      bars: [
        { key: 'rmd', name: 'RMD Amount', color: '#10b981' }
      ],
      data: (results) => results.projections || [],
      description: 'Required minimum distributions by year'
    },
    {
      type: 'line',
      title: 'Cumulative Distributions Over Time',
      xKey: 'year',
      format: 'currency',
      height: 350,
      lines: [
        { key: 'cumulativeRMD', name: 'Total Distributions', color: '#8b5cf6', width: 3 }
      ],
      data: (results) => results.projections || [],
      description: 'Running total of all distributions taken'
    },
    {
      type: 'line',
      title: 'Balance vs Annual RMDs',
      xKey: 'year',
      format: 'currency',
      height: 350,
      lines: [
        { key: 'endingBalance', name: 'Account Balance', color: '#378CE7', width: 2 },
        { key: 'rmd', name: 'Annual RMD', color: '#f59e0b', width: 2, dashed: true }
      ],
      data: (results) => results.projections || [],
      description: 'Comparison of account balance and required distributions'
    }
  ]
};

// Helper function to generate projection data
function generateProjections(data, context) {
  const {
    ownerBirth,
    ownerDeath,
    benefBirth,
    ownerAgeAtDeath,
    benefAgeAtDec31YearAfterDeath,
    ownerStartedRMDs,
    isPreSecure,
    isNotMoreThan10YearsYounger,
    isBenefOlderThanOwner,
    getRBDAge
  } = context;

  const rate = data.rateOfReturn / 100;
  const firstRMDYear = ownerDeath.year + 1;

  // Determine calculation method and max years
  let usesLifeExpectancy = false;
  let uses10YearRule = false;
  let usesSurvivingSpouse = false;
  let usesChildUnder21 = false;
  let maxYears = 30;

  if (data.beneficiaryType === 'surviving-spouse') {
    usesSurvivingSpouse = true;
  } else if (data.beneficiaryType === 'child-under-21') {
    usesChildUnder21 = true;
    maxYears = 50;
  } else if (data.beneficiaryType === 'disabled-chronically-ill' ||
    (data.beneficiaryType === 'longest-timeframe' && (isPreSecure || isNotMoreThan10YearsYounger))) {
    usesLifeExpectancy = true;
    maxYears = Math.min(50, singleLifeTable[benefAgeAtDec31YearAfterDeath] || 30);
  } else {
    uses10YearRule = true;
    maxYears = 10;
  }

  const projections = [];
  let balance = data.accountBalance;
  let cumulativeRMD = 0;

  for (let i = 0; i < maxYears; i++) {
    const year = firstRMDYear + i;
    const benefAge = benefAgeAtDec31YearAfterDeath + i;
    let rmd = 0;
    let divisor = 0;

    if (usesSurvivingSpouse) {
      const spouseRBDAge = getRBDAge(benefBirth.year, benefBirth.month, benefBirth.day);
      if (benefAge >= spouseRBDAge) {
        divisor = uniformLifeTable[Math.min(120, benefAge)] || 0;
        rmd = divisor > 0 ? balance / divisor : balance;
      }
    } else if (usesChildUnder21) {
      if (benefAge <= 21) {
        const ageForInitialLookup = benefAgeAtDec31YearAfterDeath;
        const initialDivisor = singleLifeTable[Math.min(120, ageForInitialLookup)] || 1;
        divisor = Math.max(1, initialDivisor - i);
        rmd = balance / divisor;
      } else {
        const yearTurned21 = benefBirth.year + 21;
        const yearAfterTurning21 = yearTurned21 + 1;
        const currentYear = firstRMDYear + i;
        const yearsSinceTurning21 = currentYear - yearAfterTurning21;
        
        if (yearsSinceTurning21 >= 10) {
          rmd = 0;
        } else if (yearsSinceTurning21 === 9) {
          rmd = balance;
        } else if (ownerStartedRMDs) {
          const initialDivisor = singleLifeTable[22] || 1;
          divisor = Math.max(1, initialDivisor - yearsSinceTurning21);
          rmd = balance / divisor;
        } else {
          rmd = 0;
        }
      }
    } else if (usesLifeExpectancy) {
      let ageForInitialLookup = benefAgeAtDec31YearAfterDeath;
      
      if (isBenefOlderThanOwner && ownerStartedRMDs) {
        let ownerAgeAtDec31YearAfterDeath = (ownerDeath.year + 1) - ownerBirth.year;
        if (ownerAgeAtDec31YearAfterDeath < benefAgeAtDec31YearAfterDeath) {
          ageForInitialLookup = ownerAgeAtDec31YearAfterDeath;
        }
      }
      
      const initialDivisor = singleLifeTable[Math.min(120, ageForInitialLookup)] || 1;
      divisor = Math.max(1, initialDivisor - i);
      rmd = balance / divisor;
    } else if (uses10YearRule) {
      if (i === 9) {
        rmd = balance;
      } else if (ownerStartedRMDs) {
        const initialDivisor = singleLifeTable[Math.min(120, benefAgeAtDec31YearAfterDeath)] || 1;
        divisor = Math.max(1, initialDivisor - i);
        rmd = balance / divisor;
      } else {
        rmd = 0;
      }
    }

    const startBalance = balance;
    
    balance -= rmd;
    if (balance < 0) balance = 0;
    
    balance *= (1 + rate);
    
    cumulativeRMD += rmd;

    if (balance < 0.01) balance = 0;

    projections.push({
      year,
      age: benefAge,
      startingBalance: Math.round(startBalance * 100) / 100,
      rmd: Math.round(rmd * 100) / 100,
      endingBalance: Math.round(balance * 100) / 100,
      cumulativeRMD: Math.round(cumulativeRMD * 100) / 100,
      divisor: divisor > 0 ? divisor.toFixed(1) : 'N/A'
    });

    if (balance === 0) break;
  }

  return projections;
}