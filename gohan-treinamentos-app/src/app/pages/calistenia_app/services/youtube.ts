/**
 * Extrai o ID de um vídeo do YouTube de qualquer formato comum de link.
 * Aceita: watch?v=, youtu.be/, embed/, shorts/, live/ e o ID puro (11 chars).
 */
const BARE_ID = /^[A-Za-z0-9_-]{11}$/;

export function extractYouTubeId(input: string): string | null {
  const url = input.trim();
  if (!url) return null;
  if (BARE_ID.test(url)) return url;

  const patterns = [
    /[?&]v=([A-Za-z0-9_-]{11})/,
    /youtu\.be\/([A-Za-z0-9_-]{11})/,
    /\/(?:embed|shorts|live|v)\/([A-Za-z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export const isYouTubeLink = (input: string): boolean => extractYouTubeId(input) !== null;
