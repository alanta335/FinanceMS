import { useState, useEffect } from "react";
import { storage, PaginationOptions, PaginatedResult } from "../../utils/storage";
import { Sale } from "../../types";
import { generateId } from "../../utils/calculations";

export const useSalesManagement = () => {
    const [sales, setSales] = useState<Sale[]>([]);
    const [paginatedSales, setPaginatedSales] = useState<PaginatedResult<Sale> | null>(null);
    const [filteredSales, setFilteredSales] = useState<Sale[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [filters, setFilters] = useState({
        paymentMethod: "",
        dateRange: "",
        category: "",
    });
    const [newSale, setNewSale] = useState({
        product: {
            name: "",
            category: "",
            brand: "",
            model: "",
            serialNumber: "",
            imei: "",
            warrantyPeriod: 12,
        },
        quantity: 1,
        unitPrice: 0,
        paymentMethod: "cash" as "cash" | "card" | "emi" | "upi",
        customerName: "",
        customerPhone: "",
        salesPerson: "",
        commission: 0,
        notes: "",
    });

    useEffect(() => {
        loadSales();
    }, [currentPage, pageSize, sortBy, sortOrder]);

    useEffect(() => {
        filterSales();
        // eslint-disable-next-line
    }, [sales, searchTerm, filters]);

    const loadSales = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const paginationOptions: PaginationOptions = {
                page: currentPage,
                pageSize,
                sortBy,
                sortOrder
            };

            const result = await storage.getData<Sale>("sales", paginationOptions);
            
            if ('data' in result) {
                // Paginated result
                setPaginatedSales(result);
                setSales(result.data);
            } else {
                // Non-paginated result (fallback)
                setSales(result);
                setPaginatedSales(null);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load sales data");
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        try {
            setRefreshing(true);
            setError(null);
            await storage.refreshData("sales");
            await loadSales();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to refresh sales data");
        } finally {
            setRefreshing(false);
        }
    };

    const filterSales = () => {
        let filtered = [...sales];
        if (searchTerm) {
            filtered = filtered.filter(
                (sale) =>
                    sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    sale.product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    sale.product.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    sale.customerPhone.includes(searchTerm)
            );
        }
        if (filters.paymentMethod) {
            filtered = filtered.filter((sale) => sale.paymentMethod === filters.paymentMethod);
        }
        if (filters.category) {
            filtered = filtered.filter((sale) => sale.product.category === filters.category);
        }
        setFilteredSales(filtered);
    };

    const handleAddSale = async () => {
        try {
            const totalAmount = newSale.quantity * newSale.unitPrice;
            const commission = newSale.commission;
            const sale: Sale = {
                id: generateId(),
                date: new Date(),
                product: {
                    id: generateId(),
                    ...newSale.product,
                },
                quantity: newSale.quantity,
                unitPrice: newSale.unitPrice,
                totalAmount,
                paymentMethod: newSale.paymentMethod,
                customerName: newSale.customerName,
                customerPhone: newSale.customerPhone,
                salesPerson: newSale.salesPerson,
                commission,
                isReturned: false,
                warrantyStartDate: new Date(),
                notes: newSale.notes,
            };
            await storage.addItem("sales", sale);
            await loadSales();
            setShowAddModal(false);
            resetForm();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to add sale");
        }
        await handleRefresh();
    };

    const resetForm = () => {
        setNewSale({
            product: {
                name: "",
                category: "",
                brand: "",
                model: "",
                serialNumber: "",
                imei: "",
                warrantyPeriod: 12,
            },
            quantity: 1,
            unitPrice: 0,
            paymentMethod: "cash",
            customerName: "",
            customerPhone: "",
            salesPerson: "",
            commission: 0,
            notes: "",
        });
    };

    const handleDeleteSale = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this sale?")) {
            try {
                await storage.deleteItem("sales", id);
                await loadSales();
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to delete sale");
            }
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (newPageSize: number) => {
        setPageSize(newPageSize);
        setCurrentPage(1); // Reset to first page when changing page size
    };

    const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
        setCurrentPage(1); // Reset to first page when changing sort
    };

    return {
        sales,
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
        resetForm,
        loadSales,
    };
};