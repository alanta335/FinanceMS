import React from "react";
import { RefreshCw, Plus } from "lucide-react";

interface HeaderProps {
  onRefresh: () => void;
  refreshing: boolean;
  onAdd: () => void;
}

const Header: React.FC<HeaderProps> = ({ onRefresh, refreshing, onAdd }) => (
  <div className="flex items-center justify-between">
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Employee Management</h2>
      <p className="text-gray-600">Manage employee information and payroll</p>
    </div>
    <div className="flex items-center space-x-3">
      <button
        onClick={onRefresh}
        disabled={refreshing}
        className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
      >
        <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
        <span>Refresh</span>
      </button>
      <button
        onClick={onAdd}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
      >
        <Plus className="h-4 w-4" />
        <span>Add Employee</span>
      </button>
    </div>
  </div>
);

export default Header;
