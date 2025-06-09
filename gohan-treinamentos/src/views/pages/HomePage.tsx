import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import BottomSheet from '../../core/widgets/BottonSheet';
import { useToast } from '../../core/provider/ToastContext';

const HomePage: React.FC = () => {
    const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
    const { addToast } = useToast();

    const handleOpenBottomSheet = () => setBottomSheetOpen(true);
    const handleCloseBottomSheet = () => setBottomSheetOpen(false);

    const showSuccessToast = () => addToast('Operation successful!', 'success');
    const showErrorToastWithAction = () => {
        addToast('Something went wrong!', 'error', (
            <Button color="inherit" size="small" onClick={() => alert('Retry action clicked!')}>
                RETRY
            </Button>
        ));
    };

    return (
        <Box className="p-4">
            <Typography variant="h4" gutterBottom>Home Page</Typography>
            <Typography paragraph>Welcome to the mobile app template.</Typography>
            <Button variant="contained" onClick={handleOpenBottomSheet} className="mb-4">
                Open Bottom Sheet
            </Button>
            <Box className="space-x-2">
                <Button variant="outlined" color="success" onClick={showSuccessToast}>Show Success Toast</Button>
                <Button variant="outlined" color="error" onClick={showErrorToastWithAction}>Show Error Toast with Action</Button>
            </Box>
            <BottomSheet open={bottomSheetOpen} onClose={handleCloseBottomSheet} title="Example Bottom Sheet">
                <Typography paragraph>This is the bottom sheet content.</Typography>
                <Typography paragraph>It scrolls if needed. Lorem ipsum...</Typography>
                <Button variant="contained" onClick={handleCloseBottomSheet} className="mt-4">Confirm Action</Button>
            </BottomSheet>
        </Box>
    );
};

export default HomePage;