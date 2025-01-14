import React, { useState } from 'react';
import { View, Text, Button, Alert, FlatList, StyleSheet } from 'react-native';
import { ProgressBar } from '../widgets/ProgressBar'; // Certifique-se de que o componente ProgressBar é compatível com React Native
import { initialTasks } from '../repository/data/initialTasks';
import { formatDate } from '../utils/dateUtils';
import { getTaskMessage } from '../repository/data/taskMessages';
import  { TaskItem }  from '../widgets/TaskItem'; 

export interface Task {
    id: string;
    title: string;
    description: string;
    count: number;
  }

const HabitTrackerPage = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const maxWeeklyCount = 40;

  const handleIncrement = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          const newCount = Math.min(task.count + 1, 15);
          if (newCount === 5) {
            Alert.alert(getTaskMessage(taskId));
          }
          return { ...task, count: newCount };
        }
        return task;
      })
    );
  };

  const handleRefresh = () => {
    setTasks(initialTasks);
  };

  const totalCount = tasks.reduce((sum, task) => sum + task.count, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gohan Treinamentos! 2025</Text>
      <Button title="Refresh" onPress={handleRefresh} />

      <Text style={styles.date}>{formatDate()}</Text>
      <Text style={styles.subtitle}>You Only Need 5 hobbies!</Text>

      <ProgressBar totalCount={totalCount} maxCount={maxWeeklyCount} />

      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <TaskItem 
            task={item} 
            onIncrement={handleIncrement}
          />
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  date: {
    fontSize: 18,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 16,
  },
});

export default HabitTrackerPage;