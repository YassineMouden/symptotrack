// Simple in-memory cache implementation

interface CacheItem<T> {
  value: T;
  expiry: number | null; // null means no expiry
}

class Cache {
  private store = new Map<string, CacheItem<unknown>>();

  // Set a value in the cache with optional expiry in seconds
  set<T>(key: string, value: T, expiryInSeconds?: number): void {
    const expiry = expiryInSeconds ? Date.now() + expiryInSeconds * 1000 : null;
    this.store.set(key, { value, expiry });
  }

  // Get a value from the cache
  get<T>(key: string): T | null {
    const item = this.store.get(key) as CacheItem<T> | undefined;
    
    if (!item) {
      return null;
    }
    
    // Check if the item has expired
    if (item.expiry && item.expiry < Date.now()) {
      this.store.delete(key);
      return null;
    }
    
    return item.value;
  }

  // Delete a value from the cache
  delete(key: string): void {
    this.store.delete(key);
  }

  // Clear all values from the cache
  clear(): void {
    this.store.clear();
  }

  // Get the number of items in the cache
  size(): number {
    return this.store.size;
  }
}

// Export a singleton instance
export const cache = new Cache(); 