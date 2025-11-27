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

export const templateService = {
  // Récupérer tous les templates
  getTemplates: async (): Promise<Template[]> => {
    try {
      const response = await api.get("/templates");
      return response.data.data || response.data || [];
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
      // Assurer que structure est un objet JSON valide
      const data = {
        name: payload.name,
        category: payload.category || null,
        preview_url: payload.preview_url || null,
        structure: typeof payload.structure === "string" 
          ? JSON.parse(payload.structure) 
          : payload.structure,
      };

      const response = await api.post("/templates", data);
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
      const data: Record<string, any> = {};
      
      if (payload.name) data.name = payload.name;
      if (payload.category) data.category = payload.category;
      if (payload.preview_url) data.preview_url = payload.preview_url;
      if (payload.structure) {
        data.structure = typeof payload.structure === "string" 
          ? JSON.parse(payload.structure) 
          : payload.structure;
      }

      const response = await api.put(`/templates/${id}`, data);
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
