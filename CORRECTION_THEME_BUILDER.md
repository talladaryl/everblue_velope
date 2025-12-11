# 🎨 Correction du Thème dans le Builder

## 🔍 Problème identifié

Les composants du Builder utilisent des classes Tailwind hardcodées qui ne s'adaptent pas au thème :

- `bg-secondary`, `bg-white` → Ne changent pas en mode dark
- `text-foreground`, `text-gray-600` → Restent sombres en mode dark
- `border` → Bordures fixes

## ✅ Solution

Remplacer les classes hardcodées par des classes adaptatives utilisant les variables CSS.

### Mapping des classes

| ❌ Classe hardcodée     | ✅ Classe adaptative    | Description      |
| ----------------------- | ----------------------- | ---------------- |
| `bg-white`              | `bg-background`         | Fond principal   |
| `bg-secondary`          | `bg-secondary`          | Fond secondaire  |
| `bg-gray-100`           | `bg-tertiary`           | Fond tertiaire   |
| `text-foreground`       | `text-foreground`       | Texte principal  |
| `text-gray-600`         | `text-muted-foreground` | Texte secondaire |
| `text-muted-foreground` | `text-muted-foreground` | Texte tertiaire  |
| `border`                | `border`                | Bordure standard |
| `border`                | `border`                | Bordure standard |

### Classes à utiliser

```typescript
// Backgrounds
bg - background; // Fond principal (blanc/noir)
bg - secondary; // Fond secondaire (gris clair/gris foncé)
bg - tertiary; // Fond tertiaire
bg - card; // Fond de carte
bg - popover; // Fond de popover

// Textes
text - foreground; // Texte principal
text - muted - foreground; // Texte secondaire
text - card - foreground; // Texte sur carte

// Bordures
border; // Bordure standard
border - input; // Bordure d'input

// États
bg - accent; // Fond au survol
text - accent - foreground; // Texte sur accent
```

## 🔧 Corrections appliquées

### ✅ StepDetails.tsx

- En-tête : `text-foreground` → `text-foreground`
- Descriptions : `text-gray-600` → `text-muted-foreground`
- Statistiques : Ajout de `dark:` variants pour les couleurs
- Placeholders : `text-gray-400` → `text-muted-foreground`

### ✅ StepSendImproved.tsx (partiel)

- Cartes de statistiques : Ajout de `dark:bg-*-900/20` et bordures adaptatives
- En-têtes d'invités : `bg-secondary` → `bg-secondary`
- Textes : `text-foreground` → `text-foreground`

## 📝 Corrections restantes à appliquer

### StepSendImproved.tsx

Rechercher et remplacer globalement dans le fichier :

```typescript
// Backgrounds
"bg-secondary" → "bg-secondary"
"bg-gray-100" → "bg-tertiary"
"bg-white" → "bg-background"

// Textes
"text-foreground" → "text-foreground"
"text-gray-600" → "text-muted-foreground"
"text-muted-foreground" → "text-muted-foreground"

// Bordures
"border" → "border"
"border-gray-400" → "border-input"

// Hover states
"hover:bg-accent" → "hover:bg-accent"
"hover:bg-gray-100" → "hover:bg-accent"
```

### StepPreviewImproved.tsx

```typescript
// Remplacer
"text-muted-foreground" → "text-muted-foreground"
"text-foreground" → "text-foreground"
"text-gray-700" → "text-foreground"
"bg-gray-100" → "bg-secondary"
"bg-gray-900" → "bg-primary"
"text-white" → "text-primary-foreground"
```

### StepDesign.tsx

```typescript
// Remplacer
"bg-white" → "bg-card"
"text-foreground" → "text-card-foreground"
"text-gray-600" → "text-muted-foreground"
"border" → "border"
```

## 🎯 Règles générales

### 1. Backgrounds

```typescript
// Hiérarchie des fonds
bg - background; // Fond principal de la page
bg - card; // Fond des cartes
bg - secondary; // Fond secondaire (zones légèrement différentes)
bg - tertiary; // Fond tertiaire (encore plus subtil)
bg - accent; // Fond au survol
bg - muted; // Fond désactivé/muté
```

### 2. Textes

