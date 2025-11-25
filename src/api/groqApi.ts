// src/api/groqApi.ts

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function groqApi(messages, retries = 2) {
  // 1️⃣ Vérification clé API
  const apiKey = import.meta.env.VITE_GROQ_KEY;

  if (!apiKey) {
    console.error("❌ Clé GROQ manquante (VITE_GROQ_KEY)");
    throw new Error("Aucune clé API GROQ fournie.");
  }

  // 2️⃣ Corps de la requête standard Groq
  const payload = {
    model: "llama-3.1-70b-versatile",
    messages,
    temperature: 0.2,
    max_tokens: 2048,
    stream: false,
  };

  try {
    // 3️⃣ Timeout personnalisé (12s)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    // 4️⃣ Vérification HTTP
    if (!response.ok) {
      const errorText = await response.text().catch(() => "(aucun détail)");
      console.error("❌ Erreur GROQ:", response.status, errorText);

      // 🔁 Retry automatique si serveur Groq instable
      if (response.status >= 500 && retries > 0) {
        console.warn("🔁 Réessai Groq…");
        return groqApi(messages, retries - 1);
      }

      throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
    }

    // 5️⃣ Parsing JSON sécurisé
    const json = await response.json().catch((err) => {
      console.error("❌ Impossible de parser le JSON Groq:", err);
      throw new Error("JSON Groq invalide.");
    });

    // 6️⃣ Vérification structure Groq
    if (
      !json ||
      !json.choices ||
      !json.choices[0] ||
      !json.choices[0].message
    ) {
      console.error("❌ Réponse Groq invalide:", json);
      throw new Error("Format Groq inattendu.");
    }

    const content = json.choices[0].message.content;

    if (!content || typeof content !== "string") {
      throw new Error("GROQ semble avoir renvoyé une réponse vide.");
    }

    return content;
  } catch (error) {
    // ❌ Timeout
    if (error.name === "AbortError") {
      if (retries > 0) {
        console.warn("⚠️ Timeout Groq → retry");
        return groqApi(messages, retries - 1);
      }
      throw new Error("GROQ timeout dépassé.");
    }

    console.error("❌ Erreur groqApi.ts:", error);
    throw error;
  }
}
