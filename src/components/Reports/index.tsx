import React, { useEffect } from "react";
import useReports from "./useReports";
import FinancialSummary from "./FinancialSummary";
import TopProducts from "./TopProducts";
import ExpensesByCategory from "./ExpensesByCategory";
import SalesByPaymentMethod from "./SalesByPaymentMethod";
import RecentSales from "./RecentSales";
import RecentExpenses from "./RecentExpenses";
import ReportConfig from "./ReportConfig";
import { getDateRangeText } from "./reportUtils";

const Reports: React.FC = () => {
  const {
    reportType,
    setReportType,
    selectedDate,
    setSelectedDate,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    reportData,
    loading,
    error,
    comparisonData,
    setError,
    generateReport,
    exportToExcel,
    exportToCSV,
    exportToPDF,
  } = useReports();

  // Automatically generate report on mount and when filters change
  useEffect(() => {
    generateReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportType, selectedDate, selectedMonth, selectedYear]);

  return (
    <div className="space-y-6 max-w-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Reports & Analytics
          </h2>
          <p className="text-gray-600">
            Generate comprehensive financial reports
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={exportToPDF}
            disabled={!reportData}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <span className="h-4 w-4">📝</span>
            <span>PDF</span>
          </button>
          <button
            onClick={exportToExcel}
            disabled={!reportData}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <span className="h-4 w-4">⬇️</span>
            <span>Excel</span>
          </button>
          <button
            onClick={exportToCSV}
            disabled={!reportData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
          >
            <span className="h-4 w-4">⬇️</span>
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
      <ReportConfig
        reportType={reportType}
        setReportType={setReportType}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        loading={loading}
      />
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <span className="h-4 w-4 inline mr-2">📅</span>
          Report Period:{" "}
          <strong>
            {getDateRangeText(
              reportType,
              selectedDate,
              selectedMonth,
              selectedYear
            )}
          </strong>
        </p>
      </div>
      {/* Report Content */}
      {reportData && (
        <>
          <FinancialSummary
            revenue={reportData.revenue}
            totalExpenses={reportData.totalExpenses}
            profit={reportData.profit}
            profitMargin={reportData.profitMargin}
            salesCount={reportData.sales.length}
            comparisonData={comparisonData}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopProducts topProducts={reportData.topProducts} />
            <ExpensesByCategory
              expensesByCategory={reportData.expensesByCategory}
            />
          </div>
          <SalesByPaymentMethod
            salesByPaymentMethod={reportData.salesByPaymentMethod}
            totalRevenue={reportData.revenue}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentSales sales={reportData.sales} />
            <RecentExpenses expenses={reportData.expenses} />
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
          <span className="h-12 w-12 text-gray-400 mx-auto mb-4">📊</span>
          <p className="text-gray-600">
            Configure your report settings and click "Generate Report" to view
            analytics
          </p>
        </div>
      )}
    </div>
  );
};

export default Reports;
