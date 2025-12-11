# 🎨 Guide Final - Correction du Thème Builder

## ✅ Ce qui a été fait

1. ✅ **ThemeContext** créé et fonctionnel
2. ✅ **Variables CSS** configurées dans `index.css`
3. ✅ **Tailwind** configuré pour le dark mode
4. ✅ **ThemeToggle** ajouté dans `App.tsx`
5. ✅ **Corrections partielles** appliquées sur StepDetails et StepSendImproved

## 🔧 Ce qu'il reste à faire

### Méthode 1 : Remplacement manuel (Recommandé)

Utilisez la fonction "Rechercher et remplacer" de votre éditeur (VS Code : Ctrl+Shift+H) :

#### Dans `src/pages/builder/` (tous les fichiers .tsx)

**Étape 1 : Backgrounds**

```
Rechercher : bg-gray-50
Remplacer par : bg-secondary

Rechercher : bg-gray-100
Remplacer par : bg-tertiary

Rechercher : bg-white
Remplacer par : bg-background
```

**Étape 2 : Textes**

```
Rechercher : text-gray-900
Remplacer par : text-foreground

Rechercher : text-gray-600
Remplacer par : text-muted-foreground

Rechercher : text-gray-500
Remplacer par : text-muted-foreground

Rechercher : text-gray-400
Remplacer par : text-muted-foreground
```

**Étape 3 : Bordures**

```
Rechercher : border-gray-300
Remplacer par : border

Rechercher : border-gray-200
Remplacer par : border
```

**Étape 4 : Hover states**

```
Rechercher : hover:bg-secondary
Remplacer par : hover:bg-accent

Rechercher : hover:bg-tertiary
Remplacer par : hover:bg-accent
```

### Méthode 2 : Script PowerShell

1. Ouvrez PowerShell en tant qu'administrateur
2. Naviguez vers le dossier du projet :

   ```powershell
   cd "C:\Users\DS\Documents\react\EVERBLUE\DP\everblue"
   ```

3. Autorisez l'exécution de scripts :

   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

4. Exécutez le script :
   ```powershell
   .\fix-theme.ps1
   ```

### Méthode 3 : Commandes PowerShell directes

Copiez-collez ces commandes dans PowerShell (une par une) :

```powershell
# Naviguer vers le dossier builder
cd src/pages/builder

# Remplacer bg-secondary
Get-ChildItem -Filter "*.tsx" | ForEach-Object {
    (Get-Content $_.FullName) -replace 'bg-secondary', 'bg-secondary' | Set-Content $_.FullName
}

# Remplacer bg-tertiary
Get-ChildItem -Filter "*.tsx" | ForEach-Object {
    (Get-Content $_.FullName) -replace 'bg-tertiary', 'bg-tertiary' | Set-Content $_.FullName
}

# Remplacer text-foreground
Get-ChildItem -Filter "*.tsx" | ForEach-Object {
    (Get-Content $_.FullName) -replace 'text-foreground', 'text-foreground' | Set-Content $_.FullName
}

# Remplacer text-muted-foreground
Get-ChildItem -Filter "*.tsx" | ForEach-Object {
    (Get-Content $_.FullName) -replace 'text-muted-foreground', 'text-muted-foreground' | Set-Content $_.FullName
}

# Remplacer text-muted-foreground
Get-ChildItem -Filter "*.tsx" | ForEach-Object {
    (Get-Content $_.FullName) -replace 'text-muted-foreground', 'text-muted-foreground' | Set-Content $_.FullName
}

# Remplacer border
Get-ChildItem -Filter "*.tsx" | ForEach-Object {
    (Get-Content $_.FullName) -replace 'border', 'border' | Set-Content $_.FullName
}

# Remplacer hover:bg-accent
Get-ChildItem -Filter "*.tsx" | ForEach-Object {
    (Get-Content $_.FullName) -replace 'hover:bg-accent', 'hover:bg-accent' | Set-Content $_.FullName
}

# Retour à la racine
cd ../../..
```

## 🎨 Ajouts manuels pour les couleurs vives

Après les remplacements automatiques, ajoutez manuellement les variants `dark:` pour les éléments colorés.

### Pattern à suivre :

**Avant :**

```tsx
<div className="bg-blue-50 text-blue-600">
```

**Après :**

```tsx
<div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
```

### Couleurs à traiter :

- `bg-blue-50` → `bg-blue-50 dark:bg-blue-900/20`
- `text-blue-600` → `text-blue-600 dark:text-blue-400`
- `bg-green-50` → `bg-green-50 dark:bg-green-900/20`
- `text-green-600` → `text-green-600 dark:text-green-400`
- `bg-red-50` → `bg-red-50 dark:bg-red-900/20`
- `text-red-600` → `text-red-600 dark:text-red-400`
- `bg-purple-50` → `bg-purple-50 dark:bg-purple-900/20`
- `text-purple-600` → `text-purple-600 dark:text-purple-400`
- `bg-orange-50` → `bg-orange-50 dark:bg-orange-900/20`
- `text-orange-600` → `text-orange-600 dark:text-orange-400`
- `bg-cyan-50` → `bg-cyan-50 dark:bg-cyan-900/20`
- `text-cyan-600` → `text-cyan-600 dark:text-cyan-400`

## 🧪 Test après correction

1. **Démarrer le projet :**

   ```bash
   npm run dev
   ```

2. **Tester le toggle de thème :**

   - Cliquer sur le bouton de thème en haut à droite
   - Vérifier que tout change correctement

3. **Tester tous les steps du Builder :**

   - [ ] Step 0 : Design
   - [ ] Step 1 : Détails (invités)
   - [ ] Step 2 : Prévisualisation
   - [ ] Step 3 : Envoi

4. **Vérifier la lisibilité :**
   - [ ] Mode Light : Tout est lisible
   - [ ] Mode Dark : Tout est lisible
   - [ ] Transitions fluides

## 📋 Checklist finale

- [ ] Remplacements automatiques effectués
- [ ] Variants `dark:` ajoutés pour les couleurs vives
- [ ] Tests en mode Light réussis
- [ ] Tests en mode Dark réussis
- [ ] Tous les steps du Builder fonctionnent
- [ ] Navigation fluide entre les thèmes
- [ ] Aucune régression visuelle

## 🎯 Résultat attendu

Après ces corrections, votre Builder devrait :

- ✅ S'adapter automatiquement au thème (Light/Dark)
- ✅ Avoir des transitions fluides
- ✅ Être lisible dans les deux modes
- ✅ Conserver toutes les fonctionnalités

## 📚 Ressources

- `CORRECTION_THEME_BUILDER.md` - Détails techniques
- `ARCHITECTURE_I18N_THEME.md` - Architecture complète
- `fix-theme.ps1` - Script PowerShell

## 💡 Astuce

Si vous voyez encore des éléments qui ne changent pas de thème, cherchez dans le code :

- `bg-gray-*` non remplacés
- `text-gray-*` non remplacés
- Styles inline avec `style={{}}` (à éviter)
- Classes hardcodées dans des composants externes

---

**Bon courage ! Le thème sera parfait après ces corrections.** 🚀
