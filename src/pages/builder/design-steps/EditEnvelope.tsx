// design-steps/EditEnvelope.tsx
import React, { useState } from "react";
import { Award, X, Save, Eye, Download, Zap, Sparkles } from "lucide-react";
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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Palette,
  Image as ImageIcon,
  Type,
  Upload,
  Stamp,
  FolderOpen,
  Settings,
  Layers,
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

  // Données pour les sélecteurs
  const envelopeStyles = [
    {
      id: "felt",
      name: "Felt",
      description: "Texture feutrée élégante",
      icon: "🧵",
    },
    {
      id: "metallic",
      name: "Métallique",
      description: "Brillant et moderne",
      icon: "✨",
    },
    {
      id: "vellum",
      name: "Vélin",
      description: "Transparent et délicat",
      icon: "📃",
    },
    {
      id: "deckled",
      name: "Déchiré",
      description: "Bords irréguliers vintage",
      icon: "📜",
    },
    {
      id: "lace",
      name: "Dentelle",
      description: "Motifs détaillés",
      icon: "👑",
    },
    {
      id: "kraft",
      name: "Kraft",
      description: "Style naturel et rustique",
      icon: "📦",
    },
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
    <div className="flex h-[800px] bg-background rounded-lg border">
      {/* Sidebar des propriétés */}
      <div className="w-80 border-r bg-muted/20 p-6 overflow-y-auto">
        <div className="space-y-6">
          {/* En-tête */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Design de l'Enveloppe</h2>
              <p className="text-sm text-muted-foreground">
                Personnalisez chaque aspect
              </p>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Expert
            </Badge>
          </div>

          <Separator />

          {/* Navigation par onglets */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="style" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Style
              </TabsTrigger>
              <TabsTrigger value="lining" className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Doublure
              </TabsTrigger>
              <TabsTrigger value="finish" className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Finition
              </TabsTrigger>
            </TabsList>

            {/* Contenu des onglets */}
            <div className="mt-6 space-y-6">
              {/* Onglet STYLE */}
              <TabsContent value="style" className="space-y-6 m-0">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4 text-blue-500" />
                    <Label className="text-sm font-semibold">
                      Style d'enveloppe
                    </Label>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {envelopeStyles.map((style) => (
                      <Button
                        key={style.id}
                        variant={
                          envelopeStyle === style.id ? "default" : "outline"
                        }
                        className="h-auto p-2 flex flex-col items-center gap-1"
                        onClick={() => setEnvelopeStyle(style.id)}
                      >
                        <span className="text-lg">{style.icon}</span>
                        <div className="text-xs text-center">
                          <div className="font-medium">{style.name}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold">
                    Couleur des bordures
                  </Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={borderColor}
                      onChange={(e) => setBorderColor(e.target.value)}
                      className="w-12 h-12 rounded-md border cursor-pointer"
                    />
                    <div className="flex-1">
                      <Input
                        value={borderColor}
                        onChange={(e) => setBorderColor(e.target.value)}
                        className="h-9 font-mono text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Fond général</Label>
                  <Tabs
                    value={backgroundType}
                    onValueChange={setBackgroundType}
                    className="w-full"
                  >
                    <TabsList className="grid grid-cols-2 w-full">
                      <TabsTrigger value="color">Couleur</TabsTrigger>
                      <TabsTrigger value="image">Image</TabsTrigger>
                    </TabsList>

                    <TabsContent value="color" className="space-y-3 mt-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="w-12 h-12 rounded-md border cursor-pointer"
                        />
                        <Input
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="h-9 font-mono text-sm"
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="image" className="space-y-3 mt-3">
                      <Button
                        variant="outline"
                        className="w-full h-9"
                        onClick={() => handleImageUpload(setBackgroundImage)}
                      >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Choisir une image
                      </Button>
                    </TabsContent>
                  </Tabs>
                </div>
              </TabsContent>

              {/* Onglet DOUBLURE */}
              <TabsContent value="lining" className="space-y-6 m-0">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-purple-500" />
                    <Label className="text-sm font-semibold">
                      Type de doublure
                    </Label>
                  </div>

                  <Tabs
                    value={liningType}
                    onValueChange={setLiningType}
                    className="w-full"
                  >
                    <TabsList className="grid grid-cols-3 w-full">
                      <TabsTrigger value="metallic">Métallique</TabsTrigger>
                      <TabsTrigger value="multicolor">Motif</TabsTrigger>
                      <TabsTrigger value="color">Couleur</TabsTrigger>
                    </TabsList>

                    <TabsContent value="metallic" className="space-y-3 mt-3">
                      <div className="grid grid-cols-3 gap-2">
                        {metallicColors.map((color) => (
                          <Button
                            key={color.id}
                            variant={
                              liningColor === color.color
                                ? "default"
                                : "outline"
                            }
                            className="h-8 relative"
                            onClick={() => setLiningColor(color.color)}
                          >
                            <div
                              className="w-full h-full rounded absolute inset-0"
                              style={{ backgroundColor: color.color }}
                            />
                            <span className="sr-only">{color.name}</span>
                          </Button>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="multicolor" className="space-y-3 mt-3">
                      <div className="grid grid-cols-2 gap-2">
                        {multicolorPatterns.map((pattern) => (
                          <Button
                            key={pattern.id}
                            variant={
                              liningPattern === pattern.id
                                ? "default"
                                : "outline"
                            }
                            className="h-auto p-2 flex flex-col items-center gap-1"
                            onClick={() => setLiningPattern(pattern.id)}
                          >
                            <div className="text-xs text-center">
                              <div className="font-medium">{pattern.name}</div>
                              <div className="text-muted-foreground text-[10px]">
                                {pattern.description}
                              </div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="color" className="space-y-3 mt-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="color"
                          value={liningColor}
                          onChange={(e) => setLiningColor(e.target.value)}
                          className="w-12 h-12 rounded-md border cursor-pointer"
                        />
                        <Input
                          value={liningColor}
                          onChange={(e) => setLiningColor(e.target.value)}
                          className="h-9 font-mono text-sm"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold">
                    Image personnalisée
                  </Label>
                  <Button
                    variant="outline"
                    className="w-full h-9"
                    onClick={() => handleImageUpload(setCustomLiningImage)}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Uploader une image
                  </Button>
                </div>
              </TabsContent>

              {/* Onglet FINITION */}
              <TabsContent value="finish" className="space-y-6 m-0">
                {/* Style du texte */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Type className="h-4 w-4 text-green-500" />
                    <Label className="text-sm font-semibold">
                      Style du texte
                    </Label>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label className="text-xs">Police</Label>
                      <select
                        value={textStyle.fontFamily}
                        onChange={(e) =>
                          setTextStyle((prev) => ({
                            ...prev,
                            fontFamily: e.target.value,
                          }))
                        }
                        className="w-full rounded-md border border-input bg-background px-2 py-1 text-sm"
                      >
                        <option value="Arial">Arial</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Courier New">Courier New</option>
                      </select>
                    </div>
                    <div className="space-y-2">
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
                        className="h-8"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
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
                        className="w-full h-8 rounded-md border cursor-pointer"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs">Alignement</Label>
                      <select
                        value={textStyle.textAlign}
                        onChange={(e) =>
                          setTextStyle((prev) => ({
                            ...prev,
                            textAlign: e.target.value as any,
                          }))
                        }
                        className="w-full rounded-md border border-input bg-background px-2 py-1 text-sm"
                      >
                        <option value="left">Gauche</option>
                        <option value="center">Centre</option>
                        <option value="right">Droite</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Timbres */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Stamp className="h-4 w-4 text-orange-500" />
                    <Label className="text-sm font-semibold">Timbres</Label>
                  </div>

                  <Tabs
                    value={stampType}
                    onValueChange={setStampType}
                    className="w-full"
                  >
                    <TabsList className="grid grid-cols-3 w-full">
                      <TabsTrigger value="decorative">Décoratif</TabsTrigger>
                      <TabsTrigger value="custom">Personnalisé</TabsTrigger>
                      <TabsTrigger value="none">Aucun</TabsTrigger>
                    </TabsList>

                    <TabsContent value="decorative" className="space-y-3 mt-3">
                      <div className="grid grid-cols-2 gap-2">
                        {decorativeStamps.slice(0, 4).map((stamp) => (
                          <Button
                            key={stamp.id}
                            variant={
                              selectedStamp === stamp.id ? "default" : "outline"
                            }
                            className="h-auto p-2 flex flex-col items-center gap-1"
                            onClick={() => setSelectedStamp(stamp.id)}
                          >
                            <div className="text-xs text-center">
                              <div className="font-medium">{stamp.name}</div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="custom" className="space-y-3 mt-3">
                      <Button
                        variant="outline"
                        className="w-full h-9"
                        onClick={() => handleImageUpload(setCustomStamp)}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Uploader un timbre
                      </Button>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Cachet de cire */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-red-500" />
                    <Label className="text-sm font-semibold">
                      Cachet de cire
                    </Label>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-xs">Style de cachet</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {waxSealStyles.map((style) => (
                        <Button
                          key={style.id}
                          variant={
                            waxSealStyle === style.id ? "default" : "outline"
                          }
                          className="h-auto p-2 flex flex-col items-center gap-1"
                          onClick={() => setWaxSealStyle(style.id)}
                        >
                          <div className="text-xs text-center">
                            <div className="font-medium">{style.name}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Couleur de la cire</Label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={waxSealColor}
                        onChange={(e) => setWaxSealColor(e.target.value)}
                        className="w-10 h-10 rounded-md border cursor-pointer"
                      />
                      <Input
                        value={waxSealColor}
                        onChange={(e) => setWaxSealColor(e.target.value)}
                        className="h-8 font-mono text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Motif du cachet</Label>
                    <div className="grid grid-cols-3 gap-1">
                      {waxSealMotifs.map((motif) => (
                        <Button
                          key={motif.id}
                          variant={
                            waxSealMotif === motif.id ? "default" : "outline"
                          }
                          className="h-auto p-1 flex flex-col items-center gap-0"
                          onClick={() => setWaxSealMotif(motif.id)}
                        >
                          <div className="text-sm">
                            {motif.id === "initial" && "M"}
                            {motif.id === "heart" && "❤️"}
                            {motif.id === "star" && "⭐"}
                            {motif.id === "floral" && "🌺"}
                            {motif.id === "crown" && "👑"}
                            {motif.id === "custom" && "🖼️"}
                          </div>
                          <div className="text-[10px]">{motif.name}</div>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          {/* Actions */}
          <div className="pt-4 border-t">
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Eye className="h-4 w-4 mr-2" />
                Prévisualiser
              </Button>
              <Button onClick={handleSaveEnvelope} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Zone de travail principale */}
      <div className="flex-1 p-8">
        <div className="flex flex-col h-full">
          {/* En-tête du workspace */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Éditeur d'Enveloppe</h1>
              <p className="text-muted-foreground">
                Visualisez et personnalisez votre design en temps réel
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
              <Button variant="outline" size="sm">
                <FolderOpen className="h-4 w-4 mr-2" />
                Modèles
              </Button>
            </div>
          </div>

          {/* Zone de prévisualisation */}
          <div className="flex-1 bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-32 h-32 bg-muted-foreground/20 rounded-lg flex items-center justify-center mx-auto">
                <Sparkles className="h-12 w-12 text-muted-foreground/40" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Aperçu de l'Enveloppe
                </h3>
                <p className="text-muted-foreground max-w-md">
                  Votre design s'affichera ici. Utilisez les paramètres sur le
                  côté pour personnaliser l'apparence de votre enveloppe.
                </p>
              </div>
              <Button>
                <Zap className="h-4 w-4 mr-2" />
                Charger un modèle
              </Button>
            </div>
          </div>

          {/* Indicateur de statut */}
          <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Modifications sauvegardées</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span>Résolution: 1920x1080</span>
              <span>Qualité: Maximum</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
