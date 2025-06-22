import { supabaseStorage } from './supabaseStorage';
import { Sale, Expense, Employee, Product } from '../types';

interface StorageData {
  sales: Sale[];
  expenses: Expense[];
  employees: Employee[];
  products: Product[];
}

class DataStorage {
  private cache: Partial<StorageData> = {};
  private isOnline = navigator.onLine;

  constructor() {
    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncOfflineData();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  private getStorageKey(key: keyof StorageData): string {
    return `fms_${key}`;
  }

  private getLocalData<T>(key: keyof StorageData): T[] {
    try {
      const data = localStorage.getItem(this.getStorageKey(key));
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error loading ${key} from localStorage:`, error);
      return [];
    }
  }

  private setLocalData<T>(key: keyof StorageData, data: T[]): void {
    try {
      localStorage.setItem(this.getStorageKey(key), JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }

  private async syncOfflineData(): Promise<void> {
    // This would handle syncing offline changes when coming back online
    // For now, we'll just refresh the cache
    this.cache = {};
  }

  async getData<T>(key: keyof StorageData): Promise<T[]> {
    try {
      if (!this.isOnline) {
        return this.getLocalData<T>(key);
      }

      // Check cache first
      if (this.cache[key]) {
        return this.cache[key] as T[];
      }

      let data: T[] = [];
      
      switch (key) {
        case 'sales':
          data = await supabaseStorage.getSales() as T[];
          break;
        case 'expenses':
          data = await supabaseStorage.getExpenses() as T[];
          break;
        case 'employees':
          data = await supabaseStorage.getEmployees() as T[];
          break;
        case 'products':
          data = await supabaseStorage.getProducts() as T[];
          break;
        default:
          data = [];
      }

      // Cache the data
      this.cache[key] = data;
      
      // Also save to localStorage as backup
      this.setLocalData(key, data);
      
      return data;
    } catch (error) {
      console.error(`Error fetching ${key} from Supabase:`, error);
      
      // Fallback to localStorage
      const localData = this.getLocalData<T>(key);
      
      // Show user-friendly error message
      if (localData.length === 0) {
        throw new Error(`Unable to load ${key}. Please check your internet connection and try again.`);
      }
      
      return localData;
    }
  }

  // Legacy method for backward compatibility
  getData<T>(key: keyof StorageData): T[] {
    // For synchronous calls, return cached data or empty array
    if (this.cache[key]) {
      return this.cache[key] as T[];
    }
    
    return this.getLocalData<T>(key);
  }

  async setData<T>(key: keyof StorageData, data: T[]): Promise<void> {
    try {
      // Update cache
      this.cache[key] = data;
      
      // Save to localStorage
      this.setLocalData(key, data);
      
      if (!this.isOnline) {
        return;
      }

      // Note: This method is mainly for bulk operations
      // Individual operations should use addItem, updateItem, deleteItem
    } catch (error) {
      console.error(`Error setting ${key}:`, error);
      throw new Error(`Failed to save ${key}. Please try again.`);
    }
  }

  async addItem<T extends { id: string }>(key: keyof StorageData, item: T): Promise<void> {
    try {
      if (!this.isOnline) {
        // Add to localStorage for offline support
        const items = this.getLocalData<T>(key);
        items.push(item);
        this.setLocalData(key, items);
        return;
      }

      switch (key) {
        case 'sales':
          await supabaseStorage.addSale(item as Sale);
          break;
        case 'expenses':
          await supabaseStorage.addExpense(item as Expense);
          break;
        case 'employees':
          await supabaseStorage.addEmployee(item as Employee);
          break;
        case 'products':
          await supabaseStorage.addProduct(item as Product);
          break;
      }

      // Update cache
      if (this.cache[key]) {
        (this.cache[key] as T[]).push(item);
      }
      
      // Update localStorage
      const items = this.getLocalData<T>(key);
      items.push(item);
      this.setLocalData(key, items);
      
    } catch (error) {
      console.error(`Error adding ${key} item:`, error);
      throw new Error(`Failed to add ${key.slice(0, -1)}. Please try again.`);
    }
  }

  async updateItem<T extends { id: string }>(key: keyof StorageData, id: string, updates: Partial<T>): Promise<void> {
    try {
      if (!this.isOnline) {
        // Update in localStorage for offline support
        const items = this.getLocalData<T>(key);
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
          items[index] = { ...items[index], ...updates };
          this.setLocalData(key, items);
        }
        return;
      }

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
      }

      // Update cache
      if (this.cache[key]) {
        const items = this.cache[key] as T[];
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
          items[index] = { ...items[index], ...updates };
        }
      }
      
      // Update localStorage
      const items = this.getLocalData<T>(key);
      const index = items.findIndex(item => item.id === id);
      if (index !== -1) {
        items[index] = { ...items[index], ...updates };
        this.setLocalData(key, items);
      }
      
    } catch (error) {
      console.error(`Error updating ${key} item:`, error);
      throw new Error(`Failed to update ${key.slice(0, -1)}. Please try again.`);
    }
  }

  async deleteItem(key: keyof StorageData, id: string): Promise<void> {
    try {
      if (!this.isOnline) {
        // Delete from localStorage for offline support
        const items = this.getLocalData(key);
        const filtered = items.filter(item => item.id !== id);
        this.setLocalData(key, filtered);
        return;
      }

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
      }

      // Update cache
      if (this.cache[key]) {
        this.cache[key] = (this.cache[key] as any[]).filter(item => item.id !== id);
      }
      
      // Update localStorage
      const items = this.getLocalData(key);
      const filtered = items.filter(item => item.id !== id);
      this.setLocalData(key, filtered);
      
    } catch (error) {
      console.error(`Error deleting ${key} item:`, error);
      throw new Error(`Failed to delete ${key.slice(0, -1)}. Please try again.`);
    }
  }

  async clearAll(): Promise<void> {
    try {
      if (this.isOnline) {
        await supabaseStorage.clearAll();
      }
      
      // Clear cache
      this.cache = {};
      
      // Clear localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('fms_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw new Error('Failed to clear all data. Please try again.');
    }
  }
}

export const storage = new DataStorage();