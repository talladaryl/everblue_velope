/**
 * Template email avec enveloppe statique - Thème Bleu
 * Le destinataire reçoit une enveloppe fermée avec son nom en blanc
 * et un bouton pour ouvrir la carte sur le web
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
      background-color: #f8fafc;
      padding: 40px 20px;
      min-height: 100vh;
    }
    .email-container {
      max-width: 580px;
      margin: 0 auto;
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
    }
    .header {
      background-color: #1e40af;
      padding: 32px;
      text-align: center;
      color: white;
    }
    .header-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }
    .header h1 {
      font-size: 26px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    .header-icon {
      font-size: 32px;
      animation: float 3s ease-in-out infinite;
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
    .content {
      padding: 48px 32px;
      text-align: center;
    }
    .envelope-container {
      position: relative;
      width: 100%;
      max-width: 380px;
      margin: 0 auto 40px;
    }
    .envelope {
      position: relative;
      width: 100%;
      height: 240px;
      background: ${envelopeColor};
      border-radius: 12px;
      box-shadow: 
        0 8px 20px rgba(30, 64, 175, 0.2),
        inset 0 2px 0 rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .envelope:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
    }
    .envelope-flap {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 60px;
      background: #1e3a8a;
      clip-path: polygon(0 0, 50% 100%, 100% 0);
      transform-origin: top;
    }
    .recipient-name {
      position: relative;
      z-index: 2;
      color: white;
      font-size: 32px;
      font-weight: 600;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      font-family: 'Georgia', 'Times New Roman', serif;
      letter-spacing: 0.5px;
      padding: 0 24px;
      text-align: center;
      width: 100%;
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
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      background-color: #3b82f6;
      color: white;
      text-decoration: none;
      padding: 18px 40px;
      border-radius: 12px;
      font-size: 18px;
      font-weight: 600;
      box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
      transition: all 0.3s ease;
      border: none;
      cursor: pointer;
      min-width: 220px;
    }
    .cta-button:hover {
      background-color: #2563eb;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
    }
    .cta-button:active {
      transform: translateY(0);
    }
    .security-note {
      margin-top: 24px;
      font-size: 14px;
      color: #6b7280;
      background-color: #f9fafb;
      padding: 12px 20px;
      border-radius: 8px;
      display: inline-block;
      border-left: 4px solid #3b82f6;
    }
    .footer {
      background-color: #f1f5f9;
      padding: 28px;
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
    .stamp {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 60px;
      height: 60px;
      background: white;
      border-radius: 50%;
      border: 2px dashed #ef4444;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: #ef4444;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      z-index: 3;
    }
    .invitation-type {
      display: inline-block;
      background-color: #dbeafe;
      color: #1e40af;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 24px;
      letter-spacing: 0.5px;
    }
    @media only screen and (max-width: 600px) {
      body {
        padding: 20px 12px;
      }
      .header {
        padding: 24px 16px;
      }
      .header h1 {
        font-size: 22px;
      }
      .content {
        padding: 32px 20px;
      }
      .envelope {
        height: 200px;
      }
      .recipient-name {
        font-size: 26px;
      }
      .message {
        font-size: 16px;
      }
      .cta-button {
        padding: 16px 32px;
        font-size: 16px;
        min-width: auto;
        width: 100%;
        max-width: 280px;
      }
      .stamp {
        width: 50px;
        height: 50px;
        font-size: 10px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <div class="header-content">
        <div class="header-icon">✉️</div>
        <div>
          <h1>Invitation Personnelle</h1>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="content">
      <div class="invitation-type">INVITATION NUMÉRIQUE</div>
      
      <!-- Enveloppe avec nom du destinataire -->
      <div class="envelope-container">
        <div class="envelope">
          <div class="envelope-flap"></div>
          <div class="stamp">IMPORTANT</div>
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
        <span>🎉</span>
        Ouvrir l'Invitation
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