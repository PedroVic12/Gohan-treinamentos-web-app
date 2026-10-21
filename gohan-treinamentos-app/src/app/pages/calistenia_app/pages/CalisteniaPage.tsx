import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  FormControlLabel,
  IconButton,
  LinearProgress,
  Snackbar,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { loadWorkoutCatalog } from '../data/defaultWorkouts';
import { usePersistentState } from '../hooks/usePersistentState';
import { useRestTimer } from '../hooks/useRestTimer';
import { buildPeriodBuckets, filterHistoryByPeriod } from '../services/historyPeriod.strategy';
import type { CustomChecklist, HistoryFilter, WorkoutCatalog, WorkoutHistoryEntry } from '../types/workout.types';
import { RestTimerBar } from '../components/RestTimerBar';
import { YouTubeLazy } from '../components/YouTubeLazy';

const GeradorTreinoPage = React.lazy(() => import('../../geradorTreinoPage'));

const DEFAULT_CHECKLISTS: CustomChecklist[] = [
  {
    id: 'c1',
    name: 'Peito, Ombro e Tríceps',
    items: ['Flexão Diamante 4x12', 'Flexão Inclinada 3x12', 'Flexão de Ombros 4x15', 'Flexão (pseudo pushup) 3x12', 'Flexão normal 3x12'],
  },
  {
    id: 'c2',
    name: 'Costas e Bíceps',
    items: ['Puxada na Frente 4x12', 'Remada Baixa 4x12', 'Rosca Direta 3x15', 'Rosca Martelo 3x12'],
  },
];

const CATEGORIES = ['push', 'pull', 'legs', 'abs'] as const;

