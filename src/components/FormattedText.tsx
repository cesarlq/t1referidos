import React from 'react';
import { Typography, TypographyProps } from '@mui/material';

interface FormattedTextProps extends Omit<TypographyProps, 'children'> {
  content: string;
  fallback?: string;
}

/**
 * Componente para mostrar texto formateado con HTML de manera segura
 * Preserva espacios, tabs y saltos de línea convertidos a HTML
 */
const FormattedText: React.FC<FormattedTextProps> = ({ 
  content, 
  fallback = '', 
  sx,
  ...props 
}) => {
  if (!content) {
    return fallback ? (
      <Typography {...props} sx={sx}>
        {fallback}
      </Typography>
    ) : null;
  }

  return (
    <Typography
      {...props}
      sx={{
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        '& br': { 
          display: 'block', 
          content: '""', 
          marginTop: '0.5em' 
        },
        ...sx
      }}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default FormattedText;
