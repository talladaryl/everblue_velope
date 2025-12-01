import { useState, useCallback } from "react";
import {
  guestService,
  Guest,
  CreateGuestPayload,
  UpdateGuestPayload,
  ImportGuestsPayload,
} from "@/api/services/guestService";
import { toast } from "@/components/ui/sonner";

interface UseGuestsReturn {
  guests: Guest[];
  loading: boolean;
  error: string | null;
  fetchGuests: (eventId?: number) => Promise<void>;
  createGuest: (payload: CreateGuestPayload) => Promise<Guest>;
  updateGuest: (id: number, payload: UpdateGuestPayload) => Promise<Guest>;
  deleteGuest: (id: number) => Promise<void>;
  importGuests: (
    eventId: number,
    payload: ImportGuestsPayload
  ) => Promise<Guest[]>;
  importGuestsCSV: (eventId: number, file: File) => Promise<Guest[]>;
}

export const useGuests = (): UseGuestsReturn => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGuests = useCallback(async (eventId?: number) => {
    try {
      setLoading(true);
      setError(null);
      const data = eventId
        ? await guestService.getGuestsByEvent(eventId)
        : await guestService.getAllGuests();
      setGuests(data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Erreur lors du chargement des invités";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const createGuestHandler = useCallback(
    async (payload: CreateGuestPayload): Promise<Guest> => {
      try {
        const newGuest = await guestService.createGuest(payload);
        setGuests((prev) => [newGuest, ...prev]);
        toast.success("Invité ajouté avec succès!");
        return newGuest;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Erreur lors de l'ajout de l'invité";
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      }
    },
    []
  );

  const updateGuestHandler = useCallback(
    async (id: number, payload: UpdateGuestPayload): Promise<Guest> => {
      try {
        const updatedGuest = await guestService.updateGuest(id, payload);
        setGuests((prev) => prev.map((g) => (g.id === id ? updatedGuest : g)));
        toast.success("Invité mis à jour avec succès!");
        return updatedGuest;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Erreur lors de la mise à jour de l'invité";
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      }
    },
    []
  );

  const deleteGuestHandler = useCallback(async (id: number): Promise<void> => {
    try {
      await guestService.deleteGuest(id);
      setGuests((prev) => prev.filter((g) => g.id !== id));
      toast.success("Invité supprimé avec succès!");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Erreur lors de la suppression de l'invité";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  const importGuestsHandler = useCallback(
    async (eventId: number, payload: ImportGuestsPayload): Promise<Guest[]> => {
      try {
        const newGuests = await guestService.importGuests(eventId, payload);
        setGuests((prev) => [...newGuests, ...prev]);
        toast.success(`${newGuests.length} invité(s) importé(s) avec succès!`);
        return newGuests;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Erreur lors de l'import des invités";
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      }
    },
    []
  );

  const importGuestsCSVHandler = useCallback(
    async (eventId: number, file: File): Promise<Guest[]> => {
      try {
        const newGuests = await guestService.importGuestsCSV(eventId, file);
        setGuests((prev) => [...newGuests, ...prev]);
        toast.success(
          `${newGuests.length} invité(s) importé(s) depuis le CSV!`
        );
        return newGuests;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Erreur lors de l'import du CSV";
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      }
    },
    []
  );

  return {
    guests,
    loading,
    error,
    fetchGuests,
    createGuest: createGuestHandler,
    updateGuest: updateGuestHandler,
    deleteGuest: deleteGuestHandler,
    importGuests: importGuestsHandler,
    importGuestsCSV: importGuestsCSVHandler,
  };
};
