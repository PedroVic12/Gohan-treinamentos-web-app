import React from 'react';
import { Paper, ListItem, ListItemText } from '@mui/material';
import { TaskCounter } from './TaskCounter';
import { Task } from '../types/Task';

interface TaskItemProps {
  task: Task;
  onIncrement: (id: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onIncrement }) => {
  return (
    <Paper 
      elevation={2} 
      sx={{ 
        mb: 2,
        backgroundColor: task.count >= 7 ? '#e8f5e9' : 'white'
      }}
    >
      <ListItem
        secondaryAction={
          <TaskCounter 
            count={task.count}
            onIncrement={() => onIncrement(task.id)}
          />
        }
      >
        <ListItemText
          primary={task.title}
          secondary={task.description}
          primaryTypographyProps={{
            fontWeight: 'medium'
          }}
        />
      </ListItem>
    </Paper>
  );
};