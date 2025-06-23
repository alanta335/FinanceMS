import React from "react";
import {
  RefreshCw,
  Plus,
  Users,
  Award,
  DollarSign,
  Search,
  Download,
} from "lucide-react";
import EmployeeRow from "./EmployeeManagement/EmployeeRow";
import EmployeeForm from "./EmployeeManagement/EmployeeForm";
import { useEmployeeManagement } from "./EmployeeManagement/useEmployeeManagement";
import Header from "./EmployeeManagement/ui/Header";
import ErrorDisplay from "./EmployeeManagement/ui/ErrorDisplay";
import SummaryCards from "./EmployeeManagement/ui/SummaryCards";
import EmployeeFilters from "./EmployeeManagement/ui/EmployeeFilters";
import EmployeeTable from "./EmployeeManagement/ui/EmployeeTable";
import EmployeeModals from "./EmployeeManagement/ui/EmployeeModals";

const EmployeeManagement: React.FC = () => {
  const {
    filteredEmployees,
    searchTerm,
    setSearchTerm,
    showAddModal,
    setShowAddModal,
    selectedEmployee,
    setSelectedEmployee,
    showEditModal,
    setShowEditModal,
    loading,
    refreshing,
    error,
    setError,
    filters,
    setFilters,
    newEmployee,
    setNewEmployee,
    positions,
    departments,
    handleAddEmployee,
    handleUpdateEmployee,
    handleDeleteEmployee,
    handleToggleStatus,
    handleEditEmployee,
    exportToCSV,
    getTotalEmployees,
    getActiveEmployees,
    getTotalSalaryBudget,
    handleRefresh,
    formatDate,
    formatCurrency,
    resetForm,
  } = useEmployeeManagement();

  if (loading) {
    return (
      <div className="space-y-6 max-w-none">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading employees...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-none">
      {/* Header */}
      <Header
        onRefresh={handleRefresh}
        refreshing={refreshing}
        onAdd={() => setShowAddModal(true)}
      />

      {/* Error Display */}
      <ErrorDisplay error={error} onDismiss={() => setError(null)} />

      {/* Summary Cards */}
      <SummaryCards
        total={getTotalEmployees()}
        active={getActiveEmployees()}
        budget={getTotalSalaryBudget()}
        formatCurrency={formatCurrency}
      />

      {/* Filters and Search */}
      <EmployeeFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={filters}
        setFilters={setFilters}
        positions={positions}
        departments={departments}
        exportToCSV={exportToCSV}
      />

      {/* Employees Table */}
      <EmployeeTable
        employees={filteredEmployees}
        onView={setSelectedEmployee}
        onEdit={handleEditEmployee}
        onToggle={handleToggleStatus}
        onDelete={handleDeleteEmployee}
      />

      {/* Modals */}
      <EmployeeModals
        showAddModal={showAddModal}
        showEditModal={showEditModal}
        selectedEmployee={selectedEmployee}
        newEmployee={newEmployee}
        setNewEmployee={setNewEmployee}
        positions={positions}
        departments={departments}
        handleAddEmployee={handleAddEmployee}
        handleUpdateEmployee={handleUpdateEmployee}
        setShowAddModal={setShowAddModal}
        setShowEditModal={setShowEditModal}
        resetForm={resetForm}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
        setSelectedEmployee={setSelectedEmployee}
      />
    </div>
  );
};

export default EmployeeManagement;
