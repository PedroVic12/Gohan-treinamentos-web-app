/** Guarda metadados e o arquivo bruto da última planilha Excel carregada. */
export type LastExcelMeta = Readonly<{ name: string; loadedAt: string; size: number }>;

const META_KEY = 'gohan_last_excel_meta';
const DATA_KEY = 'gohan_last_excel_b64';

function toBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(bin);
}

export function getLastExcelMeta(): LastExcelMeta | null {
  try {
    const raw = localStorage.getItem(META_KEY);
    return raw ? (JSON.parse(raw) as LastExcelMeta) : null;
  } catch {
    return null;
  }
}

export async function saveLastExcel(file: File): Promise<void> {
  const meta: LastExcelMeta = { name: file.name, loadedAt: new Date().toISOString(), size: file.size };
  try {
    localStorage.setItem(META_KEY, JSON.stringify(meta));
    localStorage.setItem(DATA_KEY, toBase64(await file.arrayBuffer()));
  } catch {
    // Cota estourada: mantém só o nome (os dados já foram aplicados ao catálogo).
    localStorage.removeItem(DATA_KEY);
  }
}

export function clearLastExcel(): void {
  localStorage.removeItem(META_KEY);
  localStorage.removeItem(DATA_KEY);
}
