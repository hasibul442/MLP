import { createTheme } from '@mui/material/styles';

const muiTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#76d3ff',
      light: '#9fe4ff',
      dark: '#5ab8e6',
    },
    secondary: {
      main: '#8fd6ff',
      light: '#b3e5ff',
      dark: '#6bc1e6',
    },
    background: {
      default: '#0a0e1a',
      paper: 'rgba(14, 22, 40, 0.9)',
    },
    text: {
      primary: '#f3f8ff',
      secondary: '#c8d7e8',
    },
    divider: 'rgba(126, 160, 255, 0.24)',
    error: {
      main: '#ff6b6b',
    },
    success: {
      main: '#51cf66',
    },
    info: {
      main: '#76d3ff',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 700,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: '0 14px 32px rgba(4, 10, 25, 0.35)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: '8px',
        },
        outlined: {
          borderColor: '#76d3ff',
          color: '#76d3ff',
          '&:hover': {
            borderColor: '#9fe4ff',
            backgroundColor: 'rgba(118, 211, 255, 0.08)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
        },
        standardError: {
          backgroundColor: 'rgba(255, 107, 107, 0.15)',
          color: '#ff6b6b',
          border: '1px solid rgba(255, 107, 107, 0.3)',
        },
      },
    },
  },
});

export default muiTheme;
