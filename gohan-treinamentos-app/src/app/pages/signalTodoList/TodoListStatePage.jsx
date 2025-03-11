import { TodoListReact } from "./todo_list.jsx";
import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { Home as HomeIcon, List as ListIcon, Notifications as NotificationsIcon, People as PeopleIcon, GridOn, BarChart as BarChartIcon, Settings as SettingsIcon } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu'; // Importa o ícone de menu
import { Link } from 'react-router-dom';

const MenuLateralMaterial = ({ open, onClose }) => {
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
        <Drawer variant="temporary" open={open} onClose={onClose}>
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

export default function TodoListPageUseState() {
    console.log("Render App");

    const [toggleMenu, setToggleMenu] = useState(false); // Estado para controlar o Drawer

    const handleToggleMenu = () => {
        setToggleMenu(prev => !prev); // Alterna o estado do menu
    };

    const handleCloseMenu = () => {
        setToggleMenu(false); // Fecha o menu
    };

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleToggleMenu}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6">Lista de Tarefas - Material UI</Typography>
                </Toolbar>
            </AppBar>
            <MenuLateralMaterial open={toggleMenu} onClose={handleCloseMenu} /> {/* Passa o estado para o MenuLateralMaterial */}
            <TodoListReact />
        </div>
    );
}