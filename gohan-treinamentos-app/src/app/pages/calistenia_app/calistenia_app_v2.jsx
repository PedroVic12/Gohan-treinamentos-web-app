import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogContent, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Timer, Play, ListTodo, Video } from 'lucide-react';

const exerciseData = {
  chest: [
    { id: 1, name: "Flexão Padrão", videoId: "IODxDxX7oi4" },
    { id: 2, name: "Flexão Diamante", videoId: "J0DnG1_S92I" },
    { id: 3, name: "Flexão Declinada", videoId: "nb_1pAo7iQs" },
    { id: 4, name: "Flexão Archer", videoId: "MY7qwLZeF7k" },
    { id: 5, name: "Flexão Explosiva", videoId: "Z1IH1xXgEBU" },
    { id: 6, name: "Flexão com Palma", videoId: "2jZFsQS8Fhw" },
    { id: 7, name: "Flexão Hindu", videoId: "HJ3XvJcNqDs" },
    { id: 8, name: "Flexão Pike", videoId: "sposDXWEB0A" },
    { id: 9, name: "Flexão com Palmas", videoId: "Z1IH1xXgEBU" },
    { id: 10, name: "Dips", videoId: "2z8JmcrW-As" }
  ],
  legs: [
    { id: 1, name: "Agachamento", videoId: "aclHkVaku9U" },
    { id: 2, name: "Afundo", videoId: "QE_hU8XX48I" },
    { id: 3, name: "Pistol Squat", videoId: "vq5-vdXdxQU" },
    { id: 4, name: "Jump Squat", videoId: "Azl5tkCzDcc" },
    { id: 5, name: "Bulgarian Split Squat", videoId: "2C-uNgKwPLE" },
    { id: 6, name: "Burpee", videoId: "TU8QYVW0gDU" },
    { id: 7, name: "Agachamento Sumô", videoId: "Z1IH1xXgEBU" },
    { id: 8, name: "Saltos", videoId: "Z1IH1xXgEBU" },
    { id: 9, name: "Elevação de Panturrilha", videoId: "Z1IH1xXgEBU" },
    { id: 10, name: "Wall Sit", videoId: "Z1IH1xXgEBU" }
  ],
  back: [
    { id: 1, name: "Barra Fixa", videoId: "eGo4IYlbE5g" },
    { id: 2, name: "Australian Pull-ups", videoId: "FnWrvWej8iw" },
    { id: 3, name: "Remada Invertida", videoId: "mvBTGx5zu5I" },
    { id: 4, name: "Superman", videoId: "z6PJMT2y8GQ" },
    { id: 5, name: "Muscle Up", videoId: "2q8KMnWUv98" },
    { id: 6, name: "Archer Pull-ups", videoId: "Z1IH1xXgEBU" },
    { id: 7, name: "L-sit Pull-ups", videoId: "Z1IH1xXgEBU" },
    { id: 8, name: "Wide Pull-ups", videoId: "Z1IH1xXgEBU" },
    { id: 9, name: "Close Grip Pull-ups", videoId: "Z1IH1xXgEBU" },
    { id: 10, name: "Scapular Pull-ups", videoId: "Z1IH1xXgEBU" }
  ],
  abs: [
    { id: 1, name: "Prancha", videoId: "ASdvN_XEl_c" },
    { id: 2, name: "Hollow Hold", videoId: "4xRpGgttca8" },
    { id: 3, name: "L-sit", videoId: "gc0-uVMGCSM" },
    { id: 4, name: "Dragon Flag", videoId: "pvz7k5jcYyM" },
    { id: 5, name: "Windshield Wipers", videoId: "x0Lsp_6V47E" },
    { id: 6, name: "Leg Raises", videoId: "Z1IH1xXgEBU" },
    { id: 7, name: "Russian Twist", videoId: "Z1IH1xXgEBU" },
    { id: 8, name: "V-ups", videoId: "Z1IH1xXgEBU" },
    { id: 9, name: "Mountain Climbers", videoId: "Z1IH1xXgEBU" },
    { id: 10, name: "Bicycle Crunches", videoId: "Z1IH1xXgEBU" }
  ]
};

const CalisteniaApp = () => {
  const [activeTab, setActiveTab] = useState('chest');
  const [showTimer, setShowTimer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [view, setView] = useState('exercises'); // 'exercises' or 'videos'
  const [completedExercises, setCompletedExercises] = useState({});

  useEffect(() => {
    let timer;
    if (showTimer && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setShowTimer(false);
      setTimeLeft(30);
    }
    return () => clearInterval(timer);
  }, [showTimer, timeLeft]);

  const handleExerciseComplete = (exerciseId) => {
    const currentCount = completedExercises[exerciseId] || 0;
    if (currentCount < 3) {
      setCompletedExercises({
        ...completedExercises,
        [exerciseId]: currentCount + 1
      });
      setShowTimer(true);
      setTimeLeft(30);
    }
  };

  const ExerciseCard = ({ exercise }) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">{exercise.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            {[1, 2, 3].map((set) => (
              <div key={set} className="flex items-center space-x-2">
                <Checkbox
                  checked={completedExercises[exercise.id] >= set}
                  onCheckedChange={() => handleExerciseComplete(exercise.id)}
                />
                <span>Série {set} - 12 repetições</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const VideoView = ({ exercises }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {exercises.map((exercise) => (
        <Card key={exercise.id} className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">{exercise.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${exercise.videoId}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-4">
        <Button
          variant={view === 'exercises' ? 'default' : 'outline'}
          onClick={() => setView('exercises')}
        >
          <ListTodo className="w-4 h-4 mr-2" />
          Exercícios
        </Button>
        <Button
          variant={view === 'videos' ? 'default' : 'outline'}
          onClick={() => setView('videos')}
        >
          <Video className="w-4 h-4 mr-2" />
          Vídeos
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chest">Peito</TabsTrigger>
          <TabsTrigger value="legs">Pernas</TabsTrigger>
          <TabsTrigger value="back">Costas</TabsTrigger>
          <TabsTrigger value="abs">Abdômen</TabsTrigger>
        </TabsList>

        {Object.entries(exerciseData).map(([muscle, exercises]) => (
          <TabsContent key={muscle} value={muscle}>
            {view === 'exercises' ? (
              <div className="space-y-4">
                {exercises.map((exercise) => (
                  <ExerciseCard key={exercise.id} exercise={exercise} />
                ))}
              </div>
            ) : (
              <VideoView exercises={exercises} />
            )}
          </TabsContent>
        ))}
      </Tabs>

      <AlertDialog open={showTimer}>
        <AlertDialogContent>
          <AlertDialogTitle className="text-center">
            <div className="flex items-center justify-center space-x-2">
              <Timer className="w-6 h-6" />
              <span>Tempo de Descanso: {timeLeft}s</span>
            </div>
          </AlertDialogTitle>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CalisteniaApp;