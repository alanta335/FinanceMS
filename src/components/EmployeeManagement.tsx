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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Employee Management
          </h2>
          <p className="text-gray-600">
            Manage employee information and payroll
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Employees
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {getTotalEmployees()}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Active Employees
              </p>
              <p className="text-2xl font-bold text-green-600">
                {getActiveEmployees()}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Award className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Monthly Salary Budget
              </p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(getTotalSalaryBudget())}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filters.position}
            onChange={(e) =>
              setFilters({ ...filters, position: e.target.value })
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Positions</option>
            {positions.map((position) => (
              <option key={position} value={position}>
                {position}
              </option>
            ))}
          </select>

          <select
            value={filters.department}
            onChange={(e) =>
              setFilters({ ...filters, department: e.target.value })
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
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

      {/* Employees Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.map((employee) => (
                <EmployeeRow
                  key={employee.id}
                  employee={employee}
                  onView={setSelectedEmployee}
                  onEdit={handleEditEmployee}
                  onToggle={handleToggleStatus}
                  onDelete={handleDeleteEmployee}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Add New Employee
            </h3>
            <EmployeeForm
              employee={newEmployee}
              setEmployee={setNewEmployee}
              positions={positions}
              departments={departments}
              onSubmit={handleAddEmployee}
              onCancel={() => setShowAddModal(false)}
              submitLabel="Add Employee"
            />
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Edit Employee
            </h3>
            <EmployeeForm
              employee={newEmployee}
              setEmployee={setNewEmployee}
              positions={positions}
              departments={departments}
              onSubmit={handleUpdateEmployee}
              onCancel={() => { setShowEditModal(false); resetForm(); }}
              submitLabel="Update Employee"
            />
          </div>
        </div>
      )}

      {/* Employee Details Modal */}
      {selectedEmployee && !showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Employee Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{selectedEmployee.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Position:</span>
                <span className="font-medium">{selectedEmployee.position}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Department:</span>
                <span className="font-medium">
                  {selectedEmployee.department || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Base Salary:</span>
                <span className="font-medium">
                  {formatCurrency(selectedEmployee.baseSalary)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Commission Rate:</span>
                <span className="font-medium">
                  {selectedEmployee.commissionRate}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Join Date:</span>
                <span className="font-medium">
                  {formatDate(selectedEmployee.joinDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">{selectedEmployee.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{selectedEmployee.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span
                  className={`font-medium ${
                    selectedEmployee.isActive
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {selectedEmployee.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              {selectedEmployee.address && (
                <div>
                  <span className="text-gray-600">Address:</span>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedEmployee.address}
                  </p>
                </div>
              )}
              {selectedEmployee.emergencyContact && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Emergency Contact:</span>
                  <span className="font-medium">
                    {selectedEmployee.emergencyContact}
                  </span>
                </div>
              )}
            </div>
            <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => setSelectedEmployee(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;
