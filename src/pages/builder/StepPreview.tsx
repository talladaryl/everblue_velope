import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import EnvelopePreview from "@/pages/EnvelopePreview";
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

export default function StepPreview({ ctx }: { ctx: any }) {
  const {
    guests,
    previewGuestId,
    setPreviewGuestId,
    setStep,
    items,
    bgImage,
    bgColor,
    replaceVariables,
  } = ctx;

  const [selectedModel, setSelectedModel] = useState("default");
  const [previewItems, setPreviewItems] = useState<any[]>([]);

  // Trouver l'invité sélectionné
  const guest = guests.find((g: any) => g.id === previewGuestId) ?? guests[0];
  const previewBg = bgImage ? `url(${bgImage})` : bgColor;

  // Mettre à jour les items avec les variables remplacées
  useEffect(() => {
    if (guest && items) {
      const processedItems = items.map((it: any) => {
        if (it.type === "text" && it.text) {
          return {
            ...it,
            text: replaceVariables(it.text, guest),
          };
        }
        return it;
      });
      setPreviewItems(processedItems);
    } else {
      setPreviewItems(items || []);
    }
  }, [items, guest, replaceVariables]);

  const renderPreview = () => {
    const commonProps = {
      items: previewItems,
      bgColor: previewBg,
      onClose: () => setStep(1),
      guest: guest,
    };

    switch (selectedModel) {
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
        // return <EnvelopePreview {...commonProps} />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-enter">
      <Card>
        <CardHeader>
          <CardTitle>Prévisualisation</CardTitle>
          <CardDescription>
            Voir l'invitation telle qu'elle arrivera chez l'invité - Les
            variables comme {"{{nom}}"} seront automatiquement remplacées
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <label className="text-sm">Aperçu pour :</label>
                <Select
                  value={previewGuestId ?? ""}
                  onValueChange={(val: string) =>
                    setPreviewGuestId(val || null)
                  }
                >
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Sélectionner un invité" />
                  </SelectTrigger>
                  <SelectContent>
                    {guests.map((g: any) => (
                      <SelectItem key={g.id} value={g.id}>
                        {g.name} — {g.email}
                      </SelectItem>
                    ))} 
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)}>
                  ← Retour Édition
                </Button>
                <Button onClick={() => setStep(3)}>Continuer → Envoi</Button>
              </div>
            </div>

            {/* Informations sur l'invité sélectionné */}
            {guest && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="font-medium text-blue-900 mb-2">
                  Données utilisées pour le remplacement :
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div>
                    <strong>Nom :</strong> {guest.name || "Non défini"}
                  </div>
                  <div>
                    <strong>Email :</strong> {guest.email || "Non défini"}
                  </div>
                  <div>
                    <strong>Lieu :</strong> {guest.location || "Non défini"}
                  </div>
                  <div>
                    <strong>Date/Heure :</strong> {guest.date || "Non défini"}{" "}
                    {guest.time || ""}
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <label className="text-sm font-medium">Modèle de preview :</label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Choisir un modèle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Modèle par défaut</SelectItem>
                  <SelectItem value="model1">
                    Modèle 1 - Simple and Basic
                  </SelectItem>
                  <SelectItem value="model2">
                    Modèle 2 - Birthday Card
                  </SelectItem>
                  <SelectItem value="model3">
                    Modèle 3 - Simple and Basic Card
                  </SelectItem>
                  <SelectItem value="model4">Modèle 4 - Love Card</SelectItem>
                  <SelectItem value="model5">
                    Modèle 5 - Valentine Card
                  </SelectItem>
                  <SelectItem value="model6">Modèle 6 - Simple Card</SelectItem>
                  <SelectItem value="model7">
                    Modèle 7 - Extravagant Card
                  </SelectItem>
                  <SelectItem value="model8">Modèle 8 - Basic Card</SelectItem>
                  <SelectItem value="model9">Modèle 9 - Fly Card</SelectItem>
                  <SelectItem value="model10">
                    Modèle 10 - Amour Card
                  </SelectItem>
                  <SelectItem value="model11">
                    Modèle 11 - Heart Card
                  </SelectItem>
                  <SelectItem value="model12">
                    Modèle 12 - Friend Card
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-3xl">{renderPreview()}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
