import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Save,
  Send,
  Mail,
  MailOpen,
  CheckCircle,
  AlertCircle,
  Loader2,
  MessageSquare,
  Smartphone,
  Users,
  User,
  Settings,
  Edit2,
  X,
  Check,
  Globe,
  MessageCircle,
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
import { useEvents } from "@/hooks/useEvents";
import {
  SendStatusModal,
  type MessageStatus,
} from "@/components/SendStatusModal";
import { toast } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface StepSendProps {
  ctx: any;
}

interface Guest {
  id?: string;
  name: string;
  full_name?: string;
  email?: string;
  phone?: string;
  location?: string;
  date?: string;
  time?: string;
  valid?: boolean;
  channel?: "whatsapp" | "email";
  countryCode?: string;
}

// Templates de messages
const MESSAGE_TEMPLATES = {
  whatsapp: {
    casual:
      "Salut {name} ! Je t'invite à mon événement le {date}. Réponds-moi pour confirmer !",
    formal:
      "Bonjour {name}, vous êtes cordialement invité(e) à notre événement du {date}. Nous espérons vous y voir.",
    reminder: "Rappel : {name}, n'oubliez pas notre événement demain !",
  },
  email: {
    casual: "Salut {name},\n\nTu es invité à mon événement !\n\nÀ bientôt !",
    formal:
      "Madame, Monsieur {name},\n\nNous avons le plaisir de vous convier à notre événement.\n\nCordialement,",
    invitation:
      "Cher(e) {name},\n\nC'est avec plaisir que je vous invite à rejoindre cet événement spécial.",
  },
};

// Liste des indicatifs téléphoniques par pays
const COUNTRY_CODES = [
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+1", country: "USA/Canada", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+237", country: "Cameroon", flag: "🇨🇲" },
  { code: "+225", country: "Ivory Coast", flag: "🇨🇮" },
  { code: "+229", country: "Benin", flag: "🇧🇯" },
  { code: "+226", country: "Burkina Faso", flag: "🇧🇫" },
  { code: "+242", country: "Congo", flag: "🇨🇬" },
  { code: "+243", country: "DR Congo", flag: "🇨🇩" },
  { code: "+221", country: "Senegal", flag: "🇸🇳" },
  { code: "+228", country: "Togo", flag: "🇹🇬" },
  { code: "+234", country: "Nigeria", flag: "🇳🇬" },
];

