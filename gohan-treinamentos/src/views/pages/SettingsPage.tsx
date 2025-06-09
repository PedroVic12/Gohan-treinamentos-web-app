import React, { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText, Switch, Divider } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LanguageIcon from '@mui/icons-material/Language';
import { useToast } from '../../core/provider/ToastContext';
import { useDarkMode } from '../../core/provider/DarkModeProvider';

const SettingsPage: React.FC = () => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const { addToast } = useToast();
    const { setThemeMode, themeMode } = useDarkMode();

    const handleNotificationToggle = () => {
        setNotificationsEnabled(!notificationsEnabled);
        addToast(`Notificações ${!notificationsEnabled ? 'ativadas' : 'desativadas'}.`, 'info');
    };

    const handleDarkModeToggle = () => {
        const newMode = themeMode === 'dark' ? 'light' : 'dark';
        setThemeMode(newMode);
        addToast(`Modo escuro ${newMode === 'dark' ? 'ativado' : 'desativado'}.`, 'info');
    };

    return (
        <Box sx={{ p: 2, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h4" gutterBottom>Settings</Typography>
            <List sx={{ bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
                <ListItem>
                    <ListItemIcon><NotificationsIcon /></ListItemIcon>
                    <ListItemText primary="Enable Notifications" />
                    <Switch edge="end" onChange={handleNotificationToggle} checked={notificationsEnabled} />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                    <ListItemIcon><DarkModeIcon /></ListItemIcon>
                    <ListItemText primary="Dark Mode" />
                    <Switch
                        edge="end"
                        onChange={handleDarkModeToggle}
                        checked={themeMode === 'dark'}
                    />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                    <ListItemIcon><LanguageIcon /></ListItemIcon>
                    <ListItemText primary="Language" secondary="English" />
                </ListItem>
            </List>
        </Box>
    );
};

export default SettingsPage;
