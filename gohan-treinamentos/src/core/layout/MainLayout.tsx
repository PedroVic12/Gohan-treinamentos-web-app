import React, { ReactNode } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
    Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemButton, 
    ListItemIcon, ListItemText, BottomNavigation, BottomNavigationAction, 
    Paper, IconButton
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { useSession } from '../provider/SessionContext';
import { useTheme } from '@mui/material/styles';

const drawerWidth = 240;

interface MainLayoutProps {
    children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const { drawerOpen, setDrawerOpen } = useSession();
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleNavigation = (path: string) => {
        navigate(path);
        setDrawerOpen(false);
    };

    const getCurrentTabValue = () => {
        if (location.pathname === '/') return '/';
        if (location.pathname.startsWith('/profile')) return '/profile';
        if (location.pathname.startsWith('/settings')) return '/settings';
        if (location.pathname.startsWith('/workout')) return '/workout';
        return false;
    };

    const currentTabValue = getCurrentTabValue();

    const navItems = [
        { text: 'Gohan Treinamentos', path: '/home', icon: <HomeIcon /> },
        { text: 'App Produtividade', path: '/app_produtividade', icon: <SettingsIcon /> },
        { text: 'Home', path: '/', icon: <HomeIcon /> },
        { text: 'Profile', path: '/profile', icon: <PersonIcon /> },
        { text: 'Settings', path: '/settings', icon: <SettingsIcon /> },
        { text: 'Workout', path: '/workout', icon: <FitnessCenterIcon /> },
        { text: 'Stock Manager', path: '/stock-manager', icon: <SettingsIcon /> },
        { text: 'Agenda Contatos', path: '/agenda-contatos', icon: <PersonIcon /> }
    ];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <AppBar position="fixed">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        Mobile App
                    </Typography>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="temporary"
                open={drawerOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{ 
                    '& .MuiDrawer-paper': { 
                        boxSizing: 'border-box', 
                        width: drawerWidth 
                    } 
                }}
            >
                <Box sx={{ textAlign: 'center', width: drawerWidth }}>
                    <Typography variant="h6" sx={{ my: 2 }}>
                        App Menu
                    </Typography>
                    <List>
                        {navItems.map((item) => (
                            <ListItem key={item.text} disablePadding>
                                <ListItemButton onClick={() => handleNavigation(item.path)}>
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>

            <Box
                component="main"
                sx={{ 
                    flexGrow: 1,
                    p: 3,
                    width: '100%',
                    pt: '64px',
                    pb: '56px',
                    backgroundColor: theme.palette.background.default
                }}
            >
                {children}
            </Box>

            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1100 }} elevation={3}>
                <BottomNavigation
                    showLabels
                    value={currentTabValue}
                    onChange={(event, newValue) => handleNavigation(newValue)}
                >
                    <BottomNavigationAction label="Home" value="/" icon={<HomeIcon />} />
                    <BottomNavigationAction label="Profile" value="/profile" icon={<PersonIcon />} />
                    <BottomNavigationAction label="Workout" value="/workout" icon={<FitnessCenterIcon />} />
                    <BottomNavigationAction label="Settings" value="/settings" icon={<SettingsIcon />} />
                </BottomNavigation>
            </Paper>
        </Box>
    );
};

export default MainLayout;