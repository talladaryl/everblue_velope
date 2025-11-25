# 🧪 Guide de Test Complet - Everblue

## 📋 Checklist de Test

### 1. Accueil (HomePage)
- [ ] Les templates se chargent automatiquement
- [ ] La grille est responsive
- [ ] Les boutons d'action fonctionnent (Éditer, Supprimer, Aperçu)
- [ ] Le bouton "Créer nouveau" fonctionne
- [ ] Les états de chargement s'affichent correctement

### 2. Builder - Étape 0: Design
- [ ] Ajouter du texte
- [ ] Ajouter une image
- [ ] Ajouter une vidéo
- [ ] Ajouter un GIF
- [ ] Modifier les propriétés (couleur, taille, position)
- [ ] Drag & drop fonctionne
- [ ] Sauvegarder le template

### 3. Builder - Étape 1: Détails
- [ ] Ajouter un invité manuellement
- [ ] Valider l'email
- [ ] Importer un CSV
- [ ] Télécharger le modèle CSV
- [ ] Voir les statistiques (total, valides, invalides)
- [ ] Supprimer un invité
- [ ] Naviguer vers l'étape suivante

### 4. Builder - Étape 2: Prévisualisation
- [ ] Sélectionner un invité
- [ ] Voir les variables remplacées
- [ ] Naviguer entre les invités (Précédent/Suivant)
- [ ] Voir l'aperçu en plein écran
- [ ] Mode Desktop et Mobile
- [ ] Fermer la prévisualisation
- [ ] Continuer vers l'envoi

### 5. Builder - Étape 3: Envoi
- [ ] Sauvegarder le template
- [ ] Voir le message de succès
- [ ] Envoyer les emails
- [ ] Voir les statistiques d'envoi
- [ ] Voir les alertes d'erreur si nécessaire

### 6. Thème et Langue
- [ ] Changer de thème (Light/Dark)
- [ ] Vérifier que le thème change instantanément
- [ ] Changer de langue (EN/FR/IT/DE)
- [ ] Vérifier que tous les textes changent
- [ ] Vérifier la persistance après rechargement

### 7. Responsive Design
- [ ] Tester sur mobile (375px)
- [ ] Tester sur tablet (768px)
- [ ] Tester sur desktop (1920px)
- [ ] Vérifier que rien ne dépasse l'écran
- [ ] Vérifier que les boutons sont accessibles

## 🧪 Scénarios de Test Détaillés

### Scénario 1: Créer une Invitation Simple

**Étapes**:
1. Cliquer sur "Créer une nouvelle invitation"
2. Ajouter du texte: "Vous êtes invité!"
3. Ajouter du texte: "Cher {{first_name}}, vous êtes invité à {{lieu}} le {{date}}"
4. Ajouter une image
5. Changer la couleur de fond
6. Cliquer sur "Suivant"

**Résultats attendus**:
- ✅ Les éléments s'affichent correctement
- ✅ Les propriétés peuvent être modifiées
- ✅ La navigation fonctionne

### Scénario 2: Ajouter des Invités

**Étapes**:
1. Ajouter 3 invités manuellement:
   - Jean Dupont, jean@example.com, Paris, 2025-06-15, 14:00
   - Marie Martin, marie@example.com, Lyon, 2025-06-15, 15:00
   - Pierre Bernard, pierre@example.com, Marseille, 2025-06-15, 16:00
2. Vérifier les statistiques
3. Cliquer sur "Continuer"

**Résultats attendus**:
- ✅ Les invités s'affichent dans la liste
- ✅ Les statistiques sont correctes (3 total, 3 valides)
- ✅ La navigation fonctionne

### Scénario 3: Prévisualiser avec Substitution

**Étapes**:
1. Voir l'aperçu pour Jean Dupont
2. Vérifier que les variables sont remplacées:
   - {{first_name}} → Jean
   - {{lieu}} → Paris
   - {{date}} → 2025-06-15
3. Naviguer vers Marie Martin
4. Vérifier que les variables changent
5. Voir en plein écran
6. Tester le mode Mobile

**Résultats attendus**:
- ✅ Les variables sont remplacées correctement
- ✅ Les données changent pour chaque invité
- ✅ Le mode Mobile s'affiche correctement
- ✅ Le bouton "Fermer" fonctionne

### Scénario 4: Envoyer les Emails

**Étapes**:
1. Entrer un titre de template
2. Cliquer sur "Sauvegarder le template"
3. Vérifier le message de succès
4. Entrer un sujet d'email
5. Cliquer sur "Envoyer"
6. Vérifier les statistiques d'envoi

**Résultats attendus**:
- ✅ Le template est sauvegardé
- ✅ Les emails sont envoyés
- ✅ Les statistiques s'affichent

### Scénario 5: Changer de Thème et Langue

