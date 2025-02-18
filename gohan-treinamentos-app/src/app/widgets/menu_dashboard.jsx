import React from 'react';
import {
    IonContent,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonMenu,
} from '@ionic/react';
import {
    gridOutline,
    peopleOutline,
    analyticsOutline,
    settingsOutline,
} from 'ionicons/icons';

const menuItemsConfig = [
    { label: 'Dashboard', rota: '/dashboard', icon: 'grid' },
    { label: 'Users', rota: '/users', icon: 'people' },
    { label: 'Analytics', rota: '/analytics', icon: 'analytics' },
    { label: 'Settings', rota: '/settings', icon: 'settings' },
];

function MenuLateralDashboard(props) {
    const { menuItems = menuItemsConfig, onMenuItemClick } = props;

    const getIcon = (iconName) => {
        switch (iconName) {
            case 'grid': return gridOutline;
            case 'people': return peopleOutline;
            case 'analytics': return analyticsOutline;
            case 'settings': return settingsOutline;
            default: return gridOutline; // Ícone padrão
        }
    };

    return (
        <IonMenu contentId="main-content" className="dark-theme">
            <IonContent className="ion-padding custom-sidebar">
                <h1 className="sidebar-title">Dashboard Menu Lateral </h1>
                <IonList lines="none" className="custom-menu-list">
                    {menuItems.map((item, index) => (
                        <IonItem button key={index} className="menu-item" onClick={() => onMenuItemClick(item.rota)}>
                            <IonIcon icon={getIcon(item.icon)} slot="start" />
                            <IonLabel>{item.label}</IonLabel>
                        </IonItem>
                    ))}
                </IonList>
            </IonContent>
        </IonMenu>
    );
}

export default MenuLateralDashboard;