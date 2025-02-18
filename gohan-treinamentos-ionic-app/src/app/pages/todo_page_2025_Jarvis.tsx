import React, { useState, useCallback } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonList,
  IonItem,
  IonLabel,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonProgressBar,
  IonToolbar,
  IonButtons,
  IonMenuButton,
} from "@ionic/react";
import { 
  Checkbox,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Box
} from "@mui/material";

const TodoPageDashboard = () => {  const [habits, setHabits] = useState([
    {
      id: 1,
      category: "Treino Físico",
      items: ["Treino HIIT (15 min)", "Alongamento", "Caminhada ou corrida"]
    },
    {
      id: 2,
      category: "Estudos",
      items: [
        "Eletromagnetismo (2h)",
        "Circuitos Elétricos (2h)",
        "Revisar exercícios do Sadiku"
      ]
    },
    {
      id: 3,
      category: "Espiritualidade",
      items: ["Meditação (15 min)", "Leitura espiritual (30 min)"]
    },
    {
      id: 4,
      category: "Desenvolvimento Pessoal",
      items: [
        "Leitura de mindset (30 min)",
        "Planejamento do dia",
        "Revisão semanal"
      ]
    },
  ]);

  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});
  const [stats, setStats] = useState({
    totalCompleted: 0,
    totalItems: 0,
    progress: 0,
  });

  const handleCheck = useCallback((habitId: number, itemIndex: number) => {
    setCompletedItems((prev) => {
      const key = `${habitId}-${itemIndex}`;
      const newState = { ...prev, [key]: !prev[key] };

      const completed = Object.values(newState).filter(Boolean).length;
      const total = habits.reduce((acc, habit) => acc + habit.items.length, 0);

      setStats({
        totalCompleted: completed,
        totalItems: total,
        progress: Math.round((completed / total) * 100),
      });

      return newState;
    });
  }, [habits]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Hábitos Diários</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding">
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Tarefas do Dia
            </Typography>

            <Typography>
              Teste de widgets
            </Typography>

            <IonList>
              {habits.map((habit) => (
                <Card key={habit.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {habit.category}
                    </Typography>
                    {habit.items.map((item, index) => {
                      const isChecked = completedItems[`${habit.id}-${index}`];
                      return (
                        <IonItem key={index} lines="none">
                          <Checkbox
                            checked={isChecked}
                            onChange={() => handleCheck(habit.id, index)}
                          />
                          <IonLabel>{item}</IonLabel>
                        </IonItem>
                      );
                    })}
                  </CardContent>
                </Card>
              ))}
            </IonList>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Dashboard
            </Typography>
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Progresso</Typography>
                <Typography variant="body1" fontWeight="bold">
                  {stats.progress}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={stats.progress} 
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>

            <IonGrid>
              <IonRow>
                <IonCol>
                  <Box sx={{ bgcolor: '#e3f2fd', p: 2, borderRadius: 2 }}>
                    <Typography variant="h4" color="primary">
                      {stats.totalCompleted}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completados
                    </Typography>
                  </Box>
                </IonCol>
                <IonCol>
                  <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 2 }}>
                    <Typography variant="h4" color="text.secondary">
                      {stats.totalItems}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total
                    </Typography>
                  </Box>
                </IonCol>
              </IonRow>
            </IonGrid>
          </CardContent>
        </Card>
      </IonContent>
    </IonPage>
  );
};

export default TodoPageDashboard;
