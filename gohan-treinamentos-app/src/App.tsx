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
import geradorTreinoPage from './app/pages/geradorTreinoPage';
import TaskManagerPage from './app/pages/todoList/task_manager';
import TodoListPageUseState from './app/pages/signalTodoList/TodoListStatePage.jsx';
import CalisthenicsAppV3 from './app/pages/calistenia_app/calistenia_app_stable';
import CalisthenicsAppPreview from './app/pages/calistenia_app/calistenia_app_v2';
import CalisthenicsAppV5 from './app/pages/calistenia_app/calistenia_app_v4';
import CalisthenicsAppMaterial from './app/pages/calistenia_app/calistenia_app_v4';
import CalisthenicsApp from './app/pages/calistenia_app/pages/calistenia_app_mui';
import MarkdownChecklist from './app/pages/CheckListMarkdown/MarkdownCheckList';
//! DOCS ---> https://ionicframework.com/docs/components


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
          <Route key={route.path} path={route.path} component={route.component} exact={true} />
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



//!MEU APP IONINC
setupIonicReact();

const appRoutes: RouteConfig[] = [

  //! Gohan treinamentos
  { path: "/home", component: GohanTreinamentosHomePage, label: "Home Page", icon: ellipse },
  //{ path: "/calistenia", component: CalisthenicsAppPreview, label: "Calistenia APP", icon: barbellOutline },
  //{ path: "/calistenia", component: CalisteniaApp, label: "Calistenia APP", icon: barbellOutline },
 // { path: "/calistenia", component: CalisthenicsAppMaterial, label: "Calistenia APP", icon: barbellOutline },
  { path: "/calistenia", component: CalisthenicsApp, label: "Calistenia APP", icon: barbellOutline },

  { path: "/treinos", component: GohanTreinamentosGeradorTreinoPage, label: "Gerador Treinos", icon: square },
  { path: "/quizz", component: QuizGamePage, label: "Quizz Game", icon: triangle },
  //{ path: "/lista_tarefas", component: TodoListPageUseState, label: "Todo List useState", icon: square },


  //? debug TaskManagerPage
  { path: "/tasks", component: TaskManagerPage, label: "Lista de Tarefas", icon: squareOutline }, 
  //{ path: "/notes", component: NotesMaterialPage, label: "Notes App", icon: squareOutline }, 


  //! IA page
  { path: "/alarme", component: AlarmeClockPage, label: "C3po Alarme clock", icon: squareOutline }, 
  { path: "/checklist", component: MarkdownChecklist, label: "CheckList", icon: squareOutline }, 

  //{ path: "/classroom", component: ClassroomPage, label: "Tabs template", icon: squareOutline }, 
 // { path: "/dashboard", component: DashboardPage, label: "Dashboard", icon: squareOutline }, 




];


const App: React.FC = () => {

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