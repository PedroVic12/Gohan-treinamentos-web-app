import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';

const ProgressBar = ({ totalCount, maxCount }) => {
    const progress = (totalCount / maxCount) * 100;

    return (
        <Box sx={{ my: 4 }}>
            <Typography variant="body2" color="textSecondary" gutterBottom>
                Weekly Progress: {totalCount}/{maxCount}
            </Typography>
            <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                        backgroundColor: '#1976d2',
                    }
                }}
            />
        </Box>
    );
};

export default ProgressBar;