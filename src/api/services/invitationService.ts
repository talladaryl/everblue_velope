import api from "@/api/axios";

/**
 * Service pour gérer les invitations avec tokens
 * Permet de sauvegarder et récupérer les invitations pour l'affichage web
 */

export interface Invitation {
  id?: number;
  token: string;
  recipientName: string;
  recipientEmail: string;
  items: any[];
  bgColor: string;
  bgImage?: string | null;
  templateData?: any;
  createdAt?: string;
  expiresAt?: string;
  viewedAt?: string | null;
}

export interface CreateInvitationPayload {
  token: string;
  recipientName: string;
  recipientEmail: string;
  items: any[];
  bgColor: string;
  bgImage?: string | null;
  expiresAt?: Date;
}

const STORAGE_KEY = "everblue_invitations";

// ========================================
// FONCTIONS LOCALSTORAGE (FALLBACK)
// ========================================

const getInvitationsFromLocalStorage = (): Invitation[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error("❌ Erreur lecture invitations localStorage:", error);
    return [];
  }
};

const saveInvitationsToLocalStorage = (invitations: Invitation[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invitations));
    console.log("💾 Invitations sauvegardées dans localStorage:", invitations.length);
  } catch (error) {
    console.error("❌ Erreur sauvegarde invitations localStorage:", error);
  }
};

// ========================================
// SERVICE PRINCIPAL
// ========================================

export const invitationService = {
  /**
   * Créer une nouvelle invitation
   * Essaie l'API d'abord, puis localStorage
   */
  create: async (payload: CreateInvitationPayload): Promise<Invitation> => {
    const newInvitation: Invitation = {
      token: payload.token,
      recipientName: payload.recipientName,
      recipientEmail: payload.recipientEmail,
      items: payload.items,
      bgColor: payload.bgColor,
      bgImage: payload.bgImage,
      createdAt: new Date().toISOString(),
      expiresAt: payload.expiresAt
        ? payload.expiresAt.toISOString()
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 jours par défaut
    };

    try {
      console.log("🔄 Tentative création invitation via API...");
      const response = await api.post("/invitations", newInvitation);
      const createdInvitation = response.data.data || response.data;
      console.log("✅ Invitation créée via API:", createdInvitation.token);
      
      // Synchroniser avec localStorage
      const localInvitations = getInvitationsFromLocalStorage();
      saveInvitationsToLocalStorage([...localInvitations, createdInvitation]);
      
      return createdInvitation;
    } catch (error: any) {
      console.warn("⚠️ API indisponible, sauvegarde invitation localStorage:", error.message);
      
      // Fallback: sauvegarder dans localStorage
      const localInvitations = getInvitationsFromLocalStorage();
      const updatedInvitations = [...localInvitations, newInvitation];
      saveInvitationsToLocalStorage(updatedInvitations);
      console.log("💾 Invitation créée dans localStorage:", newInvitation.token);
      
      return newInvitation;
    }
  },

  /**
   * Récupérer une invitation par son token
   * Essaie l'API d'abord, puis localStorage
   */
  getByToken: async (token: string): Promise<Invitation | null> => {
    try {
      console.log("🔄 Tentative récupération invitation via API:", token);
      const response = await api.get(`/invitations/${token}`);
      const invitation = response.data.data || response.data;
      console.log("✅ Invitation récupérée via API:", token);
      
      // Marquer comme vue
      if (invitation && !invitation.viewedAt) {
        invitation.viewedAt = new Date().toISOString();
        // Mettre à jour dans l'API (fire and forget)
        api.patch(`/invitations/${token}/view`).catch(() => {});
      }
      
      return invitation;
    } catch (error: any) {
      console.warn("⚠️ API indisponible, recherche localStorage:", error.message);
      
      // Fallback: chercher dans localStorage
      const localInvitations = getInvitationsFromLocalStorage();
      const invitation = localInvitations.find((inv) => inv.token === token);
      
      if (invitation) {
        console.log("💾 Invitation trouvée dans localStorage:", token);
        
        // Marquer comme vue
        if (!invitation.viewedAt) {
          invitation.viewedAt = new Date().toISOString();
          const updatedInvitations = localInvitations.map((inv) =>
            inv.token === token ? invitation : inv
          );
          saveInvitationsToLocalStorage(updatedInvitations);
        }
        
        return invitation;
      }
      
      console.warn("❌ Invitation introuvable:", token);
      return null;
    }
  },

  /**
   * Récupérer toutes les invitations
   */
  getAll: async (): Promise<Invitation[]> => {
    try {
      console.log("🔄 Tentative récupération invitations via API...");
      const response = await api.get("/invitations");
      const invitations = response.data.data || response.data || [];
      console.log("✅ Invitations récupérées via API:", invitations.length);
      
      // Synchroniser avec localStorage
      saveInvitationsToLocalStorage(invitations);
      
      return invitations;
    } catch (error: any) {
      console.warn("⚠️ API indisponible, utilisation localStorage:", error.message);
      const localInvitations = getInvitationsFromLocalStorage();
      console.log("💾 Invitations récupérées depuis localStorage:", localInvitations.length);
      return localInvitations;
    }
  },

  /**
   * Supprimer une invitation
   */
  delete: async (token: string): Promise<void> => {
    try {
      console.log("🔄 Tentative suppression invitation via API:", token);
      await api.delete(`/invitations/${token}`);
      console.log("✅ Invitation supprimée via API:", token);
      
      // Synchroniser avec localStorage
      const localInvitations = getInvitationsFromLocalStorage();
      const filteredInvitations = localInvitations.filter((inv) => inv.token !== token);
      saveInvitationsToLocalStorage(filteredInvitations);
    } catch (error: any) {
      console.warn("⚠️ API indisponible, suppression localStorage:", error.message);
      
      // Fallback: supprimer de localStorage
      const localInvitations = getInvitationsFromLocalStorage();
      const filteredInvitations = localInvitations.filter((inv) => inv.token !== token);
      saveInvitationsToLocalStorage(filteredInvitations);
      console.log("💾 Invitation supprimée de localStorage:", token);
    }
  },
};
