import { Sale, Expense, Employee, Product } from '../types';

// --- DB Types ---
export type DBProduct = {
    id?: string;
    name?: string;
    category?: string;
    brand?: string;
    model?: string;
    serial_number?: string;
    imei?: string;
    warranty_period?: number;
};

// --- Transformations ---
export const transformSaleFromDB = (dbSale: Record<string, unknown>): Sale => {
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

export const transformExpenseFromDB = (dbExpense: Record<string, unknown>): Expense => ({
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

export const transformEmployeeFromDB = (dbEmployee: Record<string, unknown>): Employee => ({
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

export const transformProductFromDB = (product: Record<string, unknown>): Product => ({
    id: product.id as string,
    name: product.name as string,
    category: product.category as string,
    brand: product.brand as string,
    model: product.model as string,
    serialNumber: (product.serial_number as string) || '',
    imei: (product.imei as string) || '',
    warrantyPeriod: product.warranty_period as number
});

export const transformSaleToDB = (sale: Sale) => ({
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

export const transformExpenseToDB = (expense: Expense) => ({
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

export const transformEmployeeToDB = (employee: Employee) => ({
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

export const transformProductToDB = (product: Product) => ({
    id: product.id,
    name: product.name,
    category: product.category,
    brand: product.brand,
    model: product.model,
    serial_number: product.serialNumber || '',
    imei: product.imei || '',
    warranty_period: product.warrantyPeriod
});
