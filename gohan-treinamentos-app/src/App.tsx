// App.tsx
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonSplitPane,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';

import {
  analyticsOutline,
  barbellOutline,
  homeOutline,
  listOutline,
  notificationsOutline,
  peopleOutline,
  settingsOutline
} from 'ionicons/icons';

/* Páginas */
import GohanTreinamentosGeradorTreinoPage from './app/pages/geradorTreinoPage';
import GohanTreinamentosHomePage from './app/pages/HomePage/gohan_treinamentos_homepage';
import QuizGamePage from './app/pages/quizzgame/QuizzGame';
import AlarmeClockPage from './app/pages/clockPage/alarm_clock_page';
import TaskManagerPage from './app/pages/todoList/task_manager';
import CalisthenicsApp from './app/pages/calistenia_app/pages/calistenia_app_mui';
import MarkdownChecklist from './app/pages/CheckListMarkdown/MarkdownCheckList';
import SidebarMenu from './app/widgets/side_menu';

/* CSS */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css';
import './theme/variables.css';

setupIonicReact();

// Rotas configuradas
export const appRoutes = [
  { path: '/home', component: GohanTreinamentosHomePage, label: 'Home', icon: homeOutline },
  { path: '/calistenia', component: CalisthenicsApp, label: 'Calistenia', icon: barbellOutline, isJSX: true },
  { path: '/treinos', component: GohanTreinamentosGeradorTreinoPage, label: 'Treinos', icon: settingsOutline },
  { path: '/quizz', component: QuizGamePage, label: 'Quizz', icon: peopleOutline, isJSX: true },
  { path: '/tasks', component: TaskManagerPage, label: 'Tarefas', icon: listOutline },
  { path: '/alarme', component: AlarmeClockPage, label: 'Alarme', icon: analyticsOutline },
  { path: '/checklist', component: MarkdownChecklist, label: 'Checklist', icon: notificationsOutline },
];

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId="main">
          <SidebarMenu />
          <IonTabs>
            <IonRouterOutlet id="main">
              {appRoutes.map((route, index) => {
                const Component = route.component;
                return route.isJSX ? (
                  <Route
                    key={index}
                    exact
                    path={route.path}
                    render={() => <Component />}
                  />
                ) : (
                  <Route
                    key={index}
                    exact
                    path={route.path}
                    component={Component}
                  />
                );
              })}
              <Redirect exact from="/" to="/home" />
            </IonRouterOutlet>

            <IonTabBar slot="bottom">
              {appRoutes.map((route, index) => (
                <IonTabButton key={index} tab={route.label} href={route.path}>
                  <IonIcon icon={route.icon} />
                  <IonLabel>{route.label}</IonLabel>
                </IonTabButton>
              ))}
            </IonTabBar>
          </IonTabs>
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
