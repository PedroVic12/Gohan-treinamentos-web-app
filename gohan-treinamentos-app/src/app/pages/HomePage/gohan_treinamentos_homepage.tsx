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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import RefreshIcon from '@mui/icons-material/Refresh';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar
} from 'recharts';

import { TaskItem } from '../../public/components/TaskItem';
import { ProgressBar } from '../../public/components/ProgressBar';
import { initialTasks } from '../../public/data/initialTasks';
import { formatDate } from '../../public/utils/dateUtils';
import { getTaskMessage } from '../../public/data/taskMessages';
import { Task } from '../../public/types/Task';
import { IonPage } from '@ionic/react';
import { menuController } from '@ionic/core';

// Interfaces
interface WeeklyLog {
  week: string;
  date: string;
  score: number;
  breakdown: {
    money: number;
    shape: number;
    knowledge: number;
    mindset: number;
    creative: number;
  };
}

// Helper to get week number
const getWeekYearString = (d: Date) => {
  const target = new Date(d.valueOf());
  const dayNr = (d.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
  }
  const weekNum = 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  return `${target.getFullYear()}-W${weekNum}`;
};

// Hobbies Title Widget
const HobbiesSection: React.FC = () => (
  <Box sx={{ textAlign: 'center', my: 2 }}>
    <Typography variant="h4" fontWeight="black" gutterBottom color="primary">
      You Only Need 5 Hobbies
    </Typography>
    <Typography variant="subtitle2" color="text.secondary">
      (Corpo × Mente × Espírito)
    </Typography>
  </Box>
);

// Local storage helpers
class LocalDatabase {
  static getTasks() {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : null;
  }

  static saveTasks(tasks: any[]) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  static getHistory(): WeeklyLog[] {
    const saved = localStorage.getItem('gohan_habits_history');
    return saved ? JSON.parse(saved) : [];
  }

  static saveHistory(history: WeeklyLog[]) {
    localStorage.setItem('gohan_habits_history', JSON.stringify(history));
  }
}

