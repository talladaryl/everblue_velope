import { Template } from "@/api/services/templateService";

const LOCAL_STORAGE_KEY = "everblue_templates_local";

export const localTemplateStorage = {
  // Récupérer tous les templates locaux
  getAll: (): Template[] => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Erreur lecture localStorage:", error);
      return [];
    }
  },

  // Sauvegarder un template localement
  save: (template: Omit<Template, "id" | "created_at" | "updated_at">): Template => {
    try {
      const templates = localTemplateStorage.getAll();
      const newTemplate: Template = {
        ...template,
        id: `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        isLocal: true,
      };
      templates.push(newTemplate);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(templates));
      console.log("✅ Template sauvegardé localement:", newTemplate.id);
      return newTemplate;
    } catch (error) {
      console.error("Erreur sauvegarde localStorage:", error);
      throw error;
    }
  },

  // Récupérer un template local spécifique
  get: (id: string): Template | null => {
    try {
      const templates = localTemplateStorage.getAll();
      return templates.find(t => t.id === id) || null;
    } catch (error) {
      console.error("Erreur lecture template local:", error);
      return null;
    }
  },

  // Mettre à jour un template local
  update: (id: string, updates: Partial<Template>): Template | null => {
    try {
      const templates = localTemplateStorage.getAll();
      const index = templates.findIndex(t => t.id === id);
      
      if (index === -1) return null;
      
      templates[index] = {
        ...templates[index],
        ...updates,
        updated_at: new Date().toISOString(),
      };
      
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(templates));
      console.log("✅ Template local mis à jour:", id);
      return templates[index];
    } catch (error) {
      console.error("Erreur mise à jour template local:", error);
      return null;
    }
  },

  // Supprimer un template local
  delete: (id: string): boolean => {
    try {
      const templates = localTemplateStorage.getAll();
      const filtered = templates.filter(t => t.id !== id);
      
      if (filtered.length === templates.length) {
        console.warn("⚠️ Template local non trouvé:", id);
        return false;
      }
      
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
      console.log("✅ Template local supprimé:", id);
      return true;
    } catch (error) {
      console.error("Erreur suppression template local:", error);
      return false;
    }
  },

  // Vider tous les templates locaux
  clear: (): void => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      console.log("✅ Tous les templates locaux ont été supprimés");
    } catch (error) {
      console.error("Erreur suppression localStorage:", error);
    }
  },
};
