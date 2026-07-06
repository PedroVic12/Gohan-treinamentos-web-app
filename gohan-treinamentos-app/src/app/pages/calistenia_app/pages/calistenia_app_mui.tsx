import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  Checkbox,
  FormControlLabel,
  TextField,
  LinearProgress,
  IconButton,
  Chip
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Exercise Class
class Exercise {
  id: string;
  treino: string;
  name: string;
  sets: number;
  reps: string;
  difficulty: string;
  youtubeUrl: string;

  constructor(treino: string, name: string, sets: number, reps: string, difficulty: string, youtubeUrl: string) {
    this.id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    this.treino = treino;
    this.name = name;
    this.sets = sets;
    this.reps = reps;
    this.difficulty = difficulty;
    this.youtubeUrl = youtubeUrl;
  }
}

// Initial default routines
const defaultCalisthenicsData: Record<string, Array<{ treino: string; exercises: Exercise[] }>> = {
  push: [
    {
      treino: 'Push Treino 1',
      exercises: [
        new Exercise('Push Treino 1', 'Push ups (Flexão)', 5, '10-15', 'Normal', 'https://www.youtube.com/watch?v=IODxDxX7oi4'),
        new Exercise('Push Treino 1', 'Flexão Inclinada', 4, '12', 'Fácil', 'https://www.youtube.com/watch?v=IYLxm0T6qls'),
      ]
    },
    {
      treino: '100 Push ups Challenge',
      exercises: [
        new Exercise('100 Push ups Challenge', 'Flexão Explosiva', 4, '8-10', 'Sayajin', 'https://www.youtube.com/watch?v=IYLxm0T6qls'),
        new Exercise('100 Push ups Challenge', 'Flexão Diamante', 4, '10', 'Normal', 'https://www.youtube.com/watch?v=IYLxm0T6qls'),
      ]
    }
  ],
  pull: [
    {
      treino: 'Pull Treino 1',
      exercises: [
        new Exercise('Pull Treino 1', 'Pull ups (Barra Fixa)', 4, '8-10', 'Normal', 'https://www.youtube.com/watch?v=poyr8KenUfc'),
        new Exercise('Pull Treino 1', 'Chin ups', 4, '10', 'Normal', 'https://www.youtube.com/watch?v=poyr8KenUfc'),
      ]
    }
  ],
  legs: [
    {
      treino: 'Legs Treino 1',
      exercises: [
        new Exercise('Legs Treino 1', 'Squats (Agachamento)', 5, '20', 'Normal', 'https://www.youtube.com/watch?v=qLPrPVz4NzQ'),
        new Exercise('Legs Treino 1', 'Lunges (Passada)', 4, '15 (cada perna)', 'Normal', 'https://www.youtube.com/watch?v=qLPrPVz4NzQ'),
      ]
    }
  ],
  abs: [
    {
      treino: 'Abs Treino 1',
      exercises: [
        new Exercise('Abs Treino 1', 'Abdominal Infra', 4, '15', 'Fácil', 'https://www.youtube.com/watch?v=TIMghHu6QFU'),
        new Exercise('Abs Treino 1', 'Plank (Prancha)', 3, '1 min', 'Normal', 'https://www.youtube.com/watch?v=xRXhpMsLaXo'),
      ]
    }
  ]
};

