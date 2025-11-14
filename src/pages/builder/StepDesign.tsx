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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Palette,
  Eye,
  ArrowLeft,
  ArrowRight,
  Save,
  Download,
} from "lucide-react";

// Sous-composants
import { SelectDesign } from "./design-steps/SelectDesign";
import { EditCard } from "./design-steps/EditCard";
import { EditEnvelope } from "./design-steps/EditEnvelope";

export default function StepDesign({ ctx }: { ctx: any }) {
  const [currentSubStep, setCurrentSubStep] = useState<
    "select" | "card" | "envelope"
  >("select");
  const { setStep } = ctx;

  // expose setSubStep so child (SelectDesign) can switch sub-step via ctx.setSubStep(...)
  // ensure it's a function (pass setter) to avoid passing the current value by mistake
  const enhancedCtx = {
    ...ctx,
    setSubStep: (s: "select" | "card" | "envelope") => setCurrentSubStep(s),
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
                Une erreur est survenue lors du rendu de cette section de l'éditeur.
            </div>
          </div>
        );
      }
      return this.props.children;
    }
  }

  const renderSubStep = () => {
    switch (currentSubStep) {
      case "select":
        return (
          <SelectDesign
            ctx={enhancedCtx}
            onDesignSelected={() => setCurrentSubStep("card")}
          />
        );
      case "card":
        return <EditCard ctx={enhancedCtx} />;
      case "envelope":
        return <EditEnvelope ctx={enhancedCtx} />;
      default:
        return <SelectDesign ctx={enhancedCtx} />;
    }
  };

  const getNextStep = () => {
    switch (currentSubStep) {
      case "select":
        return "card";
      case "card":
        return "envelope";
      case "envelope":
        return "select";
    }
  };

  const getPrevStep = () => {
    switch (currentSubStep) {
      case "select":
        return "select";
      case "card":
        return "select";
      case "envelope":
        return "card";
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête de navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Création de l'invitation
              </CardTitle>
              <CardDescription>
                Étape 1: Personnalisez votre carte et votre enveloppe
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Prévisualiser
              </Button>
            </div>
          </div>

          {/* Barre de progression */}
          <div className="w-full bg-muted rounded-full h-2 mt-4">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{
                width:
                  currentSubStep === "select"
                    ? "33%"
                    : currentSubStep === "card"
                    ? "66%"
                    : "100%",
              }}
            />
          </div>

          {/* Indicateurs d'étapes - maintenant cliquables */}
          <div className="flex justify-between mt-2">
            <div
              role="button"
              tabIndex={0}
              onClick={() => setCurrentSubStep("select")}
              onKeyDown={(e) =>
                e.key === "Enter" && setCurrentSubStep("select")
              }
              className={`text-sm cursor-pointer ${
                currentSubStep === "select"
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              1. Choisir un design
            </div>
            <div
              role="button"
              tabIndex={0}
              onClick={() => setCurrentSubStep("card")}
              onKeyDown={(e) => e.key === "Enter" && setCurrentSubStep("card")}
              className={`text-sm cursor-pointer ${
                currentSubStep === "card"
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              2. Modifier la carte
            </div>
            <div
              role="button"
              tabIndex={0}
              onClick={() => setCurrentSubStep("envelope")}
              onKeyDown={(e) =>
                e.key === "Enter" && setCurrentSubStep("envelope")
              }
              className={`text-sm cursor-pointer ${
                currentSubStep === "envelope"
                  ? "text-primary font-semibold"
                  : "text-muted-foreground"
              }`}
            >
              3. Personnaliser l'enveloppe
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Contenu de l'étape (protégé par ErrorBoundary pour éviter page blanche) */}
      <ErrorBoundary>{renderSubStep()}</ErrorBoundary>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentSubStep(getPrevStep())}
          disabled={currentSubStep === "select"}
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
