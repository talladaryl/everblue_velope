# 📖 Guide d'Utilisation - Nouvelles Fonctionnalités

## 🎯 Vue d'ensemble

Ce guide explique comment utiliser les nouvelles fonctionnalités et composants améliorés du projet Everblue.

## 🏠 HomePage - Gestion des Templates

### Accès
- Naviguer vers `/designs` après connexion
- Ou cliquer sur "Mon Espace" dans le header

### Fonctionnalités

#### 1. Affichage des Templates
- Les templates sont chargés automatiquement depuis l'API
- Affichage en grille responsive (1-4 colonnes selon l'écran)
- Chaque template affiche:
  - Image de prévisualisation
  - Titre et description
  - Date de création
  - Actions (Éditer, Supprimer, Aperçu)

#### 2. Actions sur les Templates
- **Éditer**: Ouvre le builder avec le template sélectionné
- **Supprimer**: Supprime le template après confirmation
- **Aperçu**: Affiche une prévisualisation du template
- **Créer nouveau**: Lance le builder avec une carte vierge

#### 3. États de Chargement
- **Loading**: Affiche des cartes skeleton pendant le chargement
- **Empty**: Message si aucun template n'existe
- **Error**: Affiche le message d'erreur si le chargement échoue

## 🎨 Builder - Étapes de Création

### Étape 1: Design (StepDesign)
Créez votre invitation en personnalisant:
- **Carte**: Titre, corps, images, variables
- **Enveloppe**: Personnalisation de l'enveloppe
- **Fond**: Couleur ou image de fond
- **Éléments**: Texte, images, vidéos, GIFs

### Étape 2: Détails (StepDetails)
Gérez vos invités:

#### Ajouter des Invités Manuellement
1. Remplissez le formulaire:
   - Nom (obligatoire)
   - Email (obligatoire, validé)
   - Lieu (optionnel)
   - Date (optionnel)
   - Heure (optionnel)
2. Cliquez sur "Ajouter l'invité"

#### Importer depuis CSV
1. Préparez un fichier CSV avec les colonnes:
   ```
   name,email,location,date,time
   Jean Dupont,jean@example.com,Paris,2025-06-15,14:00
   ```
2. Cliquez sur "Importer CSV"
3. Sélectionnez votre fichier
4. Les invités sont importés automatiquement

#### Télécharger le Modèle CSV
- Cliquez sur "Télécharger modèle"
- Un fichier `guests_template.csv` est téléchargé
- Remplissez-le et importez-le

#### Gestion des Invités
- Voir le nombre total, valides et invalides
- Modifier les informations directement dans le tableau
- Supprimer un invité avec le bouton poubelle
- Les emails invalides sont marqués en rouge

### Étape 3: Prévisualisation (StepPreview)
- Prévisualisez votre invitation avec les données réelles
- Changez d'invité pour voir différentes versions
- Vérifiez le remplacement des variables

### Étape 4: Envoi (StepSend)

#### Sauvegarder le Template
1. Entrez un titre (obligatoire)
2. Ajoutez une description (optionnel)
3. Cliquez sur "Sauvegarder le template"
4. Confirmation visuelle de la sauvegarde

#### Envoyer les Invitations
1. Entrez le sujet de l'email
2. Ajoutez un message personnalisé (optionnel)
3. Vérifiez les variables disponibles
4. Cliquez sur "Envoyer"
5. Confirmation avec statistiques d'envoi

#### Aperçu du Contenu
- Visualisez le rendu final avant envoi
- Vérifiez le remplacement des variables
- Assurez-vous que tout est correct

## 🌍 Thème et Langue

### Accès au Menu de Paramètres
- Cliquez sur l'icône Soleil/Lune + Globe dans le header
- Menu déroulant avec options de thème et langue

### Changer de Thème
1. Cliquez sur le menu de paramètres
2. Sélectionnez "Light" ou "Dark"
3. Le thème change instantanément
4. Votre préférence est sauvegardée

### Changer de Langue
1. Cliquez sur le menu de paramètres
2. Sélectionnez votre langue:
   - 🇬🇧 English
   - 🇫🇷 Français
   - 🇮🇹 Italiano
   - 🇩🇪 Deutsch
3. Tous les textes sont mis à jour instantanément
4. Votre préférence est sauvegardée

### Persistance
- Les préférences sont sauvegardées dans localStorage
- Elles restent actives après fermeture du navigateur
- Elles s'appliquent à toutes les pages

## 📊 Composants Réutilisables

### GuestManager
Utilisé dans StepDetails pour gérer les invités.

**Props**:
```typescript
interface GuestManagerProps {
  guests: Guest[];
  onGuestsChange: (guests: Guest[]) => void;
}
```

**Exemple d'utilisation**:
```tsx
<GuestManager 
  guests={guests} 
  onGuestsChange={setGuests} 
/>
```

### ConfirmDialog
Dialog de confirmation réutilisable.

**Props**:
```typescript
interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
  isLoading?: boolean;
}
```

**Exemple d'utilisation**:
```tsx
<ConfirmDialog
  open={showConfirm}
  title="Supprimer le template?"
  description="Cette action est irréversible."
  confirmText="Supprimer"
  onConfirm={handleDelete}
  onCancel={() => setShowConfirm(false)}
  isDestructive={true}
/>
```

### SendingStats
Affiche les statistiques d'envoi.

**Props**:
```typescript
interface SendingStatsProps {
  totalRecipients: number;
  sentCount: number;
  failedCount: number;
  pendingCount: number;
  successRate?: number;
}
```

**Exemple d'utilisation**:
```tsx
<SendingStats
  totalRecipients={100}
  sentCount={95}
  failedCount={5}
  pendingCount={0}
  successRate={95}
/>
```

### TemplatesList
Affiche une liste de templates.

**Props**:
```typescript
interface TemplatesListProps {
  templates: Template[];
  loading: boolean;
  error: string | null;
  onEdit?: (template: Template) => void;
  onDelete?: (id: number) => Promise<void>;
  onPreview?: (template: Template) => void;
}
```

**Exemple d'utilisation**:
```tsx
<TemplatesList
  templates={templates}
  loading={loading}
  error={error}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onPreview={handlePreview}
/>
```

## 🔌 API Integration

### Services Disponibles

#### TemplateService
```typescript
// Récupérer tous les templates
const templates = await templateService.getTemplates();

// Récupérer un template spécifique
const template = await templateService.getTemplate(id);

// Créer un nouveau template
const newTemplate = await templateService.createTemplate({
  title: "Mon Template",
  description: "Description",
  content: JSON.stringify(items),
  html: "<div>...</div>",
  variables: ["nom", "email"]
});

// Mettre à jour un template
const updated = await templateService.updateTemplate(id, {
  title: "Nouveau titre"
});

// Supprimer un template
await templateService.deleteTemplate(id);
```

#### MailingService
```typescript
// Envoyer un mailing
const result = await mailingService.sendMailing({
  subject: "Vous êtes invité!",
  content: "Contenu du message",
  html: "<div>...</div>",
  recipients: [
    {
      email: "jean@example.com",
      name: "Jean Dupont",
      variables: { nom: "Jean", email: "jean@example.com" }
    }
  ]
});
```

### Hooks Personnalisés

#### useTemplates
```typescript
const { templates, loading, error, refetch } = useTemplates();
```

#### useSaveTemplate
```typescript
const { saving, error, saveTemplate } = useSaveTemplate();

await saveTemplate({
  title: "Mon Template",
  description: "Description",
  content: JSON.stringify(items),
  html: "<div>...</div>"
});
```

#### useSendMailing
```typescript
const { sending, error, sendMailing } = useSendMailing();

const result = await sendMailing({
  subject: "Sujet",
  content: "Contenu",
  recipients: [...]
});
```

## 🎯 Bonnes Pratiques

### Validation des Données
- Les emails sont validés automatiquement
- Les champs obligatoires sont vérifiés
- Les erreurs sont affichées clairement

### Gestion des Erreurs
- Toutes les erreurs API sont capturées
- Des toasts informent l'utilisateur
- Les messages d'erreur sont clairs et utiles

### Performance
- Les templates sont chargés une seule fois
- Les images sont optimisées
- Les animations sont fluides

### Accessibilité
- Tous les boutons ont des labels
- La navigation au clavier fonctionne
- Les couleurs ont un bon contraste

## 🐛 Dépannage

### Les templates ne se chargent pas
1. Vérifiez que l'API est accessible
2. Vérifiez l'URL de base dans `src/api/axios.js`
3. Vérifiez les logs du navigateur (F12)

### L'envoi d'emails échoue
1. Vérifiez que les emails sont valides
2. Vérifiez que le serveur API est en ligne
3. Vérifiez les logs du serveur

### Le thème ne change pas
1. Vérifiez que JavaScript est activé
2. Vérifiez les logs du navigateur
3. Videz le cache du navigateur

### La langue ne change pas
1. Vérifiez que la langue est supportée
2. Vérifiez les traductions dans LanguageContext
3. Videz le cache du navigateur

## 📞 Support

Pour toute question ou problème:
1. Consultez ce guide
2. Vérifiez les logs du navigateur (F12)
3. Vérifiez les logs du serveur
4. Contactez l'équipe de support

## 🚀 Prochaines Étapes

- Ajouter plus de modèles de templates
- Implémenter la collaboration en temps réel
- Ajouter des analytics
- Améliorer les performances
- Ajouter plus de langues
