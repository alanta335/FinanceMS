import React from "react";
import { formatCurrency } from "../../utils/calculations";

interface SalesByPaymentMethodProps {
  salesByPaymentMethod: Array<{
    method: string;
    amount: number;
    count: number;
  }>;
  totalRevenue: number;
}

const SalesByPaymentMethod: React.FC<SalesByPaymentMethodProps> = ({
  salesByPaymentMethod,
  totalRevenue,
}) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">
      Sales by Payment Method
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {salesByPaymentMethod.map((payment) => (
        <div key={payment.method} className="p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 uppercase">
              {payment.method}
            </p>
            <p className="text-xl font-bold text-gray-900 mt-1">
              {formatCurrency(payment.amount)}
            </p>
            <p className="text-sm text-gray-500">
              {payment.count} transactions
            </p>
            <p className="text-sm text-blue-600">
              {((payment.amount / totalRevenue) * 100).toFixed(1)}% of total
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default SalesByPaymentMethod;
