import { Sale, Expense } from '../types';
import { supabaseStorage } from './supabaseStorage';

// Overloaded function signatures for calculateRevenue
export function calculateRevenue(sales: Sale[], dateRange?: { start: Date; end: Date }): number;
export function calculateRevenue(dateRange?: { start: Date; end: Date }): Promise<number>;
export function calculateRevenue(salesOrDateRange?: Sale[] | { start: Date; end: Date }, dateRange?: { start: Date; end: Date }): number | Promise<number> {
  // If first parameter is an array, it's the sales data (synchronous calculation)
  if (Array.isArray(salesOrDateRange)) {
    const sales = salesOrDateRange;
    let filteredSales = sales;

    if (dateRange) {
      filteredSales = sales.filter((sale) => {
        const saleDate = new Date(sale.date);
        return saleDate >= dateRange.start && saleDate <= dateRange.end;
      });
    }

    return filteredSales.reduce((total, sale) => total + sale.totalAmount, 0);
  }

  // If first parameter is not an array, it's a date range (async Supabase call)
  // This is for backward compatibility with existing dashboard code
  return supabaseStorage.getRevenueSum(salesOrDateRange);
}

// Overloaded function signatures for calculateExpenses
export function calculateExpenses(expenses: Expense[], dateRange?: { start: Date; end: Date }): number;
export function calculateExpenses(dateRange?: { start: Date; end: Date }): Promise<number>;
export function calculateExpenses(expensesOrDateRange?: Expense[] | { start: Date; end: Date }, dateRange?: { start: Date; end: Date }): number | Promise<number> {
  // If first parameter is an array, it's the expenses data (synchronous calculation)
  if (Array.isArray(expensesOrDateRange)) {
    const expenses = expensesOrDateRange;
    let filteredExpenses = expenses;

    if (dateRange) {
      filteredExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= dateRange.start && expenseDate <= dateRange.end;
      });
    }

    return filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
  }

  // If first parameter is not an array, it's a date range (async Supabase call)
  // This is for backward compatibility with existing dashboard code
  return supabaseStorage.getExpensesSum(expensesOrDateRange);
}

// Profit and margin remain in JS
export const calculateProfit = (revenue: number, expenses: number): number => {
  return revenue - expenses;
};

export const calculateProfitMargin = (profit: number, revenue: number): number => {
  return revenue > 0 ? (profit / revenue) * 100 : 0;
};

// Overloaded function signatures for getTopSellingProducts
export function getTopSellingProducts(sales: Sale[], limit?: number): Array<{ product: string; quantity: number; revenue: number }>;
export function getTopSellingProducts(limit?: number): Promise<Array<{ product: string; quantity: number; revenue: number }>>;
export function getTopSellingProducts(salesOrLimit?: Sale[] | number, limit = 5): Array<{ product: string; quantity: number; revenue: number }> | Promise<Array<{ product: string; quantity: number; revenue: number }>> {
  // If first parameter is an array, it's the sales data (synchronous calculation)
  if (Array.isArray(salesOrLimit)) {
    const sales = salesOrLimit;
    const actualLimit = typeof limit === 'number' ? limit : 5;

    const productMap = new Map<string, { quantity: number; revenue: number }>();

    sales.forEach((sale) => {
      const productKey = `${sale.product.brand} ${sale.product.model}`;
      const existing = productMap.get(productKey) || { quantity: 0, revenue: 0 };
      productMap.set(productKey, {
        quantity: existing.quantity + sale.quantity,
        revenue: existing.revenue + sale.totalAmount,
      });
    });

    return Array.from(productMap.entries())
      .map(([product, data]) => ({ product, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, actualLimit);
  }

  // If first parameter is not an array, it's the limit (async Supabase call)
  const actualLimit = typeof salesOrLimit === 'number' ? salesOrLimit : 5;
  return supabaseStorage.getTopSellingProducts(actualLimit);
}

// Overloaded function signatures for getMonthlyTrends
export function getMonthlyTrends(sales: Sale[], expenses: Expense[], year: number): Array<{ month: string; revenue: number; expenses: number; profit: number }>;
export function getMonthlyTrends(year: number): Promise<Array<{ month: string; revenue: number; expenses: number; profit: number }>>;
export function getMonthlyTrends(salesOrYear: Sale[] | number, expensesOrUndefined?: Expense[], year?: number): Array<{ month: string; revenue: number; expenses: number; profit: number }> | Promise<Array<{ month: string; revenue: number; expenses: number; profit: number }>> {
  // If first parameter is an array, it's the sales data (synchronous calculation)
  if (Array.isArray(salesOrYear)) {
    const sales = salesOrYear;
    const expenses = expensesOrUndefined as Expense[];
    const targetYear = year as number;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return months.map((month, monthIndex) => {
      const monthSales = sales.filter((sale) => {
        const saleDate = new Date(sale.date);
        return saleDate.getFullYear() === targetYear && saleDate.getMonth() === monthIndex;
      });

      const monthExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getFullYear() === targetYear && expenseDate.getMonth() === monthIndex;
      });

      const revenue = monthSales.reduce((total, sale) => total + sale.totalAmount, 0);
      const expenseTotal = monthExpenses.reduce((total, expense) => total + expense.amount, 0);
      const profit = revenue - expenseTotal;

      return { month, revenue, expenses: expenseTotal, profit };
    });
  }

  // If first parameter is not an array, it's the year (async Supabase call)
  const targetYear = salesOrYear as number;
  return supabaseStorage.getMonthlyTrends(targetYear);
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (date: Date | string): string => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const generateId = (): string => {
  return crypto.randomUUID();
};