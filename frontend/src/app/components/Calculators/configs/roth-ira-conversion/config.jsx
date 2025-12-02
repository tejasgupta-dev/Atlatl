import { schema } from './schema';
import { defaults } from './defaults';
import { inputs } from './inputs';
import { results } from './results';

export const config = {
  title: 'Roth IRA Conversion Calculator',
  description: 'Compare converting a traditional IRA to a Roth IRA versus keeping it traditional',
  schema,
  defaultValues: defaults,
  inputs,
  results,

  calculate: (data) => {
    // Inputs
    const amountToConvert = Number(data.amountToConvert) || 0;
    const nonDeductibleContributions = Number(data.nonDeductibleContributions) || 0;
    const currentAge = Number(data.currentAge);
    const retirementAge = Number(data.retirementAge);
    const years = Math.max(0, retirementAge - currentAge);

    const rAnnual = Number(data.rateOfReturn) / 100;
    const currentTaxRate = Number(data.currentTaxRate) / 100;
    const retirementTaxRate = Number(data.retirementTaxRate) / 100;
    const investmentTaxRate = Number(data.investmentTaxRate) / 100;

    // Calculate taxable amount of conversion
    const taxableAmount = Math.max(0, amountToConvert - nonDeductibleContributions);
    const conversionTaxes = taxableAmount * currentTaxRate;

    // Scenario 1: Convert to Roth IRA
    // The full converted amount grows tax-free
    const rothBalanceAtRetirement = amountToConvert * Math.pow(1 + rAnnual, years);

    // Scenario 2: Keep Traditional IRA + Invest the tax savings
    // Traditional IRA grows pre-tax
    const traditionalBalanceAtRetirement = amountToConvert * Math.pow(1 + rAnnual, years);
    const traditionalTaxes = traditionalBalanceAtRetirement * retirementTaxRate;
    const traditionalAfterTax = traditionalBalanceAtRetirement - traditionalTaxes;

    // If you don't convert, you would have the conversion taxes to invest in a taxable account
    // This taxable account grows, but earnings are taxed annually
    // We'll use a simplified after-tax return approach
    const afterTaxReturn = rAnnual * (1 - investmentTaxRate);
    const taxableInvestmentBalance = conversionTaxes * Math.pow(1 + afterTaxReturn, years);
    
    // Calculate capital gains tax on the taxable investment
    const taxableInvestmentGains = Math.max(0, taxableInvestmentBalance - conversionTaxes);
    const capitalGainsTax = taxableInvestmentGains * investmentTaxRate;
    const taxableInvestmentAfterTax = taxableInvestmentBalance - capitalGainsTax;

    // Total value if you don't convert
    const traditionalPlusTaxableInvestment = traditionalAfterTax + taxableInvestmentAfterTax;

    // Comparison
    const conversionAdvantage = rothBalanceAtRetirement - traditionalPlusTaxableInvestment;
    const conversionAdvantagePercent = 
      traditionalPlusTaxableInvestment !== 0 
        ? (conversionAdvantage / traditionalPlusTaxableInvestment) * 100 
        : 0;

    const betterChoice = conversionAdvantage > 0 
      ? "Convert to Roth IRA" 
      : "Keep Traditional IRA";

    // Build yearly series for charts
    const yearlySeries = [];
    for (let y = 1; y <= years; y++) {
      const age = currentAge + y;
      
      const rothBalance = amountToConvert * Math.pow(1 + rAnnual, y);
      
      const tradBalance = amountToConvert * Math.pow(1 + rAnnual, y);
      const tradTax = tradBalance * retirementTaxRate;
      const tradAfterTax = tradBalance - tradTax;
      
      const taxableInv = conversionTaxes * Math.pow(1 + afterTaxReturn, y);
      const taxableGains = Math.max(0, taxableInv - conversionTaxes);
      const taxableCapGains = taxableGains * investmentTaxRate;
      const taxableAfterTax = taxableInv - taxableCapGains;
      
      const tradPlusTaxable = tradAfterTax + taxableAfterTax;

      yearlySeries.push({
        age,
        rothBalance: Math.round(rothBalance),
        traditionalBalance: Math.round(tradBalance),
        traditionalAfterTax: Math.round(tradAfterTax),
        taxableInvestment: Math.round(taxableInv),
        traditionalPlusTaxable: Math.round(tradPlusTaxable),
      });
    }

    return {
      taxableAmount,
      conversionTaxes,
      rothBalanceAtRetirement,
      traditionalBalanceAtRetirement,
      traditionalAfterTax,
      taxableInvestmentBalance,
      taxableInvestmentAfterTax,
      traditionalPlusTaxableInvestment,
      conversionAdvantage,
      conversionAdvantagePercent,
      betterChoice,
      yearsToRetirement: years,
      yearlySeries,
    };
  },

  charts: [
    {
      title: 'After-Tax Value at Retirement',
      type: 'bar',
      height: 350,
      xKey: 'scenario',
      format: 'currency',
      showLegend: false,
      data: (results) => [
        {
          scenario: 'Convert to Roth',
          value: results.rothBalanceAtRetirement || 0,
          color: '#10B981',
        },
        {
          scenario: 'Keep Traditional + Taxable',
          value: results.traditionalPlusTaxableInvestment || 0,
          color: '#3B82F6',
        },
      ],
      bars: [{ key: 'value', name: 'After-Tax Value', fill: 'color' }],
      description: 'What you actually get to spend at retirement',
    },
    {
      title: 'Traditional IRA Breakdown (No Conversion)',
      type: 'bar',
      height: 350,
      xKey: 'component',
      format: 'currency',
      showLegend: false,
      data: (results) => [
        {
          component: 'Traditional IRA (after-tax)',
          value: results.traditionalAfterTax || 0,
          color: '#3B82F6',
        },
        {
          component: 'Taxable Investment (after-tax)',
          value: results.taxableInvestmentAfterTax || 0,
          color: '#8B5CF6',
        },
      ],
      bars: [{ key: 'value', name: 'Value', fill: 'color' }],
      description: 'Components if you keep your traditional IRA',
    },
    {
      title: 'Tax Impact Comparison',
      type: 'bar',
      height: 350,
      xKey: 'scenario',
      format: 'currency',
      showLegend: false,
      data: (results) => [
        {
          scenario: 'Convert to Roth',
          value: results.conversionTaxes || 0,
          color: '#EF4444',
        },
        {
          scenario: 'Keep Traditional',
          value: (results.traditionalBalanceAtRetirement - results.traditionalAfterTax) || 0,
          color: '#F59E0B',
        },
      ],
      bars: [{ key: 'value', name: 'Taxes Paid', fill: 'color' }],
      description: 'Taxes paid now (conversion) vs later (retirement withdrawals)',
    },
    {
      title: 'Growth Over Time',
      type: 'line',
      height: 400,
      xKey: 'age',
      format: 'currency',
      showLegend: true,
      data: (results) => results.yearlySeries || [],
      lines: [
        { key: 'rothBalance', name: 'Roth IRA (tax-free)', stroke: '#10B981' },
        { key: 'traditionalPlusTaxable', name: 'Traditional + Taxable (after-tax)', stroke: '#3B82F6' },
      ],
      description: 'After-tax account values over time',
    },
  ],
};