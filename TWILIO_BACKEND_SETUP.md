# Configuration Twilio - Guide Backend

## Vue d'ensemble
Ce document décrit les endpoints backend requis pour supporter l'envoi de SMS, MMS et WhatsApp via Twilio.

## Variables d'environnement requises

```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890  # Pour SMS/MMS
TWILIO_WHATSAPP_NUMBER=+1234567890  # Pour WhatsApp (optionnel)
```

## Endpoints API requis

### 1. Envoi unique
**POST** `/twilio/send-sms`
**POST** `/twilio/send-mms`
**POST** `/twilio/send-whatsapp`

Payload:
```json
{
  "phone_number": "+33612345678",
  "message": "Votre message",
  "channel": "sms|mms|whatsapp",
  "media_url": "https://example.com/image.jpg" // Pour MMS/WhatsApp
}
```

Response:
```json
{
  "id": "unique-id",
  "status": "sent|failed|pending|delivered",
  "phone_number": "+33612345678",
  "message_sid": "SM1234567890abcdef",
  "channel": "sms",
  "created_at": "2025-01-01T12:00:00Z",
  "error": null
}
```

### 2. Envoi en masse
**POST** `/twilio/send-bulk`

Payload:
```json
{
  "channel": "sms|mms|whatsapp",
  "recipients": [
    {
      "phone_number": "+33612345678",
      "name": "Jean Dupont",
      "variables": {
        "nom": "Jean Dupont",
        "date": "2025-06-15"
      }
    }
  ],
  "message": "Bonjour {{nom}}, vous êtes invité le {{date}}",
  "media_url": "https://example.com/image.jpg" // Optionnel
}
```

Response:
```json
{
  "id": "bulk-send-id",
  "channel": "sms",
  "total_recipients": 100,
  "sent_count": 95,
  "failed_count": 5,
  "pending_count": 0,
  "status": "completed",
  "messages": [
    {
      "id": "msg-1",
      "recipient": "+33612345678",
      "name": "Jean Dupont",
      "status": "sent",
      "error": null,
      "timestamp": "2025-01-01T12:00:00Z",
      "message_id": "SM1234567890abcdef"
    }
  ],
  "created_at": "2025-01-01T12:00:00Z"
}
```

### 3. Vérifier le statut d'un envoi en masse
**GET** `/twilio/bulk/{bulkId}/status`

Response:
```json
{
  "id": "bulk-send-id",
  "status": "processing|completed|failed",
  "progress": {
    "total": 100,
    "sent": 95,
    "failed": 5,
    "pending": 0
  },
  "errors": [
    {
      "recipient": "+33612345678",
      "error": "Invalid phone number"
    }
  ]
}
```

### 4. Relancer les envois échoués
**POST** `/twilio/bulk/{bulkId}/retry`

Response: Même format que l'envoi en masse

### 5. Récupérer l'historique
**GET** `/twilio/history?channel=sms`

Response:
```json
[
  {
    "id": "msg-1",
    "status": "sent",
    "phone_number": "+33612345678",
    "message_sid": "SM1234567890abcdef",
    "channel": "sms",
    "created_at": "2025-01-01T12:00:00Z"
  }
]
```

### 6. Récupérer le statut d'un message
**GET** `/twilio/status/{messageSid}`

Response: Même format qu'un message unique

## Implémentation recommandée

### Structure de base (Node.js/Express)

```javascript
const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Envoi SMS
app.post('/twilio/send-sms', async (req, res) => {
  try {
    const { phone_number, message } = req.body;
    
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone_number
    });

    res.json({
      data: {
        id: result.sid,
        status: 'sent',
        phone_number,
        message_sid: result.sid,
        channel: 'sms',
        created_at: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Envoi MMS
app.post('/twilio/send-mms', async (req, res) => {
  try {
    const { phone_number, message, media_url } = reqde: POST
- Méthok/status`
lio/webhooom/twiomaine.c://votre-d: `https
- URLebhooksttings > Wsaging > Seler à Mes Ale:
-Consolwilio s T danurernfig```

Co;
});
Status(200)
  res.send;
  us)ssageStatgeSid, Metatus(MessaessageSateM
  updse de donnée basstatut enour le tre à j/ Met
  
  /eq.body; rtatus } =MessageSd, eSiessagonst { M => {
  c (req, res)s',statuok/lio/webho/twipp.post('t
aipscrva

```jade statut:hangements pour les chooks webvoyer des io peut enl)

