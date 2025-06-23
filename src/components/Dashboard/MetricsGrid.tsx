import React from "react";
import MetricCard from "./MetricCard";
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag } from "lucide-react";
import { DashboardSummary, MetricChange } from "./types";
import { formatCurrency } from "../../utils/calculations";

interface MetricsGridProps {
  summary: DashboardSummary;
  metricChanges: {
    revenue: MetricChange;
    expenses: MetricChange;
    profit: MetricChange;
    margin: MetricChange;
  };
}

const MetricsGrid: React.FC<MetricsGridProps> = ({ summary, metricChanges }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <MetricCard
      title="Total Revenue"
      value={formatCurrency(summary.totalRevenue)}
      change={metricChanges.revenue.value}
      changeType={metricChanges.revenue.type}
      icon={<TrendingUp className="h-6 w-6 text-white" />}
      color="bg-green-500"
    />
    <MetricCard
      title="Total Expenses"
      value={formatCurrency(summary.totalExpenses)}
      change={metricChanges.expenses.value}
      changeType={metricChanges.expenses.type}
      icon={<TrendingDown className="h-6 w-6 text-white" />}
      color="bg-red-500"
    />
    <MetricCard
      title="Net Profit"
      value={formatCurrency(summary.netProfit)}
      change={metricChanges.profit.value}
      changeType={metricChanges.profit.type}
      icon={<DollarSign className="h-6 w-6 text-white" />}
      color="bg-blue-500"
    />
    <MetricCard
      title="Profit Margin"
      value={`${summary.profitMargin.toFixed(1)}%`}
      change={metricChanges.margin.value}
      changeType={metricChanges.margin.type}
      icon={<ShoppingBag className="h-6 w-6 text-white" />}
      color="bg-purple-500"
    />
  </div>
);

export default MetricsGrid;
