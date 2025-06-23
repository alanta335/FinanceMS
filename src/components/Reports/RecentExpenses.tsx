import React from "react";
import { formatCurrency, formatDate } from "../../utils/calculations";
import { Expense } from "../../types";

interface RecentExpensesProps {
  expenses: Expense[];
}

const RecentExpenses: React.FC<RecentExpensesProps> = ({ expenses }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">
      Recent Expenses
    </h3>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Date
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Category
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Amount
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {expenses.slice(0, 10).map((expense) => (
            <tr key={expense.id}>
              <td className="px-4 py-2 text-sm text-gray-900">
                {formatDate(expense.date)}
              </td>
              <td className="px-4 py-2 text-sm text-gray-900 capitalize">
                {expense.category}
              </td>
              <td className="px-4 py-2 text-sm font-medium text-gray-900">
                {formatCurrency(expense.amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default RecentExpenses;
