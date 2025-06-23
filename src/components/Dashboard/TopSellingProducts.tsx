import React from "react";
import { ShoppingBag } from "lucide-react";
import { DashboardSummary } from "./types";
import { formatCurrency } from "../../utils/calculations";

interface TopSellingProductsProps {
  summary: DashboardSummary;
}

const TopSellingProducts: React.FC<TopSellingProductsProps> = ({ summary }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Selling Products</h3>
    <div className="space-y-4">
      {summary.topSellingProducts.length > 0 ? (
        summary.topSellingProducts.map((product, index) => (
          <div
            key={product.product}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-600 font-medium text-sm">{index + 1}</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{product.product}</p>
                <p className="text-sm text-gray-600">{product.quantity} units sold</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">{formatCurrency(product.revenue)}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No sales data available</p>
        </div>
      )}
    </div>
  </div>
);

export default TopSellingProducts;
