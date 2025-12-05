# Guide de Test - Aperçu avec Animation d'Enveloppe

## 📋 Résumé de l'implémentation

La fonctionnalité d'aperçu avec animation d'enveloppe a été implémentée avec succès. Lorsqu'un utilisateur clique sur le bouton "Aperçu" dans le modal de template, une animation d'enveloppe (PreviewModel1) se lance automatiquement avec le contenu de la carte sélectionnée.

## 🔧 Modifications apportées

### 1. Nouveau composant : `TemplatePreviewModal.tsx`
- ✅ Modal plein écran avec fond sombre
- ✅ Utilise `PreviewModel1` pour l'animation d'enveloppe
- ✅ Animation automatique au montage (délai de 300ms)
- ✅ Affiche le titre du template
- ✅ Bouton de fermeture (X et bouton "Fermer")
- ✅ Empêche la fermeture en cliquant sur le contenu

### 2. Modifications dans `TemplateModal.tsx`
- ✅ Import du nouveau composant `TemplatePreviewModal`
- ✅ Ajout du state `showPreview` pour gérer l'ouverture du modal
- ✅ Modification de `handlePreview()` pour ouvrir le modal au lieu de naviguer
- ✅ Fonction `getTemplateData()` pour extraire les données du template
- ✅ Support des templates API et locaux
- ✅ Parsing automatique des données JSON si nécessaire

### 3. Structure de l'animation
```
TemplateModal (modal principal)
  └─ Bouton "Aperçu" (onClick → setShowPreview(true))
      └─ TemplatePreviewModal (modal de prévisualisation)
          └─ PreviewModel1 (animation d'enveloppe)
              └─ CardPreview (contenu de la carte)
```

## 🧪 Comment tester

### Étape 1 : Accéder à la page d'accueil
1. Lancez l'application : `npm run dev`
2. Accédez à la page d'accueil : `http://localhost:5173/`

### Étape 2 : Ouvrir un template
1. Cliquez sur n'importe quel template (par défaut, API ou local)
2. Le modal de template s'ouvre avec les détails

