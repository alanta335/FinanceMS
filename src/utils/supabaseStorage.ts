import { supabase } from '../lib/supabase';
import { Sale, Expense, Employee, Product } from '../types';
import {
  handleSupabaseError,
  createUpdateObject
} from './supabaseUtils';
import {
  transformSaleFromDB,
  transformExpenseFromDB,
  transformEmployeeFromDB,
  transformProductFromDB,
  transformSaleToDB,
  transformExpenseToDB,
  transformEmployeeToDB,
  transformProductToDB
} from './supabaseTransforms';

// --- Main Storage Class ---
class SupabaseStorage {
  // --- Generic error wrapper ---
  private async wrap<T>(operation: string, fn: () => Promise<T>): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      handleSupabaseError(error, operation);
      throw error;
    }
  }

  // --- Sales ---
  getSales = () => this.wrap('fetch sales', async () => {
    const { data, error } = await supabase
      .from('sales')
      .select(`*, products (id, name, category, brand, model, serial_number, imei, warranty_period)`)
      .order('date', { ascending: false });
    if (error) handleSupabaseError(error, 'fetch sales');
    return (data || []).map(transformSaleFromDB);
  });

  addSale = (sale: Sale) => this.wrap('add sale', async () => {
    const productData = transformProductToDB(sale.product);
    const { error: productError } = await supabase.from('products').upsert(productData);
    if (productError) handleSupabaseError(productError, 'create product');
    const saleData = transformSaleToDB(sale);
    const { error: saleError } = await supabase.from('sales').insert(saleData);
    if (saleError) handleSupabaseError(saleError, 'create sale');
  });

  updateSale = (id: string, updates: Partial<Sale>) => this.wrap('update sale', async () => {
    const updateData = createUpdateObject(updates, {
      quantity: 'quantity',
      unitPrice: 'unit_price',
      totalAmount: 'total_amount',
      paymentMethod: 'payment_method',
      customerName: 'customer_name',
      customerPhone: 'customer_phone',
      salesPerson: 'sales_person',
      commission: 'commission',
      isReturned: 'is_returned',
      notes: 'notes',
      date: (v: unknown) => (v as Date).toISOString(),
      warrantyStartDate: (v: unknown) => (v as Date).toISOString().split('T')[0]
    });
    const { error } = await supabase.from('sales').update(updateData).eq('id', id);
    if (error) handleSupabaseError(error, 'update sale');
  });

  deleteSale = (id: string) => this.wrap('delete sale', async () => {
    const { error } = await supabase.from('sales').delete().eq('id', id);
    if (error) handleSupabaseError(error, 'delete sale');
  });

  // --- Expenses ---
  getExpenses = () => this.wrap('fetch expenses', async () => {
    const { data, error } = await supabase.from('expenses').select('*').order('date', { ascending: false });
    if (error) handleSupabaseError(error, 'fetch expenses');
    return (data || []).map(transformExpenseFromDB);
  });

  addExpense = (expense: Expense) => this.wrap('add expense', async () => {
    const expenseData = transformExpenseToDB(expense);
    const { error } = await supabase.from('expenses').insert(expenseData);
    if (error) handleSupabaseError(error, 'create expense');
  });

  updateExpense = (id: string, updates: Partial<Expense>) => this.wrap('update expense', async () => {
    const updateData = createUpdateObject(updates, {
      category: 'category',
      subcategory: 'subcategory',
      amount: 'amount',
      description: 'description',
      vendor: 'vendor',
      receipt: 'receipt',
      paymentMethod: 'payment_method',
      approvedBy: 'approved_by',
      status: 'status',
      isRecurring: 'is_recurring',
      recurringFrequency: 'recurring_frequency',
      date: (v: unknown) => (v as Date).toISOString()
    });
    const { error } = await supabase.from('expenses').update(updateData).eq('id', id);
    if (error) handleSupabaseError(error, 'update expense');
  });

  deleteExpense = (id: string) => this.wrap('delete expense', async () => {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) handleSupabaseError(error, 'delete expense');
  });

  // --- Employees ---
  getEmployees = () => this.wrap('fetch employees', async () => {
    const { data, error } = await supabase.from('employees').select('*').order('name', { ascending: true });
    if (error) handleSupabaseError(error, 'fetch employees');
    return (data || []).map(transformEmployeeFromDB);
  });

  addEmployee = (employee: Employee) => this.wrap('add employee', async () => {
    const employeeData = transformEmployeeToDB(employee);
    const { error } = await supabase.from('employees').insert(employeeData);
    if (error) handleSupabaseError(error, 'create employee');
  });

  updateEmployee = (id: string, updates: Partial<Employee>) => this.wrap('update employee', async () => {
    const updateData = createUpdateObject(updates, {
      name: 'name',
      position: 'position',
      department: 'department',
      baseSalary: 'base_salary',
      commissionRate: 'commission_rate',
      isActive: 'is_active',
      phone: 'phone',
      email: 'email',
      address: 'address',
      emergencyContact: 'emergency_contact',
      bankAccount: 'bank_account',
      panNumber: 'pan_number',
      aadharNumber: 'aadhar_number',
      joinDate: (v: unknown) => (v as Date).toISOString().split('T')[0]
    });
    const { error } = await supabase.from('employees').update(updateData).eq('id', id);
    if (error) handleSupabaseError(error, 'update employee');
  });

  deleteEmployee = (id: string) => this.wrap('delete employee', async () => {
    const { error } = await supabase.from('employees').delete().eq('id', id);
    if (error) handleSupabaseError(error, 'delete employee');
  });

  // --- Products ---
  getProducts = () => this.wrap('fetch products', async () => {
    const { data, error } = await supabase.from('products').select('*').order('name', { ascending: true });
    if (error) handleSupabaseError(error, 'fetch products');
    return (data || []).map(transformProductFromDB);
  });

  addProduct = (product: Product) => this.wrap('add product', async () => {
    const productData = transformProductToDB(product);
    const { error } = await supabase.from('products').insert(productData);
    if (error) handleSupabaseError(error, 'create product');
  });

  updateProduct = (id: string, updates: Partial<Product>) => this.wrap('update product', async () => {
    const updateData = createUpdateObject(updates, {
      name: 'name',
      category: 'category',
      brand: 'brand',
      model: 'model',
      serialNumber: 'serial_number',
      imei: 'imei',
      warrantyPeriod: 'warranty_period'
    });
    const { error } = await supabase.from('products').update(updateData).eq('id', id);
    if (error) handleSupabaseError(error, 'update product');
  });

  deleteProduct = (id: string) => this.wrap('delete product', async () => {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) handleSupabaseError(error, 'delete product');
  });

  // --- Aggregation & Calculation Queries ---
  async getRevenueSum(dateRange?: { start: Date; end: Date }): Promise<number> {
    return this.wrap('get revenue sum', async () => {
      let query = supabase.from('sales').select('total_amount', { head: false });
      if (dateRange && dateRange.start && dateRange.end) {
        const startISO = dateRange.start instanceof Date ? dateRange.start.toISOString() : dateRange.start;
        const endISO = dateRange.end instanceof Date ? dateRange.end.toISOString() : dateRange.end;
        query = query.gte('date', startISO).lte('date', endISO);
      }
      const { data, error } = await query;
      if (error) handleSupabaseError(error, 'get revenue sum');
      return (data || []).reduce((sum: number, row: { total_amount: number }) => sum + (row.total_amount || 0), 0);
    });
  }

  async getExpensesSum(dateRange?: { start: Date; end: Date }): Promise<number> {
    return this.wrap('get expenses sum', async () => {
      let query = supabase.from('expenses').select('amount', { head: false });
      if (dateRange && dateRange.start && dateRange.end) {
        const startISO = dateRange.start instanceof Date ? dateRange.start.toISOString() : dateRange.start;
        const endISO = dateRange.end instanceof Date ? dateRange.end.toISOString() : dateRange.end;
        query = query.gte('date', startISO).lte('date', endISO);
      }
      const { data, error } = await query;
      if (error) handleSupabaseError(error, 'get expenses sum');
      return (data || []).reduce((sum: number, row: { amount: number }) => sum + (row.amount || 0), 0);
    });
  }

  async getTopSellingProducts(limit: number = 5): Promise<Array<{ product: string; quantity: number; revenue: number }>> {
    // Use JavaScript aggregation directly instead of trying RPC first
    return this.wrap('get top selling products', async () => {
      const { data, error } = await supabase.from('sales').select('*');
      if (error || !data) return [];

      // Use Sale type for data
      const productMap = new Map<string, { quantity: number; revenue: number }>();
      (data as Sale[]).forEach((sale) => {
        const productKey = sale.product?.brand + ' ' + sale.product?.model;
        const existing = productMap.get(productKey) || { quantity: 0, revenue: 0 };
        productMap.set(productKey, {
          quantity: existing.quantity + (sale.quantity || 0),
          revenue: existing.revenue + (sale.totalAmount || 0)
        });
      });

      return Array.from(productMap.entries())
        .map(([product, data]) => ({ product, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, limit);
    });
  }

  async getMonthlyTrends(year: number): Promise<Array<{ month: string; revenue: number; expenses: number; profit: number }>> {
    // Use JavaScript aggregation directly instead of trying RPC first
    return this.wrap('get monthly trends', async () => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const salesRes = await supabase.from('sales').select('*');
      const expensesRes = await supabase.from('expenses').select('*');

      if (salesRes.error) handleSupabaseError(salesRes.error, 'fetch sales for trends');
      if (expensesRes.error) handleSupabaseError(expensesRes.error, 'fetch expenses for trends');

      const sales = (salesRes.data || []) as Sale[];
      const expenses = (expensesRes.data || []) as Expense[];

      return months.map((month, monthIndex) => {
        const monthSales = sales.filter((sale) => {
          const saleDate = new Date(sale.date);
          return saleDate.getFullYear() === year && saleDate.getMonth() === monthIndex;
        });
        const monthExpenses = expenses.filter((expense) => {
          const expenseDate = new Date(expense.date);
          return expenseDate.getFullYear() === year && expenseDate.getMonth() === monthIndex;
        });
        const revenue = monthSales.reduce((total, sale) => total + (sale.totalAmount || 0), 0);
        const expenseTotal = monthExpenses.reduce((total, expense) => total + (expense.amount || 0), 0);
        const profit = revenue - expenseTotal;
        return { month, revenue, expenses: expenseTotal, profit };
      });
    });
  }

  // --- Clear All (dev/testing) ---
  clearAll = () => this.wrap('clear all data', async () => {
    await Promise.all([
      supabase.from('sales').delete().neq('id', ''),
      supabase.from('expenses').delete().neq('id', ''),
      supabase.from('employees').delete().neq('id', ''),
      supabase.from('products').delete().neq('id', '')
    ]);
  });
}

export const supabaseStorage = new SupabaseStorage();