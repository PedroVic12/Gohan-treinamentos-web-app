import * as XLSX from 'xlsx';
import type { CustomChecklist, Exercise, WorkoutCatalog, WorkoutHistoryEntry } from '../types/workout.types';
import type { WorkoutVideo } from '../types/video.types';

const STORAGE_KEYS = [
  'gohan_workouts_custom',
  'gohan_checked_sets',
  'gohan_custom_checklists',
  'gohan_custom_completed',
  'gohan_workout_history',
  'gohan_video_library',
] as const;

export type GohanSnapshot = {
  exportedAt: string;
  workouts: WorkoutCatalog;
  checklists: CustomChecklist[];
  checkedSets: Record<string, boolean[]>;
  completedItems: Record<string, boolean>;
  history: WorkoutHistoryEntry[];
  videos: WorkoutVideo[];
};

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function readLocalSnapshot(): GohanSnapshot {
  const parse = <T,>(key: string, fallback: T): T => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  };

  return {
    exportedAt: new Date().toISOString(),
    workouts: parse('gohan_workouts_custom', {}),
    checklists: parse('gohan_custom_checklists', []),
    checkedSets: parse('gohan_checked_sets', {}),
    completedItems: parse('gohan_custom_completed', {}),
    history: parse('gohan_workout_history', []),
    videos: parse('gohan_video_library', []),
  };
}

export function applySnapshot(snapshot: Partial<GohanSnapshot>, mode: 'replace' | 'merge' = 'replace') {
  if (snapshot.workouts) {
    if (mode === 'merge') {
      const current = readLocalSnapshot().workouts;
      const merged: WorkoutCatalog = { ...current };
      for (const [cat, blocks] of Object.entries(snapshot.workouts)) {
        merged[cat] = [...(merged[cat] || []), ...blocks];
      }
      localStorage.setItem('gohan_workouts_custom', JSON.stringify(merged));
    } else {
      localStorage.setItem('gohan_workouts_custom', JSON.stringify(snapshot.workouts));
    }
  }
  if (snapshot.checklists) {
    if (mode === 'merge') {
      const current = readLocalSnapshot().checklists;
      localStorage.setItem('gohan_custom_checklists', JSON.stringify([...current, ...snapshot.checklists]));
    } else {
      localStorage.setItem('gohan_custom_checklists', JSON.stringify(snapshot.checklists));
    }
  }
  if (snapshot.checkedSets) localStorage.setItem('gohan_checked_sets', JSON.stringify(snapshot.checkedSets));
  if (snapshot.completedItems) localStorage.setItem('gohan_custom_completed', JSON.stringify(snapshot.completedItems));
  if (snapshot.history) localStorage.setItem('gohan_workout_history', JSON.stringify(snapshot.history));
  if (snapshot.videos) {
    if (mode === 'merge') {
      const current = readLocalSnapshot().videos;
      const byId = new Map(current.map((v) => [v.id, v]));
      for (const v of snapshot.videos) byId.set(v.id, v);
      localStorage.setItem('gohan_video_library', JSON.stringify([...byId.values()]));
    } else {
      localStorage.setItem('gohan_video_library', JSON.stringify(snapshot.videos));
    }
  }
}

export function exportJsonBackup() {
  const snap = readLocalSnapshot();
  downloadBlob(new Blob([JSON.stringify(snap, null, 2)], { type: 'application/json' }), `gohan-backup-${snap.exportedAt.slice(0, 10)}.json`);
}

export function exportExcelWorkbook() {
  const snap = readLocalSnapshot();
  const wb = XLSX.utils.book_new();

  const exerciseRows: Array<Record<string, string | number>> = [];
  for (const [category, blocks] of Object.entries(snap.workouts)) {
    for (const block of blocks) {
      for (const ex of block.exercises) {
        exerciseRows.push({
          category,
          treino: block.treino,
          id: ex.id,
          name: ex.name,
          sets: ex.sets,
          reps: ex.reps,
          difficulty: ex.difficulty,
          youtubeUrl: ex.youtubeUrl,
        });
      }
    }
  }
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(exerciseRows.length ? exerciseRows : [{ category: '', treino: '', id: '', name: '', sets: 0, reps: '', difficulty: '', youtubeUrl: '' }]), 'Exercicios');

  const checklistRows = snap.checklists.flatMap((c) =>
    c.items.map((item, idx) => ({ checklistId: c.id, checklistName: c.name, itemIndex: idx + 1, item }))
  );
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(checklistRows.length ? checklistRows : [{ checklistId: '', checklistName: '', itemIndex: 1, item: '' }]), 'Fichas');

  const videoRows = snap.videos.map((v) => ({
    id: v.id,
    title: v.title,
    category: v.category,
    label: v.label,
    youtubeUrl: v.youtubeUrl,
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(videoRows.length ? videoRows : [{ id: '', title: '', category: '', label: '', youtubeUrl: '' }]), 'Videos');

  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(
      snap.history.length
        ? snap.history.map((h) => ({ id: h.id, date: h.date, label: h.label, category: h.category, source: h.source }))
        : [{ id: '', date: '', label: '', category: '', source: '' }]
    ),
    'Historico'
  );

  XLSX.writeFile(wb, `gohan-treinos-${snap.exportedAt.slice(0, 10)}.xlsx`);
}

