"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { Box, Typography, FormHelperText } from '@mui/material';

// Importar dinámicamente para evitar problemas de SSR
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  label,
  error = false,
  helperText,
  disabled = false,
  required = false
}) => {
  return (
    <Box>
      {label && (
        <Typography 
          variant="body2" 
          component="label"
          sx={{ 
            display: 'block',
            mb: 1,
            fontWeight: 500,
            color: error ? 'error.main' : 'text.primary'
          }}
        >
          {label}
          {required && (
            <Typography component="span" color="error.main" sx={{ ml: 0.5 }}>
              *
            </Typography>
          )}
        </Typography>
      )}
      
      <Box
        sx={{
          border: 1,
          borderColor: error ? 'error.main' : 'divider',
          borderRadius: 1,
          overflow: 'hidden',
          '& .w-md-editor': {
            backgroundColor: disabled ? 'action.disabledBackground' : 'background.paper',
          },
          '& .w-md-editor-text-pre, & .w-md-editor-text-input, & .w-md-editor-text': {
            fontSize: '14px !important',
            fontFamily: '"Roboto","Helvetica","Arial",sans-serif !important',
          },
          '& .w-md-editor.w-md-editor-focus': {
            borderColor: error ? 'error.main' : 'primary.main',
            boxShadow: error 
              ? '0 0 0 1px rgba(211, 47, 47, 0.25)' 
              : '0 0 0 1px rgba(25, 118, 210, 0.25)',
          }
        }}
      >
        <MDEditor
          value={value}
          onChange={(val) => onChange(val || '')}
          preview="edit"
          hideToolbar={disabled}
          visibleDragbar={false}
          data-color-mode="light"
          height={200}
          style={{
            backgroundColor: disabled ? '#f5f5f5' : 'white',
          }}
        />
      </Box>
      
      {helperText && (
        <FormHelperText error={error} sx={{ mt: 0.5, mx: 1.75 }}>
          {helperText}
        </FormHelperText>
      )}
    </Box>
  );
};

export default RichTextEditor;
