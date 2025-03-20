import React, { useState } from 'react';
import { 
  AppBar, 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Checkbox, 
  Container, 
  Divider, 
  FormControlLabel, 
  Grid, 
  IconButton, 
  InputAdornment, 
  Paper, 
  Tab, 
  Tabs, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TextField, 
  Typography 
} from '@mui/material';
import { Add, Delete, PlayArrow, Refresh } from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const CalisthenicsAppMaterial = () => {
  // Tab state
  const [selectedTab, setSelectedTab] = useState('push');
  
  // Checked exercises state
  const [checkedExercises, setCheckedExercises] = useState({});
  
  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);
  
  // Example workout data
  const workouts = {
    push: [
      { id: 'push-1', name: '100 Push ups - Chris Heria', sets: 3, reps: '10-15' },
      { id: 'push-2', name: '5 minutes 30x30', sets: 2, reps: '30' },
      { id: 'push-3', name: 'Moves of the day - treino de peito', sets: 4, reps: '12' }
    ],
    pull: [
      { id: 'pull-1', name: '100 Pull ups - Chris Heria', sets: 3, reps: '10' },
      { id: 'pull-2', name: 'Skin the Cat + Muscle Up', sets: 2, reps: '5-8' }
    ],
    legs: [
      { id: 'legs-1', name: '100 Squads a Day', sets: 4, reps: '25' }
    ],
    abs: [
      { id: 'abs-1', name: 'Get ABS in 28 Days', sets: 3, reps: '15' },
      { id: 'abs-2', name: 'DO THIS ABS WORKOUT EVERY DAY', sets: 2, reps: '20' }
    ]
  };
  
  // Example training log data
  const trainingLog = {
    '2025-03-15': { push: true, pull: true, legs: false, abs: true },
    '2025-03-16': { push: false, pull: true, legs: true, abs: false },
    '2025-03-17': { push: true, pull: false, legs: false, abs: true }
  };
  
  // Function to handle exercise set checking
  const handleToggleCheck = (exerciseId, setIndex, checked) => {
    setCheckedExercises(prev => ({
      ...prev,
      [exerciseId]: {
        ...(prev[exerciseId] || {}),
        [setIndex]: checked
      }
    }));
  };

  // Create dark theme
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
      background: {
        default: '#121212',
        paper: '#1e1e1e',
      },
    },
  });

  // Function to render workout tab content
  const renderWorkoutTab = (category) => {
    return (
      <Box p={2}>
        <Typography variant="h5" fontWeight="bold" mb={2} sx={{ textTransform: 'capitalize' }}>
          {category}
        </Typography>
        
        <Button 
          variant="contained" 
          color={isEditing ? "secondary" : "primary"}
          sx={{ mb: 3 }}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Concluir Edição' : 'Editar Treino'}
        </Button>
        
        {workouts[category].map((exercise) => (
          <Card key={exercise.id} sx={{ mb: 2, bgcolor: 'background.paper' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="medium">{exercise.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                Sets: {exercise.sets} | Reps: {exercise.reps}
              </Typography>
              
              <Box mt={2}>
                <Grid container>
                  {Array.from({ length: exercise.sets }).map((_, setIndex) => (
                    <Grid item xs={6} sm={4} md={3} key={setIndex}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={checkedExercises[exercise.id]?.[setIndex] || false}
                            onChange={(e) => handleToggleCheck(exercise.id, setIndex, e.target.checked)}
                          />
                        }
                        label={`Set ${setIndex + 1}`}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Box>
              
              {isEditing && (
                <Button 
                  variant="contained" 
                  color="error" 
                  size="small"
                  startIcon={<Delete />}
                  sx={{ mt: 1 }}
                >
                  Excluir
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
        
        {isEditing && (
          <Card sx={{ mb: 2, bgcolor: 'background.paper' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="medium">Adicionar Exercício</Typography>
              <Box mt={2} display="flex" flexDirection="column" gap={2}>
                <TextField 
                  fullWidth 
                  label="Nome do exercício" 
                  variant="outlined" 
                />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField 
                      fullWidth 
                      label="Sets" 
                      type="number" 
                      variant="outlined" 
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField 
                      fullWidth 
                      label="Reps" 
                      variant="outlined" 
                    />
                  </Grid>
                </Grid>
                <Button 
                  variant="contained" 
                  color="success" 
                  startIcon={<Add />}
                >
                  Adicionar
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    );
  };
  
  // Function to render dashboard content
  const renderDashboard = () => {
    return (
      <Box p={2}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Registro de Treinos
        </Typography>
        
        <TableContainer component={Paper} sx={{ mb: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Data</TableCell>
                <TableCell align="center">Push</TableCell>
                <TableCell align="center">Pull</TableCell>
                <TableCell align="center">Legs</TableCell>
                <TableCell align="center">ABS</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(trainingLog).map(([date, log]) => (
                <TableRow key={date}>
                  <TableCell>{date}</TableCell>
                  <TableCell align="center">{log.push ? '✅' : '❌'}</TableCell>
                  <TableCell align="center">{log.pull ? '✅' : '❌'}</TableCell>
                  <TableCell align="center">{log.legs ? '✅' : '❌'}</TableCell>
                  <TableCell align="center">{log.abs ? '✅' : '❌'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <Typography variant="h5" fontWeight="bold" mt={4} mb={2}>
          Volume de Treino
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Exercício</TableCell>
                <TableCell align="center">Sets</TableCell>
                <TableCell align="center">Reps</TableCell>
                <TableCell align="center">Volume</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(workouts).flatMap(([category, exercises]) =>
                exercises.map((exercise, index) => (
                  <TableRow key={`${category}-${index}`}>
                    <TableCell>{exercise.name}</TableCell>
                    <TableCell align="center">{exercise.sets}</TableCell>
                    <TableCell align="center">{exercise.reps}</TableCell>
                    <TableCell align="center">
                      {!isNaN(Number(exercise.reps)) 
                        ? exercise.sets * Number(exercise.reps) 
                        : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };
  
  // Function to render tutorials content
  const renderTutorials = () => {
    return (
      <Box p={2}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Tutoriais
        </Typography>
        
        <Box mb={4}>
          <Typography variant="h6" fontWeight="medium" mb={1}>
            Mobilidade
          </Typography>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" mb={1}>Tutorial 1 - mobilidade</Typography>
              <Paper 
                sx={{ 
                  bgcolor: 'grey.800', 
                  height: 200, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}
              >
                <Typography color="text.secondary">YouTube Video Player</Typography>
              </Paper>
            </CardContent>
          </Card>
        </Box>
        
        <Box mb={4}>
          <Typography variant="h6" fontWeight="medium" mb={1}>
            Motivação
          </Typography>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle1" mb={1}>Tutorial 1 - motivacao</Typography>
              <Paper 
                sx={{ 
                  bgcolor: 'grey.800', 
                  height: 200, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}
              >
                <Typography color="text.secondary">YouTube Video Player</Typography>
              </Paper>
            </CardContent>
          </Card>
        </Box>
      </Box>
    );
  };
  
  // Function to render rest timer
  const renderRestTimer = () => {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="medium" mb={1}>
            Timer de Descanso: 30s
          </Typography>
          <Box display="flex" gap={1}>
            <Button 
              variant="contained" 
              color="primary"
              startIcon={<PlayArrow />}
            >
              Iniciar
            </Button>
            <Button 
              variant="contained" 
              color="inherit"
              startIcon={<Refresh />}
            >
              Resetar
            </Button>
            <TextField
              defaultValue="30"
              type="number"
              variant="outlined"
              size="small"
              sx={{ width: 100 }}
              InputProps={{
                endAdornment: <InputAdornment position="end">s</InputAdornment>,
              }}
            />
          </Box>
        </CardContent>
      </Card>
    );
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
        <Container maxWidth="lg">
          <Box pt={4} pb={8}>
            <Typography variant="h3" fontWeight="bold" align="center" mb={4}>
              Calistenia Workout App
            </Typography>
            
            {/* Tabs - Fixed to use variant="scrollable" without centered */}
            <Paper sx={{ mb: 3 }}>
              <Tabs 
                value={selectedTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab value="tutorials" label="Tutoriais" />
                <Tab value="push" label="Push" />
                <Tab value="pull" label="Pull" />
                <Tab value="legs" label="Legs" />
                <Tab value="abs" label="ABS" />
                <Tab value="dashboard" label="Dashboard" />
              </Tabs>
            </Paper>
            
            {/* Rest Timer */}
            {['push', 'pull', 'legs', 'abs'].includes(selectedTab) && renderRestTimer()}
            
            {/* Tab Content */}
            <Paper>
              {selectedTab === 'tutorials' && renderTutorials()}
              {selectedTab === 'push' && renderWorkoutTab('push')}
              {selectedTab === 'pull' && renderWorkoutTab('pull')}
              {selectedTab === 'legs' && renderWorkoutTab('legs')}
              {selectedTab === 'abs' && renderWorkoutTab('abs')}
              {selectedTab === 'dashboard' && renderDashboard()}
            </Paper>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default CalisthenicsAppMaterial;