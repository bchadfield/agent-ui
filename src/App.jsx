import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Alert, CssBaseline, ThemeProvider, TextField } from '@mui/material';
import axios from 'axios';
import AgentForm from './components/AgentForm';
import TaskForm from './components/TaskForm';
import ResultDisplay from './components/ResultDisplay';
import WorkflowHistory from './components/WorkflowHistory';
import theme from './theme';

function App() {
  const [agents, setAgents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [workflowInput, setWorkflowInput] = useState('');
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const addAgent = () => {
    setAgents([...agents, { id: Date.now(), name: '', type: 'search_agent', model: 'llama2' }]);
  };

  const updateAgent = (updatedAgent) => {
    setAgents(agents.map(agent => agent.id === updatedAgent.id ? updatedAgent : agent));
  };

  const removeAgent = (id) => {
    setAgents(agents.filter(agent => agent.id !== id));
  };

  const addTask = () => {
    setTasks([...tasks, { id: Date.now(), description: '', inputAgent: '', outputAgent: '' }]);
  };

  const updateTask = (updatedTask) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const submitConfig = async () => {
    try {
      setError(null);
      setResult(null);
      console.log('Sending config:', { agents, tasks });  // Log what you're sending
      const response = await axios.post('http://localhost:8000/run-workflow', { agents, tasks });
      setResult(response.data.result);
    } catch (error) {
      console.error('Error response:', error.response);  // Log the full error response
      setError(error.response?.data?.detail || 'An error occurred');
    }
  };

  useEffect(() => {
    fetchWorkflowHistory();
  }, []);

  const fetchWorkflowHistory = async () => {
    try {
      const response = await axios.get('http://localhost:8000/workflow-history');
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching workflow history:', error);
    }
  };

  const loadConfig = (config) => {
    setAgents(config.agents);
    setTasks(config.tasks);
    setWorkflowInput(config.workflowInput);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ maxWidth: 800, margin: 'auto', p: 2 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>LangGraph Workflow Configuration</Typography>
        
        <Typography variant="h5" sx={{ mb: 2 }}>Agents</Typography>
        {agents.map(agent => (
          <AgentForm key={agent.id} agent={agent} updateAgent={updateAgent} removeAgent={removeAgent} />
        ))}
        <Button variant="contained" onClick={addAgent} sx={{ mb: 2 }}>Add Agent</Button>

        <Typography variant="h5" sx={{ mb: 2, mt: 4 }}>Tasks</Typography>
        {tasks.map(task => (
          <TaskForm key={task.id} task={task} updateTask={updateTask} removeTask={removeTask} />
        ))}
        <Button variant="contained" onClick={addTask} sx={{ mb: 2 }}>Add Task</Button>

        <Typography variant="h5" sx={{ mb: 2, mt: 4 }}>Workflow Input</Typography>
        <TextField
          fullWidth
          multiline
          rows={3}
          value={workflowInput}
          onChange={(e) => setWorkflowInput(e.target.value)}
          placeholder="Enter the input for your workflow"
          sx={{ mb: 2 }}
        />

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" color="primary" onClick={submitConfig}>
            Run Workflow
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        {result && <ResultDisplay result={result} />}

        <WorkflowHistory history={history} onHistoryItemClick={loadConfig} />
      </Box>
    </ThemeProvider>
  );
}

export default App;