'use client';

import type React from 'react';
import {useEffect, useCallback} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {useHabits} from '../../context/HabitContext';
import {ProgressChart} from '../../components/habits/ProgressChart';
import {CalendarView} from '../../components/calendar/CalendarView';

export const ProgressScreen: React.FC = () => {
  const {colors} = useTheme();
  const {getTodayProgress, getWeeklyProgress, refreshData} = useHabits();

  const handleRefreshData = useCallback(() => {
    refreshData();
  }, [refreshData]);

  useEffect(() => {
    handleRefreshData();
  }, [handleRefreshData]);

  const todayProgress = getTodayProgress();
  const weeklyProgress = getWeeklyProgress();

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={[styles.header, {backgroundColor: colors.surface}]}>
        <Text style={[styles.title, {color: colors.text}]}>
          Progress Tracking 📊
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <ProgressChart
          todayProgress={todayProgress}
          weeklyProgress={weeklyProgress}
        />

        <View style={styles.calendarSection}>
          <Text style={[styles.sectionTitle, {color: colors.text}]}>
            Habit Calendar 📅
          </Text>
          <CalendarView />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  calendarSection: {
    marginTop: 20,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
});
