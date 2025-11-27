import { useState, useCallback } from "react";
import { aiImageService, GenerateImageResponse } from "@/api/services/aiImageService";
import { toast } from "@/components/ui/sonner";

interface UseAIImageGeneratorReturn {
  generating: boolean;
  error: string | null;
  generatedImage: GenerateImageResponse | null;
  imageHistory: GenerateImageResponse[];
  generateImage: (prompt: string, style?: string) => Promise<GenerateImageResponse>;
  clearError: () => void;
  resetImage: () => void;
}

export const useAIImageGenerator = (): UseAIImageGeneratorReturn => {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<GenerateImageResponse | null>(null);
  const [imageHistory, setImageHistory] = useState<GenerateImageResponse[]>([]);

  const generateImage = useCallback(
    async (prompt: string, style: string = "realistic"): Promise<GenerateImageResponse> => {
      try {
        setGenerating(true);
        setError(null);

        if (!prompt || !prompt.trim()) {
          throw new Error("Veuillez entrer une description pour générer une image");
        }

        const response = await aiImageService.generateImage({
          prompt: prompt.trim(),
          style,
          size: "512x512",
          quality: "standard",
        });

        setGeneratedImage(response);
        setImageHistory((prev) => [response, ...prev.slice(0, 9)]);

        toast.success("Image générée avec succès!");
        return response;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Erreur lors de la génération de l'image";
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setGenerating(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const resetImage = useCallback(() => {
    setGeneratedImage(null);
    setError(null);
  }, []);

  return {
    generating,
    error,
    generatedImage,
    imageHistory,
    generateImage,
    clearError,
    resetImage,
  };
};
