"use client";

import {
    createDOMRenderer,
    FluentProvider,
    makeStyles,
    RendererProvider,
    SSRProvider,
    tokens,
    webDarkTheme,
    webLightTheme,
} from "@fluentui/react-components";
import { useEffect, useState } from "react";
import { ThemeProvider, useThemeContext } from "../themes/ThemeProvider";

const renderer = createDOMRenderer();
/**
 * https://react.fluentui.dev/?path=/docs/theme-colors--docs
 */
const useStyles = makeStyles({
    root: {
        backgroundColor: tokens.colorNeutralBackground1,
    },
});

export function Providers({ children }: { children: React.ReactNode }) {
    // Declare a state variable named 'hasMounted' and a function named 'setHasMounted' to update it.
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setHasMounted(true);
    }, []); // add empty array as second argument to run only once

    if (!hasMounted) {
        return null;
    }

    // If the component has mounted, return a set of providers.
    return (
        <ThemeProvider>
            <RendererProvider renderer={renderer}>
                <SSRProvider>
                    <WrappedFluentProvider>{children}</WrappedFluentProvider>
                </SSRProvider>
            </RendererProvider>
        </ThemeProvider>
    );
}

const WrappedFluentProvider = ({ children }: { children: React.ReactNode }) => {
    const styles = useStyles();
    const { theme } = useThemeContext();

    const currentTheme = theme === "light" ? webLightTheme : webDarkTheme;

    return (
        <FluentProvider theme={currentTheme} className={styles.root}>
            {children}
        </FluentProvider>
    );
};