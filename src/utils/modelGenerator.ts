// utils/modelGenerator.ts

// Templates de messages pour le modèle
const MESSAGE_TEMPLATES = {
  whatsapp: {
    casual:
      "Salut {name} ! Je t'invite à mon événement le {date}. Réponds-moi pour confirmer !",
    formal:
      "Bonjour {name}, vous êtes cordialement invité(e) à notre événement du {date}. Nous espérons vous y voir.",
    reminder: "Rappel : {name}, n'oubliez pas notre événement demain !",
  },
  email: {
    casual: "Salut {name},\n\nTu es invité à mon événement !\n\nÀ bientôt !",
    formal:
      "Madame, Monsieur {name},\n\nNous avons le plaisir de vous convier à notre événement.\n\nCordialement,",
    invitation:
      "Cher(e) {name},\n\nC'est avec plaisir que je vous invite à rejoindre cet événement spécial.",
  },
};

// Fonction pour remplacer les variables dans le texte
const replaceVariablesInText = (text: string, guestData: any): string => {
  if (!text || !guestData) return text;

  let result = text;
  result = result.replace(/\{\{name\}\}/g, guestData.name || "");
  result = result.replace(
    /\{\{first_name\}\}/g,
    guestData.name?.split(" ")[0] || ""
  );
  result = result.replace(
    /\{\{last_name\}\}/g,
    guestData.name?.split(" ").slice(1).join(" ") || ""
  );
  result = result.replace(/\{\{email\}\}/g, guestData.email || "");
  result = result.replace(/\{\{location\}\}/g, guestData.location || "");
  result = result.replace(/\{\{lieu\}\}/g, guestData.location || "");
  result = result.replace(/\{\{date\}\}/g, guestData.date || "");
  result = result.replace(/\{\{time\}\}/g, guestData.time || "");
  result = result.replace(/\{\{heure\}\}/g, guestData.time || "");

  return result;
};

