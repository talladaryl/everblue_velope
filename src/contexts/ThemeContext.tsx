import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "@/components/ui/sonner";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "kiro:theme";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Récupérer le thème depuis localStorage
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (saved) return saved;

    // Vérifier la préférence système
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
    return "light";
  });

  // Appliquer le thème au document
  useEffect(() => {
    const root = document.documentElement;
    
    // Appliquer la classe au root
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    
    // Sauvegarder dans localStorage
    localStorage.setItem(STORAGE_KEY, theme);
    
    // Mettre à jour l'attribut data pour les CSS variables
    root.setAttribute("data-theme", theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    toast.success(`Theme applied: ${newTheme}`);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
