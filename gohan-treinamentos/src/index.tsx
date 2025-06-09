// index.tsx

import React from 'react';
import { BrowserRouter, Routes, Route, Link, HashRouter } from 'react-router-dom';
import { DarkModeProvider } from './core/provider/DarkModeProvider';
import { SessionProvider } from './core/provider/SessionContext';
import { ToastProvider } from './core/provider/ToastContext';
import MainLayout from './core/layout/MainLayout';
import { Typography, Button } from '@mui/material';
import { Box } from 'lucide-react';


import HomePage from './views/pages/HomePage';
import ProfilePage from './views/pages/ProfilePage';
import SettingsPage from './views/pages/SettingsPage';
import WorkoutPage from './views/pages/WorkoutabContent';
import GohanTreinamentosHomePage from './views/pages/GohanTreinamentosPage';
import AppProdutividade from './views/pages/AppProdutividadePage';
import DashboardProdutividadePage from './views/pages/DashboardProdutividade';


// NotFoundPage
const NotFoundPage: React.FC = () => {
    return (
        <Box className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] p-4 text-center">
            <Typography variant="h1" component="h1" gutterBottom>404</Typography>
            <Typography variant="h5" component="h2" gutterBottom>Page Not Found</Typography>
            <Typography color="text.secondary" paragraph>Sorry, the page does not exist.</Typography>
            <Button variant="contained" component={Link} to="/" className="mt-4">Go to Home</Button>
        </Box>
    );
};

// App

const App: React.FC = () => (
    <DarkModeProvider>
        <SessionProvider>
            <ToastProvider>
                <HashRouter>
                    <MainLayout>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/settings" element={<SettingsPage />} />
                            <Route path="/workout" element={<WorkoutPage />} />
                            <Route path="/home" element={<GohanTreinamentosHomePage />} />
                            <Route path="/app_produtividade" element={<AppProdutividade />} />
                            <Route path="/dashboard" element={<DashboardProdutividadePage />} />
                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </MainLayout>
                </HashRouter>
            </ToastProvider>
        </SessionProvider>
    </DarkModeProvider>
);

export default App;