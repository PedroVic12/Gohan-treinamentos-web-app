import React from 'react';
import { IonMenu, IonItem, IonLabel, IonIcon, IonList, IonHeader, IonTitle, IonContent, IonToolbar, IonMenuToggle } from '@ionic/react';
import { home, create, calendar, settings } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

interface MenuItemProps {
  label: string;
  rota: string;
  icon: string; // nome do ícone a ser usado (ex: 'home', 'create', etc.)
}

interface MenuLateralProps {
  menuItems: MenuItemProps[];
}

const MenuLateral: React.FC<MenuLateralProps> = ({ menuItems }) => {
  const history = useHistory();

  const navigateTo = (path: string) => {
    history.push(path);
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'home': return home;
      case 'create': return create;
      case 'calendar': return calendar;
      case 'settings': return settings;
      default: return home; // Ícone padrão caso não encontre
    }
  };

  return (
    <IonMenu contentId="main-content">
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Menu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {menuItems.map((item, index) => (
            <IonMenuToggle autoHide={false} key={index}>
              <IonItem button onClick={() => navigateTo(item.rota)}>
                <IonIcon slot="start" icon={getIcon(item.icon)} />
                <IonLabel>{item.label}</IonLabel>
              </IonItem>
            </IonMenuToggle>
          ))}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default MenuLateral;