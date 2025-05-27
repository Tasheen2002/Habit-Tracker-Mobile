'use client';

import type React from 'react';
import {useState} from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import {useTheme} from '../../context/ThemeContext';
import {useHabits} from '../../context/HabitContext';
import {Button} from '../common/Button';
import {Input} from '../common/Input';
import {validateHabitName} from '../../utils/validationUtils';

interface HabitFormProps {
  onSuccess: () => void;
}

export const HabitForm: React.FC<HabitFormProps> = ({onSuccess}) => {
  const {colors} = useTheme();
  const {addHabit} = useHabits();
  const [habitName, setHabitName] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!validateHabitName(habitName)) {
      setError('Habit name must be at least 3 characters long');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await addHabit(habitName.trim(), frequency);
      setHabitName('');
      setFrequency('daily');
      onSuccess();
      Alert.alert('Success', 'Habit created successfully!');
    } catch (error) {
      console.error('Error creating habit:', error);
      Alert.alert('Error', 'Failed to create habit. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.surface}]}>
      <Text style={[styles.title, {color: colors.text}]}>Create New Habit</Text>

      <Input
        label="Habit Name"
        value={habitName}
        onChangeText={text => {
          setHabitName(text);
          setError('');
        }}
        placeholder="e.g., Exercise, Read, Drink Water"
        error={error}
      />

      <Text style={[styles.label, {color: colors.text}]}>Frequency</Text>

      <View style={styles.frequencyContainer}>
        <Button
          title="Daily"
          onPress={() => setFrequency('daily')}
          variant={frequency === 'daily' ? 'primary' : 'outline'}
          size="small"
          style={styles.frequencyButton}
        />
        <Button
          title="Weekly"
          onPress={() => setFrequency('weekly')}
          variant={frequency === 'weekly' ? 'primary' : 'outline'}
          size="small"
          style={styles.frequencyButton}
        />
      </View>

      <Button
        title={isLoading ? 'Creating...' : 'Create Habit'}
        onPress={handleSubmit}
        disabled={isLoading || !habitName.trim()}
        style={styles.submitButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 15,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 10,
  },
  frequencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  frequencyButton: {
    flex: 0.4,
  },
  submitButton: {
    marginTop: 10,
  },
});
