import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Users } from "lucide-react";
import { GuestManager } from "@/components/GuestManager";

export default function StepDetails({ ctx }: { ctx: any }) {
  const {
    guests,
    setGuests,
    setStep,
    previewGuestId,
    setPreviewGuestId,
  } = ctx;

  const validCount = guests.filter((g: any) => g.valid).length;

  const handleContinue = () => {
    if (guests.length && !previewGuestId) {
      setPreviewGuestId(guests[0].id);
    }
    setStep(2);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-enter">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            Gestion des invités
          </h2>
          <p className="text-gray-600 mt-2">
            Importez vos contacts ou ajoutez-les manuellement
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-3xl font-bold text-gray-900">{guests.length}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Valides</p>
            <p className={`text-3xl font-bold ${validCount > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {validCount}
            </p>
          </div>
        </div>
      </div>

      {/* Alertes */}
      {guests.length === 0 && (
        <Alert className="bg-blue-50 border-blue-200">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            Commencez par ajouter des invités ou importer un fichier CSV pour continuer.
          </AlertDescription>
        </Alert>
      )}

      {guests.length > 0 && validCount === 0 && (
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Aucun invité valide. Veuillez corriger les emails invalides.
          </AlertDescription>
        </Alert>
      )}

      {validCount > 0 && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {validCount} invité{validCount > 1 ? 's' : ''} prêt{validCount > 1 ? 's' : ''} à recevoir l'invitation.
          </AlertDescription>
        </Alert>
      )}

      {/* Gestionnaire d'invités */}
      <GuestManager guests={guests} onGuestsChange={setGuests} />

      {/* Navigation */}
      <div className="flex justify-between gap-4 pt-6 border-t">
        <Button variant="outline" onClick={() => setStep(0)} className="px-6">
          ← Retour au design
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!guests.length || validCount === 0}
          className="px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        >
          Continuer vers la prévisualisation →
        </Button>
      </div>
    </div>
  );
}
