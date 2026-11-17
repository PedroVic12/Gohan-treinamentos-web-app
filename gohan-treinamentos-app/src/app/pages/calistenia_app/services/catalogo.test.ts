import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { importExcelFile, readLocalSnapshot } from './spreadsheet.service';
import { DEFAULT_WORKOUTS } from '../data/defaultWorkouts';
import { DEFAULT_VIDEOS } from '../data/defaultVideos';

describe('public/gohan-catalogo.xlsx', () => {
  beforeEach(() => localStorage.clear());

  it('importa e preserva todos os ids e links', async () => {
    const buf = readFileSync('public/gohan-catalogo.xlsx');
    const file = new File([buf], 'gohan-catalogo.xlsx');
    (file as any).arrayBuffer = async () => buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    const r = await importExcelFile(file, 'replace');
    expect(r.ok).toBe(true);
    const snap = readLocalSnapshot();
    const exs = Object.values(snap.workouts).flatMap((bs) => bs.flatMap((b) => b.exercises));
    const defs = Object.values(DEFAULT_WORKOUTS).flatMap((bs) => bs.flatMap((b) => b.exercises));
    for (const d of defs) {
      expect(exs.find((e) => e.id === d.id)?.youtubeUrl).toBe(d.youtubeUrl);
    }
    for (const v of DEFAULT_VIDEOS) {
      expect(snap.videos.find((x) => x.id === v.id)?.youtubeUrl).toBe(v.youtubeUrl);
    }
  });
});
