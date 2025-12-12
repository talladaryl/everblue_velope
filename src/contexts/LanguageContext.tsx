import React, { createContext, useContext, useState } from "react";
import enTranslations from "@/i18n/locales/en.json";
import frTranslations from "@/i18n/locales/fr.json";
import itTranslations from "@/i18n/locales/it.json";
import deTranslations from "@/i18n/locales/de.json";

export type Language = "en" | "fr" | "it" | "de";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// ✅ Export nommé pour éviter l'erreur d'import
export const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Traductions depuis les fichiers JSON
const translations = {
  en: enTranslations,
  fr: frTranslations,
  it: itTranslations,
  de: deTranslations,
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("language") as Language | null;
    return saved || "fr";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Retourner la clé si la traduction n'est pas trouvée
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
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