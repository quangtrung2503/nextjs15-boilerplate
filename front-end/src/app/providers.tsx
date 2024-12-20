"use client";

import darkTheme from "@/themes/darkTheme";
import lightTheme from "@/themes/lightTheme";
import { ThemeProvider as MUIThemeProvider } from '@mui/material';
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { useEffect, useState } from "react";
import { ThemeProvider, useThemeContext } from "../themes/ThemeProvider";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

export function Providers({ children }: { children: React.ReactNode }) {
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []); // add empty array as second argument to run only once

    if (!hasMounted) {
        return null;
    }

    // If the component has mounted, return a set of providers.
    return (
      
    <LocalizationProvider dateAdapter={AdapterMoment}>
        <ThemeProvider>
            <AppRouterCacheProvider options={{ enableCssLayer: true, key: 'css' }}>
                <WrappedThemeProvider>{children}</WrappedThemeProvider>
            </AppRouterCacheProvider>
        </ThemeProvider>
    </LocalizationProvider>
    );
}

const WrappedThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const { theme } = useThemeContext();

    const currentTheme = theme === "light" ? lightTheme : darkTheme;

    return (
        <MUIThemeProvider theme={currentTheme} >
            {children}
        </MUIThemeProvider>
    );
};