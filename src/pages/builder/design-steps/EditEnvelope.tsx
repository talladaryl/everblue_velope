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
  Move,
  User,
  MapPin,
  Building,
  Mail,
} from "lucide-react";

// Modèles d'enveloppes professionnelles
const ENVELOPE_TEMPLATES = [
  {
    id: "corporate-classic",
    name: "Corporate Classique",
    description: "Enveloppe professionnelle élégante",
    category: "business",
    style: "metallic",
    borderColor: "#1e3a8a",
    liningType: "metallic",
    liningColor: "#d4af37",
    texture: "metal",
    popularity: 95,
  },
  {
    id: "luxury-gold",
    name: "Luxe Or",
    description: "Design premium avec finitions dorées",
    category: "premium",
    style: "metallic",
    borderColor: "#000000",
    liningType: "metallic",
    liningColor: "#f59e0b",
    texture: "gold",
    popularity: 92,
  },
  {
    id: "wedding-elegant",
    name: "Mariage Élégant",
    description: "Parfait pour les invitations de mariage",
    category: "wedding",
    style: "lace",
    borderColor: "#c084fc",
    liningType: "multicolor",
    liningPattern: "flowers",
    texture: "lace",
    popularity: 88,
  },
  {
    id: "vintage-style",
    name: "Style Vintage",
    description: "Charme rétro avec bords déchirés",
    category: "vintage",
    style: "deckled",
    borderColor: "#92400e",
    liningType: "color",
    liningColor: "#fef3c7",
    texture: "paper",
    popularity: 85,
  },
];

