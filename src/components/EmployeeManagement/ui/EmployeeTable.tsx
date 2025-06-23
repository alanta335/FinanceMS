import React from "react";
import EmployeeRow from "../EmployeeRow";
import { Employee } from "../types";

interface EmployeeTableProps {
  employees: Employee[];
  onView: (e: Employee) => void;
  onEdit: (e: Employee) => void;
  onToggle: (e: Employee) => void;
  onDelete: (e: Employee) => void;
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  onView,
  onEdit,
  onToggle,
  onDelete,
}) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {employees.map((employee) => (
            <EmployeeRow
              key={employee.id}
              employee={employee}
              onView={onView}
              onEdit={onEdit}
              onToggle={onToggle}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default EmployeeTable;
