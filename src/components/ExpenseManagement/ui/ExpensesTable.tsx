// ExpenseManagement UI: Expenses Table
import React from "react";
import { formatCurrency, formatDate } from "../../../utils/calculations";
import { Eye, Trash2 } from "lucide-react";
import { Expense } from "../../../types";

type Props = {
  expenses: Expense[];
  onView: (expense: Expense) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
};

const ExpensesTable: React.FC<Props> = ({
  expenses,
  onView,
  onApprove,
  onReject,
  onDelete,
}) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vendor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Payment
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {expenses.map((expense) => (
            <tr key={expense.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatDate(expense.date)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {expense.category}
                  </div>
                  <div className="text-sm text-gray-500">
                    {expense.subcategory}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div
                  className="text-sm text-gray-900 max-w-xs truncate"
                  title={expense.description}
                >
                  {expense.description}
                </div>
                {expense.isRecurring && (
                  <div className="text-xs text-blue-600 font-medium">
                    Recurring ({expense.recurringFrequency})
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {formatCurrency(expense.amount)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {expense.vendor || "N/A"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    expense.paymentMethod === "cash"
                      ? "bg-green-100 text-green-800"
                      : expense.paymentMethod === "card"
                      ? "bg-blue-100 text-blue-800"
                      : expense.paymentMethod === "cheque"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {expense.paymentMethod.toUpperCase()}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    expense.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : expense.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {expense.status.toUpperCase()}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onView(expense)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  {expense.status === "pending" && (
                    <>
                      <button
                        onClick={() => onApprove(expense.id)}
                        className="text-green-600 hover:text-green-900"
                        title="Approve"
                      >
                        ✓
                      </button>
                      <button
                        onClick={() => onReject(expense.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Reject"
                      >
                        ✗
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => onDelete(expense.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default ExpensesTable;
