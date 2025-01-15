import { Redirect, Route } from 'react-router-dom';
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
import { ellipse, square, squareOutline, triangle } from 'ionicons/icons';

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
import { useState } from 'react';
import GohanTreinamentosGeradorTreinoPage from './app/pages/geradorTreinoPage';

setupIonicReact();

const Tab1: React.FC = () => {
  const [count, setCount] = useState(0);

  return (
    <IonPage>
      <IonHeader>
        <IonTitle>Tab 1</IonTitle>
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

const Tab2: React.FC = () => (
  <IonPage>
    <IonHeader>
      <IonTitle>Tab 2</IonTitle>
    </IonHeader>
    <IonContent>
      <IonButton color="secondary">Botão Verde</IonButton>
    </IonContent>
  </IonPage>
);

const Tab3: React.FC = () => (
  <IonPage>
    <IonHeader>
      <IonTitle>Tab 3</IonTitle>
    </IonHeader>
    <IonContent>
      <IonButton color="tertiary">Botão Laranja</IonButton>
    </IonContent>
  </IonPage>
);

const TodoListPage: React.FC = () => {
  // Estado para armazenar as tarefas
  const [tasks, setTasks] = useState<{ id: number; name: string; completed: boolean }[]>([
      { id: 1, name: "Enviar curriculo ingels e portugues (UFF, DEV, DOLAR)", completed: false },
      { id: 2, name: "15 exericios resolvidos Eletromag", completed: false },
      { id: 3, name: "5 exercicios cc + 5 exercicios enem minicurso", completed: false },
      { id: 4, name: "Agendamento PAndapower tabela RASH", completed: false },
      { id: 5, name: "Notebook Analise de dados rede eletrica", completed: false },

  ]);

  const [newTaskName, setNewTaskName] = useState("");

  const handleCheckboxChange = (id: number) => {
      setTasks((prevTasks) =>
          prevTasks.map((task) =>
              task.id === id ? { ...task, completed: !task.completed } : task
          )
      );
  };

  const handleAddTask = () => {
      if (newTaskName.trim()) {
          const newTask = {
              id: tasks.length + 1,
              name: newTaskName,
              completed: false,
          };
          setTasks((prev) => [...prev, newTask]);
          setNewTaskName(""); // Limpa o campo de entrada
      }
  };

  return (
      <IonPage>
          <IonHeader>
              <IonTitle>Minha Lista de Tarefas</IonTitle>
          </IonHeader>
          <IonContent>
              <IonInput
                  placeholder="Adicionar nova tarefa"
                  value={newTaskName}
                  onIonChange={(e) => setNewTaskName(e.detail.value!)}
              />
              <IonButton onClick={handleAddTask} color="primary">
                  Adicionar
              </IonButton>

              <IonList>
                  {tasks.map((task) => (
                      <IonItem key={task.id}>
                          <IonCheckbox
                              checked={task.completed}
                              onIonChange={() => handleCheckboxChange(task.id)}
                          />
                          <IonLabel className={task.completed ? "line-through" : ""}>
                              {task.name}
                          </IonLabel>
                      </IonItem>
                  ))}
              </IonList>
              {newFunction()}

              {glassWidget()}
          </IonContent>
      </IonPage>
  );

  function newFunction() {
    return (
      <div className="h-full w-full bg-indigo-600 rounded-md bg-clip-padding backdrop-filter backdrop-blur-3xl bg-opacity-10 border border-gray-100">
       teste
        <img src="https://ionicframework.com/docs/img/dash-logo.svg" style={{ position: 'absolute', left: '50px', top: '50px' }} />
        glass
      
        
      </div>

        
    );
  }


  function glassWidget(){
      return (
        <div>
        
        </div>
      )
  }
};


const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>

      {/* rotas */}
      <IonRouterOutlet>
          <Route exact path="/tab1">
            <Tab1 />
          </Route>
          <Route exact path="/tab2">
            <Tab2 />
          </Route>
          <Route path="/treinos">
            <GohanTreinamentosGeradorTreinoPage />
          </Route>
          <Route path="/todo">
            <TodoListPage />
          </Route>
          <Route exact path="/">
            <Redirect to="/tab1" />
          </Route>
        </IonRouterOutlet>


      {/* botoes */}
        <IonTabBar slot="bottom">
          <IonTabButton tab="tab1" href="/tab1">
            <IonIcon aria-hidden="true" icon={triangle} />
            <IonLabel>Tab 1</IonLabel>
          </IonTabButton>

          <IonTabButton tab="tab2" href="/tab2">
            <IonIcon aria-hidden="true" icon={ellipse} />
            <IonLabel>Tab 2</IonLabel>
          </IonTabButton>

          <IonTabButton tab="treinos" href="/treinos">
            <IonIcon aria-hidden="true" icon={square} />
            <IonLabel>Gerador Treinos</IonLabel>
          </IonTabButton>

          <IonTabButton tab="todo" href="/todo">
            <IonIcon aria-hidden="true" icon={squareOutline} />
            <IonLabel>Lista Tarefas 2025</IonLabel>
          </IonTabButton>


        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;