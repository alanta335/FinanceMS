import React from "react";
import { useEmployeeManagement } from "./EmployeeManagement/useEmployeeManagement";
import Header from "./EmployeeManagement/ui/Header";
import ErrorDisplay from "./EmployeeManagement/ui/ErrorDisplay";
import SummaryCards from "./EmployeeManagement/ui/SummaryCards";
import EmployeeFilters from "./EmployeeManagement/ui/EmployeeFilters";
import EmployeeTable from "./EmployeeManagement/ui/EmployeeTable";
import EmployeeModals from "./EmployeeManagement/ui/EmployeeModals";
import Pagination from "./common/Pagination";

const EmployeeManagement: React.FC = () => {
  const {
    paginatedEmployees,
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
    currentPage,
    pageSize,
    sortBy,
    sortOrder,
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
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,
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
        pageSize={pageSize}
        onPageSizeChange={handlePageSizeChange}
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
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />

      {/* Employees Table */}
      <EmployeeTable
        employees={filteredEmployees}
        onView={setSelectedEmployee}
        onEdit={handleEditEmployee}
        onToggle={handleToggleStatus}
        onDelete={handleDeleteEmployee}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />

      {/* Pagination */}
      {paginatedEmployees && (
        <Pagination
          currentPage={currentPage}
          totalPages={paginatedEmployees.pagination.totalPages}
          onPageChange={handlePageChange}
          totalItems={paginatedEmployees.pagination.totalCount}
          pageSize={pageSize}
        />
      )}

      {/* Modals */}
      <EmployeeModals
        showAddModal={showAddModal}
        showEditModal={showEditModal}
        selectedEmployee={selectedEmployee}
        newEmployee={{
          id: '',
          name: newEmployee.name,
          position: newEmployee.position,
          department: newEmployee.department,
          baseSalary: newEmployee.baseSalary,
          commissionRate: newEmployee.commissionRate,
          joinDate: new Date(),
          isActive: true,
          phone: newEmployee.phone,
          email: newEmployee.email,
          address: newEmployee.address,
          emergencyContact: newEmployee.emergencyContact,
          bankAccount: newEmployee.bankAccount,
          panNumber: newEmployee.panNumber,
          aadharNumber: newEmployee.aadharNumber,
        }}
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