// Fonction principale pour générer l'HTML du modèle
export const generateModelHTML = (
  modelId: string,
  items: any[],
  bgColor: string,
  guest: any
): string => {
  // Remplacer les variables dans les items
  const processedItems = items.map((it: any) => {
    if (it.type === "text" && it.text) {
      return {
        ...it,
        text: replaceVariablesInText(it.text, guest),
      };
    }
    return it;
  });

  // Date actuelle formatée pour les templates
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Générer l'HTML de base selon le modèle
  let html = `
  <!DOCTYPE html>
  <html lang="fr">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invitation</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        margin: 0;
        padding: 0;
        background: ${bgColor};
        min-height: 100vh;
      }
      .invitation-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
      }
      .model-content {
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        overflow: hidden;
      }
      .text-element {
        margin: 0;
        line-height: 1.6;
      }
      .image-element {
        display: block;
        max-width: 100%;
        height: auto;
        margin: 0 auto;
      }
    </style>
  </head>
  <body>
    <div class="invitation-container">
  `;

  // Générer le contenu selon le modèle sélectionné
  switch (modelId) {
    case "model1":
      html += `
      <div class="model-content" style="padding: 40px; text-align: center;">
        <div style="border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #1e40af; font-size: 2.5rem; margin: 0;">Invitation Spéciale</h1>
        </div>
      `;
      processedItems.forEach((item: any, index: number) => {
        if (item.type === "text") {
          html += `
          <div style="margin-bottom: ${
            index === processedItems.length - 1 ? "0" : "25px"
          }">
            <p class="text-element" style="
              color: ${item.color || "#1f2937"};
              font-size: ${item.fontSize || 16}px;
              font-family: ${
                item.fontFamily ||
                "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
              };
              font-weight: ${item.fontWeight || "normal"};
              text-align: ${item.textAlign || "center"};
              margin: 0;
            ">${item.text}</p>
          </div>`;
        } else if (item.type === "image") {
          html += `
          <div style="margin: 30px 0;">
            <img src="${item.src}" class="image-element" style="
              width: ${item.width || 400}px;
              height: ${item.height || 300}px;
              border-radius: ${item.borderRadius || 8}px;
              object-fit: cover;
            " />
          </div>`;
        }
      });
      html += `
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            Envoyé à ${guest?.name || "l'invité(e)"} • ${formattedDate}
          </p>
        </div>
      </div>`;
      break;

    case "model2":
      html += `
      <div class="model-content" style="
        padding: 50px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        text-align: center;
      ">
        <div style="max-width: 600px; margin: 0 auto;">
          <div style="margin-bottom: 40px;">
            <h1 style="font-size: 3rem; margin: 0 0 10px 0; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">Cérémonie</h1>
            <p style="font-size: 1.2rem; opacity: 0.9;">Votre présence nous honore</p>
          </div>
      `;
      processedItems.forEach((item: any, index: number) => {
        if (item.type === "text") {
          html += `
          <div style="margin-bottom: ${
            index === processedItems.length - 1 ? "0" : "30px"
          }">
            <p class="text-element" style="
              color: ${item.color || "white"};
              font-size: ${item.fontSize || 18}px;
              font-family: ${item.fontFamily || "'Georgia', serif"};
              font-weight: ${item.fontWeight || "normal"};
              text-align: ${item.textAlign || "center"};
              margin: 0;
              text-shadow: 0 1px 3px rgba(0,0,0,0.3);
            ">${item.text}</p>
          </div>`;
        } else if (item.type === "image") {
          html += `
          <div style="margin: 40px 0;">
            <img src="${item.src}" class="image-element" style="
              width: ${item.width || 450}px;
              height: ${item.height || 350}px;
              border-radius: ${item.borderRadius || 12}px;
              object-fit: cover;
              box-shadow: 0 8px 30px rgba(0,0,0,0.3);
            " />
          </div>`;
        }
      });
      html += `
          <div style="margin-top: 50px; padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.2);">
            <p style="font-size: 14px; opacity: 0.8; margin: 0;">
              Nous avons hâte de vous accueillir • ${
                guest?.name || "Cher invité"
              }
            </p>
          </div>
        </div>
      </div>`;
      break;

    case "model3":
      html += `
      <div class="model-content" style="
        padding: 60px 40px;
        background: white;
        text-align: center;
        position: relative;
      ">
        <div style="
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: linear-gradient(90deg, #f59e0b, #ef4444, #8b5cf6);
        "></div>
        
        <div style="max-width: 650px; margin: 0 auto;">
          <div style="margin-bottom: 40px;">
            <h2 style="color: #1f2937; font-size: 2.2rem; margin: 0 0 15px 0;">INVITATION</h2>
            <div style="width: 80px; height: 3px; background: #3b82f6; margin: 0 auto;"></div>
          </div>
      `;
      processedItems.forEach((item: any, index: number) => {
        if (item.type === "text") {
          html += `
          <div style="
            margin-bottom: ${
              index === processedItems.length - 1 ? "0" : "25px"
            };
            padding: ${index === 0 ? "0" : "15px"};
            ${index === 0 ? "" : "border-left: 3px solid #d1d5db;"}
          ">
            <p class="text-element" style="
              color: ${item.color || "#374151"};
              font-size: ${item.fontSize || 17}px;
              font-family: ${item.fontFamily || "'Inter', sans-serif"};
              font-weight: ${item.fontWeight || "normal"};
              text-align: ${item.textAlign || "center"};
              margin: 0;
            ">${item.text}</p>
          </div>`;
        } else if (item.type === "image") {
          html += `
          <div style="margin: 35px 0;">
            <img src="${item.src}" class="image-element" style="
              width: ${item.width || 500}px;
              height: ${item.height || 350}px;
              border-radius: ${item.borderRadius || 16}px;
              object-fit: cover;
              border: 4px solid white;
              box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            " />
          </div>`;
        }
      });
      html += `
          <div style="margin-top: 50px; padding: 25px; background: #f9fafb; border-radius: 10px;">
            <p style="color: #6b7280; font-size: 15px; margin: 0;">
              Envoyé avec joie à ${guest?.name || "vous"} • ${formattedDate}
            </p>
          </div>
        </div>
      </div>`;
      break;

    // Modèles 4 à 12 (similaires - vous pouvez les compléter)
    case "model4":
    case "model5":
    case "model6":
    case "model7":
    case "model8":
    case "model9":
    case "model10":
    case "model11":
    case "model12":
      // Modèle générique pour les autres modèles
      html += `
      <div class="model-content" style="padding: 40px; background: white;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #1e40af; margin: 0;">Invitation</h2>
        </div>
      `;
      processedItems.forEach((item: any) => {
        if (item.type === "text") {
          html += `
          <div style="margin-bottom: 20px; padding: 15px; background: #f8fafc; border-radius: 8px;">
            <p class="text-element" style="
              color: ${item.color || "#1f2937"};
              font-size: ${item.fontSize || 16}px;
              font-family: ${
                item.fontFamily ||
                "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
              };
              font-weight: ${item.fontWeight || "normal"};
              text-align: ${item.textAlign || "left"};
              margin: 0;
            ">${item.text}</p>
          </div>`;
        } else if (item.type === "image") {
          html += `
          <div style="text-align: center; margin: 25px 0;">
            <img src="${item.src}" class="image-element" style="
              width: ${item.width || 400}px;
              height: ${item.height || 300}px;
              border-radius: ${item.borderRadius || 8}px;
              object-fit: cover;
            " />
          </div>`;
        }
      });
      html += `
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
          <p style="color: #6b7280; font-size: 14px; margin: 0;">
            Pour ${guest?.name || "l'invité(e)"} • ${formattedDate}
          </p>
        </div>
      </div>`;
      break;

    default:
      // Modèle par défaut
      html += `
      <div class="model-content" style="padding: 40px;">
        <div style="max-width: 700px; margin: 0 auto;">
      `;
      processedItems.forEach((item: any) => {
        if (item.type === "text") {
          html += `
          <div style="margin-bottom: 20px;">
            <p class="text-element" style="
              color: ${item.color || "#1f2937"};
              font-size: ${item.fontSize || 16}px;
              font-family: ${
                item.fontFamily ||
                "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
              };
              font-weight: ${item.fontWeight || "normal"};
              text-align: ${item.textAlign || "left"};
              margin: 0;
              line-height: 1.8;
            ">${item.text}</p>
          </div>`;
        } else if (item.type === "image") {
          html += `
          <div style="text-align: center; margin: 30px 0;">
            <img src="${item.src}" class="image-element" style="
              width: ${item.width || 500}px;
              height: ${item.height || 350}px;
              border-radius: ${item.borderRadius || 12}px;
              object-fit: cover;
              box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            " />
          </div>`;
        }
      });
      html += `
          <div style="margin-top: 50px; padding: 20px; background: #f3f4f6; border-radius: 10px; text-align: center;">
            <p style="color: #4b5563; font-size: 15px; margin: 0;">
              Cette invitation est personnellement adressée à ${
                guest?.name || "vous"
              }
            </p>
          </div>
        </div>
      </div>`;
      break;
  }

  html += `
    </div>
  </body>
  </html>`;

  return html;
};

// Fonction pour extraire les variables des items
export const extractVariablesFromItems = (items: any[]): string[] => {
  const variables = new Set<string>();
  const regex = /\{\{(\w+)\}\}/g;

  items.forEach((item: any) => {
    if (item.type === "text" && item.text) {
      let match: RegExpExecArray | null;
      while ((match = regex.exec(item.text)) !== null) {
        variables.add(match[1]);
      }
    }
  });

  return Array.from(variables);
};

// Fonction pour valider le template pour un invité
export const validateTemplateForGuest = (
  items: any[],
  guest: any
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const variables = extractVariablesFromItems(items);

  // Vérifier que toutes les variables ont une valeur dans l'invité
  variables.forEach((variable) => {
    if (!guest || !guest[variable]) {
      errors.push(`Variable {{${variable}}} non définie pour cet invité.`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
};
