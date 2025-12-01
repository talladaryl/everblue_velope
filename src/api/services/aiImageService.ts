import api from "@/api/axios";

export interface GenerateImagePayload {
  prompt: string;
  size?: "256x256" | "512x512" | "1024x1024";
  quality?: "standard" | "hd";
  n?: number;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  created_at: string;
}

export interface GenerateImageResponse {
  images: GeneratedImage[];
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
  };
}

export const aiImageService = {
  // Générer une image via OpenAI
  generateImage: async (payload: GenerateImagePayload): Promise<GenerateImageResponse> => {
    try {
      const data = {
        prompt: payload.prompt,
        size: payload.size || "1024x1024",
        quality: payload.quality || "standard",
        n: payload.n || 1,
      };

      const response = await api.post("/aiimage/generate-image", data);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Erreur lors de la génération d'image:", error);
      throw error;
    }
  },

  // Générer plusieurs images
  generateMultipleImages: async (
    prompt: string,
    count: number = 3,
    size: "256x256" | "512x512" | "1024x1024" = "1024x1024"
  ): Promise<GenerateImageResponse> => {
    try {
      return await aiImageService.generateImage({
        prompt,
        size,
        n: count,
      });
    } catch (error) {
      console.error("Erreur lors de la génération d'images multiples:", error);
      throw error;
    }
  },
};
