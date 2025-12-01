import { useState, useCallback } from "react";
import { aiImageService, GenerateImagePayload, GenerateImageResponse } from "@/api/services/aiImageService";
import { toast } from "@/components/ui/sonner";

interface UseGenerateImageReturn {
  generating: boolean;
  error: string | null;
  images: string[];
  generateImage: (payload: GenerateImagePayload) => Promise<GenerateImageResponse>;
  clearImages: () => void;
}

export const useGenerateImage = (): UseGenerateImageReturn => {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);

  const generateImage = useCallback(
    async (payload: GenerateImagePayload): Promise<GenerateImageResponse> => {
      try {
        setGenerating(true);
        setError(null);

        if (!payload.prompt || !payload.prompt.trim()) {
          throw new Error("Le prompt ne peut pas être vide");
        }

        const response = await aiImageService.generateImage(payload);

        // Extraire les URLs des images
        const imageUrls = response.images.map((img) => img.url);
        setImages(imageUrls);

        toast.success(`${imageUrls.length} image(s) générée(s) avec succès!`);
        return response;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Erreur lors de la génération d'image";
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setGenerating(false);
      }
    },
    []
  );

  const clearImages = useCallback(() => {
    setImages([]);
    setError(null);
  }, []);

  return {
    generating,
    error,
    images,
    generateImage,
    clearImages,
  };
};
