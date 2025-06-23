import { supabase } from '../lib/supabase';
import { Sale, Expense, Employee, Product } from '../types';

// --- Error Handling ---
const handleSupabaseError = (error: unknown, operation: string) => {
  const message = typeof error === 'object' && error !== null && 'message' in error ? (error as { message?: string }).message : undefined;
  console.error(`Supabase ${operation} error:`, error);
  throw new Error(`Failed to ${operation}: ${message || 'Unknown error'}`);
};

// --- Transformations ---
type DBProduct = {
  id?: string;
  name?: string;
  category?: string;
  brand?: string;
  model?: string;
  serial_number?: string;
  imei?: string;
  warranty_period?: number;
};

const transformSaleFromDB = (dbSale: Record<string, unknown>): Sale => {
  const products = dbSale.products as DBProduct | undefined;
  return {
    id: dbSale.id as string,
    date: new Date(dbSale.date as string),
    product: {
      id: (dbSale.product_id as string) || '',
      name: products?.name || '',
      category: products?.category || '',
      brand: products?.brand || '',
      model: products?.model || '',
      serialNumber: products?.serial_number || '',
      imei: products?.imei || '',
      warrantyPeriod: products?.warranty_period || 12
    },
    quantity: dbSale.quantity as number,
    unitPrice: dbSale.unit_price as number,
    totalAmount: dbSale.total_amount as number,
    paymentMethod: dbSale.payment_method as 'cash' | 'card' | 'emi' | 'upi',
    customerName: dbSale.customer_name as string,
    customerPhone: dbSale.customer_phone as string,
    salesPerson: dbSale.sales_person as string,
    commission: dbSale.commission as number,
    isReturned: dbSale.is_returned as boolean,
    warrantyStartDate: new Date(dbSale.warranty_start_date as string),
    notes: (dbSale.notes as string) || ''
  };
};

const transformExpenseFromDB = (dbExpense: Record<string, unknown>): Expense => ({
  id: dbExpense.id as string,
  date: new Date(dbExpense.date as string),
  category: dbExpense.category as string,
  subcategory: dbExpense.subcategory as string,
  amount: dbExpense.amount as number,
  description: dbExpense.description as string,
  vendor: (dbExpense.vendor as string) || '',
  receipt: (dbExpense.receipt as string) || '',
  paymentMethod: dbExpense.payment_method as 'cash' | 'card' | 'cheque' | 'online',
  approvedBy: (dbExpense.approved_by as string) || '',
  status: dbExpense.status as 'pending' | 'approved' | 'rejected',
  isRecurring: dbExpense.is_recurring as boolean,
  recurringFrequency: dbExpense.recurring_frequency as 'daily' | 'weekly' | 'monthly' | 'yearly' | undefined,
  from_location: (dbExpense.from_location as string) || '',
  to_location: (dbExpense.to_location as string) || ''
});

const transformEmployeeFromDB = (dbEmployee: Record<string, unknown>): Employee => ({
  id: dbEmployee.id as string,
  name: dbEmployee.name as string,
  position: dbEmployee.position as string,
  department: (dbEmployee.department as string) || '',
  baseSalary: dbEmployee.base_salary as number,
  commissionRate: dbEmployee.commission_rate as number,
  joinDate: new Date(dbEmployee.join_date as string),
  isActive: dbEmployee.is_active as boolean,
  phone: dbEmployee.phone as string,
  email: dbEmployee.email as string,
  address: (dbEmployee.address as string) || '',
  emergencyContact: (dbEmployee.emergency_contact as string) || '',
  bankAccount: (dbEmployee.bank_account as string) || '',
  panNumber: (dbEmployee.pan_number as string) || '',
  aadharNumber: (dbEmployee.aadhar_number as string) || ''
});

const transformProductFromDB = (product: Record<string, unknown>): Product => ({
  id: product.id as string,
  name: product.name as string,
  category: product.category as string,
  brand: product.brand as string,
  model: product.model as string,
  serialNumber: (product.serial_number as string) || '',
  imei: (product.imei as string) || '',
  warrantyPeriod: product.warranty_period as number
});

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

// --- Utility: Create update object from partials ---
type UpdateMap<T> = Partial<Record<keyof T, string | ((v: unknown) => unknown)>>;
function createUpdateObject<T>(updates: Partial<T>, map: UpdateMap<T>) {
  return Object.entries(map).reduce((acc, [key, dbKeyOrFn]) => {
    const value = updates[key as keyof T];
    if (value !== undefined) {
      acc[typeof dbKeyOrFn === 'string' ? dbKeyOrFn : key] =
        typeof dbKeyOrFn === 'function' ? dbKeyOrFn(value) : value;
    }
    return acc;
  }, {} as Record<string, unknown>);
}

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