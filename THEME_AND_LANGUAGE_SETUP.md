# Thème et Internationalisation - Guide d'intégration

## 📋 Vue d'ensemble

Ce document décrit l'intégration du système de thème (Light/Dark) et d'internationalisation (EN/FR/IT/DE) dans l'application Everblue.

## 🎨 Système de Thème

### Fichiers créés
- `src/contexts/ThemeContext.tsx` - Contexte React pour la gestion du thème

### Fonctionnalités
- **Thème Light** : Interface claire (par défaut)
- **Thème Dark** : Interface sombre
- **Persistance** : Le thème est sauvegardé dans localStorage
- **Détection système** : Utilise la préférence système si aucun thème n'est sauvegardé
- **Application immédiate** : Le thème s'applique instantanément à toute l'interface

### Utilisation dans les composants

```tsx
import { useTheme } from "@/contexts/ThemeContext";

export const MyComponent = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      Thème actuel: {theme}
    </button>
  );
};
```

## 🌍 Internationalisation (i18n)

### Fichiers créés
- `src/contexts/LanguageContext.tsx` - Contexte React pour la gestion des langues

### Langues supportées
- 🇬🇧 **Anglais** (en)
- 🇫🇷 **Français** (fr) - Langue par défaut
- 🇮🇹 **Italien** (it)
- 🇩🇪 **Allemand** (de)

### Fonctionnalités
- **Traductions complètes** : Tous les textes statiques sont traduits
- **Persistance** : La langue est sauvegardée dans localStorage
- **Changement instantané** : L'interface se met à jour immédiatement
- **Clés structurées** : Les traductions sont organisées par section (hero, features, catalog, menu, etc.)

### Utilisation dans les composants

```tsx
import { useLanguage } from "@/contexts/LanguageContext";

export const MyComponent = () => {
  const { language, setLanguage, t } = useLanguage();
  
  return (
    <div>
      <h1>{t("hero.title")}</h1>
      <button onClick={() => setLanguage("en")}>English</button>
      <button onClick={() => setLanguage("fr")}>Français</button>
    </div>
  );
};
```

## 🎛️ Menu de Paramètres

### Fichier créé
- `src/components/SettingsMenu.tsx` - Composant dropdown pour les paramètres

### Localisation
- Intégré dans le Header (visible sur desktop et mobile)
- Icônes claires : Soleil/Lune pour le thème, Globe pour la langue
- Checkboxes pour indiquer la sélection actuelle

### Apparence
- Dropdown menu élégant
- Emojis de drapeaux pour les langues
- Icônes pour le thème (Light/Dark)
- Responsive et accessible

## 🔧 Configuration

### Providers
Les providers sont intégrés dans `src/App.tsx` :

```tsx
<ThemeProvider>
  <LanguageProvider>
    {/* Reste de l'application */}
  </LanguageProvider>
</ThemeProvider>
```

### CSS
Le fichier `src/index.css` contient déjà les variables CSS pour le mode dark :
- Variables de couleur pour light et dark
- Transitions fluides
- Support complet de Tailwind CSS

## 📝 Ajouter de nouvelles traductions

Pour ajouter une nouvelle traduction :

1. Ouvrir `src/contexts/LanguageContext.tsx`
2. Ajouter la clé dans l'objet `translations` pour chaque langue :

```tsx
const translations = {
  en: {
    "ma.nouvelle.cle": "My new translation",
  },
  fr: {
    "ma.nouvelle.cle": "Ma nouvelle traduction",
  },
  // ... autres langues
};
```

3. Utiliser dans le composant :

```tsx
const { t } = useLanguage();
<p>{t("ma.nouvelle.cle")}</p>
```

## 🎯 Fonctionnalités clés

✅ **Thème Light/Dark**
- Persistance dans localStorage
- Détection de la préférence système
- Application immédiate
- Support complet de Tailwind CSS

✅ **Internationalisation**
- 4 langues supportées
- Traductions complètes
- Persistance dans localStorage
- Changement instantané

✅ **Menu de Paramètres**
- Accessible depuis le Header
- Responsive (desktop et mobile)
- Interface intuitive
- Icônes et emojis clairs

✅ **UX/Design**
- Cohérent avec le design existant
- Transitions fluides
- Accessible et ergonomique
- Performance optimisée

## 🚀 Prochaines étapes

1. Tester le changement de thème et de langue
2. Ajouter d'autres traductions si nécessaire
3. Intégrer les traductions dans les autres pages (Pricing, etc.)
4. Considérer l'ajout d'autres langues

## 📱 Responsive

- **Desktop** : Menu de paramètres dans le Header (droite)
- **Mobile** : Menu de paramètres à côté du menu hamburger
- **Tous les appareils** : Fonctionnalité complète et accessible

## 🔐 Sécurité et Performance

- Pas de requêtes API pour les traductions (tout en local)
- localStorage utilisé pour la persistance
- Pas de dépendances externes supplémentaires
- Performance optimale (pas de re-renders inutiles)
