"use client";
import { createContext, useContext } from "react";
import { usePathname } from "next/navigation";

const ThemeContext = createContext(null);

/** The two viewing modes, and the route each one lives at. */
export const MODE_PATHS = {
  systems: "/",
  narrative: "/narrative",
};

export function themeFromPathname(pathname) {
  return pathname && pathname.startsWith("/narrative") ? "narrative" : "systems";
}

/**
 * The mode is derived from the URL rather than held in state, so the server
 * renders the correct tree on the first request. Reading it from localStorage
 * after hydration used to repaint the whole page ~0.7s in.
 */
export function ThemeProvider({ children }) {
  const pathname = usePathname();
  const theme = themeFromPathname(pathname);

  return (
    <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
