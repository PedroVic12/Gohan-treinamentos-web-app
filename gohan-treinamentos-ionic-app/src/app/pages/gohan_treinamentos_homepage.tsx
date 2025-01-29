import React, { useEffect, useState } from 'react';
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
import { TaskItem } from '../public/components/TaskItem';
import { ProgressBar } from '../public/components/ProgressBar';
import { initialTasks } from '../public/data/initialTasks';
import { formatDate } from '../public/utils/dateUtils';
import { getTaskMessage } from '../public/data/taskMessages';
import { Task } from '../public/types/Task';


//widgets
const CustomText = ({ props }: { props: { text: string } }) => {
  return (
    <Typography variant="subtitle1" align="center" gutterBottom color="textSecondary">
      {props.text} 
    </Typography>
  );
}
// src/app/utils/LocalDatabase.ts
class LocalDatabase {
  static getTasks() {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : null;
  }

  static saveTasks(tasks: any[]) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
}



function GohanTreinamentosHomePage() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    return LocalDatabase.getTasks() || initialTasks; // Usa LocalDatabase para carregar tarefas
  });
  const maxWeeklyCount = 35;

  useEffect(() => {
    LocalDatabase.saveTasks(tasks); // Usa LocalDatabase para salvar tarefas
  }, [tasks]);
  

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

        <CustomText props={{ text: "Importante cuidar da sua saude mental, emocional e fisica! Hora de se toranr um Super Sayjain em 2025 e sua melhor versão: Lindo, Inteligente e Gostoso!"}}></CustomText>

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




export default GohanTreinamentosHomePage;