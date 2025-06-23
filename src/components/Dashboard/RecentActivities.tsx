import React from "react";
import { Sale, Expense } from "../../types";
import { formatCurrency } from "../../utils/calculations";
import { TrendingUp, TrendingDown } from "lucide-react";

interface RecentActivitiesProps {
  sales: Sale[];
  expenses: Expense[];
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ sales, expenses }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activities</h3>
    <div className="space-y-4">
      {sales.slice(0, 5).map((sale) => (
        <div
          key={sale.id}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                Sale: {sale.product.brand} {sale.product.model}
              </p>
              <p className="text-sm text-gray-600">
                {sale.customerName} • {new Date(sale.date).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold text-green-600">{formatCurrency(sale.totalAmount)}</p>
            <p className="text-sm text-gray-600">{sale.paymentMethod.toUpperCase()}</p>
          </div>
        </div>
      ))}
      {expenses.slice(0, 3).map((expense) => (
        <div
          key={expense.id}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
        >
          <div className="flex items-center">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
              <TrendingDown className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Expense: {expense.category}</p>
              <p className="text-sm text-gray-600">
                {expense.description} • {new Date(expense.date).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold text-red-600">-{formatCurrency(expense.amount)}</p>
            <p className="text-sm text-gray-600">{expense.paymentMethod.toUpperCase()}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default RecentActivities;
