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

import '@ionic/react/css/core.css';
//import 'bootstrap/dist/css/bootstrap.min.css';



//! ================================ imports pedro victor
import { useState } from 'react';
import GohanTreinamentosGeradorTreinoPage from './app/pages/geradorTreinoPage';
import GohanTreinamentosHomePage from './app/pages/HomePage/gohan_treinamentos_homepage';
import QuizGamePage from './app/pages/quizzgame/QuizzGame';
import TodoListPage from './app/pages/todoList/todoListPage';
import  AlarmeClockPage from "./app/pages/clockPage/alarm_clock_page";
import { Icon } from 'ionicons/dist/types/components/icon/icon';
import ClassroomPage from './app/pages/dashboard_v1/dashboards_tabs_template';
import DashboardPage from './app/pages/dashboard_v1/dashboard_overview';
import MenuLateral from "./app/widgets/menu_lateral"
import geradorTreinoPage from './app/pages/geradorTreinoPage';
import TaskManagerPage from './app/pages/todoList/task_manager';
import NotesMaterialPage from './app/pages/Notes_App/NotesMaterialPage';
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

export interface RouteConfig {
  path: string;
  component: React.ComponentType<any>;
  label: string;
  icon: Icon['icon'];
}

//! TabBar ionic
interface AppTabsProps {
  routes: RouteConfig[];
}

const AppTabs: React.FC<AppTabsProps> = ({ routes }) => {
  const location = useLocation();

  return (
    <IonTabs>
      <IonRouterOutlet>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} component={route.component} />
        ))}
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        {routes.map((route) => (
          <IonTabButton
            key={route.path}
            tab={route.path}
            href={route.path}
            selected={location.pathname === route.path}
          >
            <IonIcon icon={route.icon} />
            <IonLabel>{route.label}</IonLabel>
          </IonTabButton>
        ))}
      </IonTabBar>
    </IonTabs>
  );
};


//! Routes
const  MyRoutesApp: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/home" component={GohanTreinamentosHomePage} />
      <Route path="/treinos" component={GohanTreinamentosGeradorTreinoPage} />
      <Route path="/quizz" component={QuizGamePage} />
      <Route path="/todo" component={TodoListPage} />




      <Route path="/alarme" component={AlarmeClockPage} />
      <Route path="/classroom" component={ClassroomPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route exact path="/tab1" component={Tab1} />


      <Route exact path="/tasks" component={TaskManagerPage} />
      <Route exact path="/calistenia" component={geradorTreinoPage} />


      <Route exact path="/">
        <Redirect to="/home" />
      </Route>
    </Switch>
  );
};

//!MEU APP IONINC
setupIonicReact();

const App: React.FC = () => {


  const appRoutes: RouteConfig[] = [
    // { path: "/tab1", component: Tab1, label: "Tab 1", icon: triangle },

    //! Gohan treinamentos
    { path: "/home", component: GohanTreinamentosHomePage, label: "Home Page", icon: ellipse },
    { path: "/treinos", component: GohanTreinamentosGeradorTreinoPage, label: "Gerador Treinos", icon: square },
    { path: "/quizz", component: QuizGamePage, label: "Quizz Game", icon: triangle },

    // debug TaskManagerPage
    { path: "/calistenia", component: geradorTreinoPage, label: "caslistenia APP", icon: squareOutline }, 
    { path: "/tasks", component: TaskManagerPage, label: "Lista de Tarefas", icon: squareOutline }, 
    { path: "/notes", component: NotesMaterialPage, label: "Notes App", icon: squareOutline }, 



    //! IA page
    { path: "/alarme", component: AlarmeClockPage, label: "C3po Alarme clock", icon: squareOutline }, 
    { path: "/classroom", component: ClassroomPage, label: "Tabs template", icon: squareOutline }, 
    { path: "/dashboard", component: DashboardPage, label: "Dashboard", icon: squareOutline }, 




  ];

  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
        <AppTabs routes={appRoutes} />
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;