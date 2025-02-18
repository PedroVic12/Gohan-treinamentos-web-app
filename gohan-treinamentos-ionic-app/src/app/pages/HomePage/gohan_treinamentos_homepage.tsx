import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  List,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { TaskItem } from '../../public/components/TaskItem';
import { ProgressBar } from '../../public/components/ProgressBar';
import { initialTasks } from '../../public/data/initialTasks';
import { formatDate } from '../../public/utils/dateUtils';
import { getTaskMessage } from '../../public/data/taskMessages';
import { Task } from '../../public/types/Task';
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonTitle, IonToolbar, useIonToast } from '@ionic/react';
import SidebarMenu from '../../widgets/side_menu';
import { refreshOutline } from 'ionicons/icons';

// Widgets
const CustomText = ({ props }: { props: { text: string } }) => {
  return (
    <Typography variant="subtitle1" align="center" gutterBottom color="primary">
      {props.text}
    </Typography>
  );
}

const HobbiesSection: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', margin: '20px 0' }}>
      <Typography variant="h5" gutterBottom color="primary">
        You Only Need 5 hobbies
      </Typography>
      <Typography variant="subtitle1" gutterBottom color="primary">
        (Corpo x Mente x Espirito)
      </Typography>
      <Typography variant="body1" gutterBottom color="primary">
        Importante cuidar da suas Habilidades (trabalho), Saúde mental(estudos), saude emocional(relacionamentos) e saude física (treinos)!
        <br></br>
        <br></br>
        Hora de se tornar um Super Sayajin em 2025 e sua melhor versão: Lindo, Inteligente e Gostoso!
      </Typography>
    </div>
  );
};

// src/app/utils/LocalDatabase.ts
class LocalDatabase {
  static getTasks() {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : null;
  }

  static saveTasks(tasks: any[]) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
}

function GohanTreinamentosHomePage() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [present] = useIonToast();

  const SnackBar = (position: 'top' | 'middle' | 'bottom') => {
    present({
      message: 'Hello World!',
      duration: 1500,
      position: position,
    });
  };


  const [tasks, setTasks] = useState<Task[]>(() => {
    return LocalDatabase.getTasks() || initialTasks; // Usa LocalDatabase para carregar tarefas
  });
  const maxWeeklyCount = 40;

  useEffect(() => {
    LocalDatabase.saveTasks(tasks); // Usa LocalDatabase para salvar tarefas
  }, [tasks]);

  const totalCount = tasks.reduce((sum, task) => sum + task.count, 0);

  const handleIncrement = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          const newCount = Math.min(task.count + 1, 15);
          if (newCount === 5) {
            alert(getTaskMessage(taskId));
          }

          if (totalCount == 25) {
            alert("Parabens meu jovem Padawan! Voce esta com a energia vibrando alto! Busque a paz e equilibrio! Que a força esteja com você, Pedro Victor!!");
          }
          return { ...task, count: newCount };
        }
        return task;
      })
    );
  };

  const handleRefresh = () => {
    setTasks(initialTasks);
    alert("Rotinas resetadas!");
  };

  return (
    <>
            
      <SidebarMenu></SidebarMenu>
      <IonPage id="main-content">
      <IonHeader mode="ios">
      <IonToolbar color="tertiary">
        <IonButtons slot="start">
          <IonMenuButton></IonMenuButton>
        </IonButtons>
        
        <IonTitle>Gohan Treinamentos 2025</IonTitle>
        
        <IonButtons slot="end">
          <IonButton onClick={handleRefresh}>
            <IonIcon icon={refreshOutline} />
          </IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>

        <IonContent className="ion-padding">
          <Box sx={{ flexGrow: 1 }}>
            <Container maxWidth="md" sx={{ overflowY: 'auto', maxHeight: '80vh' }}>
              <Typography variant="h5" align="center" gutterBottom>
                {formatDate()}
              </Typography>

              <HobbiesSection />

              <List>
                {tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onIncrement={handleIncrement}
                  />
                ))}
              </List>

              <ProgressBar totalCount={totalCount} maxCount={maxWeeklyCount} />
              <br />
              <br />
              <IonButton expand="block" onClick={() => SnackBar('top')}>
                Present Toast At the Top
              </IonButton>
            </Container>
          </Box>
        </IonContent>
      </IonPage>
    </>
  );
}

export default GohanTreinamentosHomePage;