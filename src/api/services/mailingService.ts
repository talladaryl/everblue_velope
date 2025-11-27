import api from "@/api/axios";

export interface Recipient {
  email: string;
  name: string;
  variables?: Record<string, string>;
}

export interface MailingPayload {
  event_id: number;
  subject: string;
  channel?: "email" | "sms" | "link";
  recipients: Recipient[];
  html?: string;
  scheduled_at?: string;
}

export interface Mailing {
  id: number;
  event_id: number;
  subject: string;
  channel: "email" | "sms" | "link";
  status: "scheduled" | "sending" | "sent" | "failed";
  scheduled_at?: string;
  sent_at?: string;
  created_at: string;
  updated_at: string;
}

export const mailingService = {
  // Envoyer un mailing
  sendMailing: async (payload: MailingPayload): Promise<Mailing> => {
    try {
      const data = {
        event_id: payload.event_id,
        subject: payload.subject,
        channel: payload.channel || "email",
        status: payload.scheduled_at ? "scheduled" : "sending",
        scheduled_at: payload.scheduled_at || null,
        recipients: payload.recipients,
        html: payload.html || null,
      };

      const response = await api.post("/mailings", data);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Erreur lors de l'envoi du mailing:", error);
      throw error;
    }
  },

  // Récupérer l'historique des mailings
  getMailings: async (): Promise<Mailing[]> => {
    try {
      const response = await api.get("/mailings");
      return response.data.data || response.data || [];
    } catch (error) {
      console.error("Erreur lors du chargement des mailings:", error);
      throw error;
    }
  },

  // Récupérer les mailings d'un événement
  getMailingsByEvent: async (eventId: number): Promise<Mailing[]> => {
    try {
      const response = await api.get(`/mailings?event_id=${eventId}`);
      return response.data.data || response.data || [];
    } catch (error) {
      console.error(`Erreur lors du chargement des mailings pour l'événement ${eventId}:`, error);
      throw error;
    }
  },

  // Récupérer un mailing spécifique
  getMailing: async (id: number): Promise<Mailing> => {
    try {
      const response = await api.get(`/mailings/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Erreur lors du chargement du mailing ${id}:`, error);
      throw error;
    }
  },

  // Mettre à jour le statut d'un mailing
  updateMailingStatus: async (
    id: number,
    status: "scheduled" | "sending" | "sent" | "failed"
  ): Promise<Mailing> => {
    try {
      const response = await api.put(`/mailings/${id}`, { status });
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du mailing ${id}:`, error);
      throw error;
    }
  },

  // Supprimer un mailing
  deleteMailing: async (id: number): Promise<void> => {
    try {
      await api.delete(`/mailings/${id}`);
    } catch (error) {
      console.error(`Erreur lors de la suppression du mailing ${id}:`, error);
      throw error;
    }
  },
};
