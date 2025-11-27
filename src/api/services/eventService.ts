import api from "@/api/axios";

export type EventStatus = "draft" | "active" | "archived";

export interface Event {
  id: number;
  organization_id: number;
  title: string;
  description?: string;
  event_date?: string;
  location?: string;
  template_id?: number;
  status: EventStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateEventPayload {
  title: string;
  description?: string;
  event_date?: string;
  location?: string;
  template_id?: number;
  status?: EventStatus;
}

export interface UpdateEventPayload extends Partial<CreateEventPayload> {}

export const eventService = {
  // Récupérer tous les événements
  getEvents: async (): Promise<Event[]> => {
    try {
      const response = await api.get("/events");
      return response.data.data || response.data || [];
    } catch (error) {
      console.error("Erreur lors du chargement des événements:", error);
      throw error;
    }
  },

  // Récupérer un événement spécifique
  getEvent: async (id: number): Promise<Event> => {
    try {
      const response = await api.get(`/events/${id}`);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Erreur lors du chargement de l'événement ${id}:`, error);
      throw error;
    }
  },

  // Créer un nouvel événement
  createEvent: async (payload: CreateEventPayload): Promise<Event> => {
    try {
      const response = await api.post("/events", payload);
      return response.data.data || response.data;
    } catch (error) {
      console.error("Erreur lors de la création de l'événement:", error);
      throw error;
    }
  },

  // Mettre à jour un événement
  updateEvent: async (id: number, payload: UpdateEventPayload): Promise<Event> => {
    try {
      const response = await api.put(`/events/${id}`, payload);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'événement ${id}:`, error);
      throw error;
    }
  },

  // Supprimer un événement
  deleteEvent: async (id: number): Promise<void> => {
    try {
      await api.delete(`/events/${id}`);
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'événement ${id}:`, error);
      throw error;
    }
  },

  // Changer le statut d'un événement
  updateEventStatus: async (id: number, status: EventStatus): Promise<Event> => {
    try {
      const response = await api.patch(`/events/${id}/status`, { status });
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du statut de l'événement ${id}:`, error);
      throw error;
    }
  },
};
