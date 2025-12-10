import api from "@/api/axios";

/**
 * Service hybride pour la gestion des invités
 * Essaie d'abord l'API, puis utilise localStorage en fallback
 */

export interface Guest {
  id: string;
  name: string;
  full_name?: string;
  email?: string;
  phone?: string;
  countryCode?: string;
  channel: "whatsapp" | "email";
  valid: boolean;
  plus_one_allowed?: boolean;
  location?: string;
  date?: string;
  time?: string;
  addedAt?: string;
  imported?: boolean;
}

const STORAGE_KEY = "everblue_guests";

// ========================================
// FONCTIONS LOCALSTORAGE (FALLBACK)
// ========================================

const getGuestsFromLocalStorage = (): Guest[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error("❌ Erreur lecture localStorage:", error);
    return [];
  }
};

const saveGuestsToLocalStorage = (guests: Guest[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(guests));
    console.log("💾 Invités sauvegardés dans localStorage:", guests.length);
  } catch (error) {
    console.error("❌ Erreur sauvegarde localStorage:", error);
  }
};

// ========================================
// SERVICE PRINCIPAL
// ========================================

export const guestService = {
  /**
   * Récupérer tous les invités
   * Essaie l'API d'abord, puis localStorage
   */
  getAll: async (): Promise<Guest[]> => {
    try {
      console.log("🔄 Tentative récupération invités depuis API...");
      const response = await api.get("/guests");
      const guests = response.data.data || response.data || [];
      console.log("✅ Invités récupérés depuis API:", guests.length);
      
      // Synchroniser avec localStorage
      saveGuestsToLocalStorage(guests);
      
      return guests;
    } catch (error: any) {
      console.warn("⚠️ API indisponible, utilisation localStorage:", error.message);
      const localGuests = getGuestsFromLocalStorage();
      console.log("💾 Invités récupérés depuis localStorage:", localGuests.length);
      return localGuests;
    }
  },

  /**
   * Créer un nouvel invité
   * Essaie l'API d'abord, puis localStorage
   */
  create: async (guest: Omit<Guest, "id">): Promise<Guest> => {
    const newGuest: Guest = {
      ...guest,
      id: `guest-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      addedAt: new Date().toISOString(),
    };

    try {
      console.log("🔄 Tentative création invité via API...");
      const response = await api.post("/guests", newGuest);
      const createdGuest = response.data.data || response.data;
      console.log("✅ Invité créé via API:", createdGuest.id);
      
      // Synchroniser avec localStorage
      const localGuests = getGuestsFromLocalStorage();
      saveGuestsToLocalStorage([...localGuests, createdGuest]);
      
      return createdGuest;
    } catch (error: any) {
      console.warn("⚠️ API indisponible, sauvegarde localStorage:", error.message);
      
      // Fallback: sauvegarder dans localStorage
      const localGuests = getGuestsFromLocalStorage();
      const updatedGuests = [...localGuests, newGuest];
      saveGuestsToLocalStorage(updatedGuests);
      console.log("💾 Invité créé dans localStorage:", newGuest.id);
      
      return newGuest;
    }
  },

  /**
   * Mettre à jour un invité
   * Essaie l'API d'abord, puis localStorage
   */
  update: async (id: string, updates: Partial<Guest>): Promise<Guest> => {
    try {
      console.log("🔄 Tentative mise à jour invité via API:", id);
      const response = await api.put(`/guests/${id}`, updates);
      const updatedGuest = response.data.data || response.data;
      console.log("✅ Invité mis à jour via API:", id);
      
      // Synchroniser avec localStorage
      const localGuests = getGuestsFromLocalStorage();
      const updatedLocalGuests = localGuests.map((g) =>
        g.id === id ? { ...g, ...updatedGuest } : g
      );
      saveGuestsToLocalStorage(updatedLocalGuests);
      
      return updatedGuest;
    } catch (error: any) {
      console.warn("⚠️ API indisponible, mise à jour localStorage:", error.message);
      
      // Fallback: mettre à jour dans localStorage
      const localGuests = getGuestsFromLocalStorage();
      const guestIndex = localGuests.findIndex((g) => g.id === id);
      
      if (guestIndex === -1) {
        throw new Error(`Invité ${id} introuvable`);
      }
      
      const updatedGuest = { ...localGuests[guestIndex], ...updates };
      localGuests[guestIndex] = updatedGuest;
      saveGuestsToLocalStorage(localGuests);
      console.log("💾 Invité mis à jour dans localStorage:", id);
      
      return updatedGuest;
    }
  },

  /**
   * Supprimer un invité
   * Essaie l'API d'abord, puis localStorage
   */
  delete: async (id: string): Promise<void> => {
    try {
      console.log("🔄 Tentative suppression invité via API:", id);
      await api.delete(`/guests/${id}`);
      console.log("✅ Invité supprimé via API:", id);
      
      // Synchroniser avec localStorage
      const localGuests = getGuestsFromLocalStorage();
      const filteredGuests = localGuests.filter((g) => g.id !== id);
      saveGuestsToLocalStorage(filteredGuests);
    } catch (error: any) {
      console.warn("⚠️ API indisponible, suppression localStorage:", error.message);
      
      // Fallback: supprimer de localStorage
      const localGuests = getGuestsFromLocalStorage();
      const filteredGuests = localGuests.filter((g) => g.id !== id);
      saveGuestsToLocalStorage(filteredGuests);
      console.log("💾 Invité supprimé de localStorage:", id);
    }
  },

  /**
   * Importer plusieurs invités en masse
   * Essaie l'API d'abord, puis localStorage
   */
  bulkCreate: async (guests: Omit<Guest, "id">[]): Promise<Guest[]> => {
    const newGuests: Guest[] = guests.map((guest) => ({
      ...guest,
      id: `guest-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      addedAt: new Date().toISOString(),
    }));

    try {
      console.log("🔄 Tentative import en masse via API:", newGuests.length);
      const response = await api.post("/guests/bulk", { guests: newGuests });
      const createdGuests = response.data.data || response.data || newGuests;
      console.log("✅ Invités importés via API:", createdGuests.length);
      
      // Synchroniser avec localStorage
      const localGuests = getGuestsFromLocalStorage();
      saveGuestsToLocalStorage([...localGuests, ...createdGuests]);
      
      return createdGuests;
    } catch (error: any) {
      console.warn("⚠️ API indisponible, import localStorage:", error.message);
      
      // Fallback: sauvegarder dans localStorage
      const localGuests = getGuestsFromLocalStorage();
      const updatedGuests = [...localGuests, ...newGuests];
      saveGuestsToLocalStorage(updatedGuests);
      console.log("💾 Invités importés dans localStorage:", newGuests.length);
      
      return newGuests;
    }
  },

  /**
   * Remplacer tous les invités
   * Utile pour la synchronisation complète
   */
  replaceAll: async (guests: Guest[]): Promise<void> => {
    try {
      console.log("🔄 Tentative remplacement complet via API:", guests.length);
      await api.post("/guests/replace-all", { guests });
      console.log("✅ Invités remplacés via API");
      
      // Synchroniser avec localStorage
      saveGuestsToLocalStorage(guests);
    } catch (error: any) {
      console.warn("⚠️ API indisponible, remplacement localStorage:", error.message);
      
      // Fallback: remplacer dans localStorage
      saveGuestsToLocalStorage(guests);
      console.log("💾 Invités remplacés dans localStorage:", guests.length);
    }
  },

  /**
   * Vider tous les invités
   */
  clear: async (): Promise<void> => {
    try {
      console.log("🔄 Tentative suppression complète via API");
      await api.delete("/guests/all");
      console.log("✅ Tous les invités supprimés via API");
      
      // Synchroniser avec localStorage
      localStorage.removeItem(STORAGE_KEY);
    } catch (error: any) {
      console.warn("⚠️ API indisponible, suppression localStorage:", error.message);
      
      // Fallback: vider localStorage
      localStorage.removeItem(STORAGE_KEY);
      console.log("💾 Tous les invités supprimés de localStorage");
    }
  },
};
