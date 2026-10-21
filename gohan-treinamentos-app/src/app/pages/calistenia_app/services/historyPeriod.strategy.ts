import type { HistoryFilter, WorkoutHistoryEntry } from '../types/workout.types';

export type PeriodBucket = { label: string; completed: number };

export function filterHistoryByPeriod(
  history: WorkoutHistoryEntry[],
  filter: HistoryFilter,
  now = new Date()
): WorkoutHistoryEntry[] {
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfToday);
  const dayOfWeek = startOfWeek.getDay();
  startOfWeek.setDate(startOfWeek.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const filterStart = filter === 'day' ? startOfToday : filter === 'week' ? startOfWeek : startOfMonth;
  return history.filter((entry) => new Date(entry.date) >= filterStart);
}

export function buildPeriodBuckets(
  filteredHistory: WorkoutHistoryEntry[],
  filter: HistoryFilter,
  now = new Date()
): PeriodBucket[] {
  const periodLabels =
    filter === 'day'
      ? Array.from({ length: 24 }, (_, hour) => `${hour}h`)
      : filter === 'week'
        ? ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
        : Array.from({ length: now.getDate() }, (_, day) => `${day + 1}`);

  return periodLabels.map((label, index) => {
    const completed = filteredHistory.filter((entry) => {
      const date = new Date(entry.date);
      if (filter === 'day') return date.getHours() === index;
      if (filter === 'week') {
        const day = date.getDay() === 0 ? 6 : date.getDay() - 1;
        return day === index;
      }
      return date.getDate() === index + 1;
    }).length;
    return { label, completed };
  });
}
