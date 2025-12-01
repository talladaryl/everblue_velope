import { useState, useCallback, useEffect } from "react";
import { templateService, Template, CreateTemplatePayload } from "@/api/services/templateService";
import { toast } from "@/components/ui/sonner";

interface UseTemplatesReturn {
  templates: Template[];
  loading: boolean;
  error: string | null;
  fetchTemplates: () => Promise<void>;
  createTemplate: (payload: CreateTemplatePayload) => Promise<Template>;
  updateTemplate: (id: number, payload: Partial<CreateTemplatePayload>) => Promise<Template>;
  deleteTemplate: (id: number) => Promise<void>;
}

export const useTemplates = (): UseTemplatesReturn => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await templateService.getTemplates();
      setTemplates(data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Erreur lors du chargement des templates";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTemplateHandler = useCallback(
    async (payload: CreateTemplatePayload): Promise<Template> => {
      try {
        const newTemplate = await templateService.createTemplate(payload);
        setTemplates((prev) => [newTemplate, ...prev]);
        toast.success("Template créé avec succès!");
        return newTemplate;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Erreur lors de la création du template";
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      }
    },
    []
  );

  const updateTemplateHandler = useCallback(
    async (id: number, payload: Partial<CreateTemplatePayload>): Promise<Template> => {
      try {
        const updatedTemplate = await templateService.updateTemplate(id, payload);
        setTemplates((prev) =>
          prev.map((t) => (t.id === id ? updatedTemplate : t))
        );
        toast.success("Template mis à jour avec succès!");
        return updatedTemplate;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Erreur lors de la mise à jour du template";
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      }
    },
    []
  );

  const deleteTemplateHandler = useCallback(async (id: number): Promise<void> => {
    try {
      await templateService.deleteTemplate(id);
      setTemplates((prev) => prev.filter((t) => t.id !== id));
      toast.success("Template supprimé avec succès!");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Erreur lors de la suppression du template";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  // Charger les templates au montage
  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return {
    templates,
    loading,
    error,
    fetchTemplates,
    createTemplate: createTemplateHandler,
    updateTemplate: updateTemplateHandler,
    deleteTemplate: deleteTemplateHandler,
  };
};
