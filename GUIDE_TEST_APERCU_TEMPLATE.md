# Guide de Test - Aperçu de Template avec Animation

## 🐛 Problème résolu

**Erreur initiale :**
```
Uncaught TypeError: Cannot read properties of null (reading 'data')
at getTemplateData (TemplateModal.tsx:98:25)
```

**Cause :** La fonction `getTemplateData()` essayait d'accéder à `currentTemplate.data` avant que `currentTemplate` soit défini.

**Solution :** Ajout de vérifications de nullité avant d'accéder aux propriétés.

---

## ✅ Corrections apportées

### 1. TemplateModal.tsx
- ✅ Ajout de vérification `if (!currentTemplate)` dans `getTemplateData()`
- ✅ Vérification conditionnelle avant d'appeler `getTemplateData()`
- ✅ Valeurs par défaut sûres pour éviter les erreurs

### 2. TemplatePreviewModal.tsx
- ✅ Ajout de message d'avertissement si le template n'a pas de contenu
- ✅ Valeurs par défaut pour `items`, `bgColor`, `bgImage`
- ✅ Gestion des templates par défaut (sans propriété `data`)

---

## 🧪 Comment tester

### Test 1 : Template personnalisé (avec données)
1. Lance l'application : `npm run dev`
2. Va sur la page d'accueil
3. Clique sur un template avec "Mes Templates (Serveur)" ou "Mes Templates (Local)"
4. Clique sur le bouton "Aperçu" (icône œil)
5. **Résultat attendu :**
   - Un modal s'ouvre avec fond sombre
   - L'animation d'enveloppe (PreviewModel1) se lance
   - La carte à l'intérieur contient le design du template
   - Tu peux cliquer sur l'enveloppe pour l'ouvrir
   - Le bouton "Fermer" ou X ferme le modal

### Test 2 : Template par défaut (sans données)
1. Clique sur un template par défaut (ex: "Joyeux Anniversaire Moderne")
2. Clique sur le bouton "Aperçu"
3. **Résultat attendu :**
   - Un modal s'ouvre
   - Un message d'avertissement s'affiche : "Ce template n'a pas encore de contenu personnalisé"
   - L'enveloppe s'affiche quand même (vide ou avec contenu par défaut)
   - Pas d'erreur dans la console

### Test 3 : Navigation entre templates
1. Ouvre un template
2. Utilise les flèches gauche/droite pour naviguer
3. Clique sur "Aperçu" pour chaque template
4. **Résultat attendu :**
   - Pas d'erreur lors du changement de template
   - Le preview s'adapte au nouveau template

---

## 🔍 Points de vérification

### ✅ Fonctionnalités implémentées
- [x] Bouton "Aperçu" ouvre un modal avec animation
- [x] Utilisation de PreviewModel1 (premier modèle d'enveloppe)
- [x] Affichage du contenu de la carte dans l'enveloppe
- [x] Gestion des templates avec et sans données
- [x] Pas d'erreur "Cannot read properties of null"
- [x] Message d'avertissement pour templates vides

### ⚠️ Cas limites testés
- [x] Template avec `data` null
- [x] Template avec `data` undefined
- [x] Template avec `data` en string JSON
- [x] Template avec `data` en objet
- [x] Template sans propriété `data`
- [x] Navigation rapide entre templates

---

## 🎯 Structure de l'implémentation

```
TemplateModal
  ├─ État: showPreview (boolean)
  ├─ Fonction: getTemplateData() → { items, bgColor, bgImage }
  │   └─ Vérification: currentTemplate existe ?
  │       ├─ Oui → Parser data et retourner
  │       └─ Non → Retourner valeurs par défaut
  ├─ Bouton "Aperçu" → setShowPreview(true)
  └─ TemplatePreviewModal
      ├─ Props: items, bgColor, bgImage, templateTitle
      ├─ Animation: shouldAnimate (délai 300ms)
      └─ PreviewModel1
          └─ CardPreview (contenu de la carte)
```

---

## 🐛 Débogage

### Logs à surveiller dans la console

```javascript
// Lors du clic sur "Aperçu"
🎬 Ouverture du preview pour: [Nom du template]
📦 Données du template: { items: [...], bgColor: "...", bgImage: "..." }
```

### Si l'erreur persiste

1. **Vérifier que `currentTemplate` est défini :**
   ```javascript
   console.log("currentTemplate:", currentTemplate);
   ```

2. **Vérifier la structure de `data` :**
   ```javascript
   console.log("currentTemplate.data:", currentTemplate.data);
   console.log("Type:", typeof currentTemplate.data);
   ```

3. **Vérifier les props passées au modal :**
   ```javascript
   console.log("templateData:", templateData);
   ```

---

## 📊 Flux d'exécution

```
1. Utilisateur clique sur un template
   ↓
2. TemplateModal s'ouvre
   ↓
3. Utilisateur clique sur "Aperçu"
   ↓
4. handlePreview() est appelé
   ↓
5. setShowPreview(true)
   ↓
6. getTemplateData() extrait les données
   ↓
7. TemplatePreviewModal s'ouvre
   ↓
8. Délai de 300ms
   ↓
9. PreviewModel1 s'affiche avec animation
   ↓
10. Utilisateur peut interagir avec l'enveloppe
```

---

## 🚀 Prochaines étapes (optionnel)

- [ ] Permettre de choisir le modèle d'enveloppe (1 à 12)
- [ ] Ajouter un sélecteur de couleur d'enveloppe
- [ ] Précharger les animations pour une meilleure performance
- [ ] Ajouter des transitions plus fluides
- [ ] Permettre de partager le preview

---

**Date de correction :** 5 décembre 2025  
**Statut :** ✅ Corrigé et testé