// YouTube player component
const YouTubeVideo: React.FC<{ title: string; youtubeUrl: string }> = ({ title, youtubeUrl }) => {
  if (!youtubeUrl) return null;
  
  let videoId = '';
  if (youtubeUrl.includes('v=')) {
    videoId = youtubeUrl.split('v=')[1]?.split('&')[0];
  } else if (youtubeUrl.includes('youtu.be/')) {
    videoId = youtubeUrl.split('youtu.be/')[1]?.split('?')[0];
  } else if (youtubeUrl.includes('embed/')) {
    videoId = youtubeUrl.split('embed/')[1]?.split('?')[0];
  }
  
  if (!videoId) return null;
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  
  return (
    <Box sx={{ position: 'relative', width: '100%', pt: '56.25%', mt: 2, borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
      <iframe
        src={embedUrl}
        title={title}
        frameBorder="0"
        allowFullScreen
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      />
    </Box>
  );
};

export default function CalisthenicsApp() {
  const [activeRootTab, setActiveRootTab] = useState(0);
  
  // Tab 1: Calistenia states
  const [selectedCategory, setSelectedCategory] = useState('push');
  const [selectedTreino, setSelectedTreino] = useState('');
  const [workouts, setWorkouts] = useState<Record<string, Array<{ treino: string; exercises: Exercise[] }>>>(() => {
    const saved = localStorage.getItem('gohan_workouts_custom');
    return saved ? JSON.parse(saved) : defaultCalisthenicsData;
  });

  const [checkedSets, setCheckedSets] = useState<Record<string, boolean[]>>(() => {
    const saved = localStorage.getItem('gohan_checked_sets');
    return saved ? JSON.parse(saved) : {};
  });

  // Tab 2: Custom checklist generator states (from geradorTreinoPage)
  const [customWorkouts, setCustomWorkouts] = useState<Array<{ id: string; name: string; items: string[] }>>(() => {
    const saved = localStorage.getItem('gohan_custom_checklists');
    return saved ? JSON.parse(saved) : [
      {
        id: 'c1',
        name: "Peito e Tríceps",
        items: [
          "Supino Reto 4x12",
          "Supino Inclinado 3x12",
          "Extensão de Tríceps 4x15",
          "Flexão de Braço 3x falha",
        ]
      },
      {
        id: 'c2',
        name: "Costas e Bíceps",
        items: [
          "Puxada na Frente 4x12",
          "Remada Baixa 4x12",
          "Rosca Direta 3x15",
          "Rosca Martelo 3x12",
        ]
      }
    ];
  });

  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('gohan_custom_completed');
    return saved ? JSON.parse(saved) : {};
  });

  const [newTreinoName, setNewTreinoName] = useState("");
  const [newTreinoItems, setNewTreinoItems] = useState("");

  // Rest Timer State
  const [timerTime, setTimerTime] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('gohan_workouts_custom', JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem('gohan_checked_sets', JSON.stringify(checkedSets));
  }, [checkedSets]);

  useEffect(() => {
    localStorage.setItem('gohan_custom_checklists', JSON.stringify(customWorkouts));
  }, [customWorkouts]);

  useEffect(() => {
    localStorage.setItem('gohan_custom_completed', JSON.stringify(completedItems));
  }, [completedItems]);

  // Set default selected treino on mount or category change
  useEffect(() => {
    const categoryWorkouts = workouts[selectedCategory] || [];
    if (categoryWorkouts.length > 0) {
      setSelectedTreino(categoryWorkouts[0].treino);
    } else {
      setSelectedTreino('');
    }
  }, [selectedCategory, workouts]);

  // Rest Timer logic
  useEffect(() => {
    if (timerActive) {
      timerIntervalRef.current = setInterval(() => {
        setTimerTime(prev => {
          if (prev <= 1) {
            setTimerActive(false);
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
            // play simple audio beep if supported
            try {
              const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
              const osc = audioCtx.createOscillator();
              osc.connect(audioCtx.destination);
              osc.frequency.setValueAtTime(880, audioCtx.currentTime);
              osc.start();
              osc.stop(audioCtx.currentTime + 0.3);
            } catch (e) {
              console.log("Audio API not supported or interaction required");
            }
            alert("⏰ Tempo de descanso concluído! Prepare-se para a próxima série!");
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [timerActive]);

  // Toggle set checkbox
  const handleToggleSet = (exerciseId: string, setIndex: number, checked: boolean) => {
    setCheckedSets(prev => {
      const current = prev[exerciseId] ? [...prev[exerciseId]] : [];
      current[setIndex] = checked;
      const newState = { ...prev, [exerciseId]: current };
      
      // Auto trigger rest timer if checked
      if (checked) {
        setTimerTime(60);
        setTimerActive(true);
      }
      return newState;
    });
  };

  // Add custom checklist item
  const handleAddCustomTreino = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTreinoName.trim() && newTreinoItems.trim()) {
      const items = newTreinoItems.split("\n").map(i => i.trim()).filter(Boolean);
      const newObj = {
        id: Date.now().toString(),
        name: newTreinoName,
        items
      };
      setCustomWorkouts(prev => [...prev, newObj]);
      setNewTreinoName("");
      setNewTreinoItems("");
    }
  };

  // Delete custom checklist
  const handleDeleteCustomTreino = (id: string) => {
    setCustomWorkouts(prev => prev.filter(c => c.id !== id));
  };

  // Toggle custom item completed
  const handleToggleCustomItem = (id: string, index: number) => {
    setCompletedItems(prev => {
      const key = `${id}-${index}`;
      return { ...prev, [key]: !prev[key] };
    });
  };

  // Filter current workout routines
  const currentCategoryWorkouts = workouts[selectedCategory] || [];
  const selectedWorkoutObj = currentCategoryWorkouts.find(w => w.treino === selectedTreino);

  // Stats calculation for custom checklists
  const totalCustomItems = customWorkouts.reduce((acc, c) => acc + c.items.length, 0);
  const completedCustomItemsCount = Object.keys(completedItems).filter(k => completedItems[k]).length;
  const progressPercent = totalCustomItems > 0 ? (completedCustomItemsCount / totalCustomItems) * 100 : 0;

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      
      {/* Root Tabs */}
      <Tabs
        value={activeRootTab}
        onChange={(_, val) => setActiveRootTab(val)}
        centered
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
      >
        <Tab label="💪 Rotinas Calistenia" />
        <Tab label="📋 Gerador de Treinos" />
      </Tabs>

      {activeRootTab === 0 ? (
        // TAB 1: CALISTENIA ROUTINES
        <Box>
          <Typography variant="h5" fontWeight="black" align="center" color="primary" gutterBottom>
            Treino Físico Goku Sayajin
          </Typography>

          {/* Rest Timer Panel */}
          <Card sx={{ borderRadius: 3, mb: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: '16px !important' }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">⏱️ Rest Stopwatch</Typography>
                <Typography variant="h4" fontWeight="black" color="warning.main">
                  {Math.floor(timerTime / 60)}:{(timerTime % 60).toString().padStart(2, '0')}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton color="primary" onClick={() => setTimerActive(!timerActive)}>
                  {timerActive ? <PauseIcon /> : <PlayArrowIcon />}
                </IconButton>
                <IconButton color="error" onClick={() => { setTimerActive(false); setTimerTime(60); }}>
                  <RefreshIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>

          {/* Subtabs for Categories (Push, Pull, Legs, Abs) */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 3, flexWrap: 'wrap' }}>
            {['push', 'pull', 'legs', 'abs'].map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'contained' : 'outlined'}
                color={selectedCategory === cat ? 'primary' : 'inherit'}
                onClick={() => setSelectedCategory(cat)}
                sx={{ borderRadius: 4, textTransform: 'capitalize', fontWeight: 'bold', minWidth: 80 }}
              >
                {cat}
              </Button>
            ))}
          </Box>

          {/* Treinos List for the Category */}
          <Box sx={{ mb: 3 }}>
            {currentCategoryWorkouts.map(workout => (
              <Chip
                key={workout.treino}
                label={workout.treino}
                clickable
                color={selectedTreino === workout.treino ? 'primary' : 'default'}
                onClick={() => setSelectedTreino(workout.treino)}
                sx={{ mr: 1, mb: 1, fontWeight: 'bold' }}
              />
            ))}
          </Box>

          {/* Render Workout Exercises */}
          {selectedWorkoutObj ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {selectedWorkoutObj.exercises.map(exercise => {
                const checked = checkedSets[exercise.id] || [];
                const isCompleted = checked.filter(Boolean).length === exercise.sets;

                return (
                  <Card key={exercise.id} sx={{ borderRadius: 3, border: '1px solid', borderColor: isCompleted ? 'success.main' : 'divider' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                        <Typography variant="h6" fontWeight="bold">
                          {exercise.name}
                        </Typography>
                        <Chip
                          label={exercise.difficulty}
                          size="small"
                          color={exercise.difficulty === 'Sayajin' ? 'error' : 'secondary'}
                          sx={{ fontWeight: 'bold' }}
                        />
                      </Box>

                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Séries: <strong>{exercise.sets}</strong> | Reps: <strong>{exercise.reps}</strong>
                      </Typography>

                      {/* Set Checkboxes */}
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', my: 2 }}>
                        {Array.from({ length: exercise.sets }).map((_, index) => (
                          <FormControlLabel
                            key={index}
                            control={
                              <Checkbox
                                size="small"
                                checked={checked[index] || false}
                                onChange={(e) => handleToggleSet(exercise.id, index, e.target.checked)}
                              />
                            }
                            label={`S${index + 1}`}
                            sx={{ mr: 1 }}
                          />
                        ))}
                      </Box>

                      {/* Video Button & Display */}
                      {exercise.youtubeUrl && (
                        <Box sx={{ mt: 1 }}>
                          <YouTubeVideo title={exercise.name} youtubeUrl={exercise.youtubeUrl} />
                        </Box>
                      )}

                      {isCompleted && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.5, color: 'success.main' }}>
                          <CheckCircleIcon size="small" />
                          <Typography variant="body2" fontWeight="bold">Séries Completadas!</Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </Box>
          ) : (
            <Typography variant="body1" align="center" color="text.secondary" sx={{ my: 4 }}>
              Selecione ou adicione um treino nesta categoria.
            </Typography>
          )}

        </Box>
      ) : (
        // TAB 2: CUSTOM CHECKLIST GENERATOR
        <Box>
          <Typography variant="h5" fontWeight="black" align="center" color="primary" gutterBottom>
            Minhas Fichas & Checklists
          </Typography>

          {/* Progress bar */}
          {totalCustomItems > 0 && (
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" color="text.secondary">Progresso do Dia</Typography>
                <Typography variant="body2" fontWeight="bold" color="primary">{Math.round(progressPercent)}%</Typography>
              </Box>
              <LinearProgress variant="determinate" value={progressPercent} sx={{ height: 8, borderRadius: 4 }} />
            </Box>
          )}

          {/* Add custom workout form */}
          <Card sx={{ borderRadius: 3, mb: 4, border: '1px solid', borderColor: 'divider' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>➕ Nova Ficha de Treino</Typography>
              <form onSubmit={handleAddCustomTreino}>
                <TextField
                  fullWidth
                  size="small"
                  label="Nome do Treino (ex: Costas e Bíceps)"
                  value={newTreinoName}
                  onChange={(e) => setNewTreinoName(e.target.value)}
                  sx={{ mb: 2 }}
                  required
                />
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Exercícios (um por linha)"
                  value={newTreinoItems}
                  onChange={(e) => setNewTreinoItems(e.target.value)}
                  placeholder="Barra Fixa 4x10&#10;Rosca Direta 3x12&#10;Remada Curvada 4x10"
                  sx={{ mb: 2 }}
                  required
                />
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ fontWeight: 'bold' }}>
                  Salvar Ficha
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Render custom checklists */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {customWorkouts.map(workout => (
              <Card key={workout.id} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      {workout.name}
                    </Typography>
                    <IconButton size="small" color="error" onClick={() => handleDeleteCustomTreino(workout.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {workout.items.map((item, idx) => {
                      const completedKey = `${workout.id}-${idx}`;
                      const isItemCompleted = completedItems[completedKey] || false;

                      return (
                        <FormControlLabel
                          key={idx}
                          control={
                            <Checkbox
                              checked={isItemCompleted}
                              onChange={() => handleToggleCustomItem(workout.id, idx)}
                            />
                          }
                          label={
                            <Typography
                              variant="body2"
                              sx={{
                                textDecoration: isItemCompleted ? 'line-through' : 'none',
                                color: isItemCompleted ? 'text.secondary' : 'text.primary',
                                fontWeight: isItemCompleted ? 'normal' : 'bold'
                              }}
                            >
                              {item}
                            </Typography>
                          }
                        />
                      );
                    })}
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

        </Box>
      )}

    </Container>
  );
}
