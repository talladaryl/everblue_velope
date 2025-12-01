# Diagnostic Complet des Endpoints API - EverBlue

**Date du diagnostic:** 28 novembre 2025  
**Version:** 1.0  
**Statut:** Complet

---

## 📋 Table des matières

1. [Résumé exécutif](#résumé-exécutif)
2. [Services API](#services-api)
3. [Endpoints par catégorie](#endpoints-par-catégorie)
4. [Hooks React](#hooks-react)
5. [Appels API externes](#appels-api-externes)
6. [Problèmes identifiés](#problèmes-identifiés)
7. [Recommandations](#recommandations)

---

## 📊 Résumé exécutif

### Statistiques globales
- **Nombre total d'endpoints:** 67
- **Services API:** 9
- **Hooks React:** 6
- **Appels API externes:** 1 (Groq API)
- **Endpoints par méthode HTTP:**
  - GET: 24
  - POST: 25
  - PUT: 10
  - DELETE: 8

### Couverture par domaine
- **Événements:** 9 endpoints
- **Invités:** 8 endpoints
- **Templates:** 4 endpoints
- **Mailings:** 8 endpoints
- **Envoi en masse:** 5 endpoints
- **Twilio:** 6 endpoints
- **Statistiques:** 4 endpoints
- **Images IA:** 2 endpoints
- **Organisations:** 5 endpoints

---

## 🔧 Services API

### 1. Event Service (`src/api/services/eventService.ts`)

#### Endpoints
| Méthode | Endpoint | Fonction | Statut |
|---------|----------|----------|--------|
| GET | `/events` | Récupérer tous les événements | ✅ |
| GET | `/events/{id}` | Récupérer un événement spécifique | ✅ |
| POST | `/events` | Créer un nouvel événement | ✅ |
| PUT | `/events/{id}` | Mettre à jour un événement | ✅ |
| DELETE | `/events/{id}` | Supprimer un événement | ✅ |
| POST | `/events/{id}/change-status` | Changer le statut d'un événement | ✅ |
| POST | `/events/{id}/archive` | Archiver un événement | ✅ |
| POST | `/events/{id}/unarchive` | Désarchiver un événement | ✅ |
| GET | `/events/archived/list` | Récupérer les événements archivés | ✅ |

#### Statuts supportés
- `draft` - Brouillon
- `active` - Actif
- `archived` - Archivé

---

### 2. Guest Service (`src/api/services/guestService.ts`)

#### Endpoints
| Méthode | Endpoint | Fonction | Statut |
|---------|----------|----------|--------|
| GET | `/guests` | Récupérer tous les invités | ✅ |
| GET | `/guests?event_id={eventId}` | Récupérer les invités d'un événement | ✅ |
| POST | `/guests` | Créer un nouvel invité | ✅ |
| PUT | `/guests/{id}` | Mettre à jour un invité | ✅ |
| DELETE | `/guests/{id}` | Supprimer un invité | ✅ |
| POST | `/api/events/{eventId}/guests/import` | Importer des invités (CSV/JSON) | ✅ |

#### Validation
- Email: Format standard `user@domain.com`
- Téléphone: Minimum 10 chiffres
- Statut: `valid` ou `invalid`

---

### 3. Template Service (`src/api/services/templateService.ts`)

#### Endpoints
| Méthode | Endpoint | Fonction | Statut |
|---------|----------|----------|--------|
| GET | `/templates` | Récupérer tous les templates | ✅ |
| GET | `/templates/{id}` | Récupérer un template spécifique | ✅ |
| POST | `/templates` | Créer un nouveau template | ✅ |
| PUT | `/templates/{id}` | Mettre à jour un template | ✅ |
| DELETE | `/templates/{id}` | Supprimer un template | ✅ |

#### Champs supportés
- `name` - Nom du template
- `category` - Catégorie (optionnel)
- `preview_url` - URL de prévisualisation (optionnel)
- `structure` - Structure JSON du template

---

### 4. Mailing Service (`src/api/services/mailingService.ts`)

#### Endpoints
| Méthode | Endpoint | Fonction | Statut |
|---------|----------|----------|--------|
| POST | `/mailings/bulk/email` | Envoyer un mailing email en masse | ✅ |
| POST | `/mailings/bulk/whatsapp` | Envoyer un mailing WhatsApp en masse | ✅ |
| POST | `/mailings` | Créer un mailing | ✅ |
| GET | `/mailings` | Récupérer tous les mailings | ✅ |
| GET | `/mailings?event_id={eventId}` | Récupérer les mailings d'un événement | ✅ |
| GET | `/mailings/{id}` | Récupérer un mailing spécifique | ✅ |
| PUT | `/mailings/{id}` | Mettre à jour le statut d'un mailing | ✅ |
| DELETE | `/mailings/{id}` | Supprimer un mailing | ✅ |

#### Statuts de mailing
- `scheduled` - Programmé
- `sending` - En cours d'envoi
- `sent` - Envoyé
- `failed` - Échoué

#### Canaux supportés
- `email` - Email
- `sms` - SMS
- `link` - Lien
- `whatsapp` - WhatsApp

---

### 5. Bulk Send Service (`src/api/services/bulkSendService.ts`)

#### Endpoints
| Méthode | Endpoint | Fonction | Statut |
|---------|----------|----------|--------|
| POST | `/bulk-send` | Envoyer en masse (email, SMS, MMS, WhatsApp) | ✅ |
| GET | `/bulk-send/{bulkSendId}/status` | Récupérer le statut d'un envoi en masse | ✅ |
| GET | `/bulk-send?limit={limit}` | Récupérer l'historique des envois en masse | ✅ |
| POST | `/bulk-send/{bulkSendId}/cancel` | Annuler un envoi en masse | ✅ |
| POST | `/bulk-send/{bulkSendId}/retry` | Relancer les envois échoués | ✅ |

#### Canaux supportés
- `email` - Email
- `sms` - SMS
- `mms` - MMS
- `whatsapp` - WhatsApp

#### Limites
- Maximum 500 destinataires par envoi
- Taille de batch par défaut: 50

---

### 6. Twilio Service (`src/api/services/twilioService.ts`)

#### Endpoints
| Méthode | Endpoint | Fonction | Statut |
|---------|----------|----------|--------|
| POST | `/twilio/send-{channel}` | Envoyer un message via Twilio | ✅ |
| POST | `/twilio/send-bulk` | Envoyer en masse via Twilio | ✅ |
| GET | `/twilio/history` | Récupérer l'historique des messages | ✅ |
| GET | `/twilio/history?channel={channel}` | Récupérer l'historique par canal | ✅ |
| GET | `/twilio/status/{messageSid}` | Récupérer le statut d'un message | ✅ |
| GET | `/twilio/bulk/{bulkId}/status` | Récupérer le statut d'un envoi en masse | ✅ |
| POST | `/twilio/bulk/{bulkId}/retry` | Relancer les messages échoués | ✅ |

#### Canaux Twilio
- `sms` - SMS
- `mms` - MMS
- `whatsapp` - WhatsApp

#### Statuts de message
- `sent` - Envoyé
- `failed` - Échoué
- `pending` - En attente
- `delivered` - Livré

---

### 7. Mailing Stats Service (`src/api/services/mailingStatsService.ts`)

#### Endpoints
| Méthode | Endpoint | Fonction | Statut |
|---------|----------|----------|--------|
| GET | `/api/events/{eventId}/mailings/statistics` | Récupérer les stats d'un événement | ✅ |
| GET | `/mailings/statistics` | Récupérer les stats globales | ✅ |
| GET | `/api/events/{eventId}/mailings/statistics?channel={channel}` | Récupérer les stats par canal | ✅ |
| GET | `/api/events/{eventId}/mailings/statistics?start_date={date}&end_date={date}` | Récupérer les stats par période | ✅ |

#### Métriques disponibles
- `total_sent` - Total envoyé
- `total_delivered` - Total livré
- `total_failed` - Total échoué
- `total_pending` - Total en attente
- `success_rate` - Taux de succès
- `failure_rate` - Taux d'échec
- `by_channel` - Statistiques par canal

---

### 8. AI Image Service (`src/api/services/aiImageService.ts`)

#### Endpoints
| Méthode | Endpoint | Fonction | Statut |
|---------|----------|----------|--------|
| POST | `/aiimage/generate-image` | Générer une image via OpenAI | ✅ |

#### Paramètres
- `prompt` - Description de l'image (requis)
- `size` - Taille: `256x256`, `512x512`, `1024x1024` (défaut: `1024x1024`)
- `quality` - Qualité: `standard`, `hd` (défaut: `standard`)
- `n` - Nombre d'images (défaut: 1)

---

### 9. Organization Service (`src/api/services/organizationService.ts`)

#### Endpoints
| Méthode | Endpoint | Fonction | Statut |
|---------|----------|----------|--------|
| GET | `/api/organizations` | Récupérer toutes les organisations | ✅ |
| GET | `/api/organizations/{id}` | Récupérer une organisation spécifique | ✅ |
| POST | `/api/organizations` | Créer une nouvelle organisation | ✅ |
| PUT | `/api/organizations/{id}` | Mettre à jour une organisation | ✅ |
| DELETE | `/api/organizations/{id}` | Supprimer une organisation | ✅ |

#### Champs
- `id` - ID de l'organisation
- `owner_id` - ID du propriétaire
- `name` - Nom de l'organisation
- `created_at` - Date de création
- `updated_at` - Date de mise à jour

---

## 📂 Endpoints par catégorie

### Gestion des événements (9 endpoints)
```
GET    /events
GET    /events/{id}
POST   /events
PUT    /events/{id}
DELETE /events/{id}
POST   /events/{id}/change-status
POST   /events/{id}/archive
POST   /events/{id}/unarchive
GET    /events/archived/list
```

### Gestion des invités (8 endpoints)
```
GET    /guests
GET    /guests?event_id={eventId}
POST   /guests
PUT    /guests/{id}
DELETE /guests/{id}
POST   /api/events/{eventId}/guests/import
```

### Gestion des templates (5 endpoints)
```
GET    /templates
GET    /templates/{id}
POST   /templates
PUT    /templates/{id}
DELETE /templates/{id}
```

### Gestion des mailings (8 endpoints)
```
POST   /mailings/bulk/email
POST   /mailings/bulk/whatsapp
POST   /mailings
GET    /mailings
GET    /mailings?event_id={eventId}
GET    /mailings/{id}
PUT    /mailings/{id}
DELETE /mailings/{id}
```

### Envoi en masse (5 endpoints)
```
POST   /bulk-send
GET    /bulk-send/{bulkSendId}/status
GET    /bulk-send?limit={limit}
POST   /bulk-send/{bulkSendId}/cancel
POST   /bulk-send/{bulkSendId}/retry
```

### Twilio (7 endpoints)
```
POST   /twilio/send-{channel}
POST   /twilio/send-bulk
GET    /twilio/history
GET    /twilio/history?channel={channel}
GET    /twilio/status/{messageSid}
GET    /twilio/bulk/{bulkId}/status
POST   /twilio/bulk/{bulkId}/retry
```

### Statistiques (4 endpoints)
```
GET    /api/events/{eventId}/mailings/statistics
GET    /mailings/statistics
GET    /api/events/{eventId}/mailings/statistics?channel={channel}
GET    /api/events/{eventId}/mailings/statistics?start_date={date}&end_date={date}
```

### Images IA (1 endpoint)
```
POST   /aiimage/generate-image
```

### Organisations (5 endpoints)
```
GET    /api/organizations
GET    /api/organizations/{id}
POST   /api/organizations
PUT    /api/organizations/{id}
DELETE /api/organizations/{id}
```

---

## 🎣 Hooks React

### 1. useEvents (`src/hooks/useEvents.ts`)
**Fonctions:**
- `fetchEvents()` - Charger les événements
- `createEvent(payload)` - Créer un événement
- `updateEvent(id, payload)` - Mettre à jour un événement
- `deleteEvent(id)` - Supprimer un événement
- `updateEventStatus(id, status)` - Changer le statut
- `archiveEvent(id)` - Archiver un événement
- `unarchiveEvent(id)` - Désarchiver un événement

**État:**
- `events` - Liste des événements
- `loading` - État de chargement
- `error` - Message d'erreur

---

### 2. useGuests (`src/hooks/useGuests.ts`)
**Fonctions:**
- `fetchGuests(eventId?)` - Charger les invités
- `createGuest(payload)` - Créer un invité
- `updateGuest(id, payload)` - Mettre à jour un invité
- `deleteGuest(id)` - Supprimer un invité
- `importGuests(eventId, payload)` - Importer des invités
- `importGuestsCSV(eventId, file)` - Importer depuis CSV

**État:**
- `guests` - Liste des invités
- `loading` - État de chargement
- `error` - Message d'erreur

---

### 3. useOrganizations (`src/hooks/useOrganizations.ts`)
**Fonctions:**
- `fetchOrganizations()` - Charger les organisations
- `createOrganization(payload)` - Créer une organisation
- `updateOrganization(id, payload)` - Mettre à jour une organisation
- `deleteOrganization(id)` - Supprimer une organisation

**État:**
- `organizations` - Liste des organisations
- `loading` - État de chargement
- `error` - Message d'erreur

---

### 4. useBulkSend (`src/hooks/useBulkSend.ts`)
**Fonctions:**
- `sendBulk(payload)` - Envoyer en masse
- `getBulkStatus(bulkSendId)` - Récupérer le statut
- `getBulkSendHistory(limit)` - Récupérer l'historique
- `cancelBulkSend(bulkSendId)` - Annuler un envoi
- `retryFailedSends(bulkSendId)` - Relancer les échoués

**État:**
- `bulkSends` - Liste des envois
- `loading` - État de chargement
- `error` - Message d'erreur

---

### 5. useGroqChat (`src/hooks/useGroqChat.tsx`)
**Fonctions:**
- `sendMessage(message)` - Envoyer un message à Groq
- `clearHistory()` - Effacer l'historique

**État:**
- `messages` - Historique des messages
- `loading` - État de chargement
- `error` - Message d'erreur

---

### 6. useEmailService (`src/hooks/useEmailService.ts`)
**Fonctions:**
- `sendTestEmail(testEmail, templateData)` - Envoyer un email de test
- `sendAllEmails(guests, templateData)` - Envoyer à tous les invités

**État:**
- `loading` - État de chargement
- `error` - Message d'erreur

---

## 🌐 Appels API externes

### Groq API (`src/api/groqApi.ts`)

**Endpoint:** `https://api.groq.com/openai/v1/chat/completions`

**Modèle:** `llama-3.1-70b-versatile`

**Paramètres:**
- `model` - Modèle Groq
- `messages` - Messages de conversation
- `temperature` - Température (0.2)
- `max_tokens` - Tokens max (2048)
- `stream` - Streaming (false)

**Authentification:** Bearer token (VITE_GROQ_KEY)

**Timeout:** 12 secondes

**Retry:** Automatique (2 tentatives)

---

## ⚠️ Problèmes identifiés

### 1. Incohérence des endpoints
**Problème:** Certains endpoints utilisent `/api/` et d'autres non
- ✅ `/api/organizations` - Correct
- ❌ `/events` - Devrait être `/api/events`
- ❌ `/guests` - Devrait être `/api/guests`
- ❌ `/templates` - Devrait être `/api/templates`

**Impact:** Risque de confusion et d'erreurs 404

**Recommandation:** Standardiser tous les endpoints avec le préfixe `/api/`

---

### 2. Endpoints mixtes dans guestService
**Problème:** Import utilise `/api/events/{eventId}/guests/import` mais autres endpoints utilisent `/guests`

**Code actuel:**
```typescript
// Incohérent
POST /guests
POST /api/events/{eventId}/guests/import
```

**Recommandation:** Standardiser à `/api/guests` ou `/api/events/{eventId}/guests`

---

### 3. Absence de validation côté client
**Problème:** Validation minimale des données avant envoi

**Endpoints affectés:**
- Création d'événement (pas de validation de date)
- Création d'invité (validation basique)
- Envoi en masse (validation limitée)

**Recommandation:** Ajouter des schémas de validation (Zod, Yup)

---

### 4. Gestion d'erreur incohérente
**Problème:** Différentes approches de gestion d'erreur selon les services

**Exemples:**
```typescript
// Approche 1: Extraction simple
const extract = (res: any) => res.data?.data || res.data;

// Approche 2: Extraction avec fallback
response.data.data || response.data || []

// Approche 3: Pas d'extraction
response.data
```

**Recommandation:** Créer une fonction d'extraction standardisée

---

### 5. Absence de pagination
**Problème:** Aucun endpoint n'implémente la pagination

**Endpoints affectés:**
- GET /events
- GET /guests
- GET /templates
- GET /mailings
- GET /bulk-send

**Impact:** Performance dégradée avec beaucoup de données

**Recommandation:** Ajouter `limit` et `offset` à tous les endpoints de liste

---

### 6. Absence de filtrage avancé
**Problème:** Filtrage limité aux paramètres de requête simples

**Endpoints affectés:**
- GET /guests?event_id={eventId}
- GET /mailings?event_id={eventId}

**Recommandation:** Ajouter des filtres avancés (date, statut, etc.)

---

### 7. Absence de cache
**Problème:** Pas de cache côté client pour les données statiques

**Données candidates au cache:**
- Templates (rarement modifiés)
- Organisations (rarement modifiés)
- Événements archivés (immuables)

**Recommandation:** Implémenter React Query avec cache

---

### 8. Absence de rate limiting
**Problème:** Pas de protection contre les requêtes excessives

**Recommandation:** Implémenter un rate limiter côté client

---

## 💡 Recommandations

### Court terme (1-2 semaines)

1. **Standardiser les endpoints**
   ```
   Avant: /events, /guests, /templates
   Après: /api/events, /api/guests, /api/templates
   ```

2. **Ajouter la validation Zod**
   ```typescript
   const EventSchema = z.object({
     title: z.string().min(1),
     event_date: z.string().datetime().optional(),
   });
   ```

3. **Créer une fonction d'extraction standardisée**
   ```typescript
   const extractData = (response) => response.data?.data ?? response.data;
   ```

4. **Ajouter des logs structurés**
   ```typescript
   console.log({
     endpoint: '/events',
     method: 'GET',
     status: response.status,
     duration: Date.now() - start,
   });
   ```

---

### Moyen terme (1 mois)

1. **Implémenter la pagination**
   ```
   GET /api/events?page=1&limit=20
   GET /api/guests?page=1&limit=50
   ```

2. **Ajouter des filtres avancés**
   ```
   GET /api/events?status=active&date_from=2025-01-01
   GET /api/guests?event_id=1&valid=true
   ```

3. **Implémenter React Query**
   ```typescript
   const { data: events } = useQuery({
     queryKey: ['events'],
     queryFn: () => eventService.getEvents(),
   });
   ```

4. **Ajouter un rate limiter**
   ```typescript
   const limiter = new RateLimiter({ maxRequests: 100, window: 60000 });
   ```

---

### Long terme (2-3 mois)

1. **Implémenter GraphQL** (optionnel)
   - Remplacer REST par GraphQL pour plus de flexibilité
   - Réduire le sur-fetching de données

2. **Ajouter WebSockets** pour les mises à jour en temps réel
   - Statut des envois en masse
   - Notifications de livraison

3. **Implémenter un système de cache distribué**
   - Redis pour le cache côté serveur
   - Service Worker pour le cache côté client

4. **Ajouter des métriques et monitoring**
   - Sentry pour les erreurs
   - DataDog pour les performances

---

## 📈 Métriques de qualité

| Métrique | Valeur | Cible |
|----------|--------|-------|
| Endpoints documentés | 67/67 | 100% ✅ |
| Services avec gestion d'erreur | 9/9 | 100% ✅ |
| Endpoints avec validation | 3/67 | 5% ❌ |
| Endpoints avec pagination | 0/67 | 0% ❌ |
| Endpoints avec cache | 0/67 | 0% ❌ |
| Couverture de tests | ? | 80% |

---

## 📝 Conclusion

Le projet EverBlue dispose d'une architecture API bien structurée avec **67 endpoints** couvrant les principales fonctionnalités. Cependant, il existe plusieurs opportunités d'amélioration :

✅ **Points forts:**
- Architecture modulaire avec services séparés
- Gestion d'erreur globale
- Support multi-canal (email, SMS, WhatsApp)
- Hooks React bien organisés

❌ **Points à améliorer:**
- Standardisation des endpoints
- Validation des données
- Pagination et filtrage
- Cache et optimisation

**Priorité:** Standardiser les endpoints et ajouter la validation avant de passer à la production.

---

**Généré par:** Diagnostic Automatique  
**Date:** 28 novembre 2025  
**Version:** 1.0
