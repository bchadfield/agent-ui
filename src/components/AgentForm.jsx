import React from 'react';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Paper, Box } from '@mui/material';

const AgentForm = ({ agent, updateAgent, removeAgent }) => (
  <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
    <TextField
      fullWidth
      label="Agent Name"
      value={agent.name}
      onChange={(e) => updateAgent({ ...agent, name: e.target.value })}
      sx={{ mb: 2 }}
    />
    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel>Agent Type</InputLabel>
      <Select
        value={agent.type}
        label="Agent Type"
        onChange={(e) => updateAgent({ ...agent, type: e.target.value })}
      >
        <MenuItem value="search_agent">Search Agent</MenuItem>
        <MenuItem value="custom_agent">Custom Agent</MenuItem>
      </Select>
    </FormControl>
    <FormControl fullWidth sx={{ mb: 2 }}>
      <InputLabel>Ollama Model</InputLabel>
      <Select
        value={agent.model}
        label="Ollama Model"
        onChange={(e) => updateAgent({ ...agent, model: e.target.value })}
      >
        <MenuItem value="phi3:mini">Phi-3 Mini (3B)</MenuItem>
        <MenuItem value="gemma:2b">Gemma (2B)</MenuItem>
        <MenuItem value="llama3">Llama3 (8B)</MenuItem>
      </Select>
    </FormControl>
    {agent.type === 'search_agent' && (
      <TextField
        fullWidth
        label="Search Query"
        value={agent.searchQuery || ''}
        onChange={(e) => updateAgent({ ...agent, searchQuery: e.target.value })}
        sx={{ mb: 2 }}
      />
    )}
    {agent.type === 'custom_agent' && (
      <TextField
        fullWidth
        multiline
        rows={4}
        label="Custom Agent Configuration"
        value={agent.customConfig || ''}
        onChange={(e) => updateAgent({ ...agent, customConfig: e.target.value })}
        sx={{ mb: 2 }}
      />
    )}
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Button variant="outlined" color="error" onClick={() => removeAgent(agent.id)}>
        Remove Agent
      </Button>
    </Box>
  </Paper>
);

export default AgentForm;