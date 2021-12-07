import { createTheme } from '@mui/material';

export const MainTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      dark: '#9a3a3a',
      main: '#c04848',
      light: '#cd6d6d',
      contrastText: '#ffffff'
    }
  },
  typography: {
    fontFamily: 'Nunito, sans-serif'
  }
});

export default MainTheme;
