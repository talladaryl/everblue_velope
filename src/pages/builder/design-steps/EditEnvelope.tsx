// design-steps/EditEnvelope.tsx - Version refaite similaire à EditCard
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Plus, Image as ImageIcon, Type, Trash2, Palette, Move, Settings, Zap, Layout,
  Sparkles, Mail, User, MapPin, Building, Stamp, Award, Layers,
  AlignLeft, AlignCenter, AlignRight, Bold, Italic, Download, Save,
} from "lucide-react";
import { FONT_CATEGORIES, ALL_FONTS, DEFAULT_FONTS } from "@/constants/fonts";

// Modèles d'enveloppes modernes
const ENVELOPE_TEMPLATES = [
  {
    id: "corporate-elegant",
    name: "Corporate Élégant",
    description: "Design professionnel avec bordures dorées",
    bgColor: "#1a1a2e",
    borderColor: "#d4af37",
    textColor: "#ffffff",
    fontFamily: "'Playfair Display', serif",
    style: "metallic",
  },
  {
    id: "wedding-romantic",
    name: "Mariage Romantique",
    description: "Style délicat avec dentelle",
    bgColor: "#fdf2f8",
    borderColor: "#ec4899",
    textColor: "#831843",
    fontFamily: "'Great Vibes', cursive",
    style: "lace",
  },
  {
    id: "vintage-kraft",
    name: "Vintage Kraft",
    description: "Style rustique naturel",
    bgColor: "#d7ccc8",
    borderColor: "#5d4037",
    textColor: "#3e2723",
    fontFamily: "'Rye', cursive",
    style: "kraft",
  },
  {
    id: "neon-party",
    name: "Fête Néon",
    description: "Style années 80 lumineux",
    bgColor: "#0f0c29",
    borderColor: "#ff00ff",
    textColor: "#00ffff",
    fontFamily: "'Monoton', cursive",
    style: "neon",
  },
  {
    id: "minimalist-white",
    name: "Minimaliste Blanc",
    description: "Épuré et moderne",
    bgColor: "#ffffff",
    borderColor: "#e5e7eb",
    textColor: "#1f2937",
    fontFamily: "'Inter', sans-serif",
    style: "minimal",
  },
  {
    id: "halloween-dark",
    name: "Halloween Sombre",
    description: "Ambiance effrayante",
    bgColor: "#1a1a1a",
    borderColor: "#ff4500",
    textColor: "#ffa500",
    fontFamily: "'Creepster', cursive",
    style: "horror",
  },
];

// Styles d'enveloppe
const ENVELOPE_STYLES = [
  { id: "metallic", name: "Métallique", icon: "✨", description: "Brillant et moderne" },
  { id: "lace", name: "Dentelle", icon: "👑", description: "Motifs détaillés" },
  { id: "kraft", name: "Kraft", icon: "📦", description: "Naturel et rustique" },
  { id: "vellum", name: "Vélin", icon: "📃", description: "Transparent et délicat" },
  { id: "neon", name: "Néon", icon: "💡", description: "Lumineux et moderne" },
  { id: "minimal", name: "Minimal", icon: "⬜", description: "Épuré et simple" },
];

// Couleurs de cachet de cire
const WAX_SEAL_COLORS = [
  { id: "red", name: "Rouge", color: "#dc2626" },
  { id: "gold", name: "Or", color: "#f59e0b" },
  { id: "silver", name: "Argent", color: "#9ca3af" },
  { id: "black", name: "Noir", color: "#1f2937" },
  { id: "burgundy", name: "Bordeaux", color: "#7f1d1d" },
  { id: "navy", name: "Marine", color: "#1e3a8a" },
];

