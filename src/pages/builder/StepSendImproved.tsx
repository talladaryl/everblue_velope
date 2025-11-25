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
} from "lucide-react";
import { useSaveTemplate } from "@/hooks/useSaveTemplate";
import { useSendMailing } from "@/hooks/useSendMailing";
import { toast } from "@/components/ui/sonner";

interface StepSendProps {
  ctx: any;
}

export default function StepSendImproved({ ctx }: StepSendProps) {
  const {
    guests = [],
    setStep,
    items = [],
    bgColor = "#ffffff",
  } = ctx;

  const { saving, saveTemplate } = useSaveTemplate();
  const { sending, sendMailing } = useSendMailing();

  const [templateTitle, setTemplateTitle] = useState("Mon invitation");
  const [templateDescription, setTemplateDescription] = useState("");
  const [emailSubject, setEmailSubject] = useState("Vous êtes invité!");
  const [customMessage, setCustomMessage] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  // Valider les données
  const validGuests = Array.isArray(guests) ? guests.filter((g: any) => g && g.valid) : [];
  const canSend = validGuests.length > 0;

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
        title: templateTitle,
        description: templateDescription,
        content: JSON.stringify(items),
        html: generateCardHTML(),
        variables: extractVariables(),
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

  // Envoyer les emails
  const handleSendEmails = async () => {
    if (!canSend) {
      toast.error("Aucun invité valide à qui envoyer");
      return;
    }

    if (!emailSubject.trim()) {
      toast.error("Veuillez entrer un sujet pour l'email");
      return;
    }

    try {
      const recipients = validGuests.map((guest: any) => ({
        email: guest.email,
        name: guest.name,
        variables: {
          nom: guest.name,
          email: guest.email,
          lieu: guest.location || "",
          date: guest.date || "",
          heure: guest.time || "",
        },
      }));

      await sendMailing({
        subject: emailSubject,
        content: customMessage || "Vous êtes invité!",
        html: generateCardHTML(),
        recipients: recipients,
      });

      setSentSuccess(true);
      setTimeout(() => setSentSuccess(false), 3000);
    } catch (error) {
      console.error("Erreur envoi:", error);
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
            Aucun invité valide trouvé pour la personnalisation. Veuillez vérifier les emails de vos invités.
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
              <p className="text-sm text-gray-600">Statut</p>
              <Badge className="mt-2">Prêt à envoyer</Badge>
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
            <Label htmlFor="template-title">Titre du template</Label>
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

      {/* Envoyer les emails */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Envoyer les invitations
          </CardTitle>
          <CardDescription>
            Envoyez les invitations à tous les invités valides
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sentSuccess && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Invitations envoyées avec succès!
              </AlertDescription>
            </Alert>
          )}

          {!canSend && (
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Aucun invité valide. Veuillez ajouter des invités avec des
                emails valides.
              </AlertDescription>
            </Alert>
          )}

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

          <div>
            <Label htmlFor="custom-message">Message personnalisé (optionnel)</Label>
            <Textarea
              id="custom-message"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Ajoutez un message personnel à la carte..."
              className="mt-2"
              rows={4}
            />
          </div>

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

          <Button
            onClick={handleSendEmails}
            disabled={sending || !canSend}
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
                {validGuests.length > 1 ? "s" : ""}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Aperçu du contenu */}
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
