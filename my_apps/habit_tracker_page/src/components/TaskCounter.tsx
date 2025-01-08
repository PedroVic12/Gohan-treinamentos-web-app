import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

interface TaskCounterProps {
  count: number;
  onIncrement: () => void;
}

export const TaskCounter: React.FC<TaskCounterProps> = ({ count, onIncrement }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Typography variant="body2">
        {count}/7
      </Typography>
      <IconButton 
        edge="end" 
        onClick={onIncrement}
        disabled={count >= 7}
      >
        <AddIcon />
      </IconButton>
    </Box>
  );
};