import { createTheme } from '@mui/material/styles';

// Paleta de cores para o tema claro com um visual mais "clean"
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // Um azul clássico e limpo
    },
    secondary: {
      main: '#9c27b0', // Roxo como cor secundária
    },
    background: {
      default: '#f4f6f8', // Um cinza muito claro para o fundo, menos "duro" que o branco puro
      paper: '#ffffff', // Branco puro para os componentes em primeiro plano, para criar contraste
    },
  },
});


// Paleta de cores para o tema escuro com um visual mais "clean"
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9', // Azul claro, bom para contraste
    },
    secondary: {
      main: '#f48fb1', // Rosa claro
    },
    background: {
      default: '#121212', // Padrão do Material Design para fundo escuro
      paper: '#1e1e1e', // Um cinza um pouco mais claro para "elevar" componentes como cards
    },
  },
});
