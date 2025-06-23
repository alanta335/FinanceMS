import { supabaseStorage } from './supabaseStorage';
import { Sale, Expense, Employee, Product } from '../types';

interface StorageData {
  sales: Sale[];
  expenses: Expense[];
  employees: Employee[];
  products: Product[];
}

class DataStorage {
  private cache: { [K in keyof StorageData]?: StorageData[K] } = {};
  private cacheTimestamps: Partial<Record<keyof StorageData, number>> = {};
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  private isCacheValid(key: keyof StorageData): boolean {
    const timestamp = this.cacheTimestamps[key];
    if (!timestamp) return false;
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  private setCacheData<T>(key: keyof StorageData, data: T[]): void {
    switch (key) {
      case 'sales':
        this.cache.sales = data as Sale[];
        break;
      case 'expenses':
        this.cache.expenses = data as Expense[];
        break;
      case 'employees':
        this.cache.employees = data as Employee[];
        break;
      case 'products':
        this.cache.products = data as Product[];
        break;
    }
    this.cacheTimestamps[key] = Date.now();
  }

  private clearCache(key?: keyof StorageData): void {
    if (key) {
      delete this.cache[key];
      delete this.cacheTimestamps[key];
    } else {
      this.cache = {};
      this.cacheTimestamps = {};
    }
  }

  async getData<T>(key: keyof StorageData): Promise<T[]> {
    try {
      // Check cache first
      if (this.isCacheValid(key) && this.cache[key]) {
        return this.cache[key] as T[];
      }

      let data: T[] = [];

      switch (key) {
        case 'sales':
          data = await supabaseStorage.getSales() as unknown as T[];
          break;
        case 'expenses':
          data = await supabaseStorage.getExpenses() as unknown as T[];
          break;
        case 'employees':
          data = await supabaseStorage.getEmployees() as unknown as T[];
          break;
        case 'products':
          data = await supabaseStorage.getProducts() as unknown as T[];
          break;
        default:
          throw new Error(`Unknown data type: ${key}`);
      }

      // Cache the data
      this.setCacheData(key, data);

      return data;
    } catch (error) {
      console.error(`Error fetching ${key} from Supabase:`, error);

      // Return cached data if available, even if expired
      if (this.cache[key]) {
        console.warn(`Using stale cache for ${key} due to error`);
        return this.cache[key] as unknown as T[];
      }

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

      // Update cache
      if (this.cache[key]) {
        (this.cache[key] as unknown as T[]).push(item);
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

      // Update cache
      if (this.cache[key]) {
        const items = this.cache[key] as T[];
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
          items[index] = { ...items[index], ...updates };
        }
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

      // Update cache
      switch (key) {
        case 'sales':
          this.cache.sales = (this.cache.sales || []).filter(item => item.id !== id);
          break;
        case 'expenses':
          this.cache.expenses = (this.cache.expenses || []).filter(item => item.id !== id);
          break;
        case 'employees':
          this.cache.employees = (this.cache.employees || []).filter(item => item.id !== id);
          break;
        case 'products':
          this.cache.products = (this.cache.products || []).filter(item => item.id !== id);
          break;
      }

    } catch (error) {
      console.error(`Error deleting ${key} item:`, error);
      throw new Error(`Failed to delete ${key.slice(0, -1)}. Please try again.`);
    }
  }

  async refreshData(key?: keyof StorageData): Promise<void> {
    try {
      if (key) {
        this.clearCache(key);
        await this.getData(key);
      } else {
        this.clearCache();
        // Refresh all data types
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
      this.clearCache();
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw new Error('Failed to clear all data. Please try again.');
    }
  }

  // Utility method to check if data is cached
  isCached(key: keyof StorageData): boolean {
    return this.isCacheValid(key) && !!this.cache[key];
  }

  // Method to get cache status for debugging
  getCacheStatus(): Record<keyof StorageData, { cached: boolean; timestamp?: number; count?: number }> {
    return {
      sales: {
        cached: this.isCached('sales'),
        timestamp: this.cacheTimestamps.sales,
        count: this.cache.sales?.length
      },
      expenses: {
        cached: this.isCached('expenses'),
        timestamp: this.cacheTimestamps.expenses,
        count: this.cache.expenses?.length
      },
      employees: {
        cached: this.isCached('employees'),
        timestamp: this.cacheTimestamps.employees,
        count: this.cache.employees?.length
      },
      products: {
        cached: this.isCached('products'),
        timestamp: this.cacheTimestamps.products,
        count: this.cache.products?.length
      }
    };
  }
}

export const storage = new DataStorage();