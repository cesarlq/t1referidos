"use client";

import React from 'react';
import { Box } from '@mui/material';

interface HTMLRendererProps {
  content: string;
  maxLines?: number;
  sx?: object;
}

const HTMLRenderer: React.FC<HTMLRendererProps> = ({ 
  content, 
  maxLines,
  sx = {} 
}) => {
  // Función para limpiar y sanitizar el HTML básico
  const sanitizeHTML = (html: string) => {
    // Convertir markdown básico a HTML si es necesario
    const sanitized = html
      // Convertir **texto** a <strong>texto</strong>
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Convertir *texto* a <em>texto</em>
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Convertir saltos de línea a <br>
      .replace(/\n/g, '<br>')
      // Convertir dobles saltos de línea a párrafos
      .replace(/<br><br>/g, '</p><p>')
      // Envolver en párrafos si no hay etiquetas HTML
      .replace(/^(?!<)/, '<p>')
      .replace(/(?!>)$/, '</p>');

    return sanitized;
  };

  const processedContent = sanitizeHTML(content);

  return (
    <Box
      sx={{
        '& p': {
          margin: '0 0 8px 0',
          '&:last-child': {
            marginBottom: 0
          }
        },
        '& strong': {
          fontWeight: 600
        },
        '& em': {
          fontStyle: 'italic'
        },
        '& ul, & ol': {
          margin: '8px 0',
          paddingLeft: '20px'
        },
        '& li': {
          marginBottom: '4px'
        },
        '& br': {
          lineHeight: 1.5
        },
        // Limitar líneas si se especifica
        ...(maxLines && {
          display: '-webkit-box',
          WebkitLineClamp: maxLines,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }),
        ...sx
      }}
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
};

export default HTMLRenderer;
