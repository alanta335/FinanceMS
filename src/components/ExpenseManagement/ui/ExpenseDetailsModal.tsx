// ExpenseManagement UI: Expense Details Modal
import React from "react";
import { Expense } from "../../../types";
import { formatCurrency, formatDate } from "../../../utils/calculations";

type Props = {
  expense: Expense | null;
  onClose: () => void;
};

const ExpenseDetailsModal: React.FC<Props> = ({ expense, onClose }) => {
  if (!expense) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Expense Details
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">{formatDate(expense.date)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Category:</span>
            <span className="font-medium">{expense.category}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Subcategory:</span>
            <span className="font-medium">{expense.subcategory}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Amount:</span>
            <span className="font-medium text-lg">
              {formatCurrency(expense.amount)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Method:</span>
            <span className="font-medium">
              {expense.paymentMethod.toUpperCase()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Vendor:</span>
            <span className="font-medium">{expense.vendor || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status:</span>
            <span
              className={`font-medium ${
                expense.status === "approved"
                  ? "text-green-600"
                  : expense.status === "rejected"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}
            >
              {expense.status.toUpperCase()}
            </span>
          </div>
          {expense.isRecurring && (
            <div className="flex justify-between">
              <span className="text-gray-600">Recurring:</span>
              <span className="font-medium">{expense.recurringFrequency}</span>
            </div>
          )}
          <div>
            <span className="text-gray-600">Description:</span>
            <p className="mt-1 text-sm text-gray-900">{expense.description}</p>
          </div>
          {expense.approvedBy && (
            <div className="flex justify-between">
              <span className="text-gray-600">Approved By:</span>
              <span className="font-medium">{expense.approvedBy}</span>
            </div>
          )}
        </div>
        <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseDetailsModal;
