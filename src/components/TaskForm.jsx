import React from 'react';
import { TextField, Button, Paper, Box } from '@mui/material';

const TaskForm = ({ task, updateTask, removeTask }) => (
  <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
    <TextField
      fullWidth
      label="Task Description"
      value={task.description}
      onChange={(e) => updateTask({ ...task, description: e.target.value })}
      sx={{ mb: 2 }}
    />
    <TextField
      fullWidth
      label="Input Agent"
      value={task.inputAgent}
      onChange={(e) => updateTask({ ...task, inputAgent: e.target.value })}
      sx={{ mb: 2 }}
    />
    <TextField
      fullWidth
      label="Output Agent"
      value={task.outputAgent}
      onChange={(e) => updateTask({ ...task, outputAgent: e.target.value })}
      sx={{ mb: 2 }}
    />
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Button variant="outlined" color="error" onClick={() => removeTask(task.id)}>
        Remove Task
      </Button>
    </Box>
  </Paper>
);

export default TaskForm;