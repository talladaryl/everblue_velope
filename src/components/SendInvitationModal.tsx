import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Mail, X, Send, Users } from "lucide-react";
import { emailService } from "@/services/emailService";
import { toast } from "@/components/ui/sonner";

interface Guest {
  id: string;
  name: string;
  email: string;
  valid: boolean;
  message?: string;
}

interface SendInvitationModalProps {
  guests: Guest[];
  invitationData: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function SendInvitationModal({
  guests,
  invitationData,
  isOpen,
  onClose,
}: SendInvitationModalProps) {
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState(0);
  const [customMessages, setCustomMessages] = useState<{
    [key: string]: string;
  }>({});

  if (!isOpen) return null;

  const validGuests = guests.filter((guest) => guest.valid);

  const handleSendEmails = async () => {
    if (validGuests.length === 0) {
      toast.error("Aucun invité valide à qui envoyer des invitations");
      return;
    }

    setSending(true);
    setProgress(0);

    try {
      const invitations = validGuests.map((guest) => ({
        recipient_email: guest.email,
        recipient_name: guest.full_name,
        invitation_data: {
          ...invitationData,
          token: `invite-${guest.id}-${Date.now()}`,
        },
        custom_message: customMessages[guest.id] || guest.message,
      }));

      const result = await emailService.sendBulkInvitations({ invitations });

      // Simulation de progression
      const total = invitations.length;
      for (let i = 0; i < total; i++) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        setProgress(((i + 1) / total) * 100);
      }

      if (result.total_failed === 0) {
        toast.success(
          `✅ ${result.total_sent} invitations envoyées avec succès !`
        );
      } else {
        toast.warning(
          `⚠️ ${result.total_sent} envoyées, ${result.total_failed} échecs`
        );
      }

      onClose();
    } catch (error) {
      console.error("Erreur envoi:", error);
      toast.error("❌ Erreur lors de l'envoi des invitations");
    } finally {
      setSending(false);
      setProgress(0);
    }
  };

  const handleCustomMessageChange = (guestId: string, message: string) => {
    setCustomMessages((prev) => ({
      ...prev,
      [guestId]: message,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Mail className="h-6 w-6 text-blue-600" />
            <div>
              <h2 className="text-2xl font-bold">Envoyer les invitations</h2>
              <p className="text-muted-foreground">
                {validGuests.length} invité(s) valide(s)
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={sending}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Barre de progression */}
          {sending && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Envoi en cours...</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Liste des invités */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Destinataires
              </CardTitle>
              <CardDescription>
                Personnalisez le message pour chaque invité
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {validGuests.map((guest, index) => (
                <div key={guest.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{guest.full_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {guest.email}
                      </p>
                    </div>
                    <Badge variant="secondary">#{index + 1}</Badge>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`message-${guest.id}`}>
                      Message personnalisé (optionnel)
                    </Label>
                    <Textarea
                      id={`message-${guest.id}`}
                      placeholder="Ajoutez un message spécial pour cet invité..."
                      value={customMessages[guest.id] || guest.message || ""}
                      onChange={(e) =>
                        handleCustomMessageChange(guest.id, e.target.value)
                      }
                      disabled={sending}
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose} disabled={sending}>
              Annuler
            </Button>
            <Button
              onClick={handleSendEmails}
              disabled={sending || validGuests.length === 0}
              className="flex items-center gap-2"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Envoyer {validGuests.length} invitation(s)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
