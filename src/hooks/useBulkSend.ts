import { useState, useCallback } from "react";
import {
  bulkSendService,
  BulkSendPayload,
  BulkSendResponse,
  BulkSendStatus,
} from "@/api/services/bulkSendService";
import { toast } from "@/components/ui/sonner";

interface MessageDetail {
  id: string;
  recipient: string;
  name: string;
  status: "sent" | "failed" | "pending" | "delivered";
  error?: string;
  timestamp: string;
  message_id?: string;
}

interface UseBulkSendReturn {
  sending: boolean;
  error: string | null;
  progress: {
    total: number;
    sent: number;
    failed: number;
    pending: number;
  } | null;
  bulkSendId: string | null;
  messages: MessageDetail[] | null;
  sendBulk: (payload: any) => Promise<BulkSendResponse>; // CHANGÉ: any au lieu de BulkSendPayload
  checkStatus: (bulkSendId: string) => Promise<BulkSendStatus>;
  cancelSend: (bulkSendId: string) => Promise<void>;
  retryFailed: (bulkSendId: string) => Promise<BulkSendResponse>;
}

export const useBulkSend = (): UseBulkSendReturn => {
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{
    total: number;
    sent: number;
    failed: number;
    pending: number;
  } | null>(null);
  const [bulkSendId, setBulkSendId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageDetail[] | null>(null);

  const sendBulk = useCallback(
    async (payload: any): Promise<BulkSendResponse> => {
      try {
        setSending(true);
        setError(null);
        setProgress(null);

        // VALIDATION CORRIGÉE : Vérifier emails OU contacts selon le canal
        if (payload.channel === "email") {
          if (!payload.emails || payload.emails.length === 0) {
            throw new Error("Aucun destinataire email fourni");
          }
        } else if (payload.channel === "whatsapp") {
          if (!payload.contacts || payload.contacts.length === 0) {
            throw new Error("Aucun contact WhatsApp fourni");
          }
        } else {
          throw new Error(`Canal ${payload.channel} non supporté`);
        }

        // Validation du message
        if (!payload.body || !payload.body.trim()) {
          throw new Error("Le message ne peut pas être vide");
        }

        // Validation du sujet pour email
        if (
          payload.channel === "email" &&
          (!payload.subject || !payload.subject.trim())
        ) {
          throw new Error("Le sujet est requis pour les emails");
        }

        // Appel au service
        const response = await bulkSendService.sendBulk(payload);

        setBulkSendId(response.id);
        if (response.messages) {
          setMessages(response.messages);
        }

        toast.success(
          `Envoi lancé! ${
            response.total_recipients ||
            payload.emails?.length ||
            payload.contacts?.length ||
            0
          } destinataire(s) en attente`
        );

        return response;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Erreur lors de l'envoi en masse";
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setSending(false);
      }
    },
    []
  );

  const checkStatus = useCallback(
    async (id: string): Promise<BulkSendStatus> => {
      try {
        const status = await bulkSendService.getBulkStatus(id);
        setProgress(status.progress);
        if (status.errors) {
          const errorMessages = status.errors.map((e) => ({
            id: `error-${e.recipient}`,
            recipient: e.recipient,
            name: e.recipient,
            status: "failed" as const,
            error: e.error,
            timestamp: new Date().toISOString(),
          }));
          setMessages((prev) => [...(prev || []), ...errorMessages]);
        }
        return status;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Erreur lors de la vérification du statut";
        setError(errorMessage);
        throw err;
      }
    },
    []
  );

  const cancelSend = useCallback(async (id: string): Promise<void> => {
    try {
      await bulkSendService.cancelBulkSend(id);
      toast.success("Envoi annulé");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Erreur lors de l'annulation";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  }, []);

  const retryFailed = useCallback(
    async (id: string): Promise<BulkSendResponse> => {
      try {
        const response = await bulkSendService.retryFailedSends(id);
        toast.success("Relance des envois échoués lancée");
        return response;
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Erreur lors de la relance";
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      }
    },
    []
  );

  return {
    sending,
    error,
    progress,
    bulkSendId,
    messages,
    sendBulk,
    checkStatus,
    cancelSend,
    retryFailed,
  };
};
