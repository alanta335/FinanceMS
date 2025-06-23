// Types for Dashboard module
export interface MetricChange {
  value: string;
  type: "positive" | "negative" | "neutral";
}

export interface DashboardSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  topSellingProducts: Array<{
    product: string;
    quantity: number;
    revenue: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    revenue: number;
    expenses: number;
  }>;
}
