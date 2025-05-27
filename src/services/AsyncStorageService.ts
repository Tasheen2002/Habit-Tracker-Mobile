import AsyncStorage from '@react-native-async-storage/async-storage';
import type {User, Habit} from '../types';

const KEYS = {
  USER: '@habit_tracker_user',
  HABITS: '@habit_tracker_habits',
  USERS: '@habit_tracker_users',
};

class AsyncStorageService {
  private static instance: AsyncStorageService;

  public static getInstance(): AsyncStorageService {
    if (!AsyncStorageService.instance) {
      AsyncStorageService.instance = new AsyncStorageService();
    }
    return AsyncStorageService.instance;
  }

  // Generic methods
  async setItem(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
      console.log(`💾 AsyncStorage: Saved ${key}`);
    } catch (error) {
      console.error('💥 AsyncStorage: Error saving data:', error);
      throw error;
    }
  }

  async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      const result = jsonValue != null ? JSON.parse(jsonValue) : null;
      console.log(
        `📖 AsyncStorage: Retrieved ${key}:`,
        result ? 'Found' : 'Not found',
      );
      return result;
    } catch (error) {
      console.error('💥 AsyncStorage: Error retrieving data:', error);
      return null;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
      console.log(`🗑️ AsyncStorage: Removed ${key}`);
    } catch (error) {
      console.error('💥 AsyncStorage: Error removing data:', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
      console.log('🧹 AsyncStorage: Cleared all data');
    } catch (error) {
      console.error('💥 AsyncStorage: Error clearing storage:', error);
      throw error;
    }
  }

  async getAllKeys(): Promise<string[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      console.log('🔑 AsyncStorage: All keys:', keys);
      return keys;
    } catch (error) {
      console.error('💥 AsyncStorage: Error getting all keys:', error);
      return [];
    }
  }

  // User-specific methods
  async saveUser(user: User): Promise<void> {
    try {
      await this.setItem(KEYS.USER, user);
      console.log('👤 AsyncStorage: User saved:', user.email);
    } catch (error) {
      console.error('💥 AsyncStorage: Error saving user:', error);
      throw error;
    }
  }

  async getUser(): Promise<User | null> {
    try {
      const user = await this.getItem<User>(KEYS.USER);
      console.log('👤 AsyncStorage: Retrieved user:', user?.email || 'None');
      return user;
    } catch (error) {
      console.error('💥 AsyncStorage: Error getting user:', error);
      return null;
    }
  }

  async removeUser(): Promise<void> {
    try {
      await this.removeItem(KEYS.USER);
      console.log('👤 AsyncStorage: User removed');
    } catch (error) {
      console.error('💥 AsyncStorage: Error removing user:', error);
      throw error;
    }
  }

  // Habits methods
  async saveHabits(habits: Habit[]): Promise<void> {
    try {
      await this.setItem(KEYS.HABITS, habits);
      console.log('📝 AsyncStorage: Habits saved:', habits.length);
    } catch (error) {
      console.error('💥 AsyncStorage: Error saving habits:', error);
      throw error;
    }
  }

  async getHabits(): Promise<Habit[]> {
    try {
      const habits = await this.getItem<Habit[]>(KEYS.HABITS);
      console.log('📝 AsyncStorage: Retrieved habits:', habits?.length || 0);
      return habits || [];
    } catch (error) {
      console.error('💥 AsyncStorage: Error getting habits:', error);
      return [];
    }
  }

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([KEYS.USER, KEYS.HABITS, KEYS.USERS]);
      console.log('🧹 AsyncStorage: Cleared all app data');
    } catch (error) {
      console.error('💥 AsyncStorage: Error clearing storage:', error);
      throw error;
    }
  }
}

// Export both as default and named export to fix import issues
export default AsyncStorageService;
export {AsyncStorageService};

