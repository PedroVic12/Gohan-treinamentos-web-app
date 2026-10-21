export type CategoryId = 'push' | 'pull' | 'legs' | 'abs';

export type Exercise = {
  readonly id: string;
  readonly treino: string;
  readonly name: string;
  readonly sets: number;
  readonly reps: string;
  readonly difficulty: string;
  readonly youtubeUrl: string;
};

export type WorkoutBlock = {
  readonly treino: string;
  readonly exercises: Exercise[];
};

export type WorkoutCatalog = Record<string, WorkoutBlock[]>;

export type WorkoutHistoryEntry = {
  id: string;
  date: string;
  label: string;
  category: string;
  source: 'routine' | 'checklist';
};

export type HistoryFilter = 'day' | 'week' | 'month';

export type CustomChecklist = {
  id: string;
  name: string;
  items: string[];
};
