import React from "react";
import { DashboardSummary } from "./types";
import { formatCurrency } from "../../utils/calculations";

interface MonthlyTrendsChartProps {
  summary: DashboardSummary;
}

const MonthlyTrendsChart: React.FC<MonthlyTrendsChartProps> = ({ summary }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Trends</h3>
    <div className="h-64 flex items-end space-x-2">
      {summary.monthlyTrends.map((month) => (
        <div key={month.month} className="flex-1 flex flex-col items-center">
          <div className="w-full flex flex-col items-center space-y-1">
            <div
              className="w-full bg-blue-500 rounded-t opacity-80 hover:opacity-100 transition-opacity"
              style={{
                height: `${Math.max(
                  (month.revenue /
                    Math.max(...summary.monthlyTrends.map((m) => m.revenue))) * 200,
                  4
                )}px`,
              }}
              title={`Revenue: ${formatCurrency(month.revenue)}`}
            />
            <div
              className="w-full bg-red-500 rounded-b opacity-80 hover:opacity-100 transition-opacity"
              style={{
                height: `${Math.max(
                  (month.expenses /
                    Math.max(...summary.monthlyTrends.map((m) => m.expenses))) * 100,
                  2
                )}px`,
              }}
              title={`Expenses: ${formatCurrency(month.expenses)}`}
            />
          </div>
          <span className="text-xs text-gray-600 mt-2">{month.month}</span>
        </div>
      ))}
    </div>
    <div className="flex items-center justify-center space-x-4 mt-4 text-sm">
      <div className="flex items-center">
        <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
        <span className="text-gray-600">Revenue</span>
      </div>
      <div className="flex items-center">
        <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
        <span className="text-gray-600">Expenses</span>
      </div>
    </div>
  </div>
);

export default MonthlyTrendsChart;
