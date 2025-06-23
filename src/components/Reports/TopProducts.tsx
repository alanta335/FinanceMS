import React from "react";
import { formatCurrency } from "../../utils/calculations";

interface TopProductsProps {
  topProducts: Array<{ product: string; quantity: number; revenue: number }>;
}

const TopProducts: React.FC<TopProductsProps> = ({ topProducts }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">
      Top Selling Products
    </h3>
    <div className="space-y-3">
      {topProducts.length > 0 ? (
        topProducts.map((product, index) => (
          <div
            key={product.product}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-600 font-medium text-sm">
                  {index + 1}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{product.product}</p>
                <p className="text-sm text-gray-600">
                  {product.quantity} units sold
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">
                {formatCurrency(product.revenue)}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center py-8">
          No sales data available for this period
        </p>
      )}
    </div>
  </div>
);

export default TopProducts;
