import React, { useMemo, useRef, useState } from 'react';
import { Box, Chip, IconButton, Typography } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import type { WorkoutVideo, VideoCategory } from '../types/video.types';
import { VIDEO_CATEGORY_LABELS } from '../types/video.types';

function extractId(url: string): string | null {
  if (url.includes('v=')) return url.split('v=')[1]?.split('&')[0] ?? null;
  if (url.includes('youtu.be/')) return url.split('youtu.be/')[1]?.split('?')[0] ?? null;
  if (url.includes('embed/')) return url.split('embed/')[1]?.split('?')[0] ?? null;
  return null;
}

type Props = {
  videos: WorkoutVideo[];
};

export const ReelsView: React.FC<Props> = ({ videos }) => {
  const [category, setCategory] = useState<VideoCategory | 'all'>('all');
  const [index, setIndex] = useState(0);
  const touchY = useRef<number | null>(null);

  const filtered = useMemo(() => {
    const list = category === 'all' ? videos : videos.filter((v) => v.category === category);
    return list.length ? list : videos;
  }, [videos, category]);

  const safeIndex = Math.min(index, filtered.length - 1);
  const current = filtered[Math.max(0, safeIndex)];
  const videoId = current ? extractId(current.youtubeUrl) : null;

  const categories = useMemo(() => {
    const set = new Set(videos.map((v) => v.category));
    return ['all' as const, ...Array.from(set)];
  }, [videos]);

  const go = (dir: 1 | -1) => {
    setIndex((i) => {
      const next = i + dir;
      if (next < 0) return filtered.length - 1;
      if (next >= filtered.length) return 0;
      return next;
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, minHeight: '70vh' }}>
      <Typography variant="h6" fontWeight="black" align="center" color="primary">
        Reels
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 0.5, WebkitOverflowScrolling: 'touch' }}>
        {categories.map((c) => (
          <Chip
            key={c}
            label={c === 'all' ? 'Todos' : VIDEO_CATEGORY_LABELS[c as VideoCategory] || c}
            clickable
            color={category === c ? 'primary' : 'default'}
            onClick={() => {
              setCategory(c as VideoCategory | 'all');
              setIndex(0);
            }}
            sx={{ flexShrink: 0, fontWeight: 'bold', minHeight: 36 }}
          />
        ))}
      </Box>

      <Box
        sx={{
          position: 'relative',
          flex: 1,
          minHeight: { xs: '58vh', sm: 480 },
          borderRadius: 3,
          overflow: 'hidden',
          bgcolor: '#000',
          border: '1px solid',
          borderColor: 'divider',
        }}
        onTouchStart={(e) => {
          touchY.current = e.touches[0]?.clientY ?? null;
        }}
        onTouchEnd={(e) => {
          if (touchY.current == null) return;
          const dy = (e.changedTouches[0]?.clientY ?? 0) - touchY.current;
          if (dy < -40) go(1);
          if (dy > 40) go(-1);
          touchY.current = null;
        }}
      >
        {videoId ? (
          <iframe
            key={`${current.id}-${safeIndex}`}
            src={`https://www.youtube.com/embed/${videoId}?playsinline=1&rel=0`}
            title={current.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
          />
        ) : (
          <Box sx={{ height: '100%', display: 'grid', placeItems: 'center', color: '#fff' }}>
            Sem vídeo nesta categoria
          </Box>
        )}

        <Box
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            p: 2,
            background: 'linear-gradient(transparent, rgba(0,0,0,.75))',
            color: '#fff',
            pointerEvents: 'none',
          }}
        >
          <Chip size="small" label={current?.label || ''} sx={{ mb: 0.5, bgcolor: 'primary.main', color: '#fff', fontWeight: 'bold' }} />
          <Typography fontWeight="bold">{current?.title}</Typography>
          <Typography variant="caption" sx={{ opacity: 0.85 }}>
            {current ? VIDEO_CATEGORY_LABELS[current.category] : ''} · {safeIndex + 1}/{filtered.length} · deslize ↑↓
          </Typography>
        </Box>

        <Box sx={{ position: 'absolute', right: 8, top: '40%', display: 'flex', flexDirection: 'column', gap: 1 }}>
          <IconButton onClick={() => go(-1)} sx={{ bgcolor: 'rgba(0,0,0,.45)', color: '#fff', minWidth: 44, minHeight: 44 }}>
            <KeyboardArrowUpIcon />
          </IconButton>
          <IconButton onClick={() => go(1)} sx={{ bgcolor: 'rgba(0,0,0,.45)', color: '#fff', minWidth: 44, minHeight: 44 }}>
            <KeyboardArrowDownIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};
