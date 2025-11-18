// services/DesignAnalysisService.ts
import { groqApi } from "./groqApi";

export interface DesignAnalysis {
  improvements: string[];
  newDesign: {
    bgColor?: string;
    items?: any[];
    suggestions?: string[];
  };
  explanation: string;
}

export class DesignAnalysisService {
  static async analyzeAndImprove(
    currentDesign: any,
    userRequest: string
  ): Promise<DesignAnalysis> {
    const designDescription = this.describeCurrentDesign(currentDesign);

    const prompt = `
En tant qu'expert en design graphique, analyse ce design de carte et propose des améliorations basées sur la demande de l'utilisateur.

DESIGN ACTUEL:
${designDescription}

DEMANDE DE L'UTILISATEUR: "${userRequest}"

ANALYSE ET PROPOSITIONS:
1. Analyse les points forts et faibles du design actuel
2. Propose 2-3 améliorations spécifiques
3. Génère un nouveau design amélioré

RÉPONSE AU FORMAT JSON:
{
  "improvements": ["amélioration1", "amélioration2", "amélioration3"],
  "newDesign": {
    "bgColor": "nouvelle couleur/gradient",
    "items": [tableau des nouveaux éléments],
    "suggestions": ["suggestion1", "suggestion2"]
  },
  "explanation": "Explication détaillée des améliorations proposées"
}

IMPORTANT: 
- Garde la structure générale mais améliore l'esthétique
- Propose des couleurs modernes et harmonieuses
- Améliore la typographie et l'équilibre visuel
- Respecte l'intention originale tout en modernisant
`;

    try {
      const response = await groqApi([
        {
          role: "system",
          content: `Tu es un designer graphique expert. 
          Analyse les designs existants et propose des améliorations modernes et esthétiques.
          Réponds TOUJOURS en JSON valide.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ]);

      console.log("Réponse analyse design:", response);

      // Extraire le JSON de la réponse
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        return {
          improvements: data.improvements || [],
          newDesign: data.newDesign || {},
          explanation:
            data.explanation ||
            "Améliorations proposées basées sur votre design actuel.",
        };
      }

      throw new Error("Format de réponse invalide");
    } catch (error) {
      console.error("Erreur DesignAnalysisService:", error);
      return this.getFallbackAnalysis(currentDesign, userRequest);
    }
  }

  private static describeCurrentDesign(design: any): string {
    const description = [];

    // Description du fond
    if (design.bgColor) {
      description.push(
        `- Fond: ${
          design.bgColor.includes("gradient") ? "Dégradé" : "Couleur unie"
        } (${design.bgColor})`
      );
    }
    if (design.bgImage) {
      description.push(`- Image de fond: Oui`);
    }

    // Description des éléments
    if (design.items && design.items.length > 0) {
      description.push(`- Nombre d'éléments: ${design.items.length}`);

      design.items.forEach((item: any, index: number) => {
        if (item.type === "text") {
          description.push(
            `  Élément ${index + 1}: Texte "${item.text?.substring(
              0,
              50
            )}..." - Police: ${item.fontFamily} - Taille: ${item.fontSize}px`
          );
        } else if (item.type === "image") {
          description.push(`  Élément ${index + 1}: Image`);
        } else if (item.type === "video") {
          description.push(`  Élément ${index + 1}: Vidéo`);
        } else if (item.type === "gif") {
          description.push(`  Élément ${index + 1}: GIF`);
        }
      });
    } else {
      description.push(`- Aucun élément ajouté`);
    }

    return description.join("\n");
  }

  private static getFallbackAnalysis(
    currentDesign: any,
    userRequest: string
  ): DesignAnalysis {
    // Fallback avec améliorations basiques
    const improvements = [
      "Harmonisation des couleurs pour un look plus moderne",
      "Amélioration de la typographie et de la hiérarchie visuelle",
      "Rééquilibrage de la composition",
    ];

    return {
      improvements,
      newDesign: {
        bgColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        items: currentDesign.items || [],
        suggestions: [
          "Ajouter plus d'espace entre les éléments",
          "Utiliser des contrastes plus forts",
        ],
      },
      explanation: `J'ai analysé votre design et propose ces améliorations pour le rendre plus moderne et professionnel.`,
    };
  }
}
