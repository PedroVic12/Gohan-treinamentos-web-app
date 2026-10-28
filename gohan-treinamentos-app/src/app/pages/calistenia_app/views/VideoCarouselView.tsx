import React, { useMemo, useState } from 'react';
import { Box, Button, Card, CardContent, Chip, Typography } from '@mui/material';
import type { WorkoutVideo, VideoCategory } from '../types/video.types';
import { VIDEO_CATEGORY_LABELS } from '../types/video.types';
import { YouTubeLazy } from '../components/YouTubeLazy';

type Props = {
  videos: WorkoutVideo[];
};

export const VideoCarouselView: React.FC<Props> = ({ videos }) => {
  const groups = useMemo(() => {
    const map = new Map<VideoCategory, WorkoutVideo[]>();
    for (const v of videos) {
      const list = map.get(v.category) || [];
      list.push(v);
      map.set(v.category, list);
    }
    return [...map.entries()];
  }, [videos]);

  const [activeByCat, setActiveByCat] = useState<Record<string, number>>({});

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h6" fontWeight="black" align="center" color="primary">
        Carrossel por categoria
      </Typography>

      {groups.map(([category, list]) => {
        const idx = activeByCat[category] ?? 0;
        const current = list[Math.min(idx, list.length - 1)];
        return (
          <Box key={category}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, gap: 1 }}>
              <Typography fontWeight="bold">{VIDEO_CATEGORY_LABELS[category] || category}</Typography>
              <Chip size="small" label={current?.label || 'Geral'} color="secondary" sx={{ fontWeight: 'bold' }} />
            </Box>

            <Box
              sx={{
                display: 'flex',
                gap: 1,
                overflowX: 'auto',
                pb: 1,
                mb: 1,
                WebkitOverflowScrolling: 'touch',
                scrollSnapType: 'x mandatory',
              }}
            >
              {list.map((v, i) => (
                <Button
                  key={v.id}
                  variant={i === idx ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => setActiveByCat((p) => ({ ...p, [category]: i }))}
                  sx={{
                    flexShrink: 0,
                    minHeight: 40,
                    borderRadius: 3,
                    textTransform: 'none',
                    scrollSnapAlign: 'start',
                    maxWidth: 180,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {v.title}
                </Button>
              ))}
            </Box>

            <Card sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {current?.title}
                </Typography>
                {current && <YouTubeLazy title={current.title} youtubeUrl={current.youtubeUrl} />}
                <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
                  <Button
                    variant="outlined"
                    disabled={idx <= 0}
                    onClick={() => setActiveByCat((p) => ({ ...p, [category]: Math.max(0, idx - 1) }))}
                    sx={{ minHeight: 44, flex: 1 }}
                  >
                    ← Anterior
                  </Button>
                  <Button
                    variant="contained"
                    disabled={idx >= list.length - 1}
                    onClick={() => setActiveByCat((p) => ({ ...p, [category]: Math.min(list.length - 1, idx + 1) }))}
                    sx={{ minHeight: 44, flex: 1 }}
                  >
                    Próximo →
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        );
      })}

      {!groups.length && (
        <Typography align="center" color="text.secondary">
          Nenhum vídeo cadastrado. Importe uma planilha na aba Dados.
        </Typography>
      )}
    </Box>
  );
};
