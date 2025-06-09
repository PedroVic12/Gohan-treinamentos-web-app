import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { Snackbar, Alert as MuiAlert } from '@mui/material';

interface ToastMessage {
    id: number;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
}

interface ToastContextType {
    addToast: (message: string, severity: ToastMessage['severity']) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const [currentToast, setCurrentToast] = useState<ToastMessage | null>(null);
    const [open, setOpen] = useState(false);

    const addToast = (message: string, severity: ToastMessage['severity']) => {
        setToasts((prev) => [...prev, { id: Date.now(), message, severity }]);
    };

    useEffect(() => {
        if (toasts.length > 0 && !currentToast) {
            setCurrentToast(toasts[0]);
            setToasts((prev) => prev.slice(1));
            setOpen(true);
        }
    }, [toasts, currentToast]);

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
                    <MuiAlert elevation={6} variant="filled" severity={currentToast.severity} onClose={handleClose} sx={{ width: '100%' }}>
                        {currentToast.message}
                    </MuiAlert>
                </Snackbar>
            )}
        </ToastContext.Provider>
    );
};
