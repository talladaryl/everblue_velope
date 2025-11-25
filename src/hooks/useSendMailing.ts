import { useState } from "react";
import { mailingService, MailingPayload, MailingResponse } from "@/api/services/mailingService";
import { toast } from "@/components/ui/sonner";

interface UseSendMailingReturn {
  sending: boolean;
  error: string | null;
  sendMailing: (payload: MailingPayload) => Promise<MailingResponse>;
}

export const useSendMailing = (): UseSendMailingReturn => {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMailing = async (payload: MailingPayload): Promise<MailingResponse> => {
    try {
      setSending(true);
      setError(null);
      const response = await mailingService.sendMailing(payload);
      toast.success(
        `Mailing envoyé avec succès! ${response.sent_count} email(s) envoyé(s)`
      );
      return response;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Erreur lors de l'envoi du mailing";
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
    sendMailing,
  };
};
