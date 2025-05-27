import AsyncStorageService from './AsyncStorageService';
import type {User} from '../types';
import {
  validateEmail,
  validatePassword,
  validateName,
} from '../utils/validationUtils';

class AuthService {
  private static instance: AuthService;
  private storageService: AsyncStorageService;
  private readonly USERS_KEY = 'users';
  private readonly CURRENT_USER_KEY = 'currentUser';

  constructor() {
    this.storageService = AsyncStorageService.getInstance();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async register(
    name: string,
    email: string,
    password: string,
  ): Promise<{success: boolean; message: string; user?: User}> {
    try {
      // Validate inputs
      if (!validateName(name)) {
        return {
          success: false,
          message: 'Name must be at least 2 characters long',
        };
      }
      if (!validateEmail(email)) {
        return {success: false, message: 'Please enter a valid email address'};
      }
      if (!validatePassword(password)) {
        return {
          success: false,
          message: 'Password must be at least 6 characters long',
        };
      }

      // Check if user already exists
      const existingUsers =
        (await this.storageService.getItem<User[]>(this.USERS_KEY)) || [];
      const userExists = existingUsers.find(
        user => user.email.toLowerCase() === email.toLowerCase(),
      );

      if (userExists) {
        return {success: false, message: 'User with this email already exists'};
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password, // In a real app, this should be hashed
        createdAt: new Date().toISOString(),
      };

      // Save user
      const updatedUsers = [...existingUsers, newUser];
      await this.storageService.setItem(this.USERS_KEY, updatedUsers);
      await this.storageService.setItem(this.CURRENT_USER_KEY, newUser);

      return {success: true, message: 'Registration successful', user: newUser};
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Registration failed. Please try again.',
      };
    }
  }

  async login(
    email: string,
    password: string,
  ): Promise<{success: boolean; message: string; user?: User}> {
    try {
      if (!validateEmail(email)) {
        return {success: false, message: 'Please enter a valid email address'};
      }
      if (!password) {
        return {success: false, message: 'Please enter your password'};
      }

      const users =
        (await this.storageService.getItem<User[]>(this.USERS_KEY)) || [];
      const user = users.find(
        u =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password,
      );

      if (!user) {
        return {success: false, message: 'Invalid email or password'};
      }

      await this.storageService.setItem(this.CURRENT_USER_KEY, user);
      return {success: true, message: 'Login successful', user};
    } catch (error) {
      console.error('Login error:', error);
      return {success: false, message: 'Login failed. Please try again.'};
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      return await this.storageService.getItem<User>(this.CURRENT_USER_KEY);
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.storageService.removeItem(this.CURRENT_USER_KEY);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      const user = await this.getCurrentUser();
      return user !== null;
    } catch (error) {
      console.error('Check login status error:', error);
      return false;
    }
  }
}

export default AuthService;
