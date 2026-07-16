"use client";

import { createTheme } from "@mui/material/styles";

// HIWE 主题：teal 主调 + neutral 4 步灰阶，关闭 Material 动画/ripple
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2487ca",
      dark: "#1d6fb0",
      light: "#3a9de0",
      contrastText: "#FFFFFF",
    },
    text: {
      primary: "#171717",
      secondary: "#4D4D4D",
      disabled: "#888888",
    },
    background: {
      default: "#FFFFFF",
      paper: "#FFFFFF",
    },
    divider: "#EBEBEB",
    grey: {
      50: "#FAFAFA",
      100: "#F5F5F5",
      200: "#EBEBEB",
      300: "#E5E7EB",
      400: "#A1A1A1",
      500: "#888888",
      600: "#6B7280",
      700: "#4D4D4D",
      800: "#262626",
      900: "#171717",
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily:
      'var(--font-inter), var(--font-noto), "Helvetica Neue", Arial, sans-serif',
    fontSize: 14,
    h1: { fontWeight: 600, fontSize: "2.25rem", lineHeight: 1.2 },
    h2: { fontWeight: 600, fontSize: "1.75rem", lineHeight: 1.3 },
    h3: { fontWeight: 600, fontSize: "1.375rem", lineHeight: 1.3 },
    h4: { fontWeight: 600, fontSize: "1.125rem", lineHeight: 1.4 },
    h5: { fontWeight: 600, fontSize: "1rem", lineHeight: 1.4 },
    h6: { fontWeight: 600, fontSize: "0.875rem", lineHeight: 1.4 },
    body1: { fontSize: "0.875rem", lineHeight: 1.5 },
    body2: { fontSize: "0.8125rem", lineHeight: 1.5 },
    button: { fontWeight: 500, textTransform: "none" },
  },
  // 关闭大部分阴影，只保留 1 级（模拟 hairline border）
  shadows: [
    "none",
    "0 1px 1px rgba(0,0,0,0.02), 0 2px 2px rgba(0,0,0,0.04)",
    "0 1px 1px rgba(0,0,0,0.02), 0 2px 2px rgba(0,0,0,0.04)",
    "0 1px 1px rgba(0,0,0,0.02), 0 2px 2px rgba(0,0,0,0.04)",
    "0 1px 1px rgba(0,0,0,0.02), 0 2px 2px rgba(0,0,0,0.04)",
    "0 1px 1px rgba(0,0,0,0.02), 0 2px 2px rgba(0,0,0,0.04)",
    "0 1px 1px rgba(0,0,0,0.02), 0 2px 2px rgba(0,0,0,0.04)",
    "0 1px 1px rgba(0,0,0,0.02), 0 2px 2px rgba(0,0,0,0.04)",
    "0 1px 1px rgba(0,0,0,0.02), 0 2px 2px rgba(0,0,0,0.04)",
    "0 1px 1px rgba(0,0,0,0.02), 0 2px 2px rgba(0,0,0,0.04)",
    "0 1px 1px rgba(0,0,0,0.02), 0 2px 2px rgba(0,0,0,0.04)",
    "0 1px 1px rgba(0,0,0,0.02), 0 2px 2px rgba(0,0,0,0.04)",
    "0 1px 1px rgba(0,0,0,0.02), 0 2px 2px rgba(0,0,0,0.04)",
    "0 1px 1px rgba(0,0,0,0.02), 0 2px 2px rgba(0,0,0,0.04)",
    "0 1px 1px rgba(0,0,0,0.02), 0 2px 2px rgba(0,0,0,0.04)",
    "0 1px 1px rgba(0,0,0,0.02), 0 2px 2px rgba(0,0,0,0.04)",
    "0 1px 1px rgba(0,0,0,0.02), 0 2px 2px rgba(0,0,0,0.04)",
    "0 1px 1px rgba(0,0,0,0.02), 0 2px 2px rgba(0,0,0,0.04)",
    "0 1px 1px rgba(0,0,0,0.02), 0 2px 2px rgba(0,0,0,0.04)",
    "0 1px 1px rgba(0,0,0,0.02), 0 2px 2px rgba(0,0,0,0.04)",
    "0 1px 1px rgba(0,0,0,0.02), 0 2px 2px rgba(0,0,0,0.04)",
    "0 1px 1px rgba(0,0,0,0.02), 0 2px 2px rgba(0,0,0,0.04)",
    "0 1px 1px rgba(0,0,0,0.02), 0 2px 2px rgba(0,0,0,0.04)",
    "0 1px 1px rgba(0,0,0,0.02), 0 2px 2px rgba(0,0,0,0.04)",
    "0 1px 1px rgba(0,0,0,0.02), 0 2px 2px rgba(0,0,0,0.04)",
  ],
  transitions: {
    create: () => "none",
    duration: {
      shortest: 0,
      shorter: 0,
      short: 0,
      standard: 0,
      complex: 0,
      enteringScreen: 0,
      leavingScreen: 0,
    },
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
        disableTouchRipple: true,
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          borderRadius: 8,
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          border: "1px solid #EBEBEB",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: "small",
      },
    },
    MuiTooltip: {
      defaultProps: {
        arrow: false,
      },
    },
  },
});

export default theme;
