export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'employee';
  avatar?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  model: string;
  serialNumber?: string;
  imei?: string;
  warrantyPeriod: number; // in months
}

export interface Sale {
  id: string;
  date: Date;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  paymentMethod: 'cash' | 'card' | 'emi' | 'upi';
  customerName: string;
  customerPhone: string;
  salesPerson: string;
  commission: number;
  isReturned: boolean;
  warrantyStartDate: Date;
  notes?: string;
}

export interface Expense {
  id: string;
  date: Date;
  category: string;
  subcategory: string;
  amount: number;
  description: string;
  vendor?: string;
  receipt?: string;
  paymentMethod: 'cash' | 'card' | 'cheque' | 'online';
  approvedBy?: string;
  status: 'pending' | 'approved' | 'rejected';
  isRecurring: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  from_location?: string;
  to_location?: string;
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  department?: string;
  baseSalary: number;
  commissionRate: number;
  joinDate: Date;
  isActive: boolean;
  phone: string;
  email: string;
  address?: string;
  emergencyContact?: string;
  bankAccount?: string;
  panNumber?: string;
  aadharNumber?: string;
}

export interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  topSellingProducts: Array<{
    product: string;
    quantity: number;
    revenue: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    revenue: number;
    expenses: number;
    profit: number;
  }>;
}

export interface Filter {
  dateRange: {
    start: Date;
    end: Date;
  };
  category?: string;
  paymentMethod?: string;
  salesPerson?: string;
  status?: string;
}