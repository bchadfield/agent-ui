import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const ResultDisplay = ({ result }) => (
  <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
    <Typography variant="h6">Result:</Typography>
    <Box component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
      {JSON.stringify(result, null, 2)}
    </Box>
  </Paper>
);

export default ResultDisplay;