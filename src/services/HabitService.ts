import AsyncStorageService from './AsyncStorageService';
import type {Habit, HabitCompletion} from '../types';
import {formatDate, isThisWeek, calculateStreak} from '../utils/dateUtils';

class HabitService {
  private static instance: HabitService;
  private storageService: AsyncStorageService;
  private readonly HABITS_KEY = 'habits';
  private readonly COMPLETIONS_KEY = 'habitCompletions';

  constructor() {
    this.storageService = AsyncStorageService.getInstance();
  }

  public static getInstance(): HabitService {
    if (!HabitService.instance) {
      HabitService.instance = new HabitService();
    }
    return HabitService.instance;
  }

  async createHabit(
    name: string,
    frequency: 'daily' | 'weekly',
    userId: string,
  ): Promise<Habit> {
    try {
      const habits =
        (await this.storageService.getItem<Habit[]>(this.HABITS_KEY)) || [];

      const newHabit: Habit = {
        id: Date.now().toString(),
        name: name.trim(),
        frequency,
        createdAt: new Date().toISOString(),
        userId,
      };

      const updatedHabits = [...habits, newHabit];
      await this.storageService.setItem(this.HABITS_KEY, updatedHabits);

      return newHabit;
    } catch (error) {
      console.error('Create habit error:', error);
      throw error;
    }
  }

  async getUserHabits(userId: string): Promise<Habit[]> {
    try {
      const habits =
        (await this.storageService.getItem<Habit[]>(this.HABITS_KEY)) || [];
      return habits.filter(habit => habit.userId === userId);
    } catch (error) {
      console.error('Get user habits error:', error);
      return [];
    }
  }

  async markHabitComplete(habitId: string): Promise<void> {
    try {
      const completions =
        (await this.storageService.getItem<HabitCompletion[]>(
          this.COMPLETIONS_KEY,
        )) || [];
      const today = formatDate(new Date());

      // Check if already completed today
      const existingCompletion = completions.find(
        completion =>
          completion.habitId === habitId && completion.date === today,
      );

      if (existingCompletion) {
        return; // Already completed today
      }

      const newCompletion: HabitCompletion = {
        id: Date.now().toString(),
        habitId,
        completedAt: new Date().toISOString(),
        date: today,
      };

      const updatedCompletions = [...completions, newCompletion];
      await this.storageService.setItem(
        this.COMPLETIONS_KEY,
        updatedCompletions,
      );
    } catch (error) {
      console.error('Mark habit complete error:', error);
      throw error;
    }
  }

  async unmarkHabitComplete(habitId: string): Promise<void> {
    try {
      const completions =
        (await this.storageService.getItem<HabitCompletion[]>(
          this.COMPLETIONS_KEY,
        )) || [];
      const today = formatDate(new Date());

      const updatedCompletions = completions.filter(
        completion =>
          !(completion.habitId === habitId && completion.date === today),
      );

      await this.storageService.setItem(
        this.COMPLETIONS_KEY,
        updatedCompletions,
      );
    } catch (error) {
      console.error('Unmark habit complete error:', error);
      throw error;
    }
  }

  async getHabitCompletions(habitId: string): Promise<HabitCompletion[]> {
    try {
      const completions =
        (await this.storageService.getItem<HabitCompletion[]>(
          this.COMPLETIONS_KEY,
        )) || [];
      return completions.filter(completion => completion.habitId === habitId);
    } catch (error) {
      console.error('Get habit completions error:', error);
      return [];
    }
  }

  async getAllCompletions(): Promise<HabitCompletion[]> {
    try {
      return (
        (await this.storageService.getItem<HabitCompletion[]>(
          this.COMPLETIONS_KEY,
        )) || []
      );
    } catch (error) {
      console.error('Get all completions error:', error);
      return [];
    }
  }

  async isHabitCompletedToday(habitId: string): Promise<boolean> {
    try {
      const completions = await this.getHabitCompletions(habitId);
      const today = formatDate(new Date());
      return completions.some(completion => completion.date === today);
    } catch (error) {
      console.error('Check habit completion error:', error);
      return false;
    }
  }

  async getTodayProgress(userId: string): Promise<number> {
    try {
      const habits = await this.getUserHabits(userId);
      const dailyHabits = habits.filter(habit => habit.frequency === 'daily');

      if (dailyHabits.length === 0) return 0;

      const completions = await this.getAllCompletions();
      const today = formatDate(new Date());

      const completedToday = dailyHabits.filter(habit =>
        completions.some(
          completion =>
            completion.habitId === habit.id && completion.date === today,
        ),
      );

      return Math.round((completedToday.length / dailyHabits.length) * 100);
    } catch (error) {
      console.error('Get today progress error:', error);
      return 0;
    }
  }

  async getWeeklyProgress(userId: string): Promise<number> {
    try {
      const habits = await this.getUserHabits(userId);
      const completions = await this.getAllCompletions();

      if (habits.length === 0) return 0;

      const thisWeekCompletions = completions.filter(completion =>
        isThisWeek(completion.date),
      );

      const totalPossibleCompletions = habits.length * 7; // 7 days in a week
      const actualCompletions = thisWeekCompletions.length;

      return Math.round((actualCompletions / totalPossibleCompletions) * 100);
    } catch (error) {
      console.error('Get weekly progress error:', error);
      return 0;
    }
  }

  async getHabitStreak(habitId: string): Promise<number> {
    try {
      const completions = await this.getHabitCompletions(habitId);
      const completionDates = completions.map(completion => completion.date);
      return calculateStreak(completionDates);
    } catch (error) {
      console.error('Get habit streak error:', error);
      return 0;
    }
  }

  async deleteHabit(habitId: string): Promise<void> {
    try {
      // Delete habit
      const habits =
        (await this.storageService.getItem<Habit[]>(this.HABITS_KEY)) || [];
      const updatedHabits = habits.filter(habit => habit.id !== habitId);
      await this.storageService.setItem(this.HABITS_KEY, updatedHabits);

      // Delete associated completions
      const completions =
        (await this.storageService.getItem<HabitCompletion[]>(
          this.COMPLETIONS_KEY,
        )) || [];
      const updatedCompletions = completions.filter(
        completion => completion.habitId !== habitId,
      );
      await this.storageService.setItem(
        this.COMPLETIONS_KEY,
        updatedCompletions,
      );
    } catch (error) {
      console.error('Delete habit error:', error);
      throw error;
    }
  }
}

export default HabitService;
