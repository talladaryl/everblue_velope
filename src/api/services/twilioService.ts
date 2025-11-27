import api from "@/api/axios";

export type TwilioChannel = "sms" | "mms" | "whatsapp";

export interface TwilioSendPayload {
  phone_number: string;
  message: string;
  channel: TwilioChannel;
  media_url?: string;
  html?: string;
  template_id?: number;
}

export interface TwilioResponse {
  id: string;
  status: "sent" | "failed" | "pending" | "delivered";
  phone_number: string;
  message_sid: string;
  channel: TwilioChannel;
  created_at: string;
  error?: string;
}

export interface BulkTwilioPayload {
  channel: TwilioChannel;
  recipients: Array<{
    phone_number: string;
    name: string;
    variables?: Record<string, string>;
  }>;
  message: string;
  media_url?: string;
  html?: string;
  template_id?: number;
}

export interface BulkTwilioResponse {
  id: string;
  channel: string;
  total_recipients: number;
  sent_count: number;
  failed_count: number;
  pending_count: number;
  status: "queued" | "processing" | "completed" | "failed";
  messages: Array<{
    id: string;
    recipient: string;
    name: string;
    status: "sent" | "failed" | "pending" | "delivered";
    error?: string;
    timestamp: string;
    message_id?: string;
  }>;
  created_at: string;
}

export const twilioService = {
  // Envoyer un message via Twilio (SMS, MMS, WhatsApp)
  send: async (payload: TwilioSendPayload): Promise<TwilioResponse> => {
    try {
      const response = await api.post(`/twilio/send-${payload.channel}`, payload);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Erreur lors de l'envoi ${payload.channel} Twilio:`, error);
      throw error;
    }
  },

  // Envoyer en masse (SMS, MMS, WhatsApp)
  sendBulk: async (payload: BulkTwilioPayload): Promise<BulkTwilioResponse> => {
    try {
      const response = await api.post("/twilio/send-bulk", payload);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Erreur lors de l'envoi en masse Twilio:", error);
      throw error;
    }
  },

  // Récupérer l'historique
  getHistory: async (channel?: TwilioChannel): Promise<TwilioResponse[]> => {
    try {
      const url = channel ? `/twilio/history?channel=${channel}` : "/twilio/history";
      const response = await api.get(url);
      return response.data.data || response.data || [];
    } catch (error) {
      console.error("Erreur lors du chargement de l'historique:", error);
      throw error;
    }
  },

  // Récupérer le statut d'un message
  getStatus: async (messageSid: string): Promise<TwilioResponse> => {
    try {
      const response = await api.get(`/twilio/status/${messageSid}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Erreur lors du chargement du statut:", error);
      throw error;
    }
  },

  // Récupérer le statut d'un envoi en masse
  getBulkStatus: async (bulkId: string): Promise<BulkTwilioResponse> => {
    try {
      const response = await api.get(`/twilio/bulk/${bulkId}/status`);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Erreur lors du chargement du statut en masse:", error);
      throw error;
    }
  },

  // Relancer les messages échoués
  retryFailed: async (bulkId: string): Promise<BulkTwilioResponse> => {
    try {
      const response = await api.post(`/twilio/bulk/${bulkId}/retry`);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Erreur lors de la relance:", error);
      throw error;
    }
  },
};
