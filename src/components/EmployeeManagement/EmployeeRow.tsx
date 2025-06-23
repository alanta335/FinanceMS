import React from "react";
import { Eye, Edit2, Trash2 } from "lucide-react";
import { Employee } from "../../types";
import { formatDate, formatCurrency } from "./employeeUtils";

interface EmployeeRowProps {
  employee: Employee;
  onView: (e: Employee) => void;
  onEdit: (e: Employee) => void;
  onToggle: (id: string, status: boolean) => void;
  onDelete: (id: string) => void;
}

const EmployeeRow: React.FC<EmployeeRowProps> = ({
  employee,
  onView,
  onEdit,
  onToggle,
  onDelete,
}) => (
  <tr key={employee.id} className="hover:bg-gray-50">
    <td className="px-6 py-4 whitespace-nowrap">
      <div>
        <div className="text-sm font-medium text-gray-900">{employee.name}</div>
        <div className="text-sm text-gray-500">{employee.email}</div>
        <div className="text-sm text-gray-500">{employee.phone}</div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
      {employee.position}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
      {employee.department || "N/A"}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
      {formatCurrency(employee.baseSalary)}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
      {employee.commissionRate}%
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
      {formatDate(employee.joinDate)}
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          employee.isActive
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {employee.isActive ? "Active" : "Inactive"}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onView(employee)}
          className="text-blue-600 hover:text-blue-900"
          title="View Details"
        >
          <Eye className="h-4 w-4" />
        </button>
        <button
          onClick={() => onEdit(employee)}
          className="text-green-600 hover:text-green-900"
          title="Edit"
        >
          <Edit2 className="h-4 w-4" />
        </button>
        <button
          onClick={() => onToggle(employee.id, employee.isActive)}
          className={
            employee.isActive
              ? "text-yellow-600 hover:text-yellow-900"
              : "text-green-600 hover:text-green-900"
          }
          title={employee.isActive ? "Deactivate" : "Activate"}
        >
          {employee.isActive ? "⏸" : "▶"}
        </button>
        <button
          onClick={() => onDelete(employee.id)}
          className="text-red-600 hover:text-red-900"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </td>
  </tr>
);

export default EmployeeRow;
