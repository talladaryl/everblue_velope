import api from "@/api/axios";

export interface Template {
  id: number;
  title: string;
  description: string;
  content: string;
  html?: string;
  preview_image?: string;
  created_at: string;
  updated_at: string;
  variables?: string[];
}

export interface CreateTemplatePayload {
  title: string;
  description: string;
  content: string;
  html?: string;
  preview_image?: string;
  variables?: string[];
}

export const templateService = {
  // Récupérer tous les templates
  getTemplates: async (): Promise<Template[]> => {
    try {
      const response = await api.get("/templates");
      return response.data.data || response.data;
    } catch (error) {
      console.error("Erreur lors du chargement des templates:", error);
      throw error;
    }
  },

  // Récupérer un template spécifique
  getTemplate: async (id: number): Promise<Template> => {
    try {
      const response = await api.get(`/templates/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Erreur lors du chargement du template ${id}:`, error);
      throw error;
    }
  },

  // Créer un nouveau template
  createTemplate: async (payload: CreateTemplatePayload): Promise<Template> => {
    try {
      const response = await api.post("/templates", payload);
      return response.data.data || response.data;
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
      const response = await api.put(`/templates/${id}`, payload);
      return response.data.data || response.data;
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
