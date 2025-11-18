// services/designService.ts
import { groqApi } from "./groqApi";
import { UNIFIED_TEMPLATES } from "@/data/templates";

export class DesignService {
  static async generateDesignFromDescription(description: string): Promise<{
    template: any | null;
    suggestions: string[];
    elements: any[];
    message: string;
  }> {
    const prompt = `
En tant qu'assistant design expert, analyse cette description de carte et recommande le meilleur template.

DESCRIPTION UTILISATEUR: "${description}"

TEMPLATES DISPONIBLES par catégorie:

🎂 ANNIVERSAIRE (birthday):
- Anniversaire Joyeux: carte festive colorée
- Fête Colorée: anniversaire avec couleurs vibrantes

💖 AMOUR/ROMANTIQUE (love):
- Carte d'Amour: déclaration romantique
- Saint-Valentin: fête des amoureux

💼 PROFESSIONNEL (business):
- Corporate Élégant: design professionnel
- Luxe Moderne: style premium

🎨 SIMPLE (simple):
- Design Épuré: minimaliste et élégant
- Carte Basique: classique et intemporel

Réponds AU FORMAT JSON avec:
{
  "recommendedTemplate": "id_du_template",
  "reason": "explication courte pourquoi ce template convient",
  "suggestedElements": ["élément1", "élément2"],
  "colorAdvice": "conseil couleurs",
  "category": "category_du_template"
}

IMPORTANT: Si la description mentionne "anniversaire", CHOISIS UN TEMPLATE DE CATÉGORIE "birthday"!
`;

    try {
      const response = await groqApi([
        {
          role: "system",
          content: `Tu es un assistant design spécialisé dans la création de cartes. 
          Réponds TOUJOURS en JSON valide. 
          Les catégories disponibles sont: birthday, love, business, simple.
          Pour les anniversaires, utilise toujours la catégorie "birthday".`,
        },
        {
          role: "user",
          content: prompt,
        },
      ]);

      console.log("Réponse Groq:", response);

      // Extraire le JSON de la réponse
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const data = JSON.parse(jsonMatch[0]);
          console.log("Données parsées:", data);

          // Chercher le template par ID d'abord, puis par catégorie
          let template = UNIFIED_TEMPLATES.find(
            (t) => t.id === data.recommendedTemplate
          );

          // Si pas trouvé par ID, chercher par catégorie
          if (!template && data.category) {
            const categoryTemplates = UNIFIED_TEMPLATES.filter(
              (t) => t.category === data.category
            );
            if (categoryTemplates.length > 0) {
              template = categoryTemplates[0]; // Prendre le premier de la catégorie
            }
          }

          // Fallback: si toujours pas trouvé, prendre un template d'anniversaire pour les demandes d'anniversaire
          if (!template && description.toLowerCase().includes("anniversaire")) {
            template = UNIFIED_TEMPLATES.find((t) => t.category === "birthday");
          }

          console.log("Template sélectionné:", template);

          if (template) {
            return {
              template: template,
              suggestions: data.suggestedElements || [
                "Message personnalisé",
                "Date",
                "Lieu",
              ],
              elements: this.generateElementsFromSuggestions(
                data.suggestedElements || []
              ),
              message:
                `🎨 **J'ai trouvé le template parfait: "${template.name}"**\n\n` +
                `📋 **Catégorie**: ${this.getCategoryLabel(
                  template.category
                )}\n` +
                `💡 **Conseils**: ${
                  data.reason || "Parfait pour votre occasion!"
                }\n\n` +
                `Je vais appliquer ce design automatiquement !`,
            };
          }
        } catch (parseError) {
          console.error("Erreur parsing JSON:", parseError);
        }
      }

      // Fallback pour les anniversaires
      if (description.toLowerCase().includes("anniversaire")) {
        const birthdayTemplate = UNIFIED_TEMPLATES.find(
          (t) => t.category === "birthday"
        );
        if (birthdayTemplate) {
          return {
            template: birthdayTemplate,
            suggestions: ["Message d'anniversaire", "Âge", "Date de fête"],
            elements: [],
            message:
              "🎂 **Template d'anniversaire sélectionné!** Je applique un design festif pour célébrer cette occasion spéciale!",
          };
        }
      }

      return {
        template: null,
        suggestions: [],
        elements: [],
        message:
          "Je n'ai pas pu trouver un template parfaitement adapté. Pouvez-vous préciser votre demande ? Par exemple : 'carte d'anniversaire colorée' ou 'carte professionnelle sobre'.",
      };
    } catch (error) {
      console.error("Erreur DesignService:", error);

      // Fallback en cas d'erreur
      if (description.toLowerCase().includes("anniversaire")) {
        const birthdayTemplate = UNIFIED_TEMPLATES.find(
          (t) => t.category === "birthday"
        );
        if (birthdayTemplate) {
          return {
            template: birthdayTemplate,
            suggestions: ["Message de félicitations", "Âge", "Célébration"],
            elements: [],
            message:
              "🎉 **Template d'anniversaire appliqué!** Profitez de cette carte festive!",
          };
        }
      }

      return {
        template: null,
        suggestions: [],
        elements: [],
        message:
          "Désolé, je rencontre un problème technique. Mais voici un template d'anniversaire par défaut!",
      };
    }
  }

  private static generateElementsFromSuggestions(suggestions: string[]): any[] {
    const elements: any[] = [];

    suggestions.forEach((suggestion, index) => {
      elements.push({
        id: `suggestion-${Date.now()}-${index}`,
        type: "text",
        text: suggestion,
        x: 50,
        y: 100 + index * 60,
        fontSize: 16,
        color: "#000000",
        fontFamily: "'Inter', sans-serif",
      });
    });

    return elements;
  }

  private static getCategoryLabel(category: string): string {
    const labels: { [key: string]: string } = {
      birthday: "🎂 Anniversaire",
      love: "💖 Amour & Romance",
      business: "💼 Professionnel",
      simple: "🎨 Simple & Élégant",
      premium: "⭐ Premium",
    };
    return labels[category] || category;
  }
}
