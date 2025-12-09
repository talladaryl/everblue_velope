/**
 * Template email avec enveloppe statique
 * Le destinataire reçoit une enveloppe fermée avec son nom
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
  envelopeColor = "#26452b", // Vert par défaut
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
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 20px;
      min-height: 100vh;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 30px;
      text-align: center;
      color: white;
    }
    .header h1 {
      font-size: 28px;
      margin-bottom: 10px;
      font-weight: 600;
    }
    .header p {
      font-size: 16px;
      opacity: 0.9;
    }
    .content {
      padding: 40px 30px;
      text-align: center;
    }
    .envelope-container {
      position: relative;
      width: 100%;
      max-width: 400px;
      margin: 0 auto 30px;
      perspective: 1000px;
    }
    .envelope {
      position: relative;
      width: 100%;
      height: 250px;
      background: ${envelopeColor};
      border-radius: 4px;
      box-shadow: 
        0 10px 30px rgba(0, 0, 0, 0.2),
        inset 0 -2px 10px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .envelope::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 0;
      border-left: 200px solid transparent;
      border-right: 200px solid transparent;
      border-top: 120px solid rgba(0, 0, 0, 0.1);
    }
    .envelope::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 0;
      border-left: 200px solid transparent;
      border-right: 200px solid transparent;
      border-bottom: 130px solid rgba(0, 0, 0, 0.05);
    }
    .recipient-name {
      position: relative;
      z-index: 10;
      background: rgba(255, 255, 255, 0.95);
      padding: 15px 30px;
      border-radius: 8px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      font-size: 24px;
      font-weight: 600;
      color: #333;
      font-family: 'Brush Script MT', cursive;
      letter-spacing: 1px;
    }
    .message {
      font-size: 18px;
      color: #555;
      margin-bottom: 30px;
      line-height: 1.6;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-decoration: none;
      padding: 18px 50px;
      border-radius: 50px;
      font-size: 18px;
      font-weight: 600;
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 15px 40px rgba(102, 126, 234, 0.6);
    }
    .footer {
      background: #f8f9fa;
      padding: 25px;
      text-align: center;
      color: #666;
      font-size: 14px;
      border-top: 1px solid #e9ecef;
    }
    .footer p {
      margin: 5px 0;
    }
    .footer a {
      color: #667eea;
      text-decoration: none;
    }
    @media only screen and (max-width: 600px) {
      .header h1 {
        font-size: 24px;
      }
      .envelope {
        height: 200px;
      }
      .recipient-name {
        font-size: 20px;
        padding: 12px 25px;
      }
      .message {
        font-size: 16px;
      }
      .cta-button {
        padding: 15px 40px;
        font-size: 16px;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <h1>✉️ Vous avez reçu une invitation</h1>
      <p>Une surprise vous attend...</p>
    </div>

    <!-- Content -->
    <div class="content">
      <!-- Enveloppe avec nom du destinataire -->
      <div class="envelope-container">
        <div class="envelope">
          <div class="recipient-name">${recipientName}</div>
        </div>
      </div>

      <!-- Message -->
      <p class="message">
        Une invitation spéciale vous attend !<br>
        Cliquez sur le bouton ci-dessous pour découvrir votre carte personnalisée.
      </p>

      <!-- Bouton CTA -->
      <a href="${invitationUrl}" class="cta-button">
        🎉 Open Card
      </a>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p>Cette invitation a été créée avec ❤️</p>
      <p>Si le bouton ne fonctionne pas, copiez ce lien : <a href="${invitationUrl}">${invitationUrl}</a></p>
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
