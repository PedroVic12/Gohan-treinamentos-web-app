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
import { Redirect, Route, useLocation } from 'react-router-dom';



import {
  analyticsOutline,
  barbellOutline,
  homeOutline,
  listOutline,
  notificationsOutline,
  peopleOutline,
  settingsOutline
} from 'ionicons/icons';

import { useState, useEffect, useMemo } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

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
import '@ionic/react/css/palettes/dark.class.css';
import './theme/variables.css';

setupIonicReact();


export const appRoutes = [

  //Home
  { path: '/home', component: GohanTreinamentosHomePage, label: 'Home', icon: homeOutline },
  
  // Calistenia App V1
  { path: '/calistenia', component: CalisthenicsApp, label: 'Calistenia', icon: barbellOutline },
  { path: '/treinos', component: GohanTreinamentosGeradorTreinoPage, label: 'Treinos', icon: settingsOutline },
  
  // Quiz App AI otimizado com estudos em arquivos .json de perguntas e respostas
  { path: '/quizz', component: QuizGamePage, label: 'Quizz', icon: peopleOutline },
  { path: '/tasks', component: TaskManagerPage, label: 'Tarefas', icon: listOutline },

  //Pomodoro Timer Taskk Manager
  { path: '/alarme', component: AlarmeClockPage, label: 'Alarme', icon: analyticsOutline },
  { path: '/checklist', component: MarkdownChecklist, label: 'Checklist', icon: notificationsOutline },
];

const AppContent = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const outerContainerStyles: React.CSSProperties = isMobile ? {
    width: '100%',
    height: '100%',
    display: 'block',
    backgroundColor: 'var(--ion-background-color)'
  } : {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100vh',
    background: 'radial-gradient(circle, #334155 0%, #0f172a 100%)',
    overflow: 'hidden'
  };

  const deviceWrapperStyles: React.CSSProperties = isMobile ? {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  } : {
    width: '420px',
    height: '88vh',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    border: '12px solid #1e293b',
    borderRadius: '36px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
    backgroundColor: 'var(--ion-background-color)',
    overflow: 'hidden'
  };

  return (
    <div style={outerContainerStyles}>
      <div style={deviceWrapperStyles}>
        {/* Smartphone Notch Bar (only on desktop mockup view) */}
        {!isMobile && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '140px',
            height: '22px',
            backgroundColor: '#1e293b',
            borderBottomLeftRadius: '14px',
            borderBottomRightRadius: '14px',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            pointerEvents: 'none'
          }}>
            {/* Camera speaker line */}
            <div style={{ width: '40px', height: '4px', backgroundColor: '#334155', borderRadius: '2px' }} />
          </div>
        )}

        <IonTabs>
          {/* Força re-render com key baseada na location.pathname */}
          <IonRouterOutlet key={location.pathname}>
            {appRoutes.map((route, index) => (
              <Route key={index} exact path={route.path} component={route.component} />
            ))}
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
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('gohan_dark_mode');
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    // Sincroniza a classe do Ionic no body
    document.documentElement.classList.toggle('ion-palette-dark', darkMode);
    
    // Listener para mudanças manuais de tema disparadas de outras telas
    const handleThemeToggle = () => {
      const saved = localStorage.getItem('gohan_dark_mode');
      if (saved !== null) {
        setDarkMode(JSON.parse(saved));
      }
    };
    window.addEventListener('theme-changed', handleThemeToggle);
    return () => window.removeEventListener('theme-changed', handleThemeToggle);
  }, [darkMode]);

  const theme = useMemo(() => createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#3b82f6',
      },
      background: {
        default: darkMode ? '#0f172a' : '#f8fafc',
        paper: darkMode ? '#1e293b' : '#ffffff',
      },
    },
    typography: {
      fontFamily: 'Outfit, Inter, sans-serif',
    },
  }), [darkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <IonApp>
        <IonReactRouter>
          <IonSplitPane contentId="main">
            <SidebarMenu />
            <IonRouterOutlet id="main">
              <Route path="/" component={AppContent} />
            </IonRouterOutlet>
          </IonSplitPane>
        </IonReactRouter>
      </IonApp>
    </ThemeProvider>
  );
};

export default App;