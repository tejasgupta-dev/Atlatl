import { schema } from './schema';
import { defaults } from './defaults';
import { inputs } from './inputs';
import { results } from './results';

export const config = {
  title: '1031 Exchange Calculator',
  description: 'Calculate tax deferral benefits and reinvestment requirements for like-kind property exchanges',
  schema,
  defaultValues: defaults,
  inputs,
  results,

  calculate: (data) => {
    const round2 = (x) => Math.round(x * 100) / 100;

    // ===== PROPERTY SOLD (RELINQUISHED) =====
    const salesPrice = Number(data.salesPrice) || 0;
    const salesCosts = Number(data.salesCosts) || 0;
    const liabilitiesSold = Number(data.liabilitiesSold) || 0;
    const adjustedBasis = Number(data.adjustedBasis) || 0;
    
    const netSale = salesPrice - salesCosts;
    const netCashReceived = netSale - liabilitiesSold;

    // ===== PROPERTY PURCHASED (REPLACEMENT) =====
    const purchasePrice = Number(data.purchasePrice) || 0;
    const purchaseCosts = Number(data.purchaseCosts) || 0;
    const liabilitiesPurchased = Number(data.liabilitiesPurchased) || 0;
    
    const netCostPurchased = purchasePrice + purchaseCosts;
    const netCashReinvested = netCostPurchased - liabilitiesPurchased;

    // ===== RECOGNIZED GAIN CALCULATION (BOOT) =====
    // Per Dinkytown: "any amount purchased less than the net sale OR any amount of cash taken"
    // Boot is the MAXIMUM of:
    // 1. Trading down: Net Sale - Net Cost Purchased
    // 2. Cash boot: Net Cash Received - Net Cash Reinvested
    
    const tradingDown = Math.max(0, netSale - netCostPurchased);
    const cashBoot = Math.max(0, netCashReceived - netCashReinvested);
    const boot = Math.max(tradingDown, cashBoot);
    
    // Total gain on sale (if no 1031 exchange)
    const totalGain = netSale - adjustedBasis;
    
    // Recognized gain (taxable) - limited to actual gain
    const recognizedGain = Math.min(boot, Math.max(0, totalGain));
    
    // Deferred gain
    const deferredGain = Math.max(0, totalGain - recognizedGain);

    // ===== NEW BASIS CALCULATION =====
    // Per Dinkytown: "This is the original adjusted basis plus any amount purchased greater than the net sale"
    // New Basis = Old Basis + (Net Cost Purchased - Net Sale)
    // This is equivalent to: Old Basis + Cash Added - Boot Received
    const newBasis = adjustedBasis + (netCostPurchased - netSale);

    // ===== EXCHANGE QUALIFICATION =====
    let daysToComplete = null;
    let withinTimeframe = false;
    
    if (data.dateOfSale && data.dateOfPurchase && 
        data.dateOfSale !== '' && data.dateOfPurchase !== '') {
      const saleDate = new Date(data.dateOfSale);
      const purchaseDate = new Date(data.dateOfPurchase);
      daysToComplete = Math.round((purchaseDate - saleDate) / (1000 * 60 * 60 * 24));
      withinTimeframe = daysToComplete >= 0 && daysToComplete <= 180;
    }

    // Qualification status
    let exchangeQualifies = 'Not Determined';
    if (daysToComplete !== null) {
      if (withinTimeframe && boot === 0) {
        exchangeQualifies = 'Qualifies for Full Deferral';
      } else if (withinTimeframe && boot > 0) {
        exchangeQualifies = 'Partial Deferral (Boot Recognized)';
      } else if (!withinTimeframe) {
        exchangeQualifies = 'Does Not Qualify (Exceeds 180 Days)';
      }
    }

    return {
      // Sale calculations
      netSale: round2(netSale),
      netCashReceived: round2(netCashReceived),
      
      // Purchase calculations
      netCostPurchased: round2(netCostPurchased),
      netCashReinvested: round2(netCashReinvested),
      
      // Boot/gain calculations
      tradingDown: round2(tradingDown),
      cashBoot: round2(cashBoot),
      boot: round2(boot),
      totalGain: round2(totalGain),
      recognizedGain: round2(recognizedGain),
      deferredGain: round2(deferredGain),
      
      // Basis
      newBasis: round2(newBasis),
      
      // Exchange qualification
      exchangeQualifies,
      daysToComplete,
      withinTimeframe,

      // Breakdowns for display
      saleBreakdown: [
        { label: 'Sales Price', value: round2(salesPrice) },
        { label: 'Less: Sales Costs, Commissions and Exchange Fee', value: round2(-salesCosts) },
        { label: 'Net Sale for Property Sold', value: round2(netSale) },
        { label: 'Less: Liabilities/Mortgages', value: round2(-liabilitiesSold) },
        { label: 'Net Cash Received', value: round2(netCashReceived) },
      ],

      purchaseBreakdown: [
        { label: 'Purchase Price', value: round2(purchasePrice) },
        { label: 'Plus: Purchase Costs and Commissions', value: round2(purchaseCosts) },
        { label: 'Net Cost for Property Purchased', value: round2(netCostPurchased) },
        { label: 'Less: Liabilities/Mortgages', value: round2(-liabilitiesPurchased) },
        { label: 'Net Cash Reinvested', value: round2(netCashReinvested) },
      ],

      gainBreakdown: [
        { label: 'Net Sale', value: round2(netSale) },
        { label: 'Less: Adjusted Cost Basis', value: round2(-adjustedBasis) },
        { label: 'Total Gain on Sale', value: round2(totalGain) },
        { label: 'Recognized Gain (Boot)', value: round2(recognizedGain) },
        { label: 'Deferred Gain', value: round2(deferredGain) },
      ],

      notes: [
        daysToComplete !== null 
          ? `Exchange timeframe: ${daysToComplete} days (must be ≤180 days)` 
          : 'Enter sale and purchase dates to validate exchange timeframe',
        exchangeQualifies,
        boot === 0 
          ? 'No boot - all proceeds reinvested for full tax deferral' 
          : `Boot recognized: $${boot.toLocaleString()} (taxable)`,
        tradingDown > 0 
          ? `Trading down: $${tradingDown.toLocaleString()} (purchased less than sold)` 
          : '',
        cashBoot > 0 
          ? `Cash boot: $${cashBoot.toLocaleString()} (cash not reinvested)` 
          : '',
        `To avoid all taxes: Purchase ≥ $${netSale.toLocaleString()} AND reinvest all $${netCashReceived.toLocaleString()}`,
        `New basis in replacement property: $${newBasis.toLocaleString()}`,
      ].filter(note => note !== ''),
    };
  },

  charts: [
    {
      title: 'Gain Disposition',
      type: 'bar',
      height: 350,
      xKey: 'type',
      format: 'currency',
      showLegend: false,
      data: (results) => [
        { 
          type: 'Deferred Gain', 
          value: results.deferredGain,
          color: '#10B981'
        },
        { 
          type: 'Recognized Gain (Boot)', 
          value: results.recognizedGain,
          color: '#F59E0B'
        },
      ],
      bars: [
        { key: 'value', name: 'Gain Amount', color: '#10B981' }
      ],
      description: 'Breakdown of total gain: deferred vs. recognized (taxable)'
    },
    {
      title: 'Cash Flow Analysis',
      type: 'bar',
      height: 350,
      xKey: 'item',
      format: 'currency',
      showLegend: false,
      data: (results) => [
        { 
          item: 'Cash Received from Sale', 
          value: results.netCashReceived,
          color: '#3B82F6'
        },
        { 
          item: 'Cash Reinvested in Purchase', 
          value: results.netCashReinvested,
          color: '#10B981'
        },
        { 
          item: 'Boot (Not Reinvested)', 
          value: results.boot,
          color: '#F59E0B'
        },
      ],
      bars: [
        { key: 'value', name: 'Amount', color: '#3B82F6' }
      ],
      description: 'Cash flow from sale and reinvestment in replacement property'
    },
    {
      title: 'Property Value Comparison',
      type: 'bar',
      height: 350,
      xKey: 'property',
      format: 'currency',
      showLegend: false,
      data: (results) => [
        { 
          property: 'Property Sold (Net)', 
          value: results.netSale,
          color: '#EF4444'
        },
        { 
          property: 'Property Purchased (Net)', 
          value: results.netCostPurchased,
          color: '#10B981'
        },
      ],
      bars: [
        { key: 'value', name: 'Net Value', color: '#3B82F6' }
      ],
      description: 'Comparison of net sale vs. net purchase value'
    },
  ]
};