import { useState, useEffect } from "react";
import { templateService, Template } from "@/api/services/templateService";
import { toast } from "@/components/ui/sonner";
import { PROFESSIONAL_TEMPLATES } from "@/constants/designConstants";

interface UseTemplatesProps {
  addItem?: (type: "text" | "image" | "video") => void;
}
export function useTemplates({ addItem }: UseTemplatesProps = {}) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);

  // Charger tous les templates depuis API
  const fetchTemplates = async () => {
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
      console.error("Erreur chargement templates:", err);
    } finally {
      setLoading(false);
    }
  };

  // Appliquer un template
  const applyTemplate = (template: Template) => {
    if (!addItem) return;
    const templateData = template.data || {};
    const items = templateData.items || [];
    items.forEach((item: any) =>
      addItem(item.type as "text" | "image" | "video")
    );
    setIsTemplatesOpen(false);
  };

  // Supprimer un template
  const deleteTemplate = async (id: number | string) => {
    try {
      await templateService.deleteTemplate(id);
      // Recharger les templates après suppression
      await fetchTemplates();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Erreur lors de la suppression du template";
      setError(errorMessage);
      console.error("Erreur suppression template:", err);
      throw err;
    }
  };

  const openTemplates = () => setIsTemplatesOpen(true);
  const closeTemplates = () => setIsTemplatesOpen(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  return {
    templates: templates.length ? templates : PROFESSIONAL_TEMPLATES,
    loading,
    error,
    fetchTemplates,
    applyTemplate,
    deleteTemplate,
    isTemplatesOpen,
    openTemplates,
    closeTemplates,
  };
}
