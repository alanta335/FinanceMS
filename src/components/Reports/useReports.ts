import { useState } from "react";
import { storage } from "../../utils/storage";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";

import {
    calculateRevenue,
    calculateExpenses,
    calculateProfit,
    calculateProfitMargin,
} from "../../utils/calculations";
import { Employee, Expense, Sale } from "../../types";

export interface ReportData {
    sales: Sale[];
    expenses: Expense[];
    employees: Employee[];
    revenue: number;
    totalExpenses: number;
    profit: number;
    profitMargin: number;
    topProducts: Array<{ product: string; quantity: number; revenue: number }>;
    expensesByCategory: Array<{
        category: string;
        amount: number;
        percentage: number;
    }>;
    salesByPaymentMethod: Array<{
        method: string;
        amount: number;
        count: number;
    }>;
}

const useReports = () => {
    const [reportType, setReportType] = useState<"daily" | "monthly" | "yearly">("monthly");
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [reportData, setReportData] = useState<ReportData | null>(null);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [comparisonData, setComparisonData] = useState<{
        revenueChange: number;
        expenseChange: number;
        profitChange: number;
    } | null>(null);

    const generateReport = async () => {
        try {
            setLoading(true);
            setError(null);
            let start: Date, end: Date;
            switch (reportType) {
                case "daily":
                    start = new Date(selectedDate);
                    end = new Date(selectedDate);
                    end.setHours(23, 59, 59, 999);
                    break;
                case "monthly": {
                    const [year, month] = selectedMonth.split("-");
                    start = new Date(parseInt(year), parseInt(month) - 1, 1);
                    end = new Date(parseInt(year), parseInt(month), 0);
                    end.setHours(23, 59, 59, 999);
                    break;
                }
                case "yearly":
                    start = new Date(parseInt(selectedYear), 0, 1);
                    end = new Date(parseInt(selectedYear), 11, 31);
                    end.setHours(23, 59, 59, 999);
                    break;
                default:
                    start = new Date();
                    end = new Date();
            }
            const [allSales, allExpenses, allEmployees] = await Promise.all([
                storage.getData<Sale>("sales"),
                storage.getData<Expense>("expenses"),
                storage.getData<Employee>("employees"),
            ]);
            const filteredSales = allSales.filter((sale: Sale) => {
                const saleDate = new Date(sale.date);
                return saleDate >= start && saleDate <= end;
            });
            const filteredExpenses = allExpenses.filter((expense: Expense) => {
                const expenseDate = new Date(expense.date);
                return expenseDate >= start && expenseDate <= end;
            });
            const revenue = calculateRevenue(filteredSales);
            const totalExpenses = calculateExpenses(filteredExpenses);
            const profit = calculateProfit(revenue, totalExpenses);
            const profitMargin = calculateProfitMargin(profit, revenue);
            const productMap = new Map<string, { quantity: number; revenue: number }>();
            filteredSales.forEach((sale: Sale) => {
                const productKey = `${sale.product.brand} ${sale.product.model}`;
                const existing = productMap.get(productKey) || { quantity: 0, revenue: 0 };
                productMap.set(productKey, {
                    quantity: existing.quantity + sale.quantity,
                    revenue: existing.revenue + sale.totalAmount,
                });
            });
            const topProducts = Array.from(productMap.entries())
                .map(([product, data]) => ({ product, ...data }))
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 10);
            const expenseCategoryMap = new Map<string, number>();
            filteredExpenses.forEach((expense: Expense) => {
                const existing = expenseCategoryMap.get(expense.category) || 0;
                expenseCategoryMap.set(expense.category, existing + expense.amount);
            });
            const expensesByCategory = Array.from(expenseCategoryMap.entries())
                .map(([category, amount]) => ({
                    category,
                    amount,
                    percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
                }))
                .sort((a, b) => b.amount - a.amount);
            const paymentMethodMap = new Map<string, { amount: number; count: number }>();
            filteredSales.forEach((sale: Sale) => {
                const existing = paymentMethodMap.get(sale.paymentMethod) || { amount: 0, count: 0 };
                paymentMethodMap.set(sale.paymentMethod, {
                    amount: existing.amount + sale.totalAmount,
                    count: existing.count + 1,
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
                salesByPaymentMethod,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate report");
        } finally {
            setLoading(false);
        }
    };

    const exportToExcel = () => {
        if (!reportData) return;
        const summarySheet = [
            ["Metric", "Value"],
            ["Total Revenue", reportData.revenue],
            ["Total Expenses", reportData.totalExpenses],
            ["Net Profit", reportData.profit],
            ["Profit Margin", `${reportData.profitMargin.toFixed(2)}%`],
            ["Total Sales", reportData.sales.length],
            ["Total Expense Items", reportData.expenses.length],
        ];
        const topProductsSheet = [
            ["Product", "Quantity", "Revenue"],
            ...reportData.topProducts.map((p) => [p.product, p.quantity, p.revenue]),
        ];
        const expensesByCategorySheet = [
            ["Category", "Amount", "Percentage"],
            ...reportData.expensesByCategory.map((e) => [e.category, e.amount, `${e.percentage.toFixed(1)}%`]),
        ];
        const salesByPaymentMethodSheet = [
            ["Method", "Amount", "Count"],
            ...reportData.salesByPaymentMethod.map((p) => [p.method, p.amount, p.count]),
        ];
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summarySheet), "Summary");
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(topProductsSheet), "Top Products");
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(expensesByCategorySheet), "Expenses by Category");
        XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(salesByPaymentMethodSheet), "Sales by Payment");
        XLSX.writeFile(wb, `report_${Date.now()}.xlsx`);
    };

    const exportToCSV = () => {
        if (!reportData) return;
        const salesHeaders = ["Date", "Customer", "Product", "Quantity", "Unit Price", "Total", "Payment Method", "Sales Person"];
        const salesData = reportData.sales.map((sale) => [sale.date, sale.customerName, `${sale.product.brand} ${sale.product.model}`, sale.quantity, sale.unitPrice, sale.totalAmount, sale.paymentMethod, sale.salesPerson]);
        const salesCSV = [salesHeaders, ...salesData].map((row) => row.join(",")).join("\n");
        const expensesHeaders = ["Date", "Category", "Subcategory", "Description", "Amount", "Vendor", "Payment Method", "Status"];
        const expensesData = reportData.expenses.map((expense) => [expense.date, expense.category, expense.subcategory, expense.description, expense.amount, expense.vendor || "", expense.paymentMethod, expense.status]);
        const expensesCSV = [expensesHeaders, ...expensesData].map((row) => row.join(",")).join("\n");
        const combinedCSV = `SALES DATA\n${salesCSV}\n\nEXPENSES DATA\n${expensesCSV}`;
        const blob = new Blob([combinedCSV], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `report_${Date.now()}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const exportToPDF = () => {
        if (!reportData) return;
        const doc = new jsPDF();
        let y = 10;
        doc.setFontSize(16);
        doc.text("Financial Report", 10, y);
        y += 10;
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 10, y);
        y += 10;
        doc.setFontSize(12);
        doc.text("FINANCIAL SUMMARY", 10, y);
        y += 7;
        doc.setFontSize(10);
        doc.text(`Total Revenue: ${reportData.revenue}`, 10, y);
        y += 6;
        doc.text(`Total Expenses: ${reportData.totalExpenses}`, 10, y);
        y += 6;
        doc.text(`Net Profit: ${reportData.profit}`, 10, y);
        y += 6;
        doc.text(`Profit Margin: ${reportData.profitMargin.toFixed(2)}%`, 10, y);
        y += 10;
        doc.setFontSize(12);
        doc.text("TOP SELLING PRODUCTS", 10, y);
        y += 7;
        doc.setFontSize(10);
        reportData.topProducts.forEach((product, index) => {
            doc.text(`${index + 1}. ${product.product} - ${product.quantity} units - ${product.revenue}`, 10, y);
            y += 6;
            if (y > 270) {
                doc.addPage();
                y = 10;
            }
        });
        y += 4;
        doc.setFontSize(12);
        doc.text("EXPENSES BY CATEGORY", 10, y);
        y += 7;
        doc.setFontSize(10);
        reportData.expensesByCategory.forEach((expense) => {
            doc.text(`${expense.category}: ${expense.amount} (${expense.percentage.toFixed(1)}%)`, 10, y);
            y += 6;
            if (y > 270) {
                doc.addPage();
                y = 10;
            }
        });
        y += 4;
        doc.setFontSize(12);
        doc.text("SALES BY PAYMENT METHOD", 10, y);
        y += 7;
        doc.setFontSize(10);
        reportData.salesByPaymentMethod.forEach((payment) => {
            doc.text(`${payment.method.toUpperCase()}: ${payment.amount} (${payment.count} transactions)`, 10, y);
            y += 6;
            if (y > 270) {
                doc.addPage();
                y = 10;
            }
        });
        doc.save(`report_${Date.now()}.pdf`);
    };

    return {
        reportType,
        setReportType,
        selectedDate,
        setSelectedDate,
        selectedMonth,
        setSelectedMonth,
        selectedYear,
        setSelectedYear,
        reportData,
        setReportData,
        loading,
        setLoading,
        refreshing,
        setRefreshing,
        error,
        setError,
        comparisonData,
        setComparisonData,
        generateReport,
        exportToExcel,
        exportToCSV,
        exportToPDF,
    };
};

export default useReports;
