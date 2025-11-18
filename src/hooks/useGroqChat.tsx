// hooks/useGroqChat.ts
import { useState } from "react";
import { ChatMessage } from "@/types/design";
import { DesignService } from "@/services/designService";

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

export const useGroqChat = (designContext: any) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      content:
        '🎨 **Bonjour ! Je suis votre assistant design IA**\n\nJe peux vous aider à créer la carte parfaite ! Décrivez-moi ce que vous souhaitez :\n\n• 🎂 **Anniversaire** - Carte festive et colorée\n• 💖 **Amour/Romance** - Carte romantique\n• 💼 **Professionnel** - Design corporate\n• 🎨 **Simple & Élégant** - Minimaliste\n\n*Exemple : "carte d\'anniversaire colorée" ou "design professionnel sobre"*',
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

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

      // Appel au service de design
      const designResult = await DesignService.generateDesignFromDescription(
        content
      );

      console.log("Résultat DesignService:", designResult);

      let responseContent = designResult.message;

      // Appliquer le template si disponible
      if (designResult.template) {
        console.log("Template trouvé, application...", designResult.template);

        // Appliquer le template après un court délai
        setTimeout(() => {
          applyDesignTemplate(designResult.template, designResult.elements);
        }, 500);
      } else {
        // Fallback: chercher manuellement dans les templates unifiés
        console.log("Aucun template trouvé, recherche manuelle...");
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
    } catch (error) {
      console.error("Erreur useGroqChat:", error);

      // Fallback en cas d'erreur
      const fallbackTemplate = findFallbackTemplate(content);
      let errorMessage =
        "Désolé, je rencontre un problème technique. Veuillez réessayer.";

      if (fallbackTemplate) {
        errorMessage = `🔄 **Problème technique - J'applique un template "${fallbackTemplate.name}" de secours!**`;

        setTimeout(() => {
          applyDesignTemplate(fallbackTemplate, []);
        }, 500);
      }

      const errorAssistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: errorMessage,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorAssistantMessage]);
    } finally {
      setIsLoading(false);
    }
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
    return UNIFIED_TEMPLATES[0]; // Premier template par défaut
  };

  const applyDesignTemplate = (
    template: any,
    additionalElements: any[] = []
  ) => {
    console.log("Application du template:", template);

    if (template && template.bgColor) {
      // Appliquer le fond
      designContext.setBgColor(template.bgColor);
      designContext.setBgImage(null);

      // Appliquer les éléments du template
      if (template.items && Array.isArray(template.items)) {
        designContext.setItems([...template.items]);
      }

      // Ajouter les éléments supplémentaires après un délai
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
  };
};
