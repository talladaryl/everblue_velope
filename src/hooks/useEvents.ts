import { useState, useCallback, useEffect } from "react";
import { eventService, Event, CreateEventPayload, UpdateEventPayload, EventStatus } from "@/api/services/eventService";
import { toast } from "@/components/ui/sonner";

interface UseEventsReturn {
  events: Event[];
  loading: boolean;
  error: string | null;
  fetchEvents: () => Promise<void>;
  createEvent: (payload: CreateEventPayload) => Promise<Event>;
  updateEvent: (id: number, payload: UpdateEventPayload) => Promise<Event>;
  deleteEvent: (id: number) => Promise<void>;
  updateEventStatus: (id: number, status: EventStatus) => Promise<Event>;
  archiveEvent: (id: number) => Promise<Event>;
  unarchiveEvent: (id: number) => Promise<Event>;
}

export const useEvents = (): UseEventsReturn => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await eventService.getEvents();
      setEvents(data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Erreur lors du chargement des événements";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createEventHandler = useCallback(
    async (payload: CreateEventPayload): Promise<Event> => {
      try {
        const newEvent = await eventService.createEvent(payload);
        setEvents((prev) => [newEvent, ...prev]);
        toast.success("Événement créé avec succès!");
        return newEvent;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Erreur lors de la création de l'événement";
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      }
    },
    []
  );

  const updateEventHandler = useCallback(
    async (id: number, payload: UpdateEventPayload): Promise<Event> => {
      try {
        const updatedEvent = await eventService.updateEvent(id, payload);
        setEvents((prev) =>
          prev.map((e) => (e.id === id ? updatedEvent : e))
        );
        toast.success("Événement mis à jour avec succès!");
        return updatedEvent;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Erreur lors de la mise à jour de l'événement";
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      }
    },
    []
  );

  const deleteEventHandler = useCallback(async (id: number): Promise<void> => {
    try {
      await eventService.deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      toast.success("Événement supprimé avec succès!");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Erreur lors de la suppression de l'événement";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  const updateEventStatusHandler = useCallback(
    async (id: number, status: EventStatus): Promise<Event> => {
      try {
        const updatedEvent = await eventService.updateEventStatus(id, status);
        setEvents((prev) =>
          prev.map((e) => (e.id === id ? updatedEvent : e))
        );
        toast.success(`Événement ${status === "active" ? "activé" : status === "archived" ? "archivé" : "mis en brouillon"} avec succès!`);
        return updatedEvent;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Erreur lors de la mise à jour du statut";
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      }
    },
    []
  );

  const archiveEventHandler = useCallback(async (id: number): Promise<Event> => {
    try {
      const archivedEvent = await eventService.archiveEvent(id);
      setEvents((prev) =>
        prev.map((e) => (e.id === id ? archivedEvent : e))
      );
      toast.success("Événement archivé avec succès!");
      return archivedEvent;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Erreur lors de l'archivage";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  const unarchiveEventHandler = useCallback(async (id: number): Promise<Event> => {
    try {
      const unarchivedEvent = await eventService.unarchiveEvent(id);
      setEvents((prev) =>
        prev.map((e) => (e.id === id ? unarchivedEvent : e))
      );
      toast.success("Événement désarchivé avec succès!");
      return unarchivedEvent;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Erreur lors du désarchivage";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  // Charger les événements au montage
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    fetchEvents,
    createEvent: createEventHandler,
    updateEvent: updateEventHandler,
    deleteEvent: deleteEventHandler,
    updateEventStatus: updateEventStatusHandler,
    archiveEvent: archiveEventHandler,
    unarchiveEvent: unarchiveEventHandler,
  };
};
