import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

function extractVideoId(youtubeUrl: string): string | null {
  if (youtubeUrl.includes('v=')) return youtubeUrl.split('v=')[1]?.split('&')[0] ?? null;
  if (youtubeUrl.includes('youtu.be/')) return youtubeUrl.split('youtu.be/')[1]?.split('?')[0] ?? null;
  if (youtubeUrl.includes('embed/')) return youtubeUrl.split('embed/')[1]?.split('?')[0] ?? null;
  return null;
}

export const YouTubeLazy: React.FC<{ title: string; youtubeUrl: string }> = ({ title, youtubeUrl }) => {
  const [show, setShow] = useState(false);
  const videoId = extractVideoId(youtubeUrl);
  if (!videoId) return null;

  if (!show) {
    return (
      <Button
        variant="outlined"
        size="small"
        startIcon={<PlayArrowIcon />}
        onClick={() => setShow(true)}
        sx={{ mt: 1, minHeight: 44 }}
      >
        Ver vídeo
      </Button>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  return (
    <Box sx={{ position: 'relative', width: '100%', pt: '56.25%', mt: 2, borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
      <iframe
        src={embedUrl}
        title={title}
        frameBorder="0"
        allowFullScreen
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      />
    </Box>
  );
};
