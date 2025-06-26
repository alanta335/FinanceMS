import { useState, useEffect, useCallback } from "react";
import { storage, PaginationOptions, PaginatedResult } from "../../utils/storage";
import { Expense } from "../../types";
import { NewExpense } from "./types";
import { generateId } from "../../utils/calculations";

export const useExpenseManagement = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [paginatedExpenses, setPaginatedExpenses] = useState<PaginatedResult<Expense> | null>(null);
    const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [filters, setFilters] = useState({
        category: "",
        status: "",
        paymentMethod: "",
        dateRange: "",
    });
    const [newExpense, setNewExpense] = useState<NewExpense>({
        category: "",
        subcategory: "",
        amount: 0,
        description: "",
        vendor: "",
        paymentMethod: "cash",
        isRecurring: false,
        recurringFrequency: "monthly",
    });

    const expenseCategories = [
        { value: "rent", label: "Rent & Utilities", subcategories: ["Shop Rent", "Electricity", "Water", "Internet"] },
        { value: "inventory", label: "Inventory", subcategories: ["Product Purchase", "Shipping", "Storage"] },
        { value: "marketing", label: "Marketing", subcategories: ["Advertising", "Social Media", "Print Materials"] },
        { value: "salary", label: "Salary & Benefits", subcategories: ["Basic Salary", "Commission", "Bonus", "Insurance"] },
        { value: "maintenance", label: "Maintenance", subcategories: ["Equipment Repair", "Cleaning", "Security"] },
        { value: "office", label: "Office Supplies", subcategories: ["Stationery", "Furniture", "Software"] },
        { value: "legal", label: "Legal & Professional", subcategories: ["Legal Fees", "Accounting", "Consultation"] },
        { value: "travel", label: "Travel & Transport", subcategories: ["Fuel", "Public Transport", "Business Travel"] },
        { value: "miscellaneous", label: "Miscellaneous", subcategories: ["Others"] },
    ];

    const loadExpenses = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            
            const paginationOptions: PaginationOptions = {
                page: currentPage,
                pageSize,
                sortBy,
                sortOrder
            };

            const result = await storage.getData<Expense>("expenses", paginationOptions);
            
            if ('data' in result) {
                // Paginated result
                setPaginatedExpenses(result);
                setExpenses(result.data);
            } else {
                // Non-paginated result (fallback)
                setExpenses(result);
                setPaginatedExpenses(null);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load expenses data");
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, sortBy, sortOrder]);

    const filterExpenses = useCallback(() => {
        let filtered = [...expenses];
        if (searchTerm) {
            filtered = filtered.filter(
                (expense) =>
                    expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    expense.vendor?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (filters.category) filtered = filtered.filter((expense) => expense.category === filters.category);
        if (filters.status) filtered = filtered.filter((expense) => expense.status === filters.status);
        if (filters.paymentMethod) filtered = filtered.filter((expense) => expense.paymentMethod === filters.paymentMethod);
        setFilteredExpenses(filtered);
    }, [expenses, searchTerm, filters]);

    useEffect(() => { loadExpenses(); }, [loadExpenses]);
    useEffect(() => { filterExpenses(); }, [expenses, searchTerm, filters, filterExpenses]);

    const handleRefresh = async () => {
        try {
            setRefreshing(true);
            setError(null);
            await storage.refreshData("expenses");
            await loadExpenses();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to refresh expenses data");
        } finally {
            setRefreshing(false);
        }
    };

    const handleAddExpense = async () => {
        try {
            const expense: Expense = {
                id: generateId(),
                date: new Date(),
                category: newExpense.category,
                subcategory: newExpense.subcategory,
                amount: newExpense.amount,
                description: newExpense.description,
                vendor: newExpense.vendor,
                paymentMethod: newExpense.paymentMethod,
                status: "pending",
                isRecurring: newExpense.isRecurring,
                recurringFrequency: newExpense.isRecurring ? newExpense.recurringFrequency : undefined,
                from_location: newExpense.from_location,
                to_location: newExpense.to_location,
            };
            await storage.addItem("expenses", expense);
            await loadExpenses();
            setShowAddModal(false);
            resetForm();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to add expense");
        }
        await handleRefresh();
    };

    const resetForm = () => {
        setNewExpense({
            category: "",
            subcategory: "",
            amount: 0,
            description: "",
            vendor: "",
            paymentMethod: "cash",
            isRecurring: false,
            recurringFrequency: "monthly",
        });
    };

    const handleDeleteExpense = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this expense?")) {
            try {
                await storage.deleteItem("expenses", id);
                await loadExpenses();
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to delete expense");
            }
        }
    };

    const handleApproveExpense = async (id: string) => {
        try {
            await storage.updateItem<Expense>(
                "expenses",
                id,
                { status: "approved", approvedBy: "Admin" }
            );
            await loadExpenses();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to approve expense");
        }
        await handleRefresh();
    };

    const handleRejectExpense = async (id: string) => {
        try {
            await storage.updateItem<Expense>(
                "expenses",
                id,
                { status: "rejected", approvedBy: "Admin" }
            );
            await loadExpenses();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to reject expense");
        }
        await handleRefresh();
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize);
        setCurrentPage(1);
    };

    const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
        setCurrentPage(1);
    };

    return {
        expenses,
        paginatedExpenses,
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
        currentPage,
        pageSize,
        sortBy,
        sortOrder,
        expenseCategories,
        handleAddExpense,
        handleDeleteExpense,
        handleApproveExpense,
        handleRejectExpense,
        handleRefresh,
        handlePageChange,
        handlePageSizeChange,
        handleSortChange,
        resetForm,
        loadExpenses,
    };
};