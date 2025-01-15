import React, { useState } from 'react';
import {
  Container,
  Typography,
  List,
  Box,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { TaskItem } from './components/TaskItem';
import { ProgressBar } from './components/ProgressBar';
import { initialTasks } from './data/initialTasks';
import { formatDate } from './utils/dateUtils';
import { getTaskMessage } from './data/taskMessages';
import { Task } from './types/Task';

function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const maxWeeklyCount = 35;

  const handleIncrement = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          const newCount = Math.min(task.count + 1, 7);
          if (newCount === 7) {
            alert(getTaskMessage(taskId));
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
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#1976d2', marginBottom: 4 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Gohan Treinamentos! 2025
          </Typography>
          <IconButton color="inherit" onClick={handleRefresh}>
            <RefreshIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md">
        <Typography variant="h5" align="center" gutterBottom>
          {formatDate()}
        </Typography>
        
        <Typography variant="subtitle1" align="center" gutterBottom color="textSecondary">
          You Only Need 5 hobbies! Corpo x Mente x Espirito
        </Typography>

        <ProgressBar totalCount={totalCount} maxCount={maxWeeklyCount} />

        <List>
          {tasks.map((task) => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onIncrement={handleIncrement}
            />
          ))}
        </List>
      </Container>
    </Box>
  );
}

export default App;