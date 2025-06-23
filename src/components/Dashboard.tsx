import React, { useEffect, useState, useCallback } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { storage } from "../utils/storage";
import {
  calculateRevenue,
  calculateExpenses,
  calculateProfit,
  calculateProfitMargin,
  getTopSellingProducts,
  getMonthlyTrends,
} from "../utils/calculations";
import { Sale, Expense } from "../types";
import { DashboardSummary, MetricChange } from "./Dashboard/types";
import { getChange } from "./Dashboard/utils";
import TopSellingProducts from "./Dashboard/TopSellingProducts";
import MonthlyTrendsChart from "./Dashboard/MonthlyTrendsChart";
import RecentActivities from "./Dashboard/RecentActivities";
import MetricsGrid from "./Dashboard/MetricsGrid";

const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary>({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    profitMargin: 0,
    topSellingProducts: [],
    monthlyTrends: [],
  });
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metricChanges, setMetricChanges] = useState<{
    revenue: MetricChange;
    expenses: MetricChange;
    profit: MetricChange;
    margin: MetricChange;
  }>({
    revenue: { value: "+0%", type: "neutral" },
    expenses: { value: "+0%", type: "neutral" },
    profit: { value: "+0%", type: "neutral" },
    margin: { value: "+0%", type: "neutral" },
  });

  // Helper to calculate previous month stats
  const getPrevMonthStats = useCallback(
    (salesData: Sale[], expensesData: Expense[]) => {
      const now = new Date();
      const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const startOfPrevMonth = new Date(
        prevMonth.getFullYear(),
        prevMonth.getMonth(),
        1
      );
      const endOfPrevMonth = new Date(
        prevMonth.getFullYear(),
        prevMonth.getMonth() + 1,
        0
      );
      const prevRevenue = calculateRevenue(salesData, {
        start: startOfPrevMonth,
        end: endOfPrevMonth,
      });
      const prevExpenses = calculateExpenses(expensesData, {
        start: startOfPrevMonth,
        end: endOfPrevMonth,
      });
      const prevProfit = calculateProfit(prevRevenue, prevExpenses);
      const prevProfitMargin = calculateProfitMargin(prevProfit, prevRevenue);
      return { prevRevenue, prevExpenses, prevProfit, prevProfitMargin };
    },
    []
  );

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [salesData, expensesData] = await Promise.all([
        storage.getData<Sale>("sales"),
        storage.getData<Expense>("expenses"),
      ]);
      setSales(salesData);
      setExpenses(expensesData);
      const currentMonth = new Date();
      const startOfMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        1
      );
      const endOfMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0
      );
      const monthlyRevenue = calculateRevenue(salesData, {
        start: startOfMonth,
        end: endOfMonth,
      });
      const monthlyExpenses = calculateExpenses(expensesData, {
        start: startOfMonth,
        end: endOfMonth,
      });
      const monthlyProfit = calculateProfit(monthlyRevenue, monthlyExpenses);
      const profitMargin = calculateProfitMargin(monthlyProfit, monthlyRevenue);
      setSummary({
        totalRevenue: monthlyRevenue,
        totalExpenses: monthlyExpenses,
        netProfit: monthlyProfit,
        profitMargin,
        topSellingProducts: getTopSellingProducts(salesData),
        monthlyTrends: getMonthlyTrends(salesData, expensesData),
      });
      const { prevRevenue, prevExpenses, prevProfit, prevProfitMargin } =
        getPrevMonthStats(salesData, expensesData);
      setMetricChanges({
        revenue: getChange(monthlyRevenue, prevRevenue),
        expenses: getChange(monthlyExpenses, prevExpenses),
        profit: getChange(monthlyProfit, prevProfit),
        margin: getChange(profitMargin, prevProfitMargin, true),
      });
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load dashboard data"
      );
    } finally {
      setLoading(false);
    }
  }, [getPrevMonthStats]);

  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);
      await storage.refreshData();
      await loadData();
    } catch (err) {
      console.error("Error refreshing data:", err);
      setError(err instanceof Error ? err.message : "Failed to refresh data");
    } finally {
      setRefreshing(false);
    }
  }, [loadData]);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadData]);

  if (loading) {
    return (
      <div className="space-y-8 max-w-none">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8 max-w-none">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <h3 className="text-red-800 font-medium">
              Error Loading Dashboard
            </h3>
          </div>
          <p className="text-red-700 mt-2">{error}</p>
          <div className="flex space-x-3 mt-4">
            <button
              onClick={loadData}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600 mt-1">
            Welcome back! Here's your business overview.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh data"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            <span className="text-sm">Refresh</span>
          </button>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <MetricsGrid summary={summary} metricChanges={metricChanges} />

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <MonthlyTrendsChart summary={summary} />
        <TopSellingProducts summary={summary} />
      </div>

      {/* Recent Activities */}
      <RecentActivities sales={sales} expenses={expenses} />
    </div>
  );
};

export default Dashboard;