**Étapes**:
1. Cliquer sur le menu de paramètres
2. Changer le thème en Dark
3. Vérifier que l'interface change
4. Changer la langue en Anglais
5. Vérifier que tous les textes changent
6. Recharger la page
7. Vérifier que les préférences sont conservées

**Résultats attendus**:
- ✅ Le thème change instantanément
- ✅ La langue change instantanément
- ✅ Les préférences sont persistantes

## 📱 Tests Responsive

### Mobile (375px)
```
Tester:
- [ ] Tous les boutons sont accessibles
- [ ] Les textes ne dépassent pas l'écran
- [ ] Les images s'affichent correctement
- [ ] La prévisualisation s'adapte
- [ ] Les modales sont lisibles
```

### Tablet (768px)
```
Tester:
- [ ] La grille s'adapte (2 colonnes)
- [ ] Les boutons sont bien espacés
- [ ] La prévisualisation s'affiche bien
- [ ] Les formulaires sont accessibles
```

### Desktop (1920px)
```
Tester:
- [ ] La grille s'affiche complètement (3-4 colonnes)
- [ ] Tous les éléments sont visibles
- [ ] L'interface est bien organisée
```

## 🔍 Tests de Validation

### Validation des Emails
```
Tester:
- [ ] Email valide: jean@example.com ✅
- [ ] Email invalide: jean@example ❌
- [ ] Email invalide: @example.com ❌
- [ ] Email invalide: jean@.com ❌
```

### Validation des Variables
```
Tester:
- [ ] Variable existante: {{name}} ✅
- [ ] Variable manquante: {{unknown}} → affiche alerte
- [ ] Alias français: {{lieu}} ✅
- [ ] Alias anglais: {{location}} ✅
```

### Validation des Templates
```
Tester:
- [ ] Template avec variables ✅
- [ ] Template sans variables ✅
- [ ] Template avec images ✅
- [ ] Template avec vidéos ✅
```

## 🐛 Tests de Gestion d'Erreurs

### Erreurs API
```
Tester:
- [ ] Pas de connexion API → affiche erreur
- [ ] Timeout API → affiche erreur
- [ ] Erreur 500 → affiche erreur
- [ ] Erreur 404 → affiche erreur
```

### Erreurs de Données
```
Tester:
- [ ] Pas d'invité → affiche alerte
- [ ] Pas de variable → affiche alerte
- [ ] Données incomplètes → affiche alerte
```

## 📊 Tests de Performance

### Chargement
```
Tester:
- [ ] Chargement des templates < 2s
- [ ] Chargement de la page < 3s
- [ ] Rendu de la prévisualisation < 1s
```

### Mémoire
```
Tester:
- [ ] Pas de fuite mémoire
- [ ] Pas de lag lors du scroll
- [ ] Pas de lag lors du drag & drop
```

## 🎯 Cas Limites

### Cas Limites à Tester
```
- [ ] 0 invité
- [ ] 1 invité
- [ ] 100 invités
- [ ] Texte très long
- [ ] Image très grande
- [ ] Vidéo très longue
- [ ] Caractères spéciaux
- [ ] Accents et caractères non-ASCII
```

## 📋 Checklist Finale

### Avant Déploiement
- [ ] Tous les tests passent
- [ ] Pas d'erreurs TypeScript
- [ ] Pas d'erreurs console
- [ ] Responsive design OK
- [ ] Performance OK
- [ ] Sécurité OK
- [ ] Documentation à jour

### Après Déploiement
- [ ] Monitoring en place
- [ ] Logs configurés
- [ ] Alertes configurées
- [ ] Backup en place
- [ ] Plan de rollback prêt

## 🚀 Commandes de Test

```bash
# Vérifier les erreurs TypeScript
npm run type-check

# Lancer les tests unitaires
npm run test

# Lancer les tests e2e
npm run test:e2e

# Vérifier la performance
npm run lighthouse

# Vérifier l'accessibilité
npm run a11y
```

## 📝 Rapport de Test

### Template de Rapport
```
Date: [DATE]
Testeur: [NOM]
Version: [VERSION]

Résultats:
- Tests passés: [X]/[Y]
- Tests échoués: [Z]
- Bugs trouvés: [N]

Bugs:
1. [Description]
   Sévérité: [Critique/Majeur/Mineur]
   Étapes: [Étapes pour reproduire]

Recommandations:
- [Recommandation 1]
- [Recommandation 2]
```

## 🎓 Notes Importantes

1. **Toujours tester sur plusieurs navigateurs**
   - Chrome
   - Firefox
   - Safari
   - Edge

2. **Toujours tester sur plusieurs appareils**
   - iPhone
   - Android
   - iPad
   - Desktop

3. **Toujours tester les cas limites**
   - Données vides
   - Données très grandes
   - Caractères spéciaux

4. **Toujours vérifier les logs**
   - Console du navigateur
   - Logs du serveur
   - Logs de l'API

## 🎉 Conclusion

Suivez ce guide pour assurer la qualité et la fiabilité du projet Everblue.

Bon testing! 🚀
