// ExpenseManagement UI: SummaryCards
import React from "react";
import { formatCurrency } from "../../../utils/calculations";
import { TrendingDown, Calendar, Filter } from "lucide-react";

type Props = {
  total: number;
  approved: number;
  pending: number;
};

const SummaryCards: React.FC<Props> = ({ total, approved, pending }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Total Expenses</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(total)}
          </p>
        </div>
        <div className="p-3 bg-red-100 rounded-lg">
          <TrendingDown className="h-6 w-6 text-red-600" />
        </div>
      </div>
    </div>
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Approved</p>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(approved)}
          </p>
        </div>
        <div className="p-3 bg-green-100 rounded-lg">
          <Calendar className="h-6 w-6 text-green-600" />
        </div>
      </div>
    </div>
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Pending Approval</p>
          <p className="text-2xl font-bold text-yellow-600">
            {formatCurrency(pending)}
          </p>
        </div>
        <div className="p-3 bg-yellow-100 rounded-lg">
          <Filter className="h-6 w-6 text-yellow-600" />
        </div>
      </div>
    </div>
  </div>
);

export default SummaryCards;
