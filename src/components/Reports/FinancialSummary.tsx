import React from "react";
import { formatCurrency } from "../../utils/calculations";

interface FinancialSummaryProps {
  revenue: number;
  totalExpenses: number;
  profit: number;
  profitMargin: number;
  salesCount: number;
  comparisonData?: {
    revenueChange: number;
    expenseChange: number;
    profitChange: number;
  } | null;
}

const FinancialSummary: React.FC<FinancialSummaryProps> = ({
  revenue,
  totalExpenses,
  profit,
  profitMargin,
  salesCount,
  comparisonData,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    {/* Revenue */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Total Revenue</p>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(revenue)}
          </p>
          {comparisonData && (
            <p
              className={`text-sm ${
                comparisonData.revenueChange >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {comparisonData.revenueChange >= 0 ? "+" : ""}
              {comparisonData.revenueChange.toFixed(1)}% vs previous
            </p>
          )}
        </div>
        <div className="p-3 bg-green-100 rounded-lg">
          <span className="h-6 w-6 text-green-600">$</span>
        </div>
      </div>
    </div>
    {/* Expenses */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Total Expenses</p>
          <p className="text-2xl font-bold text-red-600">
            {formatCurrency(totalExpenses)}
          </p>
          {comparisonData && (
            <p
              className={`text-sm ${
                comparisonData.expenseChange <= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {comparisonData.expenseChange >= 0 ? "+" : ""}
              {comparisonData.expenseChange.toFixed(1)}% vs previous
            </p>
          )}
        </div>
        <div className="p-3 bg-red-100 rounded-lg">
          <span className="h-6 w-6 text-red-600">-</span>
        </div>
      </div>
    </div>
    {/* Profit */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Net Profit</p>
          <p
            className={`text-2xl font-bold ${
              profit >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {formatCurrency(profit)}
          </p>
          {comparisonData && (
            <p
              className={`text-sm ${
                comparisonData.profitChange >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {comparisonData.profitChange >= 0 ? "+" : ""}
              {comparisonData.profitChange.toFixed(1)}% vs previous
            </p>
          )}
        </div>
        <div className="p-3 bg-blue-100 rounded-lg">
          <span className="h-6 w-6 text-blue-600">P</span>
        </div>
      </div>
    </div>
    {/* Profit Margin */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Profit Margin</p>
          <p
            className={`text-2xl font-bold ${
              profitMargin >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {profitMargin.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-500">{salesCount} transactions</p>
        </div>
        <div className="p-3 bg-purple-100 rounded-lg">
          <span className="h-6 w-6 text-purple-600">%</span>
        </div>
      </div>
    </div>
  </div>
);

export default FinancialSummary;
