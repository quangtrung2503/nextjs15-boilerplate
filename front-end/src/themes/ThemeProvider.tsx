"use client";
import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

const ThemeContext = createContext<{ theme: string; setTheme: Dispatch<SetStateAction<string>> }>({
  theme: "light",
  setTheme: () => { },
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {

  const defaultTheme = "light";
  const [theme, setTheme] = useState(defaultTheme);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => useContext(ThemeContext);