const CalisteniaPage: React.FC = () => {
  const [activeRootTab, setActiveRootTab] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('push');
  const [selectedTreino, setSelectedTreino] = useState('');
  const [historyFilter, setHistoryFilter] = useState<HistoryFilter>('day');
  const [newTreinoName, setNewTreinoName] = useState('');
  const [newTreinoItems, setNewTreinoItems] = useState('');
  const [snackOpen, setSnackOpen] = useState(false);

  const [workouts, setWorkouts] = usePersistentState<WorkoutCatalog>('gohan_workouts_custom', loadWorkoutCatalog());
  const [checkedSets, setCheckedSets] = usePersistentState<Record<string, boolean[]>>('gohan_checked_sets', {});
  const [customWorkouts, setCustomWorkouts] = usePersistentState<CustomChecklist[]>('gohan_custom_checklists', DEFAULT_CHECKLISTS);
  const [completedItems, setCompletedItems] = usePersistentState<Record<string, boolean>>('gohan_custom_completed', {});
  const [workoutHistory, setWorkoutHistory] = usePersistentState<WorkoutHistoryEntry[]>('gohan_workout_history', []);

  const onTimerComplete = useCallback(() => setSnackOpen(true), []);
  const { timerTime, timerActive, toggle, reset, startRest } = useRestTimer(onTimerComplete);

  useEffect(() => {
    setWorkouts(loadWorkoutCatalog());
  }, [setWorkouts]);

  useEffect(() => {
    const categoryWorkouts = workouts[selectedCategory] || [];
    if (categoryWorkouts.length > 0) setSelectedTreino(categoryWorkouts[0].treino);
    else setSelectedTreino('');
  }, [selectedCategory, workouts]);

  const handleToggleSet = (exerciseId: string, setIndex: number, checked: boolean) => {
    const historyId = `routine-${exerciseId}-${setIndex}`;
    const historyDate = new Date().toISOString();

    setCheckedSets((prev) => {
      const current = prev[exerciseId] ? [...prev[exerciseId]] : [];
      current[setIndex] = checked;
      if (checked) startRest();
      return { ...prev, [exerciseId]: current };
    });

    setWorkoutHistory((prev) => {
      if (checked) {
        const alreadyLoggedToday = prev.some((e) => e.id === historyId && e.date.slice(0, 10) === historyDate.slice(0, 10));
        if (alreadyLoggedToday) return prev;
        return [...prev, { id: historyId, date: historyDate, label: `Série ${setIndex + 1}`, category: selectedCategory, source: 'routine' }];
      }
      return prev.filter((e) => e.id !== historyId || e.date.slice(0, 10) !== historyDate.slice(0, 10));
    });
  };

  const handleAddCustomTreino = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTreinoName.trim() || !newTreinoItems.trim()) return;
    const items = newTreinoItems.split('\n').map((i) => i.trim()).filter(Boolean);
    setCustomWorkouts((prev) => [...prev, { id: Date.now().toString(), name: newTreinoName, items }]);
    setNewTreinoName('');
    setNewTreinoItems('');
  };

  const handleToggleCustomItem = (id: string, index: number) => {
    const key = `${id}-${index}`;
    const historyId = `checklist-${id}-${index}`;
    const historyDate = new Date().toISOString();
    const wasCompleted = completedItems[key] || false;

    setCompletedItems((prev) => ({ ...prev, [key]: !prev[key] }));

    setWorkoutHistory((prev) => {
      if (wasCompleted) return prev.filter((e) => e.id !== historyId || e.date.slice(0, 10) !== historyDate.slice(0, 10));
      const alreadyLoggedToday = prev.some((e) => e.id === historyId && e.date.slice(0, 10) === historyDate.slice(0, 10));
      if (alreadyLoggedToday) return prev;
      const workout = customWorkouts.find((w) => w.id === id);
      return [...prev, { id: historyId, date: historyDate, label: workout?.name || 'Checklist', category: 'Checklist', source: 'checklist' }];
    });
  };

  const currentCategoryWorkouts = workouts[selectedCategory] || [];
  const selectedWorkoutObj = currentCategoryWorkouts.find((w) => w.treino === selectedTreino);

  const totalCustomItems = customWorkouts.reduce((acc, c) => acc + c.items.length, 0);
  const completedCustomItemsCount = Object.values(completedItems).filter(Boolean).length;
  const progressPercent = totalCustomItems > 0 ? (completedCustomItemsCount / totalCustomItems) * 100 : 0;
  const totalExercises = Object.values(workouts).reduce((t, cw) => t + cw.reduce((c, w) => c + w.exercises.length, 0), 0);

  const dashboard = useMemo(() => {
    const filtered = filterHistoryByPeriod(workoutHistory, historyFilter);
    const periodData = buildPeriodBuckets(filtered, historyFilter);
    const sourceData = [
      { name: 'Rotinas', value: filtered.filter((e) => e.source === 'routine').length, color: '#1976d2' },
      { name: 'Checklists', value: filtered.filter((e) => e.source === 'checklist').length, color: '#ed6c02' },
    ].filter((i) => i.value > 0);
    return { filtered, periodData, sourceData };
  }, [workoutHistory, historyFilter]);

  const tabLabels = ['💪 Rotinas', '📋 Fichas', '📊 Resumo', '🏋️ Avançada'];

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding" style={{ '--padding-bottom': 'calc(16px + env(safe-area-inset-bottom))' }}>
        <Box sx={{ maxWidth: 720, mx: 'auto', pb: 4 }}>
          <Tabs
            value={activeRootTab}
            onChange={(_, v) => setActiveRootTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: 'divider', mb: 2, position: 'sticky', top: 0, zIndex: 3, bgcolor: 'background.default' }}
          >
            {tabLabels.map((label, i) => (
              <Tab key={i} label={label} sx={{ minHeight: 48, fontSize: { xs: '0.75rem', sm: '0.875rem' } }} />
            ))}
          </Tabs>

          {activeRootTab === 0 && (
            <Box>
              <Typography variant="h6" fontWeight="black" align="center" color="primary" gutterBottom>
                Treino Goku Sayajin
              </Typography>
              <RestTimerBar timerTime={timerTime} timerActive={timerActive} onToggle={toggle} onReset={reset} />
              <Box sx={{ display: 'flex', gap: 1, mb: 2, overflowX: 'auto', pb: 0.5, flexWrap: 'nowrap' }}>
                {CATEGORIES.map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? 'contained' : 'outlined'}
                    onClick={() => setSelectedCategory(cat)}
                    sx={{ borderRadius: 4, textTransform: 'capitalize', fontWeight: 'bold', minWidth: 72, minHeight: 44, flexShrink: 0 }}
                  >
                    {cat}
                  </Button>
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 1, mb: 2, overflowX: 'auto', pb: 0.5 }}>
                {currentCategoryWorkouts.map((w) => (
                  <Chip
                    key={w.treino}
                    label={w.treino}
                    clickable
                    color={selectedTreino === w.treino ? 'primary' : 'default'}
                    onClick={() => setSelectedTreino(w.treino)}
                    sx={{ fontWeight: 'bold', flexShrink: 0 }}
                  />
                ))}
              </Box>
              {selectedWorkoutObj ? (
                selectedWorkoutObj.exercises.map((exercise) => {
                  const checked = checkedSets[exercise.id] || [];
                  const isCompleted = checked.filter(Boolean).length === exercise.sets;
                  return (
                    <Card key={exercise.id} sx={{ borderRadius: 3, mb: 2, border: '1px solid', borderColor: isCompleted ? 'success.main' : 'divider' }}>
                      <CardContent>
                        <Typography variant="h6" fontWeight="bold">{exercise.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Séries: {exercise.sets} | Reps: {exercise.reps}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', my: 1.5 }}>
                          {Array.from({ length: exercise.sets }).map((_, index) => (
                            <FormControlLabel
                              key={index}
                              control={
                                <Checkbox
                                  checked={checked[index] || false}
                                  onChange={(e) => handleToggleSet(exercise.id, index, e.target.checked)}
                                  sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                                />
                              }
                              label={`S${index + 1}`}
                              sx={{ minHeight: 44 }}
                            />
                          ))}
                        </Box>
                        {exercise.youtubeUrl && <YouTubeLazy title={exercise.name} youtubeUrl={exercise.youtubeUrl} />}
                        {isCompleted && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'success.main', mt: 1 }}>
                            <CheckCircleIcon fontSize="small" />
                            <Typography variant="body2" fontWeight="bold">Completo!</Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <Typography align="center" color="text.secondary" sx={{ my: 4 }}>
                  Selecione um treino.
                </Typography>
              )}
            </Box>
          )}

          {activeRootTab === 1 && (
            <Box>
              <Typography variant="h6" fontWeight="black" align="center" color="primary" gutterBottom>
                Minhas Fichas
              </Typography>
              {totalCustomItems > 0 && (
                <LinearProgress variant="determinate" value={progressPercent} sx={{ height: 8, borderRadius: 4, mb: 2 }} />
              )}
              <Card sx={{ mb: 3, borderRadius: 3 }}>
                <CardContent>
                  <form onSubmit={handleAddCustomTreino}>
                    <TextField fullWidth size="small" label="Nome do treino" value={newTreinoName} onChange={(e) => setNewTreinoName(e.target.value)} sx={{ mb: 2 }} required />
                    <TextField fullWidth multiline rows={3} label="Exercícios (um por linha)" value={newTreinoItems} onChange={(e) => setNewTreinoItems(e.target.value)} sx={{ mb: 2 }} required />
                    <Button type="submit" variant="contained" fullWidth sx={{ minHeight: 44 }}>
                      Salvar
                    </Button>
                  </form>
                </CardContent>
              </Card>
              {customWorkouts.map((workout) => (
                <Card key={workout.id} sx={{ mb: 2, borderRadius: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography fontWeight="bold" color="primary">{workout.name}</Typography>
                      <IconButton size="small" color="error" onClick={() => setCustomWorkouts((p) => p.filter((c) => c.id !== workout.id))}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                    {workout.items.map((item, idx) => {
                      const key = `${workout.id}-${idx}`;
                      const done = completedItems[key] || false;
                      return (
                        <FormControlLabel
                          key={idx}
                          control={<Checkbox checked={done} onChange={() => handleToggleCustomItem(workout.id, idx)} />}
                          label={item}
                          sx={{ minHeight: 44, display: 'flex', width: '100%' }}
                        />
                      );
                    })}
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}

          {activeRootTab === 2 && (
            <Box>
              <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                {([['day', 'Hoje'], ['week', 'Semana'], ['month', 'Mês']] as const).map(([value, label]) => (
                  <Button key={value} variant={historyFilter === value ? 'contained' : 'outlined'} onClick={() => setHistoryFilter(value)} sx={{ minHeight: 44 }}>
                    {label}
                  </Button>
                ))}
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Conclusões: {dashboard.filtered.length} | Exercícios cadastrados: {totalExercises}
              </Typography>
              <Box sx={{ width: '100%', height: 260, mt: 2 }}>
                <ResponsiveContainer>
                  <BarChart data={dashboard.periodData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="label" interval={historyFilter === 'month' ? 4 : 0} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="completed" fill="#1976d2" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
              {dashboard.sourceData.length > 0 && (
                <Box sx={{ width: '100%', height: 240, mt: 2 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={dashboard.sourceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                        {dashboard.sourceData.map((item) => (
                          <Cell key={item.name} fill={item.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </Box>
          )}

          {activeRootTab === 3 && (
            <Suspense fallback={<Typography align="center">Carregando ficha avançada…</Typography>}>
              <GeradorTreinoPage />
            </Suspense>
          )}
        </Box>

        <Snackbar open={snackOpen} autoHideDuration={4000} onClose={() => setSnackOpen(false)} message="⏰ Descanso concluído — próxima série!" />
      </IonContent>
    </IonPage>
  );
};

export default CalisteniaPage;
