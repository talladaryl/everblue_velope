import { useState, useEffect } from "react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Save,
  Send,
  Mail,
  CheckCircle,
  AlertCircle,
  Loader2,
  MessageSquare,
  Smartphone,
  Users,
  User,
  Settings,
  Edit2,
  ChevronDown,
  ChevronUp,
  Eye,
  Smartphone as PhoneIcon,
  Mail as MailIcon,
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
import {
  SendStatusModal,
  type MessageStatus,
} from "@/components/SendStatusModal";
import { toast } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generateModelHTML } from "@/utils/modelGenerator";

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

// Import des composants de prévisualisation des modèles
import {
  PreviewModel1,
  PreviewModel2,
  PreviewModel3,
  PreviewModel4,
  PreviewModel5,
  PreviewModel6,
  PreviewModel7,
  PreviewModel8,
  PreviewModel9,
  PreviewModel10,
  PreviewModel11,
  PreviewModel12,
} from "./modelPreviews";

export default function StepSendImproved({ ctx }: StepSendProps) {
  const {
    guests = [],
    setStep,
    items = [],
    bgColor = "#ffffff",
    bgImage,
    templateId,
    selectedModelId = "default",
    modelHTML = "",
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

  const [templateTitle, setTemplateTitle] = useState("Mon invitation");
  const [templateDescription, setTemplateDescription] = useState("");
  const [emailSubject, setEmailSubject] = useState("Vous êtes invité!");
  const [customMessage, setCustomMessage] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [sendMethod, setSendMethod] = useState<
    "email" | "sms" | "mms" | "whatsapp"
  >("email");
  const [showStatusModal, setShowStatusModal] = useState(false);
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
  const [expandedGuests, setExpandedGuests] = useState<Record<string, boolean>>(
    {}
  );
  const [selectedEventId, setSelectedEventId] = useState<string>("new");
  const [previewContent, setPreviewContent] = useState<string>("");

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

  // Générer l'aperçu du contenu
  useEffect(() => {
    const generatePreview = () => {
      if (sendMode === "group") {
        // Pour l'envoi groupé
        if (groupMessage.channel === "email") {
          // Générer l'HTML du modèle pour l'email
          const previewGuest = validGuests[0] || {};
          const html = generateModelHTML(
            selectedModelId || "default",
            items,
            bgColor,
            previewGuest
          );
          return html;
        } else {
          // Pour WhatsApp, afficher le texte brut
          return `
            <div style="font-family: system-ui, -apple-system, sans-serif; padding: 20px; background: #f0f2f5; min-height: 200px;">
              <div style="max-width: 400px; margin: 0 auto; background: white; border-radius: 12px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                  <div style="width: 40px; height: 40px; background: #25D366; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <span style="color: white; font-weight: bold;">W</span>
                  </div>
                  <div>
                    <div style="font-weight: 600; color: #333;">WhatsApp Message</div>
                    <div style="font-size: 12px; color: #666;">À envoyer à ${
                      validGuests.filter((g) => g.channel === "whatsapp").length
                    } contacts</div>
                  </div>
                </div>
                <div style="background: #f0f2f5; padding: 12px; border-radius: 8px; font-size: 14px; line-height: 1.5; white-space: pre-wrap;">
                  ${groupMessage.whatsapp.replace(/\n/g, "<br>")}
                </div>
                <div style="margin-top: 16px; font-size: 12px; color: #666; text-align: center;">
                  Ce message sera envoyé via WhatsApp
                </div>
              </div>
            </div>
          `;
        }
      } else {
        // Pour l'envoi personnalisé, montrer un exemple
        const customizedGuests = validGuests.filter(
          (g) => personalizedMessages[g.id!]?.customized
        );
        if (customizedGuests.length > 0) {
          const firstCustomized = customizedGuests[0];
          const message =
            personalizedMessages[firstCustomized.id!]?.message || "";

          if (sendMethod === "email") {
            const html = generateModelHTML(
              selectedModelId || "default",
              items,
              bgColor,
              firstCustomized
            );
            return html;
          } else {
            return `
              <div style="font-family: system-ui, -apple-system, sans-serif; padding: 20px; background: #f0f2f5; min-height: 200px;">
                <div style="max-width: 400px; margin: 0 auto; background: white; border-radius: 12px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                    <div style="width: 40px; height: 40px; background: #25D366; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                      <span style="color: white; font-weight: bold;">${
                        firstCustomized.name?.charAt(0) || "?"
                      }</span>
                    </div>
                    <div>
                      <div style="font-weight: 600; color: #333;">Message personnalisé</div>
                      <div style="font-size: 12px; color: #666;">Pour ${
                        firstCustomized.name
                      }</div>
                    </div>
                  </div>
                  <div style="background: #f0f2f5; padding: 12px; border-radius: 8px; font-size: 14px; line-height: 1.5; white-space: pre-wrap;">
                    ${message.replace(/\n/g, "<br>")}
                  </div>
                  <div style="margin-top: 16px; font-size: 12px; color: #666; text-align: center;">
                    ${customizedGuests.length} message${
              customizedGuests.length > 1 ? "s" : ""
            } personnalisé${customizedGuests.length > 1 ? "s" : ""} à envoyer
                  </div>
                </div>
              </div>
            `;
          }
        } else {
          return `
            <div style="font-family: system-ui, -apple-system, sans-serif; padding: 40px; text-align: center; color: #666; background: #f9fafb; border-radius: 12px;">
              <div style="font-size: 48px; margin-bottom: 16px;">📱</div>
              <div style="font-size: 16px; font-weight: 500; margin-bottom: 8px;">Aucun message personnalisé</div>
              <div style="font-size: 14px;">Activez la personnalisation pour voir l'aperçu</div>
            </div>
          `;
        }
      }
    };

    const preview = generatePreview();
    setPreviewContent(preview);
  }, [
    sendMode,
    groupMessage,
    selectedModelId,
    items,
    bgColor,
    validGuests,
    personalizedMessages,
    sendMethod,
  ]);

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

  // Générer l'HTML du modèle sélectionné
  const generateSelectedModelHTML = (): string => {
    if (modelHTML && modelHTML.trim() !== "") {
      return modelHTML;
    }

    // Si aucun modèle sélectionné, générer un modèle par défaut
    const defaultGuest = validGuests[0] || {};
    return generateModelHTML(
      selectedModelId || "default",
      items,
      bgColor,
      defaultGuest
    );
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

  // Valider les champs obligatoires
  const validateRequiredFields = (): { valid: boolean; error?: string } => {
    // Vérifier channel
    if (!sendMethod) {
      return { valid: false, error: "Veuillez sélectionner un canal d'envoi" };
    }

    // Vérifier subject (obligatoire pour tous les canaux)
    const subject =
      sendMode === "group" ? groupMessage.subject : "Vous êtes invité!";

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

  // Toggle l'expansion d'un invité
  const toggleGuestExpansion = (guestId: string) => {
    setExpandedGuests((prev) => ({
      ...prev,
      [guestId]: !prev[guestId],
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

  // Activer/désactiver la personnalisation pour un invité
  const togglePersonalization = (guestId: string, checked: boolean) => {
    const guest = guests?.find((g: any) => g.id === guestId);
    if (!guest) return;

    if (!checked) {
      const template = MESSAGE_TEMPLATES[guest.channel || "email"].casual;
      updatePersonalizedMessage(guestId, {
        message: template.replace("{name}", guest.name),
        customized: false,
      });
      setExpandedGuests((prev) => ({ ...prev, [guestId]: false }));
    } else {
      updatePersonalizedMessage(guestId, { customized: true });
      setExpandedGuests((prev) => ({ ...prev, [guestId]: true }));
    }
  };

const handleSendBulk = async () => {
  // Validation minimale
  if (!sendMethod) {
    toast.error("Sélectionnez un canal d'envoi");
    return;
  }

  if (validGuests.length === 0) {
    toast.error("Aucun invité valide");
    return;
  }

  console.log("🚀 Début envoi - Template URL:", window.location.href);

  try {
    // ========================================
    // 1. PAYLOAD MINIMAL SANS ERREUR
    // ========================================
    const payload: any = {
      channel: sendMethod,
      subject: "Vous êtes invité à notre événement",
      body: "Bonjour, vous êtes invité à notre événement. Voir les détails ci-dessous.",
    };

    // ========================================
    // 2. GÉNÉRER L'HTML DE LA CARD ANIMÉE
    // ========================================
    if (sendMethod === "email") {
      // Prendre un invité exemple
      const exampleGuest = validGuests[0] || {
        name: "Invité",
        email: "invite@example.com",
      };

      // Générer l'HTML exact de la card
      const cardHTML = generateModelHTML(
        selectedModelId || "default",
        items,
        bgColor,
        exampleGuest
      );

      payload.html = cardHTML;
      console.log("✅ HTML généré:", cardHTML.length, "caractères");
    }

    // ========================================
    // 3. AJOUTER LES DESTINATAIRES
    // ========================================
    if (sendMethod === "email") {
      payload.emails = validGuests
        .filter((guest: Guest) => guest.email && guest.email.includes("@"))
        .slice(0, 10) // Limiter à 10 pour tester
        .map((guest: Guest) => ({
          email: guest.email || "",
          name: guest.full_name || guest.name || "Invité",
        }));

      console.log("📧 Destinataires email:", payload.emails.length);
    } else if (sendMethod === "whatsapp") {
      payload.contacts = validGuests
        .filter(
          (guest: Guest) =>
            guest.phone && guest.phone.replace(/\D/g, "").length >= 10
        )
        .slice(0, 10)
        .map((guest: Guest) => ({
          phone: guest.phone || "",
          name: guest.full_name || guest.name || "Invité",
        }));

      console.log("📱 Destinataires WhatsApp:", payload.contacts.length);
    }

    // Vérifier qu'on a au moins 1 destinataire
    if (
      (sendMethod === "email" &&
        (!payload.emails || payload.emails.length === 0)) ||
      (sendMethod === "whatsapp" &&
        (!payload.contacts || payload.contacts.length === 0))
    ) {
      toast.error("Aucun destinataire valide");
      return;
    }

    // ========================================
    // 4. ENVOYER SIMPLEMENT
    // ========================================
    console.log("📤 Envoi payload minimal:", {
      channel: payload.channel,
      destinataires: payload.emails?.length || payload.contacts?.length || 0,
      hasHtml: !!payload.html,
    });

    const response = await sendBulk(payload);

    // Succès
    toast.success(
      `Message envoyé à ${
        payload.emails?.length || payload.contacts?.length || 0
      } personne(s)`
    );

    setTotalCount(response.total_recipients || 0);
    setSentCount(response.sent_count || 0);
    setFailedCount(response.failed_count || 0);
    setPendingCount(response.pending_count || 0);

    if (response.messages) {
      const converted = convertToMessageStatus(response.messages, sendMethod);
      setStatusMessages(converted);
    }

    setShowStatusModal(true);
  } catch (error: any) {
    console.error("❌ ERREUR FINALE:", error);

    // Afficher l'erreur exacte
    const errorMsg =
      error.response?.data?.message || error.message || "Erreur inconnue";

    toast.error(`Échec envoi: ${errorMsg}`);

    // Log détaillé
    if (error.response?.data) {
      console.error("📋 Détails erreur backend:", error.response.data);
    }
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

  // Fonction pour remplacer les variables dans les items
  const replaceVariablesInItems = (itemsList: any[], guestData: any) => {
    if (!itemsList || !guestData) return itemsList;

    return itemsList.map((item: any) => {
      if (item.type === "text" && item.text) {
        let text = item.text;
        text = text.replace(/\{\{name\}\}/g, guestData.name || "");
        text = text.replace(
          /\{\{first_name\}\}/g,
          guestData.name?.split(" ")[0] || ""
        );
        text = text.replace(/\{\{email\}\}/g, guestData.email || "");
        text = text.replace(/\{\{location\}\}/g, guestData.location || "");
        text = text.replace(/\{\{lieu\}\}/g, guestData.location || "");
        text = text.replace(/\{\{date\}\}/g, guestData.date || "");
        text = text.replace(/\{\{time\}\}/g, guestData.time || "");
        text = text.replace(/\{\{heure\}\}/g, guestData.time || "");
        return { ...item, text };
      }
      return item;
    });
  };

  // Fonction pour rendre le modèle de prévisualisation sélectionné
  const renderSelectedModelPreview = () => {
    const previewGuest = validGuests[0] || {
      name: "Invité",
      email: "email@example.com",
    };
    const processedItems = replaceVariablesInItems(items, previewGuest);

    const commonProps = {
      items: processedItems,
      bgColor: bgColor,
      bgImage: bgImage,
      onClose: () => {},
      guest: previewGuest,
    };

    switch (selectedModelId) {
      case "model1":
        return <PreviewModel1 {...commonProps} />;
      case "model2":
        return <PreviewModel2 {...commonProps} />;
      case "model3":
        return <PreviewModel3 {...commonProps} />;
      case "model4":
        return <PreviewModel4 {...commonProps} />;
      case "model5":
        return <PreviewModel5 {...commonProps} />;
      case "model6":
        return <PreviewModel6 {...commonProps} />;
      case "model7":
        return <PreviewModel7 {...commonProps} />;
      case "model8":
        return <PreviewModel8 {...commonProps} />;
      case "model9":
        return <PreviewModel9 {...commonProps} />;
      case "model10":
        return <PreviewModel10 {...commonProps} />;
      case "model11":
        return <PreviewModel11 {...commonProps} />;
      case "model12":
        return <PreviewModel12 {...commonProps} />;
      default:
        // Pour le modèle par défaut, afficher le HTML généré
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
                        <MessageSquare className="h-4 w-4" />
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
                    <Mail className="h-4 w-4" />
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

            {/* Envoi personnalisé - ÉDITION INLINE */}
            <TabsContent value="personalized" className="pt-4">
              <Alert>
                <User className="h-4 w-4" />
                <AlertTitle>Personnalisation par invité</AlertTitle>
                <AlertDescription>
                  Activez la personnalisation pour chaque invité, puis cliquez
                  sur la flèche pour éditer le message.
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
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Personnaliser tous les invités
                          guests.forEach((guest: Guest) => {
                            if (guest.valid) {
                              togglePersonalization(guest.id!, true);
                            }
                          });
                        }}
                      >
                        Personnaliser tous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Désactiver tous les invités
                          guests.forEach((guest: Guest) => {
                            if (guest.valid) {
                              togglePersonalization(guest.id!, false);
                            }
                          });
                        }}
                      >
                        Tout standard
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {validGuests.map((guest: Guest) => (
                      <div
                        key={guest.id}
                        className="border rounded-lg overflow-hidden hover:border-gray-400 transition-colors"
                      >
                        {/* En-tête de l'invité */}
                        <div className="p-4 bg-gray-50 flex items-center justify-between hover:bg-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 flex items-center justify-center text-blue-800 font-bold rounded-full">
                              {guest.name?.charAt(0) || "?"}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-gray-900">
                                  {guest.name}
                                </h4>
                                <Badge variant="outline" className="text-xs">
                                  {guest.channel === "whatsapp" ? (
                                    <MessageSquare className="h-3 w-3 mr-1" />
                                  ) : (
                                    <Mail className="h-3 w-3 mr-1" />
                                  )}
                                  {guest.channel}
                                </Badge>
                                {personalizedMessages[guest.id!]
                                  ?.customized && (
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

                          <div className="flex items-center gap-3">
                            <Switch
                              checked={
                                personalizedMessages[guest.id!]?.customized ||
                                false
                              }
                              onCheckedChange={(checked) =>
                                togglePersonalization(guest.id!, checked)
                              }
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleGuestExpansion(guest.id!)}
                              disabled={
                                !personalizedMessages[guest.id!]?.customized
                              }
                            >
                              {expandedGuests[guest.id!] ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* Zone d'édition du message (visible quand expandée ET personnalisée) */}
                        {expandedGuests[guest.id!] &&
                          personalizedMessages[guest.id!]?.customized && (
                            <div className="p-4 bg-white border-t">
                              <div className="space-y-4">
                                <div>
                                  <Label
                                    htmlFor={`subject-${guest.id}`}
                                    className="text-sm font-medium"
                                  >
                                    Sujet du message
                                  </Label>
                                  <Input
                                    id={`subject-${guest.id}`}
                                    value={
                                      personalizedMessages[guest.id!]
                                        ?.subject || "Vous êtes invité!"
                                    }
                                    onChange={(e) =>
                                      updatePersonalizedMessage(guest.id!, {
                                        subject: e.target.value,
                                      })
                                    }
                                    className="mt-1"
                                    placeholder="Sujet du message"
                                  />
                                </div>

                                <div>
                                  <div className="flex items-center justify-between mb-1">
                                    <Label
                                      htmlFor={`message-${guest.id}`}
                                      className="text-sm font-medium"
                                    >
                                      Message personnalisé pour {guest.name}
                                    </Label>
                                    <div className="flex gap-1">
                                      <Button
                                        size="xs"
                                        variant="ghost"
                                        onClick={() =>
                                          applyTemplate(guest.id!, "casual")
                                        }
                                      >
                                        Informel
                                      </Button>
                                      <Button
                                        size="xs"
                                        variant="ghost"
                                        onClick={() =>
                                          applyTemplate(guest.id!, "formal")
                                        }
                                      >
                                        Formel
                                      </Button>
                                      {guest.channel === "whatsapp" && (
                                        <Button
                                          size="xs"
                                          variant="ghost"
                                          onClick={() =>
                                            applyTemplate(guest.id!, "reminder")
                                          }
                                        >
                                          Rappel
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                  <Textarea
                                    id={`message-${guest.id}`}
                                    value={
                                      personalizedMessages[guest.id!]
                                        ?.message || ""
                                    }
                                    onChange={(e) =>
                                      updatePersonalizedMessage(guest.id!, {
                                        message: e.target.value,
                                        channel: guest.channel,
                                      })
                                    }
                                    className="min-h-[120px] mt-1"
                                    placeholder={`Écrivez votre message personnalisé pour ${guest.name}...`}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
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

      {/* Paramètres d'envoi - SELECT DIRECT POUR ÉVÉNEMENT */}
      <Card>
        <CardHeader>
          <CardTitle>Paramètres d'envoi</CardTitle>
          <CardDescription>
            Configurez les détails techniques de l'envoi
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="send-method">Canal technique d'envoi</Label>
              <Select
                value={sendMethod}
                onValueChange={(value: any) => setSendMethod(value)}
              >
                <SelectTrigger id="send-method" className="mt-2">
                  <SelectValue placeholder="Sélectionner un canal" />
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
                }}
                placeholder="Ex: Vous êtes invité à notre mariage!"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="event-id">Événement associé</Label>
              <Select
                value={selectedEventId}
                onValueChange={setSelectedEventId}
              >
                <SelectTrigger id="event-id" className="mt-2">
                  <SelectValue placeholder="Sélectionner un événement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Créer un nouvel événement</SelectItem>
                  <SelectItem value="1">Événement 1</SelectItem>
                  <SelectItem value="2">Événement 2</SelectItem>
                  <SelectItem value="3">Événement 3</SelectItem>
                </SelectContent>
              </Select>
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
        </CardContent>
      </Card>

      {/* APERÇU AMÉLIORÉ DU MESSAGE QUI SERA ENVOYÉ */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Aperçu du message
          </CardTitle>
          <CardDescription>
            Voici ce qui sera envoyé à vos invités
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* En-tête info */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                  {sendMode === "group" ? (
                    <Users className="h-5 w-5 text-blue-600" />
                  ) : (
                    <User className="h-5 w-5 text-purple-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {sendMode === "group"
                      ? "Envoi groupé"
                      : "Envoi personnalisé"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {sendMode === "group" ? (
                      groupMessage.channel === "email" ? (
                        <span className="flex items-center gap-1">
                          <MailIcon className="h-3 w-3" /> Email à {stats.email}{" "}
                          invités
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <PhoneIcon className="h-3 w-3" /> WhatsApp à{" "}
                          {stats.whatsapp} invités
                        </span>
                      )
                    ) : (
                      <span>
                        {stats.personalized} message
                        {stats.personalized !== 1 ? "s" : ""} personnalisé
                        {stats.personalized !== 1 ? "s" : ""}
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <Badge variant="outline" className="capitalize">
                {sendMethod === "email" ? (
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" /> Email
                  </span>
                ) : sendMethod === "whatsapp" ? (
                  <span className="flex items-center gap-1">
                    <Smartphone className="h-3 w-3" /> WhatsApp
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" /> MMS
                  </span>
                )}
              </Badge>
            </div>

            {/* Contenu de l'aperçu - APERÇU COMPLET DU MESSAGE */}
            <div className="relative">
              <div className="absolute -top-2 left-4 px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded z-10">
                APERÇU COMPLET{" "}
                {selectedModelId !== "default" &&
                  `- ${selectedModelId.toUpperCase()}`}
              </div>
              <div
                className="border-2 border-blue-200 rounded-lg overflow-hidden shadow-sm"
                style={{ backgroundColor: "transparent" }}
              >
                <div className="min-h-[450px] flex items-center justify-center">
                  {selectedModelId !== "default" ? (
                    // Afficher le modèle animé sélectionné - SANS conteneur blanc
                    <div
                      className="w-full flex items-center justify-center"
                      style={{ backgroundColor: "transparent" }}
                    >
                      {renderSelectedModelPreview()}
                    </div>
                  ) : (
                    // Afficher l'aperçu HTML par défaut
                    <ScrollArea className="h-[450px] w-full">
                      <div
                        className="p-4"
                        dangerouslySetInnerHTML={{ __html: previewContent }}
                      />
                    </ScrollArea>
                  )}
                </div>
              </div>
            </div>

            {/* Légende */}
            <div className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg">
              <p className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                {selectedModelId !== "default"
                  ? `Ce modèle de carte (${selectedModelId}) sera envoyé à vos invités avec les variables personnalisées`
                  : sendMode === "group"
                  ? groupMessage.channel === "email"
                    ? "Ce modèle d'invitation sera envoyé par email avec les variables remplacées"
                    : "Ce message texte sera envoyé par WhatsApp à tous les contacts"
                  : "Les messages seront personnalisés pour chaque invité selon vos paramètres"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bouton d'envoi DIRECT - PAS DE MODALE INTERMÉDIAIRE */}
      <Card>
        <CardHeader>
          <CardTitle>Action d'envoi</CardTitle>
          <CardDescription>Lancez l'envoi de vos invitations</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleSendBulk}
            disabled={sending || !canSend || maxRecipientsExceeded}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 py-6 text-lg"
          >
            {sending ? (
              <>
                <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="h-5 w-5 mr-3" />
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

          {maxRecipientsExceeded && (
            <Alert className="mt-4 bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Le nombre de destinataires dépasse 500. Veuillez réduire le
                nombre d'invités.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Modal de statut (seulement pour voir le progrès) */}
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
        <Button variant="outline" onClick={() => setStep(2)}>
          ← Retour Prévisualisation
        </Button>
        <Button variant="outline" onClick={() => setStep(0)}>
          Accueil
        </Button>
      </div>
    </div>
  );
}
