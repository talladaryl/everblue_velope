import { useState } from "react";
import { templateService, CreateTemplatePayload, Template } from "@/api/services/templateService";
import { toast } from "@/components/ui/sonner";

interface UseSaveTemplateReturn {
  saving: boolean;
  error: string | null;
  saveTemplate: (payload: CreateTemplatePayload) => Promise<Template>;
  updateTemplate: (id: number | string, payload: Partial<CreateTemplatePayload>) => Promise<Template>;
  deleteTemplate: (id: number | string) => Promise<void>;
}

export const useSaveTemplate = (): UseSaveTemplateReturn => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveTemplate = async (payload: CreateTemplatePayload): Promise<Template> => {
    try {
      setSaving(true);
      setError(null);
      const result = await templateService.createTemplate(payload);
      return result;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Erreur lors de la sauvegarde du template";
      setError(errorMessage);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const updateTemplate = async (id: number | string, payload: Partial<CreateTemplatePayload>): Promise<Template> => {
    try {
      setSaving(true);
      setError(null);
      const result = await templateService.updateTemplate(id, payload);
      toast.success("Template mis à jour avec succès!");
      return result;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Erreur lors de la mise à jour du template";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const deleteTemplate = async (id: number | string): Promise<void> => {
    try {
      setSaving(true);
      setError(null);
      await templateService.deleteTemplate(id);
      toast.success("Template supprimé avec succès!");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Erreur lors de la suppression du template";
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
    updateTemplate,
    deleteTemplate,
  };
};
