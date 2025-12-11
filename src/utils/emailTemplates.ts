/**
 * Template email avec enveloppe statique - Thème Bleu
 */

interface EmailEnvelopeTemplateProps {
  recipientName: string;
  invitationUrl: string;
  envelopeColor?: string;
}

export function generateEnvelopeEmailTemplate({
  recipientName,
  invitationUrl,
  envelopeColor = "#1e40af", // Bleu foncé par défaut
}: EmailEnvelopeTemplateProps): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vous avez reçu une invitation</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #ffffff;
      padding: 40px 20px;
      min-height: 100vh;
    }
    .email-container {
      max-width: 580px;
      margin: 0 auto;
      background: white;
      border: 1px solid #e2e8f0;
    }
    .header {
      background-color: #1e40af;
      padding: 40px;
      text-align: center;
      color: white;
    }
    .header h1 {
      font-size: 32px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    .content {
      padding: 48px 32px;
      text-align: center;
    }
    .envelope-container {
      width: 100%;
      max-width: 400px;
      margin: 0 auto 40px;
    }
    .envelope {
      width: 100%;
      height: 250px;
      background: ${envelopeColor};
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
    .envelope-flap {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 60px;
      background: #1e3a8a;
      clip-path: polygon(0 0, 50% 100%, 100% 0);
    }
    .recipient-name {
      color: white;
      font-size: 34px;
      font-weight: 600;
      font-family: 'Georgia', 'Times New Roman', serif;
      letter-spacing: 1px;
      padding: 0 30px;
      text-align: center;
      width: 100%;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }
    .message {
      font-size: 18px;
      color: #4b5563;
      margin-bottom: 36px;
      line-height: 1.7;
      max-width: 480px;
      margin-left: auto;
      margin-right: auto;
    }
    .cta-button {
      display: inline-block;
      background-color: #3b82f6;
      color: white;
      text-decoration: none;
      padding: 18px 50px;
      font-size: 18px;
      font-weight: 600;
      transition: all 0.3s ease;
      border: none;
      cursor: pointer;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .cta-button:hover {
      background-color: #2563eb;
    }
    .security-note {
      margin-top: 24px;
      font-size: 14px;
      color: #6b7280;
      background-color: #f9fafb;
      padding: 12px 20px;
      display: inline-block;
      border-left: 4px solid #3b82f6;
    }
    .footer {
      background-color: #f1f5f9;
      padding: 30px;
      text-align: center;
      color: #64748b;
      font-size: 14px;
      border-top: 1px solid #e2e8f0;
    }
    .footer-links {
      margin-top: 12px;
    }
    .footer a {
      color: #3b82f6;
      text-decoration: none;
      font-weight: 500;
    }
    .footer a:hover {
      text-decoration: underline;
    }
    .invitation-type {
      display: inline-block;
      background-color: #dbeafe;
      color: #1e40af;
      padding: 8px 20px;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 24px;
      letter-spacing: 1px;
    }
    @media only screen and (max-width: 600px) {
      body {
        padding: 20px 12px;
      }
      .header {
        padding: 30px 16px;
      }
      .header h1 {
        font-size: 24px;
      }
      .content {
        padding: 32px 20px;
      }
      .envelope {
        height: 200px;
      }
      .recipient-name {
        font-size: 28px;
      }
      .message {
        font-size: 16px;
      }
      .cta-button {
        padding: 16px 40px;
        font-size: 16px;
        width: 100%;
        max-width: 280px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <h1>EVERBLUEVELOPE</h1>
    </div>

    <!-- Content -->
    <div class="content">
      <div class="invitation-type">INVITATION NUMÉRIQUE</div>
      
      <!-- Enveloppe avec nom du destinataire -->
      <div class="envelope-container">
        <div class="envelope">
          <div class="envelope-flap"></div>
          <div class="recipient-name">${recipientName}</div>
        </div>
      </div>

      <!-- Message -->
      <p class="message">
        Une invitation exclusive vous a été adressée.<br>
        Cliquez sur le bouton ci-dessous pour découvrir votre carte personnalisée.
      </p>

      <!-- Bouton CTA -->
      <a href="${invitationUrl}" class="cta-button">
        OPEN CARD
      </a>
      
      <div class="security-note">
        ⚠️ Ce lien est personnel et unique à votre invitation.
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>Cette invitation a été créée avec Everblue</p>
      <div class="footer-links">
        <p>Si le bouton ne fonctionne pas, copiez ce lien :</p>
        <p><a href="${invitationUrl}">${invitationUrl}</a></p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Générer une URL unique pour l'invitation
 */
export function generateInvitationUrl(token: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/invitation/${token}`;
}

/**
 * Générer un token unique pour l'invitation
 */
export function generateInvitationToken(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}