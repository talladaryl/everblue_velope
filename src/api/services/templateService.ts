import api from "@/api/axios";

export interface Template {
  id: number | string;
  user_id?: number;
  model_preview_id?: number | null;
  title: string;
  data: Record<string, any> | null;
  thumbnail?: string | null;
  created_at?: string;
  updated_at?: string;
  isLocal?: boolean;
}

export interface CreateTemplatePayload {
  title: string;
  model_preview_id?: number | null;
  data: Record<string, any>;
  thumbnail?: string | null;
}

const extract = (res: any) => res.data?.data || res.data;

// Clé localStorage pour les templates locaux
const LOCAL_TEMPLATES_KEY = "everblue_templates_local";

// Récupérer les templates locaux
const getLocalTemplates = (): Template[] => {
  try {
    const stored = localStorage.getItem(LOCAL_TEMPLATES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Erreur lecture localStorage:", error);
    return [];
  }
};

// Sauvegarder les templates locaux
const saveLocalTemplates = (templates: Template[]): void => {
  try {
    localStorage.setItem(LOCAL_TEMPLATES_KEY, JSON.stringify(templates));
  } catch (error) {
    console.error("Erreur sauvegarde localStorage:", error);
  }
};

export const templateService = {
  // Récupérer tous les templates (API + locaux)
  getTemplates: async (): Promise<Template[]> => {
    const localTemplates = getLocalTemplates();
    
    try {
      const response = await api.get("/templates");
      const apiTemplates = extract(response) || [];
      return [...apiTemplates, ...localTemplates];
    } catch (error) {
      console.warn("⚠️ API indisponible, utilisation des templates locaux:", error);
      return localTemplates;
    }
  },

  // Récupérer un template spécifique
  getTemplate: async (id: number | string): Promise<Template | null> => {
    console.log("🔍 templateService.getTemplate appelé avec ID:", id, "Type:", typeof id);
    
    // Vérifier d'abord les templates locaux
    if (typeof id === "string" && (id.startsWith("local-") || id.startsWith("api-"))) {
      console.log("💾 Recherche dans les templates locaux...");
      const localTemplates = getLocalTemplates();
      const found = localTemplates.find(t => t.id === id);
      if (found) {
        console.log("✅ Template local trouvé:", found);
        return found;
      } else {
        console.warn("⚠️ Template local non trouvé");
        return null;
      }
    }

    // Si c'est un ID avec préfixe "api-", extraire l'ID numérique
    let apiId = id;
    if (typeof id === "string" && id.startsWith("api-")) {
      apiId = id.replace("api-", "");
      console.log("🔄 Conversion de l'ID api- vers:", apiId);
    }

    try {
      console.log("🌐 Appel API GET /templates/" + apiId);
      const result = extract(await api.get(`/templates/${apiId}`));
      console.log("✅ Template API récupéré:", result);
      return result;
    } catch (error: any) {
      console.error(`❌ Erreur lors du chargement du template ${apiId}:`, error);
      console.error("Détails:", error.response?.data);
      return null;
    }
  },

  // Créer un nouveau template (API + fallback local)
  createTemplate: async (payload: CreateTemplatePayload): Promise<Template> => {
    const templateData = {
      title: payload.title,
      model_preview_id: payload.model_preview_id || null,
      thumbnail: payload.thumbnail || null,
      data:
        typeof payload.data === "string"
          ? JSON.parse(payload.data)
          : payload.data,
    };

    // Essayer l'API d'abord
    try {
      console.log("📤 Tentative sauvegarde via API...");
      const result = await api.post("/templates", templateData);
      const apiTemplate = extract(result);
      console.log("✅ Template sauvegardé via API:", apiTemplate);
      return apiTemplate;
    } catch (apiError: any) {
      console.warn("❌ API échouée (status:", apiError.response?.status, "), sauvegarde locale...");
      
      // Fallback: sauvegarder localement
      const localTemplate: Template = {
        id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: payload.title,
        model_preview_id: payload.model_preview_id || null,
        data: templateData.data,
        thumbnail: payload.thumbnail || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        isLocal: true,
      };

      const localTemplates = getLocalTemplates();
      localTemplates.push(localTemplate);
      saveLocalTemplates(localTemplates);

      console.log("✅ Template sauvegardé localement:", localTemplate);
      return localTemplate;
    }
  },

  // Mettre à jour un template
  updateTemplate: async (
    id: number | string,
    payload: Partial<CreateTemplatePayload>
  ): Promise<Template> => {
    // Si c'est un template local
    if (typeof id === "string" || id.toString().startsWith("local-")) {
      const localTemplates = getLocalTemplates();
      const index = localTemplates.findIndex(t => t.id === id);
      
      if (index !== -1) {
        localTemplates[index] = {
          ...localTemplates[index],
          title: payload.title || localTemplates[index].title,
          data: payload.data || localTemplates[index].data,
          model_preview_id: payload.model_preview_id !== undefined ? payload.model_preview_id : localTemplates[index].model_preview_id,
          updated_at: new Date().toISOString(),
        };
        saveLocalTemplates(localTemplates);
        return localTemplates[index];
      }
    }

    // Sinon, essayer l'API
    try {
      const data: Record<string, any> = {};
      if (payload.title !== undefined) data.title = payload.title;
      if (payload.model_preview_id !== undefined) data.model_preview_id = payload.model_preview_id;
      if (payload.thumbnail !== undefined) data.thumbnail = payload.thumbnail;
      if (payload.data !== undefined) {
        data.data =
          typeof payload.data === "string"
            ? JSON.parse(payload.data)
            : payload.data; 
      }

      return extract(await api.put(`/templates/${id}`, data));
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du template ${id}:`, error);
      throw error;
    }
  },

  // Supprimer un template
  deleteTemplate: async (id: number | string): Promise<void> => {
    console.log("🗑️ templateService.deleteTemplate appelé avec ID:", id, "Type:", typeof id);
    
    // Si c'est un template local
    if (typeof id === "string" && id.startsWith("local-")) {
      console.log("💾 Suppression d'un template local");
      const localTemplates = getLocalTemplates();
      const filtered = localTemplates.filter(t => t.id !== id);
      saveLocalTemplates(filtered);
      console.log("✅ Template local supprimé");
      return;
    }

    // Si l'ID commence par "api-", le retirer
    let cleanId = id;
    if (typeof id === "string" && id.startsWith("api-")) {
      cleanId = id.replace("api-", "");
      console.log("🔄 Nettoyage de l'ID: api-" + cleanId + " → " + cleanId);
    }

    // Sinon, essayer l'API
    try {
      console.log("🌐 Appel API DELETE /templates/" + cleanId);
      await api.delete(`/templates/${cleanId}`);
      console.log("✅ Template supprimé via l'API");
    } catch (error: any) {
      console.error(`❌ Erreur lors de la suppression du template ${cleanId}:`, error);
      console.error("Détails:", error.response?.data);
      throw error;
    }
  },
};
