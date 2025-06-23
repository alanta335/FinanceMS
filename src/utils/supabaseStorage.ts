import { supabase } from '../lib/supabase';
import { Sale, Expense, Employee, Product } from '../types';

// Error handling utility
const handleSupabaseError = (error: any, operation: string) => {
  console.error(`Supabase ${operation} error:`, error);
  throw new Error(`Failed to ${operation}: ${error.message || 'Unknown error'}`);
};

// Transform database row to application types
const transformSaleFromDB = (dbSale: any): Sale => ({
  id: dbSale.id,
  date: new Date(dbSale.date),
  product: {
    id: dbSale.product_id || '',
    name: dbSale.products?.name || '',
    category: dbSale.products?.category || '',
    brand: dbSale.products?.brand || '',
    model: dbSale.products?.model || '',
    serialNumber: dbSale.products?.serial_number || '',
    imei: dbSale.products?.imei || '',
    warrantyPeriod: dbSale.products?.warranty_period || 12
  },
  quantity: dbSale.quantity,
  unitPrice: dbSale.unit_price,
  totalAmount: dbSale.total_amount,
  paymentMethod: dbSale.payment_method as 'cash' | 'card' | 'emi' | 'upi',
  customerName: dbSale.customer_name,
  customerPhone: dbSale.customer_phone,
  salesPerson: dbSale.sales_person,
  commission: dbSale.commission,
  isReturned: dbSale.is_returned,
  warrantyStartDate: new Date(dbSale.warranty_start_date),
  notes: dbSale.notes || ''
});

const transformExpenseFromDB = (dbExpense: any): Expense => ({
  id: dbExpense.id,
  date: new Date(dbExpense.date),
  category: dbExpense.category,
  subcategory: dbExpense.subcategory,
  amount: dbExpense.amount,
  description: dbExpense.description,
  vendor: dbExpense.vendor || '',
  receipt: dbExpense.receipt || '',
  paymentMethod: dbExpense.payment_method as 'cash' | 'card' | 'cheque' | 'online',
  approvedBy: dbExpense.approved_by || '',
  status: dbExpense.status as 'pending' | 'approved' | 'rejected',
  isRecurring: dbExpense.is_recurring,
  recurringFrequency: dbExpense.recurring_frequency as 'daily' | 'weekly' | 'monthly' | 'yearly' | undefined
});

const transformEmployeeFromDB = (dbEmployee: any): Employee => ({
  id: dbEmployee.id,
  name: dbEmployee.name,
  position: dbEmployee.position,
  department: dbEmployee.department || '',
  baseSalary: dbEmployee.base_salary,
  commissionRate: dbEmployee.commission_rate,
  joinDate: new Date(dbEmployee.join_date),
  isActive: dbEmployee.is_active,
  phone: dbEmployee.phone,
  email: dbEmployee.email,
  address: dbEmployee.address || '',
  emergencyContact: dbEmployee.emergency_contact || '',
  bankAccount: dbEmployee.bank_account || '',
  panNumber: dbEmployee.pan_number || '',
  aadharNumber: dbEmployee.aadhar_number || ''
});

// Transform application types to database format
const transformSaleToDB = (sale: Sale) => ({
  id: sale.id,
  date: sale.date.toISOString(),
  product_id: sale.product.id,
  quantity: sale.quantity,
  unit_price: sale.unitPrice,
  total_amount: sale.totalAmount,
  payment_method: sale.paymentMethod,
  customer_name: sale.customerName,
  customer_phone: sale.customerPhone,
  sales_person: sale.salesPerson,
  commission: sale.commission,
  is_returned: sale.isReturned,
  warranty_start_date: sale.warrantyStartDate.toISOString().split('T')[0],
  notes: sale.notes || ''
});

const transformExpenseToDB = (expense: Expense) => ({
  id: expense.id,
  date: expense.date.toISOString(),
  category: expense.category,
  subcategory: expense.subcategory,
  amount: expense.amount,
  description: expense.description,
  vendor: expense.vendor || '',
  receipt: expense.receipt || '',
  payment_method: expense.paymentMethod,
  approved_by: expense.approvedBy || '',
  status: expense.status,
  is_recurring: expense.isRecurring,
  recurring_frequency: expense.recurringFrequency || '',
  from_location: expense.from_location || '',
  to_location: expense.to_location || ''
});

const transformEmployeeToDB = (employee: Employee) => ({
  id: employee.id,
  name: employee.name,
  position: employee.position,
  department: employee.department || '',
  base_salary: employee.baseSalary,
  commission_rate: employee.commissionRate,
  join_date: employee.joinDate.toISOString().split('T')[0],
  is_active: employee.isActive,
  phone: employee.phone,
  email: employee.email,
  address: employee.address || '',
  emergency_contact: employee.emergencyContact || '',
  bank_account: employee.bankAccount || '',
  pan_number: employee.panNumber || '',
  aadhar_number: employee.aadharNumber || ''
});

