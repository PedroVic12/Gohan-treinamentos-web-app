import React from 'react';
import {
    IonContent,
    IonMenu,
    IonList,
    IonItem,
    IonIcon,
    IonLabel,
    IonHeader,
    IonMenuToggle,
    IonTitle,
    IonToolbar,
} from '@ionic/react';
import {
    gridOutline,
    peopleOutline,
    analyticsOutline,
    settingsOutline,
    homeOutline,
    listOutline,
    notificationsOutline,
} from 'ionicons/icons';

const SidebarMenu: React.FC = () => {
    const menuItems = [
      { path: '/', icon: homeOutline, text: 'Início' },
      { path: '/todo', icon: listOutline, text: 'Tarefas' },
      { path: '/notes', icon: notificationsOutline, text: 'Notes APP' },
    ];
  
    return (
      <IonMenu contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            {menuItems.map((item, index) => (
              <IonMenuToggle key={index}>
                <IonItem routerLink={item.path} routerDirection="none">
                  <IonIcon slot="start" icon={item.icon} />
                  <IonLabel>{item.text}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            ))}
          </IonList>
        </IonContent>
      </IonMenu>
    );
  };
export default SidebarMenu;