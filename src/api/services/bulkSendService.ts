import api from "@/api/axios";

export interface BulkSendRecipient {
  email?: string;
  phone?: string;
  name: string;
  variables?: Record<string, string>;
}

export interface BulkSendPayload {
  channel: "email" | "sms" | "mms" | "whatsapp";
  subject: string;
  message: string;
  html?: string;
  media_url?: string;
  recipients: BulkSendRecipient[];
  event_id?: number;
  template_id?: number;
  scheduled_at?: string;
  batch_size?: number;
  type?: string;
  recipient_type?: string;
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
  sendBulk: async (payload: any): Promise<BulkSendResponse> => {
    console.log("🚀 sendBulk - Payload:", {
      channel: payload.channel,
      emails: payload.emails?.length || 0,
      contacts: payload.contacts?.length || 0,
      hasHtml: !!payload.html,
    });

    if (!payload.channel) {
      throw new Error("Le canal d'envoi est requis");
    }

    // ----- FORMATTAGE DES DONNÉES -----
    const data: any = {
      channel: payload.channel,
      subject: payload.subject || "Invitation",
      body: payload.body || "Vous êtes invité à notre événement.",
    };

    if (payload.html) data.html = payload.html;
    if (payload.template_id) data.template_id = payload.template_id;
    if (payload.event_id) data.event_id = payload.event_id;

    if (payload.channel === "email") {
      if (!payload.emails?.length) {
        throw new Error("Aucun email fourni pour l'envoi");
      }
      data.emails = payload.emails;
    }

    if (payload.channel === "whatsapp") {
      if (!payload.contacts?.length) {
        throw new Error("Aucun contact WhatsApp fourni");
      }
      data.contacts = payload.contacts;
    }

    console.log("📤 Données envoyées:", {
      channel: data.channel,
      emails: data.emails?.length || 0,
      contacts: data.contacts?.length || 0,
      hasHtml: !!data.html,
    });

    try {
      const response = await api.post("/mailings/send-bulk", data);
      return response.data.data || response.data;
    } catch (error: any) {
      const status = error.response?.status;
      const errors = error.response?.data?.errors;
      const message = error.response?.data?.message;

      console.error("❌ Laravel Error:", { status, message, errors });

      throw new Error(
        message || "Erreur lors de l'envoi. Vérifiez le backend Laravel."
      );
    }
  },

  getBulkStatus: async (bulkSendId: string): Promise<BulkSendStatus> => {
    try {
      const response = await api.get(`/bulk-send/${bulkSendId}/status`);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Erreur statut envoi:", error);
      throw error;
    }
  },

  getBulkSendHistory: async (
    limit: number = 50
  ): Promise<BulkSendResponse[]> => {
    try {
      const response = await api.get(`/bulk-send?limit=${limit}`);
      return response.data.data || response.data || [];
    } catch (error) {
      console.error("Erreur historique:", error);
      throw error;
    }
  },

  cancelBulkSend: async (bulkSendId: string): Promise<void> => {
    try {
      await api.post(`/bulk-send/${bulkSendId}/cancel`);
    } catch (error) {
      console.error("Erreur annulation:", error);
      throw error;
    }
  },

  retryFailedSends: async (bulkSendId: string): Promise<BulkSendResponse> => {
    try {
      const response = await api.post(`/bulk-send/${bulkSendId}/retry`);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Erreur relance:", error);
      throw error;
    }
  },
};