const transformProductToDB = (product: Product) => ({
  id: product.id,
  name: product.name,
  category: product.category,
  brand: product.brand,
  model: product.model,
  serial_number: product.serialNumber || '',
  imei: product.imei || '',
  warranty_period: product.warrantyPeriod
});

class SupabaseStorage {
  // Sales operations
  async getSales(): Promise<Sale[]> {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select(`
          *,
          products (
            id,
            name,
            category,
            brand,
            model,
            serial_number,
            imei,
            warranty_period
          )
        `)
        .order('date', { ascending: false });

      if (error) handleSupabaseError(error, 'fetch sales');
      
      return (data || []).map(transformSaleFromDB);
    } catch (error) {
      handleSupabaseError(error, 'fetch sales');
      return [];
    }
  }

  async addSale(sale: Sale): Promise<void> {
    try {
      // First, create or update the product
      const productData = transformProductToDB(sale.product);
      const { error: productError } = await supabase
        .from('products')
        .upsert(productData);

      if (productError) handleSupabaseError(productError, 'create product');

      // Then create the sale
      const saleData = transformSaleToDB(sale);
      const { error: saleError } = await supabase
        .from('sales')
        .insert(saleData);

      if (saleError) handleSupabaseError(saleError, 'create sale');
    } catch (error) {
      handleSupabaseError(error, 'add sale');
    }
  }

  async updateSale(id: string, updates: Partial<Sale>): Promise<void> {
    try {
      const updateData: any = {};
      
      if (updates.quantity !== undefined) updateData.quantity = updates.quantity;
      if (updates.unitPrice !== undefined) updateData.unit_price = updates.unitPrice;
      if (updates.totalAmount !== undefined) updateData.total_amount = updates.totalAmount;
      if (updates.paymentMethod !== undefined) updateData.payment_method = updates.paymentMethod;
      if (updates.customerName !== undefined) updateData.customer_name = updates.customerName;
      if (updates.customerPhone !== undefined) updateData.customer_phone = updates.customerPhone;
      if (updates.salesPerson !== undefined) updateData.sales_person = updates.salesPerson;
      if (updates.commission !== undefined) updateData.commission = updates.commission;
      if (updates.isReturned !== undefined) updateData.is_returned = updates.isReturned;
      if (updates.notes !== undefined) updateData.notes = updates.notes;
      if (updates.date !== undefined) updateData.date = updates.date.toISOString();
      if (updates.warrantyStartDate !== undefined) updateData.warranty_start_date = updates.warrantyStartDate.toISOString().split('T')[0];

      const { error } = await supabase
        .from('sales')
        .update(updateData)
        .eq('id', id);

      if (error) handleSupabaseError(error, 'update sale');
    } catch (error) {
      handleSupabaseError(error, 'update sale');
    }
  }

  async deleteSale(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('id', id);

      if (error) handleSupabaseError(error, 'delete sale');
    } catch (error) {
      handleSupabaseError(error, 'delete sale');
    }
  }

  // Expenses operations
  async getExpenses(): Promise<Expense[]> {
    try {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });

      if (error) handleSupabaseError(error, 'fetch expenses');
      
      return (data || []).map(transformExpenseFromDB);
    } catch (error) {
      handleSupabaseError(error, 'fetch expenses');
      return [];
    }
  }

  async addExpense(expense: Expense): Promise<void> {
    try {
      const expenseData = transformExpenseToDB(expense);
      const { error } = await supabase
        .from('expenses')
        .insert(expenseData);

      if (error) handleSupabaseError(error, 'create expense');
    } catch (error) {
      handleSupabaseError(error, 'add expense');
    }
  }

  async updateExpense(id: string, updates: Partial<Expense>): Promise<void> {
    try {
      const updateData: any = {};
      
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.subcategory !== undefined) updateData.subcategory = updates.subcategory;
      if (updates.amount !== undefined) updateData.amount = updates.amount;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.vendor !== undefined) updateData.vendor = updates.vendor;
      if (updates.receipt !== undefined) updateData.receipt = updates.receipt;
      if (updates.paymentMethod !== undefined) updateData.payment_method = updates.paymentMethod;
      if (updates.approvedBy !== undefined) updateData.approved_by = updates.approvedBy;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.isRecurring !== undefined) updateData.is_recurring = updates.isRecurring;
      if (updates.recurringFrequency !== undefined) updateData.recurring_frequency = updates.recurringFrequency;
      if (updates.date !== undefined) updateData.date = updates.date.toISOString();

      const { error } = await supabase
        .from('expenses')
        .update(updateData)
        .eq('id', id);

      if (error) handleSupabaseError(error, 'update expense');
    } catch (error) {
      handleSupabaseError(error, 'update expense');
    }
  }

  async deleteExpense(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) handleSupabaseError(error, 'delete expense');
    } catch (error) {
      handleSupabaseError(error, 'delete expense');
    }
  }

  // Employees operations
  async getEmployees(): Promise<Employee[]> {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('name', { ascending: true });

      if (error) handleSupabaseError(error, 'fetch employees');
      
      return (data || []).map(transformEmployeeFromDB);
    } catch (error) {
      handleSupabaseError(error, 'fetch employees');
      return [];
    }
  }

  async addEmployee(employee: Employee): Promise<void> {
    try {
      const employeeData = transformEmployeeToDB(employee);
      const { error } = await supabase
        .from('employees')
        .insert(employeeData);

      if (error) handleSupabaseError(error, 'create employee');
    } catch (error) {
      handleSupabaseError(error, 'add employee');
    }
  }

  async updateEmployee(id: string, updates: Partial<Employee>): Promise<void> {
    try {
      const updateData: any = {};
      
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.position !== undefined) updateData.position = updates.position;
      if (updates.department !== undefined) updateData.department = updates.department;
      if (updates.baseSalary !== undefined) updateData.base_salary = updates.baseSalary;
      if (updates.commissionRate !== undefined) updateData.commission_rate = updates.commissionRate;
      if (updates.isActive !== undefined) updateData.is_active = updates.isActive;
      if (updates.phone !== undefined) updateData.phone = updates.phone;
      if (updates.email !== undefined) updateData.email = updates.email;
      if (updates.address !== undefined) updateData.address = updates.address;
      if (updates.emergencyContact !== undefined) updateData.emergency_contact = updates.emergencyContact;
      if (updates.bankAccount !== undefined) updateData.bank_account = updates.bankAccount;
      if (updates.panNumber !== undefined) updateData.pan_number = updates.panNumber;
      if (updates.aadharNumber !== undefined) updateData.aadhar_number = updates.aadharNumber;
      if (updates.joinDate !== undefined) updateData.join_date = updates.joinDate.toISOString().split('T')[0];

      const { error } = await supabase
        .from('employees')
        .update(updateData)
        .eq('id', id);

      if (error) handleSupabaseError(error, 'update employee');
    } catch (error) {
      handleSupabaseError(error, 'update employee');
    }
  }

  async deleteEmployee(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

      if (error) handleSupabaseError(error, 'delete employee');
    } catch (error) {
      handleSupabaseError(error, 'delete employee');
    }
  }

  // Products operations
  async getProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true });

      if (error) handleSupabaseError(error, 'fetch products');
      
      return (data || []).map(product => ({
        id: product.id,
        name: product.name,
        category: product.category,
        brand: product.brand,
        model: product.model,
        serialNumber: product.serial_number || '',
        imei: product.imei || '',
        warrantyPeriod: product.warranty_period
      }));
    } catch (error) {
      handleSupabaseError(error, 'fetch products');
      return [];
    }
  }

  async addProduct(product: Product): Promise<void> {
    try {
      const productData = transformProductToDB(product);
      const { error } = await supabase
        .from('products')
        .insert(productData);

      if (error) handleSupabaseError(error, 'create product');
    } catch (error) {
      handleSupabaseError(error, 'add product');
    }
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<void> {
    try {
      const updateData: any = {};
      
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.brand !== undefined) updateData.brand = updates.brand;
      if (updates.model !== undefined) updateData.model = updates.model;
      if (updates.serialNumber !== undefined) updateData.serial_number = updates.serialNumber;
      if (updates.imei !== undefined) updateData.imei = updates.imei;
      if (updates.warrantyPeriod !== undefined) updateData.warranty_period = updates.warrantyPeriod;

      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id);

      if (error) handleSupabaseError(error, 'update product');
    } catch (error) {
      handleSupabaseError(error, 'update product');
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) handleSupabaseError(error, 'delete product');
    } catch (error) {
      handleSupabaseError(error, 'delete product');
    }
  }

  // Clear all data (for development/testing)
  async clearAll(): Promise<void> {
    try {
      await Promise.all([
        supabase.from('sales').delete().neq('id', ''),
        supabase.from('expenses').delete().neq('id', ''),
        supabase.from('employees').delete().neq('id', ''),
        supabase.from('products').delete().neq('id', '')
      ]);
    } catch (error) {
      handleSupabaseError(error, 'clear all data');
    }
  }
}

export const supabaseStorage = new SupabaseStorage();