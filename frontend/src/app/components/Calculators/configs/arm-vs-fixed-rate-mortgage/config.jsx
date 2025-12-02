import { schema } from './schema';
import { defaults } from './defaults';
import { inputs } from './inputs';
import { results } from './results';

export const config = {
  title: 'ARM vs Fixed-Rate Mortgage Calculator',
  description: 'Compare an adjustable-rate mortgage (ARM) to a fixed-rate mortgage',
  schema,
  defaultValues: defaults,
  inputs,
  results,

  calculate: (data) => {
    // Inputs
    const principal = Number(data.mortgageAmount) || 0;
    const termYears = Number(data.termInYears) || 30;
    const totalMonths = termYears * 12;
    
    const fixedRate = Number(data.fixedInterestRate) / 100 / 12; // monthly rate
    const armInitialRate = Number(data.armInterestRate) / 100 / 12; // monthly rate
    const monthsFixed = Number(data.monthsRateFixed) || 60;
    const expectedAdjustment = Number(data.expectedAdjustment) / 100; // annual adjustment
    const monthsBetweenAdj = Number(data.monthsBetweenAdjustments) || 12;
    const rateCap = Number(data.interestRateCap) / 100 / 12; // monthly cap

    // Helper function: Calculate monthly payment
    const calculatePayment = (principal, rate, months) => {
      if (rate === 0) return principal / months;
      return principal * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
    };

    // Helper function: Calculate remaining balance after n payments
    const calculateBalance = (principal, rate, payment, months) => {
      let balance = principal;
      for (let i = 0; i < months; i++) {
        const interest = balance * rate;
        const principalPaid = payment - interest;
        balance -= principalPaid;
      }
      return Math.max(0, balance);
    };

    // FIXED-RATE MORTGAGE
    const fixedMonthlyPayment = calculatePayment(principal, fixedRate, totalMonths);
    let fixedTotalInterest = (fixedMonthlyPayment * totalMonths) - principal;

    // ARM MORTGAGE - Simulate month by month
    let armBalance = principal;
    let armTotalInterest = 0;
    let currentArmRate = armInitialRate;
    let armMonthlyPayment = calculatePayment(armBalance, currentArmRate, totalMonths);
    const armInitialMonthlyPayment = armMonthlyPayment;
    let monthsUntilAdjustment = monthsFixed;
    let maxPayment = armMonthlyPayment;

    const monthlySeries = [];

    for (let month = 1; month <= totalMonths && armBalance > 0.01; month++) {
      // Check if we need to adjust the rate
      if (month > monthsFixed && monthsUntilAdjustment === 0) {
        // Adjust the rate
        const annualAdjustment = expectedAdjustment * (monthsBetweenAdj / 12);
        currentArmRate = Math.min(currentArmRate + (annualAdjustment / 12), rateCap);
        
        // Recalculate payment with new rate for remaining months
        const remainingMonths = totalMonths - month + 1;
        armMonthlyPayment = calculatePayment(armBalance, currentArmRate, remainingMonths);
        maxPayment = Math.max(maxPayment, armMonthlyPayment);
        
        // Reset counter
        monthsUntilAdjustment = monthsBetweenAdj;
      }

      // Make payment
      const interest = armBalance * currentArmRate;
      const principalPaid = Math.min(armMonthlyPayment - interest, armBalance);
      
      armTotalInterest += interest;
      armBalance -= principalPaid;

      monthsUntilAdjustment--;

      // Track for chart (every 12 months)
      if (month % 12 === 0) {
        const year = month / 12;
        const fixedBalance = calculateBalance(principal, fixedRate, fixedMonthlyPayment, month);
        
        monthlySeries.push({
          year,
          fixedBalance: Math.round(fixedBalance),
          armBalance: Math.round(armBalance),
          fixedPayment: Math.round(fixedMonthlyPayment),
          armPayment: Math.round(armMonthlyPayment),
          armRate: currentArmRate * 12 * 100, // convert to annual %
        });
      }
    }

    // Calculate ARM at rate cap for max payment
    const armMaxMonthlyPayment = calculatePayment(principal, rateCap, totalMonths);

    // Comparison
    const initialSavings = fixedMonthlyPayment - armInitialMonthlyPayment;
    const totalInterestDifference = armTotalInterest - fixedTotalInterest;
    const betterChoice = totalInterestDifference < 0 ? "ARM" : "Fixed-Rate";
    const armFinalRate = currentArmRate * 12 * 100; // convert to annual %

    return {
      fixedMonthlyPayment,
      armInitialMonthlyPayment,
      initialSavings,
      fixedTotalInterest,
      armTotalInterest,
      totalInterestDifference,
      armFinalRate,
      armMaxMonthlyPayment,
      betterChoice,
      monthlySeries,
    };
  },

  charts: [
    {
      title: 'Monthly Payment Comparison',
      type: 'bar',
      height: 350,
      xKey: 'type',
      format: 'currency',
      showLegend: false,
      data: (results) => [
        {
          type: 'Fixed-Rate (constant)',
          value: results.fixedMonthlyPayment || 0,
          color: '#3B82F6',
        },
        {
          type: 'ARM (initial)',
          value: results.armInitialMonthlyPayment || 0,
          color: '#10B981',
        },
        {
          type: 'ARM (max possible)',
          value: results.armMaxMonthlyPayment || 0,
          color: '#EF4444',
        },
      ],
      bars: [{ key: 'value', name: 'Monthly Payment', fill: 'color' }],
      description: 'Compare initial and potential maximum monthly payments',
    },
    {
      title: 'Total Interest Paid',
      type: 'bar',
      height: 350,
      xKey: 'type',
      format: 'currency',
      showLegend: false,
      data: (results) => [
        {
          type: 'Fixed-Rate',
          value: results.fixedTotalInterest || 0,
          color: '#3B82F6',
        },
        {
          type: 'ARM',
          value: results.armTotalInterest || 0,
          color: '#10B981',
        },
      ],
      bars: [{ key: 'value', name: 'Total Interest', fill: 'color' }],
      description: 'Total interest paid over the life of each loan',
    },
    {
      title: 'Loan Balance Over Time',
      type: 'line',
      height: 400,
      xKey: 'year',
      format: 'currency',
      showLegend: true,
      data: (results) => results.monthlySeries || [],
      lines: [
        { key: 'fixedBalance', name: 'Fixed-Rate Balance', stroke: '#3B82F6' },
        { key: 'armBalance', name: 'ARM Balance', stroke: '#10B981' },
      ],
      description: 'How the remaining balance decreases over time',
    },
    {
      title: 'Monthly Payment Over Time',
      type: 'line',
      height: 400,
      xKey: 'year',
      format: 'currency',
      showLegend: true,
      data: (results) => results.monthlySeries || [],
      lines: [
        { key: 'fixedPayment', name: 'Fixed-Rate Payment', stroke: '#3B82F6' },
        { key: 'armPayment', name: 'ARM Payment', stroke: '#10B981' },
      ],
      description: 'How monthly payments change over the loan term',
    },
  ],
};