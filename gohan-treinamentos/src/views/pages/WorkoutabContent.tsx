import React from 'react';
import { Box, Paper, Button, CircularProgress, Typography,IconButton, Tab, Tabs } from '@mui/material';
import YouTubeVideo from '../../core/widgets/ui/YouTubeVideo';
import ExerciseItem from '../../core/widgets/ui/ExerciseItem';
import { useToast } from '../../core/provider/ToastContext';
import { ReactNode, useState } from "react";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


// --- Carousel Component ---
interface CarouselProps {
    children: ReactNode[];
}

const Carousel: React.FC<CarouselProps> = ({ children }) => {
    const [current, setCurrent] = useState(0);
    const maxIndex = children.length - 1;

    const next = () => {
        setCurrent(current === maxIndex ? 0 : current + 1);
    };

    const prev = () => {
        setCurrent(current === 0 ? maxIndex : current - 1);
    };

    return (
        <Box sx={{ position: 'relative', width: '100%', mt: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                {children[current]}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <IconButton onClick={prev} color="primary">
                    <ArrowBackIcon />
                </IconButton>
                <Typography sx={{ mx: 2, display: 'flex', alignItems: 'center' }}>
                    {current + 1} / {children.length}
                </Typography>
                <IconButton onClick={next} color="primary">
                    <ArrowForwardIcon />
                </IconButton>
            </Box>
        </Box>
    );
};


interface WorkoutTabContentProps {
    videos: { id: string; title: string }[];
    exercises: string[];
}

const WorkoutTabContent: React.FC<WorkoutTabContentProps> = ({ videos, exercises }) => {
    const [completedExercises, setCompletedExercises] = React.useState<{ [key: string]: boolean }>(
        exercises.reduce((acc, exercise) => ({ ...acc, [exercise]: false }), {})
    );
    const { addToast } = useToast();

    const handleCheckboxChange = (exercise: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setCompletedExercises({
            ...completedExercises,
            [exercise]: event.target.checked,
        });
    };

    const handleFinishWorkout = () => {
        const allCompleted = Object.values(completedExercises).every(v => v);
        if (allCompleted) {
            addToast('Parabéns! Treino concluído com sucesso!', 'success');
        } else {
            const completedCount = Object.values(completedExercises).filter(v => v).length;
            const totalExercises = exercises.length;
            const percentage = Math.round((completedCount / totalExercises) * 100);

            addToast(`Treino parcialmente concluído: ${percentage}% dos exercícios realizados.`, 'info');
        }
    };

    const progress = Object.values(completedExercises).filter(v => v).length / exercises.length * 100;

    return (
        <Box sx={{ pb: 4 }}>
            <Carousel>
                {videos.map((video) => (
                    <YouTubeVideo key={video.id} videoId={video.id} title={video.title} />
                ))}
            </Carousel>

            <Paper sx={{ p: 2, mt: 2 }}>
                <Box display="flex" alignItems="center" mb={2}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Exercícios
                    </Typography>
                    <CircularProgress
                        variant="determinate"
                        value={progress}
                        size={32}
                        color={progress === 100 ? "success" : "primary"}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        {Math.round(progress)}%
                    </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                    {exercises.map((exercise) => (
                        <ExerciseItem
                            key={exercise}
                            name={exercise}
                            checked={completedExercises[exercise] || false}
                            onChange={handleCheckboxChange(exercise)}
                        />
                    ))}
                </Box>

                <Button
                    variant="contained"
                    fullWidth
                    onClick={handleFinishWorkout}
                    color={progress === 100 ? "success" : "primary"}
                >
                    Finalizar Treino
                </Button>
            </Paper>
        </Box>
    );
};


// --- WorkoutPage Component ---
const WorkoutPage: React.FC = () => {
    const [currentTab, setCurrentTab] = useState(0);

    // Workout data
    const workoutData = [
        {
            type: 'Push',
            videos: [
                { id: 'dGpVNgzqMjY', title: 'Treino Push - Peito, Ombro e Tríceps' },
                { id: 'RJ0zxH0tUJM', title: 'Dicas para Treino Push Completo' },
                { id: 'tHD3Y4OjcQg', title: 'Push Workout para Hipertrofia' }
            ],
            exercises: [
                'Supino Reto 4x12',
                'Desenvolvimento com Halteres 3x10',
                'Crucifixo Máquina 3x12',
                'Elevação Lateral 4x15',
                'Tríceps Corda 4x15',
                'Tríceps Francês 3x12'
            ]
        },
        {
            type: 'Pull',
            videos: [
                { id: '7jYIxJVEKMI', title: 'Treino Pull - Costas e Bíceps' },
                { id: 'KSG9bETUzNI', title: 'Pull Workout para Ganho de Massa' },
                { id: 'MgNn2uPXOz4', title: 'Técnicas Avançadas para Pull Day' }
            ],
            exercises: [
                'Puxada Frontal 4x12',
                'Remada Curvada 4x10',
                'Pulldown 3x12',
                'Rosca Direta 4x12',
                'Rosca Martelo 3x12',
                'Remada Unilateral 3x10 (cada lado)'
            ]
        },
        {
            type: 'Abs',
            videos: [
                { id: '1foQY0o8CSc', title: 'Treino Abdominal Completo 10min' },
                { id: 'AnYl6Nk9GOA', title: 'Abdominal Para Iniciantes' },
                { id: 'DHD1-2P94DI', title: 'Core Training para Definição' }
            ],
            exercises: [
                'Crunch Tradicional 3x20',
                'Prancha Frontal 3x30s',
                'Prancha Lateral 3x20s (cada lado)',
                'Elevação de Pernas 3x15',
                'Russian Twist 3x20',
                'Mountain Climber 3x30s'
            ]
        }
    ];

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue);
    };

    return (
        <Box className="p-4">
            <Typography variant="h4" gutterBottom>Treinos</Typography>

            <Paper sx={{ width: '100%', mb: 2 }}>
                <Tabs
                    value={currentTab}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                    aria-label="workout tabs"
                >
                    {workoutData.map((workout, index) => (
                        <Tab key={index} label={workout.type} />
                    ))}
                </Tabs>
            </Paper>

            {workoutData.map((workout, index) => (
                <Box key={index} role="tabpanel" hidden={currentTab !== index}>
                    {currentTab === index && (
                        <WorkoutTabContent videos={workout.videos} exercises={workout.exercises} />
                    )}
                </Box>
            ))}
        </Box>
    );
};


export default WorkoutPage;