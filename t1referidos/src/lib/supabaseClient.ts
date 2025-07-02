import { createClient } from '@supabase/supabase-js';

// Obtener las variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validar que las variables de entorno estén definidas
if (!supabaseUrl) {
  throw new Error("Supabase URL is not defined. Please check your .env.local file.");
}

if (!supabaseAnonKey) {
  throw new Error("Supabase anonymous key is not defined. Please check your .env.local file.");
}

// Crear y exportar el cliente de Supabase
// Usamos un assertion non-null (!) porque ya hemos validado arriba,
// pero TypeScript podría no inferirlo correctamente en todos los contextos.
export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);