### Étape 3 : Lancer l'aperçu avec animation
1. Cliquez sur le bouton bleu "Aperçu" (avec l'icône œil)
2. Un nouveau modal s'ouvre avec un fond sombre
3. L'animation d'enveloppe se lance automatiquement après 300ms
4. L'enveloppe verte (PreviewModel1) apparaît

### Étape 4 : Interagir avec l'animation
1. **Cliquez sur l'enveloppe** pour l'ouvrir
2. La carte sort de l'enveloppe avec une animation fluide
3. Le contenu de votre template s'affiche dans la carte
4. **Cliquez sur le bouton ✕** sur la carte pour la refermer
5. L'enveloppe se referme avec l'animation inverse

### Étape 5 : Fermer le modal
1. Cliquez sur le bouton "X" en haut à droite
2. OU cliquez sur le bouton "Fermer" en bas
3. OU cliquez sur le fond sombre à l'extérieur du modal
4. Le modal se ferme et vous revenez au modal de template

## 🔍 Points de vérification

### ✅ Fonctionnalités implémentées
- [x] Bouton "Aperçu" ouvre un modal de prévisualisation
- [x] Animation d'enveloppe (PreviewModel1) se lance automatiquement
- [x] Le contenu de la carte (items, bgColor, bgImage) est affiché
- [x] Support des templates par défaut, API et locaux
- [x] Parsing automatique des données JSON
- [x] Animation fluide d'ouverture/fermeture de l'enveloppe
- [x] Sélecteur de couleur d'enveloppe (6 couleurs disponibles)
- [x] Indicateur d'état ("Cliquez sur l'enveloppe pour ouvrir")
- [x] Fermeture du modal (X, bouton, clic extérieur)

### ⚠️ Cas à tester

#### Templates par défaut (sans données personnalisées)
- [ ] Ouvrir un template par défaut (ex: "Moderne")
- [ ] Cliquer sur "Aperçu"
- [ ] Vérifier que l'enveloppe s'affiche (même si la carte est vide)

#### Templates API (avec données en base)
- [ ] Ouvrir un template avec "Mes Templates (Serveur)"
- [ ] Cliquer sur "Aperçu"
- [ ] Vérifier que le contenu de la carte s'affiche correctement
- [ ] Vérifier que les items (texte, images) sont bien positionnés

#### Templates locaux (stockés en localStorage)
- [ ] Ouvrir un template avec "Mes Templates (Local)"
- [ ] Cliquer sur "Aperçu"
- [ ] Vérifier que le contenu de la carte s'affiche correctement

#### Interaction avec l'animation
- [ ] Cliquer sur l'enveloppe → elle s'ouvre
- [ ] Cliquer sur ✕ sur la carte → elle se referme
- [ ] Changer la couleur de l'enveloppe (6 couleurs disponibles)
- [ ] Vérifier que l'animation est fluide

#### Fermeture du modal
- [ ] Cliquer sur X en haut à droite → modal se ferme
- [ ] Cliquer sur "Fermer" en bas → modal se ferme
- [ ] Cliquer sur le fond sombre → modal se ferme
- [ ] Vérifier qu'on revient bien au modal de template

## 🐛 Débogage

### Logs à surveiller dans la console

```javascript
// Lors du clic sur "Aperçu"
🎬 Ouverture du preview pour: Nom du template
📦 Données du template: { items: [...], bgColor: "...", bgImage: "..." }
```

### Vérification des données

Si la carte est vide dans l'aperçu :
1. Ouvrez la console du navigateur (F12)
2. Vérifiez les logs ci-dessus
3. Vérifiez que `data.items` contient bien des éléments
4. Vérifiez que `data.bgColor` et `data.bgImage` sont définis

### Problèmes courants

**Problème 1 : L'animation ne se lance pas**
- Solution : Vérifiez que le délai de 300ms est suffisant
- Augmentez le délai dans `TemplatePreviewModal.tsx` si nécessaire

**Problème 2 : La carte est vide**
- Solution : Vérifiez que le template a bien des données (`currentTemplate.data`)
- Vérifiez le format des données (doit contenir `items`, `bgColor`, `bgImage`)

**Problème 3 : L'enveloppe ne s'ouvre pas**
- Solution : Vérifiez que GSAP est bien installé
- Vérifiez que `PreviewModel1` fonctionne correctement

**Problème 4 : Le modal ne se ferme pas**
- Solution : Vérifiez que `onClose` est bien appelé
- Vérifiez que `showPreview` est bien mis à `false`

## 🎨 Personnalisation

### Changer le modèle d'enveloppe

Si vous voulez utiliser un autre modèle (Model2, Model3, etc.) :

1. Ouvrez `src/components/TemplatePreviewModal.tsx`
2. Changez l'import :
```typescript
import { PreviewModel2 } from "@/pages/builder/modelPreviews";
```
3. Changez le composant utilisé :
```typescript
<PreviewModel2
  items={items}
  bgColor={bgColor}
  bgImage={bgImage}
  onClose={onClose}
/>
```

### Changer le délai d'animation

Pour modifier le délai avant le lancement de l'animation :

1. Ouvrez `src/components/TemplatePreviewModal.tsx`
2. Modifiez la valeur dans `setTimeout` :
```typescript
const timer = setTimeout(() => {
  setShouldAnimate(true);
}, 500); // Changez 300 en 500 par exemple
```

### Changer la couleur par défaut de l'enveloppe

Dans `PreviewModel1`, la couleur par défaut est "green". Pour la changer :

1. Ouvrez `src/pages/builder/modelPreviews.tsx`
2. Modifiez le paramètre par défaut :
```typescript
export function PreviewModel1({ 
  items, 
  bgColor, 
  bgImage, 
  onClose, 
  guest, 
  envelopeColor = "red", // Changez "green" en "red", "blue", etc.
  onEnvelopeColorChange 
}: ModelPreviewProps)
```

## 📊 Flux d'exécution

```
1. Utilisateur clique sur un template
   ↓
2. Modal de template s'ouvre (TemplateModal)
   ↓
3. Utilisateur clique sur "Aperçu"
   ↓
4. handlePreview() est appelé
   ↓
5. getTemplateData() extrait les données
   ↓
6. setShowPreview(true) ouvre le modal
   ↓
7. TemplatePreviewModal s'affiche
   ↓
8. Délai de 300ms
   ↓
9. setShouldAnimate(true)
   ↓
10. PreviewModel1 se monte avec animation
   ↓
11. Utilisateur interagit avec l'enveloppe
   ↓
12. Utilisateur ferme le modal
   ↓
13. Retour au modal de template
```

## 🎯 Résultat attendu

Après avoir cliqué sur "Aperçu" :
1. ✅ Un modal plein écran s'ouvre avec fond sombre
2. ✅ L'animation d'enveloppe se lance automatiquement
3. ✅ L'enveloppe verte (PreviewModel1) apparaît
4. ✅ Le contenu de la carte est visible dans l'enveloppe
5. ✅ L'utilisateur peut cliquer sur l'enveloppe pour l'ouvrir
6. ✅ La carte sort avec une animation fluide
7. ✅ L'utilisateur peut changer la couleur de l'enveloppe
8. ✅ L'utilisateur peut fermer le modal facilement

## 🚀 Prochaines étapes (optionnel)

- [ ] Ajouter un sélecteur de modèle (Model1, Model2, etc.)
- [ ] Ajouter des contrôles de vitesse d'animation
- [ ] Ajouter un mode plein écran
- [ ] Ajouter un bouton de partage
- [ ] Ajouter un bouton de téléchargement
- [ ] Ajouter des effets sonores
- [ ] Ajouter des confettis lors de l'ouverture

## 📸 Captures d'écran attendues

### 1. Modal de template avec bouton "Aperçu"
- Bouton bleu avec icône œil
- Texte "Aperçu"

### 2. Modal de prévisualisation ouvert
- Fond sombre (noir à 80% d'opacité)
- Modal blanc centré
- Header bleu avec titre
- Enveloppe verte au centre

### 3. Enveloppe ouverte
- Carte sortie de l'enveloppe
- Contenu du template visible
- Bouton ✕ pour refermer

---

**Date de création :** 5 décembre 2025  
**Statut :** ✅ Implémenté et prêt à tester  
**Version :** 1.0
