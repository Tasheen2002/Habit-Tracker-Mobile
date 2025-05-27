'use client';

import type React from 'react';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import AsyncStorageService from '../services/AsyncStorageService'; // Fixed import
import type {User, AuthContextType} from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const storageService = AsyncStorageService.getInstance();

  const checkAuthStatus = useCallback(async () => {
    try {
      const currentUser = await storageService.getUser();
      setUser(currentUser);
      console.log(
        '🔍 AuthContext: Current user:',
        currentUser?.email || 'None',
      );
    } catch (error) {
      console.error('💥 AuthContext: Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  }, [storageService]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log('🔐 AuthContext: Login attempt for:', email);

      // Get all users from storage
      const usersData = await storageService.getItem<User[]>(
        '@habit_tracker_users',
      );
      const users: User[] = usersData || [];
      console.log('📚 AuthContext: Found', users.length, 'users');

      // Find user with matching credentials
      const foundUser = users.find(
        u =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password,
      );

      if (foundUser) {
        await storageService.saveUser(foundUser);
        setUser(foundUser);
        console.log('✅ AuthContext: Login successful');
        return true;
      } else {
        console.log('❌ AuthContext: Invalid credentials');
        return false;
      }
    } catch (error) {
      console.error('💥 AuthContext: Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
  ): Promise<boolean> => {
    try {
      setIsLoading(true);
      console.log('📝 AuthContext: Registration attempt for:', email);

      // Get existing users
      const usersData = await storageService.getItem<User[]>(
        '@habit_tracker_users',
      );
      const users: User[] = usersData || [];
      console.log('📚 AuthContext: Found', users.length, 'existing users');

      // Check if user already exists
      const existingUser = users.find(
        u => u.email.toLowerCase() === email.toLowerCase(),
      );
      if (existingUser) {
        console.log('❌ AuthContext: User already exists');
        return false;
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password,
        createdAt: new Date().toISOString(),
      };

      // Add to users array and save
      users.push(newUser);
      await storageService.setItem('@habit_tracker_users', users);

      console.log('✅ AuthContext: Registration successful for:', email);
      return true;
    } catch (error) {
      console.error('💥 AuthContext: Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await storageService.removeUser();
      setUser(null);
      console.log('👋 AuthContext: Logout successful');
    } catch (error) {
      console.error('💥 AuthContext: Logout error:', error);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
