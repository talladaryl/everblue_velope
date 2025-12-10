import { useState, useEffect } from "react";
import { guestService, type Guest } from "@/api/services/guestService";
import { toast } from "@/components/ui/sonner";

/**
 * Hook personnalisé pour gérer les invités
 * Utilise le service hybride (API + localStorage)
 */
export function useGuests() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les invités au montage
  useEffect(() => {
    loadGuests();
  }, []);

  const loadGuests = async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedGuests = await guestService.getAll();
      setGuests(loadedGuests);
    } catch (err: any) {
      console.error("❌ Erreur chargement invités:", err);
      setError(err.message || "Erreur de chargement");
      toast.error("Erreur de chargement des invités");
    } finally {
      setLoading(false);
    }
  };

  const addGuest = async (guest: Omit<Guest, "id">) => {
    try {
      const newGuest = await guestService.create(guest);
      setGuests((prev) => [...prev, newGuest]);
      toast.success("Invité ajouté avec succès");
      return newGuest;
    } catch (err: any) {
      console.error("❌ Erreur ajout invité:", err);
      toast.error("Erreur lors de l'ajout");
      throw err;
    }
  };

  const updateGuest = async (id: string, updates: Partial<Guest>) => {
    try {
      const updatedGuest = await guestService.update(id, updates);
      setGuests((prev) =>
        prev.map((g) => (g.id === id ? updatedGuest : g))
      );
      toast.success("Invité mis à jour");
      return updatedGuest;
    } catch (err: any) {
      console.error("❌ Erreur mise à jour invité:", err);
      toast.error("Erreur lors de la mise à jour");
      throw err;
    }
  };

  const deleteGuest = async (id: string) => {
    try {
      await guestService.delete(id);
      setGuests((prev) => prev.filter((g) => g.id !== id));
      toast.success("Invité supprimé");
    } catch (err: any) {
      console.error("❌ Erreur suppression invité:", err);
      toast.error("Erreur lors de la suppression");
      throw err;
    }
  };

  const bulkAddGuests = async (guestsToAdd: Omit<Guest, "id">[]) => {
    try {
      const newGuests = await guestService.bulkCreate(guestsToAdd);
      setGuests((prev) => [...prev, ...newGuests]);
      toast.success(`${newGuests.length} invités importés`);
      return newGuests;
    } catch (err: any) {
      console.error("❌ Erreur import en masse:", err);
      toast.error("Erreur lors de l'import");
      throw err;
    }
  };

  const replaceAllGuests = async (newGuests: Guest[]) => {
    try {
      await guestService.replaceAll(newGuests);
      setGuests(newGuests);
      toast.success("Liste d'invités mise à jour");
    } catch (err: any) {
      console.error("❌ Erreur remplacement invités:", err);
      toast.error("Erreur lors du remplacement");
      throw err;
    }
  };

  const clearAllGuests = async () => {
    try {
      await guestService.clear();
      setGuests([]);
      toast.success("Tous les invités ont été supprimés");
    } catch (err: any) {
      console.error("❌ Erreur suppression complète:", err);
      toast.error("Erreur lors de la suppression");
      throw err;
    }
  };

  return {
    guests,
    loading,
    error,
    loadGuests,
    addGuest,
    updateGuest,
    deleteGuest,
    bulkAddGuests,
    replaceAllGuests,
    clearAllGuests,
    setGuests, // Pour compatibilité avec le code existant
  };
}
