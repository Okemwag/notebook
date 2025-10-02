import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Custom error class for storage operations
 */
export class StorageError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'StorageError';
  }
}

/**
 * Type-safe wrapper around AsyncStorage for persistent data storage
 * Provides error handling and type safety for all storage operations
 */
export class StorageService {
  /**
   * Store a value in AsyncStorage with type safety
   * @param key - Storage key
   * @param value - Value to store (will be JSON stringified)
   * @throws StorageError if operation fails
   */
  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      throw new StorageError(
        `Failed to save item with key "${key}"`,
        'STORAGE_SET_ERROR',
        error
      );
    }
  }

  /**
   * Retrieve a value from AsyncStorage with type safety
   * @param key - Storage key
   * @returns Parsed value or null if not found
   * @throws StorageError if operation fails
   */
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      if (jsonValue === null) {
        return null;
      }
      return JSON.parse(jsonValue) as T;
    } catch (error) {
      throw new StorageError(
        `Failed to retrieve item with key "${key}"`,
        'STORAGE_GET_ERROR',
        error
      );
    }
  }

  /**
   * Remove a value from AsyncStorage
   * @param key - Storage key to remove
   * @throws StorageError if operation fails
   */
  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      throw new StorageError(
        `Failed to remove item with key "${key}"`,
        'STORAGE_REMOVE_ERROR',
        error
      );
    }
  }

  /**
   * Get all keys currently stored in AsyncStorage
   * @returns Array of storage keys
   * @throws StorageError if operation fails
   */
  async getAllKeys(): Promise<string[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return keys;
    } catch (error) {
      throw new StorageError(
        'Failed to retrieve all keys',
        'STORAGE_GET_KEYS_ERROR',
        error
      );
    }
  }

  /**
   * Clear all data from AsyncStorage
   * @throws StorageError if operation fails
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      throw new StorageError(
        'Failed to clear storage',
        'STORAGE_CLEAR_ERROR',
        error
      );
    }
  }

  /**
   * Get multiple items from AsyncStorage at once
   * @param keys - Array of keys to retrieve
   * @returns Array of [key, value] pairs
   * @throws StorageError if operation fails
   */
  async multiGet(keys: string[]): Promise<Array<[string, string | null]>> {
    try {
      return await AsyncStorage.multiGet(keys);
    } catch (error) {
      throw new StorageError(
        'Failed to retrieve multiple items',
        'STORAGE_MULTI_GET_ERROR',
        error
      );
    }
  }

  /**
   * Set multiple items in AsyncStorage at once
   * @param keyValuePairs - Array of [key, value] pairs to store
   * @throws StorageError if operation fails
   */
  async multiSet(keyValuePairs: Array<[string, string]>): Promise<void> {
    try {
      await AsyncStorage.multiSet(keyValuePairs);
    } catch (error) {
      throw new StorageError(
        'Failed to set multiple items',
        'STORAGE_MULTI_SET_ERROR',
        error
      );
    }
  }

  /**
   * Remove multiple items from AsyncStorage at once
   * @param keys - Array of keys to remove
   * @throws StorageError if operation fails
   */
  async multiRemove(keys: string[]): Promise<void> {
    try {
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      throw new StorageError(
        'Failed to remove multiple items',
        'STORAGE_MULTI_REMOVE_ERROR',
        error
      );
    }
  }
}

// Export singleton instance
export const storageService = new StorageService();
