import React from "react";
import EmployeeForm from "../EmployeeForm";
import { Employee } from "../types";

interface EmployeeModalsProps {
  showAddModal: boolean;
  showEditModal: boolean;
  selectedEmployee: Employee | null;
  newEmployee: Employee;
  setNewEmployee: (e: Employee) => void;
  positions: string[];
  departments: string[];
  handleAddEmployee: (e: Employee) => void;
  handleUpdateEmployee: (e: Employee) => void;
  setShowAddModal: (v: boolean) => void;
  setShowEditModal: (v: boolean) => void;
  resetForm: () => void;
  formatCurrency: (n: number) => string;
  formatDate: (d: string) => string;
  setSelectedEmployee: (e: Employee | null) => void;
}

const EmployeeModals: React.FC<EmployeeModalsProps> = ({
  showAddModal,
  showEditModal,
  selectedEmployee,
  newEmployee,
  setNewEmployee,
  positions,
  departments,
  handleAddEmployee,
  handleUpdateEmployee,
  setShowAddModal,
  setShowEditModal,
  resetForm,
  formatCurrency,
  formatDate,
  setSelectedEmployee,
}) => (
  <>
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
            onCancel={() => {
              setShowEditModal(false);
              resetForm();
            }}
            submitLabel="Update Employee"
          />
        </div>
      </div>
    )}
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
                  selectedEmployee.isActive ? "text-green-600" : "text-red-600"
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
  </>
);

export default EmployeeModals;
