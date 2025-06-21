interface StorageData {
  sales: any[];
  expenses: any[];
  employees: any[];
  products: any[];
}

class DataStorage {
  private getStorageKey(key: keyof StorageData): string {
    return `fms_${key}`;
  }

  getData<T>(key: keyof StorageData): T[] {
    try {
      const data = localStorage.getItem(this.getStorageKey(key));
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error loading ${key}:`, error);
      return [];
    }
  }

  setData<T>(key: keyof StorageData, data: T[]): void {
    try {
      localStorage.setItem(this.getStorageKey(key), JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
    }
  }

  addItem<T extends { id: string }>(key: keyof StorageData, item: T): void {
    const items = this.getData<T>(key);
    items.push(item);
    this.setData(key, items);
  }

  updateItem<T extends { id: string }>(key: keyof StorageData, id: string, updates: Partial<T>): void {
    const items = this.getData<T>(key);
    const index = items.findIndex(item => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      this.setData(key, items);
    }
  }

  deleteItem(key: keyof StorageData, id: string): void {
    const items = this.getData(key);
    const filtered = items.filter(item => item.id !== id);
    this.setData(key, filtered);
  }

  clearAll(): void {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('fms_')) {
        localStorage.removeItem(key);
      }
    });
  }
}

export const storage = new DataStorage();