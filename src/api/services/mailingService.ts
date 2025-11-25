import api from "@/api/axios";

export interface Recipient {
  email: string;
  name: string;
  variables?: Record<string, string>;
}

export interface MailingPayload {
  subject: string;
  template_id?: number;
  content: string;
  html?: string;
  recipients: Recipient[];
  attachments?: File[];
}

export interface MailingResponse {
  id: number;
  subject: string;
  status: string;
  sent_count: number;
  failed_count: number;
  created_at: string;
}

export const mailingService = {
  // Envoyer un mailing
  sendMailing: async (payload: MailingPayload): Promise<MailingResponse> => {
    try {
      const formData = new FormData();
      formData.append("subject", payload.subject);
      formData.append("content", payload.content);
      if (payload.html) formData.append("html", payload.html);
      if (payload.template_id) formData.append("template_id", payload.template_id.toString());

      // Ajouter les destinataires
      formData.append("recipients", JSON.stringify(payload.recipients));

      // Ajouter les pièces jointes si présentes
      if (payload.attachments && payload.attachments.length > 0) {
        payload.attachments.forEach((file, index) => {
          formData.append(`attachments[${index}]`, file);
        });
      }

      const response = await api.post("/mailings", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data.data || response.data;
    } catch (error) {
      console.error("Erreur lors de l'envoi du mailing:", error);
      throw error;
    }
  },

  // Récupérer l'historique des mailings
  getMailings: async (): Promise<MailingResponse[]> => {
    try {
      const response = await api.get("/mailings");
      return response.data.data || response.data;
    } catch (error) {
      console.error("Erreur lors du chargement des mailings:", error);
      throw error;
    }
  },

  // Récupérer un mailing spécifique
  getMailing: async (id: number): Promise<MailingResponse> => {
    try {
      const response = await api.get(`/mailings/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Erreur lors du chargement du mailing ${id}:`, error);
      throw error;
    }
  },
};
