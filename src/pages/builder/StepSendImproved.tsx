import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Save,
  Send,
  Mail,
  CheckCircle,
  AlertCircle,
  Loader2,
  MessageSquare,
  Smartphone,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSaveTemplate } from "@/hooks/useSaveTemplate";
import { useBulkSend } from "@/hooks/useBulkSend";
import { SendStatusModal, type MessageStatus } from "@/components/SendStatusModal";
import { toast } from "@/components/ui/sonner";

interface StepSendProps {
  ctx: any;
}

interface Guest {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  date?: string;
  time?: string;
  valid?: boolean;
}

export default function StepSendImproved({ ctx }: StepSendProps) {
  const {
    guests = [],
    setStep,
    items = [],
    bgColor = "#ffffff",
  } = ctx;

  const { saving, saveTemplate } = useSaveTemplate();
  const { sending, bulkSendId, messages, sendBulk, checkStatus, cancelSend, retryFailed } =
    useBulkSend();

  const [templateTitle, setTemplateTitle] = useState("Mon invitation");
  const [templateDescription, setTemplateDescription] = useState("");
  const [emailSubject, setEmailSubject] = useState("Vous êtes invité!");
  const [customMessage, setCustomMessage] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [sendMethod, setSendMethod] = useState<"email" | "mms" | "whatsapp">("email");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusMessages, setStatusMessages] = useState<MessageStatus[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [sentCount, setSentCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  // Valider les données
  const validGuests = Array.isArray(guests)
    ? guests.filter((g: Guest) => {
        if (!g || !g.valid) return false;
        if (sendMethod === "email") return g.email && g.email.includes("@");
        if (sendMethod === "mms" || sendMethod === "whatsapp") {
          return g.phone && g.phone.replace(/\D/g, "").length >= 10;
        }
        return false;
      })
    : [];

  const canSend = validGuests.length > 0;
  const maxRecipientsExceeded = validGuests.length > 500;

  // Générer le contenu HTML de la carte
  const generateCardHTML = (): string => {
    let html = `<div style="background: ${bgColor}; padding: 20px; border-radius: 8px;">`;

    items.forEach((item: any) => {
      if (item.type === "text") {
        html += `<p style="color: ${item.color}; font-size: ${item.fontSize}px; font-family: ${item.fontFamily}; font-weight: ${item.fontWeight}; text-align: ${item.textAlign};">${item.text}</p>`;
      } else if (item.type === "image") {
        html += `<img src="${item.src}" style="width: ${item.width}px; height: ${item.height}px; border-radius: ${item.borderRadius}px;" />`;
      }
    });

    if (customMessage) {
      html += `<p style="margin-top: 20px; font-style: italic; color: #666;">${customMessage}</p>`;
    }

    html += `</div>`;
    return html;
  };

  // Sauvegarder le template
  const handleSaveTemplate = async () => {
    if (!templateTitle.trim()) {
      toast.error("Veuillez entrer un titre pour le template");
      return;
    }

    try {
      await saveTemplate({
        name: templateTitle,
        category: "custom",
        structure: {
          items,
          bgColor,
          description: templateDescription,
          variables: extractVariables(),
        },
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (error) {
      console.error("Erreur sauvegarde:", error);
    }
  };

  // Extraire les variables du contenu
  const extractVariables = (): string[] => {
    const variables = new Set<string>();
    const regex = /\{\{(\w+)\}\}/g;

    items.forEach((item: any) => {
      if (item.type === "text" && item.text) {
        let match: RegExpExecArray | null;
        while ((match = regex.exec(item.text)) !== null) {
          variables.add(match[1]);
        }
      }
    });

    return Array.from(variables);
  };

  // Convertir les messages du hook en MessageStatus
  const convertToMessageStatus = (msgs: any[], channel: string): MessageStatus[] => {
    return msgs.map((msg, idx) => ({
      id: msg.id || `msg-${idx}`,
      recipient: msg.recipient || msg.email || msg.phone || "",
      name: msg.name || "",
      channel: channel as any,
      status: msg.status || "pending",
      error: msg.error,
      timestamp: msg.timestamp || new Date().toISOString(),
      message_id: msg.message_id,
    }));
  };

  // Envoyer en masse (email, SMS, MMS, WhatsApp)
  const handleSendBulk = async () => {
    if (!canSend) {
      toast.error("Aucun invité valide à qui envoyer");
      return;
    }

    if (maxRecipientsExceeded) {
      toast.error("Le nombre de destinataires ne peut pas dépasser 500");
      return;
    }

    if (sendMethod === "email" && !emailSubject.trim()) {
      toast.error("Veuillez entrer un sujet pour l'email");
      return;
    }

    if (!customMessage.trim()) {
      toast.error("Veuillez entrer un message");
      return;
    }

    try {
      const recipients = validGuests.map((guest: Guest) => ({
        email: guest.email,
        phone: guest.phone,
        name: guest.name,
        variables: {
          nom: guest.name,
          email: guest.email || "",
          phone: guest.phone || "",
          lieu: guest.location || "",
          date: guest.date || "",
          heure: guest.time || "",
        },
      }));

      const response = await sendBulk({
        channel: sendMethod,
        subject: sendMethod === "email" ? emailSubject : undefined,
        message: customMessage,
        html: sendMethod === "email" ? generateCardHTML() : undefined,
        recipients,
        batch_size: 50,
      });

      // Mettre à jour les statistiques
      setTotalCount(response.total_recipients);
      setSentCount(response.sent_count);
      setFailedCount(response.failed_count);
      setPendingCount(response.pending_count);

      // Convertir et afficher les messages
      if (response.messages) {
        const converted = convertToMessageStatus(response.messages, sendMethod);
        setStatusMessages(converted);
      }

      // Afficher le modal
      setShowStatusModal(true);
    } catch (error) {
      console.error("Erreur envoi:", error);
    }
  };

  // Mettre à jour le modal quand les messages changent
  const handleCheckStatus = async (bulkId: string) => {
    try {
      const status = await checkStatus(bulkId);
      
      setTotalCount(status.progress.total);
      setSentCount(status.progress.sent);
      setFailedCount(status.progress.failed);
      setPendingCount(status.progress.pending);

      if (messages) {
        const converted = convertToMessageStatus(messages, sendMethod);
        setStatusMessages(converted);
      }

      return status;
    } catch (error) {
      console.error("Erreur lors de la vérification du statut:", error);
      throw error;
    }
  };

  const getChannelLabel = (channel: string): string => {
    switch (channel) {
      case "email":
        return "Email";
      case "mms":
        return "MMS";
      case "whatsapp":
        return "WhatsApp";
      default:
        return channel;
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "mms":
        return <MessageSquare className="h-4 w-4" />;
      case "whatsapp":
        return <Smartphone className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-enter">
      {/* Alerte si aucun invité */}
      {guests.length === 0 && (
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Aucun invité trouvé. Veuillez retourner à l'étape précédente pour ajouter des invités.
          </AlertDescription>
        </Alert>
      )}

      {guests.length > 0 && validGuests.length === 0 && (
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Aucun invité valide trouvé pour le canal {getChannelLabel(sendMethod)}. Veuillez vérifier les données de vos invités.
          </AlertDescription>
        </Alert>
      )}

      {/* Résumé */}
      <Card>
        <CardHeader>
          <CardTitle>Résumé de l'envoi</CardTitle>
          <CardDescription>
            Vérifiez les informations avant d'envoyer
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Éléments</p>
              <p className="text-2xl font-bold text-blue-600">{items.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Invités valides</p>
              <p className="text-2xl font-bold text-green-600">
                {validGuests.length}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Variables</p>
              <p className="text-2xl font-bold text-purple-600">
                {extractVariables().length}
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Canal</p>
              <Badge className="mt-2 gap-1">
                {getChannelIcon(sendMethod)}
                {getChannelLabel(sendMethod)}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sauvegarder le template */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            Sauvegarder le template
          </CardTitle>
          <CardDescription>
            Conservez ce design pour une utilisation future
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {savedSuccess && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Template sauvegardé avec succès!
              </AlertDescription>
            </Alert>
          )}

          <div>
            <Label htmlFor="template-title">Nom du template</Label>
            <Input
              id="template-title"
              value={templateTitle}
              onChange={(e) => setTemplateTitle(e.target.value)}
              placeholder="Ex: Invitation Mariage 2025"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="template-desc">Description (optionnel)</Label>
            <Textarea
              id="template-desc"
              value={templateDescription}
              onChange={(e) => setTemplateDescription(e.target.value)}
              placeholder="Décrivez ce template..."
              className="mt-2"
              rows={3}
            />
          </div>

          <Button
            onClick={handleSaveTemplate}
            disabled={saving}
            className="w-full"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sauvegarde en cours...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder le template
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Envoyer les invitations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Envoyer les invitations
          </CardTitle>
          <CardDescription>
            Envoyez les invitations à tous les invités valides
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!canSend && (
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Aucun invité valide. Veuillez ajouter des invités avec des données valides.
              </AlertDescription>
            </Alert>
          )}

          {maxRecipientsExceeded && (
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Le nombre de destinataires dépasse 500. Veuillez réduire le nombre d'invités.
              </AlertDescription>
            </Alert>
          )}

          {/* Sélection du canal */}
          <div>
            <Label htmlFor="send-method">Canal d'envoi</Label>
            <Select value={sendMethod} onValueChange={(value: any) => setSendMethod(value)}>
              <SelectTrigger id="send-method" className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </div>
                </SelectItem>
                <SelectItem value="mms">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    MMS
                  </div>
                </SelectItem>
                <SelectItem value="whatsapp">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    WhatsApp
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sujet pour email */}
          {sendMethod === "email" && (
            <div>
              <Label htmlFor="email-subject">Sujet de l'email</Label>
              <Input
                id="email-subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Ex: Vous êtes invité à notre mariage!"
                className="mt-2"
              />
            </div>
          )}

          {/* Message */}
          <div>
            <Label htmlFor="custom-message">Message</Label>
            <Textarea
              id="custom-message"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder={`Entrez votre message pour ${getChannelLabel(sendMethod)}...`}
              className="mt-2"
              rows={4}
            />
          </div>

          {/* Variables disponibles */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-blue-900 mb-2">
              Variables disponibles:
            </p>
            <div className="flex flex-wrap gap-2">
              {extractVariables().map((variable) => (
                <Badge key={variable} variant="secondary">
                  {"{"}
                  {"{"}
                  {variable}
                  {"}"}
                  {"}"}
                </Badge>
              ))}
            </div>
          </div>

          {/* Bouton d'envoi */}
          <Button
            onClick={handleSendBulk}
            disabled={sending || !canSend || maxRecipientsExceeded}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {sending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Envoyer à {validGuests.length} invité
                {validGuests.length > 1 ? "s" : ""} via {getChannelLabel(sendMethod)}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Aperçu du contenu pour email */}
      {sendMethod === "email" && (
        <Card>
          <CardHeader>
            <CardTitle>Aperçu du contenu</CardTitle>
            <CardDescription>
              Voici comment votre invitation apparaîtra
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="p-6 rounded-lg border border-gray-200 bg-white"
              dangerouslySetInnerHTML={{ __html: generateCardHTML() }}
            />
          </CardContent>
        </Card>
      )}

      {/* Modal de statut */}
      <SendStatusModal
        open={showStatusModal}
        onOpenChange={setShowStatusModal}
        messages={statusMessages}
        channel={sendMethod}
        totalCount={totalCount}
        sentCount={sentCount}
        failedCount={failedCount}
        pendingCount={pendingCount}
      />

      {/* Navigation */}
      <div className="flex justify-between gap-4">
        <Button variant="outline" onClick={() => setStep(1)}>
          ← Retour Édition
        </Button>
        <Button variant="outline" onClick={() => setStep(0)}>
          Accueil
        </Button>
      </div>
    </div>
  );
}
