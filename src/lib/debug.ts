// Utilidad para debugging en producción
export const debugLog = (message: string, data?: unknown) => {
  if (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_DEBUG === 'true') {
    console.log(`[DEBUG] ${message}`, data);
  }
};

export const debugError = (message: string, error?: unknown) => {
  console.error(`[ERROR] ${message}`, error);
};

// Función para verificar variables de entorno críticas
export const checkEnvironmentVariables = () => {
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ];

  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0) {
    debugError('Missing environment variables:', missing);
    return false;
  }
  
  debugLog('All required environment variables are present');
  return true;
};
