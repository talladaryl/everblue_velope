// hooks/useGroqChat.ts
import { useState } from "react";
import { ChatMessage } from "@/types/design";
import { DesignService } from "@/services/designService";
import {
  DesignAnalysisService,
  DesignAnalysis,
} from "@/services/DesignAnalysisService";

// Templates unifiés locaux pour fallback
const UNIFIED_TEMPLATES = [
  {
    id: "birthday-1",
    name: "Anniversaire Joyeux",
    category: "birthday",
    bgColor: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    items: [
      {
        id: "text-1",
        type: "text",
        text: "Joyeux Anniversaire!",
        x: 50,
        y: 50,
        fontSize: 26,
        color: "#ffffff",
        fontFamily: "'Dancing Script', cursive",
        fontWeight: "bold",
        textAlign: "center",
      },
    ],
  },
  {
    id: "birthday-2",
    name: "Fête Colorée",
    category: "birthday",
    bgColor: "linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)",
    items: [
      {
        id: "text-1",
        type: "text",
        text: "Bon Anniversaire!",
        x: 50,
        y: 50,
        fontSize: 24,
        color: "#ffffff",
        fontFamily: "'Poppins', sans-serif",
        fontWeight: "bold",
        textAlign: "center",
      },
    ],
  },
  {
    id: "love-1",
    name: "Carte d'Amour",
    category: "love",
    bgColor: "linear-gradient(135deg, #ff6b6b 0%, #f06292 100%)",
    items: [
      {
        id: "text-1",
        type: "text",
        text: "Je t'aime",
        x: 50,
        y: 50,
        fontSize: 30,
        color: "#ffffff",
        fontFamily: "'Great Vibes', cursive",
        fontWeight: "bold",
        textAlign: "center",
      },
    ],
  },
  {
    id: "corporate-1",
    name: "Corporate Élégant",
    category: "business",
    bgColor:
      "linear-gradient(90deg, #1e3a8a 0%, #1e3a8a 50%, #ffffff 50%, #ffffff 100%)",
    items: [
      {
        id: "text-1",
        type: "text",
        text: "Carte de Visite Professionnelle",
        x: 50,
        y: 80,
        fontSize: 18,
        color: "#1f2937",
        fontFamily: "'Inter', sans-serif",
        fontWeight: "bold",
        textAlign: "center",
      },
    ],
  },
];

interface ImprovementState {
  originalDesign: any;
  proposedDesign: any;
  analysis: DesignAnalysis | null;
  isImprovementMode: boolean;
}

