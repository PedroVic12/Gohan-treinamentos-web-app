import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonItem,
  IonList,
  IonCheckbox,
  IonInput,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { barbellOutline, ellipse, gameControllerOutline, homeOutline, listOutline, square, squareOutline, triangle } from 'ionicons/icons';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Ionic Dark Mode */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';




//! ================================ imports pedro victor
import { useState } from 'react';
import GohanTreinamentosGeradorTreinoPage from './app/pages/geradorTreinoPage';
import GohanTreinamentosHomePage from './app/pages/HomePage/gohan_treinamentos_homepage';
import QuizGamePage from './app/pages/quizzgame/QuizzGame';
import TodoListPage from './app/pages/todoList/todoListPage';
import  AlarmeClockPage from "./app/pages/clockPage/alarm_clock_page";

//! DOCS ---> https://ionicframework.com/docs/components


const Tab1: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <IonPage>
      <IonHeader>
        <IonTitle>OLA MUNDO! 28/01/2025</IonTitle>
      </IonHeader>
      <IonContent>
        <h2 className="text-xl font-bold mb-4">Contador: {count}</h2>
        <IonButton onClick={() => setCount(count + 1)} color="primary">
          Incrementar
        </IonButton>
        <IonButton onClick={() => setCount(count - 1)} color="danger">
          Decrementar
        </IonButton>
      </IonContent>
    </IonPage>
  );
};


//! Routes

const AppRoutes: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/tab1" component={Tab1} />
      <Route exact path="/home" component={GohanTreinamentosHomePage} />
      <Route path="/treinos" component={GohanTreinamentosGeradorTreinoPage} />
      <Route path="/quizz" component={QuizGamePage} />
      <Route path="/todo" component={TodoListPage} />
      <Route path="/alarme" component={AlarmeClockPage} />

      <Route exact path="/">
        <Redirect to="/home" />
      </Route>
    </Switch>
  );
};


//! TabBar ionic
const AppTabs: React.FC = () => {
  const location = useLocation();

  return (
    <IonTabs>
      <IonRouterOutlet>
        <AppRoutes />
      </IonRouterOutlet>



      <IonTabBar slot="bottom">
        <IonTabButton tab="tab1" href="/tab1" selected={location.pathname === '/tab1'}>
          <IonIcon icon={triangle} />
          < IonLabel>Tab 1</IonLabel >
        </IonTabButton>
        <IonTabButton tab="quizz" href="/quizz" selected={location.pathname === '/quizz'}>
          <IonIcon icon={triangle} />
          < IonLabel>Quizz Game</IonLabel >
        </IonTabButton>
        <IonTabButton tab="home" href="/home" selected={location.pathname === '/home'}>
          <IonIcon icon={ellipse} />
          < IonLabel>Home Page</IonLabel >
        </IonTabButton>
        <IonTabButton tab="treinos" href="/treinos" selected={location.pathname === '/treinos'}>
          <IonIcon icon={square} />
          < IonLabel>Gerador Treinos</IonLabel >
        </IonTabButton>
        <IonTabButton tab="todo" href="/todo" selected={location.pathname === '/todo'}>
          <IonIcon icon={squareOutline} />
          < IonLabel>Lista Tarefas 2025</IonLabel >
        </IonTabButton>
      </IonTabBar>


    </IonTabs>
  );
};


{/*! MEU APP IONINC */}
setupIonicReact();

const App: React.FC = () => (
  
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <AppTabs />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;