import React from "react";
import { MagnifyingGlassIcon, ArrowDownTrayIcon, ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/outline";

interface FiltersState {
  paymentMethod: string;
  category: string;
  dateRange: string;
}

interface FiltersProps {
  filters: FiltersState;
  setFilters: (filters: FiltersState) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onExport: () => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

const Filters: React.FC<FiltersProps> = ({
  filters,
  setFilters,
  searchTerm,
  setSearchTerm,
  onExport,
  sortBy,
  sortOrder,
  onSortChange,
}) => {
  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'customer_name', label: 'Customer' },
    { value: 'total_amount', label: 'Amount' },
    { value: 'created_at', label: 'Created' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search sales..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>
        
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
          <option value="emi">EMI</option>
          <option value="upi">UPI</option>
        </select>
        
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Categories</option>
          <option value="smartphone">Smartphone</option>
          <option value="laptop">Laptop</option>
          <option value="tablet">Tablet</option>
          <option value="accessories">Accessories</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value, sortOrder)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              Sort by {option.label}
            </option>
          ))}
        </select>

        <button
          onClick={() => onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')}
          className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
        >
          {sortOrder === 'asc' ? (
            <ArrowUpIcon className="h-5 w-5" />
          ) : (
            <ArrowDownIcon className="h-5 w-5" />
          )}
        </button>
        
        <button
          onClick={onExport}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
        >
          <ArrowDownTrayIcon className="h-5 w-5" />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
};

export default Filters;