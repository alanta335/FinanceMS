// Types for ExpenseManagement
import { Expense } from "../../types";

export type NewExpense = {
  category: string;
  subcategory: string;
  amount: number;
  description: string;
  vendor: string;
  paymentMethod: "cash" | "card" | "cheque" | "online";
  isRecurring: boolean;
  recurringFrequency: "daily" | "weekly" | "monthly" | "yearly";
};
