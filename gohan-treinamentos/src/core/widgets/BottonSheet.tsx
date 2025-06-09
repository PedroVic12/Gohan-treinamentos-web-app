import React from 'react';
import { Box, Modal, Typography, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface BottomSheetProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const BottomSheet: React.FC<BottomSheetProps> = ({ open, onClose, title, children }) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="bottom-sheet-title"
            aria-describedby="bottom-sheet-description"
        >
            <Box sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                bgcolor: 'background.paper',
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                boxShadow: 24,
                p: 3,
                maxHeight: '70vh',
                overflowY: 'auto',
            }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography id="bottom-sheet-title" variant="h6" component="h2">
                        {title}
                    </Typography>
                    <IconButton onClick={onClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box id="bottom-sheet-description">
                    {children}
                </Box>
                <Box display="flex" justifyContent="flex-end" mt={3}>
                    <Button onClick={onClose} variant="outlined" color="secondary">
                        Cancel
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default BottomSheet;