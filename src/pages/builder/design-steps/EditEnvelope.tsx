// design-steps/EditEnvelope.tsx
import React, { useState } from "react";
import { Award, X, Save } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Palette,
  Image as ImageIcon,
  Type,
  Upload,
  Eye,
  Download,
  Zap,
  Sparkles,
  Stamp,
  FolderOpen,
} from "lucide-react";

export function EditEnvelope({ ctx }: { ctx: any }) {
  const [activeTab, setActiveTab] = useState("style");
  const [envelopeStyle, setEnvelopeStyle] = useState("felt");
  const [borderColor, setBorderColor] = useState("#3b82f6");
  const [liningType, setLiningType] = useState("metallic");
  const [liningColor, setLiningColor] = useState("#f59e0b");
  const [liningPattern, setLiningPattern] = useState("graffiti");
  const [customLiningImage, setCustomLiningImage] = useState<string | null>(
    null
  );
  const [textType, setTextType] = useState("withName");
  const [envelopeText, setEnvelopeText] = useState({
    name: "",
    company: "",
    message: "",
    simpleText: "",
  });
  const [textStyle, setTextStyle] = useState({
    fontFamily: "Arial",
    fontSize: 16,
    color: "#000000",
    textAlign: "left" as "left" | "center" | "right",
  });
  const [stampType, setStampType] = useState("decorative");
  const [selectedStamp, setSelectedStamp] = useState("classic");
  const [customStamp, setCustomStamp] = useState<string | null>(null);
  const [waxSealStyle, setWaxSealStyle] = useState("classic");
  const [waxSealColor, setWaxSealColor] = useState("#dc2626");
  const [waxSealMotif, setWaxSealMotif] = useState("initial");
  const [customWaxSeal, setCustomWaxSeal] = useState<string | null>(null);
  const [backgroundType, setBackgroundType] = useState("color");
  const [backgroundColor, setBackgroundColor] = useState("#f8fafc");
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  const envelopeStyles = [
    { id: "felt", name: "Felt", description: "Texture feutrée élégante" },
    { id: "metallic", name: "Métallique", description: "Brillant et moderne" },
    { id: "vellum", name: "Vélin", description: "Transparent et délicat" },
    {
      id: "deckled",
      name: "Déchiré",
      description: "Bords irréguliers vintage",
    },
    { id: "lace", name: "Dentelle", description: "Motifs détaillés" },
    { id: "kraft", name: "Kraft", description: "Style naturel et rustique" },
  ];

  const metallicColors = [
    { id: "brown", name: "Marron", color: "#92400e" },
    { id: "black", name: "Noir", color: "#000000" },
    { id: "gray", name: "Gris", color: "#6b7280" },
    { id: "gold", name: "Or", color: "#f59e0b" },
    { id: "silver", name: "Argent", color: "#9ca3af" },
    { id: "bronze", name: "Bronze", color: "#b45309" },
  ];

  const multicolorPatterns = [
    { id: "graffiti", name: "Graffiti", description: "Style urbain moderne" },
    { id: "flowers", name: "Fleurs", description: "Motifs floraux délicats" },
    { id: "geometric", name: "Géométrique", description: "Formes modernes" },
    { id: "abstract", name: "Abstrait", description: "Design artistique" },
    { id: "vintage", name: "Vintage", description: "Motifs rétro" },
    { id: "minimal", name: "Minimaliste", description: "Lignes épurées" },
  ];

  const decorativeStamps = [
    {
      id: "classic",
      name: "Classique",
      description: "Timbre postal traditionnel",
    },
    { id: "vintage", name: "Vintage", description: "Style ancien" },
    { id: "modern", name: "Moderne", description: "Design contemporain" },
    { id: "floral", name: "Floral", description: "Motifs fleuris" },
    { id: "geometric", name: "Géométrique", description: "Formes abstraites" },
    { id: "custom", name: "Personnalisé", description: "Uploader votre image" },
  ];

  const waxSealStyles = [
    { id: "classic", name: "Classique", description: "Cachet traditionnel" },
    { id: "elegant", name: "Élégant", description: "Design raffiné" },
    { id: "modern", name: "Moderne", description: "Style contemporain" },
    { id: "vintage", name: "Vintage", description: "Apparence ancienne" },
  ];

  const waxSealMotifs = [
    { id: "initial", name: "Initiale", description: "Lettre personnalisée" },
    { id: "heart", name: "Cœur", description: "Symbole d'amour" },
    { id: "star", name: "Étoile", description: "Design céleste" },
    { id: "floral", name: "Fleur", description: "Motif floral" },
    { id: "crown", name: "Couronne", description: "Style royal" },
    { id: "custom", name: "Personnalisé", description: "Image uploadée" },
  ];

  const handleImageUpload = (setImage: (url: string) => void) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setImage(url);
      }
    };
    input.click();
  };

  const handleSaveEnvelope = () => {
    const envelopeDesign = {
      style: envelopeStyle,
      borderColor,
      lining: {
        type: liningType,
        color: liningColor,
        pattern: liningPattern,
        customImage: customLiningImage,
      },
      text: {
        type: textType,
        content: envelopeText,
        style: textStyle,
      },
      stamps: {
        type: stampType,
        decorative: selectedStamp,
        custom: customStamp,
      },
      waxSeal: {
        style: waxSealStyle,
        color: waxSealColor,
        motif: waxSealMotif,
        custom: customWaxSeal,
      },
      background: {
        type: backgroundType,
        color: backgroundColor,
        image: backgroundImage,
      },
    };

    ctx.toast?.("Enveloppe sauvegardée", {
      description: "Votre design d'enveloppe a été enregistré",
    });
    console.log("Envelope Design:", envelopeDesign);
  };

  return (
    <Tabs value={activeTab} onValueChange={(v: string) => setActiveTab(v)}>
      <div className="flex">
        <TabsList>
          <TabsTrigger value="style">Style</TabsTrigger>
          <TabsTrigger value="lining">Doublure</TabsTrigger>
          <TabsTrigger value="finish">Finition</TabsTrigger>
        </TabsList>

        <div className="flex-1">          
          <TabsContent value="style">
            {/* Style de l'enveloppe */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Style d'enveloppe
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {envelopeStyles.map((style) => (
                  <Button
                    key={style.id}
                    variant={envelopeStyle === style.id ? "default" : "outline"}
                    className="h-auto py-3 flex flex-col items-center gap-2"
                    onClick={() => setEnvelopeStyle(style.id)}
                  >
                    <div
                      className={`w-8 h-8 rounded border-2 envelope-${style.id}`}
                    />
                    <div className="text-xs text-center">
                      <div className="font-medium">{style.name}</div>
                      <div className="text-muted-foreground">
                        {style.description}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Couleur des bordures */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Couleur des bordures
              </Label>
              <input
                type="color"
                value={borderColor}
                onChange={(e) => setBorderColor(e.target.value)}
                className="w-full h-10 rounded-md border cursor-pointer"
              />
            </div>

            {/* Doublure */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Doublure intérieure
              </Label>
              <Tabs
                value={liningType}
                onValueChange={setLiningType}
                className="w-full"
              >
                <TabsList className="grid grid-cols-3 w-full mb-4">
                  <TabsTrigger value="metallic">Métallique</TabsTrigger>
                  <TabsTrigger value="multicolor">Motif</TabsTrigger>
                  <TabsTrigger value="color">Couleur</TabsTrigger>
                </TabsList>

                <TabsContent value="metallic" className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    {metallicColors.map((color) => (
                      <Button
                        key={color.id}
                        variant={
                          liningColor === color.color ? "default" : "outline"
                        }
                        className="h-10"
                        onClick={() => setLiningColor(color.color)}
                        style={{ backgroundColor: color.color }}
                      >
                        <span className="sr-only">{color.name}</span>
                      </Button>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="multicolor" className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {multicolorPatterns.map((pattern) => (
                      <Button
                        key={pattern.id}
                        variant={
                          liningPattern === pattern.id ? "default" : "outline"
                        }
                        className="h-auto py-3 flex flex-col items-center gap-2"
                        onClick={() => setLiningPattern(pattern.id)}
                      >
                        <div
                          className={`w-8 h-8 rounded bg-${pattern.id}-pattern`}
                        />
                        <div className="text-xs text-center">
                          <div className="font-medium">{pattern.name}</div>
                          <div className="text-muted-foreground">
                            {pattern.description}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="color" className="space-y-3">
                  <input
                    type="color"
                    value={liningColor}
                    onChange={(e) => setLiningColor(e.target.value)}
                    className="w-full h-10 rounded-md border cursor-pointer"
                  />
                </TabsContent>
              </Tabs>

              {/* Upload personnalisé */}
              <div className="mt-4">
                <Label className="text-sm font-medium mb-2 block">
                  Image personnalisée
                </Label>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleImageUpload(setCustomLiningImage)}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Uploader une image
                </Button>
                {customLiningImage && (
                  <div className="mt-2 text-xs text-green-600">
                    ✓ Image personnalisée sélectionnée
                  </div>
                )}
              </div>
            </div>

            {/* Fond général */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Fond général
              </Label>
              <Tabs
                value={backgroundType}
                onValueChange={setBackgroundType}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 w-full mb-4">
                  <TabsTrigger value="color">Couleur</TabsTrigger>
                  <TabsTrigger value="image">Image</TabsTrigger>
                </TabsList>

                <TabsContent value="color" className="space-y-3">
                  <input
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-full h-10 rounded-md border cursor-pointer"
                  />
                </TabsContent>

                <TabsContent value="image" className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleImageUpload(setBackgroundImage)}
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Choisir une image de fond
                  </Button>
                  {backgroundImage && (
                    <div className="text-xs text-green-600">
                      ✓ Image de fond sélectionnée
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>

          <TabsContent value="lining">
            {/* Doublure intérieure */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Doublure intérieure
              </Label>
              <Tabs
                value={liningType}
                onValueChange={setLiningType}
                className="w-full"
              >
                <TabsList className="grid grid-cols-3 w-full mb-4">
                  <TabsTrigger value="metallic">Métallique</TabsTrigger>
                  <TabsTrigger value="multicolor">Motif</TabsTrigger>
                  <TabsTrigger value="color">Couleur</TabsTrigger>
                </TabsList>

                <TabsContent value="metallic" className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    {metallicColors.map((color) => (
                      <Button
                        key={color.id}
                        variant={
                          liningColor === color.color ? "default" : "outline"
                        }
                        className="h-10"
                        onClick={() => setLiningColor(color.color)}
                        style={{ backgroundColor: color.color }}
                      >
                        <span className="sr-only">{color.name}</span>
                      </Button>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="multicolor" className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {multicolorPatterns.map((pattern) => (
                      <Button
                        key={pattern.id}
                        variant={
                          liningPattern === pattern.id ? "default" : "outline"
                        }
                        className="h-auto py-3 flex flex-col items-center gap-2"
                        onClick={() => setLiningPattern(pattern.id)}
                      >
                        <div
                          className={`w-8 h-8 rounded bg-${pattern.id}-pattern`}
                        />
                        <div className="text-xs text-center">
                          <div className="font-medium">{pattern.name}</div>
                          <div className="text-muted-foreground">
                            {pattern.description}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="color" className="space-y-3">
                  <input
                    type="color"
                    value={liningColor}
                    onChange={(e) => setLiningColor(e.target.value)}
                    className="w-full h-10 rounded-md border cursor-pointer"
                  />
                </TabsContent>
              </Tabs>

              {/* Upload personnalisé */}
              <div className="mt-4">
                <Label className="text-sm font-medium mb-2 block">
                  Image personnalisée
                </Label>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleImageUpload(setCustomLiningImage)}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Uploader une image
                </Button>
                {customLiningImage && (
                  <div className="mt-2 text-xs text-green-600">
                    ✓ Image personnalisée sélectionnée
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="finish">
            {/* Style du texte */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Style du texte
              </Label>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <Label className="text-xs">Police</Label>
                  <select
                    value={textStyle.fontFamily}
                    onChange={(e) =>
                      setTextStyle((prev) => ({
                        ...prev,
                        fontFamily: e.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Courier New">Courier New</option>
                  </select>
                </div>
                <div>
                  <Label className="text-xs">Taille</Label>
                  <Input
                    type="number"
                    value={textStyle.fontSize}
                    onChange={(e) =>
                      setTextStyle((prev) => ({
                        ...prev,
                        fontSize: parseInt(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Couleur</Label>
                  <input
                    type="color"
                    value={textStyle.color}
                    onChange={(e) =>
                      setTextStyle((prev) => ({
                        ...prev,
                        color: e.target.value,
                      }))
                    }
                    className="w-full h-10 rounded-md border cursor-pointer"
                  />
                </div>
                <div>
                  <Label className="text-xs">Alignement</Label>
                  <select
                    value={textStyle.textAlign}
                    onChange={(e) =>
                      setTextStyle((prev) => ({
                        ...prev,
                        textAlign: e.target.value as any,
                      }))
                    }
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="left">Gauche</option>
                    <option value="center">Centre</option>
                    <option value="right">Droite</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Timbres */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Type de timbre
              </Label>
              <Tabs
                value={stampType}
                onValueChange={setStampType}
                className="w-full"
              >
                <TabsList className="grid grid-cols-3 w-full mb-4">
                  <TabsTrigger value="decorative">Décoratif</TabsTrigger>
                  <TabsTrigger value="custom">Personnalisé</TabsTrigger>
                  <TabsTrigger value="none">Aucun</TabsTrigger>
                </TabsList>

                <TabsContent value="decorative" className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {decorativeStamps.map((stamp) => (
                      <Button
                        key={stamp.id}
                        variant={
                          selectedStamp === stamp.id ? "default" : "outline"
                        }
                        className="h-auto py-3 flex flex-col items-center gap-2"
                        onClick={() => setSelectedStamp(stamp.id)}
                      >
                        <Stamp className="h-5 w-5" />
                        <div className="text-xs text-center">
                          <div className="font-medium">{stamp.name}</div>
                          <div className="text-muted-foreground">
                            {stamp.description}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="custom" className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleImageUpload(setCustomStamp)}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Uploader un timbre personnalisé
                  </Button>
                  {customStamp && (
                    <div className="text-center">
                      <img
                        src={customStamp}
                        alt="Timbre personnalisé"
                        className="mx-auto h-20 object-contain rounded"
                      />
                      <div className="text-xs text-green-600 mt-2">
                        ✓ Timbre personnalisé uploadé
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Cachet de cire */}
            <div>
              <Label className="text-sm font-medium mb-3 block">
                Style de cachet
              </Label>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {waxSealStyles.map((style) => (
                  <Button
                    key={style.id}
                    variant={waxSealStyle === style.id ? "default" : "outline"}
                    className="h-auto py-3 flex flex-col items-center gap-2"
                    onClick={() => setWaxSealStyle(style.id)}
                  >
                    <Award className="h-5 w-5" />
                    <div className="text-xs text-center">
                      <div className="font-medium">{style.name}</div>
                      <div className="text-muted-foreground">
                        {style.description}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">
                Couleur de la cire
              </Label>
              <input
                type="color"
                value={waxSealColor}
                onChange={(e) => setWaxSealColor(e.target.value)}
                className="w-full h-10 rounded-md border cursor-pointer"
              />
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">
                Motif du cachet
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {waxSealMotifs.map((motif) => (
                  <Button
                    key={motif.id}
                    variant={waxSealMotif === motif.id ? "default" : "outline"}
                    className="h-auto py-2 flex flex-col items-center gap-1"
                    onClick={() => setWaxSealMotif(motif.id)}
                  >
                    <div className="text-lg">
                      {motif.id === "initial" && "M"}
                      {motif.id === "heart" && "❤️"}
                      {motif.id === "star" && "⭐"}
                      {motif.id === "floral" && "🌺"}
                      {motif.id === "crown" && "👑"}
                      {motif.id === "custom" && "🖼️"}
                    </div>
                    <div className="text-xs">{motif.name}</div>
                  </Button>
                ))}
              </div>
            </div>

            {waxSealMotif === "custom" && (
              <div>
                <Label className="text-sm font-medium mb-2 block">
                  Image personnalisée
                </Label>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleImageUpload(setCustomWaxSeal)}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Uploader un motif personnalisé
                </Button>
                {customWaxSeal && (
                  <div className="text-center mt-2">
                    <img
                      src={customWaxSeal}
                      alt="Motif personnalisé"
                      className="mx-auto h-16 object-contain rounded"
                    />
                    <div className="text-xs text-green-600">
                      ✓ Motif personnalisé uploadé
                    </div>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </div>
      </div>
    </Tabs>
  );
}
