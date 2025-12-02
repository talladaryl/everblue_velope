import api from "@/api/axios";

export interface BulkSendRecipient {
  email?: string;
  phone?: string;
  name: string;
  variables?: Record<string, string>;
}

export interface BulkSendPayload {
  channel: "email" | "sms" | "mms" | "whatsapp";
  subject: string; // Obligatoire pour email, requis pour tous
  message: string;
  html?: string;
  media_url?: string;
  recipients: BulkSendRecipient[];
  event_id: number; // Obligatoire
  template_id?: number;
  scheduled_at?: string;
  batch_size?: number; // Nombre d'envois par batch (défaut: 50)
}

export interface BulkSendResponse {
  id: string;
  channel: string;
  total_recipients: number;
  sent_count: number;
  failed_count: number;
  pending_count: number;
  status: "queued" | "processing" | "completed" | "failed";
  messages?: Array<{
    id: string;
    recipient: string;
    name: string;
    status: "sent" | "failed" | "pending" | "delivered";
    error?: string;
    timestamp: string;
    message_id?: string;
  }>;
  created_at: string;
  updated_at: string;
}

export interface BulkSendStatus {
  id: string;
  status: "queued" | "processing" | "completed" | "failed";
  progress: {
    total: number;
    sent: number;
    failed: number;
    pending: number;
  };
  errors?: Array<{
    recipient: string;
    error: string;
  }>;
}

export const bulkSendService = {
  // Envoyer en masse (email, SMS, MMS)
  sendBulk: async (payload: BulkSendPayload): Promise<BulkSendResponse> => {
    try {
      // Valider les trois champs obligatoires
      if (!payload.event_id) {
        throw new Error("L'ID de l'événement est requis");
      }

      if (!payload.channel) {
        throw new Error("Le canal d'envoi est requis");
      }

      if (!payload.subject || !payload.subject.trim()) {
        throw new Error("Le sujet est requis");
      }

      // Valider le nombre de destinataires
      if (payload.recipients.length > 500) {
        throw new Error("Le nombre de destinataires ne peut pas dépasser 500");
      }

      if (payload.recipients.length === 0) {
        throw new Error("Au moins un destinataire est requis");
      }

      // Valider les destinataires selon le canal
      const validRecipients = payload.recipients.filter((r) => {
        if (payload.channel === "email") {
          return r.email && r.email.includes("@");
        } else if (payload.channel === "sms" || payload.channel === "mms" || payload.channel === "whatsapp") {
          return r.phone && r.phone.replace(/\D/g, "").length >= 10;
        }
        return false;
      });

      if (validRecipients.length === 0) {
        throw new Error(
          `Aucun destinataire valide pour le canal ${payload.channel}`
        );
      }

      const data = {
        event_id: payload.event_id,
        channel: payload.channel,
        subject: payload.subject,
        message: payload.message,
        html: payload.html || null,
        media_url: payload.media_url || null,
        recipients: validRecipients,
        template_id: payload.template_id || null,
        scheduled_at: payload.scheduled_at || null,
        batch_size: payload.batch_size || 50,
      };

      const response = await api.post("/bulk-send", data);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Erreur lors de l'envoi en masse:", error);
      throw error;
    }
  },

  // Récupérer le statut d'un envoi en masse
  getBulkStatus: async (bulkSendId: string): Promise<BulkSendStatus> => {
    try {
      const response = await api.get(`/bulk-send/${bulkSendId}/status`);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Erreur lors du chargement du statut:", error);
      throw error;
    }
  },

  // Récupérer l'historique des envois en masse
  getBulkSendHistory: async (limit: number = 50): Promise<BulkSendResponse[]> => {
    try {
      const response = await api.get(`/bulk-send?limit=${limit}`);
      return response.data.data || response.data || [];
    } catch (error) {
      console.error("Erreur lors du chargement de l'historique:", error);
      throw error;
    }
  },

  // Annuler un envoi en masse
  cancelBulkSend: async (bulkSendId: string): Promise<void> => {
    try {
      await api.post(`/bulk-send/${bulkSendId}/cancel`);
    } catch (error) {
      console.error("Erreur lors de l'annulation:", error);
      throw error;
    }
  },

  // Relancer les envois échoués
  retryFailedSends: async (bulkSendId: string): Promise<BulkSendResponse> => {
    try {
      const response = await api.post(`/bulk-send/${bulkSendId}/retry`);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Erreur lors de la relance:", error);
      throw error;
    }
  },
};
