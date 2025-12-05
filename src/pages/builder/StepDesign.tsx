import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette, Eye, ArrowLeft, ArrowRight, Download } from "lucide-react";

// Sous-composants
import  { EditCard }  from "./design-steps/EditCard";
// import { EditEnvelope } from "./design-steps/EditEnvelope";

export default function StepDesign({ ctx }: { ctx: any }) {
  const [currentSubStep, setCurrentSubStep] = useState<"card" | "envelope">(
    "card"
  );
  const { setStep, items = [], bgColor = "#ffffff" } = ctx;

  // Extraire les variables du contenu
  const extractVariables = (): string[] => {
    const variables = new Set<string>();
    const regex = /{{(\w+)}}/g;

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

  const renderSubStep = () => {
    try {
      switch (currentSubStep) {
        case "card":
          return <EditCard ctx={ctx} />;
        // case "envelope":
        //   return <EditEnvelope ctx={ctx} />;
        default:
          return <EditCard ctx={ctx} />;
      }
    } catch (error) {
      console.error("Erreur lors du rendu du sous-composant:", error);
      return (
        <div className="p-4 bg-red-50 rounded border border-red-200">
          {" "}
          <div className="font-medium text-red-900">
            Erreur dans l'éditeur
          </div>{" "}
          <div className="text-sm text-red-700 mt-2">
            Une erreur est survenue lors du rendu de cette section de l'éditeur.{" "}
          </div>{" "}
        </div>
      );
    }
  };

  const getNextStep = (): "card" | "envelope" =>
    currentSubStep === "card" ? "envelope" : "card";
  const getPrevStep = (): "card" | "envelope" =>
    currentSubStep === "envelope" ? "card" : "card";

  return (
    <div className="space-y-6">
      {/* En-tête de navigation */}{" "}
      <div className="flex items-center justify-between mb-6">
        {" "}
        <div>
          {" "}
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            {" "}
            <Palette className="h-6 w-6 text-blue-600" />
            Création de l'invitation{" "}
          </h2>{" "}
          <p className="text-sm text-gray-600 mt-1">
            Personnalisez votre carte et votre enveloppe{" "}
          </p>{" "}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setStep(2)}
            className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300 transition-all"
          >
            <Eye className="h-4 w-4" />
            Prévisualiser
          </Button>
        </div>
      </div>
      {/* Navigation par étapes */}
      <div className="relative">
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{
              width: currentSubStep === "card" ? "50%" : "100%",
            }}
          />
        </div>

        <div className="relative flex justify-between">
          {/* <button
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
          </button> */}

          {/* <button
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
          </button> */}
        </div>
      </div>
      {/* Contenu de l'étape */}
      <div>{renderSubStep()}</div>
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
              <Download className="h-4 w-4" />
              Exporter
            </Button>
            <Button onClick={() => setStep(1)}>
              Continuer vers les détails
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
