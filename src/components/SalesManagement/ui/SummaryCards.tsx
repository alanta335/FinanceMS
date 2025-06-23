import React from "react";
import { formatCurrency } from "../../../utils/calculations";
import { CurrencyRupeeIcon, ShoppingBagIcon, StarIcon } from "@heroicons/react/24/solid";

interface SummaryCardsProps {
  totalSales: number;
  totalQuantity: number;
  totalCommission: number;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalSales,
  totalQuantity,
  totalCommission,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Total Sales</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(totalSales)}
          </p>
        </div>
        <div className="p-3 bg-blue-100 rounded-lg">
          <CurrencyRupeeIcon className="h-7 w-7 text-blue-500" />
        </div>
      </div>
    </div>
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">
            Total Quantity Sold
          </p>
          <p className="text-2xl font-bold text-green-600">{totalQuantity}</p>
        </div>
        <div className="p-3 bg-green-100 rounded-lg">
          <ShoppingBagIcon className="h-7 w-7 text-green-500" />
        </div>
      </div>
    </div>
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Total Commission</p>
          <p className="text-2xl font-bold text-yellow-600">
            {formatCurrency(totalCommission)}
          </p>
        </div>
        <div className="p-3 bg-yellow-100 rounded-lg">
          <StarIcon className="h-7 w-7 text-yellow-500" />
        </div>
      </div>
    </div>
  </div>
);

export default SummaryCards;