export const useGroqChat = (designContext: any) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      content:
        '🎨 **Bonjour ! Je suis votre assistant design IA**\n\nJe peux vous aider à :\n• 🎂 **Créer** une nouvelle carte (anniversaire, professionnelle, etc.)\n• ✨ **Améliorer** votre design existant\n• 💡 **Proposer** des idées créatives\n\n*Exemples : "carte d\'anniversaire colorée" ou "améliore mon design avec un style moderne"*',
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [improvementState, setImprovementState] = useState<ImprovementState>({
    originalDesign: null,
    proposedDesign: null,
    analysis: null,
    isImprovementMode: false,
  });

  // Détection des requêtes d'amélioration
  const detectImprovementRequest = (content: string): boolean => {
    const improvementKeywords = [
      "améliore",
      "améliorer",
      "modernise",
      "amélioration",
      "moderne",
      "organise",
      "organisation",
      "améliore mon",
      "rends plus",
      "style plus",
      "meilleur",
      "perfectionne",
      "optimise",
      "refais",
      "revois",
    ];

    return improvementKeywords.some((keyword) =>
      content.toLowerCase().includes(keyword)
    );
  };

  // Gestion des requêtes de nouveau design
  const handleNewDesignRequest = async (content: string) => {
    console.log("Nouveau design demandé");

    const designResult = await DesignService.generateDesignFromDescription(
      content
    );

    let responseContent = designResult.message;

    if (designResult.template) {
      console.log("Template trouvé, application...", designResult.template);

      setTimeout(() => {
        applyDesignTemplate(designResult.template, designResult.elements);
      }, 500);
    } else {
      const fallbackTemplate = findFallbackTemplate(content);
      if (fallbackTemplate) {
        responseContent = `🎨 **J'ai trouvé un template "${fallbackTemplate.name}" pour vous!**\n\nJe applique ce design automatiquement.`;

        setTimeout(() => {
          applyDesignTemplate(fallbackTemplate, []);
        }, 500);
      }
    }

    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      content: responseContent,
      role: "assistant",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
  };

  // Gestion des requêtes d'amélioration
  const handleImprovementRequest = async (content: string) => {
    console.log("Amélioration demandée");

    // Sauvegarder le design actuel
    const currentDesign = {
      bgColor: designContext.bgColor,
      bgImage: designContext.bgImage,
      items: [...designContext.items],
    };

    try {
      // Analyser et proposer des améliorations
      const analysis = await DesignAnalysisService.analyzeAndImprove(
        currentDesign,
        content
      );

      setImprovementState({
        originalDesign: currentDesign,
        proposedDesign: analysis.newDesign,
        analysis: analysis,
        isImprovementMode: true,
      });

      // Construire le message avec les options
      const improvementMessage = buildImprovementMessage(analysis, content);

      setMessages((prev) => [...prev, improvementMessage]);
    } catch (error) {
      console.error("Erreur lors de l'analyse du design:", error);

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content:
          "❌ Désolé, je n'ai pas pu analyser votre design. Veuillez réessayer avec une description plus spécifique.",
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Message utilisateur
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      console.log("Envoi de la demande:", content);

      // Détection du type de requête
      const isImprovementRequest = detectImprovementRequest(content);

      if (isImprovementRequest) {
        await handleImprovementRequest(content);
      } else {
        await handleNewDesignRequest(content);
      }
    } catch (error) {
      console.error("Erreur useGroqChat:", error);

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content:
          "❌ Désolé, je rencontre un problème technique. Pouvez-vous reformuler votre demande ?",
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Construire le message d'amélioration avec options
  const buildImprovementMessage = (
    analysis: DesignAnalysis,
    userRequest: string
  ): ChatMessage => {
    const improvementsList = analysis.improvements
      .map((imp) => `• ${imp}`)
      .join("\n");

    const content = `✨ **J'ai analysé votre design et voici mes propositions :**

📊 **Améliorations suggérées :**
${improvementsList}

💡 **Explication :**
${analysis.explanation}

🎯 **Que souhaitez-vous faire ?**`;

    return {
      id: (Date.now() + 1).toString(),
      content,
      role: "assistant",
      timestamp: new Date(),
    };
  };

  // Appliquer les améliorations proposées
  const applyImprovements = () => {
    if (!improvementState.proposedDesign) return;

    const { proposedDesign } = improvementState;

    // Appliquer le nouveau design
    if (proposedDesign.bgColor) {
      designContext.setBgColor(proposedDesign.bgColor);
    }

    if (proposedDesign.items && proposedDesign.items.length > 0) {
      designContext.setItems([...proposedDesign.items]);
    }

    // Message de confirmation
    const confirmationMessage: ChatMessage = {
      id: (Date.now() + 2).toString(),
      content:
        "✅ **Améliorations appliquées !**\n\nVotre design a été mis à jour avec les suggestions. Vous pouvez continuer à le modifier ou demander d'autres améliorations.",
      role: "assistant",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, confirmationMessage]);

    // Réinitialiser l'état d'amélioration
    setImprovementState({
      originalDesign: null,
      proposedDesign: null,
      analysis: null,
      isImprovementMode: false,
    });
  };

  // Revenir au design original
  const revertToOriginal = () => {
    if (!improvementState.originalDesign) return;

    const { originalDesign } = improvementState;

    // Restaurer le design original
    designContext.setBgColor(originalDesign.bgColor);
    designContext.setBgImage(originalDesign.bgImage);
    designContext.setItems([...originalDesign.items]);

    // Message de confirmation
    const confirmationMessage: ChatMessage = {
      id: (Date.now() + 2).toString(),
      content:
        "↩️ **Retour au design original**\n\nVotre design a été restauré. N'hésitez pas à demander d'autres types d'améliorations !",
      role: "assistant",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, confirmationMessage]);

    // Réinitialiser l'état d'amélioration
    setImprovementState({
      originalDesign: null,
      proposedDesign: null,
      analysis: null,
      isImprovementMode: false,
    });
  };

  // Fonction de fallback pour trouver un template basé sur le contenu
  const findFallbackTemplate = (content: string) => {
    const contentLower = content.toLowerCase();

    if (
      contentLower.includes("anniversaire") ||
      contentLower.includes("anniv") ||
      contentLower.includes("birthday")
    ) {
      console.log("Fallback: template anniversaire trouvé");
      return UNIFIED_TEMPLATES.find((t) => t.category === "birthday");
    }

    if (
      contentLower.includes("amour") ||
      contentLower.includes("romantique") ||
      contentLower.includes("valentin") ||
      contentLower.includes("love")
    ) {
      console.log("Fallback: template amour trouvé");
      return UNIFIED_TEMPLATES.find((t) => t.category === "love");
    }

    if (
      contentLower.includes("professionnel") ||
      contentLower.includes("corporate") ||
      contentLower.includes("business") ||
      contentLower.includes("entreprise")
    ) {
      console.log("Fallback: template professionnel trouvé");
      return UNIFIED_TEMPLATES.find((t) => t.category === "business");
    }

    console.log("Fallback: template par défaut");
    return UNIFIED_TEMPLATES[0];
  };

  const applyDesignTemplate = (
    template: any,
    additionalElements: any[] = []
  ) => {
    console.log("Application du template:", template);

    if (template && template.bgColor) {
      designContext.setBgColor(template.bgColor);
      designContext.setBgImage(null);

      if (template.items && Array.isArray(template.items)) {
        designContext.setItems([...template.items]);
      }

      if (additionalElements.length > 0) {
        setTimeout(() => {
          designContext.setItems((prev: any[]) => [
            ...prev,
            ...additionalElements,
          ]);
        }, 1000);
      }

      console.log("Template appliqué avec succès");
    } else {
      console.error("Template invalide:", template);
    }
  };

  return {
    messages,
    isLoading,
    sendMessage,
    improvementState,
    applyImprovements,
    revertToOriginal,
  };
};