Twilts (optionneatu pour les stWebhookwilio

## votre plan Te épend dbit: D SMS
- Démite que Même liWhatsApp:ge
- ar messa pusqu'à 5 MB)
- MMS: Jauxpéci s caractèreses (ou 70 si160 caractèr
- SMS:  Twilio

## Limiteson Error
icatihent: Aut*20003**long
- * is too essage body602**: M
- **21equireds rbody i Message *21601**:umber
- * Phone N'From' Invalid  **21212**:r
-NumbePhone nvalid 'To' 1211**: Iio:

- **2Twil de  courantess erreurs
Lereurs
des er# Gestion 
```

#
  }
});ge });rror.messa error: e(400).json({usres.stat {
    or) catch (err});
  }   }
    )
   ring(SOState().toI D_at: newtedrea    c,
    messages        eted',
us: 'compl   stat     ,
ng_count: 0       pendiled,
 ts.faiesuled_count: r  fail    t,
  senesults._count: r   sent
     ngth,pients.lecis: rerecipientl_  tota    channel,
     Id,
       id: bulk       data: {
 son({
    s.j
    re
    });
    messagespleted',
  : 'com  status: 0,
    nding_count  peiled,
    .fatssult: red_coun   faile
   esults.sent,nt: r   sent_couength,
   ecipients.ls: rntpieal_reci  totnnel,
    ha     cd,
 d: bulkId({
      i saveBulkSen  await
  r suivipou données e de basegarder enauv   // S}

 es);
    hPromis.all(batcromise    await P;

    })  
      }
    ;      })    tring()
e().toISOSatp: new D  timestam         
 or.message,  error: err       
   failed',tatus: '         same,
   recipient.n     name: ,
       numbert.phone_ecipient: rienip   rec    
     }`,ernumbnt.phone_recipieor-${`err    id:        push({
  messages.
         iled++;lts.fa    resu      r) {
ch (erro   } cat  });
     
        sult.sidreessage_id:  m         ing(),
  toISOStrew Date().amp: n   timest,
         tus: 'sent'sta          e,
  cipient.namame: re          n  mber,
nunt.phone_ent: recipiecipi       re
     d,esult.sid: r         i({
   essages.push     mt++;
     .sents     resul  }

        });
          
       efined: undia_url] ed[mmedia_url ? l:    mediaUr        
   _number}`,.phonerecipienttsapp:${: `wha  to          ,
  ER}`UMBSAPP_N_WHAT.TWILIOenv${process.tsapp:: `wha    from   ,
       essagedy: m    bo   e({
       sages.creatmesclient.t lt = awai      resu      atsapp') {
=== 'whif (channel else           } });
         
   efinedurl] : undia_ ? [meddia_url me mediaUrl:      
       e_number,.phonrecipient to:          BER,
    IO_PHONE_NUMess.env.TWILoc   from: pr     ,
      essagebody: m          
    s.create({essageait client.mt = aw    resul        ms') {
 === 'mnelhanf (c i  } else         });
         e_number
  ent.phonrecipito:           ,
    UMBERLIO_PHONE_N.TWIess.envfrom: proc              sage,
y: mes    bod
          create({t.messages.client = await        resul    
 = 'sms') { == if (channel              
     result;
      letry {
      t     > {
  nt) =pienc (reciap(asy batch.ms =hPromise const batc
          + 50);
   i(i,.slicerecipientsch = nst batco       50) {
length; i +=ipients.rec = 0; i < or (let i50
    fe ch dr par bat// Traite
     0
    };
ng: pendi    d: 0,
 aile f0,
          sent:  = {
 esults    const r[];
essages = onst m    
    c;
teId()d = generanst bulkI
    cobody;rl } = req.dia_u message, ments,ie recipel, chann   const {y {
  tr) => {
  res(req,async d-bulk', lio/senst('/twi
app.poen masse
// Envoi 
  }
});essage });
r: error.mon({ erro0).jsus(40.stat {
    resror)} catch (er});
     }
    ng()
   toISOStri new Date(). created_at:,
       hatsapp''wel:       channd,
  sid: result.ssage_si
        member, phone_nu',
       'sent:       status
  sult.sid,  id: re
      : {     dataes.json({
 
    r
    });
dndefineurl] : url ? [media_rl: media_u mediaUr}`,
     ne_numbe{phosapp:$`what  to: R}`,
    UMBEWHATSAPP_NIO_s.env.TWILpp:${procesom: `whatsae,
      frmessag     body: create({
 t.messages.ait clien aw result =
    constbody;
    q.l } = re_ure, mediaagumber, mess { phone_n const {
   trys) => {
  (req, re, async tsapp'd-whatwilio/senpost('/sApp
app.Envoi What
// 
  }
});
});or.message error: err).json({ us(400.stat{
    resor) tch (err
  } ca    }); }
)
     OString(e().toIS new Dat_at:eated        crmms',
nel: '    chan  sid,
  esult._sid: ressage m      ,
 mbernu      phone_ent',
  s: 's     statud,
   d: result.si     i   ata: {
 d({
     es.json   r    });

 undefined
l] :  [media_urmedia_url ?Url: media   umber,
   _nphone  to: MBER,
    NUNE_O_PHOTWILIs.env.om: proces
      frmessage,: dy  bo  reate({
  .cssages client.meawaitresult = 
    const     .body;

<!-- ccess to XMLHttpRequest at 'http://127.0.0.1:8000/api/templates' from origin 'http://localhost:8080' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'. The credentials mode of requests initiated by the XMLHttpRequest is controlled by the withCredentials attribute.
templateService.ts:59  Erreur lors de la création du template: AxiosError
createTemplate @ templateService.ts:59
StepSendImproved.tsx:133  Erreur sauvegarde: AxiosError
handleSaveTemplate @ StepSendImproved.tsx:133
127.0.0.1:8000/api/templates:1   Failed to load resource: net::ERR_FAILED -->