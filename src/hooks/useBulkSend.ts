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
  sendBulk: (payload: BulkSendPayload) => Promise<BulkSendResponse>;
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
    async (payload: BulkSendPayload): Promise<BulkSendResponse> => {
      try {
        setSending(true);
        setError(null);
        setProgress(null);

        // Valider les données
        if (!payload.recipients || payload.recipients.length === 0) {
          throw new Error("Aucun destinataire fourni");
        }

        if (payload.recipients.length > 500) {
          throw new Error("Le nombre de destinataires ne peut pas dépasser 500");
        }

        if (!payload.message || !payload.message.trim()) {
          throw new Error("Le message ne peut pas être vide");
        }

        if (payload.channel === "email" && !payload.subject) {
          throw new Error("Le sujet est requis pour les emails");
        }

        const response = await bulkSendService.sendBulk(payload);
        setBulkSendId(response.id);
        if (response.messages) {
          setMessages(response.messages);
        }

        toast.success(
          `Envoi lancé! ${response.total_recipients} destinataire(s) en attente`
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
