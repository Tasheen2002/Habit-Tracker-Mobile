'use client';

import type React from 'react';
import {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {useHabits} from '../../context/HabitContext';
import {HabitCard} from '../../components/habits/HabitCard';
import {Button} from '../../components/common/Button';
import type {Habit} from '../../types';
import {formatDate} from '../../utils/dateUtils';

type FilterType = 'all' | 'today' | 'completed';

interface HabitListScreenProps {
  navigation: any;
}

export const HabitListScreen: React.FC<HabitListScreenProps> = ({
  navigation,
}) => {
  const {colors} = useTheme();
  const {habits, completions, refreshData} = useHabits();
  const [filter, setFilter] = useState<FilterType>('all');
  const [filteredHabits, setFilteredHabits] = useState<Habit[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const filterHabits = useCallback(() => {
    const today = formatDate(new Date());
    let filtered = habits;

    switch (filter) {
      case 'today':
        filtered = habits.filter(habit => habit.frequency === 'daily');
        break;
      case 'completed':
        filtered = habits.filter(habit =>
          completions.some(
            completion =>
              completion.habitId === habit.id && completion.date === today,
          ),
        );
        break;
      default:
        filtered = habits;
    }

    setFilteredHabits(filtered);
  }, [habits, completions, filter]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  useEffect(() => {
    filterHabits();
  }, [filterHabits]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  }, [refreshData]);

  const isHabitCompletedToday = (habitId: string): boolean => {
    const today = formatDate(new Date());
    return completions.some(
      completion => completion.habitId === habitId && completion.date === today,
    );
  };

  const renderFilterButton = (filterType: FilterType, title: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        {
          backgroundColor:
            filter === filterType ? colors.primary : colors.surface,
          borderColor: colors.border,
        },
      ]}
      onPress={() => setFilter(filterType)}>
      <Text
        style={[
          styles.filterButtonText,
          {
            color: filter === filterType ? '#FFFFFF' : colors.text,
          },
        ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderHabitItem = ({item}: {item: Habit}) => (
    <HabitCard habit={item} isCompleted={isHabitCompletedToday(item.id)} />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyTitle, {color: colors.text}]}>
        {filter === 'completed'
          ? 'No completed habits today'
          : 'No habits yet! 🌱'}
      </Text>
      <Text style={[styles.emptySubtitle, {color: colors.textSecondary}]}>
        {filter === 'completed'
          ? 'Complete some habits to see them here!'
          : 'Create your first habit to get started!'}
      </Text>
      {filter === 'all' && (
        <Button
          title="Create Your First Habit"
          onPress={() => navigation.navigate('CreateHabit')}
          style={styles.emptyButton}
        />
      )}
    </View>
  );

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={[styles.header, {backgroundColor: colors.surface}]}>
        <Text style={[styles.title, {color: colors.text}]}>My Habits 📝</Text>

        <View style={styles.filterContainer}>
          {renderFilterButton('all', 'All')}
          {renderFilterButton('today', 'Today')}
          {renderFilterButton('completed', 'Done')}
        </View>
      </View>

      <FlatList
        data={filteredHabits}
        renderItem={renderHabitItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <View style={[styles.bottomBar, {backgroundColor: colors.surface}]}>
        <Button
          title="➕  Add New Habit"
          onPress={() => navigation.navigate('CreateHabit')}
          style={styles.addButton}
        />
      </View>
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
    marginBottom: 20,
    textAlign: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: 80,
    alignItems: 'center',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    paddingVertical: 10,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  emptyButton: {
    paddingHorizontal: 30,
  },
  bottomBar: {
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButton: {
    marginBottom: 10,
  },
});