export default function StepSendImproved({ ctx }: StepSendProps) {
  const {
    guests = [],
    setStep,
    items = [],
    bgColor = "#ffffff",
    templateId,
    setEventId,
  } = ctx;

  const { saving, saveTemplate } = useSaveTemplate();
  const {
    sending,
    bulkSendId,
    messages,
    sendBulk,
    checkStatus,
    cancelSend,
    retryFailed,
  } = useBulkSend();
  const { events } = useEvents();

  const [templateTitle, setTemplateTitle] = useState("Mon invitation");
  const [templateDescription, setTemplateDescription] = useState("");
  const [emailSubject, setEmailSubject] = useState("Vous êtes invité!");
  const [customMessage, setCustomMessage] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [sendMethod, setSendMethod] = useState<
    "email" | "sms" | "mms" | "whatsapp"
  >("email");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [statusMessages, setStatusMessages] = useState<MessageStatus[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [sentCount, setSentCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [sendMode, setSendMode] = useState<"group" | "personalized">("group");
  const [groupMessage, setGroupMessage] = useState({
    channel: "email",
    whatsapp: MESSAGE_TEMPLATES.whatsapp.casual,
    email: MESSAGE_TEMPLATES.email.casual,
    subject: "Vous êtes invité!",
  });
  const [personalizedMessages, setPersonalizedMessages] = useState<
    Record<string, any>
  >({});
  const [showPersonalizationDialog, setShowPersonalizationDialog] =
    useState(false);
  const [selectedGuestForEdit, setSelectedGuestForEdit] =
    useState<Guest | null>(null);

  // Valider les données
  const validGuests = Array.isArray(guests)
    ? guests.filter((g: Guest) => {
        if (!g || !g.valid) return false;
        if (sendMethod === "email") return g.email && g.email.includes("@");
        if (sendMethod === "whatsapp") {
          return g.phone && g.phone.replace(/\D/g, "").length >= 10;
        }
        if (sendMethod === "mms") {
          return g.phone && g.phone.replace(/\D/g, "").length >= 10;
        }
        if (sendMethod === "sms") {
          return g.phone && g.phone.replace(/\D/g, "").length >= 10;
        }
        return false;
      })
    : [];

  // Initialiser les messages personnalisés
  useEffect(() => {
    if (guests && guests.length > 0) {
      const initialMessages: Record<string, any> = {};
      guests.forEach((guest: Guest) => {
        if (!personalizedMessages[guest.id!]) {
          const messageTemplate =
            guest.channel === "whatsapp"
              ? MESSAGE_TEMPLATES.whatsapp.casual
              : MESSAGE_TEMPLATES.email.casual;

          initialMessages[guest.id!] = {
            channel: guest.channel || "email",
            message: messageTemplate.replace("{name}", guest.name),
            subject: "Vous êtes invité!",
            customized: false,
          };
        }
      });
      setPersonalizedMessages((prev) => ({ ...prev, ...initialMessages }));
    }
  }, [guests]);

  const canSend = validGuests.length > 0;
  const maxRecipientsExceeded = validGuests.length > 500;

  // Statistiques
  const stats = {
    total: guests?.length || 0,
    whatsapp:
      guests?.filter((g: any) => g.channel === "whatsapp" && g.valid).length ||
      0,
    email:
      guests?.filter((g: any) => g.channel === "email" && g.valid).length || 0,
    personalized:
      Object.values(personalizedMessages).filter((m: any) => m.customized)
        .length || 0,
  };

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
  const convertToMessageStatus = (
    msgs: any[],
    channel: string
  ): MessageStatus[] => {
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

  // Valider les trois champs obligatoires (event_id, channel, subject)
  const validateRequiredFields = (): { valid: boolean; error?: string } => {
    // 1. Vérifier event_id
    if (!selectedEventId) {
      return { valid: false, error: "Veuillez sélectionner un événement" };
    }

    // 2. Vérifier channel
    if (!sendMethod) {
      return { valid: false, error: "Veuillez sélectionner un canal d'envoi" };
    }

    // 3. Vérifier subject (obligatoire pour tous les canaux)
    const subject =
      sendMode === "group"
        ? groupMessage.subject
        : personalizedMessages[selectedGuestForEdit?.id!]?.subject ||
          "Vous êtes invité!";

    if (!subject || !subject.trim()) {
      return { valid: false, error: "Le sujet est requis" };
    }

    return { valid: true };
  };

  // Mettre à jour un message personnalisé
  const updatePersonalizedMessage = (guestId: string, updates: any) => {
    setPersonalizedMessages((prev) => ({
      ...prev,
      [guestId]: {
        ...prev[guestId],
        ...updates,
        customized:
          updates.message !==
          MESSAGE_TEMPLATES[
            updates.channel || prev[guestId]?.channel
          ]?.casual?.replace(
            "{name}",
            guests?.find((g: any) => g.id === guestId)?.name || ""
          ),
      },
    }));
  };

  // Appliquer un template
  const applyTemplate = (guestId: string, templateType: string) => {
    const guest = guests?.find((g: any) => g.id === guestId);
    if (!guest) return;

    const channel = guest.channel || "email";
    const template = MESSAGE_TEMPLATES[channel][templateType];
    const message = template
      .replace("{name}", guest.name)
      .replace("{date}", new Date().toLocaleDateString());

    updatePersonalizedMessage(guestId, { message });
  };

  // Ouvrir le modal de personnalisation pour un invité
  const openPersonalizationDialog = (guest: Guest) => {
    setSelectedGuestForEdit(guest);
    setShowPersonalizationDialog(true);
  };

  // Envoyer en masse après sélection d'événement
  const handleSendBulkWithEvent = async () => {
    // Valider les trois champs obligatoires
    const validation = validateRequiredFields();
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    const eventIdNum = parseInt(selectedEventId);
    setEventId(eventIdNum);
    setShowEventModal(false);
    await performSendBulk(eventIdNum);
  };

  // Envoyer en masse (email, SMS, MMS, WhatsApp)
  const performSendBulk = async (eventIdNum?: number) => {
    // Validation finale avant envoi - Les trois champs obligatoires
    if (!eventIdNum) {
      toast.error("L'ID de l'événement est manquant");
      return;
    }

    if (!sendMethod) {
      toast.error("Le canal d'envoi est manquant");
      return;
    }

    let subject = "";
    let recipients = [];

    if (sendMode === "group") {
      subject = groupMessage.subject;
      // Filtrer les invités selon le canal d'envoi groupé
      recipients = validGuests
        .filter((guest: Guest) => {
          if (groupMessage.channel === "whatsapp") {
            return guest.channel === "whatsapp" && guest.phone;
          } else {
            return guest.channel === "email" && guest.email;
          }
        })
        .map((guest: Guest) => ({
          name: guest.full_name || guest.name || "Invité",
          email: guest.email || "",
          phone: guest.phone || "",
          variables: {
            nom: guest.full_name || guest.name || "",
            email: guest.email || "",
            phone: guest.phone || "",
            lieu: guest.location || "",
            date: guest.date || "",
            heure: guest.time || "",
          },
        }));
    } else {
      // Envoi personnalisé
      recipients = validGuests
        .filter((guest: Guest) => personalizedMessages[guest.id!]?.customized)
        .map((guest: Guest) => ({
          name: guest.full_name || guest.name || "Invité",
          email: guest.email || "",
          phone: guest.phone || "",
          subject:
            personalizedMessages[guest.id!]?.subject || "Vous êtes invité!",
          message: personalizedMessages[guest.id!]?.message || "",
          channel: guest.channel,
          variables: {
            nom: guest.full_name || guest.name || "",
            email: guest.email || "",
            phone: guest.phone || "",
            lieu: guest.location || "",
            date: guest.date || "",
            heure: guest.time || "",
          },
        }));
    }

    if (recipients.length === 0) {
      toast.error("Aucun destinataire valide pour l'envoi");
      return;
    }

    try {
      // Construire le payload selon le mode
      const payload: any = {
        event_id: eventIdNum,
        channel: sendMethod,
        subject: subject,
        recipients,
        batch_size: 50,
      };

      if (sendMode === "group") {
        payload.message = groupMessage[groupMessage.channel];
        if (groupMessage.channel === "email") {
          payload.html = generateCardHTML();
        }
      } else {
        payload.personalized = true;
      }

      const response = await sendBulk(payload);

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
      toast.error("Erreur lors de l'envoi");
    }
  };

  // Ouvrir le modal de sélection d'événement
  const handleOpenEventModal = () => {
    if (!canSend) {
      toast.error("Aucun invité valide à qui envoyer");
      return;
    }

    if (maxRecipientsExceeded) {
      toast.error("Le nombre de destinataires ne peut pas dépasser 500");
      return;
    }

    // Vérifier selon le mode
    if (sendMode === "group") {
      if (!groupMessage[groupMessage.channel].trim()) {
        toast.error("Veuillez entrer un message");
        return;
      }
    } else {
      const customizedCount = Object.values(personalizedMessages).filter(
        (m: any) => m.customized
      ).length;
      if (customizedCount === 0) {
        toast.error("Aucun message personnalisé configuré");
        return;
      }
    }

    // Filtrer les événements associés au template
    const associatedEvents = templateId
      ? events.filter((e: any) => e.template_id === templateId)
      : events;

    if (associatedEvents.length === 0) {
      toast.error("Aucun événement associé à ce template");
      return;
    }

    setShowEventModal(true);
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
    <div className="max-w-6xl mx-auto space-y-6 animate-enter">
      {/* Alerte si aucun invité */}
      {guests.length === 0 && (
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Aucun invité trouvé. Veuillez retourner à l'étape précédente pour
            ajouter des invités.
          </AlertDescription>
        </Alert>
      )}

      {guests.length > 0 && validGuests.length === 0 && (
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Aucun invité valide trouvé pour le canal{" "}
            {getChannelLabel(sendMethod)}. Veuillez vérifier les données de vos
            invités.
          </AlertDescription>
        </Alert>
      )}

      {/* Statistiques */}
      <Card>
        <CardHeader>
          <CardTitle>Résumé de l'envoi</CardTitle>
          <CardDescription>
            Vérifiez les informations avant d'envoyer
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
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
              <p className="text-sm text-gray-600">Mode d'envoi</p>
              <Badge className="mt-2 gap-1">
                {sendMode === "group" ? (
                  <Users className="h-3 w-3" />
                ) : (
                  <User className="h-3 w-3" />
                )}
                {sendMode === "group" ? "Groupé" : "Personnalisé"}
              </Badge>
            </div>
            <div className="bg-cyan-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Personnalisés</p>
              <p className="text-2xl font-bold text-cyan-600">
                {stats.personalized}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sélection du mode d'envoi */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Mode d'envoi
          </CardTitle>
          <CardDescription>
            Choisissez entre envoi groupé ou personnalisé par invité
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={sendMode}
            onValueChange={(v) => setSendMode(v as any)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="group" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Envoi groupé
              </TabsTrigger>
              <TabsTrigger
                value="personalized"
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" />
                Personnalisé
              </TabsTrigger>
            </TabsList>

            {/* Envoi groupé */}
            <TabsContent value="group" className="space-y-4 pt-4">
              <Alert>
                <Users className="h-4 w-4" />
                <AlertTitle>Envoi groupé</AlertTitle>
                <AlertDescription>
                  Envoyez le même message à tous les invités d'un canal
                  spécifique.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="flex items-center gap-2 mb-2">
                    <Settings className="h-4 w-4" />
                    Canal d'envoi groupé
                  </Label>
                  <RadioGroup
                    value={groupMessage.channel}
                    onValueChange={(value) =>
                      setGroupMessage({ ...groupMessage, channel: value })
                    }
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="whatsapp" id="group-whatsapp" />
                      <Label
                        htmlFor="group-whatsapp"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <MessageCircle className="h-4 w-4" />
                        WhatsApp ({stats.whatsapp} invités)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id="group-email" />
                      <Label
                        htmlFor="group-email"
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <Mail className="h-4 w-4" />
                        Email ({stats.email} invités)
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label htmlFor="group-subject">Sujet</Label>
                  <Input
                    id="group-subject"
                    value={groupMessage.subject}
                    onChange={(e) =>
                      setGroupMessage({
                        ...groupMessage,
                        subject: e.target.value,
                      })
                    }
                    placeholder="Vous êtes invité!"
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="group-message"
                  className="flex items-center gap-2 mb-2"
                >
                  {groupMessage.channel === "whatsapp" ? (
                    <MessageSquare className="h-4 w-4" />
                  ) : (
                    <MailOpen className="h-4 w-4" />
                  )}
                  Message groupé
                </Label>
                <Textarea
                  id="group-message"
                  value={groupMessage[groupMessage.channel]}
                  onChange={(e) =>
                    setGroupMessage({
                      ...groupMessage,
                      [groupMessage.channel]: e.target.value,
                    })
                  }
                  placeholder={`Écrivez votre message ${
                    groupMessage.channel === "whatsapp" ? "WhatsApp" : "email"
                  }...`}
                  className="min-h-[150px]"
                />
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const template =
                        MESSAGE_TEMPLATES[groupMessage.channel].casual;
                      setGroupMessage({
                        ...groupMessage,
                        [groupMessage.channel]: template,
                      });
                    }}
                  >
                    Template informel
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const template =
                        MESSAGE_TEMPLATES[groupMessage.channel].formal;
                      setGroupMessage({
                        ...groupMessage,
                        [groupMessage.channel]: template,
                      });
                    }}
                  >
                    Template formel
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Envoi personnalisé */}
            <TabsContent value="personalized" className="pt-4">
              <Alert>
                <User className="h-4 w-4" />
                <AlertTitle>Personnalisation par invité</AlertTitle>
                <AlertDescription>
                  Configurez un message spécifique pour chaque invité.
                </AlertDescription>
              </Alert>

              {validGuests.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                      {stats.personalized} message
                      {stats.personalized !== 1 ? "s" : ""} personnalisé
                      {stats.personalized !== 1 ? "s" : ""}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Personnaliser tous les invités
                        guests.forEach((guest: Guest) => {
                          if (guest.valid) {
                            updatePersonalizedMessage(guest.id!, {
                              customized: true,
                            });
                          }
                        });
                      }}
                    >
                      Personnaliser tous
                    </Button>
                  </div>

                  <div className="border rounded-lg divide-y">
                    {validGuests.map((guest: Guest) => (
                      <div
                        key={guest.id}
                        className="p-4 hover:bg-gray-50 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{guest.name}</h4>
                              <Badge variant="outline" className="text-xs">
                                {guest.channel === "whatsapp" ? (
                                  <MessageCircle className="h-3 w-3 mr-1" />
                                ) : (
                                  <Mail className="h-3 w-3 mr-1" />
                                )}
                                {guest.channel}
                              </Badge>
                              {personalizedMessages[guest.id!]?.customized && (
                                <Badge className="bg-purple-100 text-purple-800 text-xs">
                                  Personnalisé
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">
                              {guest.channel === "whatsapp"
                                ? guest.phone
                                : guest.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={
                              personalizedMessages[guest.id!]?.customized ||
                              false
                            }
                            onCheckedChange={(checked) => {
                              if (!checked) {
                                const template =
                                  MESSAGE_TEMPLATES[guest.channel || "email"]
                                    .casual;
                                updatePersonalizedMessage(guest.id!, {
                                  message: template.replace(
                                    "{name}",
                                    guest.name
                                  ),
                                  customized: false,
                                });
                              } else {
                                updatePersonalizedMessage(guest.id!, {
                                  customized: true,
                                });
                              }
                            }}
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => openPersonalizationDialog(guest)}
                            title="Éditer le message"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Aucun invité valide pour personnaliser les messages.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Paramètres d'envoi */}
      <Card>
        <CardHeader>
          <CardTitle>Paramètres d'envoi</CardTitle>
          <CardDescription>
            Configurez les détails techniques de l'envoi
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="send-method">Canal technique d'envoi</Label>
              <Select
                value={sendMethod}
                onValueChange={(value: any) => setSendMethod(value)}
              >
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
                  <SelectItem value="whatsapp">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      WhatsApp
                    </div>
                  </SelectItem>
                  <SelectItem value="mms">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      MMS
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="email-subject">
                {sendMode === "group" ? "Sujet de l'email" : "Sujet par défaut"}
              </Label>
              <Input
                id="email-subject"
                value={
                  sendMode === "group"
                    ? groupMessage.subject
                    : "Vous êtes invité!"
                }
                onChange={(e) => {
                  if (sendMode === "group") {
                    setGroupMessage({
                      ...groupMessage,
                      subject: e.target.value,
                    });
                  }
                  // Pour le mode personnalisé, le sujet est géré dans la personnalisation
                }}
                placeholder="Ex: Vous êtes invité à notre mariage!"
                className="mt-2"
              />
            </div>
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
            onClick={handleOpenEventModal}
            disabled={sending || !canSend || maxRecipientsExceeded}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            {sending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                {sendMode === "group"
                  ? `Envoyer groupé à ${
                      validGuests.filter(
                        (g: Guest) => g.channel === groupMessage.channel
                      ).length
                    } invités`
                  : `Envoyer ${stats.personalized} message${
                      stats.personalized !== 1 ? "s" : ""
                    } personnalisé${stats.personalized !== 1 ? "s" : ""}`}
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

      {/* Dialog de personnalisation d'un invité */}
      <Dialog
        open={showPersonalizationDialog}
        onOpenChange={setShowPersonalizationDialog}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Personnaliser le message pour {selectedGuestForEdit?.name}
            </DialogTitle>
            <DialogDescription>
              Écrivez un message spécifique pour cet invité
            </DialogDescription>
          </DialogHeader>

          {selectedGuestForEdit && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {selectedGuestForEdit.channel === "whatsapp" ? (
                        <MessageCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <Mail className="h-3 w-3 mr-1" />
                      )}
                      {selectedGuestForEdit.channel}
                    </Badge>
                    <span className="font-medium">
                      {selectedGuestForEdit.name}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {selectedGuestForEdit.channel === "whatsapp"
                      ? selectedGuestForEdit.phone
                      : selectedGuestForEdit.email}
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="personal-subject">Sujet</Label>
                <Input
                  id="personal-subject"
                  value={
                    personalizedMessages[selectedGuestForEdit.id!]?.subject ||
                    "Vous êtes invité!"
                  }
                  onChange={(e) =>
                    updatePersonalizedMessage(selectedGuestForEdit.id!, {
                      subject: e.target.value,
                    })
                  }
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="personal-message">Message</Label>
                <Textarea
                  id="personal-message"
                  value={
                    personalizedMessages[selectedGuestForEdit.id!]?.message ||
                    ""
                  }
                  onChange={(e) =>
                    updatePersonalizedMessage(selectedGuestForEdit.id!, {
                      message: e.target.value,
                      channel: selectedGuestForEdit.channel,
                    })
                  }
                  className="min-h-[200px] mt-2"
                  placeholder={`Écrivez votre message pour ${selectedGuestForEdit.name}...`}
                />
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      applyTemplate(selectedGuestForEdit.id!, "casual")
                    }
                  >
                    Template informel
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      applyTemplate(selectedGuestForEdit.id!, "formal")
                    }
                  >
                    Template formel
                  </Button>
                  {selectedGuestForEdit.channel === "whatsapp" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        applyTemplate(selectedGuestForEdit.id!, "reminder")
                      }
                    >
                      Template rappel
                    </Button>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowPersonalizationDialog(false)}
                >
                  Fermer
                </Button>
                <Button onClick={() => setShowPersonalizationDialog(false)}>
                  Sauvegarder
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

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

      {/* Modal de sélection d'événement */}
      <Dialog open={showEventModal} onOpenChange={setShowEventModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Sélectionner un événement</DialogTitle>
            <DialogDescription>
              Choisissez l'événement associé à cet envoi
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="event-select">Événement *</Label>
              <Select
                value={selectedEventId}
                onValueChange={setSelectedEventId}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Sélectionner un événement" />
                </SelectTrigger>
                <SelectContent>
                  {(templateId
                    ? events.filter((e: any) => e.template_id === templateId)
                    : events
                  ).map((event: any) => (
                    <SelectItem key={event.id} value={event.id.toString()}>
                      {event.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowEventModal(false)}
              >
                Annuler
              </Button>
              <Button
                onClick={handleSendBulkWithEvent}
                disabled={!selectedEventId}
                className="bg-green-600 hover:bg-green-700"
              >
                Continuer l'envoi
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Navigation */}
      <div className="flex justify-between gap-4">
        <Button variant="outline" onClick={() => setStep(1)}>
          ← Retour Gestion invités
        </Button>
        <Button variant="outline" onClick={() => setStep(0)}>
          Accueil
        </Button>
      </div>
    </div>
  );
}
