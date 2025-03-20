import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Roboto Condensed, Arial, sans-serif',
    h1: {
      fontWeight: 700, // Negrita
    },
    h6: {
      fontWeight: 500,
    },
  },
});

export default theme;

