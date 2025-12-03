import { schema } from './schema';
import { defaults } from './defaults';
import { inputs } from './inputs';
import { results } from './results';

export const config = {
  title: 'Lease vs Buy Calculator',
  description: 'Compare the true costs of leasing versus buying a vehicle to make the best financial decision',
  schema,
  defaultValues: defaults,
  inputs,
  results,

  calculate: (data) => {
    // ===== INPUTS =====
    const price = Number(data.purchasePrice) || 0;
    const downPayment = Number(data.downPayment) || 0;
    const salesTaxRate = (Number(data.salesTaxRate) || 0) / 100;
    const investReturnRate = (Number(data.investmentReturnRate) || 0) / 100;
    
    // BUY OPTION
    const loanTermMonths = Number(data.loanTermMonths) || 60;
    const loanApr = (Number(data.loanInterestRate) || 0) / 100;
    const buyOtherFees = Number(data.buyOtherFees) || 0;
    const depreciationRate = (Number(data.annualDepreciationRate) || 0) / 100;
    
    // LEASE OPTION
    const leaseTermMonths = Number(data.leaseTermMonths) || 36;
    const leaseApr = (Number(data.leaseInterestRate) || 0) / 100;
    const leaseOtherFees = Number(data.leaseOtherFees) || 0;
    const residualPercent = (Number(data.residualPercent) || 0) / 100;
    const securityDeposit = Number(data.securityDeposit) || 0;

    const comparisonMonths = leaseTermMonths;
    const years = comparisonMonths / 12;

    // ===== HELPER FUNCTIONS =====
    const round2 = (x) => Math.round(x * 100) / 100;

    function pmt(principal, monthlyRate, n) {
      if (n <= 0) return 0;
      if (monthlyRate === 0) return principal / n;
      return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));
    }

    function remainingBalance(principal, monthlyRate, n, k) {
      if (k >= n) return 0;
      if (monthlyRate === 0) {
        return principal * (1 - k / n);
      }
      const payment = pmt(principal, monthlyRate, n);
      return principal * Math.pow(1 + monthlyRate, k) - 
             payment * ((Math.pow(1 + monthlyRate, k) - 1) / monthlyRate);
    }

    // ===== BUY CALCULATIONS =====
    // Sales tax applied to full price
    const salesTax = price * salesTaxRate;
    const buyLoanAmount = price + salesTax - downPayment;
    const buyMonthlyRate = loanApr / 12;
    const buyMonthlyPayment = pmt(buyLoanAmount, buyMonthlyRate, loanTermMonths);
    
    const totalLoanPayments = buyMonthlyPayment * Math.min(comparisonMonths, loanTermMonths);
    const endingLoanBalance = remainingBalance(buyLoanAmount, buyMonthlyRate, loanTermMonths, comparisonMonths);
    const marketValue = price * Math.pow(1 - depreciationRate, years);

    // ===== LEASE CALCULATIONS =====
    // Net cap cost = price - down payment (other fees NOT included in cap cost)
    const netCapCost = price - downPayment;
    const residualValue = price * residualPercent;
    const leaseMonthlyRate = leaseApr / 12;
    
    // Depreciation
    const monthlyDepreciation = (netCapCost - residualValue) / leaseTermMonths;
    
    // Finance charge (rent charge) - calculated on average value
    const avgValue = (netCapCost + residualValue) / 2;
    const monthlyFinanceCharge = avgValue * leaseMonthlyRate;
    
    // Sales tax applied to entire lease payment
    const leasePaymentBeforeTax = monthlyDepreciation + monthlyFinanceCharge;
    const leaseMonthlyPayment = leasePaymentBeforeTax * (1 + salesTaxRate);
    
    const totalLeasePayments = leaseMonthlyPayment * leaseTermMonths;

    // ===== OPPORTUNITY COST CALCULATIONS =====
    const monthlyInvestRate = investReturnRate / 12;
    
    // Payment difference (buy - lease)
    const paymentDifference = buyMonthlyPayment - leaseMonthlyPayment;
    
    // BUY OPTION LOST INTEREST
    // Lost interest on upfront costs
    const buyUpfrontCash = downPayment + buyOtherFees;
    let lostInterestBuy = 0;
    
    if (monthlyInvestRate > 0) {
      // Interest lost on upfront cash
      if (buyUpfrontCash > 0) {
        lostInterestBuy += buyUpfrontCash * (Math.pow(1 + monthlyInvestRate, comparisonMonths) - 1);
      }
      
      // If buy payment > lease payment, add lost interest on the difference
      if (paymentDifference > 0) {
        const fv = paymentDifference * ((Math.pow(1 + monthlyInvestRate, comparisonMonths) - 1) / monthlyInvestRate);
        lostInterestBuy += fv - (paymentDifference * comparisonMonths);
      }
      // If lease payment > buy payment, subtract earned interest on the difference
      else if (paymentDifference < 0) {
        const absDiff = Math.abs(paymentDifference);
        const fv = absDiff * ((Math.pow(1 + monthlyInvestRate, comparisonMonths) - 1) / monthlyInvestRate);
        const earnedInterest = fv - (absDiff * comparisonMonths);
        lostInterestBuy -= earnedInterest;
      }
    }
    
    // LEASE OPTION LOST INTEREST
    // Lost interest on upfront costs (down payment + fees + security deposit)
    const leaseUpfrontCash = downPayment + leaseOtherFees + securityDeposit;
    let lostInterestLease = 0;
    
    if (monthlyInvestRate > 0 && leaseUpfrontCash > 0) {
      lostInterestLease = leaseUpfrontCash * (Math.pow(1 + monthlyInvestRate, comparisonMonths) - 1);
    }

    // ===== NET COSTS =====
    const netCostBuy = downPayment + buyOtherFees + totalLoanPayments + 
                       lostInterestBuy + endingLoanBalance - marketValue;
    
    const netCostLease = downPayment + leaseOtherFees + totalLeasePayments + lostInterestLease;

    // ===== BREAKDOWNS =====
    const breakdown = [
      { label: "Down payment", value: round2(downPayment) },
      { label: "Other fees", value: round2(buyOtherFees) },
      { label: "Loan payments", value: round2(totalLoanPayments) },
      { label: "Lost interest", value: round2(lostInterestBuy) },
      { label: "Ending loan balance", value: round2(endingLoanBalance) },
      { label: "Market value (credit)", value: round2(-marketValue) },
      { label: "Net cost", value: round2(netCostBuy) },
    ];

    const leaseBreakdown = [
      { label: "Capital reduction", value: round2(downPayment) },
      { label: "Other fees", value: round2(leaseOtherFees) },
      { label: "Lease payments", value: round2(totalLeasePayments) },
      { label: "Lost interest", value: round2(lostInterestLease) },
      { label: "Net cost", value: round2(netCostLease) },
    ];

    const betterChoice = netCostBuy < netCostLease ? "Buy" : "Lease";
    const difference = Math.abs(netCostBuy - netCostLease);

    return {
      // Monthly payments
      buyMonthlyPayment: round2(buyMonthlyPayment),
      leaseMonthlyPayment: round2(leaseMonthlyPayment),
      
      // Buy details
      buyLoanAmount: round2(buyLoanAmount),
      salesTax: round2(salesTax),
      totalLoanPayments: round2(totalLoanPayments),
      buyTotalLostInterest: round2(lostInterestBuy),
      endingLoanBalance: round2(endingLoanBalance),
      marketValue: round2(marketValue),
      
      // Lease details
      totalLeasePayments: round2(totalLeasePayments),
      leaseTotalLostInterest: round2(lostInterestLease),
      
      // Net costs
      netCostBuy: round2(netCostBuy),
      buyNetCost: round2(netCostBuy),
      netCostLease: round2(netCostLease),
      leaseNetCost: round2(netCostLease),
      
      // Comparison
      betterChoice,
      difference: round2(difference),
      
      // Breakdowns
      breakdown,
      leaseBreakdown,
    };
  },

  charts: [
    {
      title: 'Total Net Cost Comparison',
      type: 'bar',
      height: 350,
      xKey: 'option',
      format: 'currency',
      showLegend: false,
      data: (results) => [
        { option: 'Buy', value: results.netCostBuy },
        { option: 'Lease', value: results.netCostLease },
      ],
      bars: [
        { key: 'value', name: 'Net Cost', color: '#3B82F6' }
      ],
      description: 'Total net cost comparison over the lease term'
    },
    {
      title: 'Monthly Payment Comparison',
      type: 'bar',
      height: 300,
      xKey: 'option',
      format: 'currency',
      showLegend: false,
      data: (results) => [
        { option: 'Buy', value: results.buyMonthlyPayment },
        { option: 'Lease', value: results.leaseMonthlyPayment },
      ],
      bars: [
        { key: 'value', name: 'Monthly Payment', color: '#10B981' }
      ],
      description: 'Monthly payment comparison'
    },
    {
      title: 'Cost Breakdown Comparison',
      type: 'bar',
      height: 400,
      xKey: 'category',
      format: 'currency',
      showLegend: true,
      data: (results) => [
        { 
          category: 'Upfront Costs', 
          'Buy': results.breakdown[0].value + results.breakdown[1].value,
          'Lease': results.leaseBreakdown[0].value + results.leaseBreakdown[1].value
        },
        { 
          category: 'Payments', 
          'Buy': results.totalLoanPayments,
          'Lease': results.totalLeasePayments
        },
        { 
          category: 'Lost Interest', 
          'Buy': results.buyTotalLostInterest,
          'Lease': results.leaseTotalLostInterest
        },
      ],
      bars: [
        { key: 'Buy', name: 'Buy', color: '#3B82F6' },
        { key: 'Lease', name: 'Lease', color: '#10B981' }
      ],
      description: 'Detailed cost breakdown by category'
    },
  ]
};