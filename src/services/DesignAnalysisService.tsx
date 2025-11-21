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
    // Déterminer le type de design basé sur la requête
    const requestLower = userRequest.toLowerCase();
    let bgColor = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    let mainText = "Votre Message Ici";
    let fontSize = 24;
    let fontFamily = "'Poppins', sans-serif";
    let textColor = "#ffffff";

    // Adapter selon le type de carte demandé
    if (requestLower.includes("mariage") || requestLower.includes("wedding")) {
      bgColor = "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)";
      mainText = "Vous êtes invités à notre mariage";
      fontSize = 28;
      fontFamily = "'Playfair Display', serif";
      textColor = "#8b4513";
    } else if (
      requestLower.includes("anniversaire") ||
      requestLower.includes("birthday")
    ) {
      bgColor = "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)";
      mainText = "Joyeux Anniversaire!";
      fontSize = 32;
      fontFamily = "'Dancing Script', cursive";
      textColor = "#ffffff";
    } else if (
      requestLower.includes("professionnel") ||
      requestLower.includes("business") ||
      requestLower.includes("corporate")
    ) {
      bgColor = "linear-gradient(90deg, #1e3a8a 0%, #3b82f6 100%)";
      mainText = "Invitation Professionnelle";
      fontSize = 22;
      fontFamily = "'Inter', sans-serif";
      textColor = "#ffffff";
    } else if (
      requestLower.includes("moderne") ||
      requestLower.includes("modern")
    ) {
      bgColor = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
      mainText = "Design Moderne";
      fontSize = 26;
      fontFamily = "'Montserrat', sans-serif";
      textColor = "#ffffff";
    }

    // Améliorer le design existant ou créer un nouveau
    const hasItems = currentDesign.items && currentDesign.items.length > 0;
    const newItems = hasItems
      ? currentDesign.items.map((item: any) => {
          if (item.type === "text") {
            return {
              ...item,
              fontFamily: fontFamily,
              color: textColor,
              fontSize: Math.max(item.fontSize || 16, fontSize - 4),
            };
          }
          return item;
        })
      : [
          {
            id: "text-1",
            type: "text",
            text: mainText,
            x: 50,
            y: 80,
            fontSize: fontSize,
            color: textColor,
            fontFamily: fontFamily,
            fontWeight: "bold",
            textAlign: "center",
          },
          {
            id: "text-2",
            type: "text",
            text: "Rejoignez-nous pour célébrer",
            x: 50,
            y: 140,
            fontSize: fontSize - 8,
            color: textColor,
            fontFamily: fontFamily,
            fontWeight: "normal",
            textAlign: "center",
          },
        ];

    const improvements = hasItems
      ? [
          "Harmonisation des couleurs pour un look plus moderne",
          "Amélioration de la typographie et de la hiérarchie visuelle",
          "Rééquilibrage de la composition et des espacements",
        ]
      : [
          "Création d'un design cohérent et esthétique",
          "Utilisation de couleurs harmonieuses et modernes",
          "Typographie élégante et lisible",
        ];

    return {
      improvements,
      newDesign: {
        bgColor: bgColor,
        items: newItems,
        suggestions: [
          "Personnalisez le texte selon vos besoins",
          "Ajoutez des images ou des éléments décoratifs",
          "Ajustez les couleurs à votre thème",
        ],
      },
      explanation: hasItems
        ? `J'ai analysé votre design et propose ces améliorations pour le rendre plus moderne et professionnel selon votre demande.`
        : `J'ai créé un design ${
            requestLower.includes("mariage")
              ? "élégant pour un mariage"
              : requestLower.includes("anniversaire")
              ? "festif pour un anniversaire"
              : requestLower.includes("professionnel")
              ? "professionnel"
              : "moderne"
          } avec une typographie soignée et des couleurs harmonieuses.`,
    };
  }
}
