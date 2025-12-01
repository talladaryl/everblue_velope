import api from "@/api/axios";

export interface Guest {
  id: number;
  event_id: number;
  full_name: string;
  email?: string;
  phone?: string;
  plus_one_allowed: boolean;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  valid?: boolean;
  status?: "valid" | "invalid";
}

export interface CreateGuestPayload {
  event_id: number;
  full_name: string;
  email?: string;
  phone?: string;
  plus_one_allowed?: boolean;
  metadata?: Record<string, any>;
}

export interface UpdateGuestPayload {
  full_name?: string;
  email?: string;
  phone?: string;
  plus_one_allowed?: boolean;
  metadata?: Record<string, any>;
}

export interface ImportGuestsPayload {
  guests: Array<{
    full_name: string;
    email?: string;
    phone?: string;
    plus_one_allowed?: boolean;
    metadata?: Record<string, any>;
  }>;
}

// Validation utilitaires
const isValidEmail = (email?: string): boolean => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone?: string): boolean => {
  if (!phone) return false;
  const phoneDigits = phone.replace(/\D/g, "");
  return phoneDigits.length >= 10;
};

const enrichGuest = (guest: Guest): Guest => {
  const isValid = isValidEmail(guest.email) || isValidPhone(guest.phone);
  return {
    ...guest,
    valid: isValid,
    status: isValid ? "valid" : "invalid",
  };
};

export const guestService = {
  getAllGuests: async (): Promise<Guest[]> => {
    try {
      const response = await api.get("/guests");
      const guests = response.data.data || response.data || [];
      return guests.map(enrichGuest);
    } catch (error) {
      console.error("Erreur lors du chargement des invités:", error);
      throw error;
    }
  },

  getGuestsByEvent: async (eventId: number): Promise<Guest[]> => {
    try {
      const response = await api.get(`/guests?event_id=${eventId}`);
      const guests = response.data.data || response.data || [];
      return guests
        .filter((guest) => guest && guest.full_name)
        .map(enrichGuest);
    } catch (error) {
      console.error(
        `Erreur lors du chargement des invités de l'événement ${eventId}:`,
        error
      );
      throw error;
    }
  },

  createGuest: async (payload: CreateGuestPayload): Promise<Guest> => {
    try {
      const response = await api.post("/guests", payload);
      const guest = response.data.data || response.data;
      return enrichGuest(guest);
    } catch (error) {
      console.error("Erreur lors de la création de l'invité:", error);
      throw error;
    }
  },

  updateGuest: async (
    id: number,
    payload: UpdateGuestPayload
  ): Promise<Guest> => {
    try {
      const response = await api.put(`/guests/${id}`, payload);
      const guest = response.data.data || response.data;
      return enrichGuest(guest);
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'invité ${id}:`, error);
      throw error;
    }
  },

  deleteGuest: async (id: number): Promise<void> => {
    try {
      await api.delete(`/guests/${id}`);
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'invité ${id}:`, error);
      throw error;
    }
  },

  importGuestsCSV: async (eventId: number, file: File): Promise<Guest[]> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("event_id", eventId.toString());

      const response = await api.post(
        `/events/${eventId}/guests/import`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const guests = response.data.data || response.data || [];
      return guests.map(enrichGuest);
    } catch (error) {
      console.error("Erreur lors de l'import du fichier CSV:", error);
      throw error;
    }
  },

  importGuests: async (
    eventId: number,
    payload: ImportGuestsPayload
  ): Promise<Guest[]> => {
    try {
      const response = await api.post(
        `/events/${eventId}/guests/import`,
        payload
      );
      const guests = response.data.data || response.data || [];
      return guests.map(enrichGuest);
    } catch (error) {
      console.error("Erreur lors de l'import des invités:", error);
      throw error;
    }
  },

  isValidEmail,
  isValidPhone,
};
