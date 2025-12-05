import { useCallback, useState } from "react";
import { generateId } from "@/utils/editor";

export function useChatbot() {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [improvementState, setImprovementState] = useState({
    isImprovementMode: false,
    analysis: null,
  });

  const sendMessage = useCallback(async (text: string) => {
    setIsLoading(true);
    const userMsg = { id: generateId("msg"), role: "user", content: text, timestamp: Date.now() };
    setMessages((m) => [...m, userMsg]);

    try {
      // placeholder: ici appeler ton API IA
      await new Promise((r) => setTimeout(r, 800)); // simulate
      const assistantMsg = { id: generateId("msg"), role: "assistant", content: `Réponse IA pour: ${text}`, timestamp: Date.now() };
      setMessages((m) => [...m, assistantMsg]);
      // toggle improvement example
      setImprovementState({ isImprovementMode: true, analysis: { suggestion: "Proposition d'amélioration" } });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const applyImprovements = useCallback(() => {
    // TODO: appliquer modifications sur le canvas via ctx passé depuis useEditor (implémenter selon logique)
    setImprovementState({ isImprovementMode: false, analysis: null });
  }, []);

  const revertToOriginal = useCallback(() => {
    // TODO: revert
    setImprovementState({ isImprovementMode: false, analysis: null });
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    improvementState,
    applyImprovements,
    revertToOriginal,
  };
}
