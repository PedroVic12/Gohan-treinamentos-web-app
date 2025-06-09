import React, { createContext, useContext, ReactNode, useMemo, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';
import { lightTheme } from '../themes/lightTheme';
import { darkTheme } from '../themes/darkTheme';

type ThemeMode = 'light' | 'dark';

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

interface DarkModeProviderProps {
    children: ReactNode;
}

export const DarkModeProvider = ({ children }: DarkModeProviderProps) => {
    const [themeMode, setThemeMode] = useState<ThemeMode>('light');

    const theme = useMemo(() => {
        return deepmerge(
            themeMode === 'light' ? lightTheme : darkTheme,
            {}
        );
    }, [themeMode]);

    return (
        <DarkModeContext.Provider value={{ themeMode, setThemeMode }}>
            <ThemeProvider theme={theme}>
                {children}
            </ThemeProvider>
        </DarkModeContext.Provider>
    );
};