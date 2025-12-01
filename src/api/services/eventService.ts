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
  organization_id?: number;
}

export interface UpdateEventPayload extends Partial<CreateEventPayload> {}

const extract = (res: any) => res.data?.data || res.data;

export const eventService = {
  getEvents: async (): Promise<Event[]> => {
    try {
      const response = await api.get("/events");
      return extract(response) || [];
    } catch (error) {
      console.error("Erreur lors du chargement des événements:", error);
      throw error;
    }
  },

  getEvent: async (id: number): Promise<Event> => {
    try {
      return extract(await api.get(`/events/${id}`));
    } catch (error) {
      console.error(`Erreur lors du chargement de l'événement ${id}:`, error);
      throw error;
    }
  },

  createEvent: async (payload: CreateEventPayload): Promise<Event> => {
    try {
      return extract(await api.post("/events", payload));
    } catch (error) {
      console.error("Erreur lors de la création de l'événement:", error);
      throw error;
    }
  },

  updateEvent: async (
    id: number,
    payload: UpdateEventPayload
  ): Promise<Event> => {
    try {
      return extract(await api.put(`/events/${id}`, payload));
    } catch (error) {
      console.error(
        `Erreur lors de la mise à jour de l'événement ${id}:`,
        error
      );
      throw error;
    }
  },

  deleteEvent: async (id: number): Promise<void> => {
    try {
      await api.delete(`/events/${id}`);
    } catch (error) {
      console.error(
        `Erreur lors de la suppression de l'événement ${id}:`,
        error
      );
      throw error;
    }
  },

  updateEventStatus: async (
    id: number,
    status: EventStatus
  ): Promise<Event> => {
    try {
      return extract(
        await api.post(`/events/${id}/change-status`, { status })
      );
    } catch (error) {
      console.error(
        `Erreur lors de la mise à jour du statut de l'événement ${id}:`,
        error
      );
      throw error;
    }
  },

  archiveEvent: async (id: number): Promise<Event> => {
    try {
      return extract(await api.post(`/events/${id}/archive`));
    } catch (error) {
      console.error(`Erreur lors de l'archivage de l'événement ${id}:`, error);
      throw error;
    }
  },

  unarchiveEvent: async (id: number): Promise<Event> => {
    try {
      return extract(await api.post(`/events/${id}/unarchive`));
    } catch (error) {
      console.error(`Erreur lors du désarchivage de l'événement ${id}:`, error);
      throw error;
    }
  },

  getArchivedEvents: async (): Promise<Event[]> => {
    try {
      return extract(await api.get("/events/archived/list")) || [];
    } catch (error) {
      console.error(
        "Erreur lors du chargement des événements archivés:",
        error
      );
      throw error;
    }
  },
};
