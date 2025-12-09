# 📧 Guide d'implémentation - Email avec Enveloppe

## ✅ Fichiers créés

### 1. `src/utils/emailTemplates.ts`
- ✅ Template HTML email avec enveloppe statique
- ✅ Nom du destinataire sur l'enveloppe
- ✅ Bouton "Open Card"
- ✅ Design responsive et moderne
- ✅ Fonctions utilitaires (generateInvitationUrl, generateInvitationToken)

### 2. `src/pages/InvitationView.tsx`
- ✅ Page publique pour afficher l'animation
- ✅ URL: `/invitation/:token`
- ✅ Affiche PreviewModel1 avec animation complète
- ✅ Design moderne avec effets de fond
- ✅ Boutons de partage

### 3. `src/App.tsx`
- ✅ Route ajoutée : `/invitation/:token`
- ✅ Import de InvitationView

---

## 🔧 Modifications à faire dans StepSendImproved.tsx

### Localiser la fonction `handleSendBulk`

Cherche cette section (autour de la ligne 538) :

```typescript
if (sendMode === "group") {
  payload.message = groupMessage[groupMessage.channel];
  if (groupMessage.channel === "email") {
    payload.html = generateSelectedModelHTML();
  }
}
```

### Remplacer par :

```typescript
if (sendMode === "group") {
  payload.message = groupMessage[groupMessage.channel];
  if (groupMessage.channel === "email") {
    // Importer les fonctions du template email
    const { 
      generateEnvelopeEmailTemplate, 
      generateInvitationToken, 
      generateInvitationUrl 
    } = await import("@/utils/emailTemplates");
    
    // Générer un token unique
    const token = generateInvitationToken();
    const invitationUrl = generateInvitationUrl(token);
    
    // Utiliser le template avec enveloppe
    payload.html = generateEnvelopeEmailTemplate({
      recipientName: recipients[0]?.name || "Invité",
      invitationUrl: invitationUrl,
      envelopeColor: "#26452b", // Vert par défaut
    });
    
    // TODO: Sauvegarder le token et les données de l'invitation en base
    // pour pouvoir les afficher sur /invitation/:token
  }
}
```

---

## 📊 Flux complet

```
1. Utilisateur clique sur "Envoyer"
   ↓
2. StepSendImproved.handleSendBulk()
   ↓
3. Génération du token unique
   ↓
4. Génération de l'URL : /invitation/{token}
   ↓
5. Génération du HTML email avec enveloppe
   ↓
6. Envoi de l'email via bulkSendService
   ↓
7. Destinataire reçoit l'email
   ↓
8. Destinataire clique sur "Open Card"
   ↓
9. Redirection vers /invitation/{token}
   ↓
10. InvitationView charge les données
   ↓
11. Affichage de PreviewModel1 avec animation
```

---

## 🎨 Aperçu de l'email

```
┌─────────────────────────────────────┐
│  ✉️ Vous avez reçu une invitation   │
│  Une surprise vous attend...        │
├─────────────────────────────────────┤
│                                     │
│     ┌─────────────────────┐        │
│     │                     │        │
│     │    ┌───────────┐   │        │
│     │    │ John Doe  │   │  ← Enveloppe
│     │    └───────────┘   │        │
│     │                     │        │
│     └─────────────────────┘        │
│                                     │
│  Une invitation spéciale vous       │
│  attend ! Cliquez sur le bouton     │
│  ci-dessous pour découvrir votre    │
│  carte personnalisée.               │
│                                     │
│     [ 🎉 Open Card ]  ← Bouton     │
│                                     │
├─────────────────────────────────────┤
│  Cette invitation a été créée       │
│  avec ❤️                            │
└─────────────────────────────────────┘
```

---

## 🔄 TODO Backend

### Créer une table `invitations` :

```sql
CREATE TABLE invitations (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  token VARCHAR(255) UNIQUE NOT NULL,
  recipient_name VARCHAR(255),
  recipient_email VARCHAR(255),
  template_data JSON,
  items JSON,
  bg_color VARCHAR(50),
  bg_image TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  viewed_at TIMESTAMP NULL,
  INDEX idx_token (token)
);
```

### Créer un endpoint API :

```php
// GET /api/invitations/{token}
public function show($token) {
    $invitation = Invitation::where('token', $token)->first();
    
    if (!$invitation) {
        return response()->json(['error' => 'Invitation not found'], 404);
    }
    
    // Marquer comme vue
    $invitation->update(['viewed_at' => now()]);
    
    return response()->json([
        'recipientName' => $invitation->recipient_name,
        'items' => json_decode($invitation->items),
        'bgColor' => $invitation->bg_color,
        'bgImage' => $invitation->bg_image,
    ]);
}
```

### Modifier le MailingController :

Lors de l'envoi, sauvegarder chaque invitation :

```php
foreach ($recipients as $recipient) {
    $token = Str::random(32);
    
    Invitation::create([
        'token' => $token,
        'recipient_name' => $recipient['name'],
        'recipient_email' => $recipient['email'],
        'items' => json_encode($templateData['items']),
        'bg_color' => $templateData['bgColor'],
        'bg_image' => $templateData['bgImage'],
        'expires_at' => now()->addDays(30),
    ]);
    
    // Générer l'URL
    $invitationUrl = config('app.url') . '/invitation/' . $token;
    
    // Générer le HTML avec l'enveloppe
    $html = view('emails.envelope', [
        'recipientName' => $recipient['name'],
        'invitationUrl' => $invitationUrl,
    ])->render();
    
    // Envoyer l'email
    Mail::send($html, $recipient['email']);
}
```

---

## 🧪 Test

### 1. Tester la page d'invitation :
```
http://localhost:5173/invitation/test-token-123
```

### 2. Tester l'email localement :
- Ouvrir `src/utils/emailTemplates.ts`
- Copier le HTML généré
- Coller dans un fichier `test-email.html`
- Ouvrir dans le navigateur

### 3. Tester l'envoi complet :
- Aller dans Builder
- Créer une carte
- Aller à l'étape "Envoi"
- Envoyer à un email de test
- Vérifier la réception
- Cliquer sur "Open Card"

---

## 🎯 Résultat final

✅ Email reçu avec enveloppe statique + nom du destinataire
✅ Bouton "Open Card" cliquable
✅ Redirection vers page web avec animation complète
✅ Animation PreviewModel1 fonctionnelle
✅ Design moderne et responsive

---

**Date :** 5 décembre 2025  
**Statut :** ✅ Implémenté - Backend à compléter