export function EditEnvelope({ ctx }: { ctx: any }) {
  const [activeTab, setActiveTab] = useState("style");
  const [envelopeStyle, setEnvelopeStyle] = useState("metallic");
  const [borderColor, setBorderColor] = useState("#1e3a8a");
  const [liningType, setLiningType] = useState("metallic");
  const [liningColor, setLiningColor] = useState("#d4af37");
  const [liningPattern, setLiningPattern] = useState("graffiti");
  const [customLiningImage, setCustomLiningImage] = useState<string | null>(
    null
  );
  const [textType, setTextType] = useState("withName");
  const [envelopeText, setEnvelopeText] = useState({
    recipientName: "{{nom}}",
    recipientAddress: "{{adresse}}",
    recipientCompany: "{{entreprise}}",
    senderName: "{{expéditeur}}",
    message: "{{message}}",
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
  const [showTemplates, setShowTemplates] = useState(false);

  const envelopeStyles = [
    {
      id: "felt",
      name: "Felt",
      description: "Texture feutrée élégante",
      icon: "🧵",
      texture: "fabric",
    },
    {
      id: "metallic",
      name: "Métallique",
      description: "Brillant et moderne",
      icon: "✨",
      texture: "metal",
    },
    {
      id: "vellum",
      name: "Vélin",
      description: "Transparent et délicat",
      icon: "📃",
      texture: "parchment",
    },
    {
      id: "deckled",
      name: "Déchiré",
      description: "Bords irréguliers vintage",
      icon: "📜",
      texture: "paper",
    },
    {
      id: "lace",
      name: "Dentelle",
      description: "Motifs détaillés",
      icon: "👑",
      texture: "lace",
    },
    {
      id: "kraft",
      name: "Kraft",
      description: "Style naturel et rustique",
      icon: "📦",
      texture: "kraft",
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

  // Variables disponibles pour le texte
  const textVariables = [
    {
      id: "nom",
      name: "Nom du destinataire",
      icon: User,
      description: "Nom complet de la personne",
    },
    {
      id: "adresse",
      name: "Adresse",
      icon: MapPin,
      description: "Adresse postale complète",
    },
    {
      id: "entreprise",
      name: "Entreprise",
      icon: Building,
      description: "Nom de l'entreprise",
    },
    {
      id: "expéditeur",
      name: "Nom expéditeur",
      icon: User,
      description: "Votre nom ou société",
    },
    {
      id: "message",
      name: "Message personnalisé",
      icon: Mail,
      description: "Texte personnalisé",
    },
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

  const applyTemplate = (template: any) => {
    setEnvelopeStyle(template.style);
    setBorderColor(template.borderColor);
    setLiningType(template.liningType);
    setLiningColor(template.liningColor);
    if (template.liningPattern) {
      setLiningPattern(template.liningPattern);
    }
    setShowTemplates(false);
  };

  const insertVariable = (variableId: string) => {
    const variable = `{{${variableId}}}`;
    setEnvelopeText((prev) => ({
      ...prev,
      recipientName: variable,
    }));
  };

  // Fonction pour obtenir le style de texture en fonction du type d'enveloppe
  const getEnvelopeTexture = (style: string) => {
    const textures = {
      metallic: "linear-gradient(145deg, #c0c0c0, #e0e0e0, #a0a0a0)",
      felt: "linear-gradient(145deg, #8b4513, #a0522d, #cd853f)",
      vellum: "linear-gradient(145deg, #fdf5e6, #fffaf0, #f5f5dc)",
      deckled: "linear-gradient(145deg, #f5f5f5, #e8e8e8, #dcdcdc)",
      lace: "linear-gradient(145deg, #ffffff, #f8f8ff, #f0f0f0)",
      kraft: "linear-gradient(145deg, #d7ccc8, #bcaaa4, #8d6e63)",
    };
    return textures[style as keyof typeof textures] || textures.metallic;
  };

  // Style de l'enveloppe pour la prévisualisation
  const envelopePreviewStyle = {
    background: backgroundImage ? `url(${backgroundImage})` : backgroundColor,
    backgroundSize: "cover",
    width: "100%",
    maxWidth: "600px",
    height: "400px",
    margin: "0 auto",
    boxShadow: `
      inset 0 0 40px rgba(0,0,0,0.08),
      0 20px 60px rgba(0,0,0,0.15),
      0 0 0 1px rgba(0,0,0,0.08)
    `,
    border: `12px solid ${borderColor}`,
    borderRadius: "8px",
    position: "relative" as const,
    overflow: "hidden",
    transition: "all 0.3s ease",
  };

  // Style de la texture de l'enveloppe
  const envelopeTextureStyle = {
    background: getEnvelopeTexture(envelopeStyle),
    opacity: 0.8,
    mixBlendMode: "multiply" as const,
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Zone de travail principale - GAUCHE */}
      <div className="flex-1 p-8">
        <div className="flex flex-col h-full">
          {/* En-tête du workspace */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">Éditeur d'Enveloppe</h1>
              <p className="text-muted-foreground">
                Conception visuelle en temps réel
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTemplates(true)}
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                Modèles
              </Button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white/80 px-3 py-2 rounded-full border">
                <Move className="h-4 w-4" />
                <span>Personnalisez votre enveloppe</span>
              </div>
            </div>
          </div>

          {/* Zone de prévisualisation */}
          <div className="flex-1 bg-muted/30 rounded-2xl border-2 border-dashed border-muted-foreground/20 flex items-center justify-center p-8">
            <div
              className="relative rounded-2xl border-2 border-gray-200 bg-white overflow-hidden transition-all duration-300 hover:shadow-2xl"
              style={envelopePreviewStyle}
            >
              {/* Texture de l'enveloppe */}
              <div className="absolute inset-0" style={envelopeTextureStyle} />

              {/* Représentation visuelle de l'enveloppe */}
              <div className="absolute inset-4 border-2 border-white/20 rounded-lg flex items-center justify-center">
                {/* Zone d'adresse du destinataire */}
                <div className="absolute top-8 left-8 w-48 h-32 border border-dashed border-gray-300 rounded-lg p-4 bg-white/90 backdrop-blur-sm">
                  <div
                    className="text-sm font-medium"
                    style={{
                      fontFamily: textStyle.fontFamily,
                      fontSize: `${textStyle.fontSize}px`,
                      color: textStyle.color,
                      textAlign: textStyle.textAlign as any,
                    }}
                  >
                    {envelopeText.recipientName}
                  </div>
                  {envelopeText.recipientCompany && (
                    <div className="text-xs text-gray-600 mt-1">
                      {envelopeText.recipientCompany}
                    </div>
                  )}
                </div>

                {/* Timbre */}
                {stampType !== "none" && (
                  <div className="absolute top-8 right-8 w-16 h-16 bg-red-500 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-lg">
                    TIMBRE
                  </div>
                )}

                {/* Cachet de cire */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full border-4 border-red-500 flex items-center justify-center bg-red-600 shadow-lg">
                  <span className="text-white text-lg font-bold">M</span>
                </div>

                {/* Lining preview */}
                <div
                  className="absolute inset-8 opacity-30 pointer-events-none rounded-lg"
                  style={{
                    backgroundColor:
                      liningType === "color" ? liningColor : "transparent",
                    backgroundImage:
                      liningType === "multicolor"
                        ? `radial-gradient(circle, ${liningColor} 1px, transparent 1px)`
                        : liningType === "metallic"
                        ? `linear-gradient(45deg, ${liningColor} 25%, transparent 25%), linear-gradient(-45deg, ${liningColor} 25%, transparent 25%), linear-gradient(45deg, transparent 75%, ${liningColor} 75%), linear-gradient(-45deg, transparent 75%, ${liningColor} 75%)`
                        : "none",
                    backgroundSize:
                      liningType === "metallic" ? "20px 20px" : "20px 20px",
                  }}
                />
              </div>

              {/* Indicateur de style d'enveloppe */}
              <div className="absolute top-4 left-4 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {envelopeStyles.find((s) => s.id === envelopeStyle)?.name}
              </div>
            </div>
          </div>

          {/* Indicateur de statut */}
          <div className="flex items-center justify-between mt-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Design actif</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span>
                Style:{" "}
                {envelopeStyles.find((s) => s.id === envelopeStyle)?.name}
              </span>
              <span>Qualité: Maximum</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar des propriétés - DROITE */}
      <div className="w-80 border-l bg-muted/20 p-6 overflow-y-auto">
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
              <TabsContent value="style" className="space-y-4 m-0">
                <div className="space-y-4">
                  <Label className="text-sm font-semibold">
                    Style d'enveloppe
                  </Label>
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
                      className="w-12 h-12 rounded-lg border cursor-pointer"
                    />
                    <div className="flex-1">
                      <Input
                        value={borderColor}
                        onChange={(e) => setBorderColor(e.target.value)}
                        className="h-10 font-mono text-sm"
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
                          className="w-12 h-12 rounded-lg border cursor-pointer"
                        />
                        <Input
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="h-10 font-mono text-sm"
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="image" className="space-y-3 mt-3">
                      <Button
                        variant="outline"
                        className="w-full h-10"
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
              <TabsContent value="lining" className="space-y-4 m-0">
                <div className="space-y-4">
                  <Label className="text-sm font-semibold">
                    Type de doublure
                  </Label>

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
                          className="w-12 h-12 rounded-lg border cursor-pointer"
                        />
                        <Input
                          value={liningColor}
                          onChange={(e) => setLiningColor(e.target.value)}
                          className="h-10 font-mono text-sm"
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
                    className="w-full h-10"
                    onClick={() => handleImageUpload(setCustomLiningImage)}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Uploader une image
                  </Button>
                </div>
              </TabsContent>

              {/* Onglet FINITION */}
              <TabsContent value="finish" className="space-y-4 m-0">
                {/* Variables de texte */}
                <div className="space-y-4">
                  <Label className="text-sm font-semibold">
                    Variables de texte
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {textVariables.map((variable) => (
                      <Button
                        key={variable.id}
                        variant="outline"
                        className="h-auto p-2 flex flex-col items-center gap-1"
                        onClick={() => insertVariable(variable.id)}
                      >
                        <variable.icon className="h-4 w-4" />
                        <div className="text-xs text-center">
                          <div className="font-medium">{variable.name}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Style du texte */}
                <div className="space-y-4">
                  <Label className="text-sm font-semibold">
                    Style du texte
                  </Label>

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
                        className="w-full rounded-lg border border-input bg-background px-2 py-1 text-sm"
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
                        className="w-full h-8 rounded-lg border cursor-pointer"
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
                        className="w-full rounded-lg border border-input bg-background px-2 py-1 text-sm"
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
                  <Label className="text-sm font-semibold">Timbres</Label>

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
                        className="w-full h-10"
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
                  <Label className="text-sm font-semibold">
                    Cachet de cire
                  </Label>

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
                        className="w-10 h-10 rounded-lg border cursor-pointer"
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

                  {waxSealMotif === "custom" && (
                    <div className="space-y-2">
                      <Label className="text-xs">Image personnalisée</Label>
                      <Button
                        variant="outline"
                        className="w-full h-10"
                        onClick={() => handleImageUpload(setCustomWaxSeal)}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Uploader un motif
                      </Button>
                    </div>
                  )}
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

      {/* Modal des modèles d'enveloppe */}
      {showTemplates && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden border border-gray-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Modèles d'Enveloppe
                </h3>
                <p className="text-gray-600 mt-1">
                  Choisissez un design adapté à vos besoins
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowTemplates(false)}
                className="h-10 w-10 rounded-xl hover:bg-gray-200"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ENVELOPE_TEMPLATES.map((template) => (
                  <div
                    key={template.id}
                    className="cursor-pointer group border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-blue-500 hover:shadow-2xl transition-all duration-300 bg-white"
                    onClick={() => applyTemplate(template)}
                  >
                    <div
                      className="w-full h-40 relative group-hover:scale-105 transition-transform duration-300"
                      style={{
                        backgroundColor: "#f8fafc",
                        border: `12px solid ${template.borderColor}`,
                        borderRadius: "8px",
                        background: getEnvelopeTexture(template.style),
                      }}
                    >
                      <div className="absolute inset-4 border border-dashed border-gray-300 rounded flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-700">
                            {template.name}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {template.category}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <p className="text-lg font-bold text-gray-900">
                          {template.name}
                        </p>
                        <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded-full capitalize">
                          {template.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {template.description}
                      </p>
                      <div className="flex items-center mt-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-2 bg-green-500 rounded-full"
                            style={{ width: `${template.popularity}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 ml-2">
                          {template.popularity}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-center">
                <Button
                  onClick={() => setShowTemplates(false)}
                  variant="outline"
                  className="rounded-xl border-2 border-gray-300 hover:border-gray-400"
                >
                  Fermer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
