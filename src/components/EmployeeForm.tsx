import React from 'react';
import { initialEmployee } from './employeeUtils';

interface EmployeeFormProps {
  employee: typeof initialEmployee;
  setEmployee: React.Dispatch<React.SetStateAction<typeof initialEmployee>>;
  positions: string[];
  departments: string[];
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel: string;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, setEmployee, positions, departments, onSubmit, onCancel, submitLabel }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
      <input type="text" value={employee.name} onChange={e => setEmployee(emp => ({ ...emp, name: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
      <select value={employee.position} onChange={e => setEmployee(emp => ({ ...emp, position: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        <option value="">Select Position</option>
        {positions.map(position => <option key={position} value={position}>{position}</option>)}
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
      <select value={employee.department} onChange={e => setEmployee(emp => ({ ...emp, department: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        <option value="">Select Department</option>
        {departments.map(dept => <option key={dept} value={dept}>{dept}</option>)}
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Base Salary</label>
      <input type="number" min="0" value={employee.baseSalary} onChange={e => setEmployee(emp => ({ ...emp, baseSalary: parseFloat(e.target.value) }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Commission Rate (%)</label>
      <input type="number" min="0" max="100" step="0.1" value={employee.commissionRate} onChange={e => setEmployee(emp => ({ ...emp, commissionRate: parseFloat(e.target.value) }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
      <input type="tel" value={employee.phone} onChange={e => setEmployee(emp => ({ ...emp, phone: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
      <input type="email" value={employee.email} onChange={e => setEmployee(emp => ({ ...emp, email: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
      <input type="tel" value={employee.emergencyContact} onChange={e => setEmployee(emp => ({ ...emp, emergencyContact: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
    </div>
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
      <textarea value={employee.address} onChange={e => setEmployee(emp => ({ ...emp, address: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Bank Account</label>
      <input type="text" value={employee.bankAccount} onChange={e => setEmployee(emp => ({ ...emp, bankAccount: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
      <input type="text" value={employee.panNumber} onChange={e => setEmployee(emp => ({ ...emp, panNumber: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Number</label>
      <input type="text" value={employee.aadharNumber} onChange={e => setEmployee(emp => ({ ...emp, aadharNumber: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
    </div>
    <div className="md:col-span-2 flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
      <button onClick={onCancel} className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
      <button onClick={onSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{submitLabel}</button>
    </div>
  </div>
);

export default EmployeeForm;
