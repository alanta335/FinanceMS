import React, { useState, useEffect } from 'react';
import { Download, Calendar, TrendingUp, TrendingDown, DollarSign, FileText, BarChart3, PieChart, RefreshCw } from 'lucide-react';
import { storage } from '../utils/storage';
import { Sale, Expense, Employee } from '../types';
import { formatCurrency, formatDate, calculateRevenue, calculateExpenses, calculateProfit, calculateProfitMargin } from '../utils/calculations';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

interface ReportData {
  sales: Sale[];
  expenses: Expense[];
  employees: Employee[];
  revenue: number;
  totalExpenses: number;
  profit: number;
  profitMargin: number;
  topProducts: Array<{ product: string; quantity: number; revenue: number }>;
  expensesByCategory: Array<{ category: string; amount: number; percentage: number }>;
  salesByPaymentMethod: Array<{ method: string; amount: number; count: number }>;
}

const Reports: React.FC = () => {
  const [reportType, setReportType] = useState<'daily' | 'monthly' | 'yearly'>('monthly');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generateReport();
  }, [reportType, selectedDate, selectedMonth, selectedYear]);

  const getDateRange = () => {
    let start: Date, end: Date;

    switch (reportType) {
      case 'daily':
        start = new Date(selectedDate);
        end = new Date(selectedDate);
        end.setHours(23, 59, 59, 999);
        break;
      case 'monthly':
        const [year, month] = selectedMonth.split('-');
        start = new Date(parseInt(year), parseInt(month) - 1, 1);
        end = new Date(parseInt(year), parseInt(month), 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'yearly':
        start = new Date(parseInt(selectedYear), 0, 1);
        end = new Date(parseInt(selectedYear), 11, 31);
        end.setHours(23, 59, 59, 999);
        break;
      default:
        start = new Date();
        end = new Date();
    }

    return { start, end };
  };

  const generateReport = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { start, end } = getDateRange();
      
      // Load data
      const [allSales, allExpenses, allEmployees] = await Promise.all([
        storage.getData<Sale>('sales'),
        storage.getData<Expense>('expenses'),
        storage.getData<Employee>('employees')
      ]);

      // Filter data by date range
      const filteredSales = allSales.filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate >= start && saleDate <= end;
      });

      const filteredExpenses = allExpenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= start && expenseDate <= end;
      });

      // Calculate metrics
      const revenue = calculateRevenue(filteredSales);
      const totalExpenses = calculateExpenses(filteredExpenses);
      const profit = calculateProfit(revenue, totalExpenses);
      const profitMargin = calculateProfitMargin(profit, revenue);

      // Top products
      const productMap = new Map<string, { quantity: number; revenue: number }>();
      filteredSales.forEach(sale => {
        const productKey = `${sale.product.brand} ${sale.product.model}`;
        const existing = productMap.get(productKey) || { quantity: 0, revenue: 0 };
        productMap.set(productKey, {
          quantity: existing.quantity + sale.quantity,
          revenue: existing.revenue + sale.totalAmount
        });
      });

      const topProducts = Array.from(productMap.entries())
        .map(([product, data]) => ({ product, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

      // Expenses by category
      const expenseCategoryMap = new Map<string, number>();
      filteredExpenses.forEach(expense => {
        const existing = expenseCategoryMap.get(expense.category) || 0;
        expenseCategoryMap.set(expense.category, existing + expense.amount);
      });

      const expensesByCategory = Array.from(expenseCategoryMap.entries())
        .map(([category, amount]) => ({
          category,
          amount,
          percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
        }))
        .sort((a, b) => b.amount - a.amount);

      // Sales by payment method
      const paymentMethodMap = new Map<string, { amount: number; count: number }>();
      filteredSales.forEach(sale => {
        const existing = paymentMethodMap.get(sale.paymentMethod) || { amount: 0, count: 0 };
        paymentMethodMap.set(sale.paymentMethod, {
          amount: existing.amount + sale.totalAmount,
          count: existing.count + 1
        });
      });

      const salesByPaymentMethod = Array.from(paymentMethodMap.entries())
        .map(([method, data]) => ({ method, ...data }))
        .sort((a, b) => b.amount - a.amount);

      setReportData({
        sales: filteredSales,
        expenses: filteredExpenses,
        employees: allEmployees,
        revenue,
        totalExpenses,
        profit,
        profitMargin,
        topProducts,
        expensesByCategory,
        salesByPaymentMethod
      });
    } catch (err) {
      console.error('Error generating report:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      setError(null);
      await storage.refreshData();
      await generateReport();
    } catch (err) {
      console.error('Error refreshing report data:', err);
      setError(err instanceof Error ? err.message : 'Failed to refresh report data');
    } finally {
      setRefreshing(false);
    }
  };

  const exportToPDF = () => {
    if (!reportData) return;

    const reportTitle = `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Financial Report`;
    const dateRange = getDateRangeText();
    const doc = new jsPDF();
    let y = 10;
    doc.setFontSize(16);
    doc.text(reportTitle, 10, y);
    y += 10;
    doc.setFontSize(10);
    doc.text(`Period: ${dateRange}`, 10, y);
    y += 7;
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, y);
    y += 10;
    doc.setFontSize(12);
    doc.text('FINANCIAL SUMMARY', 10, y);
    y += 7;
    doc.setFontSize(10);
    doc.text(`Total Revenue: ${formatCurrency(reportData.revenue)}`, 10, y);
    y += 6;
    doc.text(`Total Expenses: ${formatCurrency(reportData.totalExpenses)}`, 10, y);
    y += 6;
    doc.text(`Net Profit: ${formatCurrency(reportData.profit)}`, 10, y);
    y += 6;
    doc.text(`Profit Margin: ${reportData.profitMargin.toFixed(2)}%`, 10, y);
    y += 10;
    doc.setFontSize(12);
    doc.text('TOP SELLING PRODUCTS', 10, y);
    y += 7;
    doc.setFontSize(10);
    reportData.topProducts.forEach((product, index) => {
      doc.text(`${index + 1}. ${product.product} - ${product.quantity} units - ${formatCurrency(product.revenue)}`, 10, y);
      y += 6;
      if (y > 270) { doc.addPage(); y = 10; }
    });
    y += 4;
    doc.setFontSize(12);
    doc.text('EXPENSES BY CATEGORY', 10, y);
    y += 7;
    doc.setFontSize(10);
    reportData.expensesByCategory.forEach(expense => {
      doc.text(`${expense.category}: ${formatCurrency(expense.amount)} (${expense.percentage.toFixed(1)}%)`, 10, y);
      y += 6;
      if (y > 270) { doc.addPage(); y = 10; }
    });
    y += 4;
    doc.setFontSize(12);
    doc.text('SALES BY PAYMENT METHOD', 10, y);
    y += 7;
    doc.setFontSize(10);
    reportData.salesByPaymentMethod.forEach(payment => {
      doc.text(`${payment.method.toUpperCase()}: ${formatCurrency(payment.amount)} (${payment.count} transactions)`, 10, y);
      y += 6;
      if (y > 270) { doc.addPage(); y = 10; }
    });
    doc.save(`${reportType}_report_${getDateRangeText().replace(/\s+/g, '_')}.pdf`);
  };

  const exportToExcel = () => {
    if (!reportData) return;
    // Prepare worksheet data
    const summarySheet = [
      ['Metric', 'Value'],
      ['Total Revenue', formatCurrency(reportData.revenue)],
      ['Total Expenses', formatCurrency(reportData.totalExpenses)],
      ['Net Profit', formatCurrency(reportData.profit)],
      ['Profit Margin', `${reportData.profitMargin.toFixed(2)}%`],
      ['Total Sales', reportData.sales.length],
      ['Total Expense Items', reportData.expenses.length],
    ];
    const topProductsSheet = [
      ['Product', 'Quantity', 'Revenue'],
      ...reportData.topProducts.map(p => [p.product, p.quantity, formatCurrency(p.revenue)])
    ];
    const expensesByCategorySheet = [
      ['Category', 'Amount', 'Percentage'],
      ...reportData.expensesByCategory.map(e => [e.category, formatCurrency(e.amount), `${e.percentage.toFixed(1)}%`])
    ];
    const salesByPaymentMethodSheet = [
      ['Method', 'Amount', 'Count'],
      ...reportData.salesByPaymentMethod.map(p => [p.method.toUpperCase(), formatCurrency(p.amount), p.count])
    ];
    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summarySheet), 'Summary');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(topProductsSheet), 'Top Products');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(expensesByCategorySheet), 'Expenses by Category');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(salesByPaymentMethodSheet), 'Sales by Payment');
    // Sales data sheet
    const salesHeaders = ['Date', 'Customer', 'Product', 'Quantity', 'Unit Price', 'Total', 'Payment Method', 'Sales Person'];
    const salesData = reportData.sales.map(sale => [
      formatDate(sale.date),
      sale.customerName,
      `${sale.product.brand} ${sale.product.model}`,
      sale.quantity,
      sale.unitPrice,
      sale.totalAmount,
      sale.paymentMethod,
      sale.salesPerson
    ]);
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([salesHeaders, ...salesData]), 'Sales Data');
    // Expenses data sheet
    const expensesHeaders = ['Date', 'Category', 'Subcategory', 'Description', 'Amount', 'Vendor', 'Payment Method', 'Status'];
    const expensesData = reportData.expenses.map(expense => [
      formatDate(expense.date),
      expense.category,
      expense.subcategory,
      expense.description,
      expense.amount,
      expense.vendor || '',
      expense.paymentMethod,
      expense.status
    ]);
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([expensesHeaders, ...expensesData]), 'Expenses Data');
    // Export
    XLSX.writeFile(wb, `${reportType}_financial_report_${getDateRangeText().replace(/\s+/g, '_')}.xlsx`);
  };

  const exportToCSV = () => {
    if (!reportData) return;
    // Sales CSV
    const salesHeaders = ['Date', 'Customer', 'Product', 'Quantity', 'Unit Price', 'Total', 'Payment Method', 'Sales Person'];
    const salesData = reportData.sales.map(sale => [
      formatDate(sale.date),
      sale.customerName,
      `${sale.product.brand} ${sale.product.model}`,
      sale.quantity,
      sale.unitPrice,
      sale.totalAmount,
      sale.paymentMethod,
      sale.salesPerson
    ]);
    const salesCSV = [salesHeaders, ...salesData].map(row => row.join(',')).join('\n');
    // Expenses CSV
    const expensesHeaders = ['Date', 'Category', 'Subcategory', 'Description', 'Amount', 'Vendor', 'Payment Method', 'Status'];
    const expensesData = reportData.expenses.map(expense => [
      formatDate(expense.date),
      expense.category,
      expense.subcategory,
      expense.description,
      expense.amount,
      expense.vendor || '',
      expense.paymentMethod,
      expense.status
    ]);
    const expensesCSV = [expensesHeaders, ...expensesData].map(row => row.join(',')).join('\n');
    // Create combined report
    const combinedCSV = `SALES DATA\n${salesCSV}\n\nEXPENSES DATA\n${expensesCSV}`;
    const blob = new Blob([combinedCSV], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}_report_${getDateRangeText().replace(/\s+/g, '_')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getDateRangeText = () => {
    switch (reportType) {
      case 'daily':
        return new Date(selectedDate).toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      case 'monthly':
        const [year, month] = selectedMonth.split('-');
        return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long'
        });
      case 'yearly':
        return selectedYear;
      default:
        return '';
    }
  };

  const getComparisonData = () => {
    if (!reportData) return null;

    // Get previous period data for comparison
    let prevStart: Date, prevEnd: Date;
    const { start, end } = getDateRange();

    switch (reportType) {
      case 'daily':
        prevStart = new Date(start);
        prevStart.setDate(prevStart.getDate() - 1);
        prevEnd = new Date(prevStart);
        prevEnd.setHours(23, 59, 59, 999);
        break;
      case 'monthly':
        prevStart = new Date(start);
        prevStart.setMonth(prevStart.getMonth() - 1);
        prevEnd = new Date(prevStart.getFullYear(), prevStart.getMonth() + 1, 0);
        prevEnd.setHours(23, 59, 59, 999);
        break;
      case 'yearly':
        prevStart = new Date(start);
        prevStart.setFullYear(prevStart.getFullYear() - 1);
        prevEnd = new Date(prevStart.getFullYear(), 11, 31);
        prevEnd.setHours(23, 59, 59, 999);
        break;
      default:
        return null;
    }

    // Load all sales and expenses from storage (sync, since reportData is already loaded)
    // This is safe because reportData is only set after all data is loaded
    const allSales = reportData.sales.concat(); // Not filtered, so we need to reload
    const allExpenses = reportData.expenses.concat();
    // But we need to actually reload all data, not just filtered
    // So we need to use the same logic as generateReport, but for previous period
    // We'll use a synchronous approach for this function
    // But since storage.getData is async, we need to make getComparisonData async and handle it in useEffect
    return null; // We'll move this logic to useEffect below
  };

  // --- New: Calculate comparison data in useEffect ---
  const [comparisonData, setComparisonData] = useState<{
    revenueChange: number;
    expenseChange: number;
    profitChange: number;
  } | null>(null);

  useEffect(() => {
    const calcComparison = async () => {
      if (!reportData) {
        setComparisonData(null);
        return;
      }
      let prevStart: Date, prevEnd: Date;
      const { start, end } = getDateRange();
      switch (reportType) {
        case 'daily':
          prevStart = new Date(start);
          prevStart.setDate(prevStart.getDate() - 1);
          prevEnd = new Date(prevStart);
          prevEnd.setHours(23, 59, 59, 999);
          break;
        case 'monthly':
          prevStart = new Date(start);
          prevStart.setMonth(prevStart.getMonth() - 1);
          prevEnd = new Date(prevStart.getFullYear(), prevStart.getMonth() + 1, 0);
          prevEnd.setHours(23, 59, 59, 999);
          break;
        case 'yearly':
          prevStart = new Date(start);
          prevStart.setFullYear(prevStart.getFullYear() - 1);
          prevEnd = new Date(prevStart.getFullYear(), 11, 31);
          prevEnd.setHours(23, 59, 59, 999);
          break;
        default:
          setComparisonData(null);
          return;
      }
      // Load all sales and expenses for previous period
      const [allSales, allExpenses] = await Promise.all([
        storage.getData<Sale>('sales'),
        storage.getData<Expense>('expenses')
      ]);
      const prevSales = allSales.filter(sale => {
        const saleDate = new Date(sale.date);
        return saleDate >= prevStart && saleDate <= prevEnd;
      });
      const prevExpenses = allExpenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= prevStart && expenseDate <= prevEnd;
      });
      const prevRevenue = calculateRevenue(prevSales);
      const prevTotalExpenses = calculateExpenses(prevExpenses);
      const prevProfit = calculateProfit(prevRevenue, prevTotalExpenses);
      // Calculate changes
      const getChange = (current: number, prev: number) => {
        if (prev === 0) return 0;
        return ((current - prev) / Math.abs(prev)) * 100;
      };
      setComparisonData({
        revenueChange: getChange(reportData.revenue, prevRevenue),
        expenseChange: getChange(reportData.totalExpenses, prevTotalExpenses),
        profitChange: getChange(reportData.profit, prevProfit)
      });
    };
    calcComparison();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportData, reportType, selectedDate, selectedMonth, selectedYear]);

  return (
    <div className="space-y-6 max-w-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
          <p className="text-gray-600">Generate comprehensive financial reports</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={exportToPDF}
            disabled={!reportData}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <FileText className="h-4 w-4" />
            <span>PDF</span>
          </button>
          <button
            onClick={exportToExcel}
            disabled={!reportData}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            <span>Excel</span>
          </button>
          <button
            onClick={exportToCSV}
            disabled={!reportData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Report Configuration */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as 'daily' | 'monthly' | 'yearly')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="daily">Daily Report</option>
              <option value="monthly">Monthly Report</option>
              <option value="yearly">Yearly Report</option>
            </select>
          </div>

          {reportType === 'daily' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {reportType === 'monthly' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Month</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          {reportType === 'yearly' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-end">
            <button
              onClick={generateReport}
              disabled={loading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <BarChart3 className="h-4 w-4" />
              <span>{loading ? 'Generating...' : 'Generate Report'}</span>
            </button>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <Calendar className="h-4 w-4 inline mr-2" />
            Report Period: <strong>{getDateRangeText()}</strong>
          </p>
        </div>
      </div>

      {/* Report Content */}
      {reportData && (
        <>
          {/* Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(reportData.revenue)}</p>
                  {comparisonData && (
                    <p className={`text-sm ${comparisonData.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {comparisonData.revenueChange >= 0 ? '+' : ''}{comparisonData.revenueChange.toFixed(1)}% vs previous
                    </p>
                  )}
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-600">{formatCurrency(reportData.totalExpenses)}</p>
                  {comparisonData && (
                    <p className={`text-sm ${comparisonData.expenseChange <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {comparisonData.expenseChange >= 0 ? '+' : ''}{comparisonData.expenseChange.toFixed(1)}% vs previous
                    </p>
                  )}
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <TrendingDown className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Net Profit</p>
                  <p className={`text-2xl font-bold ${reportData.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(reportData.profit)}
                  </p>
                  {comparisonData && (
                    <p className={`text-sm ${comparisonData.profitChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {comparisonData.profitChange >= 0 ? '+' : ''}{comparisonData.profitChange.toFixed(1)}% vs previous
                    </p>
                  )}
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Profit Margin</p>
                  <p className={`text-2xl font-bold ${reportData.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {reportData.profitMargin.toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-500">
                    {reportData.sales.length} transactions
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <PieChart className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts and Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Products */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h3>
              <div className="space-y-3">
                {reportData.topProducts.length > 0 ? (
                  reportData.topProducts.map((product, index) => (
                    <div key={product.product} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-blue-600 font-medium text-sm">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{product.product}</p>
                          <p className="text-sm text-gray-600">{product.quantity} units sold</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(product.revenue)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No sales data available for this period</p>
                )}
              </div>
            </div>

            {/* Expenses by Category */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Expenses by Category</h3>
              <div className="space-y-3">
                {reportData.expensesByCategory.length > 0 ? (
                  reportData.expensesByCategory.map((expense, index) => (
                    <div key={expense.category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-red-600 font-medium text-sm">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 capitalize">{expense.category}</p>
                          <p className="text-sm text-gray-600">{expense.percentage.toFixed(1)}% of total</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">{formatCurrency(expense.amount)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">No expense data available for this period</p>
                )}
              </div>
            </div>
          </div>

          {/* Sales by Payment Method */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales by Payment Method</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {reportData.salesByPaymentMethod.map((payment) => (
                <div key={payment.method} className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-600 uppercase">{payment.method}</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">{formatCurrency(payment.amount)}</p>
                    <p className="text-sm text-gray-500">{payment.count} transactions</p>
                    <p className="text-sm text-blue-600">
                      {((payment.amount / reportData.revenue) * 100).toFixed(1)}% of total
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Sales */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Sales</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.sales.slice(0, 10).map((sale) => (
                      <tr key={sale.id}>
                        <td className="px-4 py-2 text-sm text-gray-900">{formatDate(sale.date)}</td>
                        <td className="px-4 py-2 text-sm text-gray-900">{sale.customerName}</td>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">{formatCurrency(sale.totalAmount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Expenses */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Expenses</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.expenses.slice(0, 10).map((expense) => (
                      <tr key={expense.id}>
                        <td className="px-4 py-2 text-sm text-gray-900">{formatDate(expense.date)}</td>
                        <td className="px-4 py-2 text-sm text-gray-900 capitalize">{expense.category}</td>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">{formatCurrency(expense.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {loading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating report...</p>
        </div>
      )}

      {!reportData && !loading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Configure your report settings and click "Generate Report" to view analytics</p>
        </div>
      )}
    </div>
  );
};

export default Reports;