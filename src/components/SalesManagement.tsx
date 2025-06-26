import React from "react";
import { useSalesManagement } from "./SalesManagement/useSalesManagement";
import SummaryCards from "./SalesManagement/ui/SummaryCards";
import ErrorDisplay from "./SalesManagement/ui/ErrorDisplay";
import Filters from "./SalesManagement/ui/Filters";
import SalesTable from "./SalesManagement/ui/SalesTable";
import AddSaleModal from "./SalesManagement/ui/AddSaleModal";
import SaleDetailsModal from "./SalesManagement/ui/SaleDetailsModal";
import Pagination from "./common/Pagination";
import { Sale } from "../types";

const SalesManagement: React.FC = () => {
  const {
    paginatedSales,
    filteredSales,
    searchTerm,
    setSearchTerm,
    showAddModal,
    setShowAddModal,
    selectedSale,
    setSelectedSale,
    loading,
    refreshing,
    error,
    setError,
    filters,
    setFilters,
    newSale,
    setNewSale,
    currentPage,
    pageSize,
    sortBy,
    sortOrder,
    handleAddSale,
    handleDeleteSale,
    handleRefresh,
    handlePageChange,
    handlePageSizeChange,
    handleSortChange,
  } = useSalesManagement();

  const getTotalSalesAmount = () =>
    filteredSales.reduce(
      (total: number, sale: Sale) => total + sale.totalAmount,
      0
    );
  const getTotalQuantitySold = () =>
    filteredSales.reduce(
      (total: number, sale: Sale) => total + sale.quantity,
      0
    );
  const getTotalCommission = () =>
    filteredSales.reduce(
      (total: number, sale: Sale) => total + sale.commission,
      0
    );

  const exportToCSV = () => {
    const headers = [
      "Date",
      "Customer",
      "Product",
      "Quantity",
      "Unit Price",
      "Total",
      "Payment Method",
      "Sales Person",
    ];
    const csvData = filteredSales.map((sale: Sale) => [
      sale.date,
      sale.customerName,
      `${sale.product.brand} ${sale.product.model}`,
      sale.quantity,
      sale.unitPrice,
      sale.totalAmount,
      sale.paymentMethod,
      sale.salesPerson,
    ]);
    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sales_report.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-none">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading sales...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sales Management</h2>
          <p className="text-gray-600">
            Track and manage all sales transactions
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value={2}>2 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <span>Add Sale</span>
          </button>
        </div>
      </div>

      {/* Error Display */}
      <ErrorDisplay error={error} onDismiss={() => setError(null)} />

      {/* Summary Cards */}
      <SummaryCards
        totalSales={getTotalSalesAmount()}
        totalQuantity={getTotalQuantitySold()}
        totalCommission={getTotalCommission()}
      />

      {/* Filters and Search */}
      <Filters
        filters={filters}
        setFilters={(f) => setFilters(f)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onExport={exportToCSV}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />

      {/* Sales Table */}
      <SalesTable
        sales={filteredSales}
        onView={setSelectedSale}
        onDelete={handleDeleteSale}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />

      {/* Pagination */}
      {paginatedSales && (
        <Pagination
          currentPage={currentPage}
          totalPages={paginatedSales.pagination.totalPages}
          onPageChange={handlePageChange}
          totalItems={paginatedSales.pagination.totalCount}
          pageSize={pageSize}
        />
      )}

      {/* Add Sale Modal */}
      {showAddModal && (
        <AddSaleModal
          newSale={newSale}
          setNewSale={(s) => setNewSale(s)}
          onAdd={handleAddSale}
          onCancel={() => setShowAddModal(false)}
        />
      )}

      {/* Sale Details Modal */}
      {selectedSale && (
        <SaleDetailsModal
          sale={selectedSale}
          onClose={() => setSelectedSale(null)}
        />
      )}
    </div>
  );
};

export default SalesManagement;