import api from "@/api/axios";

export interface GenerateImagePayload {
  prompt: string;
  style?: string;
  size?: "256x256" | "512x512" | "1024x1024";
  quality?: "standard" | "hd";
}

export interface GenerateImageResponse {
  id: string;
  url: string;
  prompt: string;
  created_at: string;
  size: string;
  style?: string;
}

export interface ImageHistory {
  id: string;
  url: string;
  prompt: string;
  created_at: string;
}

export const aiImageService = {
  // Générer une image via l'API
  generateImage: async (payload: GenerateImagePayload): Promise<GenerateImageResponse> => {
    try {
      const response = await api.post("/aiimage/generate-image", {
        prompt: payload.prompt,
        style: payload.style || "realistic",
        size: payload.size || "512x512",
        quality: payload.quality || "standard",
      });
      return response.data.data || response.data;
    } catch (error) {
      console.error("Erreur lors de la génération d'image:", error);
      throw error;
    }
  },

  // Récupérer l'historique des images générées
  getImageHistory: async (limit: number = 20): Promise<ImageHistory[]> => {
    try {
      const response = await api.get(`/aiimage/history?limit=${limit}`);
      return response.data.data || response.data || [];
    } catch (error) {
      console.error("Erreur lors du chargement de l'historique:", error);
      throw error;
    }
  },

  // Supprimer une image générée
  deleteImage: async (imageId: string): Promise<void> => {
    try {
      await api.delete(`/aiimage/${imageId}`);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'image:", error);
      throw error;
    }
  },

  // Utiliser une image générée dans le design
  useImageInDesign: async (imageUrl: string, imageId: string): Promise<void> => {
    try {
      await api.post(`/aiimage/${imageId}/use-in-design`, {
        url: imageUrl,
      });
    } catch (error) {
      console.error("Erreur lors de l'utilisation de l'image:", error);
      throw error;
    }
  },
};
