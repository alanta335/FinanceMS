import { supabaseStorage, PaginationOptions, PaginatedResult } from './supabaseStorage';
import { Sale, Expense, Employee, Product } from '../types';

interface StorageData {
  sales: Sale[];
  expenses: Expense[];
  employees: Employee[];
  products: Product[];
}

class DataStorage {
  async getData<T>(key: keyof StorageData, options?: PaginationOptions): Promise<T[] | PaginatedResult<T>> {
    try {
      switch (key) {
        case 'sales':
          return await supabaseStorage.getSales(options) as unknown as T[] | PaginatedResult<T>;
        case 'expenses':
          return await supabaseStorage.getExpenses(options) as unknown as T[] | PaginatedResult<T>;
        case 'employees':
          return await supabaseStorage.getEmployees(options) as unknown as T[] | PaginatedResult<T>;
        case 'products':
          return await supabaseStorage.getProducts(options) as unknown as T[] | PaginatedResult<T>;
        default:
          throw new Error(`Unknown data type: ${key}`);
      }
    } catch (error) {
      console.error(`Error fetching ${key} from Supabase:`, error);
      throw new Error(`Unable to load ${key}. Please check your internet connection and try again.`);
    }
  }

  async addItem<T extends { id: string }>(key: keyof StorageData, item: T): Promise<void> {
    try {
      switch (key) {
        case 'sales':
          await supabaseStorage.addSale(item as unknown as Sale);
          break;
        case 'expenses':
          await supabaseStorage.addExpense(item as unknown as Expense);
          break;
        case 'employees':
          await supabaseStorage.addEmployee(item as unknown as Employee);
          break;
        case 'products':
          await supabaseStorage.addProduct(item as unknown as Product);
          break;
        default:
          throw new Error(`Unknown data type: ${key}`);
      }
    } catch (error) {
      console.error(`Error adding ${key} item:`, error);
      throw new Error(`Failed to add ${key.slice(0, -1)}. Please try again.`);
    }
  }

  async updateItem<T extends { id: string }>(key: keyof StorageData, id: string, updates: Partial<T>): Promise<void> {
    try {
      switch (key) {
        case 'sales':
          await supabaseStorage.updateSale(id, updates as Partial<Sale>);
          break;
        case 'expenses':
          await supabaseStorage.updateExpense(id, updates as Partial<Expense>);
          break;
        case 'employees':
          await supabaseStorage.updateEmployee(id, updates as Partial<Employee>);
          break;
        case 'products':
          await supabaseStorage.updateProduct(id, updates as Partial<Product>);
          break;
        default:
          throw new Error(`Unknown data type: ${key}`);
      }
    } catch (error) {
      console.error(`Error updating ${key} item:`, error);
      throw new Error(`Failed to update ${key.slice(0, -1)}. Please try again.`);
    }
  }

  async deleteItem(key: keyof StorageData, id: string): Promise<void> {
    try {
      switch (key) {
        case 'sales':
          await supabaseStorage.deleteSale(id);
          break;
        case 'expenses':
          await supabaseStorage.deleteExpense(id);
          break;
        case 'employees':
          await supabaseStorage.deleteEmployee(id);
          break;
        case 'products':
          await supabaseStorage.deleteProduct(id);
          break;
        default:
          throw new Error(`Unknown data type: ${key}`);
      }
    } catch (error) {
      console.error(`Error deleting ${key} item:`, error);
      throw new Error(`Failed to delete ${key.slice(0, -1)}. Please try again.`);
    }
  }

  async refreshData(key?: keyof StorageData): Promise<void> {
    try {
      if (key) {
        await this.getData(key);
      } else {
        await Promise.all([
          this.getData('sales'),
          this.getData('expenses'),
          this.getData('employees'),
          this.getData('products')
        ]);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      throw new Error('Failed to refresh data. Please try again.');
    }
  }

  async clearAll(): Promise<void> {
    try {
      await supabaseStorage.clearAll();
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw new Error('Failed to clear all data. Please try again.');
    }
  }
}

export const storage = new DataStorage();
export type { PaginationOptions, PaginatedResult } from './supabaseStorage';