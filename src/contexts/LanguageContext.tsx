import React, { createContext, useContext, useState } from "react";

export type Language = "en" | "fr" | "it" | "de";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Traductions complètes
const translations = {
  en: {
    // Header
    "header.home": "Home",
    "header.designs": "Designs",
    "header.pricing": "Pricing",
    "header.login": "Login",
    "header.signup": "Sign Up",

    // Hero Section
    "hero.badge": "Premium invitation platform",
    "hero.title": "Create",
    "hero.title_highlight": "exceptional invitations",
    "hero.description":
      "Transform your events with personalized invitations designed by experts. Simple, fast and professional.",
    "hero.start": "Start for free",
    "hero.models": "View templates",
    "hero.models_count": "500+",
    "hero.models_label": "Premium Templates",
    "hero.clients_count": "25k+",
    "hero.clients_label": "Satisfied Clients",
    "hero.rating": "4.9",
    "hero.rating_label": "Client Reviews",

    // Features
    "features.title": "Why choose Everblue?",
    "features.description":
      "Discover the features that make our platform the ideal solution for your special events",
    "features.design": "Customizable Design",
    "features.design_desc": "Modify every detail to create a unique invitation",
    "features.speed": "Fast Creation",
    "features.speed_desc":
      "Generate professional invitations in just a few minutes",
    "features.download": "Unlimited Download",
    "features.download_desc": "Access all your designs in high quality",
    "features.share": "Easy Sharing",
    "features.share_desc": "Send your invitations by email or social media",

    // Catalog
    "catalog.title": "Our invitation templates",
    "catalog.description":
      "Discover our collection of premium templates designed by professional designers for all your special events",
    "catalog.search": "Search a template...",
    "catalog.all": "All",
    "catalog.wedding": "Wedding",
    "catalog.birthday": "Birthday",
    "catalog.professional": "Professional",
    "catalog.christmas": "Christmas",
    "catalog.baptism": "Baptism",
    "catalog.party": "Party",
    "catalog.found": "template(s) found",
    "catalog.filters": "More filters",
    "catalog.preview": "Preview",
    "catalog.customize": "Customize",
    "catalog.view_all": "View all templates",

    // Menu
    "menu.theme": "Theme",
    "menu.language": "Language",
    "menu.light": "Light",
    "menu.dark": "Dark",
  },
  fr: {
    // Header
    "header.home": "Accueil",
    "header.designs": "Designs",
    "header.pricing": "Tarifs",
    "header.login": "Connexion",
    "header.signup": "S'inscrire",

    // Hero Section
    "hero.badge": "Plateforme premium d'invitations",
    "hero.title": "Créez des",
    "hero.title_highlight": "invitations exceptionnelles",
    "hero.description":
      "Transformez vos événements avec des invitations personnalisées conçues par des experts. Simple, rapide et professionnel.",
    "hero.start": "Commencer gratuitement",
    "hero.models": "Voir les modèles",
    "hero.models_count": "500+",
    "hero.models_label": "Modèles Premium",
    "hero.clients_count": "25k+",
    "hero.clients_label": "Clients satisfaits",
    "hero.rating": "4.9",
    "hero.rating_label": "Avis clients",

    // Features
    "features.title": "Pourquoi choisir Everblue ?",
    "features.description":
      "Découvrez les fonctionnalités qui font de notre plateforme la solution idéale pour vos événements spéciaux",
    "features.design": "Design Personnalisable",
    "features.design_desc":
      "Modifiez chaque détail pour créer une invitation unique",
    "features.speed": "Création Rapide",
    "features.speed_desc":
      "Générez des invitations professionnelles en quelques minutes",
    "features.download": "Téléchargement Illimité",
    "features.download_desc": "Accédez à tous vos designs en haute qualité",
    "features.share": "Partage Facile",
    "features.share_desc":
      "Envoyez vos invitations par email ou réseaux sociaux",

    // Catalog
    "catalog.title": "Nos modèles d'invitations",
    "catalog.description":
      "Découvrez notre collection de modèles premium conçus par des designers professionnels pour tous vos événements spéciaux",
    "catalog.search": "Rechercher un modèle...",
    "catalog.all": "Tous",
    "catalog.wedding": "Mariage",
    "catalog.birthday": "Anniversaire",
    "catalog.professional": "Professionnel",
    "catalog.christmas": "Noël",
    "catalog.baptism": "Baptême",
    "catalog.party": "Soirée",
    "catalog.found": "modèle(s) trouvé(s)",
    "catalog.filters": "Plus de filtres",
    "catalog.preview": "Aperçu",
    "catalog.customize": "Personnaliser",
    "catalog.view_all": "Voir tous les modèles",

    // Menu
    "menu.theme": "Thème",
    "menu.language": "Langue",
    "menu.light": "Clair",
    "menu.dark": "Sombre",
  },
  it: {
    // Header
    "header.home": "Home",
    "header.designs": "Design",
    "header.pricing": "Prezzi",
    "header.login": "Accedi",
    "header.signup": "Iscriviti",

    // Hero Section
    "hero.badge": "Piattaforma premium di inviti",
    "hero.title": "Crea",
    "hero.title_highlight": "inviti straordinari",
    "hero.description":
      "Trasforma i tuoi eventi con inviti personalizzati progettati da esperti. Semplice, veloce e professionale.",
    "hero.start": "Inizia gratuitamente",
    "hero.models": "Visualizza modelli",
    "hero.models_count": "500+",
    "hero.models_label": "Modelli Premium",
    "hero.clients_count": "25k+",
    "hero.clients_label": "Clienti Soddisfatti",
    "hero.rating": "4.9",
    "hero.rating_label": "Recensioni Clienti",

    // Features
    "features.title": "Perché scegliere Everblue?",
    "features.description":
      "Scopri le funzionalità che rendono la nostra piattaforma la soluzione ideale per i tuoi eventi speciali",
    "features.design": "Design Personalizzabile",
    "features.design_desc":
      "Modifica ogni dettaglio per creare un invito unico",
    "features.speed": "Creazione Veloce",
    "features.speed_desc":
      "Genera inviti professionali in pochi minuti",
    "features.download": "Download Illimitato",
    "features.download_desc": "Accedi a tutti i tuoi design in alta qualità",
    "features.share": "Condivisione Facile",
    "features.share_desc":
      "Invia i tuoi inviti via email o social media",

    // Catalog
    "catalog.title": "I nostri modelli di inviti",
    "catalog.description":
      "Scopri la nostra collezione di modelli premium progettati da designer professionisti per tutti i tuoi eventi speciali",
    "catalog.search": "Cerca un modello...",
    "catalog.all": "Tutti",
    "catalog.wedding": "Matrimonio",
    "catalog.birthday": "Compleanno",
    "catalog.professional": "Professionale",
    "catalog.christmas": "Natale",
    "catalog.baptism": "Battesimo",
    "catalog.party": "Festa",
    "catalog.found": "modello(i) trovato(i)",
    "catalog.filters": "Altri filtri",
    "catalog.preview": "Anteprima",
    "catalog.customize": "Personalizza",
    "catalog.view_all": "Visualizza tutti i modelli",

    // Menu
    "menu.theme": "Tema",
    "menu.language": "Lingua",
    "menu.light": "Chiaro",
    "menu.dark": "Scuro",
  },
  de: {
    // Header
    "header.home": "Startseite",
    "header.designs": "Designs",
    "header.pricing": "Preise",
    "header.login": "Anmelden",
    "header.signup": "Registrieren",

    // Hero Section
    "hero.badge": "Premium-Einladungsplattform",
    "hero.title": "Erstellen Sie",
    "hero.title_highlight": "außergewöhnliche Einladungen",
    "hero.description":
      "Verwandeln Sie Ihre Veranstaltungen mit personalisierten Einladungen, die von Experten entworfen wurden. Einfach, schnell und professionell.",
    "hero.start": "Kostenlos starten",
    "hero.models": "Vorlagen anzeigen",
    "hero.models_count": "500+",
    "hero.models_label": "Premium-Vorlagen",
    "hero.clients_count": "25k+",
    "hero.clients_label": "Zufriedene Kunden",
    "hero.rating": "4.9",
    "hero.rating_label": "Kundenbewertungen",

    // Features
    "features.title": "Warum Everblue wählen?",
    "features.description":
      "Entdecken Sie die Funktionen, die unsere Plattform zur idealen Lösung für Ihre besonderen Veranstaltungen machen",
    "features.design": "Anpassbares Design",
    "features.design_desc":
      "Ändern Sie jedes Detail, um eine einzigartige Einladung zu erstellen",
    "features.speed": "Schnelle Erstellung",
    "features.speed_desc":
      "Erstellen Sie professionelle Einladungen in wenigen Minuten",
    "features.download": "Unbegrenzter Download",
    "features.download_desc": "Greifen Sie auf alle Ihre Designs in hoher Qualität zu",
    "features.share": "Einfaches Teilen",
    "features.share_desc":
      "Senden Sie Ihre Einladungen per E-Mail oder in sozialen Medien",

    // Catalog
    "catalog.title": "Unsere Einladungsvorlagen",
    "catalog.description":
      "Entdecken Sie unsere Sammlung von Premium-Vorlagen, die von professionellen Designern für alle Ihre besonderen Veranstaltungen entworfen wurden",
    "catalog.search": "Vorlage suchen...",
    "catalog.all": "Alle",
    "catalog.wedding": "Hochzeit",
    "catalog.birthday": "Geburtstag",
    "catalog.professional": "Beruflich",
    "catalog.christmas": "Weihnachten",
    "catalog.baptism": "Taufe",
    "catalog.party": "Party",
    "catalog.found": "Vorlage(n) gefunden",
    "catalog.filters": "Weitere Filter",
    "catalog.preview": "Vorschau",
    "catalog.customize": "Anpassen",
    "catalog.view_all": "Alle Vorlagen anzeigen",

    // Menu
    "menu.theme": "Design",
    "menu.language": "Sprache",
    "menu.light": "Hell",
    "menu.dark": "Dunkel",
  },
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
    return (
      translations[language][key as keyof (typeof translations)[Language]] ||
      key
    );
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
