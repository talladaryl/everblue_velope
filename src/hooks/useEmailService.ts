import { useState } from "react";
import api from "@/api/axios";
import { toast } from "@/components/ui/sonner";

export const useEmailService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Envoyer un email de test
  const sendTestEmail = async (testEmail: string, templateData: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post("/emails/send-test", {
        to: testEmail,
        template: templateData,
        isTest: true,
      });

      toast.success("Email de test envoyé avec succès");
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || "Erreur lors de l'envoi du test";
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Envoyer les emails à tous les invités
  const sendAllEmails = async (guests: any[], templateData: any, sendMode: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.post("/emails/send-all", {
        guests: guests.filter((g) => g.valid),
        template: templateData,
        sendMode: sendMode,
      });

      toast.success(`${response.data.sentCount} email(s) envoyé(s) avec succès`);
      return response.data;
    } catch (err: any) {
      const message = err.response?.data?.message || "Erreur lors de l'envoi";
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    sendTestEmail,
    sendAllEmails,
  };
};
