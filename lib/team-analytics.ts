export interface TeamDashboardMetrics {
  active_tasks: number;
  active_disputes: number;
  avg_deal_value_pi: number;
  country_breakdown: Record<string, { deals: number; revenue_pi: number; avg_price: number }>;
  daily_deals: number;
  revenue_today_pi: number;
  revenue_week_pi: number;
  revenue_month_pi: number;
}

export class TeamAnalyticsService {
  static async getDashboardMetrics(): Promise<TeamDashboardMetrics> {
    return {
      active_tasks: 0,
      active_disputes: 0,
      avg_deal_value_pi: 30,
      country_breakdown: {
        'PH': { deals: 45, revenue_pi: 1350, avg_price: 30 },
        'NG': { deals: 28, revenue_pi: 560, avg_price: 20 },
        'ID': { deals: 35, revenue_pi: 875, avg_price: 25 },
      },
      daily_deals: 15,
      revenue_today_pi: 450,
      revenue_week_pi: 2800,
      revenue_month_pi: 10500,
    };
  }
}
