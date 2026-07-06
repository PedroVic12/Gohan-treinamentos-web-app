import React, { useEffect, useState, useMemo } from 'react';
import {
  Container,
  Typography,
  List,
  Box,
  IconButton,
  AppBar,
  Toolbar,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import RefreshIcon from '@mui/icons-material/Refresh';

import { TaskItem } from '../../public/components/TaskItem';
import { ProgressBar } from '../../public/components/ProgressBar';
import { initialTasks } from '../../public/data/initialTasks';
import { formatDate } from '../../public/utils/dateUtils';
import { getTaskMessage } from '../../public/data/taskMessages';
import { Task } from '../../public/types/Task';
import { IonPage, menuController } from '@ionic/react';

// Widgets
const HobbiesSection: React.FC = () => {
  return (
    <Box sx={{ textAlign: 'center', my: 3 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
        You Only Need 5 Hobbies
      </Typography>
      <Typography variant="subtitle1" gutterBottom color="text.secondary">
        (Corpo x Mente x Espírito)
      </Typography>
    </Box>
  );
};

// Local storage helper
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
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('gohan_dark_mode');
    return saved ? JSON.parse(saved) : true; // Default to dark mode
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    return LocalDatabase.getTasks() || initialTasks;
  });
  const maxWeeklyCount = 40;

  useEffect(() => {
    LocalDatabase.saveTasks(tasks);
  }, [tasks]);

  const totalCount = tasks.reduce((sum, task) => sum + task.count, 0);

  const handleIncrement = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          const newCount = Math.min(task.count + 1, 15);
          if (newCount === 5) {
            alert(getTaskMessage(taskId));
          }

          if (totalCount === 25) {
            alert("Parabéns meu jovem Padawan! Você está com a energia vibrando alto! Busque a paz e equilíbrio! Que a força esteja com você, Pedro Victor!!");
          }
          return { ...task, count: newCount };
        }
        return task;
      })
    );
  };

  const handleRefresh = () => {
    setTasks(initialTasks);
    alert("Rotinas resetadas! Tenha um ótimo início de semana! Lembre-se dos seus objetivos e metas!");
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newVal = !prev;
      localStorage.setItem('gohan_dark_mode', JSON.stringify(newVal));
      return newVal;
    });
  };

  const handleOpenMenu = async () => {
    await menuController.open('first');
  };

  // Tema MUI Customizado (Material Design 3 aesthetic)
  const theme = useMemo(() => createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#3b82f6', // Bright, premium blue
      },
      background: {
        default: darkMode ? '#0f172a' : '#f8fafc',
        paper: darkMode ? '#1e293b' : '#ffffff',
      },
    },
    typography: {
      fontFamily: 'Outfit, Inter, sans-serif',
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: darkMode ? '#1e293b' : '#3b82f6',
            backgroundImage: 'none',
          }
        }
      }
    }
  }), [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <IonPage id="main-content">
        {/* MUI AppBar header replacing Ionic header */}
        <AppBar position="sticky" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleOpenMenu}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
              Gohan Treinamentos
            </Typography>
            <IconButton onClick={toggleDarkMode} color="inherit" sx={{ mr: 1 }}>
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            <IconButton onClick={handleRefresh} color="inherit">
              <RefreshIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* MUI Container replacing IonContent scroll area */}
        <Box sx={{ overflowY: 'auto', height: 'calc(100vh - 64px)', py: 3, bgcolor: 'background.default' }}>
          <Container maxWidth="md">
            <Typography variant="h6" align="center" color="text.secondary" gutterBottom>
              {formatDate()}
            </Typography>

            <HobbiesSection />

            <List disablePadding>
              {tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onIncrement={handleIncrement}
                />
              ))}
            </List>

            <ProgressBar totalCount={totalCount} maxCount={maxWeeklyCount} />
            
            <Box sx={{ mt: 4, p: 3, borderRadius: 4, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="body1" color="text.primary" sx={{ lineHeight: 1.6 }}>
                Importante cuidar da suas Habilidades (trabalho), Saúde mental (estudos), saúde emocional (relacionamentos) e saúde física (treinos)!
                <br /><br />
                Hora de se tornar um Super Sayajin em 2025 e sua melhor versão: Lindo, Inteligente e Gostoso!
              </Typography>
            </Box>
            
            <Box sx={{ height: 60 }} /> {/* Bottom padding */}
          </Container>
        </Box>
      </IonPage>
    </ThemeProvider>
  );
}

export default GohanTreinamentosHomePage;