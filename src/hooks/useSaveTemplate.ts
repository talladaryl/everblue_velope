import { useState } from "react";
import { templateService, CreateTemplatePayload } from "@/api/services/templateService";
import { toast } from "@/components/ui/sonner";

interface UseSaveTemplateReturn {
  saving: boolean;
  error: string | null;
  saveTemplate: (payload: CreateTemplatePayload) => Promise<void>;
}

export const useSaveTemplate = (): UseSaveTemplateReturn => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveTemplate = async (payload: CreateTemplatePayload) => {
    try {
      setSaving(true);
      setError(null);
      await templateService.createTemplate(payload);
      toast.success("Template sauvegardé avec succès!");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Erreur lors de la sauvegarde du template";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return {
    saving,
    error,
    saveTemplate,
  };
};
