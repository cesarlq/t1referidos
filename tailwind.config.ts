import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#db3b2b',
        primary_hover: '#a30000',
        secondary: '#fadede',
        error: '#FF0000',
        text_primary_dark: '#4c4c4c',
        border_input: '#E7E7E7',
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
      },
      borderRadius: { // Añadiendo border radius del theme MUI
        'DEFAULT': '10px', // Para botones y inputs generales si se usa 'rounded'
        'lg': '10px', // Alineado con los 10px
        'xl': '12px', // Para elementos que usan 12px como MuiTextField
        'md': '7px', // Para MuiPaper, MuiAlert, etc.
      }
    },
  },
  plugins: [],
};
export default config;
