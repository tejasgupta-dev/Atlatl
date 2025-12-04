import { schema } from './schema';
import { defaults } from './defaults';
import { inputs } from './inputs';
import { results } from './results';

export const config = {
  title: 'Investment Property Calculator',
  description: 'Examine the potential return you might receive from an investment property',
  schema,
  defaultValues: defaults,
  inputs,
  results,

  calculate: (data) => {
    const round2 = (x) => Math.round(x * 100) / 100;
    const round4 = (x) => Math.round(x * 10000) / 10000;

    // ===== INPUTS =====
    const purchasePrice = Number(data.purchasePrice) || 0;
    const cashInvested = Number(data.cashInvested) || 0;
    const landValue = Number(data.landValue) || 0;
    const personalProperty = Number(data.personalProperty) || 0;
    const buildingValue = purchasePrice - landValue;
    
    const annualRent = Number(data.annualRent) || 0;
    const vacancy = Number(data.vacancy) || 0;
    const personalPropertyDepRate = (Number(data.personalPropertyDepRate) || 0) / 100;
    const buildingDepRate = (Number(data.buildingDepRate) || 0) / 100;
    
    // Loan 1
    const loan1Amount = Number(data.loan1Amount) || 0;
    const interestRate1 = (Number(data.interestRate1) || 0) / 100;
    const termInMonths1 = Number(data.termInMonths1) || 0;
    const interestOnly1 = Boolean(data.interestOnly1);
    
    // Loan 2
    const loan2Amount = Number(data.loan2Amount) || 0;
    const interestRate2 = (Number(data.interestRate2) || 0) / 100;
    const termInMonths2 = Number(data.termInMonths2) || 0;
    const interestOnly2 = Boolean(data.interestOnly2);
    
    // Annual Expenses
    const realEstateTaxes = Number(data.realEstateTaxes) || 0;
    const utilities = Number(data.utilities) || 0;
    const insurance = Number(data.insurance) || 0;
    const maintenanceRepairs = Number(data.maintenanceRepairs) || 0;
    const advertising = Number(data.advertising) || 0;
    const adminLegal = Number(data.adminLegal) || 0;
    const supplies = Number(data.supplies) || 0;
    const propertyMgmtExpense = (Number(data.propertyMgmtExpense) || 0) / 100;
    const miscellaneous = Number(data.miscellaneous) || 0;
    
    // Analysis
    const taxBracket = (Number(data.taxBracket) || 0) / 100;
    const appreciationRate = (Number(data.appreciationRate) || 0) / 100;
    const costOfCapital = (Number(data.costOfCapital) || 0) / 100;
    
    // ===== CALCULATIONS =====
    
    // Depreciation
    const personalPropertyDepreciation = personalProperty * personalPropertyDepRate;
    const buildingDepreciation = buildingValue * buildingDepRate;
    const totalDepreciation = personalPropertyDepreciation + buildingDepreciation;
    
    // Calculate monthly payments for loans
    const calculateMonthlyPayment = (principal, annualRate, months, isInterestOnly) => {
      if (principal <= 0 || months <= 0) return 0;
      if (isInterestOnly) {
        return principal * (annualRate / 12);
      }
      if (annualRate === 0) {
        return principal / months;
      }
      const monthlyRate = annualRate / 12;
      return principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
             (Math.pow(1 + monthlyRate, months) - 1);
    };
    
    const principalAndInterest1 = calculateMonthlyPayment(loan1Amount, interestRate1, termInMonths1, interestOnly1);
    const principalAndInterest2 = calculateMonthlyPayment(loan2Amount, interestRate2, termInMonths2, interestOnly2);
    
    // Annual debt service
    const annualDebtService = (principalAndInterest1 + principalAndInterest2) * 12;
    
    // Calculate first year interest for both loans
    const calculateFirstYearInterest = (principal, annualRate, monthlyPayment, months, isInterestOnly) => {
      if (principal <= 0 || months <= 0) return 0;
      if (isInterestOnly) {
        return principal * annualRate;
      }
      let balance = principal;
      let totalInterest = 0;
      const monthlyRate = annualRate / 12;
      const paymentsInYear = Math.min(12, months);
      for (let i = 0; i < paymentsInYear; i++) {
        const interest = balance * monthlyRate;
        totalInterest += interest;
        const principalPmt = monthlyPayment - interest;
        balance = Math.max(0, balance - principalPmt);
      }
      return totalInterest;
    };
    
    const firstYearInterest1 = calculateFirstYearInterest(loan1Amount, interestRate1, principalAndInterest1, termInMonths1, interestOnly1);
    const firstYearInterest2 = calculateFirstYearInterest(loan2Amount, interestRate2, principalAndInterest2, termInMonths2, interestOnly2);
    const totalFirstYearInterest = firstYearInterest1 + firstYearInterest2;
    
    // Calculate first year principal
    const firstYearPrincipal = annualDebtService - totalFirstYearInterest;
    
    // Income calculations
    const grossOperatingIncome = annualRent - vacancy;
    const propertyMgmtExpenseAmount = grossOperatingIncome * propertyMgmtExpense;
    
    // Total operating expenses
    const totalOperatingExpense = realEstateTaxes + utilities + insurance + 
                                  maintenanceRepairs + advertising + adminLegal + 
                                  supplies + propertyMgmtExpenseAmount + miscellaneous;
    
    // Operating expense ratio
    const operatingExpenseRatio = grossOperatingIncome > 0 
      ? (totalOperatingExpense / grossOperatingIncome) * 100 
      : 0;
    
    // Net operating income
    const netOperatingIncome = grossOperatingIncome - totalOperatingExpense;
    
    // Cash flow before tax
    const cashFlowBeforeTax = netOperatingIncome - annualDebtService;
    
    // Taxable income
    const taxableIncome = netOperatingIncome - totalFirstYearInterest - totalDepreciation;
    const taxesPaid = taxableIncome * taxBracket;
    
    // Cash flow after tax
    const cashFlowAfterTax = cashFlowBeforeTax - taxesPaid;
    
    // ===== RATIOS & RETURNS =====
    
    // Debt Service Ratio (as percentage)
    const debtServiceRatio = annualDebtService > 0 
      ? (netOperatingIncome / annualDebtService) * 100
      : 0;
    
    // Cap Rate
    const capRate = purchasePrice > 0 
      ? (netOperatingIncome / purchasePrice) * 100 
      : 0;
    
    // Cash on Cash Return
    const cashOnCash = cashInvested > 0 
      ? (cashFlowBeforeTax / cashInvested) * 100 
      : 0;
    
    // ROI without appreciation
    const roiWithoutAppreciation = cashInvested > 0 
      ? ((cashFlowBeforeTax + firstYearPrincipal - taxesPaid) / cashInvested) * 100 
      : 0;
    
    // ROI with appreciation
    const appreciationAmount = purchasePrice * appreciationRate;
    const roiWithAppreciation = cashInvested > 0 
      ? ((cashFlowBeforeTax + firstYearPrincipal - taxesPaid + appreciationAmount) / cashInvested) * 100 
      : 0;

    return {
      // Calculated property fields (readonly)
      buildingValue: round2(buildingValue),
      personalPropertyDepreciation: round2(personalPropertyDepreciation),
      buildingDepreciation: round2(buildingDepreciation),
      totalDepreciation: round2(totalDepreciation),
      
      // Loan payments (readonly)
      principalAndInterest1: round2(principalAndInterest1),
      principalAndInterest2: round2(principalAndInterest2),
      
      // Operating expenses (readonly)
      totalOperatingExpense: round2(totalOperatingExpense),
      operatingExpenseRatio: round2(operatingExpenseRatio),
      
      // Analysis results (readonly)
      netOperatingIncome: round2(netOperatingIncome),
      annualDebtService: round2(annualDebtService),
      debtServiceRatio: round2(debtServiceRatio),
      cashFlowBeforeTax: round2(cashFlowBeforeTax),
      taxableIncome: round2(taxableIncome),
      cashFlowAfterTax: round2(cashFlowAfterTax),
      roiWithAppreciation: round2(roiWithAppreciation),
      roiWithoutAppreciation: round2(roiWithoutAppreciation),
      capRate: round2(capRate),
      cashOnCash: round2(cashOnCash),
      
      // For breakdowns and internal use
      firstYearInterest: round2(totalFirstYearInterest),
      firstYearPrincipal: round2(firstYearPrincipal),
      appreciationAmount: round2(appreciationAmount),
      taxesPaid: round2(taxesPaid),
      grossOperatingIncome: round2(grossOperatingIncome),
      propertyMgmtExpenseAmount: round2(propertyMgmtExpenseAmount),
      
      // Breakdowns for display
      propertyBreakdown: [
        { label: 'Purchase Price', value: round2(purchasePrice) },
        { label: 'Cash Invested', value: round2(cashInvested) },
        { label: 'Land Value', value: round2(landValue) },
        { label: 'Building Value', value: round2(buildingValue) },
        { label: 'Personal Property', value: round2(personalProperty) },
      ],
      
      incomeBreakdown: [
        { label: 'Annual Rent', value: round2(annualRent) },
        { label: 'Less: Vacancy', value: round2(-vacancy) },
        { label: 'Gross Operating Income', value: round2(grossOperatingIncome) },
      ],
      
      expenseBreakdown: [
        { label: 'Real Estate Taxes', value: round2(realEstateTaxes) },
        { label: 'Utilities', value: round2(utilities) },
        { label: 'Insurance', value: round2(insurance) },
        { label: 'Maintenance/Repairs', value: round2(maintenanceRepairs) },
        { label: 'Advertising', value: round2(advertising) },
        { label: 'Admin/Legal', value: round2(adminLegal) },
        { label: 'Supplies', value: round2(supplies) },
        { label: 'Property Management', value: round2(propertyMgmtExpenseAmount) },
        { label: 'Miscellaneous', value: round2(miscellaneous) },
        { label: 'Total Operating Expense', value: round2(totalOperatingExpense) },
      ],
      
      cashFlowBreakdown: [
        { label: 'Gross Operating Income', value: round2(grossOperatingIncome) },
        { label: 'Less: Operating Expenses', value: round2(-totalOperatingExpense) },
        { label: 'Net Operating Income', value: round2(netOperatingIncome) },
        { label: 'Less: Annual Debt Service', value: round2(-annualDebtService) },
        { label: 'Cash Flow Before Tax', value: round2(cashFlowBeforeTax) },
        { label: 'Less: Taxes Paid', value: round2(-taxesPaid) },
        { label: 'Cash Flow After Tax', value: round2(cashFlowAfterTax) },
      ],
      
      returnBreakdown: [
        { label: 'Cash Flow Before Tax', value: round2(cashFlowBeforeTax) },
        { label: 'Plus: Principal Reduction', value: round2(firstYearPrincipal) },
        { label: 'Less: Taxes Paid', value: round2(-taxesPaid) },
        { label: 'ROI without Appreciation', value: `${round2(roiWithoutAppreciation)}%` },
        { label: 'Plus: Appreciation', value: round2(appreciationAmount) },
        { label: 'ROI with Appreciation', value: `${round2(roiWithAppreciation)}%` },
      ],
      
      performanceMetrics: [
        { label: 'Cap Rate', value: `${round2(capRate)}%`, description: 'Net operating income ÷ purchase price' },
        { label: 'Cash on Cash', value: `${round2(cashOnCash)}%`, description: 'Cash flow before tax ÷ cash invested' },
        { label: 'Debt Service Ratio', value: `${round2(debtServiceRatio)}%`, description: 'Net operating income ÷ annual debt service' },
        { label: 'Operating Expense Ratio', value: `${round2(operatingExpenseRatio)}%`, description: 'Operating expenses ÷ gross operating income' },
      ],
    };
  },

  charts: [
    {
      title: 'Income vs. Expenses',
      type: 'bar',
      height: 350,
      xKey: 'category',
      format: 'currency',
      showLegend: false,
      data: (results) => [
        { category: 'Gross Operating Income', value: results.grossOperatingIncome, color: '#10B981' },
        { category: 'Operating Expenses', value: results.totalOperatingExpense, color: '#EF4444' },
        { category: 'Net Operating Income', value: results.netOperatingIncome, color: '#3B82F6' },
      ],
      bars: [
        { key: 'value', name: 'Amount', color: '#3B82F6' }
      ],
      description: 'Annual income and expense comparison'
    },
    {
      title: 'Monthly Loan Payments',
      type: 'bar',
      height: 350,
      xKey: 'loan',
      format: 'currency',
      showLegend: false,
      data: (results) => {
        const data = [];
        if (results.principalAndInterest1 > 0) {
          data.push({ loan: 'Loan 1', value: results.principalAndInterest1, color: '#3B82F6' });
        }
        if (results.principalAndInterest2 > 0) {
          data.push({ loan: 'Loan 2', value: results.principalAndInterest2, color: '#8B5CF6' });
        }
        if (data.length === 0) {
          data.push({ loan: 'No Loans', value: 0, color: '#9CA3AF' });
        }
        return data;
      },
      bars: [
        { key: 'value', name: 'Monthly Payment', color: '#3B82F6' }
      ],
      description: 'Monthly principal and interest payments'
    },
    {
      title: 'Return Components',
      type: 'bar',
      height: 350,
      xKey: 'component',
      format: 'currency',
      showLegend: false,
      data: (results) => [
        { component: 'Cash Flow', value: results.cashFlowBeforeTax, color: '#3B82F6' },
        { component: 'Principal Reduction', value: results.firstYearPrincipal, color: '#10B981' },
        { component: 'Appreciation', value: results.appreciationAmount, color: '#8B5CF6' },
      ],
      bars: [
        { key: 'value', name: 'Amount', color: '#3B82F6' }
      ],
      description: 'Components of total investment return'
    },
    {
      title: 'Key Performance Metrics',
      type: 'bar',
      height: 350,
      xKey: 'metric',
      format: 'percentage',
      showLegend: false,
      data: (results) => [
        { metric: 'Cap Rate', value: results.capRate, color: '#3B82F6' },
        { metric: 'Cash on Cash', value: results.cashOnCash, color: '#10B981' },
        { metric: 'ROI w/o Appreciation', value: results.roiWithoutAppreciation, color: '#F59E0B' },
        { metric: 'ROI w/ Appreciation', value: results.roiWithAppreciation, color: '#8B5CF6' },
      ],
      bars: [
        { key: 'value', name: 'Percentage', color: '#3B82F6' }
      ],
      description: 'Investment performance ratios'
    },
    {
      title: 'Expense Breakdown',
      type: 'bar',
      height: 400,
      xKey: 'expense',
      format: 'currency',
      showLegend: false,
      data: (results) => {
        const expenses = results.expenseBreakdown.filter(e => 
          e.label !== 'Total Operating Expense' && e.value > 0
        );
        return expenses.map(e => ({
          expense: e.label,
          value: e.value,
          color: '#EF4444'
        }));
      },
      bars: [
        { key: 'value', name: 'Amount', color: '#EF4444' }
      ],
      description: 'Annual operating expense breakdown'
    },
  ]
};