function GohanTreinamentosHomePage() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('gohan_dark_mode');
    return saved ? JSON.parse(saved) : true;
  });

  const [activeTab, setActiveTab] = useState<number>(0);
  const [openSundayDialog, setOpenSundayDialog] = useState<boolean>(false);

  const [tasks, setTasks] = useState<Task[]>(() => {
    return LocalDatabase.getTasks() || initialTasks;
  });

  const [history, setHistory] = useState<WeeklyLog[]>(() => {
    return LocalDatabase.getHistory();
  });

  const maxWeeklyCount = 40;
  const totalCount = tasks.reduce((sum, task) => sum + task.count, 0);

  useEffect(() => {
    LocalDatabase.saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    LocalDatabase.saveHistory(history);
  }, [history]);

  // Sync dark mode from global changes
  useEffect(() => {
    const handleThemeToggle = () => {
      const saved = localStorage.getItem('gohan_dark_mode');
      if (saved !== null) {
        setDarkMode(JSON.parse(saved));
      }
    };
    window.addEventListener('theme-changed', handleThemeToggle);
    return () => window.removeEventListener('theme-changed', handleThemeToggle);
  }, []);

  // Sunday save prompt check
  useEffect(() => {
    const today = new Date();
    if (today.getDay() === 0) { // Sunday
      const currentWeekStr = getWeekYearString(today);
      const lastSaved = localStorage.getItem('gohan_last_saved_week');
      if (lastSaved !== currentWeekStr && totalCount > 0) {
        setOpenSundayDialog(true);
      }
    }
  }, [totalCount]);

  const handleIncrement = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          const newCount = Math.min(task.count + 1, 15);
          if (newCount === 5) {
            alert(getTaskMessage(taskId));
          }

          const newTotal = totalCount + 1;
          if (newTotal === 25) {
            alert("🌟 Parabéns meu jovem Padawan! Você está com a energia vibrando alto! Busque a paz e equilíbrio! Que a Força esteja com você, Pedro Victor!");
          } else if (newTotal === 40) {
            alert("⚡ ESTÁ COMPLETO! Nível Super Sayajin alcançado com sucesso! Corpo, Mente e Espírito integrados!");
          }
          return { ...task, count: newCount };
        }
        return task;
      })
    );
  };

  const handleRefresh = () => {
    if (confirm("Deseja mesmo resetar seus hábitos para iniciar uma nova semana de treinos e estudos?")) {
      setTasks(initialTasks);
      alert("Rotinas resetadas!");
    }
  };

  const handleSaveWeek = () => {
    const today = new Date();
    const currentWeekStr = getWeekYearString(today);
    
    const newLog: WeeklyLog = {
      week: currentWeekStr,
      date: today.toLocaleDateString('pt-BR'),
      score: totalCount,
      breakdown: {
        money: tasks.find(t => t.id === '1')?.count || 0,
        shape: tasks.find(t => t.id === '2')?.count || 0,
        knowledge: tasks.find(t => t.id === '3')?.count || 0,
        mindset: tasks.find(t => t.id === '4')?.count || 0,
        creative: tasks.find(t => t.id === '5')?.count || 0,
      }
    };

    setHistory(prev => [...prev, newLog]);
    localStorage.setItem('gohan_last_saved_week', currentWeekStr);
    setTasks(initialTasks); // Reset counters
    setOpenSundayDialog(false);
    alert("📊 Semana arquivada com sucesso! Gráficos de rendimento atualizados!");
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newVal = !prev;
      localStorage.setItem('gohan_dark_mode', JSON.stringify(newVal));
      window.dispatchEvent(new Event('theme-changed'));
      return newVal;
    });
  };

  const handleOpenMenu = async () => {
    await menuController.open('first');
  };

  // Convert history array for Recharts rendering
  const chartData = useMemo(() => {
    return history.map(item => ({
      name: item.week.replace(/^\d+-W/, 'Sem '),
      Score: item.score,
      Money: item.breakdown.money,
      Shape: item.breakdown.shape,
      Knowledge: item.breakdown.knowledge,
      Mindset: item.breakdown.mindset,
      Creative: item.breakdown.creative,
    }));
  }, [history]);

  const theme = useMemo(() => createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#3b82f6',
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
        
        {/* MUI Header bar */}
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

        {/* Tab switch bar */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
          <Tabs value={activeTab} onChange={(_, val) => setActiveTab(val)} centered variant="fullWidth">
            <Tab label="Meus Hábitos" />
            <Tab label="Dashboard" />
          </Tabs>
        </Box>

        {/* Main Content Area */}
        <Box sx={{ overflowY: 'auto', height: 'calc(100vh - 112px)', py: 2, bgcolor: 'background.default' }}>
          <Container maxWidth="md">
            
            {activeTab === 0 ? (
              // Tab 1: Hábitos Tracker
              <Box>
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
                
                <Box sx={{ mt: 3, p: 2.5, borderRadius: 4, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Goku Habits Tracker — Construa um corpo de ferro e uma mente blindada dia após dia.
                  </Typography>
                </Box>
              </Box>
            ) : (
              // Tab 2: Recharts Stats Dashboard
              <Box className="space-y-6">
                <Typography variant="h5" fontWeight="bold" align="center" color="primary" gutterBottom sx={{ mt: 1 }}>
                  📈 Meu Desempenho de Hábitos
                </Typography>

                {history.length === 0 ? (
                  <Box sx={{ py: 6, px: 2, borderRadius: 4, bgcolor: 'background.paper', border: '1px dotted', borderColor: 'divider', textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary" gutterBottom>
                      Nenhum histórico semanal salvo ainda.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      O app detecta automaticamente quando é domingo e pergunta se você deseja arquivar seu progresso semanal.
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    
                    {/* Resumo Cards */}
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Card sx={{ borderRadius: 3, textAlign: 'center' }}>
                          <CardContent>
                            <Typography variant="body2" color="text.secondary" fontWeight="bold">Semanas Ativas</Typography>
                            <Typography variant="h4" fontWeight="black" color="primary">{history.length}</Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                      <Grid item xs={6}>
                        <Card sx={{ borderRadius: 3, textAlign: 'center' }}>
                          <CardContent>
                            <Typography variant="body2" color="text.secondary" fontWeight="bold">Recorde Semanal</Typography>
                            <Typography variant="h4" fontWeight="black" color="success.main">
                              {Math.max(...history.map(h => h.score))}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>

                    {/* Linha de Evolução Semanal */}
                    <Card sx={{ borderRadius: 4, p: 2 }}>
                      <CardContent>
                        <Typography variant="h6" fontWeight="bold" color="text.primary" gutterBottom>
                          Evolução de Completude
                        </Typography>
                        <Box sx={{ width: '100%', height: 220 }}>
                          <ResponsiveContainer>
                            <LineChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                              <XAxis dataKey="name" stroke="#888888" fontSize={11} />
                              <YAxis stroke="#888888" fontSize={11} domain={[0, 45]} />
                              <Tooltip />
                              <Line type="monotone" dataKey="Score" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                          </ResponsiveContainer>
                        </Box>
                      </CardContent>
                    </Card>

                    {/* Empilhamento por Hábito */}
                    <Card sx={{ borderRadius: 4, p: 2 }}>
                      <CardContent>
                        <Typography variant="h6" fontWeight="bold" color="text.primary" gutterBottom>
                          Distribuição de Hobbies
                        </Typography>
                        <Box sx={{ width: '100%', height: 220 }}>
                          <ResponsiveContainer>
                            <BarChart data={chartData}>
                              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                              <XAxis dataKey="name" stroke="#888888" fontSize={11} />
                              <YAxis stroke="#888888" fontSize={11} />
                              <Tooltip />
                              <Legend wrapperStyle={{ fontSize: 10 }} />
                              <Bar dataKey="Money" stackId="a" fill="#10b981" />
                              <Bar dataKey="Shape" stackId="a" fill="#ef4444" />
                              <Bar dataKey="Knowledge" stackId="a" fill="#06b6d4" />
                              <Bar dataKey="Mindset" stackId="a" fill="#f59e0b" />
                              <Bar dataKey="Creative" stackId="a" fill="#a855f7" />
                            </BarChart>
                          </ResponsiveContainer>
                        </Box>
                      </CardContent>
                    </Card>

                  </Box>
                )}
              </Box>
            )}

            <Box sx={{ height: 40 }} />
          </Container>
        </Box>

        {/* Dialog Prompter for Sundays */}
        <Dialog
          open={openSundayDialog}
          onClose={() => setOpenSundayDialog(false)}
          PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
        >
          <DialogTitle sx={{ fontWeight: 'black', color: 'primary.main' }}>
            📅 Arquivar Semana de Hábitos?
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Hoje é domingo! Você acumulou **{totalCount}** conclusões nesta semana. 
              Deseja salvar esse progresso no seu Histórico/Dashboard e reiniciar os contadores de hábitos para a próxima semana?
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setOpenSundayDialog(false)} color="inherit" sx={{ fontWeight: 'bold' }}>
              Depois
            </Button>
            <Button onClick={handleSaveWeek} variant="contained" color="primary" sx={{ fontWeight: 'bold', borderRadius: 2 }}>
              Sim, Arquivar & Resetar
            </Button>
          </DialogActions>
        </Dialog>

      </IonPage>
    </ThemeProvider>
  );
}

export default GohanTreinamentosHomePage;