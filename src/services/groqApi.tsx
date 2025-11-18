// services/groqApi.ts

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export interface GroqMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export const groqApi = async (messages: GroqMessage[]): Promise<string> => {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages,
        model: "llama3-8b-8192", // Vous pouvez changer le modèle si nécessaire
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    return (
      data.choices[0]?.message?.content ||
      "Désolé, je n'ai pas pu générer de réponse."
    );
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API Groq:", error);
    throw error;
  }
};
