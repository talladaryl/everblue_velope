import React from "react";
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
import EnvelopePreview from "@/pages/EnvelopePreview";

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

  const guest = guests.find((g: any) => g.id === previewGuestId) ?? guests[0];
  const previewItems = items.map((it: any) =>
    it.type === "text" ? { ...it, text: replaceVariables(it.text, guest) } : it
  );
  const previewBg = bgImage ? `url(${bgImage})` : bgColor;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-enter">
      <Card>
        <CardHeader>
          <CardTitle>Prévisualisation</CardTitle>
          <CardDescription>
            Voir l'invitation telle qu'elle arrivera chez l'invité
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4 gap-4">
            <div className="flex items-center gap-3">
              <label className="text-sm">Aperçu pour :</label>
              <Select
                value={previewGuestId ?? ""}
                onValueChange={(val: string) => setPreviewGuestId(val || null)}
              >
                <SelectTrigger>
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
                ← Retour
              </Button>
              <Button onClick={() => setStep(3)}>Continuer → Envoi</Button>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-3xl">
              <EnvelopePreview
                items={previewItems}
                bgColor={previewBg}
                onClose={() => setStep(1)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
