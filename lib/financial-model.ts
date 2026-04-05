export interface FinancialModel {
  revenue: {
    commission_2pct: number;
    pro_subscriptions: number;
    task_promotions: number;
    total: number;
  };
  expenses: {
    firebase: number;
    cloud_functions: number;
    arbitrator_fees: number;
    marketing: number;
    total: number;
  };
  metrics: {
    monthly_deals: number;
    avg_deal_value_pi: number;
    monthly_subscriptions: number;
    gross_margin: number;
  };
  breakeven_analysis: {
    deals_needed: number;
    monthly_revenue_needed_pi: number;
    current_status: 'profitable' | 'approaching_breakeven' | 'subsidy_needed';
  };
}

export class FinancialModelService {
  static calculateModel(monthlyDeals: number, avgDealValue: number, monthlySubscriptions: number): FinancialModel {
    const commissionRevenue = monthlyDeals * avgDealValue * 0.02;
    const subscriptionRevenue = monthlySubscriptions * 100; // 100 Pi/month
    const promotionRevenue = monthlyDeals * 0.15 * (5 + 3 + 10); // 5Pi boost, 3Pi urgent, 10Pi verification
    const totalRevenue = commissionRevenue + subscriptionRevenue + promotionRevenue;

    const firebaseCost = 125; // midpoint $50-200
    const cloudFunctionsCost = 65; // midpoint $30-100
    const arbitratorCost = monthlyDeals * avgDealValue * 0.02 * 0.10; // 10% of disputes (assume 5% of deals dispute)
    const marketingCost = 500; // Pi/month
    const totalExpenses = firebaseCost + cloudFunctionsCost + arbitratorCost + marketingCost;

    const grossMargin = ((totalRevenue - totalExpenses) / totalRevenue) * 100;
    const breakevenDeals = 500; // 500 deals at 30 Pi avg = breakeven

    return {
      revenue: {
        commission_2pct: commissionRevenue,
        pro_subscriptions: subscriptionRevenue,
        task_promotions: promotionRevenue,
        total: totalRevenue,
      },
      expenses: {
        firebase: firebaseCost,
        cloud_functions: cloudFunctionsCost,
        arbitrator_fees: arbitratorCost,
        marketing: marketingCost,
        total: totalExpenses,
      },
      metrics: {
        monthly_deals: monthlyDeals,
        avg_deal_value_pi: avgDealValue,
        monthly_subscriptions: monthlySubscriptions,
        gross_margin: Math.round(grossMargin),
      },
      breakeven_analysis: {
        deals_needed: breakevenDeals,
        monthly_revenue_needed_pi: breakevenDeals * avgDealValue * 0.02,
        current_status: monthlyDeals >= breakevenDeals ? 'profitable' : 'subsidy_needed',
      },
    };
  }
}
