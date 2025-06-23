import React from "react";
import { formatCurrency, formatDate } from "../../utils/calculations";
import { Sale } from "../../types";

interface RecentSalesProps {
  sales: Sale[];
}

const RecentSales: React.FC<RecentSalesProps> = ({ sales }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Sales</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Date
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Customer
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Amount
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sales.slice(0, 10).map((sale) => (
            <tr key={sale.id}>
              <td className="px-4 py-2 text-sm text-gray-900">
                {formatDate(sale.date)}
              </td>
              <td className="px-4 py-2 text-sm text-gray-900">
                {sale.customerName}
              </td>
              <td className="px-4 py-2 text-sm font-medium text-gray-900">
                {formatCurrency(sale.totalAmount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default RecentSales;
