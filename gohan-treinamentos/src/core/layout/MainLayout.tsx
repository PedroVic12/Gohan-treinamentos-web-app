import React, { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box, AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemButton,
    ListItemIcon, ListItemText, BottomNavigation, BottomNavigationAction,
    Paper, IconButton, Divider, Avatar, useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AppsIcon from '@mui/icons-material/Apps';
import { useSession } from '../provider/SessionContext';

const drawerWidth = 260; // Aumentar um pouco a largura

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
        const bottomNavPaths = ['/', '/profile', '/workout', '/settings'];
        const currentPath = bottomNavPaths.find(path => location.pathname === path);
        return currentPath || false;
    };

    const mainNavItems = [
        { text: 'Home', path: '/', icon: <HomeIcon /> },
        { text: 'Gohan Treinamentos', path: '/home', icon: <FitnessCenterIcon /> },
        { text: 'App Produtividade', path: '/app_produtividade', icon: <AppsIcon /> },
    ];

    const userNavItems = [
        { text: 'Profile', path: '/profile', icon: <PersonIcon /> },
        { text: 'Settings', path: '/settings', icon: <SettingsIcon /> },
    ];

    const drawerContent = (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                backgroundColor: theme.palette.background.default
            }}
            onClick={handleDrawerToggle}
        >
            {/* Secção de Perfil */}
            <Box sx={{ p: 2.5, textAlign: 'center', backgroundColor: theme.palette.primary.main, color: theme.palette.primary.contrastText }}>
                 <Avatar
                    sx={{ width: 64, height: 64, margin: '0 auto 16px' }}
                    // Pode adicionar um link para a imagem do utilizador aqui
                    // src="/static/images/avatar/1.jpg" 
                >
                    U
                </Avatar>
                <Typography variant="h6">Utilizador</Typography>
                <Typography variant="body2">utilizador@email.com</Typography>
            </Box>

            <Divider />

            {/* Lista de Navegação Principal */}
            <List>
                {mainNavItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            selected={location.pathname === item.path}
                            onClick={() => handleNavigation(item.path)}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            <Box sx={{ flexGrow: 1 }} /> {/* Empurra o próximo grupo para o fundo */}

            {/* Lista de Navegação do Utilizador */}
            <Divider />
            <List>
                {userNavItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            selected={location.pathname === item.path}
                            onClick={() => handleNavigation(item.path)}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

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
                sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
            >
                {drawerContent}
            </Drawer>

            <Box
                component="main"
                sx={{
                    flexGrow: 1, p: 3, width: '100%',
                    pt: '64px', // Padding Top para a AppBar
                    pb: '56px', // Padding Bottom para a BottomNavigation
                    backgroundColor: theme.palette.background.default
                }}
            >
                {children}
            </Box>

            <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1100 }} elevation={3}>
                <BottomNavigation
                    showLabels
                    value={getCurrentTabValue()}
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