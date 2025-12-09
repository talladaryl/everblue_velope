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
    // Valider le canal
    if (!payload.channel) {
      throw new Error("Le canal d'envoi est requis");
    }

    // Valider le sujet pour les emails
    if (
      payload.channel === "email" &&
      (!payload.subject || !payload.subject.trim())
    ) {
      throw new Error("Le sujet est requis pour les emails");
    }

    // Valider le message
    if (!payload.body || !payload.body.trim()) {
      throw new Error("Le message ne peut pas être vide");
    }

    // Valider les destinataires selon le canal
    let validRecipients: any[] = [];

    if (payload.channel === "email") {
      if (!payload.emails || payload.emails.length === 0) {
        throw new Error("Au moins un destinataire email est requis");
      }

      // Valider chaque email
      validRecipients = payload.emails.filter(
        (r: any) => r.email && r.email.includes("@") && r.name
      );

      if (validRecipients.length === 0) {
        throw new Error("Aucun email valide trouvé");
      }
    } else if (payload.channel === "whatsapp") {
      if (!payload.contacts || payload.contacts.length === 0) {
        throw new Error("Au moins un contact WhatsApp est requis");
      }

      // Valider chaque numéro de téléphone
      validRecipients = payload.contacts.filter(
        (r: any) => r.phone && r.phone.replace(/\D/g, "").length >= 10 && r.name
      );

      if (validRecipients.length === 0) {
        throw new Error("Aucun numéro de téléphone valide trouvé");
      }
    }

    // Valider le nombre de destinataires
    if (validRecipients.length > 500) {
      throw new Error("Le nombre de destinataires ne peut pas dépasser 500");
    }

    // Préparer les données selon le format attendu par Laravel
    const data: any = {
      channel: payload.channel,
      subject: payload.subject || "",
      body: payload.body || "",
      template_id: payload.template_id || null,
      event_id: payload.event_id || null,
    };

    // Ajouter emails ou contacts selon le canal
    if (payload.channel === "email") {
      data.emails = validRecipients;
    } else if (payload.channel === "whatsapp") {
      data.contacts = validRecipients;
    }

    // Ajouter html si présent (pour les emails)
    if (payload.html && payload.channel === "email") {
      data.html = payload.html;
    }

    console.log("📤 Envoi en masse vers /mailings/send-bulk:", {
      channel: data.channel,
      template_id: data.template_id,
      recipients_count: data.emails?.length || data.contacts?.length || 0,
      has_html: !!data.html,
      subject: data.subject || "N/A (WhatsApp)",
    });

    if (data.channel === "email") {
      console.log("📧 Premier email:", data.emails?.[0]);
    } else {
      console.log("📱 Premier contact:", data.contacts?.[0]);
    }

    try {
      const response = await api.post("/mailings/send-bulk", data);
      return response.data.data || response.data;
    } catch (error: any) {
      console.error("❌ Erreur lors de l'envoi en masse:", error);
      console.error("📋 Détails de l'erreur:", error.response?.data);
      console.error("🔍 Erreurs de validation:", error.response?.data?.errors);
      console.error("📦 Payload envoyé:", data);
      throw error;
    }
  },

  getBulkStatus: async (bulkSendId: string): Promise<BulkSendStatus> => {
    try {
      const response = await api.get(`/bulk-send/${bulkSendId}/status`);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Erreur lors du chargement du statut:", error);
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
      console.error("Erreur lors du chargement de l'historique:", error);
      throw error;
    }
  },

  cancelBulkSend: async (bulkSendId: string): Promise<void> => {
    try {
      await api.post(`/bulk-send/${bulkSendId}/cancel`);
    } catch (error) {
      console.error("Erreur lors de l'annulation:", error);
      throw error;
    }
  },

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
