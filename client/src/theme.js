import { createContext, useState, useMemo } from 'react';
import { createTheme } from '@mui/material/styles';


export const tokens = (mode) => ({
  ...(mode === 'dark'
  ? {
    grey: {
        100: "#e0e0e0",
        200: "#c2c2c2",
        300: "#a3a3a3",
        400: "#858585",
        500: "#666666",
        600: "#525252",
        700: "#3d3d3d",
        800: "#292929",
        900: "#141414"
    },
    primary: {
        100: "#d0d1d5",
        200: "#a1a4ab",
        300: "#727681",
        400: "#434957",
        500: "#141b2d",
        600: "#101624",
        700: "#0c101b",
        800: "#080b12",
        900: "#040509"
    },
    greenAccent: {
        100: "#dbf5ee",
        200: "#b7ebde",
        300: "#94e2cd",
        400: "#70d8bd",
        500: "#4cceac",
        600: "#3da58a",
        700: "#2e7c67",
        800: "#1e5245",
        900: "#0f2922"
    },
    redAccent: {
        100: "#f8dcdb",
        200: "#f1b9b7",
        300: "#e99592",
        400: "#e2726e",
        500: "#db4f4a",
        600: "#af3f3b",
        700: "#832f2c",
        800: "#58201e",
        900: "#2c100f"
    },
    blueAccent: {
        100: "#e1e2fe",
        200: "#c3c6fd",
        300: "#a4a9fc",
        400: "#868dfb",
        500: "#6870fa",
        600: "#535ac8",
        700: "#3e4396",
        800: "#2a2d64",
        900: "#151632"
    },
  } : {
    grey: {
        100: "#141414",
        200: "#292929",
        300: "#3d3d3d",
        400: "#525252",
        500: "#666666",
        600: "#858585",
        700: "#a3a3a3",
        800: "#c2c2c2",
        900: "#e0e0e0",
    },
    primary: {
        100: "#040509",
        200: "#080b12",
        300: "#0c101b",
        400: "#f2f0f0",
        500: "#141b2d",
        600: "#434957",
        700: "#727681",
        800: "#a1a4ab",
        900: "#d0d1d5",
    },
    greenAccent: {
        100: "#0f2922",
        200: "#1e5245",
        300: "#2e7c67",
        400: "#3da58a",
        500: "#4cceac",
        600: "#70d8bd",
        700: "#94e2cd",
        800: "#b7ebde",
        900: "#dbf5ee",
    },
    redAccent: {
        100: "#2c100f",
        200: "#58201e",
        300: "#832f2c",
        400: "#af3f3b",
        500: "#db4f4a",
        600: "#e2726e",
        700: "#e99592",
        800: "#f1b9b7",
        900: "#f8dcdb",
    },
    blueAccent: {
        100: "#151632",
        200: "#2a2d64",
        300: "#3e4396",
        400: "#535ac8",
        500: "#6870fa",
        600: "#868dfb",
        700: "#a4a9fc",
        800: "#c3c6fd",
        900: "#e1e2fe",
    },
  }),
});


