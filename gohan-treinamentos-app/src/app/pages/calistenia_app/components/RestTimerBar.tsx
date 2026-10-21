import React from 'react';
import { Box, Card, CardContent, IconButton, Typography } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RefreshIcon from '@mui/icons-material/Refresh';

type Props = {
  timerTime: number;
  timerActive: boolean;
  onToggle: () => void;
  onReset: () => void;
};

export const RestTimerBar: React.FC<Props> = ({ timerTime, timerActive, onToggle, onReset }) => (
  <Card
    sx={{
      borderRadius: 3,
      mb: 2,
      border: '1px solid',
      borderColor: 'divider',
      position: 'sticky',
      top: 0,
      zIndex: 2,
      bgcolor: 'background.paper',
    }}
  >
    <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: '12px !important' }}>
      <Box>
        <Typography variant="subtitle2" color="text.secondary">
          ⏱️ Descanso
        </Typography>
        <Typography variant="h5" fontWeight="black" color="warning.main">
          {Math.floor(timerTime / 60)}:{(timerTime % 60).toString().padStart(2, '0')}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton color="primary" onClick={onToggle} sx={{ minWidth: 44, minHeight: 44 }}>
          {timerActive ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>
        <IconButton color="error" onClick={onReset} sx={{ minWidth: 44, minHeight: 44 }}>
          <RefreshIcon />
        </IconButton>
      </Box>
    </CardContent>
  </Card>
);
