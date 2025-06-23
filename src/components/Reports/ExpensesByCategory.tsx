import React from "react";
import { formatCurrency } from "../../utils/calculations";

interface ExpensesByCategoryProps {
  expensesByCategory: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
}

const ExpensesByCategory: React.FC<ExpensesByCategoryProps> = ({
  expensesByCategory,
}) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">
      Expenses by Category
    </h3>
    <div className="space-y-3">
      {expensesByCategory.length > 0 ? (
        expensesByCategory.map((expense, index) => (
          <div
            key={expense.category}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-red-600 font-medium text-sm">
                  {index + 1}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900 capitalize">
                  {expense.category}
                </p>
                <p className="text-sm text-gray-600">
                  {expense.percentage.toFixed(1)}% of total
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">
                {formatCurrency(expense.amount)}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center py-8">
          No expense data available for this period
        </p>
      )}
    </div>
  </div>
);

export default ExpensesByCategory;
