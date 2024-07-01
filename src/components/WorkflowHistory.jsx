import React from 'react';
import { List, ListItem, ListItemText, Paper, Typography } from '@mui/material';

const WorkflowHistory = ({ history, onHistoryItemClick }) => (
  <Paper elevation={3} sx={{ p: 2, mt: 2, maxHeight: 300, overflow: 'auto' }}>
    <Typography variant="h6" sx={{ mb: 2 }}>Workflow History</Typography>
    <List>
      {history.map((item) => (
        <ListItem 
          button 
          key={item.id} 
          onClick={() => onHistoryItemClick(item.config)}
          sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
        >
          <ListItemText 
            primary={`Workflow ${item.id}`} 
            secondary={new Date(item.timestamp).toLocaleString()} 
          />
        </ListItem>
      ))}
    </List>
  </Paper>
);

export default WorkflowHistory;