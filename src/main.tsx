import { createRoot } from 'react-dom/client'

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import App from './App.tsx'

import './app.css'


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: "#8c9eff",
    },
    secondary: {
      main: '#8c9eff',
    },
  },
});

createRoot(document.getElementById('root')!).render(
    <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <App />
    </ThemeProvider>
)
