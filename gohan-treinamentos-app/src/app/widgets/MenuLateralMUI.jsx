import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, Typography } from '@mui/material';
import { Home as HomeIcon, List as ListIcon, Notifications as NotificationsIcon, People as PeopleIcon, GridOn as GridIcon, BarChart as BarChartIcon, Settings as SettingsIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

export default  MenuLateralMaterial = () => {
    const menuItems = [
        { path: '/', icon: <HomeIcon />, text: 'Início' },
        { path: '/tasks', icon: <ListIcon />, text: 'Tarefas' },
        { path: '/notes', icon: <NotificationsIcon />, text: 'Notes APP' },
        { path: '/lista_tarefas', icon: <GridOn />, text: 'Lista Tarefas MUI' },
        { path: '/users', icon: <PeopleIcon />, text: 'Users' },
        { path: '/analytics', icon: <BarChartIcon />, text: 'Analytics' },
        { path: '/settings', icon: <SettingsIcon />, text: 'Settings' },
    ];

    return (
        <Drawer variant="permanent">
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">Menu Lateral</Typography>
                </Toolbar>
            </AppBar>
            <List>
                {menuItems.map((item, index) => (
                    <ListItem button key={index} component={Link} to={item.path}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
};
