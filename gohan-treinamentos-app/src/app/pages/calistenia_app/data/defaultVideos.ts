import type { WorkoutVideo } from '../types/video.types';

export const DEFAULT_VIDEOS: WorkoutVideo[] = [
  { id: 'v-push-flexao', title: 'Push ups (Flexão)', youtubeUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4', category: 'push', label: 'Básico' },
  { id: 'v-push-inclinada', title: 'Flexão Inclinada', youtubeUrl: 'https://www.youtube.com/watch?v=IYLxm0T6qls', category: 'push', label: 'Iniciante' },
  { id: 'v-pull-barra', title: 'Pull ups (Barra Fixa)', youtubeUrl: 'https://www.youtube.com/watch?v=poyr8KenUfc', category: 'pull', label: 'Básico' },
  { id: 'v-legs-squat', title: 'Squats (Agachamento)', youtubeUrl: 'https://www.youtube.com/watch?v=qLPrPVz4NzQ', category: 'legs', label: 'Básico' },
  { id: 'v-abs-infra', title: 'Abdominal Infra', youtubeUrl: 'https://www.youtube.com/watch?v=TIMghHu6QFU', category: 'abs', label: 'Core' },
  { id: 'v-abs-plank', title: 'Plank (Prancha)', youtubeUrl: 'https://www.youtube.com/watch?v=xRXhpMsLaXo', category: 'abs', label: 'Isometria' },
  { id: 'v-mob-1', title: 'Mobilidade de Ombros', youtubeUrl: 'https://www.youtube.com/watch?v=2L2lnxIcNmo', category: 'mobility', label: 'Warm-up' },
  { id: 'v-hiit-1', title: 'HIIT 10 min Bodyweight', youtubeUrl: 'https://www.youtube.com/watch?v=ml6cT4AZdqI', category: 'hiit', label: 'Cardio' },
  { id: 'v-tips-1', title: 'Progressão Calistenia', youtubeUrl: 'https://www.youtube.com/watch?v=tQ0yjYUFKBP', category: 'tips', label: 'Técnica' },
];

export function loadVideoLibrary(): WorkoutVideo[] {
  try {
    const raw = localStorage.getItem('gohan_video_library');
    if (!raw) return structuredClone(DEFAULT_VIDEOS);
    const parsed = JSON.parse(raw) as WorkoutVideo[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : structuredClone(DEFAULT_VIDEOS);
  } catch {
    return structuredClone(DEFAULT_VIDEOS);
  }
}
