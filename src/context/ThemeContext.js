"use client";
import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState("systems");

  // Restore theme from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("portfolio-theme");
      if (stored) setThemeState(stored);
    }
  }, []);

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("portfolio-theme", newTheme);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "systems" ? "narrative" : "systems");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
