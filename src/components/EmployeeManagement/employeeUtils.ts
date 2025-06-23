import { Employee } from '../../types';

export const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString();
};

export const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

export const generateId = () => crypto.randomUUID();

export const initialEmployee: Omit<Employee, 'id' | 'joinDate' | 'isActive'> = {
    name: '',
    position: '',
    department: '',
    baseSalary: 0,
    commissionRate: 5,
    phone: '',
    email: '',
    address: '',
    emergencyContact: '',
    bankAccount: '',
    panNumber: '',
    aadharNumber: ''
};
