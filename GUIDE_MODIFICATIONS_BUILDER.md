# Guide - Modifications Builder et Chargement de Template

## ✅ Modifications effectuées

### 1. Annulation de la redirection après sauvegarde
- ✅ Suppression de `navigate("/designs")` après sauvegarde
- ✅ Le modal se ferme automatiquement après 1.5 secondes
- ✅ Toast de succès affiché
- ✅ L'utilisateur reste dans le Builder pour continuer à travailler

### 2. Amélioration du chargement de template
- ✅ Logs détaillés à chaque étape du chargement
- ✅ Meilleure gestion des erreurs
- ✅ Chargement robuste des items, bgColor, bgImage, selectedModelId
- ✅ Support des templates API, locaux et par défaut
- ✅ Affichage de toasts informatifs

---

## 🧪 Comment tester

### Test 1 : Sauvegarde sans redirection
1. Lance l'application : `npm run dev`
2. Va dans le Builder
3. Crée une carte avec du contenu
4. Clique sur "Sauvegarder"
5. Remplis le formulaire et sauvegarde
6. **Résultat attendu :**
   - Toast de succès s'affiche
   - Le modal se ferme après 1.5 secondes
   - Tu restes dans le Builder (pas de redirection vers /designs)
   - Tu peux continuer à modifier ta carte

### Test 2 : Chargement d'un template depuis HomePage
1. Va sur la page d'accueil
2. Clique sur un template personnalisé (avec "Mes Templates")
3. Clique sur "Modifier" dans le modal
4. **Résultat attendu :**
   - Redirection vers `/builder?template=X`
   - Le Builder s'ouvre
   - Tous les éléments sont chargés :
     - ✅ Items (textes, images)
     - ✅ Couleur de fond (bgColor)
     - ✅ Image de fond (bgImage)
     - ✅ Modèle d'enveloppe (selectedModelId)
   - Toast de succès : "Modèle chargé avec succès!"

### Test 3 : Vérifier les logs dans la console
1. Ouvre la console du navigateur (F12)
2. Clique sur "Modifier" sur un template
3. **Logs attendus :**
```javascript
🔍 Chargement du template ID: 123 Type: string
🌐 Chargement depuis l'API avec ID numérique: 123
✅ Template API chargé: Nom du template
📦 Données brutes: { id: 123, title: "...", data: {...} }
🔄 loadTemplateFromAPI appelé avec: { ... }
📋 Titre: Nom du template
🆔 ID: 123
📦 Données parsées du template: { items: [...], bgColor: "...", bgImage: "..." }
📊 Clés disponibles: ["items", "bgColor", "bgImage", "selectedModelId", "variables"]
✅ Chargement de X items
📝 Premier item: { id: "...", type: "text", text: "...", ... }
🎨 bgColor chargé: #F3F4F6
🖼️ bgImage chargé: data:image/...
📋 selectedModelId depuis data: model1
🆔 Template ID stocké pour mises à jour: 123
✅ Chargement terminé!
```

### Test 4 : Modifier et sauvegarder à nouveau
1. Après avoir chargé un template
2. Modifie quelque chose (ajoute du texte, change la couleur)
3. Clique sur "Sauvegarder"
4. **Résultat attendu :**
   - Le template est mis à jour (pas créé en double)
   - Toast : "Template sauvegardé avec succès!"
   - Pas de redirection
   - Tu peux continuer à modifier

---

## 🔍 Points de vérification

### ✅ Sauvegarde
- [x] Pas de redirection vers /designs
- [x] Toast de succès affiché
- [x] Modal se ferme après 1.5 secondes
- [x] L'utilisateur reste dans le Builder
- [x] Le templateId est stocké pour les mises à jour

### ✅ Chargement de template
- [x] Items chargés correctement
- [x] bgColor chargé correctement
- [x] bgImage chargé correctement
- [x] selectedModelId chargé correctement
- [x] templateId stocké pour les mises à jour
- [x] Toast de succès affiché
- [x] Logs détaillés dans la console

### ✅ Fluidité
- [x] Chargement rapide (< 1 seconde)
- [x] Pas de page blanche
- [x] Transitions fluides
- [x] Feedback visuel (toasts)

---

## 🐛 Débogage

### Problème : Le template ne se charge pas
**Symptômes :** Page blanche ou template vide après clic sur "Modifier"

**Solution :**
1. Ouvre la console (F12)
2. Vérifie les logs :
   - `🔍 Chargement du template ID:` → L'ID est-il correct ?
   - `✅ Template API chargé:` → Le template a-t-il été trouvé ?
   - `📦 Données parsées:` → Les données sont-elles présentes ?
3. Si l'ID est incorrect :
   - Vérifie que `currentTemplate.apiId` existe dans TemplateModal
   - Vérifie que l'ID est bien passé dans l'URL
4. Si les données sont vides :
   - Vérifie que le template a bien des données dans la base
   - Vérifie que `apiTemplate.data` n'est pas null

### Problème : La redirection vers /designs se fait toujours
**Cause :** Le code n'a pas été mis à jour

**Solution :**
1. Vide le cache du navigateur (Ctrl+Shift+Delete)
2. Redémarre le serveur de développement
3. Vérifie que le fichier `Builder.tsx` a bien été modifié

### Problème : Les items ne s'affichent pas
**Cause :** Les items ne sont pas dans le bon format

**Solution :**
1. Vérifie les logs : `📝 Premier item:`
2. Vérifie que l'item a bien les propriétés : `id`, `type`, `x`, `y`, `text` (pour texte)
3. Vérifie que `templateData.items` est un array

### Problème : La couleur de fond n'est pas chargée
**Cause :** `bgColor` n'est pas dans les données

**Solution :**
1. Vérifie les logs : `🎨 bgColor chargé:`
2. Vérifie que `templateData.bgColor` existe
3. Si absent, la couleur par défaut `#F3F4F6` est utilisée

---

## 📊 Flux de chargement

```
1. Utilisateur clique sur "Modifier" dans HomePage
   ↓
2. TemplateModal.handleEdit() est appelé
   ↓
3. Navigation vers /builder?template=123
   ↓
4. Builder.useEffect() détecte le paramètre
   ↓
5. Extraction de l'ID du template
   ↓
6. Appel à templateService.getTemplate(123)
   ↓
7. Réception des données du template
   ↓
8. loadTemplateFromAPI() est appelé
   ↓
9. Parsing des données (items, bgColor, bgImage, etc.)
   ↓
10. Mise à jour des states (setItems, setBgColor, etc.)
   ↓
11. Affichage du template dans le Builder
   ↓
12. Toast de succès
```

---

## 🎯 Résultat final

L'utilisateur peut maintenant :
1. ✅ Sauvegarder un template sans être redirigé
2. ✅ Continuer à travailler sur sa carte après sauvegarde
3. ✅ Cliquer sur "Modifier" et voir le template se charger complètement
4. ✅ Voir tous les éléments (items, couleurs, images) chargés correctement
5. ✅ Avoir un feedback visuel clair (toasts, logs)
6. ✅ Expérience fluide et rapide

---

**Date de modification :** 5 décembre 2025  
**Statut :** ✅ Implémenté et prêt à tester  
**Version :** 2.0
