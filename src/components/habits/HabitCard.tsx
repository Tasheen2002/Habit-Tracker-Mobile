'use client';

import type React from 'react';
import {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Animated} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {useHabits} from '../../context/HabitContext';
import type {Habit} from '../../types';

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
}

export const HabitCard: React.FC<HabitCardProps> = ({habit, isCompleted}) => {
  const {colors} = useTheme();
  const {markHabitComplete, unmarkHabitComplete, getHabitStreak} = useHabits();
  const [animatedValue] = useState(new Animated.Value(1));

  const handleToggleComplete = async () => {
    try {
      // Animate button press with a beautiful bounce effect
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(animatedValue, {
          toValue: 1,
          friction: 3,
          tension: 100,
          useNativeDriver: true,
        }),
      ]).start();

      if (isCompleted) {
        await unmarkHabitComplete(habit.id);
      } else {
        await markHabitComplete(habit.id);
      }
    } catch (error) {
      console.error('Error toggling habit completion:', error);
    }
  };

  const streak = getHabitStreak(habit.id);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: isCompleted ? colors.success : colors.border,
          borderLeftColor: colors.primary,
          transform: [{scale: animatedValue}],
        },
      ]}>
      <View style={styles.content}>
        <View style={styles.habitInfo}>
          <Text style={[styles.habitName, {color: colors.text}]}>
            {habit.name}
          </Text>
          <View style={styles.habitDetails}>
            <Text style={[styles.frequency, {color: colors.textSecondary}]}>
              📅{' '}
              {habit.frequency.charAt(0).toUpperCase() +
                habit.frequency.slice(1)}
            </Text>
            {streak > 0 && (
              <Text style={[styles.streak, {color: colors.primary}]}>
                🔥 {streak} day streak
              </Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.checkButton,
            {
              backgroundColor: isCompleted ? colors.success : colors.border,
              borderColor: isCompleted ? colors.success : colors.primary,
            },
          ]}
          onPress={handleToggleComplete}
          activeOpacity={0.8}>
          <Text
            style={[
              styles.checkIcon,
              {color: isCompleted ? '#FFFFFF' : colors.primary},
            ]}>
            {isCompleted ? '✓' : '○'}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderWidth: 2,
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  habitDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  frequency: {
    fontSize: 14,
    fontWeight: '500',
  },
  streak: {
    fontSize: 14,
    fontWeight: '600',
  },
  checkButton: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  checkIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
