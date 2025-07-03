'use client'; // Mark this as a Client Component

import React from 'react';
import { ThemeProvider as MUIThemeProvider, CssBaseline } from '@mui/material';
import theme from '@/styles/theme'; // Adjust path if needed

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
}
