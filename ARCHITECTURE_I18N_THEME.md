# 🌍 Architecture Multi-langue & Thème - Guide d'Implémentation

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture Multi-langue (i18n)](#architecture-multi-langue-i18n)
3. [Architecture Thème (Light/Dark)](#architecture-thème-lightdark)
4. [Structure des fichiers](#structure-des-fichiers)
5. [Implémentation étape par étape](#implémentation-étape-par-étape)
6. [Bonnes pratiques](#bonnes-pratiques)
7. [Exemples d'utilisation](#exemples-dutilisation)

---

## 🎯 Vue d'ensemble

### Objectifs

- ✅ Support multi-langue (Français/Anglais)
- ✅ Changement de thème (Light/Dark)
- ✅ Persistance des préférences utilisateur
- ✅ Performance optimale
- ✅ Facilité de maintenance

### Technologies recommandées

- **i18n :** `react-i18next` + `i18next`
- **Thème :** `Context API` + `Tailwind CSS` + `CSS Variables`
- **Persistance :** `localStorage`

---

## 🌍 Architecture Multi-langue (i18n)

### Principe de fonctionnement

```
Utilisateur sélectionne langue
         ↓
Context met à jour la langue
         ↓
i18next charge les traductions
         ↓
Composants affichent le texte traduit
         ↓
Sauvegarde dans localStorage
```

### Structure des dossiers

```
src/
├── i18n/
│   ├── index.ts              # Configuration i18next
│   ├── locales/
│   │   ├── fr/
│   │   │   ├── common.json   # Traductions communes
│   │   │   ├── auth.json     # Traductions authentification
│   │   │   ├── builder.json  # Traductions builder
│   │   │   ├── guests.json   # Traductions invités
│   │   │   └── emails.json   e# Traductions emails
│   │   └── en/
│   │       ├── common.json
│   │       ├── auth.json
│   │       ├── builder.json
│   │       ├── guests.json
│   │       └── emails.json
│   └── types.ts              # Types TypeScript
├── contexts/
│   └── LanguageContext.tsx   # Context pour la langue
└── hooks/
    └── useTranslation.ts     # Hook personnalisé
```

### Configuration i18next

**Fichier : `src/i18n/index.ts`**

```typescript
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Import des traductions
import commonFR from "./locales/fr/common.json";
import commonEN from "./locales/en/common.json";
import builderFR from "./locales/fr/builder.json";
import builderEN from "./locales/en/builder.json";
// ... autres imports

const resources = {
  fr: {
    common: commonFR,
    builder: builderFR,
    // ... autres namespaces
  },
  en: {
    common: commonEN,
    builder: builderEN,
    // ... autres namespaces
  },
};

i18n
  .use(LanguageDetector) // Détection automatique
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "fr",
    defaultNS: "common",
    ns: ["common", "builder", "guests", "emails"],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
```

### Exemple de fichier de traduction

**Fichier : `src/i18n/locales/fr/common.json`**

```json
{
  "app": {
    "name": "EverblueVelope",
    "tagline": "Créez des invitations uniques"
  },
  "navigation": {
    "home": "Accueil",
    "builder": "Créateur",
    "templates": "Modèles",
    "settings": "Paramètres"
  },
  "actions": {
    "save": "Enregistrer",
    "cancel": "Annuler",
    "delete": "Supprimer",
    "edit": "Modifier",
    "send": "Envoyer",
    "back": "Retour",
    "continue": "Continuer",
    "close": "Fermer"
  },
  "messages": {
    "success": "Opération réussie",
    "error": "Une erreur est survenue",
    "loading": "Chargement...",
    "noData": "Aucune donnée disponible"
  }
}
```

**Fichier : `src/i18n/locales/en/common.json`**

```json
{
  "app": {
    "name": "EverblueVelope",
    "tagline": "Create unique invitations"
  },
  "navigation": {
    "home": "Home",
    "builder": "Builder",
    "templates": "Templates",
    "settings": "Settings"
  },
  "actions": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "send": "Send",
    "back": "Back",
    "continue": "Continue",
    "close": "Close"
  },
  "messages": {
    "success": "Operation successful",
    "error": "An error occurred",
    "loading": "Loading...",
    "noData": "No data available"
  }
}
```

### Context pour la langue

**Fichier : `src/contexts/LanguageContext.tsx`**

```typescript
import React, { createContext, useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

type Language = "fr" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  availableLanguages: { code: Language; name: string; flag: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState<Language>("fr");

  const availableLanguages = [
    { code: "fr" as Language, name: "Français", flag: "🇫🇷" },
    { code: "en" as Language, name: "English", flag: "🇬🇧" },
  ];

  useEffect(() => {
    // Charger la langue depuis localStorage
    const savedLang = localStorage.getItem("app_language") as Language;
    if (savedLang && ["fr", "en"].includes(savedLang)) {
      setLanguageState(savedLang);
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem("app_language", lang);
    document.documentElement.lang = lang;
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, availableLanguages }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
```

---

## 🎨 Architecture Thème (Light/Dark)

### Principe de fonctionnement

```
Utilisateur sélectionne thème
         ↓
Context met à jour le thème
         ↓
CSS Variables sont modifiées
         ↓
Tailwind applique les classes
         ↓
Sauvegarde dans localStorage
```

### Structure des dossiers

```
src/
├── contexts/
│   └── ThemeContext.tsx      # Context pour le thème
├── hooks/
│   └── useTheme.ts           # Hook personnalisé
├── styles/
│   ├── themes.css            # Variables CSS pour les thèmes
│   └── globals.css           # Styles globaux
└── components/
    └── ThemeToggle.tsx       # Composant de switch
```

### Context pour le thème

**Fichier : `src/contexts/ThemeContext.tsx`**

```typescript
import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    // Charger le thème depuis localStorage
    const savedTheme = localStorage.getItem("app_theme") as Theme;
    if (savedTheme && ["light", "dark"].includes(savedTheme)) {
      setThemeState(savedTheme);
      applyTheme(savedTheme);
    } else {
      // Détecter la préférence système
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const defaultTheme = prefersDark ? "dark" : "light";
      setThemeState(defaultTheme);
      applyTheme(defaultTheme);
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(newTheme);
    root.setAttribute("data-theme", newTheme);
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    localStorage.setItem("app_theme", newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
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
```

### Variables CSS pour les thèmes

**Fichier : `src/styles/themes.css`**

```css
/* Variables Light Theme */
:root,
[data-theme="light"] {
  /* Couleurs principales */
  --color-primary: #667eea;
  --color-primary-hover: #5568d3;
  --color-secondary: #764ba2;

  /* Backgrounds */
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --bg-tertiary: #f3f4f6;

  /* Textes */
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --text-tertiary: #9ca3af;

  /* Bordures */
  --border-primary: #e5e7eb;
  --border-secondary: #d1d5db;

  /* Ombres */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);

  /* États */
  --color-success: #10b981;
  --color-error: #ef4444;
  --color-warning: #f59e0b;
  --color-info: #3b82f6;
}

/* Variables Dark Theme */
[data-theme="dark"] {
  /* Couleurs principales */
  --color-primary: #818cf8;
  --color-primary-hover: #6366f1;
  --color-secondary: #a78bfa;

  /* Backgrounds */
  --bg-primary: #111827;
  --bg-secondary: #1f2937;
  --bg-tertiary: #374151;

  /* Textes */
  --text-primary: #f9fafb;
  --text-secondary: #d1d5db;
  --text-tertiary: #9ca3af;

  /* Bordures */
  --border-primary: #374151;
  --border-secondary: #4b5563;

  /* Ombres */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5);

  /* États */
  --color-success: #34d399;
  --color-error: #f87171;
  --color-warning: #fbbf24;
  --color-info: #60a5fa;
}

/* Classes utilitaires */
.bg-primary {
  background-color: var(--bg-primary);
}
.bg-secondary {
  background-color: var(--bg-secondary);
}
.text-primary {
  color: var(--text-primary);
}
.text-secondary {
  color: var(--text-secondary);
}
.border-primary {
  border-color: var(--border-primary);
}
```

### Configuration Tailwind pour le thème

**Fichier : `tailwind.config.ts`**

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // Utiliser la classe 'dark'
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
        },
        secondary: "var(--color-secondary)",
        success: "var(--color-success)",
        error: "var(--color-error)",
        warning: "var(--color-warning)",
        info: "var(--color-info)",
      },
      backgroundColor: {
        primary: "var(--bg-primary)",
        secondary: "var(--bg-secondary)",
        tertiary: "var(--bg-tertiary)",
      },
      textColor: {
        primary: "var(--text-primary)",
        secondary: "var(--text-secondary)",
        tertiary: "var(--text-tertiary)",
      },
      borderColor: {
        primary: "var(--border-primary)",
        secondary: "var(--border-secondary)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 📁 Structure des fichiers complète

```
src/
├── i18n/
│   ├── index.ts
│   ├── locales/
│   │   ├── fr/
│   │   │   ├── common.json
│   │   │   ├── auth.json
│   │   │   ├── builder.json
│   │   │   ├── guests.json
│   │   │   ├── emails.json
│   │   │   └── templates.json
│   │   └── en/
│   │       ├── common.json
│   │       ├── auth.json
│   │       ├── builder.json
│   │       ├── guests.json
│   │       ├── emails.json
│   │       └── templates.json
│   └── types.ts
├── contexts/
│   ├── LanguageContext.tsx
│   ├── ThemeContext.tsx
│   └── AppProviders.tsx        # Combine tous les providers
├── hooks/
│   ├── useLanguage.ts
│   └── useTheme.ts
├── components/
│   ├── LanguageSelector.tsx    # Sélecteur de langue
│   ├── ThemeToggle.tsx         # Toggle light/dark
│   └── SettingsPanel.tsx       # Panel de paramètres
├── styles/
│   ├── themes.css
│   └── globals.css
└── utils/
    └── i18n.ts                 # Utilitaires i18n
```

---

## 🚀 Implémentation étape par étape

### Étape 1 : Installation des dépendances

```bash
npm install i18next react-i18next i18next-browser-languagedetector
```

### Étape 2 : Créer la structure i18n

1. Créer le dossier `src/i18n/`
2. Créer les sous-dossiers `locales/fr/` et `locales/en/`
3. Créer les fichiers JSON de traduction
4. Créer `src/i18n/index.ts` avec la configuration

### Étape 3 : Créer les Contexts

1. Créer `src/contexts/LanguageContext.tsx`
2. Créer `src/contexts/ThemeContext.tsx`
3. Créer `src/contexts/AppProviders.tsx` pour combiner les providers

**Fichier : `src/contexts/AppProviders.tsx`**

```typescript
import React from "react";
import { LanguageProvider } from "./LanguageContext";
import { ThemeProvider } from "./ThemeContext";

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ThemeProvider>
      <LanguageProvider>{children}</LanguageProvider>
    </ThemeProvider>
  );
};
```

### Étape 4 : Configurer les styles

1. Créer `src/styles/themes.css`
2. Importer dans `src/main.tsx` ou `src/App.tsx`
3. Configurer `tailwind.config.ts`

**Fichier : `src/main.tsx`**

```typescript
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/globals.css";
import "./styles/themes.css";
import "./i18n"; // Initialiser i18n
import { AppProviders } from "./contexts/AppProviders";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
);
```

### Étape 5 : Créer les composants UI

1. Créer `src/components/LanguageSelector.tsx`
2. Créer `src/components/ThemeToggle.tsx`
3. Créer `src/components/SettingsPanel.tsx`

**Fichier : `src/components/LanguageSelector.tsx`**

```typescript
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage, availableLanguages } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Globe className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {availableLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={language === lang.code ? "bg-accent" : ""}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
```

**Fichier : `src/components/ThemeToggle.tsx`**

```typescript
import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      {theme === "light" ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </Button>
  );
};
```

### Étape 6 : Migrer les composants existants

Pour chaque composant, remplacer les textes en dur par des traductions :

**Avant :**

```typescript
<Button>Enregistrer</Button>
<h1>Gestion des invités</h1>
```

**Après :**

```typescript
import { useTranslation } from 'react-i18next';

const { t } = useTranslation('common');

<Button>{t('actions.save')}</Button>
<h1>{t('guests.title')}</h1>
```

### Étape 7 : Adapter les classes Tailwind

**Avant :**

```typescript
<div className="bg-white text-foreground border">
```

**Après :**

```typescript
<div className="bg-primary text-primary border-primary">
```

---

## ✅ Bonnes pratiques

### Pour i18n

1. **Organisation des traductions**

   - Grouper par fonctionnalité (auth, builder, guests, etc.)
   - Utiliser des clés descriptives (`actions.save` plutôt que `btn1`)
   - Éviter les traductions trop longues dans les clés

2. **Interpolation de variables**

   ```json
   {
     "welcome": "Bienvenue {{name}} !",
     "itemsCount": "{{count}} élément(s)"
   }
   ```

   ```typescript
   t("welcome", { name: "Jean" });
   t("itemsCount", { count: 5 });
   ```

3. **Pluralisation**

   ```json
   {
     "guests": {
       "count_one": "{{count}} invité",
       "count_other": "{{count}} invités"
     }
   }
   ```

   ```typescript
   t("guests.count", { count: 1 }); // "1 invité"
   t("guests.count", { count: 5 }); // "5 invités"
   ```

4. **Dates et nombres**

   ```typescript
   import { useTranslation } from "react-i18next";

   const { t, i18n } = useTranslation();

   // Formater une date
   const date = new Date();
   const formattedDate = new Intl.DateTimeFormat(i18n.language).format(date);

   // Formater un nombre
   const number = 1234.56;
   const formattedNumber = new Intl.NumberFormat(i18n.language).format(number);
   ```

### Pour le thème

1. **Utiliser les variables CSS**

   - Toujours utiliser `var(--color-primary)` plutôt que des couleurs en dur
   - Définir toutes les couleurs dans `themes.css`

2. **Classes Tailwind personnalisées**

   - Créer des classes réutilisables
   - Utiliser `@apply` dans les fichiers CSS si nécessaire

3. **Transitions douces**

   ```css
   * {
     transition: background-color 0.2s ease, color 0.2s ease,
       border-color 0.2s ease;
   }
   ```

4. **Tester les deux thèmes**
   - Vérifier la lisibilité dans les deux modes
   - Tester les contrastes (accessibilité)
