import React, { useState, useEffect } from 'react';
import {
    Tabs,
    Tab,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardMedia,
    Typography,
    TextField,
    Checkbox,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import { CheckCircle, XCircle, PlusCircle } from 'lucide-react';

// Interface para exercícios
interface Exercise {
    id: string;
    name: string;
    sets: number;
    reps: number | string;
}

// Interface para vídeos tutoriais
interface TutorialVideo {
    id: string;
    title: string;
    youtubeUrl: string;
    category: string;
}

// Interface para logs de treino diários
interface DailyWorkoutLog {
    [category: string]: boolean;
}

// Interface para logs de treino
interface TrainingLog {
    [date: string]: DailyWorkoutLog;
}

// Classe de repositório de dados
class DataRepository {
    private initialData: {
        treinos: {
            [category: string]: { [key: string]: string[] };
        };
        TUTORIAL_YOUTUBE: { [category: string]: string[] };
    } = {
        treinos: {
            Pull: {
                '1': ["100 Pull ups - Chris Heria", "", "Normal"],
                '2': ["Skin the Cat + 100 Pull ups + Muscle Up", "", "Sayajin"]
            },
            Push: {
                '1': ["100 Pull Ups - Next", "https://www.youtube.com/watch?v=X4XDkWOlQD8", "Normal"],
                '2': ["100 Push ups - Chris Heria", "https://www.youtube.com/watch?v=IYLxm0T6qls", "Sayajin"],
                '3': ["5 minutes 30x30", "", "Normal"],
                '4': ["Moves of the day - treino de peito", "https://www.youtube.com/watch?v=ypxmdLxCK7k&t=441s", "https://www.youtube.com/watch?v=1BpYbEi2QcI&t=703s", "https://www.youtube.com/watch?v=0cMXdZL9ESA"]
            },
            ABS: {
                '1': ["Get ABS in 28 Days", "https://www.youtube.com/watch?v=TIMghHu6QFU", "Normal"],
                '2': ["DO THIS ABS WORKOUT EVERY DAY", "https://www.youtube.com/watch?v=xRXhpMsLaXo&t=285s", "https://www.youtube.com/watch?v=fpK5VZCwJPY", "Normal"]
            },
            Legs: {
                '1': ["100 Squads a Day - Chris Heria", "https://www.youtube.com/watch?v=qLPrPVz4NzQ", "", "Normal"]
            },
        },
        TUTORIAL_YOUTUBE: {
            mobilidade: [
                "https://www.youtube.com/watch?v=XmaD8jne22Y",
                "https://www.youtube.com/watch?v=mXnuAyBVWYM"
            ],
            motivacao: [
                "https://www.youtube.com/watch?v=bKcIhVpIzDY",
                "https://www.youtube.com/watch?v=8GKZ5o5z5dE",
                "https://www.youtube.com/watch?v=RQLK1UqOg5Y"
            ],
            coding: [""]
        }
    };

    getInitialWorkouts(): { [key: string]: Exercise[] } {
        const workouts: { [key: string]: Exercise[] } = {};
        for (const category in this.initialData.treinos) {
            if (this.initialData.treinos.hasOwnProperty(category)) { // 安全 проверкa
                workouts[category] = Object.entries(this.initialData.treinos[category]).map(([key, value]) => ({
                    id: `${category}-${key}`,
                    name: value[0],
                    sets: value.length > 2 ? value.length - 1 : 1, // Número de séries baseado no comprimento do array
                    reps: value[1] || 'N/A', // Usa o segundo elemento como repetições ou 'N/A'
                }));
            }
        }
        return workouts;
    }

    getTutorialVideos(): TutorialVideo[] {
        const videos: TutorialVideo[] = [];
        for (const category in this.initialData.TUTORIAL_YOUTUBE) {
             if (this.initialData.TUTORIAL_YOUTUBE.hasOwnProperty(category)) {
            this.initialData.TUTORIAL_YOUTUBE[category].forEach((url, index) => {
                videos.push({
                    id: `${category}-${index}`,
                    title: `Tutorial ${index + 1} - ${category}`,
                    youtubeUrl: url,
                    category: category
                });
            });
           }
        }
        return videos;
    }

    loadWorkouts(): { [key: string]: Exercise[] } {
        const savedWorkouts = localStorage.getItem('calisthenicsWorkouts');
        return savedWorkouts ? JSON.parse(savedWorkouts) : this.getInitialWorkouts();
    }

    saveWorkouts(workouts: { [key: string]: Exercise[] }): void {
        localStorage.setItem('calisthenicsWorkouts', JSON.stringify(workouts));
    }

    loadCheckedExercises(): { [key: string]: boolean[] | undefined } {
        const savedCheckedExercises = localStorage.getItem('checkedExercises');
        return savedCheckedExercises ? JSON.parse(savedCheckedExercises) : {};
    }

    saveCheckedExercises(checkedExercises: { [key: string]: boolean[] | undefined }): void {
        localStorage.setItem('checkedExercises', JSON.stringify(checkedExercises));
    }

    loadTrainingLog(): TrainingLog {
        const savedTrainingLog = localStorage.getItem('trainingLog');
        return savedTrainingLog ? JSON.parse(savedTrainingLog) : {};
    }

    saveTrainingLog(trainingLog: TrainingLog): void {
        localStorage.setItem('trainingLog', JSON.stringify(trainingLog));
    }
}

// Classe controladora para gerenciar o estado do aplicativo
class AppController {
    public repository: DataRepository;
    private workouts: { [key: string]: Exercise[] };
    private checkedExercises: { [key: string]: boolean[] | undefined };
    private trainingLog: TrainingLog;
    private tutorialVideos: TutorialVideo[];

    constructor(repository: DataRepository) {
        this.repository = repository;
        this.workouts = this.repository.loadWorkouts();
        this.checkedExercises = this.repository.loadCheckedExercises();
        this.trainingLog = this.repository.loadTrainingLog();
        this.tutorialVideos = this.repository.getTutorialVideos();
    }

    getWorkouts(): { [key: string]: Exercise[] } {
        return this.workouts;
    }

    getCheckedExercises(): { [key: string]: boolean[] | undefined } {
        return this.checkedExercises;
    }

    getTrainingLog(): TrainingLog {
        return this.trainingLog;
    }

    getTutorialVideos(): TutorialVideo[] {
        return this.tutorialVideos;
    }

    updateExercise(category: string, updatedExercise: Exercise): void {
        this.workouts = {
            ...this.workouts,
            [category]: this.workouts[category].map(ex =>
                ex.id === updatedExercise.id ? updatedExercise : ex
            ),
        };
        this.repository.saveWorkouts(this.workouts);
    }

    toggleCheck(category: string, exerciseId: string, setIndex: number, checked: boolean): void {
        this.checkedExercises = {
            ...this.checkedExercises,
            [exerciseId]: this.checkedExercises[exerciseId] ?
                this.checkedExercises[exerciseId]!.map((val, index) => index === setIndex ? checked : val) :
                Array(this.workouts[category].find(ex => ex.id === exerciseId)?.sets || 0).fill(false).map((val, index) => index === setIndex ? checked : val)
        };

        this.repository.saveCheckedExercises(this.checkedExercises);
    }

    deleteExercise(category: string, exerciseId: string): void {
        this.workouts = {
            ...this.workouts,
            [category]: this.workouts[category].filter(ex => ex.id !== exerciseId),
        };
        delete this.checkedExercises[exerciseId]; // Remove o estado de verificação
        this.repository.saveWorkouts(this.workouts);
        this.repository.saveCheckedExercises(this.checkedExercises);
    }

    addExercise(category: string, newExercise: Exercise): void {
        this.workouts = {
            ...this.workouts,
            [category]: [...this.workouts[category], newExercise],
        };
        this.repository.saveWorkouts(this.workouts);
    }

    moveExercise(category: string, exerciseId: string, direction: 'up' | 'down'): void {
        const currentExercises = this.workouts[category];
        const currentIndex = currentExercises.findIndex(ex => ex.id === exerciseId);

        if (direction === 'up' && currentIndex > 0) {
            const newExercises = [...currentExercises];
            [newExercises[currentIndex - 1], newExercises[currentIndex]] = [newExercises[currentIndex], newExercises[currentIndex - 1]];
            this.workouts = { ...this.workouts, [category]: newExercises };
        } else if (direction === 'down' && currentIndex < currentExercises.length - 1) {
            const newExercises = [...currentExercises];
            [newExercises[currentIndex], newExercises[currentIndex + 1]] = [newExercises[currentIndex + 1], newExercises[currentIndex]];
            this.workouts = { ...this.workouts, [category]: newExercises };
        }
        this.repository.saveWorkouts(this.workouts);
    }

    recordWorkout(): void {
        const today = new Date().toISOString().split('T')[0];
        const completedCategories: DailyWorkoutLog = {};

        // Verifica se todos os sets para todos os exercícios em uma categoria estão marcados
        for (const category in this.workouts) {
            const categoryWorkouts = this.workouts[category];
            completedCategories[category] = categoryWorkouts.every(exercise => {
                if (!this.checkedExercises[exercise.id]) return false;
                return Array.isArray(this.checkedExercises[exercise.id]) &&
                    this.checkedExercises[exercise.id]!.every(Boolean);
            });
        }

        this.trainingLog = {
            ...this.trainingLog,
            [today]: completedCategories,
        };
        this.repository.saveTrainingLog(this.trainingLog);
        this.checkedExercises = {};
        this.repository.saveCheckedExercises(this.checkedExercises);
    }

    updateExerciseDetails(category: string, exerciseId: string, updates: Partial<Exercise>) {
        this.workouts = {
            ...this.workouts,
            [category]: this.workouts[category].map(exercise =>
                exercise.id === exerciseId
                    ? { ...exercise, ...updates }  // Mescla as atualizações
                    : exercise
            )
        };
        this.repository.saveWorkouts(this.workouts);
    }
}

// Inicializa o Repositório e o Controlador
const dataRepository = new DataRepository();
const appController = new AppController(dataRepository);

// Componente de Vídeo do YouTube
const YouTubeVideo: React.FC<{ title: string; youtubeUrl: string }> = ({ title, youtubeUrl }) => {
    const videoId = youtubeUrl.split('v=')[1]?.split('&')[0];

    if (!videoId) {
        return <div className="text-red-500">URL do YouTube inválido.</div>;
    }

    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

    return (
        <Card>
            <CardHeader>
                <Typography variant="h6">{title}</Typography>
            </CardHeader>
            <CardContent>
                <CardMedia component="iframe" src={embedUrl} title={title} height="200" />
            </CardContent>
        </Card>
    );
};

// ExerciseCard Component
interface ExerciseCardProps {
    exercise: Exercise;
    completedExercises: { [key: string]: number };
    handleExerciseComplete: (exerciseId: string, setIndex: number) => void;
}
const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, completedExercises, handleExerciseComplete }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <Card className="mb-4">
            <CardHeader onClick={() => setExpanded(!expanded)} style={{ cursor: 'pointer' }}>
                <Typography variant="h6">{exercise.name}</Typography>
            </CardHeader>
            {expanded && (
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            {Array.from({ length: exercise.sets }).map((_, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <Checkbox
                                        checked={completedExercises[exercise.id] > index}
                                        onChange={() => handleExerciseComplete(exercise.id, index)}
                                    />
                                    <span>Série {index + 1} - {exercise.reps} repetições</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            )}
        </Card>
    );
};


interface RestTimerProps {
    duration: number;
    onDurationChange: (newDuration: number) => void;
}
// RestTimer Component
const RestTimer: React.FC<RestTimerProps> = ({ duration, onDurationChange }) => {
    const [timeLeft, setTimeLeft] = useState(duration);
    const [isRunning, setIsRunning] = useState(false);

    const startTimer = () => {
        setIsRunning(true);
        setTimeLeft(duration);
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setIsRunning(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(duration);
    };

    return (
        <div>
            <Typography variant="h6">Timer de Descanso: {timeLeft}s</Typography>
            <Button onClick={startTimer} disabled={isRunning}>Iniciar</Button>
            <Button onClick={resetTimer}>Resetar</Button>
            <TextField
                type="number"
                value={duration}
                onChange={(e) => onDurationChange(Number(e.target.value))}
                label="Duração (s)"
                variant="outlined"
                size="small"
                style={{ marginLeft: '10px' }}
            />
        </div>
    );
};


// Componente principal do aplicativo
const CalisteniaApp = () => {
    const [workouts, setWorkouts] = useState<{ [key: string]: Exercise[] }>(appController.getWorkouts());
    const [checkedExercises, setCheckedExercises] = useState<{ [key: string]: boolean[] | undefined }>(appController.getCheckedExercises());
    const [isEditing, setIsEditing] = useState(false);
    const [newExercise, setNewExercise] = useState<Exercise>({ id: '', name: '', sets: 0, reps: 0 });
    const [selectedCategory, setSelectedCategory] = useState<string>('push'); // Categoria padrão
    const [tutorialVideos, setTutorialVideos] = useState<TutorialVideo[]>(appController.getTutorialVideos());
    const [trainingLog, setTrainingLog] = useState<TrainingLog>(appController.getTrainingLog());

    // Carrega os treinos e exercícios marcados
    useEffect(() => {
        setWorkouts(appController.getWorkouts());
        setCheckedExercises(appController.getCheckedExercises());
        setTrainingLog(appController.getTrainingLog());
    }, []);

    // Salva os treinos e exercícios marcados
    useEffect(() => {
        appController.repository.saveWorkouts(workouts);
        appController.repository.saveCheckedExercises(checkedExercises);
        appController.repository.saveTrainingLog(trainingLog);
    }, [workouts, checkedExercises, trainingLog]);

    const handleUpdateExercise = (category: string, updatedExercise: Exercise) => {
        appController.updateExercise(category, updatedExercise);
        setWorkouts(appController.getWorkouts()); // Atualiza o estado local
    };

    const handleToggleCheck = (category: string, exerciseId: string, setIndex: number, checked: boolean) => {
        appController.toggleCheck(category, exerciseId, setIndex, checked);
        setCheckedExercises(appController.getCheckedExercises());
    };

    const handleDeleteExercise = (category: string, exerciseId: string) => {
        appController.deleteExercise(category, exerciseId);
        setWorkouts(appController.getWorkouts());
        setCheckedExercises(appController.getCheckedExercises());
    };

    const handleAddExercise = () => {
        if (!newExercise.name.trim()) return;

        const exerciseToAdd: Exercise = {
            ...newExercise,
            id: `${selectedCategory}-${Date.now()}`, // Gera um ID único
        };

        appController.addExercise(selectedCategory, exerciseToAdd);
        setWorkouts(appController.getWorkouts());
        setNewExercise({ id: '', name: '', sets: 0, reps: 0 }); // Reseta o formulário
        setIsEditing(true); // Mantém o modo de edição
    };

    const recordWorkout = () => {
        appController.recordWorkout();
        setTrainingLog(appController.getTrainingLog());
        setCheckedExercises(appController.getCheckedExercises());
    };

    // Prepara os dados para a tabela de volume de treino
    const getVolumeData = () => {
        return Object.entries(workouts).flatMap(([category, exercises]) =>
            exercises.map(exercise => ({
                name: exercise.name,
                sets: exercise.sets,
                reps: exercise.reps,
                volume: typeof exercise.reps === 'number' ? exercise.sets * exercise.reps : 'N/A',
            }))
        );
    };

    const volumeData = getVolumeData();

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#121212', color: '#fff', padding: 4 }}>
            <Typography variant="h3" align="center" gutterBottom>
                Calistenia Workout App
            </Typography>

            <Box sx={{ backgroundColor: '#C0C0C0', padding: 2, borderRadius: 1 }}>
            <Tabs value={selectedCategory} onChange={(event: React.SyntheticEvent, newValue: string) => setSelectedCategory(newValue)}>
                <Tab label="Tutoriais" value="tutorials" />
                <Tab label="Push" value="push" />
                <Tab label="Pull" value="pull" />
                <Tab label="Legs" value="legs" />
                <Tab label="ABS" value="abs" />
                <Tab label="Dashboard" value="dashboard" />
            </Tabs>


            </Box>

  
            {/* Aba de Tutoriais */}
            <TabPanel value={selectedCategory} index={'tutorials'}>
                <Typography variant="h5" gutterBottom>Tutoriais</Typography>
                {['mobilidade', 'motivacao', 'coding'].map(category => (
                    <Box key={category} mb={4}>
                        <Typography variant="h6">{category}</Typography>
                        <Carousel sx={{ maxWidth: '500px' }}>
                            {tutorialVideos
                                .filter(video => video.category === category)
                                .map(video => (
                                    <YouTubeVideo key={video.id} title={video.title} youtubeUrl={video.youtubeUrl} />
                                ))}
                        </Carousel>
                    </Box>
                ))}
            </TabPanel>

            {/* Abas de Treino */}
            {['push', 'pull', 'legs', 'abs'].map(category => (
                <TabPanel key={category} value={selectedCategory} index={category}>
                    <Typography variant="h5" gutterBottom>{category}</Typography>
                    <Button variant="outlined" onClick={() => setIsEditing(!isEditing)}>
                        {isEditing ? 'Concluir Edição' : 'Editar Treino'}
                    </Button>
                    {workouts[category].map((exercise, index) => (
                        <Card key={exercise.id} sx={{ marginBottom: 2 }}>
                            <CardHeader title={exercise.name} />
                            <CardContent>
                                <Typography>Sets: {exercise.sets} | Reps: {exercise.reps}</Typography>
                                {Array.from({ length: exercise.sets }).map((_, setIndex) => (
                                    <React.Fragment key={setIndex}>
                                        <Checkbox
                                            checked={checkedExercises[exercise.id]?.[setIndex] || false}
                                            onChange={(e) => handleToggleCheck(category, exercise.id, setIndex, e.target.checked)}
                                        />
                                    </React.Fragment>
                                ))}
                                <Button onClick={() => handleDeleteExercise(category, exercise.id)}>Excluir</Button>
                            </CardContent>
                        </Card>
                    ))}
                    {isEditing && (
                        <Card sx={{ marginBottom: 2 }}>
                            <CardHeader title="Adicionar Exercício" />
                            <CardContent>
                                <TextField
                                    label="Nome"
                                    value={newExercise.name}
                                    onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                                    fullWidth
                                />
                                <TextField
                                    label="Sets"
                                    type="number"
                                    value={newExercise.sets}
                                    onChange={(e) => setNewExercise({ ...newExercise, sets: parseInt(e.target.value, 10) || 0 })}
                                    fullWidth
                                />
                                <TextField
                                    label="Reps"
                                    value={newExercise.reps}
                                    onChange={(e) =>
                                        setNewExercise({
                                            ...newExercise,
                                            reps: e.target.value,
                                        })
                                    }
                                    fullWidth
                                />
                                <Button onClick={handleAddExercise} startIcon={<PlusCircle />}>Adicionar</Button>
                            </CardContent>
                        </Card>
                    )}
                </TabPanel>
            ))}

            {/* Aba de Dashboard */}
            <TabPanel value={selectedCategory} index={'dashboard'}>
                <Typography variant="h5" gutterBottom>Registro de Treinos</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Data</TableCell>
                                <TableCell>Push</TableCell>
                                <TableCell>Pull</TableCell>
                                <TableCell>Legs</TableCell>
                                <TableCell>ABS</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.keys(trainingLog).map(date => (
                                <TableRow key={date}>
                                    <TableCell>{date}</TableCell>
                                    <TableCell>{trainingLog[date].push ? <CheckCircle /> : <XCircle />}</TableCell>
                                    <TableCell>{trainingLog[date].pull ? <CheckCircle /> : <XCircle />}</TableCell>
                                    <TableCell>{trainingLog[date].legs ? <CheckCircle /> : <XCircle />}</TableCell>
                                    <TableCell>{trainingLog[date].abs ? <CheckCircle /> : <XCircle />}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Typography variant="h5" gutterBottom>Volume de Treino</Typography>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Exercício</TableCell>
                                <TableCell>Sets</TableCell>
                                <TableCell>Reps</TableCell>
                                <TableCell>Volume</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {volumeData.map((data, index) => (
                                <TableRow key={index}>
                                    <TableCell>{data.name}</TableCell>
                                    <TableCell>{data.sets}</TableCell>
                                    <TableCell>{data.reps}</TableCell>
                                    <TableCell>{data.volume}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </TabPanel>
        </Box>
    );
};

// Componente TabPanel
const TabPanel = (props: { children?: React.ReactNode; value: string; index: string }) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
};

export default CalisteniaApp;

