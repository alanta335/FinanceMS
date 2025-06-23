// Utility functions for Reports (date range, calculations, export helpers, etc.)
// Removed unused imports to fix warnings

export function getDateRange(reportType: "daily" | "monthly" | "yearly", selectedDate: string, selectedMonth: string, selectedYear: string) {
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
    return { start, end };
}

export function getDateRangeText(reportType: "daily" | "monthly" | "yearly", selectedDate: string, selectedMonth: string, selectedYear: string) {
    switch (reportType) {
        case "daily":
            return new Date(selectedDate).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
        case "monthly": {
            const [year, month] = selectedMonth.split("-");
            return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString("en-IN", { year: "numeric", month: "long" });
        }
        case "yearly":
            return selectedYear;
        default:
            return "";
    }
}

// Add more helpers as needed (e.g., for comparison data, export, etc.)
