// Nouveau fichier: StepDesign.tsx
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Palette,
  Eye,
  ArrowLeft,
  ArrowRight,
  Save,
  Download,
  CheckCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SaveTemplateModal } from "@/components/SaveTemplateModal";
import { useSaveTemplate } from "@/hooks/useSaveTemplate";
import { toast } from "@/components/ui/sonner";

// Sous-composants
import { EditCard } from "./design-steps/EditCard";
import { EditEnvelope } from "./design-steps/EditEnvelope";

export default function StepDesign({ ctx }: { ctx: any }) {
  const [currentSubStep, setCurrentSubStep] = useState<"card" | "envelope">(
    "card"
  );
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const { saving, saveTemplate } = useSaveTemplate();
  const { setStep, items = [], bgColor = "#ffffff" } = ctx;

  // expose setSubStep so child can switch sub-step via ctx.setSubStep(...)
  const enhancedCtx = {
    ...ctx,
    setSubStep: (s: "card" | "envelope") => setCurrentSubStep(s),
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

  // Gérer la sauvegarde du template
  const handleSaveTemplate = async (payload: any) => {
    try {
      await saveTemplate({
        name: payload.name,
        category: payload.category,
        structure: {
          items,
          bgColor,
          description: payload.description,
          variables: extractVariables(),
        },
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (error) {
      console.error("Erreur sauvegarde:", error);
    }
  };

  const renderSubStep = () => {
    try {
      switch (currentSubStep) {
        case "card":
          return <EditCard ctx={enhancedCtx} />;
        case "envelope":
          return <EditEnvelope ctx={enhancedCtx} />;
        default:
          return <EditCard ctx={enhancedCtx} />;
      }
    } catch (error) {
      console.error("Erreur lors du rendu du sous-composant:", error);
      return (
        <div className="p-4 bg-red-50 rounded border border-red-200">
          <div className="font-medium text-red-900">Erreur dans l'éditeur</div>
          <div className="text-sm text-red-700 mt-2">
            Une erreur est survenue lors du rendu de cette section de l'éditeur.
          </div>
        </div>
      );
    }
  };

  const getNextStep = (): "card" | "envelope" => {
    switch (currentSubStep) {
      case "card":
        return "envelope";
      case "envelope":
        return "card";
      default:
        return "card";
    }
  };

  const getPrevStep = (): "card" | "envelope" => {
    switch (currentSubStep) {
      case "card":
        return "card";
      case "envelope":
        return "card";
      default:
        return "card";
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête de navigation - Version améliorée */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Palette className="h-6 w-6 text-blue-600" />
            Création de l'invitation
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Personnalisez votre carte et votre enveloppe
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => setStep(2)}
          className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300 transition-all"
        >
          <Eye className="h-4 w-4" />
          Prévisualiser
        </Button>
      </div>

      {/* Navigation par étapes - Version simplifiée et élégante */}
      <div className="relative">
        {/* Ligne de progression */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{
              width: currentSubStep === "card" ? "50%" : "100%",
            }}
          />
        </div>

        {/* Étapes cliquables */}
        <div className="relative flex justify-between">
          {/* Étape 1: Carte */}
          <button
            onClick={() => setCurrentSubStep("card")}
            className={`group flex flex-col items-center gap-2 transition-all ${
              currentSubStep === "card"
                ? "scale-105"
                : "hover:scale-105 opacity-70 hover:opacity-100"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                currentSubStep === "card"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/50"
                  : "bg-white border-2 border-gray-300 text-gray-600 group-hover:border-blue-400 group-hover:text-blue-600"
              }`}
            >
              1
            </div>
            <span
              className={`text-sm font-medium transition-all ${
                currentSubStep === "card"
                  ? "text-blue-600"
                  : "text-gray-600 group-hover:text-blue-600"
              }`}
            >
              Modifier la carte
            </span>
          </button>

          {/* Étape 2: Enveloppe */}
          <button
            onClick={() => setCurrentSubStep("envelope")}
            className={`group flex flex-col items-center gap-2 transition-all ${
              currentSubStep === "envelope"
                ? "scale-105"
                : "hover:scale-105 opacity-70 hover:opacity-100"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                currentSubStep === "envelope"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/50"
                  : "bg-white border-2 border-gray-300 text-gray-600 group-hover:border-blue-400 group-hover:text-blue-600"
              }`}
            >
              2
            </div>
            <span
              className={`text-sm font-medium transition-all ${
                currentSubStep === "envelope"
                  ? "text-blue-600"
                  : "text-gray-600 group-hover:text-blue-600"
              }`}
            >
              Personnaliser l'enveloppe
            </span>
          </button>
        </div>
      </div>

      {/* Contenu de l'étape */}
      <div>{renderSubStep()}</div>

      {/* Section Sauvegarder le template - Affichée sous la workspace */}
      {currentSubStep === "envelope" && (
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Save className="h-5 w-5 text-blue-600" />
              Sauvegarder ce design
            </CardTitle>
            <CardDescription>
              Conservez ce template pour une utilisation future
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border border-blue-100">
                <p className="text-sm font-medium text-gray-700 mb-2">Éléments</p>
                <p className="text-2xl font-bold text-blue-600">{items.length}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-blue-100">
                <p className="text-sm font-medium text-gray-700 mb-2">Variables</p>
                <p className="text-2xl font-bold text-purple-600">{extractVariables().length}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-blue-100">
                <p className="text-sm font-medium text-gray-700 mb-2">Statut</p>
                <p className="text-sm font-semibold text-green-600">Prêt à sauvegarder</p>
              </div>
            </div>

            <Button
              onClick={() => setShowSaveModal(true)}
              disabled={saving || items.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 gap-2"
            >
              <Save className="h-4 w-4" />
              {saving ? "Sauvegarde en cours..." : "Sauvegarder le template"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => {
            const prev = getPrevStep();
            setCurrentSubStep(prev);
          }}
          disabled={currentSubStep === "card"}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Précédent
        </Button>

        {currentSubStep !== "envelope" ? (
          <Button
            onClick={() => {
              const next = getNextStep();
              setCurrentSubStep(next);
            }}
            className="flex items-center gap-2"
          >
            Suivant
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exporter
            </Button>
            <Button onClick={() => setStep(2)}>
              Continuer vers les détails
            </Button>
          </div>
        )}
      </div>

      {/* Modal de sauvegarde */}
      <SaveTemplateModal
        open={showSaveModal}
        onOpenChange={setShowSaveModal}
        onSave={handleSaveTemplate}
        loading={saving}
        structure={{
          items,
          bgColor,
          variables: extractVariables(),
        }}
      />
    </div>
  );
}
