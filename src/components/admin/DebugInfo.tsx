"use client";

import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Collapse,
  Alert,
  Stack
} from '@mui/material';
import { ExpandMore, ExpandLess, BugReport } from '@mui/icons-material';

interface DebugInfoProps {
  data?: unknown;
  title?: string;
}

const DebugInfo: React.FC<DebugInfoProps> = ({ data, title = "Debug Info" }) => {
  const [open, setOpen] = useState(false);

  // Solo mostrar en desarrollo o si hay una flag específica
  const shouldShow = process.env.NODE_ENV === 'development' || 
                    typeof window !== 'undefined' && window.location.search.includes('debug=true');

  if (!shouldShow) {
    return null;
  }

  const debugData = {
    timestamp: new Date().toISOString(),
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Server',
    url: typeof window !== 'undefined' ? window.location.href : 'Server',
    environment: process.env.NODE_ENV,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Configurado' : 'No configurado',
    customData: data,
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        border: 2, 
        borderColor: 'warning.main',
        borderRadius: 2,
        mb: 2,
        overflow: 'hidden'
      }}
    >
      <Button
        fullWidth
        onClick={() => setOpen(!open)}
        startIcon={<BugReport />}
        endIcon={open ? <ExpandLess /> : <ExpandMore />}
        sx={{
          bgcolor: 'warning.50',
          color: 'warning.dark',
          py: 1.5,
          textTransform: 'none',
          fontWeight: 600,
          '&:hover': {
            bgcolor: 'warning.100'
          }
        }}
      >
        {title} (Click para expandir)
      </Button>
      
      <Collapse in={open}>
        <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Esta información de debug solo es visible en desarrollo o con ?debug=true
          </Alert>
          
          <Stack spacing={2}>
            <Typography variant="h6" color="text.primary">
              Información del Sistema
            </Typography>
            
            <Box component="pre" sx={{ 
              bgcolor: 'grey.900', 
              color: 'grey.100', 
              p: 2, 
              borderRadius: 1,
              fontSize: '0.75rem',
              overflow: 'auto',
              maxHeight: 400
            }}>
              {JSON.stringify(debugData, null, 2)}
            </Box>
            
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                navigator.clipboard.writeText(JSON.stringify(debugData, null, 2));
                alert('Debug info copiada al clipboard');
              }}
              sx={{ alignSelf: 'flex-start' }}
            >
              Copiar Debug Info
            </Button>
          </Stack>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default DebugInfo;