export function exportPdfPrintable() {
  const snap = readLocalSnapshot();
  const sections: string[] = [];
  sections.push(`<h1>Gohan Treinos — ${snap.exportedAt.slice(0, 10)}</h1>`);

  for (const [category, blocks] of Object.entries(snap.workouts)) {
    sections.push(`<h2>${category.toUpperCase()}</h2>`);
    for (const block of blocks) {
      sections.push(`<h3>${block.treino}</h3><ul>`);
      for (const ex of block.exercises) {
        sections.push(`<li><b>${ex.name}</b> — ${ex.sets}x${ex.reps} (${ex.difficulty}) ${ex.youtubeUrl ? `· <a href="${ex.youtubeUrl}">vídeo</a>` : ''}</li>`);
      }
      sections.push('</ul>');
    }
  }

  if (snap.checklists.length) {
    sections.push('<h2>Fichas</h2>');
    for (const c of snap.checklists) {
      sections.push(`<h3>${c.name}</h3><ol>`);
      for (const item of c.items) sections.push(`<li>${item}</li>`);
      sections.push('</ol>');
    }
  }

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Gohan Treinos</title>
    <style>body{font-family:system-ui,sans-serif;padding:24px;max-width:800px;margin:auto} h1{color:#1976d2} @media print{button{display:none}}</style>
    </head><body>${sections.join('\n')}
    <button onclick="window.print()">Salvar / Imprimir PDF</button>
    <script>setTimeout(()=>window.print(),400)</script>
    </body></html>`;

  const w = window.open('', '_blank');
  if (w) {
    w.document.write(html);
    w.document.close();
  }
}

function normHeader(h: unknown): string {
  return String(h ?? '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

function sheetToObjects(sheet: XLSX.WorkSheet): Record<string, unknown>[] {
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });
  return rows.map((row) => {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(row)) out[normHeader(k)] = v;
    return out;
  });
}

function slug(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 40);
}

/** Aceita planilhas com abas Exercicios / Fichas / Videos (ou nomes próximos). */
export async function importExcelFile(file: File, mode: 'replace' | 'merge' = 'merge'): Promise<{ ok: true; summary: string } | { ok: false; error: string }> {
  try {
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: 'array' });
    const snap: Partial<GohanSnapshot> = {};

    const findSheet = (...names: string[]) => {
      const keys = wb.SheetNames;
      for (const want of names) {
        const hit = keys.find((n) => normHeader(n).includes(want));
        if (hit) return wb.Sheets[hit];
      }
      return undefined;
    };

    const exSheet = findSheet('exercicio', 'treino', 'rotina', 'workout');
    if (exSheet) {
      const rows = sheetToObjects(exSheet);
      const catalog: WorkoutCatalog = {};
      for (const row of rows) {
        const category = String(row.category || row.categoria || 'push').toLowerCase().trim() || 'push';
        const treino = String(row.treino || row.workout || row.ficha || 'Treino Importado').trim();
        const name = String(row.name || row.nome || row.exercicio || '').trim();
        if (!name) continue;
        const exercise: Exercise = {
          id: String(row.id || `${slug(category)}-${slug(treino)}-${slug(name)}`),
          treino,
          name,
          sets: Number(row.sets || row.series || 3) || 3,
          reps: String(row.reps || row.repeticoes || '10'),
          difficulty: String(row.difficulty || row.dificuldade || 'Normal'),
          youtubeUrl: String(row.youtubeurl || row.youtube || row.url || ''),
        };
        if (!catalog[category]) catalog[category] = [];
        let block = catalog[category].find((b) => b.treino === treino);
        if (!block) {
          block = { treino, exercises: [] };
          catalog[category].push(block);
        }
        (block.exercises as Exercise[]).push(exercise);
      }
      if (Object.keys(catalog).length) snap.workouts = catalog;
    }

    const fichasSheet = findSheet('ficha', 'checklist', 'lista');
    if (fichasSheet) {
      const rows = sheetToObjects(fichasSheet);
      const map = new Map<string, CustomChecklist>();
      for (const row of rows) {
        const name = String(row.checklistname || row.nome || row.ficha || 'Ficha').trim();
        const id = String(row.checklistid || row.id || slug(name) || Date.now().toString());
        const item = String(row.item || row.exercicio || row.name || '').trim();
        if (!item) continue;
        if (!map.has(id)) map.set(id, { id, name, items: [] });
        map.get(id)!.items.push(item);
      }
      if (map.size) snap.checklists = [...map.values()];
    }

    const videoSheet = findSheet('video', 'reel', 'media');
    if (videoSheet) {
      const rows = sheetToObjects(videoSheet);
      const videos: WorkoutVideo[] = [];
      for (const row of rows) {
        const title = String(row.title || row.titulo || row.name || '').trim();
        const youtubeUrl = String(row.youtubeurl || row.youtube || row.url || '').trim();
        if (!title || !youtubeUrl) continue;
        videos.push({
          id: String(row.id || `v-${slug(title)}`),
          title,
          youtubeUrl,
          category: (String(row.category || row.categoria || 'tips').toLowerCase() as WorkoutVideo['category']) || 'tips',
          label: String(row.label || row.etiqueta || row.tag || 'Geral'),
        });
      }
      if (videos.length) snap.videos = videos;
    }

    // Planilha única genérica (primeira aba) se nenhuma aba nomeada bateu
    if (!snap.workouts && !snap.checklists && !snap.videos && wb.SheetNames[0]) {
      const rows = sheetToObjects(wb.Sheets[wb.SheetNames[0]]);
      const catalog: WorkoutCatalog = {};
      for (const row of rows) {
        const name = String(row.name || row.nome || row.exercicio || '').trim();
        if (!name) continue;
        const category = String(row.category || row.categoria || 'push').toLowerCase() || 'push';
        const treino = String(row.treino || 'Importado').trim();
        const exercise: Exercise = {
          id: String(row.id || `${slug(category)}-${slug(name)}`),
          treino,
          name,
          sets: Number(row.sets || row.series || 3) || 3,
          reps: String(row.reps || '10'),
          difficulty: String(row.difficulty || row.dificuldade || 'Normal'),
          youtubeUrl: String(row.youtubeurl || row.url || ''),
        };
        if (!catalog[category]) catalog[category] = [];
        let block = catalog[category].find((b) => b.treino === treino);
        if (!block) {
          block = { treino, exercises: [] };
          catalog[category].push(block);
        }
        (block.exercises as Exercise[]).push(exercise);
      }
      if (Object.keys(catalog).length) snap.workouts = catalog;
    }

    if (!snap.workouts && !snap.checklists && !snap.videos) {
      return { ok: false, error: 'Nenhuma aba válida encontrada. Use colunas: category, treino, name, sets, reps, youtubeUrl' };
    }

    applySnapshot(snap, mode);
    const parts = [
      snap.workouts ? `${Object.values(snap.workouts).reduce((n, b) => n + b.reduce((m, x) => m + x.exercises.length, 0), 0)} exercícios` : null,
      snap.checklists ? `${snap.checklists.length} fichas` : null,
      snap.videos ? `${snap.videos.length} vídeos` : null,
    ].filter(Boolean);
    return { ok: true, summary: `Importado (${mode}): ${parts.join(', ')}` };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Falha ao ler Excel' };
  }
}

export async function importJsonBackup(file: File): Promise<{ ok: true; summary: string } | { ok: false; error: string }> {
  try {
    const text = await file.text();
    const snap = JSON.parse(text) as Partial<GohanSnapshot>;
    applySnapshot(snap, 'replace');
    return { ok: true, summary: 'Backup JSON aplicado (replace)' };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'JSON inválido' };
  }
}

export function clearAllGohanData() {
  for (const k of STORAGE_KEYS) localStorage.removeItem(k);
}
