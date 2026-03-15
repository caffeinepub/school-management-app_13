import { useEffect, useState } from "react";

export type ThemeType = "silver" | "gold" | "dark";

const THEME_KEY = "aic-theme";

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeType>(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === "gold" || saved === "dark") return saved;
      return "silver";
    } catch {
      return "silver";
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-gold", "theme-dark");
    if (theme === "gold") root.classList.add("theme-gold");
    if (theme === "dark") root.classList.add("theme-dark");
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  function setTheme(t: ThemeType) {
    setThemeState(t);
  }

  function cycleTheme() {
    setThemeState((t) =>
      t === "silver" ? "gold" : t === "gold" ? "dark" : "silver",
    );
  }

  return { theme, setTheme, cycleTheme };
}
