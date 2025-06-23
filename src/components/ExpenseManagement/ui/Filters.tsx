// ExpenseManagement UI: Filters and Search
import React from "react";
import { Search, Download } from "lucide-react";

type ExpenseCategory = {
  value: string;
  label: string;
  subcategories: string[];
};

type FiltersType = {
  category: string;
  status: string;
  paymentMethod: string;
  dateRange?: string;
};

type Props = {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  filters: FiltersType;
  setFilters: (v: FiltersType) => void;
  expenseCategories: ExpenseCategory[];
  exportToCSV: () => void;
};

const Filters: React.FC<Props> = ({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  expenseCategories,
  exportToCSV,
}) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search expenses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <select
        value={filters.category}
        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">All Categories</option>
        {expenseCategories.map((category) => (
          <option key={category.value} value={category.value}>
            {category.label}
          </option>
        ))}
      </select>
      <select
        value={filters.status}
        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>
      <select
        value={filters.paymentMethod}
        onChange={(e) =>
          setFilters({ ...filters, paymentMethod: e.target.value })
        }
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">All Payment Methods</option>
        <option value="cash">Cash</option>
        <option value="card">Card</option>
        <option value="cheque">Cheque</option>
        <option value="online">Online</option>
      </select>
      <button
        onClick={exportToCSV}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
      >
        <Download className="h-4 w-4" />
        <span>Export</span>
      </button>
    </div>
  </div>
);

export default Filters;
