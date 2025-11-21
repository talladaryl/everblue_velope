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
} from "lucide-react";

// Sous-composants
import { EditCard } from "./design-steps/EditCard";
import { EditEnvelope } from "./design-steps/EditEnvelope";

export default function StepDesign({ ctx }: { ctx: any }) {
  const [currentSubStep, setCurrentSubStep] = useState<"card" | "envelope">(
    "card"
  );
  const { setStep } = ctx;

  // expose setSubStep so child can switch sub-step via ctx.setSubStep(...)
  const enhancedCtx = {
    ...ctx,
    setSubStep: (s: "card" | "envelope") => setCurrentSubStep(s),
  };

  // Error boundary to avoid full white screen and surface runtime errors
  class ErrorBoundary extends React.Component<
    any,
    { hasError: boolean; error?: any }
  > {
    constructor(props: any) {
      super(props);
      this.state = { hasError: false, error: undefined };
    }
    static getDerivedStateFromError(error: any) {
      return { hasError: true, error };
    }
    componentDidCatch(error: any, info: any) {
      // log to console / telemetry
      console.error("StepDesign sub-step error:", error, info);
    }
    render() {
      if (this.state.hasError) {
        return (
          <div className="p-4 bg-destructive/5 rounded">
            <div className="font-medium text-destructive">
              Erreur dans l'éditeur
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              Une erreur est survenue lors du rendu de cette section de
              l'éditeur.
            </div>
          </div>
        );
      }
      return this.props.children;
    }
  }

  const renderSubStep = () => {
    switch (currentSubStep) {
      case "card":
        return <EditCard ctx={enhancedCtx} />;
      case "envelope":
        return <EditEnvelope ctx={enhancedCtx} />;
      default:
        return <EditCard ctx={enhancedCtx} />;
    }
  };

  const getNextStep = () => {
    switch (currentSubStep) {
      case "card":
        return "envelope";
      case "envelope":
        return "card";
    }
  };

  const getPrevStep = () => {
    switch (currentSubStep) {
      case "card":
        return "card";
      case "envelope":
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

      {/* Contenu de l'étape (protégé par ErrorBoundary pour éviter page blanche) */}
      <ErrorBoundary>{renderSubStep()}</ErrorBoundary>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentSubStep(getPrevStep())}
          disabled={currentSubStep === "card"}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Précédent
        </Button>

        {currentSubStep !== "envelope" ? (
          <Button
            onClick={() => setCurrentSubStep(getNextStep())}
            className="flex items-center gap-2"
          >
            Suivant
            <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Sauvegarder
            </Button>
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
    </div>
  );
}
