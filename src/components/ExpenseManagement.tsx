import React from "react";
import {
  useExpenseManagement,
  ErrorDisplay,
  SummaryCards,
  Filters,
  ExpensesTable,
  AddExpenseModal,
  ExpenseDetailsModal,
} from "./ExpenseManagement";
import { Expense } from "../types";

const ExpenseManagement: React.FC = () => {
  const {
    filteredExpenses,
    searchTerm,
    setSearchTerm,
    showAddModal,
    setShowAddModal,
    selectedExpense,
    setSelectedExpense,
    loading,
    refreshing,
    error,
    setError,
    filters,
    setFilters,
    newExpense,
    setNewExpense,
    expenseCategories,
    handleAddExpense,
    handleDeleteExpense,
    handleApproveExpense,
    handleRejectExpense,
    handleRefresh,
  } = useExpenseManagement();

  const exportToCSV = () => {
    const headers = [
      "Date",
      "Category",
      "Subcategory",
      "Description",
      "Amount",
      "Vendor",
      "Payment Method",
      "Status",
    ];
    const csvData = filteredExpenses.map((expense: Expense) => [
      expense.date,
      expense.category,
      expense.subcategory,
      expense.description,
      expense.amount,
      expense.vendor || "",
      expense.paymentMethod,
      expense.status,
    ]);
    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "expenses_report.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  type ExpenseCategory = {
    value: string;
    label: string;
    subcategories: string[];
  };

  const getSelectedCategory = () => {
    return expenseCategories.find((cat: ExpenseCategory) => cat.value === newExpense.category);
  };

  const getTotalExpenses = () => {
    return filteredExpenses.reduce(
      (total: number, expense: Expense) => total + expense.amount,
      0
    );
  };
  const getApprovedExpenses = () => {
    return filteredExpenses
      .filter((expense: Expense) => expense.status === "approved")
      .reduce((total: number, expense: Expense) => total + expense.amount, 0);
  };
  const getPendingExpenses = () => {
    return filteredExpenses
      .filter((expense: Expense) => expense.status === "pending")
      .reduce((total: number, expense: Expense) => total + expense.amount, 0);
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-none">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading expenses...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-none">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Expense Management
          </h2>
          <p className="text-gray-600">
            Track and manage all business expenses
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <span className={refreshing ? "animate-spin" : ""}>⟳</span>
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <span>＋</span>
            <span>Add Expense</span>
          </button>
        </div>
      </div>
      <ErrorDisplay error={error} onDismiss={() => setError(null)} />
      <SummaryCards
        total={getTotalExpenses()}
        approved={getApprovedExpenses()}
        pending={getPendingExpenses()}
      />
      <Filters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={filters}
        setFilters={setFilters}
        expenseCategories={expenseCategories}
        exportToCSV={exportToCSV}
      />
      <ExpensesTable
        expenses={filteredExpenses}
        onView={setSelectedExpense}
        onApprove={handleApproveExpense}
        onReject={handleRejectExpense}
        onDelete={handleDeleteExpense}
      />
      <AddExpenseModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddExpense}
        newExpense={newExpense}
        setNewExpense={setNewExpense}
        expenseCategories={expenseCategories}
        getSelectedCategory={getSelectedCategory}
      />
      <ExpenseDetailsModal
        expense={selectedExpense}
        onClose={() => setSelectedExpense(null)}
      />
    </div>
  );
};

export default ExpenseManagement;
