// src/app/pages/CalisteniaTabsPage.jsx

import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonTabs, IonTabBar, IonTabButton, IonLabel, IonRouterOutlet } from '@ionic/react';
import { Route } from 'react-router-dom';


import { IonContent, IonCard, IonCardContent } from '@ionic/react';

const PushComponent = () => {
  return (
    <IonContent>
      <IonCard>
        <IonCardContent>
          <h2>Push Exercises</h2>
          <iframe width="100%" height="315" src="https://www.youtube.com/embed/your_video_id" title="YouTube video" frameBorder="0" allowFullScreen></iframe>
          {/* Adicione mais vídeos conforme necessário */}
        </IonCardContent>
      </IonCard>
    </IonContent>
  );
};

const CalisteniaTabsPage = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Calistenia APP</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonTabs>
        <IonTabBar slot="top">
          <IonTabButton tab="push" href="/push">
            <IonLabel>Push</IonLabel>
          </IonTabButton>
          <IonTabButton tab="pull" href="/pull">
            <IonLabel>Pull</IonLabel>
          </IonTabButton>
          <IonTabButton tab="legs" href="/legs">
            <IonLabel>Legs</IonLabel>
          </IonTabButton>
          <IonTabButton tab="abs" href="/abs">
            <IonLabel>Abs</IonLabel>
          </IonTabButton>
        </IonTabBar>

        <IonRouterOutlet>
          <Route path="/push" component={PushComponent} exact={true} />
          {/* <Route path="/pull" component={PullComponent} exact={true} />
          <Route path="/legs" component={LegsComponent} exact={true} />
          <Route path="/abs" component={AbsComponent} exact={true} /> */}
        </IonRouterOutlet>
      </IonTabs>
    </IonPage>
  );
};

export default CalisteniaTabsPage;