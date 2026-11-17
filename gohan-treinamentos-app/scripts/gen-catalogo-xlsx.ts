// Gera public/gohan-catalogo.xlsx a partir dos defaults (preserva ids e links).
// Uso: npx tsx scripts/gen-catalogo-xlsx.ts
import * as XLSX from 'xlsx';
import { DEFAULT_WORKOUTS } from '../src/app/pages/calistenia_app/data/defaultWorkouts';
import { DEFAULT_VIDEOS } from '../src/app/pages/calistenia_app/data/defaultVideos';

const ex = Object.entries(DEFAULT_WORKOUTS).flatMap(([category, blocks]) =>
  blocks.flatMap((b) => b.exercises.map((e) => ({ id: e.id, category, treino: e.treino, blockTreino: b.treino, name: e.name, sets: e.sets, reps: e.reps, difficulty: e.difficulty, youtubeUrl: e.youtubeUrl })))
);
const vids = DEFAULT_VIDEOS.map((v) => ({ id: v.id, title: v.title, category: v.category, label: v.label, youtubeUrl: v.youtubeUrl }));
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(ex), 'Exercicios');
XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(vids), 'Videos');
XLSX.writeFile(wb, 'public/gohan-catalogo.xlsx');
console.log(ex.length, 'exercicios;', vids.length, 'videos');