```typescript
// Hiérarchie des textes
text - foreground; // Texte principal (titres, contenu important)
text - card - foreground; // Texte sur les cartes
text - muted - foreground; // Texte secondaire (descriptions, labels)
text - accent - foreground; // Texte sur fond accent
text - destructive; // Texte d'erreur
```

### 3. Bordures

```typescript
border; // Bordure standard
border - input; // Bordure d'input
border - destructive; // Bordure d'erreur
```

### 4. États interactifs

```typescript
hover: bg - accent; // Survol
hover: text - accent - foreground; // Texte au survol
focus: ring - ring; // Focus
disabled: opacity - 50; // Désactivé
```

## 🚀 Script de remplacement automatique

Utilisez ce script pour remplacer automatiquement dans tous les fichiers du Builder :

```bash
# Dans le terminal, à la racine du projet
cd src/pages/builder

# Remplacer les backgrounds
find . -name "*.tsx" -exec sed -i 's/bg-secondary/bg-secondary/g' {} +
find . -name "*.tsx" -exec sed -i 's/bg-gray-100/bg-tertiary/g' {} +
find . -name "*.tsx" -exec sed -i 's/bg-white/bg-background/g' {} +

# Remplacer les textes
find . -name "*.tsx" -exec sed -i 's/text-foreground/text-foreground/g' {} +
find . -name "*.tsx" -exec sed -i 's/text-gray-600/text-muted-foreground/g' {} +
find . -name "*.tsx" -exec sed -i 's/text-muted-foreground/text-muted-foreground/g' {} +
find . -name "*.tsx" -exec sed -i 's/text-gray-400/text-muted-foreground/g' {} +

# Remplacer les bordures
find . -name "*.tsx" -exec sed -i 's/border/border/g' {} +
find . -name "*.tsx" -exec sed -i 's/border/border/g' {} +

# Remplacer les hover
find . -name "*.tsx" -exec sed -i 's/hover:bg-accent/hover:bg-accent/g' {} +
find . -name "*.tsx" -exec sed -i 's/hover:bg-gray-100/hover:bg-accent/g' {} +
```

**Note :** Sur Windows (PowerShell), utilisez :

```powershell
# Remplacer dans tous les fichiers .tsx du dossier builder
Get-ChildItem -Path "src/pages/builder" -Filter "*.tsx" -Recurse | ForEach-Object {
    (Get-Content $_.FullName) `
        -replace 'bg-secondary', 'bg-secondary' `
        -replace 'bg-gray-100', 'bg-tertiary' `
        -replace 'bg-white(?!-)', 'bg-background' `
        -replace 'text-foreground', 'text-foreground' `
        -replace 'text-gray-600', 'text-muted-foreground' `
        -replace 'text-muted-foreground', 'text-muted-foreground' `
        -replace 'text-gray-400', 'text-muted-foreground' `
        -replace 'border', 'border' `
        -replace 'border', 'border' `
        -replace 'hover:bg-accent', 'hover:bg-accent' `
        -replace 'hover:bg-gray-100', 'hover:bg-accent' |
    Set-Content $_.FullName
}
```

## ✨ Ajouts pour les couleurs vives

Pour les éléments colorés (badges, statistiques), ajoutez les variants dark :

```typescript
// Avant
className="bg-blue-50 text-blue-600"

// Après
className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"

// Pattern général
bg-{color}-50 dark:bg-{color}-900/20
text-{color}-600 dark:text-{color}-400
border-{color}-200 dark:border-{color}-800
```

## 🧪 Test du thème

Après les modifications, testez :

1. **Mode Light** : Vérifier que tout est lisible
2. **Mode Dark** : Vérifier que tout est lisible
3. **Transition** : Vérifier que le changement est fluide
4. **Tous les steps** : Design, Détails, Prévisualisation, Envoi

### Checklist de test

- [ ] Step Design : Fond, textes, bordures
- [ ] Step Détails : Tableau, formulaires, statistiques
- [ ] Step Prévisualisation : Aperçu, sélecteurs
- [ ] Step Envoi : Cartes, messages, boutons
- [ ] Navigation : Header, boutons de navigation
- [ ] Modals : Popups, dialogs
- [ ] Inputs : Champs de texte, selects, radios
- [ ] Badges : Statuts, labels
- [ ] Alerts : Messages d'erreur, succès

## 📚 Ressources

- [Tailwind Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [shadcn/ui Theming](https://ui.shadcn.com/docs/theming)
- [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
