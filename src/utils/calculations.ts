import { Sale, Expense } from '../types';

export const calculateRevenue = (sales: Sale[], dateRange?: { start: Date; end: Date }): number => {
  let filteredSales = sales;
  
  if (dateRange) {
    filteredSales = sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate >= dateRange.start && saleDate <= dateRange.end;
    });
  }
  
  return filteredSales.reduce((total, sale) => total + sale.totalAmount, 0);
};

export const calculateExpenses = (expenses: Expense[], dateRange?: { start: Date; end: Date }): number => {
  let filteredExpenses = expenses;
  
  if (dateRange) {
    filteredExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= dateRange.start && expenseDate <= dateRange.end;
    });
  }
  
  return filteredExpenses.reduce((total, expense) => total + expense.amount, 0);
};

export const calculateProfit = (revenue: number, expenses: number): number => {
  return revenue - expenses;
};

export const calculateProfitMargin = (profit: number, revenue: number): number => {
  return revenue > 0 ? (profit / revenue) * 100 : 0;
};

export const getTopSellingProducts = (sales: Sale[]): Array<{ product: string; quantity: number; revenue: number }> => {
  const productMap = new Map<string, { quantity: number; revenue: number }>();
  
  sales.forEach(sale => {
    const productKey = `${sale.product.brand} ${sale.product.model}`;
    const existing = productMap.get(productKey) || { quantity: 0, revenue: 0 };
    productMap.set(productKey, {
      quantity: existing.quantity + sale.quantity,
      revenue: existing.revenue + sale.totalAmount
    });
  });
  
  return Array.from(productMap.entries())
    .map(([product, data]) => ({ product, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
};

export const getMonthlyTrends = (sales: Sale[], expenses: Expense[]): Array<{ month: string; revenue: number; expenses: number; profit: number }> => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentYear = new Date().getFullYear();
  
  return months.map(month => {
    const monthIndex = months.indexOf(month);
    const monthSales = sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate.getFullYear() === currentYear && saleDate.getMonth() === monthIndex;
    });
    
    const monthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getFullYear() === currentYear && expenseDate.getMonth() === monthIndex;
    });
    
    const revenue = calculateRevenue(monthSales);
    const expenseTotal = calculateExpenses(monthExpenses);
    const profit = calculateProfit(revenue, expenseTotal);
    
    return { month, revenue, expenses: expenseTotal, profit };
  });
};

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
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};