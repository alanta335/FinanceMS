import React from "react";
import { Users, Award, DollarSign } from "lucide-react";

interface SummaryCardsProps {
  total: number;
  active: number;
  budget: number;
  formatCurrency: (n: number) => string;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ total, active, budget, formatCurrency }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Total Employees</p>
          <p className="text-2xl font-bold text-gray-900">{total}</p>
        </div>
        <div className="p-3 bg-blue-100 rounded-lg">
          <Users className="h-6 w-6 text-blue-600" />
        </div>
      </div>
    </div>
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Active Employees</p>
          <p className="text-2xl font-bold text-green-600">{active}</p>
        </div>
        <div className="p-3 bg-green-100 rounded-lg">
          <Award className="h-6 w-6 text-green-600" />
        </div>
      </div>
    </div>
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Monthly Salary Budget</p>
          <p className="text-2xl font-bold text-purple-600">{formatCurrency(budget)}</p>
        </div>
        <div className="p-3 bg-purple-100 rounded-lg">
          <DollarSign className="h-6 w-6 text-purple-600" />
        </div>
      </div>
    </div>
  </div>
);

export default SummaryCards;
