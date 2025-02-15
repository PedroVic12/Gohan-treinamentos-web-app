import React from 'react';
import {
    IonContent,
    IonMenu,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
} from '@ionic/react';
import {
    gridOutline,
    peopleOutline,
    analyticsOutline,
    settingsOutline,
} from 'ionicons/icons';

const SidebarMenu = () => {
    return (
        <IonMenu contentId="main-content" className="dark-theme">
            <IonContent className="ion-padding custom-sidebar">
                <h1 className="sidebar-title">Dashboard</h1>
                <IonList lines="none" className="custom-menu-list">
                    <IonItem button className="menu-item active">
                        <IonIcon icon={gridOutline} slot="start" />
                        <IonLabel>Dashboard</IonLabel>
                    </IonItem>
                    <IonItem button className="menu-item">
                        <IonIcon icon={peopleOutline} slot="start" />
                        <IonLabel>Users</IonLabel>
                    </IonItem>
                    <IonItem button className="menu-item">
                        <IonIcon icon={analyticsOutline} slot="start" />
                        <IonLabel>Analytics</IonLabel>
                    </IonItem>
                    <IonItem button className="menu-item">
                        <IonIcon icon={settingsOutline} slot="start" />
                        <IonLabel>Settings</IonLabel>
                    </IonItem>
                </IonList>
            </IonContent>
        </IonMenu>
    );
};

export default SidebarMenu;