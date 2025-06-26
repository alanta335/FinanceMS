import { useState, useEffect, useCallback } from 'react';
import { storage, PaginationOptions, PaginatedResult } from '../../utils/storage';
import { Employee } from '../../types';
import { generateId, initialEmployee, formatDate, formatCurrency } from './employeeUtils';

export function useEmployeeManagement() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [paginatedEmployees, setPaginatedEmployees] = useState<PaginatedResult<Employee> | null>(null);
    const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [filters, setFilters] = useState({ position: '', status: '', department: '' });
    const [newEmployee, setNewEmployee] = useState({ ...initialEmployee });

    const positions = [
        'Sales Executive', 'Senior Sales Executive', 'Sales Manager', 'Store Manager',
        'Cashier', 'Technical Support', 'Customer Service', 'Inventory Manager', 'Assistant Manager'
    ];
    const departments = [
        'Sales', 'Management', 'Technical', 'Customer Service', 'Operations', 'Finance'
    ];

    const loadEmployees = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const paginationOptions: PaginationOptions = {
                page: currentPage,
                pageSize,
                sortBy,
                sortOrder
            };

            const result = await storage.getData<Employee>('employees', paginationOptions);
            
            if ('data' in result) {
                // Paginated result
                setPaginatedEmployees(result);
                setEmployees(result.data);
            } else {
                // Non-paginated result (fallback)
                setEmployees(result);
                setPaginatedEmployees(null);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load employees data');
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, sortBy, sortOrder]);

    const handleRefresh = useCallback(async () => {
        try {
            setRefreshing(true);
            setError(null);
            await storage.refreshData('employees');
            await loadEmployees();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to refresh employees data');
        } finally {
            setRefreshing(false);
        }
    }, [loadEmployees]);

    const filterEmployees = useCallback(() => {
        let filtered = [...employees];
        if (searchTerm) {
            filtered = filtered.filter(employee =>
                employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                employee.phone.includes(searchTerm) ||
                employee.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (filters.position) {
            filtered = filtered.filter(employee => employee.position === filters.position);
        }
        if (filters.status) {
            filtered = filtered.filter(employee =>
                filters.status === 'active' ? employee.isActive : !employee.isActive
            );
        }
        if (filters.department) {
            filtered = filtered.filter(employee => employee.department === filters.department);
        }
        setFilteredEmployees(filtered);
    }, [employees, searchTerm, filters]);

    useEffect(() => { loadEmployees(); }, [loadEmployees]);
    useEffect(() => { filterEmployees(); }, [employees, searchTerm, filters, filterEmployees]);

    const handleAddEmployee = async () => {
        try {
            const employee: Employee = {
                id: generateId(),
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
                aadharNumber: newEmployee.aadharNumber
            };
            await storage.addItem('employees', employee);
            await loadEmployees();
            setShowAddModal(false);
            resetForm();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add employee');
        }
        await handleRefresh();
    };

    const handleUpdateEmployee = async () => {
        if (selectedEmployee) {
            try {
                const updatedEmployee = {
                    ...selectedEmployee,
                    name: newEmployee.name,
                    position: newEmployee.position,
                    department: newEmployee.department,
                    baseSalary: newEmployee.baseSalary,
                    commissionRate: newEmployee.commissionRate,
                    phone: newEmployee.phone,
                    email: newEmployee.email,
                    address: newEmployee.address,
                    emergencyContact: newEmployee.emergencyContact,
                    bankAccount: newEmployee.bankAccount,
                    panNumber: newEmployee.panNumber,
                    aadharNumber: newEmployee.aadharNumber
                };
                await storage.updateItem('employees', selectedEmployee.id, updatedEmployee);
                await loadEmployees();
                setShowEditModal(false);
                setSelectedEmployee(null);
                resetForm();
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to update employee');
            }
        }
        await handleRefresh();
    };

    const resetForm = () => {
        setNewEmployee({ ...initialEmployee });
    };

    const handleDeleteEmployee = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await storage.deleteItem('employees', id);
                await loadEmployees();
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to delete employee');
            }
        }
    };

    const handleToggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            await storage.updateItem('employees', id, { isActive: !currentStatus } as Partial<Employee>);
            await loadEmployees();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update employee status');
        }
        await handleRefresh();
    };

    const handleEditEmployee = (employee: Employee) => {
        setSelectedEmployee(employee);
        setNewEmployee({
            name: employee.name,
            position: employee.position,
            department: employee.department || '',
            baseSalary: employee.baseSalary,
            commissionRate: employee.commissionRate,
            phone: employee.phone,
            email: employee.email,
            address: employee.address || '',
            emergencyContact: employee.emergencyContact || '',
            bankAccount: employee.bankAccount || '',
            panNumber: employee.panNumber || '',
            aadharNumber: employee.aadharNumber || ''
        });
        setShowEditModal(true);
    };

    const exportToCSV = () => {
        const headers = ['Name', 'Position', 'Department', 'Base Salary', 'Commission Rate', 'Join Date', 'Status', 'Phone', 'Email'];
        const csvData = filteredEmployees.map(employee => [
            employee.name,
            employee.position,
            employee.department || '',
            employee.baseSalary,
            employee.commissionRate,
            employee.joinDate instanceof Date ? employee.joinDate.toLocaleDateString() : employee.joinDate,
            employee.isActive ? 'Active' : 'Inactive',
            employee.phone,
            employee.email
        ]);
        const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'employees_report.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const getTotalEmployees = () => filteredEmployees.length;
    const getActiveEmployees = () => filteredEmployees.filter(emp => emp.isActive).length;
    const getTotalSalaryBudget = () => filteredEmployees.filter(emp => emp.isActive).reduce((total, emp) => total + emp.baseSalary, 0);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize);
        setCurrentPage(1);
    };

    const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
        setCurrentPage(1);
    };

    return {
        employees,
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
        resetForm
    };
}