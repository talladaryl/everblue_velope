# Guide d'implémentation des traductions pour EditCard

## Résumé des modifications effectuées

### 1. Ajout des traductions dans les fichiers JSON

✅ **Fichiers de traduction mis à jour :**
- `src/i18n/locales/fr.json` - Français (langue par défaut)
- `src/i18n/locales/en.json` - Anglais
- `src/i18n/locales/de.json` - Allemand
- `src/i18n/locales/it.json` - Italien

### 2. Ajout des traductions dans le contexte LanguageContext

✅ **Traductions ajoutées dans `src/contexts/LanguageContext.tsx` :**
- Toutes les traductions pour EditCard ont été ajoutées dans les 4 langues
- Structure hiérarchique : `editCard.section.element`

### 3. Modifications du composant EditCard

✅ **Import ajouté :**
```typescript
import { useLanguage } from "@/contexts/LanguageContext";
```

✅ **Hook ajouté dans le composant :**
```typescript
const { t } = useLanguage();
```

## Structure des traductions ajoutées

### Sections principales :
- `editCard.title` - Titre principal
- `editCard.subtitle` - Sous-titre
- `editCard.dragToMove` - Indication de glisser-déposer
- `editCard.emptyCanvas.*` - Messages pour canvas vide
- `editCard.tabs.*` - Onglets (Éléments, Fond, Propriétés)
- `editCard.elements.*` - Éléments (Texte, Image, Vidéo, GIF)
- `editCard.background.*` - Paramètres de fond
- `editCard.properties.*` - Toutes les propriétés des éléments
- `editCard.chat.*` - Interface du chatbot IA
- `editCard.templates.*` - Modal des modèles professionnels

## Exemples d'utilisation dans le code

### Remplacement des textes hardcodés :

**Avant :**
```typescript
<CardTitle className="text-xl font-bold text-foreground">
  Éditeur de Carte Professionnelle
</CardTitle>
```

**Après :**
```typescript
<CardTitle className="text-xl font-bold text-foreground">
  {t("editCard.title")}
</CardTitle>
```

### Autres exemples :

```typescript
// Onglets
{t("editCard.tabs.elements")}     // "Éléments" / "Elements"
{t("editCard.tabs.background")}   // "Fond" / "Background"
{t("editCard.tabs.properties")}   // "Propriétés" / "Properties"

// Éléments
{t("editCard.elements.text")}     // "Texte" / "Text"
{t("editCard.elements.image")}    // "Image" / "Image"
{t("editCard.elements.video")}    // "Vidéo" / "Video"

// Propriétés de texte
{t("editCard.properties.text.size")}      // "Taille" / "Size"
{t("editCard.properties.text.color")}     // "Couleur" / "Color"
{t("editCard.properties.text.font")}      // "Police (60+ disponibles)" / "Font (60+ available)"

// Propriétés média
{t("editCard.properties.media.width")}    // "Largeur" / "Width"
{t("editCard.properties.media.height")}   // "Hauteur" / "Height"
{t("editCard.properties.media.opacity")}  // "Opacité" / "Opacity"

// Chat IA
{t("editCard.chat.title")}        // "Assistant Design" / "Design Assistant"
{t("editCard.chat.placeholder")}  // "Décrivez votre carte..." / "Describe your card..."
```

## Prochaines étapes pour finaliser l'implémentation

### 1. Remplacer tous les textes hardcodés restants

Il faut parcourir le fichier `EditCard.tsx` et remplacer tous les textes français par les appels à `t()` :

```typescript
// Exemples de remplacements à faire :
"Couleur de fond" → {t("editCard.background.backgroundColor")}
"Modèles Professionnels" → {t("editCard.background.professionalTemplates")}
"Propriétés" → {t("editCard.properties.title")}
"Supprimer l'élément" → {t("editCard.properties.deleteElement")}
// etc.
```

### 2. Tester le changement de langue

Une fois tous les textes remplacés, tester que :
- Le changement de langue fonctionne correctement
- Tous les textes sont traduits
- Aucun texte hardcodé ne reste

### 3. Vérifier les traductions

S'assurer que :
- Les traductions sont cohérentes dans toutes les langues
- Les termes techniques sont correctement traduits
- La longueur des textes ne casse pas l'interface

## Traductions disponibles

### Français (fr)
- Langue par défaut, textes complets

### Anglais (en)
- Traduction complète et professionnelle

### Allemand (de)
- Traduction complète avec terminologie technique appropriée

### Italien (it)
- Traduction complète et naturelle

## Notes importantes

1. **Structure hiérarchique** : Les clés de traduction suivent une structure logique `editCard.section.element`
2. **Cohérence** : Les mêmes termes sont traduits de manière cohérente dans toute l'interface
3. **Contexte** : Les traductions prennent en compte le contexte d'utilisation (technique, interface, etc.)
4. **Extensibilité** : La structure permet d'ajouter facilement de nouvelles traductions

## Résultat attendu

Une fois l'implémentation terminée, l'utilisateur pourra :
- Changer la langue de l'interface EditCard via le sélecteur de langue
- Voir tous les textes traduits instantanément
- Bénéficier d'une expérience utilisateur cohérente dans sa langue préférée

L'interface EditCard sera entièrement multilingue et professionnelle dans les 4 langues supportées.