import api from "@/api/axios";

export interface MailingStats {
  total_sent: number;
  total_delivered: number;
  total_failed: number;
  total_pending: number;
  success_rate: number;
  failure_rate: number;
  by_channel: {
    email: {
      sent: number;
      delivered: number;
      failed: number;
      pending: number;
    };
    sms: {
      sent: number;
      delivered: number;
      failed: number;
      pending: number;
    };
    mms: {
      sent: number;
      delivered: number;
      failed: number;
      pending: number;
    };
    whatsapp: {
      sent: number;
      delivered: number;
      failed: number;
      pending: number;
    };
  };
  recent_mailings: Array<{
    id: number;
    subject: string;
    channel: string;
    status: string;
    sent_count: number;
    delivered_count: number;
    failed_count: number;
    created_at: string;
  }>;
}

export const mailingStatsService = {
  // Récupérer les statistiques de mailing pour un événement
  getEventStats: async (eventId: number): Promise<MailingStats> => {
    try {
      const response = await api.get(`/events/${eventId}/mailings/statistics`);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Erreur lors du chargement des statistiques pour l'événement ${eventId}:`, error);
      throw error;
    }
  },

  // Récupérer les statistiques globales
  getGlobalStats: async (): Promise<MailingStats> => {
    try {
      const response = await api.get("/mailings/statistics");
      return response.data.data || response.data;
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques globales:", error);
      throw error;
    }
  },

  // Récupérer les statistiques par canal
  getStatsByChannel: async (eventId: number, channel: string): Promise<any> => {
    try {
      const response = await api.get(`/events/${eventId}/mailings/statistics?channel=${channel}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Erreur lors du chargement des statistiques pour le canal ${channel}:`, error);
      throw error;
    }
  },

  // Récupérer les statistiques sur une période
  getStatsByDateRange: async (
    eventId: number,
    startDate: string,
    endDate: string
  ): Promise<MailingStats> => {
    try {
      const response = await api.get(
        `/events/${eventId}/mailings/statistics?start_date=${startDate}&end_date=${endDate}`
      );
      return response.data.data || response.data;
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques par période:", error);
      throw error;
    }
  },
};
