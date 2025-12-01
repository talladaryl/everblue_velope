import api from "@/api/axios";

export interface Template {
  id: number;
  name: string;
  category?: string;
  preview_url?: string;
  structure: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CreateTemplatePayload {
  name: string;
  category?: string;
  preview_url?: string;
  structure: Record<string, any>;
}

const extract = (res: any) => res.data?.data || res.data;

export const templateService = {
  // Récupérer tous les templates
  getTemplates: async (): Promise<Template[]> => {
    try {
      const response = await api.get("/templates");
      return extract(response) || [];
    } catch (error) {
      console.error("Erreur lors du chargement des templates:", error);
      throw error;
    }
  },

  // Récupérer un template spécifique
  getTemplate: async (id: number): Promise<Template> => {
    try {
      return extract(await api.get(`/templates/${id}`));
    } catch (error) {
      console.error(`Erreur lors du chargement du template ${id}:`, error);
      throw error;
    }
  },

  // Créer un nouveau template
  createTemplate: async (payload: CreateTemplatePayload): Promise<Template> => {
    try {
      const data = {
        name: payload.name,
        category: payload.category || null,
        preview_url: payload.preview_url || null,
        structure:
          typeof payload.structure === "string"
            ? JSON.parse(payload.structure)
            : payload.structure,
      };

      return extract(await api.post("/templates", data));
    } catch (error) {
      console.error("Erreur lors de la création du template:", error);
      throw error;
    }
  },

  // Mettre à jour un template
  updateTemplate: async (
    id: number,
    payload: Partial<CreateTemplatePayload>
  ): Promise<Template> => {
    try {
      const data: Record<string, any> = {};

      if (payload.name !== undefined) data.name = payload.name;
      if (payload.category !== undefined) data.category = payload.category;
      if (payload.preview_url !== undefined)
        data.preview_url = payload.preview_url;
      if (payload.structure !== undefined) {
        data.structure =
          typeof payload.structure === "string"
            ? JSON.parse(payload.structure)
            : payload.structure;
      }

      return extract(await api.put(`/templates/${id}`, data));
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du template ${id}:`, error);
      throw error;
    }
  },

  // Supprimer un template
  deleteTemplate: async (id: number): Promise<void> => {
    try {
      await api.delete(`/templates/${id}`);
    } catch (error) {
      console.error(`Erreur lors de la suppression du template ${id}:`, error);
      throw error;
    }
  },
};
