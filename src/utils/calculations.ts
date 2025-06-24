import { supabaseStorage } from './supabaseStorage';
import { Sale, Expense } from '../types';

// DB-powered revenue calculation
export const calculateRevenue = async (dateRange?: { start: Date; end: Date }): Promise<number> => {
  return supabaseStorage.getRevenueSum(dateRange);
};

// DB-powered expenses calculation
export const calculateExpenses = async (dateRange?: { start: Date; end: Date }): Promise<number> => {
  return supabaseStorage.getExpensesSum(dateRange);
};

// Profit and margin remain in JS
export const calculateProfit = (revenue: number, expenses: number): number => {
  return revenue - expenses;
};

export const calculateProfitMargin = (profit: number, revenue: number): number => {
  return revenue > 0 ? (profit / revenue) * 100 : 0;
};

// DB-powered top selling products
export const getTopSellingProducts = async (limit = 5): Promise<Array<{ product: string; quantity: number; revenue: number }>> => {
  return supabaseStorage.getTopSellingProducts(limit);
};

// DB-powered monthly trends
export const getMonthlyTrends = async (year: number): Promise<Array<{ month: string; revenue: number; expenses: number; profit: number }>> => {
  return supabaseStorage.getMonthlyTrends(year);
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
  return crypto.randomUUID();
};