import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonButtons,
  IonMenuButton,
  IonMenu,
  IonList,
  IonItem,
  IonLabel,
  IonMenuToggle,
} from '@ionic/react';
import {
  addOutline,
  homeOutline,
  listOutline,
  notificationsOutline,
  createOutline,
  trashOutline,
} from 'ionicons/icons';
import {
  Card,
  CardContent,
  CardHeader,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Button,
  Typography,
  Chip,
  IconButton,
  Box,
  Container,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import SidebarMenu from '../../widgets/side_menu';

interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'baixa' | 'normal' | 'alta';
  dueDate: string;
  status: 'pendente' | 'em_progresso' | 'concluida';
}



const TaskForm: React.FC<{
  task: Task;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onChange: (field: keyof Task, value: string) => void;
  isEditing: boolean;
}> = ({ task, onSubmit, onCancel, onChange, isEditing }) => {
  return (
    <Card>
      <CardContent>
        <form onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Título"
                value={task.title}
                onChange={(e) => onChange('title', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Descrição"
                value={task.description}
                onChange={(e) => onChange('description', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Prioridade</InputLabel>
                <Select
                  value={task.priority}
                  label="Prioridade"
                  onChange={(e) => onChange('priority', e.target.value)}
                >
                  <MenuItem value="baixa">Baixa</MenuItem>
                  <MenuItem value="normal">Normal</MenuItem>
                  <MenuItem value="alta">Alta</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="date"
                label="Data de Conclusão"
                value={task.dueDate}
                onChange={(e) => onChange('dueDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} container justifyContent="flex-end" spacing={1}>
              <Grid item>
                <Button variant="outlined" onClick={onCancel}>
                  Cancelar
                </Button>
              </Grid>
              <Grid item>
                <Button variant="contained" type="submit">
                  {isEditing ? 'Atualizar' : 'Adicionar'}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};

const TaskCard: React.FC<{
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: 'pendente' | 'em_progresso' | 'concluida') => void;
}> = ({ task, onEdit, onDelete, onStatusChange }) => {
  const getPriorityColor = (priority: string): "error" | "warning" | "success" | "default" => {
    switch (priority) {
      case 'alta':
        return 'error';
      case 'normal':
        return 'warning';
      case 'baixa':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Card>
      <CardHeader
        title={
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h6">{task.title}</Typography>
            <Chip
              label={task.priority}
              color={getPriorityColor(task.priority)}
              size="small"
            />
          </Box>
        }
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary" paragraph>
          {task.description}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          Prazo: {new Date(task.dueDate).toLocaleDateString('pt-BR')}
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <Select
            size="small"
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value as 'pendente' | 'em_progresso' | 'concluida')}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="pendente">Pendente</MenuItem>
            <MenuItem value="em_progresso">Em Progresso</MenuItem>
            <MenuItem value="concluida">Concluída</MenuItem>
          </Select>
          <Box>
            <IconButton onClick={() => onEdit(task)} size="small">
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => onDelete(task.id)} size="small" color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const TaskList: React.FC<{
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: 'pendente' | 'em_progresso' | 'concluida') => void;
}> = ({ tasks, onEdit, onDelete, onStatusChange }) => {
  if (tasks.length === 0) {
    return (
      <Box textAlign="center" py={5} color="text.secondary">
        <IonIcon
          icon={listOutline}
          style={{ fontSize: '48px', marginBottom: '1rem' }}
        />
        <Typography>Nenhuma tarefa cadastrada</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </Box>
  );
};

const TaskManagerPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<Task>({
    id: 0,
    title: '',
    description: '',
    priority: 'normal',
    dueDate: new Date().toISOString().split('T')[0],
    status: 'pendente',
  });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      setTasks(
        tasks.map((task) =>
          task.id === editingTask.id ? { ...newTask, id: task.id } : task
        )
      );
      setEditingTask(null);
    } else {
      setTasks([...tasks, { ...newTask, id: Date.now() }]);
    }
    setNewTask({
      id: 0,
      title: '',
      description: '',
      priority: 'normal',
      dueDate: new Date().toISOString().split('T')[0],
      status: 'pendente',
    });
    setIsFormOpen(false);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setNewTask(task);
    setIsFormOpen(true);
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleStatusChange = (taskId: number, newStatus: 'pendente' | 'em_progresso' | 'concluida') => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const handleTaskChange = (field: keyof Task, value: string) => {
    setNewTask({ ...newTask, [field]: value });
  };

  return (
    <>
      <SidebarMenu />
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Lista de Tarefas</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setIsFormOpen(true)}>
                <IonIcon slot="start" icon={addOutline} />
                Nova Tarefa
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonContent className="ion-padding">
          <Container maxWidth="md">
            {isFormOpen && (
              <TaskForm
                task={newTask}
                onSubmit={handleAddTask}
                onCancel={() => {
                  setIsFormOpen(false);
                  setEditingTask(null);
                }}
                onChange={handleTaskChange}
                isEditing={!!editingTask}
              />
            )}

            <TaskList
              tasks={tasks}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
          </Container>
        </IonContent>
      </IonPage>
    </>
  );
};

export default TaskManagerPage;