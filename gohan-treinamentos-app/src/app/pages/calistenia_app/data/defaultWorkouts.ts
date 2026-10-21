import type { Exercise, WorkoutCatalog } from '../types/workout.types';

const ex = (
  id: string,
  treino: string,
  name: string,
  sets: number,
  reps: string,
  difficulty: string,
  youtubeUrl: string
): Exercise => ({ id, treino, name, sets, reps, difficulty, youtubeUrl });

export const DEFAULT_WORKOUTS: WorkoutCatalog = {
  push: [
    {
      treino: 'Push Treino 1',
      exercises: [
        ex('push-1-flexao', 'Push Treino 1', 'Push ups (Flexão)', 5, '10-15', 'Normal', 'https://www.youtube.com/watch?v=IODxDxX7oi4'),
        ex('push-1-inclinada', 'Push Treino 1', 'Flexão Inclinada', 4, '12', 'Fácil', 'https://www.youtube.com/watch?v=IYLxm0T6qls'),
      ],
    },
    {
      treino: '100 Push ups Challenge',
      exercises: [
        ex('push-100-explosiva', '100 Push ups Challenge', 'Flexão Explosiva', 4, '8-10', 'Sayajin', 'https://www.youtube.com/watch?v=IYLxm0T6qls'),
        ex('push-100-diamante', '100 Push ups Challenge', 'Flexão Diamante', 4, '10', 'Normal', 'https://www.youtube.com/watch?v=IYLxm0T6qls'),
      ],
    },
  ],
  pull: [
    {
      treino: 'Pull Treino 1',
      exercises: [
        ex('pull-1-barra', 'Pull Treino 1', 'Pull ups (Barra Fixa)', 4, '8-10', 'Normal', 'https://www.youtube.com/watch?v=poyr8KenUfc'),
        ex('pull-1-chin', 'Pull-up Treino 2', 'Chin ups', 4, '10', 'Normal', 'https://www.youtube.com/watch?v=poyr8KenUfc'),
      ],
    },
  ],
  legs: [
    {
      treino: 'Legs Treino 1',
      exercises: [
        ex('legs-1-squat', 'Legs Treino 1', 'Squats (Agachamento)', 5, '20', 'Normal', 'https://www.youtube.com/watch?v=qLPrPVz4NzQ'),
        ex('legs-2-lunge', 'Legs Treino 2', 'Lunges (Passada)', 4, '15 (cada perna)', 'Normal', 'https://www.youtube.com/watch?v=qLPrPVz4NzQ'),
      ],
    },
  ],
  abs: [
    {
      treino: 'Abs Treino 1',
      exercises: [
        ex('abs-1-infra', 'Abs Treino 1', 'Abdominal Infra', 4, '15', 'Fácil', 'https://www.youtube.com/watch?v=TIMghHu6QFU'),
        ex('abs-2-plank', 'Abs Treino 2', 'Plank (Prancha)', 3, '1 min', 'Normal', 'https://www.youtube.com/watch?v=xRXhpMsLaXo'),
      ],
    },
  ],
};

/** Mescla treinos salvos com ids estáveis nos exercícios padrão (por nome). */
export function loadWorkoutCatalog(): WorkoutCatalog {
  const saved = localStorage.getItem('gohan_workouts_custom');
  if (!saved) return structuredClone(DEFAULT_WORKOUTS);

  try {
    const parsed = JSON.parse(saved) as WorkoutCatalog;
    const stableByName = new Map<string, string>();
    for (const blocks of Object.values(DEFAULT_WORKOUTS)) {
      for (const block of blocks) {
        for (const exercise of block.exercises) {
          stableByName.set(`${block.treino}::${exercise.name}`, exercise.id);
        }
      }
    }

    const migrated: WorkoutCatalog = {};
    for (const [cat, blocks] of Object.entries(parsed)) {
      migrated[cat] = blocks.map((block) => ({
        ...block,
        exercises: block.exercises.map((e) => ({
          ...e,
          id: stableByName.get(`${block.treino}::${e.name}`) ?? e.id,
        })),
      }));
    }
    return migrated;
  } catch {
    return structuredClone(DEFAULT_WORKOUTS);
  }
}
