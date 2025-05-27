'use client';

import type React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {useTheme} from '../../context/ThemeContext';

interface ProgressChartProps {
  todayProgress: number;
  weeklyProgress: number;
}

const {width} = Dimensions.get('window');


export const ProgressChart: React.FC<ProgressChartProps> = ({
  todayProgress,
  weeklyProgress,
}) => {
  const {colors} = useTheme();

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return colors.success;
    if (progress >= 60) return colors.primary;
    if (progress >= 40) return colors.info;
    if (progress >= 20) return colors.warning;
    return colors.error;
  };

  const ProgressBar: React.FC<{
    progress: number;
    label: string;
    icon: string;
  }> = ({progress, label, icon}) => (
    <View style={styles.progressContainer}>
      <View style={styles.progressHeader}>
        <Text style={[styles.progressLabel, {color: colors.text}]}>
          {icon} {label}
        </Text>
        <Text
          style={[
            styles.progressPercentage,
            {color: getProgressColor(progress)},
          ]}>
          {progress}%
        </Text>
      </View>
      <View
        style={[
          styles.progressBarBackground,
          {backgroundColor: colors.border},
        ]}>
        <View
          style={[
            styles.progressBarFill,
            {
              backgroundColor: getProgressColor(progress),
              width: `${progress}%`,
            },
          ]}
        />
      </View>
    </View>
  );

  const getMotivationalMessage = (progress: number): string => {
    if (progress === 100) return "Perfect! You're crushing it! 🎉";
    if (progress >= 80) return 'Amazing progress! Keep it up! 🌟';
    if (progress >= 60) return "Great job! You're doing well! 💪";
    if (progress >= 40) return 'Good start! Keep going! 🚀';
    if (progress > 0) return 'Every step counts! 👍';
    return 'Ready to start your day? 🌅';
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.surface}]}>
      <Text style={[styles.title, {color: colors.text}]}>
        Progress Overview 📊
      </Text>

      <ProgressBar
        progress={todayProgress}
        label="Today's Progress"
        icon="🎯"
      />
      <ProgressBar
        progress={weeklyProgress}
        label="Weekly Progress"
        icon="📈"
      />

      <View style={styles.statsContainer}>
        <View style={[styles.statItem, {backgroundColor: colors.background}]}>
          <Text style={[styles.statNumber, {color: colors.primary}]}>
            {todayProgress}%
          </Text>
          <Text style={[styles.statLabel, {color: colors.textSecondary}]}>
            Today
          </Text>
        </View>
        <View style={[styles.statItem, {backgroundColor: colors.background}]}>
          <Text style={[styles.statNumber, {color: colors.success}]}>
            {weeklyProgress}%
          </Text>
          <Text style={[styles.statLabel, {color: colors.textSecondary}]}>
            This Week
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.motivationContainer,
          {backgroundColor: colors.background},
        ]}>
        <Text style={[styles.motivationText, {color: colors.text}]}>
          {getMotivationalMessage(todayProgress)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 25,
    borderRadius: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
  },
  progressContainer: {
    marginBottom: 25,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressBarBackground: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 15,
    minWidth: 100,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    marginTop: 5,
    fontWeight: '500',
  },
  motivationContainer: {
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  motivationText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
