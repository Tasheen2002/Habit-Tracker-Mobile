export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface Habit {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly';
  createdAt: string;
  userId: string;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  date: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

export interface HabitContextType {
  habits: Habit[];
  completions: HabitCompletion[];
  addHabit: (name: string, frequency: 'daily' | 'weekly') => Promise<void>;
  markHabitComplete: (habitId: string) => Promise<void>;
  unmarkHabitComplete: (habitId: string) => Promise<void>;
  getHabitCompletions: (habitId: string) => HabitCompletion[];
  getTodayProgress: () => number;
  getWeeklyProgress: () => number;
  getHabitStreak: (habitId: string) => number;
  refreshData: () => Promise<void>;
}
