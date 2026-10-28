import * as XLSX from 'xlsx';
import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const dir = dirname(fileURLToPath(import.meta.url));
const wb = XLSX.utils.book_new();

XLSX.utils.book_append_sheet(
  wb,
  XLSX.utils.json_to_sheet([
    { category: 'push', treino: 'Excel Push A', name: 'Flexão Militar', sets: 4, reps: '12', difficulty: 'Normal', youtubeUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4' },
    { category: 'pull', treino: 'Excel Pull A', name: 'Barra Pronada', sets: 4, reps: '8', difficulty: 'Sayajin', youtubeUrl: 'https://www.youtube.com/watch?v=poyr8KenUfc' },
  ]),
  'Exercicios'
);

XLSX.utils.book_append_sheet(
  wb,
  XLSX.utils.json_to_sheet([
    { checklistName: 'Full Body Excel', item: 'Burpee 3x10' },
    { checklistName: 'Full Body Excel', item: 'Mountain Climber 3x20' },
  ]),
  'Fichas'
);

XLSX.utils.book_append_sheet(
  wb,
  XLSX.utils.json_to_sheet([
    { title: 'Demo Reel Push', category: 'push', label: 'Excel', youtubeUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4' },
    { title: 'Demo Reel Legs', category: 'legs', label: 'Excel', youtubeUrl: 'https://www.youtube.com/watch?v=qLPrPVz4NzQ' },
  ]),
  'Videos'
);

const out = join(dir, '..', 'public', 'amostra-treinos-gohan.xlsx');
XLSX.writeFile(wb, out);
console.log('wrote', out);
