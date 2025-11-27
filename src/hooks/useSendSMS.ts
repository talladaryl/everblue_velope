import { useState } from "react";
import { twilioService } from "@/api/services/twilioService";
import { toast } from "@/components/ui/sonner";

interface UseSendSMSReturn {
  sending: boolean;
  error: string | null;
  sendSMS: (
    recipients: Array<{ phone_number: string; name: string }>,
    message: string,
    html?: string,
    template_id?: number
  ) => Promise<void>;
}

export const useSendSMS = (): UseSendSMSReturn => {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendSMS = async (
    recipients: Array<{ phone_number: string; name: string }>,
    message: string,
    html?: string,
    template_id?: number
  ) => {
    try {
      setSending(true);
      setError(null);

      if (recipients.length === 0) {
        throw new Error("Aucun destinataire fourni");
      }

      if (!message.trim()) {
        throw new Error("Le message ne peut pas être vide");
      }

      const response = await twilioService.sendBulkSMS(
        recipients,
        message,
        html,
        template_id
      );

      const successCount = response.filter(
        (r) => r.status === "sent" || r.status === "queued"
      ).length;

      toast.success(
        `${successCount}/${recipients.length} SMS envoyé(s) avec succès!`
      );
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Erreur lors de l'envoi des SMS";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setSending(false);
    }
  };

  return {
    sending,
    error,
    sendSMS,
  };
};
