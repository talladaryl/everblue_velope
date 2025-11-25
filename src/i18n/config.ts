import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import fr from './locales/fr.json';
import it from './locales/it.json';
import de from './locales/de.json';

const resources = {
  en: { translation: en },
  fr: { translation: fr },
  it: { translation: it },
  de: { translation: de },
};

// Récupérer la langue sauvegardée ou utiliser le détecteur
const savedLanguage = localStorage.getItem('kiro:locale');

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: savedLanguage || undefined,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

// Sauvegarder la langue quand elle change
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('kiro:locale', lng);
});

export default i18n;
