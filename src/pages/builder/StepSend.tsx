import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Save,
  Send,
  Mail,
  Users,
  MessageSquare,
  ClipboardList,
  User,
  CheckCircle,
} from "lucide-react";
import axios from "axios";

// NOTE: Remplacement de 'alert' et 'confirm' par des messages console/modals factices
// En production, remplacez-les par des composants Modals (Dialog/Toast) de Shadcn UI

export default function StepSend({ ctx }: { ctx: any }) {
  const {
    sendMode,
    setSendMode,
    guests,
    setStep,
    validCount,
    currentTemplate,
    items,
    bgColor,
    bgImage,
  } = ctx;

  // État pour stocker les messages personnalisés par invité
  // Structure: { guestId: "message personnalisé", ... }
  const [personalizedMessages, setPersonalizedMessages] = useState<{
    [key: string]: string;
  }>({});
  const [testEmail, setTestEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // Filtrer les invités valides pour l'affichage (calculé ici pour être sûr)
  // Utilise guest.isValid ET guest.id pour s'assurer que l'on peut stocker l'état
  const validGuests = guests.filter((guest: any) => guest.isValid && guest.id);

  // Initialisation des messages personnalisés pour chaque invité valide
  useEffect(() => {
    const initialMessages: { [key: string]: string } = {};
    validGuests.forEach((guest: any) => {
      // Garder le message existant si possible, sinon initialiser à vide
      initialMessages[guest.id] = personalizedMessages[guest.id] || "";
    });
    setPersonalizedMessages(initialMessages);
  }, [guests.length]); // Dépend de la longueur de guests pour s'assurer que l'on réagit aux changements de la liste (éviter une boucle infinie si on dépend de guests entières)

  // Fonction pour mettre à jour un message individuel
  const handleMessageChange = (guestId: string, message: string) => {
    setPersonalizedMessages((prev) => ({
      ...prev,
      [guestId]: message,
    }));
  };

  // Fonction pour sauvegarder le modèle via API Laravel
  const handleSaveTemplate = async () => {
    if (!currentTemplate) {
      console.warn("Aucun modèle à sauvegarder");
      return;
    }

    setIsSaving(true);
    try {
      const templateData = {
        name: currentTemplate.name || "Mon design personnalisé",
        description:
          currentTemplate.description || "Design créé avec l'éditeur",
        category: currentTemplate.category || "custom",
        colors: currentTemplate.colors || ["#000000", "#ffffff"],
        preview: currentTemplate.preview || "custom",
        bgColor: bgColor,
        bgImage: bgImage,
        items: items,
        envelope: currentTemplate.envelope,
        isCustom: true,
        hasEnvelope: !!currentTemplate.envelope,
        // Sauvegarde le mode d'envoi choisi
        sendMode: sendMode,
      };

      const response = await axios.post("/templates/save", templateData, {
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      if (response.data.success) {
        console.log("Modèle sauvegardé avec succès !");
        // Rediriger vers la homepage (à adapter à votre routing)
        // window.location.href = "/";
      } else {
        throw new Error(
          response.data.message || "Erreur lors de la sauvegarde"
        );
      }
    } catch (error) {
      console.error("Erreur sauvegarde:", error);
      console.error("Erreur lors de la sauvegarde du modèle");
    } finally {
      setIsSaving(false);
    }
  };

  // Fonction pour envoyer un email de test
  const handleSendTestEmail = async () => {
    if (!testEmail) {
      console.warn("Veuillez entrer une adresse email pour le test");
      return;
    }

    setIsSending(true);
    try {
      const emailData = {
        to: testEmail,
        template: currentTemplate,
        items: items,
        bgColor: bgColor,
        bgImage: bgImage,
        // Pour un test, on prend un message générique ou le premier message personnalisé trouvé
        personalizedMessage:
          sendMode === "personalize"
            ? Object.values(personalizedMessages)[0] || ""
            : null,
        isTest: true,
      };

      const response = await axios.post("/emails/send-test", emailData, {
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      if (response.data.success) {
        console.log("Email de test envoyé avec succès !");
      } else {
        throw new Error(response.data.message || "Erreur lors de l'envoi");
      }
    } catch (error) {
      console.error("Erreur envoi test:", error);
      console.error("Erreur lors de l'envoi de l'email de test");
    } finally {
      setIsSending(false);
    }
  };

  // Fonction pour envoyer les invitations à tous les invités
  const handleSendAllEmails = async () => {
    if (validCount === 0) {
      console.warn("Aucun invité valide à qui envoyer les invitations");
      return;
    }

    // Remplacer par un Dialog/Modal
    const confirmation = window.confirm(
      `Confirmez-vous l'envoi de ${validCount} invitation(s) ?`
    );
    if (!confirmation) {
      return;
    }

    setIsSending(true);
    try {
      // Préparation de la liste des invités avec leur message personnalisé
      const guestsToSend = guests
        .filter((guest: any) => guest.email && guest.isValid)
        .map((guest: any) => ({
          ...guest,
          // Ajout du message personnalisé pour cet invité
          personalizedMessage:
            sendMode === "personalize"
              ? personalizedMessages[guest.id] || ""
              : null,
        }));

      const emailData = {
        guests: guestsToSend, // La liste enrichie
        template: currentTemplate,
        items: items,
        bgColor: bgColor,
        bgImage: bgImage,
        sendMode: sendMode,
      };

      const response = await axios.post("/emails/send-all", emailData, {
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      if (response.data.success) {
        console.log(
          `${response.data.sentCount} invitation(s) envoyée(s) avec succès !`
        );
      } else {
        throw new Error(response.data.message || "Erreur lors de l'envoi");
      }
    } catch (error) {
      console.error("Erreur envoi:", error);
      console.error("Erreur lors de l'envoi des invitations");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-enter">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-6 w-6 text-blue-600" />
            Envoi et personnalisation
          </CardTitle>
          <CardDescription>
            Configurez le mode d'envoi et personnalisez vos messages.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Mode d'envoi */}
          <div className="space-y-4 border-b pb-4">
            <Label className="text-base font-semibold flex items-center gap-2">
              <ClipboardList className="h-4 w-4" /> Mode d'envoi
            </Label>
            <RadioGroup
              value={sendMode}
              onValueChange={(v: any) => setSendMode(v)}
              className="flex flex-col sm:flex-row gap-6"
            >
              <div className="flex items-start space-x-2 p-3 border rounded-lg hover:bg-gray-50 transition">
                <RadioGroupItem value="all" id="all" className="mt-1" />
                <Label htmlFor="all" className="cursor-pointer font-medium">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Envoyer à tous (Générique)
                  </div>
                  <p className="text-sm text-muted-foreground font-normal mt-1">
                    Un seul message pour tous les {validCount} invités valides.
                  </p>
                </Label>
              </div>
              <div className="flex items-start space-x-2 p-3 border rounded-lg hover:bg-gray-50 transition">
                <RadioGroupItem
                  value="personalize"
                  id="personalize"
                  className="mt-1"
                />
                <Label
                  htmlFor="personalize"
                  className="cursor-pointer font-medium"
                >
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Personnaliser par invité
                  </div>
                  <p className="text-sm text-muted-foreground font-normal mt-1">
                    Un champ de message individuel pour chaque invité.
                  </p>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Section message personnalisé par invité */}
          {sendMode === "personalize" && (
            <div className="space-y-4 p-4 border rounded-xl bg-indigo-50/50">
              <h3 className="text-xl font-bold flex items-center gap-2 text-indigo-700">
                <MessageSquare className="h-6 w-6" />
                Personnalisation ({validCount} invités)
              </h3>
              <p className="text-sm text-muted-foreground pb-2">
                Écrivez un message unique pour chaque invité valide. Laissez
                vide pour ne pas inclure de message pour cette personne.
              </p>
              <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
                {/* *** LA VÉRIFICATION DU TABLEAU EST ICI *** */}
                {validGuests.length > 0 ? (
                  validGuests.map((guest: any, index: number) => (
                    <Card
                      key={guest.id}
                      className="shadow-sm border-indigo-200"
                    >
                      <CardHeader className="py-3 px-4 bg-indigo-100 rounded-t-lg">
                        <CardTitle className="text-base flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {guest.full_name || `Invité ${index + 1}`}
                          </span>
                          <span className="text-sm font-normal text-indigo-600">
                            {guest.email}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4 pb-2">
                        <Textarea
                          placeholder={`Message pour ${
                            guest.full_name || "cet invité"
                          }... (Max 500 chars)`}
                          value={personalizedMessages[guest.id] || ""}
                          onChange={(e) =>
                            handleMessageChange(guest.id, e.target.value)
                          }
                          maxLength={500}
                          className="min-h-[80px] resize-none"
                        />
                        <div className="text-right text-xs text-muted-foreground mt-1">
                          {(personalizedMessages[guest.id] || "").length}
                          /500
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-center text-sm text-red-500 p-4 border rounded-lg bg-red-50">
                    Aucun invité valide trouvé pour la personnalisation.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Sauvegarde du modèle */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Save className="h-5 w-5" />
                Sauvegarder le modèle
              </CardTitle>
              <CardDescription>
                Enregistrez ce design pour le réutiliser plus tard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-center gap-3 p-4 border rounded-lg bg-muted/50">
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">
                    Sauvegarder ce design comme modèle
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Ce modèle sera disponible dans votre galerie personnelle.
                  </p>
                </div>
                <Button
                  onClick={handleSaveTemplate}
                  disabled={isSaving}
                  className="w-full sm:w-auto flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  {isSaving ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {isSaving ? "Sauvegarde..." : "Sauvegarder"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Envoi de Test */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email de Test
              </CardTitle>
              <CardDescription>
                Envoyez un aperçu de l'invitation à votre propre adresse email.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="votre.email.test@exemple.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendTestEmail}
                  disabled={isSending || !testEmail}
                  variant="secondary"
                  className="w-full sm:w-auto flex items-center gap-2"
                >
                  {isSending ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {isSending ? "Envoi..." : "Envoyer Test"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Navigation et actions finales */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setStep(2)}>
              ← Retour aux invités
            </Button>

            <div className="flex-1" />

            <Button
              onClick={handleSendAllEmails}
              disabled={validCount === 0 || isSending}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              {isSending ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {isSending
                ? "Envoi en cours..."
                : `Envoyer ${validCount} invitation(s)`}
            </Button>
          </div>

          {/* Résumé */}
          <div className="text-center text-sm text-muted-foreground pt-4">
            <p className="flex items-center justify-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              **{validCount}** invité(s) valide(s) prêt(s) à recevoir
              l'invitation.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
