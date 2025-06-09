import { Typography, List, ListItem, ListItemIcon, ListItemText, Switch, Divider, Button } from "@mui/material";
import { Box } from "lucide-react";
import { useState } from "react";
import { useToast } from "../../core/provider/ToastContext";
import { useDarkMode } from "../../core/provider/DarkModeProvider";
import NotificationsIcon from '@mui/icons-material/Notifications';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LanguageIcon from '@mui/icons-material/Language';

// SettingsPage
const SettingsPage: React.FC = () => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const { addToast } = useToast();
    const { setThemeMode, themeMode } = useDarkMode();

    const handleNotificationToggle = () => setNotificationsEnabled(!notificationsEnabled);
    const handleDarkModeToggle = () => {
        const newMode = themeMode === 'dark' ? 'dark' : 'light';
        setThemeMode(newMode);
        addToast(`Dark mode is now ${newMode}`, 'info');
    };

    return (
        <Box className="p-4">
            <Typography variant="h4" gutterBottom>Settings</Typography>
            <List sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
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