import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, AlertTriangle } from 'lucide-react';
import { storage } from '../utils/storage';
import { calculateRevenue, calculateExpenses, calculateProfit, calculateProfitMargin, formatCurrency, getTopSellingProducts, getMonthlyTrends } from '../utils/calculations';
import { Sale, Expense, FinancialSummary } from '../types';

const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<FinancialSummary>({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    profitMargin: 0,
    topSellingProducts: [],
    monthlyTrends: []
  });

  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [salesData, expensesData] = await Promise.all([
        storage.getData<Sale>('sales'),
        storage.getData<Expense>('expenses')
      ]);
      
      setSales(salesData);
      setExpenses(expensesData);

      const currentMonth = new Date();
      const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      
      const monthlyRevenue = calculateRevenue(salesData, { start: startOfMonth, end: endOfMonth });
      const monthlyExpenses = calculateExpenses(expensesData, { start: startOfMonth, end: endOfMonth });
      const monthlyProfit = calculateProfit(monthlyRevenue, monthlyExpenses);
      const profitMargin = calculateProfitMargin(monthlyProfit, monthlyRevenue);
      
      setSummary({
        totalRevenue: monthlyRevenue,
        totalExpenses: monthlyExpenses,
        netProfit: monthlyProfit,
        profitMargin,
        topSellingProducts: getTopSellingProducts(salesData),
        monthlyTrends: getMonthlyTrends(salesData, expensesData)
      });
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const MetricCard: React.FC<{
    title: string;
    value: string;
    change: string;
    changeType: 'positive' | 'negative' | 'neutral';
    icon: React.ReactNode;
    color: string;
  }> = ({ title, value, change, changeType, icon, color }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          <div className="flex items-center mt-2">
            <span className={`text-sm font-medium ${
              changeType === 'positive' ? 'text-green-600' : 
              changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {change}
            </span>
            <span className="text-sm text-gray-500 ml-1">vs last month</span>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-8 max-w-none">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8 max-w-none">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
            <h3 className="text-red-800 font-medium">Error Loading Dashboard</h3>
          </div>
          <p className="text-red-700 mt-2">{error}</p>
          <button
            onClick={loadData}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-600 mt-1">Welcome back! Here's your business overview.</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={formatCurrency(summary.totalRevenue)}
          change="+12.5%"
          changeType="positive"
          icon={<TrendingUp className="h-6 w-6 text-white" />}
          color="bg-green-500"
        />
        <MetricCard
          title="Total Expenses"
          value={formatCurrency(summary.totalExpenses)}
          change="+5.2%"
          changeType="negative"
          icon={<TrendingDown className="h-6 w-6 text-white" />}
          color="bg-red-500"
        />
        <MetricCard
          title="Net Profit"
          value={formatCurrency(summary.netProfit)}
          change="+18.3%"
          changeType="positive"
          icon={<DollarSign className="h-6 w-6 text-white" />}
          color="bg-blue-500"
        />
        <MetricCard
          title="Profit Margin"
          value={`${summary.profitMargin.toFixed(1)}%`}
          change="+2.1%"
          changeType="positive"
          icon={<ShoppingBag className="h-6 w-6 text-white" />}
          color="bg-purple-500"
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Trends Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Trends</h3>
          <div className="h-64 flex items-end space-x-2">
            {summary.monthlyTrends.map((month, index) => (
              <div key={month.month} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col items-center space-y-1">
                  <div 
                    className="w-full bg-blue-500 rounded-t opacity-80 hover:opacity-100 transition-opacity"
                    style={{ height: `${Math.max((month.revenue / Math.max(...summary.monthlyTrends.map(m => m.revenue))) * 200, 4)}px` }}
                    title={`Revenue: ${formatCurrency(month.revenue)}`}
                  />
                  <div 
                    className="w-full bg-red-500 rounded-b opacity-80 hover:opacity-100 transition-opacity"
                    style={{ height: `${Math.max((month.expenses / Math.max(...summary.monthlyTrends.map(m => m.expenses))) * 100, 2)}px` }}
                    title={`Expenses: ${formatCurrency(month.expenses)}`}
                  />
                </div>
                <span className="text-xs text-gray-600 mt-2">{month.month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center space-x-4 mt-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
              <span className="text-gray-600">Revenue</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
              <span className="text-gray-600">Expenses</span>
            </div>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Selling Products</h3>
          <div className="space-y-4">
            {summary.topSellingProducts.length > 0 ? (
              summary.topSellingProducts.map((product, index) => (
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
              <div className="text-center py-8">
                <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No sales data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activities</h3>
        <div className="space-y-4">
          {sales.slice(0, 5).map((sale, index) => (
            <div key={sale.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    Sale: {sale.product.brand} {sale.product.model}
                  </p>
                  <p className="text-sm text-gray-600">
                    {sale.customerName} • {new Date(sale.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">{formatCurrency(sale.totalAmount)}</p>
                <p className="text-sm text-gray-600">{sale.paymentMethod.toUpperCase()}</p>
              </div>
            </div>
          ))}
          
          {expenses.slice(0, 3).map((expense, index) => (
            <div key={expense.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <TrendingDown className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Expense: {expense.category}</p>
                  <p className="text-sm text-gray-600">
                    {expense.description} • {new Date(expense.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-red-600">-{formatCurrency(expense.amount)}</p>
                <p className="text-sm text-gray-600">{expense.paymentMethod.toUpperCase()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;