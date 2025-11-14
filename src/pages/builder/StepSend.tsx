import React from "react";
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
import { Save } from "lucide-react";

export default function StepSend({ ctx }: { ctx: any }) {
  const {
    sendMode,
    setSendMode,
    guests,
    setStep,
    handleSaveAndGoHome,
    validCount,
  } = ctx;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-enter">
      <Card>
        <CardHeader>
          <CardTitle>Envoi des invitations</CardTitle>
          <CardDescription>
            Configurez l'envoi de vos invitations personnalisées
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label className="text-base">Mode d'envoi</Label>
            <RadioGroup
              value={sendMode}
              onValueChange={(v: any) => setSendMode(v)}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all" className="cursor-pointer">
                  Envoyer à tous
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="personalize" id="personalize" />
                <Label htmlFor="personalize" className="cursor-pointer">
                  Personnaliser par invité
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Save className="h-5 w-5" />
                  Sauvegarder le modèle
                </CardTitle>
                <CardDescription>
                  Enregistrez ce design pour le réutiliser plus tard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/50">
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-1">
                      Sauvegarder ce design comme modèle
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Ce modèle sera disponible dans votre galerie
                    </p>
                  </div>
                  <Button
                    onClick={handleSaveAndGoHome}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <Save className="h-4 w-4" /> Sauvegarder et aller à
                    l'accueil
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setStep(2)}>
              ← Retour
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                /* test send */ alert("Email de test envoyé");
              }}
            >
              Envoyer un test
            </Button>
            <Button
              onClick={() => {
                alert(`Invitations envoyées (${validCount})`);
              }}
            >
              Envoyer maintenant
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
