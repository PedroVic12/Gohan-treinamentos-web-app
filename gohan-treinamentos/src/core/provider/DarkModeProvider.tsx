import React, { createContext, useContext, ReactNode, useState, useMemo } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { lightTheme, darkTheme } from '../themes/temas';

type ThemeMode = 'dark' | 'light';

interface DarkModeContextType {
    themeMode: ThemeMode;
    setThemeMode: (mode: ThemeMode) => void;
}

const DarkModeContext = createContext<DarkModeContextType | null>(null);

export const useDarkMode = () => {
    const context = useContext(DarkModeContext);
    if (!context) {
        throw new Error('useDarkMode must be used within a DarkModeProvider');
    }
    return context;
};

export const DarkModeProvider = ({ children }: { children: ReactNode }) => {
    const [themeMode, setThemeMode] = useState<ThemeMode>('light');

    const theme = useMemo(() => (themeMode === 'light' ? lightTheme : darkTheme), [themeMode]);

    return (
        <DarkModeContext.Provider value={{ themeMode, setThemeMode }}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </DarkModeContext.Provider>
    );
};