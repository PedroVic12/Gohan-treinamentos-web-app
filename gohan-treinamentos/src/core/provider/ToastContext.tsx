import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { Snackbar, Alert as MuiAlert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ToastMessage {
    id: number;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
    action?: ReactNode;
}

interface ToastContextType {
    addToast: (message: string, severity: ToastMessage['severity'], action?: ReactNode) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const [currentToast, setCurrentToast] = useState<ToastMessage | null>(null);
    const [open, setOpen] = useState(false);

    const addToast = (message: string, severity: ToastMessage['severity'], action?: ReactNode) => {
        const newToast: ToastMessage = { id: Date.now(), message, severity, action };
        setToasts((prevToasts) => [...prevToasts, newToast]);
    };

    useEffect(() => {
        if (toasts.length > 0 && !currentToast) {
            setCurrentToast(toasts[0]);
            setToasts((prev) => prev.slice(1));
            setOpen(true);
        } else if (toasts.length === 0 && open) {
            // If queue is empty but snackbar is open, let it close naturally
        }
    }, [toasts, currentToast, open]);

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleExited = () => {
        setCurrentToast(null);
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            {currentToast && (
                <Snackbar
                    open={open}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    TransitionProps={{ onExited: handleExited }}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <MuiAlert
                        elevation={6}
                        variant="filled"
                        severity={currentToast.severity}
                        onClose={handleClose}
                        action={
                            <>
                                {currentToast.action}
                                <IconButton
                                    size="small"
                                    aria-label="close"
                                    color="inherit"
                                    onClick={handleClose}
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </>
                        }
                        sx={{ width: '100%' }}
                    >
                        {currentToast.message}
                    </MuiAlert>
                </Snackbar>
            )}
        </ToastContext.Provider>
    );
};