export const themeSettings = (mode) => {
    const colors = tokens(mode);
    const isDark = mode === 'dark';
    const titleColor = isDark ? '#f8fafc' : '#111827';
    const copyColor = isDark ? '#94a3b8' : '#57534e';
    const borderColor = isDark ? 'rgba(148, 163, 184, 0.16)' : 'rgba(28, 25, 23, 0.08)';
    const surfaceColor = isDark ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.92)';
    const accentColor = isDark ? '#5eead4' : '#0f766e';

    return {
        palette: {
            mode: mode,
            ...(mode === 'dark'
            ? {
                primary: {
                    main: colors.primary[500],
                },
                secondary: {
                    main: colors.greenAccent[500],
                },
                neutral: {
                    dark: colors.grey[700],
                    main: colors.grey[500],
                    light: colors.grey[100]
                },
                background:{
                    default: colors.primary[500],
                }
            } : {
                primary: {
                    main: colors.primary[100],
                },
                secondary: {
                    main: colors.greenAccent[500],
                },
                neutral: {
                    dark: colors.grey[700],
                    main: colors.grey[500],
                    light: colors.grey[100]
                },
                background:{
                    default: '#fcfcfc',
                },
            }),
        },
            shape: {
                borderRadius: 16,
            },
            typography: {
                fontFamily: ["Source Sans Pro", "Inter", "Segoe UI", "Arial", "sans-serif"].join(","),
                fontSize: 12,
                h1: {
                    fontFamily: ["Source Sans Pro", "Inter", "Segoe UI", "Arial", "sans-serif"].join(","),
                    fontSize: 40,
                    fontWeight: 800,
                },
                h2: {
                    fontFamily: ["Source Sans Pro", "Inter", "Segoe UI", "Arial", "sans-serif"].join(","),
                    fontSize: 32,
                    fontWeight: 800,
                },
                h3: {
                    fontFamily: ["Source Sans Pro", "Inter", "Segoe UI", "Arial", "sans-serif"].join(","),
                    fontSize: 24,
                    fontWeight: 800,
                },
                h4: {
                    fontFamily: ["Source Sans Pro", "Inter", "Segoe UI", "Arial", "sans-serif"].join(","),
                    fontSize: 20,
                    fontWeight: 800,
                },
                h5: {
                    fontFamily: ["Source Sans Pro", "Inter", "Segoe UI", "Arial", "sans-serif"].join(","),
                    fontSize: 16,
                    fontWeight: 800,
                },
                h6: {
                    fontFamily: ["Source Sans Pro", "Inter", "Segoe UI", "Arial", "sans-serif"].join(","),
                    fontSize: 14,
                    fontWeight: 800,
                },
            },
            components: {
                MuiCssBaseline: {
                    styleOverrides: {
                        html: {
                            minHeight: '100%',
                        },
                        body: {
                            minHeight: '100vh',
                            margin: 0,
                            fontFamily: '"Source Sans Pro", Inter, "Segoe UI", Arial, sans-serif',
                            WebkitFontSmoothing: 'antialiased',
                            MozOsxFontSmoothing: 'grayscale',
                        },
                        '#root': {
                            minHeight: '100%',
                        },
                        code: {
                            fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, "Courier New", monospace',
                        },
                    },
                },
                MuiButton: {
                    defaultProps: {
                        disableElevation: true,
                    },
                    styleOverrides: {
                        root: {
                            borderRadius: 14,
                            minHeight: 42,
                            textTransform: 'none',
                            fontWeight: 700,
                            letterSpacing: 0,
                        },
                        contained: {
                            background: 'linear-gradient(135deg, #0f766e 0%, #1d4ed8 100%)',
                            color: '#f8fafc',
                            boxShadow: isDark ? '0 16px 28px rgba(2, 6, 23, 0.28)' : '0 16px 28px rgba(29, 78, 216, 0.18)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #0d9488 0%, #2563eb 100%)',
                            },
                            '&.Mui-disabled': {
                                background: isDark ? 'rgba(148, 163, 184, 0.16)' : 'rgba(17, 24, 39, 0.12)',
                                color: isDark ? 'rgba(226, 232, 240, 0.42)' : 'rgba(17, 24, 39, 0.38)',
                            },
                        },
                        outlined: {
                            borderColor,
                            color: titleColor,
                            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.48)' : 'rgba(255, 255, 255, 0.62)',
                            '&:hover': {
                                borderColor: accentColor,
                                backgroundColor: isDark ? 'rgba(20, 184, 166, 0.12)' : 'rgba(14, 116, 144, 0.08)',
                            },
                        },
                    },
                },
                MuiCard: {
                    styleOverrides: {
                        root: {
                            borderRadius: 24,
                            border: `1px solid ${borderColor}`,
                            backgroundImage: 'none',
                            backgroundColor: surfaceColor,
                            color: titleColor,
                        },
                    },
                },
                MuiPaper: {
                    styleOverrides: {
                        root: {
                            backgroundImage: 'none',
                            backgroundColor: surfaceColor,
                        },
                    },
                },
                MuiDialog: {
                    styleOverrides: {
                        paper: {
                            borderRadius: 24,
                            border: `1px solid ${borderColor}`,
                            backgroundImage: 'none',
                            backgroundColor: surfaceColor,
                        },
                    },
                },
                MuiTextField: {
                    defaultProps: {
                        variant: 'outlined',
                    },
                },
                MuiOutlinedInput: {
                    styleOverrides: {
                        root: {
                            borderRadius: 14,
                            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.54)' : 'rgba(255, 255, 255, 0.74)',
                            color: titleColor,
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor,
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: accentColor,
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: accentColor,
                                borderWidth: 1,
                            },
                        },
                        input: {
                            '&::placeholder': {
                                color: copyColor,
                                opacity: 1,
                            },
                        },
                    },
                },
                MuiInputLabel: {
                    styleOverrides: {
                        root: {
                            color: copyColor,
                            '&.Mui-focused': {
                                color: accentColor,
                            },
                        },
                    },
                },
                MuiChip: {
                    styleOverrides: {
                        root: {
                            borderRadius: 999,
                            fontWeight: 700,
                            letterSpacing: 0,
                        },
                    },
                },
                MuiAlert: {
                    styleOverrides: {
                        root: {
                            borderRadius: 16,
                        },
                    },
                },
                MuiIconButton: {
                    styleOverrides: {
                        root: {
                            color: titleColor,
                        },
                    },
                },
            },
    };
};

export const ColorModeContext = createContext ({
    toggleColorMode: () => {}
});

export const useMode = () => {
    const [mode, setMode] = useState("dark");

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => 
            setMode((prev) => (prev === 'light' ? 'dark' : 'light')),
        }),
        []
    );
    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

    return [theme, colorMode];
 }
