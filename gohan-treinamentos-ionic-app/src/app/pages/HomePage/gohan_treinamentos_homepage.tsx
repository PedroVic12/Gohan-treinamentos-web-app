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
import { TaskItem } from '../../public/components/TaskItem';
import { ProgressBar } from '../../public/components/ProgressBar';
import { initialTasks } from '../../public/data/initialTasks';
import { formatDate } from '../../public/utils/dateUtils';
import { getTaskMessage } from '../../public/data/taskMessages';
import { Task } from '../../public/types/Task';


//widgets
const CustomText = ({ props }: { props: { text: string } }) => {
  return (
    <Typography variant="subtitle1" align="center" gutterBottom color="primary">
      {props.text} 
    </Typography>
  );
}

const HobbiesSection: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', margin: '20px 0' }}>
      <Typography variant="h5" gutterBottom color="primary">
        You Only Need 5 hobbies
      </Typography>
      <Typography variant="subtitle1" gutterBottom color="primary">
        (Corpo x Mente x Espirito)
      </Typography>
      <Typography variant="body1" gutterBottom color="primary">
        Importante cuidar da sua Comunicação (trabalho), saúde mental(estudos), emocional(relacionamentos) e física (treinos)!
        <br></br>
        <br></br>

        Hora de se tornar um Super Sayajin em 2025 e sua melhor versão: Lindo, Inteligente e Gostoso!
      </Typography>
    </div>
  );
};


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
  const maxWeeklyCount = 40;

  useEffect(() => {
    LocalDatabase.saveTasks(tasks); // Usa LocalDatabase para salvar tarefas
  }, [tasks]);
  

  const handleIncrement = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          const newCount = Math.min(task.count + 1, 15);
          if (newCount === 5) {
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
    alert("Rotinas resetadas!")
  };

  const totalCount = tasks.reduce((sum, task) => sum + task.count, 0);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#1976d2', marginBottom: 4 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Gohan Treinamentos 2025
          </Typography>
          <IconButton color="inherit" onClick={handleRefresh}>
            <RefreshIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

        <Container maxWidth="md" sx={{ overflowY: 'auto', maxHeight: '80vh'}}>        
          
        <Typography variant="h5" align="center" gutterBottom>
          {formatDate()}
        </Typography>
        
        <HobbiesSection />

        <List>
          {tasks.map((task) => (
            <TaskItem 
              key={task.id} 
              task={task} 
              onIncrement={handleIncrement}
            />
          ))}
        </List>

        <ProgressBar totalCount={totalCount} maxCount={maxWeeklyCount} />
        <br />
        <br />

      </Container>

    </Box>
  );
}




export default GohanTreinamentosHomePage;