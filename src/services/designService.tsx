// services/designService.ts
import { groqApi } from "./groqApi";
import { UNIFIED_TEMPLATES } from "@/data/templates";

export class DesignService {
  static async generateDesignFromDescription(description: string) {
    const prompt = `
Analyse la description de la carte ci-dessous et renvoie STRICTEMENT un JSON valide.

DESCRIPTION: "${description}"

FORMAT ATTENDU:
{
  "recommendedTemplate": "id_du_template",
  "category": "birthday | love | business | simple",
  "reason": "texte court",
  "suggestedElements": ["texte1", "texte2"],
  "colorAdvice": "texte"
}

IMPORTANT:
- Réponds uniquement du JSON.
- Jamais de texte autour.
- Si tu n'as pas d’idée → mets null.
`;

    try {
      const raw = await groqApi([
        {
          role: "system",
          content:
            "Tu es un assistant design. Tu DOIS répondre uniquement avec un JSON valide, sans aucun texte autour.",
        },
        {
          role: "user",
          content: prompt,
        },
      ]);

      console.log("🔥 Réponse brute GROQ:", raw);

      // Extraction JSON super robuste
      const safeJson = DesignService.extractJson(raw);

      if (!safeJson) {
        console.warn("⚠️ Impossible d'extraire le JSON, fallback…");
        return DesignService.fallback(description);
      }

      const data = DesignService.safeParseJSON(safeJson);

      if (!data) {
        console.warn("⚠️ JSON invalide après parsing, fallback…");
        return DesignService.fallback(description);
      }

      // Sélection du template
      const template = DesignService.resolveTemplate(
        data.recommendedTemplate,
        data.category,
        description
      );

      return {
        template,
        suggestions: data.suggestedElements || ["Texte", "Date", "Message"],
        elements: DesignService.generateElementsFromSuggestions(
          data.suggestedElements || []
        ),
        message: `🎨 Template sélectionné : **${template?.name || "aucun"}**`,
      };
    } catch (err) {
      console.error("❌ Erreur DesignService:", err);
      return DesignService.fallback(description);
    }
  }

  // -------------------------------
  // 🔹 Extraction JSON ultra robuste
  // -------------------------------
  private static extractJson(text: string): string | null {
    if (!text) return null;

    // supprime les ```json ou ``` code blocks
    text = text.replace(/```[\s\S]*?```/g, (block) => {
      const jsonInside = block.match(/\{[\s\S]*\}/);
      return jsonInside ? jsonInside[0] : "";
    });

    // capture le premier objet JSON
    const match = text.match(/\{[\s\S]*\}/);

    return match ? match[0] : null;
  }

  // -------------------------------
  // 🔹 Parsing JSON sécurisé
  // -------------------------------
  private static safeParseJSON(json: string) {
    try {
      return JSON.parse(json);
    } catch (e) {
      console.error("❌ Parsing JSON impossible:", e);
      console.log("Contenu JSON reçu =", json);
      return null;
    }
  }

  // -------------------------------
  // 🔹 Résolution du template
  // -------------------------------
  private static resolveTemplate(
    id: string | null,
    category: string | null,
    description: string
  ) {
    // 1️⃣ Essai via ID
    if (id) {
      const t = UNIFIED_TEMPLATES.find((x) => x.id === id);
      if (t) return t;
    }

    // 2️⃣ Essai via catégorie
    if (category) {
      const t = UNIFIED_TEMPLATES.find((x) => x.category === category);
      if (t) return t;
    }

    // 3️⃣ Si "anniversaire" dans description → birthday
    if (description.toLowerCase().includes("anniversaire")) {
      const t = UNIFIED_TEMPLATES.find((x) => x.category === "birthday");
      if (t) return t;
    }

    // 4️⃣ Absolument éviter null
    return UNIFIED_TEMPLATES[0];
  }

  // -------------------------------
  // 🔹 Génération d’éléments
  // -------------------------------
  private static generateElementsFromSuggestions(sug: string[]) {
    return sug.map((s, i) => ({
      id: `el-${Date.now()}-${i}`,
      type: "text",
      text: s,
      x: 50,
      y: 120 + i * 50,
      color: "#000",
      fontSize: 18,
    }));
  }

  // -------------------------------
  // 🔹 Fallback en cas d’erreur
  // -------------------------------
  private static fallback(description: string) {
    const defaultTemplate =
      UNIFIED_TEMPLATES.find((t) => t.category === "birthday") ||
      UNIFIED_TEMPLATES[0];

    return {
      template: defaultTemplate,
      suggestions: ["Texte principal", "Sous-titre"],
      elements: [],
      message: `⚠️ Problème technique, j’applique un template par défaut.`,
    };
  }
}