export function EditEnvelope({ ctx }: { ctx: any }) {
  const [activeTab, setActiveTab] = useState("elements");
  const [selectedFontCategory, setSelectedFontCategory] = useState("all");
  
  // États de l'enveloppe
  const [envelopeStyle, setEnvelopeStyle] = useState("metallic");
  const [bgColor, setBgColor] = useState("#f8fafc");
  const [borderColor, setBorderColor] = useState("#1e3a8a");
  const [textColor, setTextColor] = useState("#1f2937");
  const [fontFamily, setFontFamily] = useState("'Playfair Display', serif");
  const [fontSize, setFontSize] = useState(18);
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">("center");
  const [fontWeight, setFontWeight] = useState("normal");
  const [fontStyle, setFontStyle] = useState("normal");
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [textShadow, setTextShadow] = useState("none");
  
  // Textes de l'enveloppe
  const [recipientName, setRecipientName] = useState("{{nom}}");
  const [recipientAddress, setRecipientAddress] = useState("{{adresse}}");
  const [senderName, setSenderName] = useState("{{expéditeur}}");
  
  // Cachet de cire
  const [showWaxSeal, setShowWaxSeal] = useState(true);
  const [waxSealColor, setWaxSealColor] = useState("#dc2626");
  const [waxSealInitial, setWaxSealInitial] = useState("M");
  
  // Timbre
  const [showStamp, setShowStamp] = useState(true);
  const [stampColor, setStampColor] = useState("#dc2626");

  // Filtrer les polices par catégorie
  const getFilteredFonts = () => {
    if (selectedFontCategory === "all") return [...DEFAULT_FONTS, ...ALL_FONTS];
    if (selectedFontCategory === "default") return DEFAULT_FONTS;
    const category = FONT_CATEGORIES[selectedFontCategory as keyof typeof FONT_CATEGORIES];
    return category ? category.fonts : ALL_FONTS;
  };

  // Appliquer un modèle
  const applyTemplate = (template: any) => {
    setBgColor(template.bgColor);
    setBorderColor(template.borderColor);
    setTextColor(template.textColor);
    setFontFamily(template.fontFamily);
    setEnvelopeStyle(template.style);
  };

  // Style de prévisualisation
  const envelopePreviewStyle = {
    backgroundColor: bgColor,
    border: `8px solid ${borderColor}`,
    width: "95%",
    maxWidth: "600px",
    height: "400px",
    margin: "0 auto",
    boxShadow: `0 20px 60px rgba(0,0,0,0.15), inset 0 0 40px rgba(0,0,0,0.05)`,
    borderRadius: "12px",
    position: "relative" as const,
    overflow: "hidden",
    transition: "all 0.3s ease",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative min-h-screen">
      {/* Zone de prévisualisation - GAUCHE */}
      <div className="lg:col-span-2">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50">
          <CardHeader className="pb-4 border-b bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Mail className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">Éditeur d'Enveloppe</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Personnalisez votre enveloppe</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />Exporter
                </Button>
                <Button variant="default" size="sm">
                  <Save className="h-4 w-4 mr-2" />Sauvegarder
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gradient-to-br from-gray-50 to-white p-8" style={envelopePreviewStyle}>
              {/* Zone d'adresse destinataire */}
              <div className="absolute top-8 left-8 w-56 p-4 bg-white/90 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm">
                <div style={{ fontFamily, fontSize: `${fontSize}px`, color: textColor, textAlign, fontWeight, fontStyle, letterSpacing: `${letterSpacing}px`, textShadow }}>
                  <div className="font-semibold">{recipientName}</div>
                  <div className="text-sm mt-1 opacity-80">{recipientAddress}</div>
                </div>
              </div>
              
              {/* Timbre */}
              {showStamp && (
                <div className="absolute top-8 right-8 w-16 h-20 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-lg" style={{ backgroundColor: stampColor }}>
                  <Stamp className="h-6 w-6" />
                </div>
              )}
              
              {/* Expéditeur */}
              <div className="absolute bottom-8 left-8 text-sm" style={{ fontFamily, color: textColor, opacity: 0.7 }}>
                {senderName}
              </div>
              
              {/* Cachet de cire */}
              {showWaxSeal && (
                <div className="absolute bottom-8 right-8 w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-xl" style={{ backgroundColor: waxSealColor }}>
                  {waxSealInitial}
                </div>
              )}
              
              {/* Indicateur de style */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                <Badge variant="secondary" className="bg-black/70 text-white">
                  {ENVELOPE_STYLES.find(s => s.id === envelopeStyle)?.name}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Panneau de contrôle - DROITE */}
      <div className="space-y-4 h-[700px]">
        <Card className="border-0 shadow-lg bg-gradient-to-b from-white to-gray-50/50 overflow-hidden h-full">
          <CardContent className="p-0 h-full flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col">
              <div className="border-b bg-gradient-to-r from-gray-50 to-white">
                <TabsList className="grid grid-cols-3 w-full bg-transparent p-0 h-12">
                  <TabsTrigger value="elements" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-purple-500 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
                    <Zap className="h-4 w-4 mr-2" />Éléments
                  </TabsTrigger>
                  <TabsTrigger value="templates" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-purple-500 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
                    <Layout className="h-4 w-4 mr-2" />Modèles
                  </TabsTrigger>
                  <TabsTrigger value="properties" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-purple-500 data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700">
                    <Settings className="h-4 w-4 mr-2" />Propriétés
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Onglet Éléments */}
              <TabsContent value="elements" className="p-4 space-y-4 m-0 flex-1 overflow-y-auto">
                {/* Style d'enveloppe */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Style d'enveloppe</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {ENVELOPE_STYLES.map((style) => (
                      <Button key={style.id} variant={envelopeStyle === style.id ? "default" : "outline"}
                        className="h-auto py-3 flex flex-col items-center gap-1"
                        onClick={() => setEnvelopeStyle(style.id)}>
                        <span className="text-lg">{style.icon}</span>
                        <span className="text-xs font-medium">{style.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Couleurs */}
                <div className="space-y-3 pt-4 border-t">
                  <Label className="text-sm font-semibold">Couleur de fond</Label>
                  <div className="flex gap-2">
                    <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)}
                      className="h-10 w-10 rounded-lg border-2 cursor-pointer" />
                    <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="flex-1 h-10" />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Couleur des bordures</Label>
                  <div className="flex gap-2">
                    <input type="color" value={borderColor} onChange={(e) => setBorderColor(e.target.value)}
                      className="h-10 w-10 rounded-lg border-2 cursor-pointer" />
                    <Input value={borderColor} onChange={(e) => setBorderColor(e.target.value)} className="flex-1 h-10" />
                  </div>
                </div>

                {/* Cachet et Timbre */}
                <div className="space-y-3 pt-4 border-t">
                  <Label className="text-sm font-semibold">Éléments décoratifs</Label>
                  <div className="flex gap-2">
                    <Button variant={showWaxSeal ? "default" : "outline"} size="sm" onClick={() => setShowWaxSeal(!showWaxSeal)}>
                      <Award className="h-4 w-4 mr-1" />Cachet
                    </Button>
                    <Button variant={showStamp ? "default" : "outline"} size="sm" onClick={() => setShowStamp(!showStamp)}>
                      <Stamp className="h-4 w-4 mr-1" />Timbre
                    </Button>
                  </div>
                </div>

                {showWaxSeal && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Couleur du cachet</Label>
                    <div className="flex flex-wrap gap-2">
                      {WAX_SEAL_COLORS.map((c) => (
                        <button key={c.id} onClick={() => setWaxSealColor(c.color)}
                          className={`w-8 h-8 rounded-full border-2 ${waxSealColor === c.color ? 'ring-2 ring-offset-2 ring-purple-500' : ''}`}
                          style={{ backgroundColor: c.color }} title={c.name} />
                      ))}
                    </div>
                    <div className="flex gap-2 items-center">
                      <Label className="text-xs">Initiale:</Label>
                      <Input value={waxSealInitial} onChange={(e) => setWaxSealInitial(e.target.value.charAt(0).toUpperCase())}
                        className="w-16 h-8 text-center font-bold" maxLength={1} />
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Onglet Modèles */}
              <TabsContent value="templates" className="p-4 m-0 flex-1 overflow-y-auto">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">Modèles d'Enveloppe</Label>
                    <Badge variant="secondary" className="text-xs">{ENVELOPE_TEMPLATES.length} modèles</Badge>
                  </div>
                  <ScrollArea className="h-[500px]">
                    <div className="grid grid-cols-1 gap-3 pr-2">
                      {ENVELOPE_TEMPLATES.map((template) => (
                        <div key={template.id} onClick={() => applyTemplate(template)}
                          className="group cursor-pointer rounded-xl border-2 border-gray-200 hover:border-purple-400 transition-all duration-300 overflow-hidden">
                          <div className="h-20 relative flex items-center justify-center" style={{ backgroundColor: template.bgColor, borderBottom: `4px solid ${template.borderColor}` }}>
                            <span style={{ fontFamily: template.fontFamily, color: template.textColor, fontSize: "14px" }} className="text-center px-2">
                              {template.name}
                            </span>
                          </div>
                          <div className="p-3 bg-white">
                            <h4 className="font-semibold text-sm text-gray-900">{template.name}</h4>
                            <p className="text-xs text-gray-500 mt-1">{template.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>

              {/* Onglet Propriétés */}
              <TabsContent value="properties" className="p-4 m-0 flex-1 overflow-y-auto">
                <ScrollArea className="h-[550px] pr-2">
                  <div className="space-y-4">
                    <div className="border-b pb-3">
                      <h3 className="font-bold text-lg text-gray-900">Propriétés du texte</h3>
                      <p className="text-sm text-gray-600">Personnalisez l'apparence</p>
                    </div>

                    {/* Textes */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Nom du destinataire</Label>
                      <Input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="{{nom}}" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Adresse</Label>
                      <Input value={recipientAddress} onChange={(e) => setRecipientAddress(e.target.value)} placeholder="{{adresse}}" />
                    </div>
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Expéditeur</Label>
                      <Input value={senderName} onChange={(e) => setSenderName(e.target.value)} placeholder="{{expéditeur}}" />
                    </div>

                    {/* Catégorie de police */}
                    <div className="space-y-3 pt-4 border-t">
                      <Label className="text-sm font-medium">Catégorie de police</Label>
                      <Select value={selectedFontCategory} onValueChange={setSelectedFontCategory}>
                        <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes les polices</SelectItem>
                          <SelectItem value="default">Polices système</SelectItem>
                          {Object.entries(FONT_CATEGORIES).map(([key, cat]) => (
                            <SelectItem key={key} value={key}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Sélecteur de police */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Police ({getFilteredFonts().length})</Label>
                      <Select value={fontFamily} onValueChange={setFontFamily}>
                        <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {getFilteredFonts().map((font: any) => (
                            <SelectItem key={font.name} value={font.value}>
                              <div className="flex flex-col">
                                <span style={{ fontFamily: font.value }} className="text-sm">{font.name}</span>
                                {font.description && <span className="text-[10px] text-gray-400">{font.description}</span>}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Taille et couleur */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Taille</Label>
                        <Input type="number" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="h-10" />
                      </div>
                      <div>
                        <Label className="text-sm font-medium mb-2 block">Couleur</Label>
                        <div className="flex gap-2">
                          <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="h-10 w-10 rounded-lg border cursor-pointer" />
                          <Input value={textColor} onChange={(e) => setTextColor(e.target.value)} className="flex-1 h-10 font-mono text-xs" />
                        </div>
                      </div>
                    </div>

                    {/* Style du texte */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Style</Label>
                      <div className="flex gap-2">
                        <Button variant={fontWeight === "bold" ? "default" : "outline"} size="sm"
                          onClick={() => setFontWeight(fontWeight === "bold" ? "normal" : "bold")}>
                          <Bold className="h-4 w-4" />
                        </Button>
                        <Button variant={fontStyle === "italic" ? "default" : "outline"} size="sm"
                          onClick={() => setFontStyle(fontStyle === "italic" ? "normal" : "italic")}>
                          <Italic className="h-4 w-4" />
                        </Button>
                        <Button variant={textAlign === "left" ? "default" : "outline"} size="sm" onClick={() => setTextAlign("left")}>
                          <AlignLeft className="h-4 w-4" />
                        </Button>
                        <Button variant={textAlign === "center" ? "default" : "outline"} size="sm" onClick={() => setTextAlign("center")}>
                          <AlignCenter className="h-4 w-4" />
                        </Button>
                        <Button variant={textAlign === "right" ? "default" : "outline"} size="sm" onClick={() => setTextAlign("right")}>
                          <AlignRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Espacement des lettres */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Espacement lettres: {letterSpacing}px</Label>
                      <input type="range" min="-5" max="20" value={letterSpacing} onChange={(e) => setLetterSpacing(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                    </div>

                    {/* Ombre du texte */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Ombre du texte</Label>
                      <Select value={textShadow} onValueChange={setTextShadow}>
                        <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Aucune</SelectItem>
                          <SelectItem value="1px 1px 2px rgba(0,0,0,0.3)">Légère</SelectItem>
                          <SelectItem value="2px 2px 4px rgba(0,0,0,0.4)">Moyenne</SelectItem>
                          <SelectItem value="3px 3px 6px rgba(0,0,0,0.5)">Forte</SelectItem>
                          <SelectItem value="0 0 10px #ff00ff, 0 0 20px #ff00ff">Néon Rose</SelectItem>
                          <SelectItem value="0 0 10px #00ffff, 0 0 20px #00ffff">Néon Cyan</SelectItem>
                          <SelectItem value="0 0 10px #ffd700, 0 0 20px #ffd700">Néon Or</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
