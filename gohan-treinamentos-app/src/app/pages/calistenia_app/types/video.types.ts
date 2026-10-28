export type VideoCategory = 'push' | 'pull' | 'legs' | 'abs' | 'mobility' | 'hiit' | 'tips';

export type WorkoutVideo = {
  id: string;
  title: string;
  youtubeUrl: string;
  category: VideoCategory;
  label: string;
  durationSec?: number;
};

export const VIDEO_CATEGORY_LABELS: Record<VideoCategory, string> = {
  push: 'Push / Peito',
  pull: 'Pull / Costas',
  legs: 'Legs / Pernas',
  abs: 'Abs / Core',
  mobility: 'Mobilidade',
  hiit: 'HIIT',
  tips: 'Dicas',
};
