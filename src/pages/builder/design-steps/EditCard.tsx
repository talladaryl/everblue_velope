// design-steps/EditCard.tsx
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Plus,
  Image as ImageIcon,
  Type,
  Trash2,
  Palette,
  Move,
  Settings,
  Zap,
  Layout,
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Crop,
  Square,
  Circle,
  Image as ImageIcon2,
  Download,
  Upload,
  Loader2,
  Sparkles,
} from "lucide-react";
import { TextVariablesPanel } from "./components/TextVariablesPanel";
import { useGroqChat } from "@/hooks/useGroqChat";

// Templates unifiés
const UNIFIED_TEMPLATES = [
  // Templates professionnels
  {
    id: "corporate-1",
    name: "Corporate Élégant",
    description: "Design professionnel pour entreprises",
    category: "business",
    colors: ["#1e3a8a", "#ffffff"],
    pattern: "split",
    message: "Carte de Visite Professionnelle",
    style: "minimal",
    bgColor:
      "linear-gradient(90deg, #1e3a8a 0%, #1e3a8a 50%, #ffffff 50%, #ffffff 100%)",
    items: [
      {
        id: "text-1",
        type: "text",
        text: "Carte de Visite Professionnelle",
        x: 50,
        y: 80,
        fontSize: 18,
        color: "#1f2937",
        fontFamily: "'Inter', sans-serif",
        fontWeight: "bold",
        textAlign: "center",
      },
    ],
    isCustom: false,
    popularity: 95,
  },
  {
    id: "luxury-1",
    name: "Luxe Moderne",
    description: "Design premium et élégant",
    category: "premium",
    colors: ["#000000", "#d4af37"],
    pattern: "gradient",
    message: "Collection Exclusive",
    style: "luxury",
    bgColor: "linear-gradient(135deg, #000000 0%, #d4af37 100%)",
    items: [
      {
        id: "text-1",
        type: "text",
        text: "Collection Exclusive",
        x: 50,
        y: 80,
        fontSize: 22,
        color: "#d4af37",
        fontFamily: "'Playfair Display', serif",
        fontWeight: "bold",
        textAlign: "center",
      },
    ],
    isCustom: false,
    popularity: 92,
  },
  // Templates d'anniversaire
  {
    id: "birthday-1",
    name: "Anniversaire Joyeux",
    description: "Carte festive pour célébrer un anniversaire",
    category: "birthday",
    colors: ["#ae4243", "#ff6b6b", "#ee5253", "#feca57"],
    pattern: "gradient",
    message: "Joyeux Anniversaire!",
    style: "festive",
    bgColor: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    items: [
      {
        id: "text-1",
        type: "text",
        text: "Joyeux Anniversaire!",
        x: 50,
        y: 50,
        fontSize: 26,
        color: "#ffffff",
        fontFamily: "'Dancing Script', cursive",
        fontWeight: "bold",
        textAlign: "center",
      },
    ],
    isCustom: false,
    popularity: 92,
    hasEnvelope: true,
  },
  {
    id: "birthday-2",
    name: "Fête Colorée",
    description: "Anniversaire avec des couleurs vibrantes",
    category: "birthday",
    colors: ["#ff6b6b", "#feca57", "#48dbfb", "#ff9ff3"],
    pattern: "gradient",
    message: "Bon Anniversaire!",
    style: "colorful",
    bgColor: "linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)",
    items: [
      {
        id: "text-1",
        type: "text",
        text: "Bon Anniversaire!",
        x: 50,
        y: 50,
        fontSize: 24,
        color: "#ffffff",
        fontFamily: "'Poppins', sans-serif",
        fontWeight: "bold",
        textAlign: "center",
      },
    ],
    isCustom: false,
    popularity: 88,
    hasEnvelope: true,
  },
  // Templates d'amour
  {
    id: "love-1",
    name: "Carte d'Amour",
    description: "Carte romantique pour déclarer votre flamme",
    category: "love",
    colors: ["#0077B2", "#D00000", "#ffffff", "#f8f6f7"],
    pattern: "gradient",
    message: "Je t'aime",
    style: "romantic",
    bgColor: "linear-gradient(135deg, #ff6b6b 0%, #f06292 100%)",
    items: [
      {
        id: "text-1",
        type: "text",
        text: "Je t'aime",
        x: 50,
        y: 50,
        fontSize: 30,
        color: "#ffffff",
        fontFamily: "'Great Vibes', cursive",
        fontWeight: "bold",
        textAlign: "center",
      },
    ],
    isCustom: false,
    popularity: 96,
    hasEnvelope: true,
  },
  {
    id: "valentine-1",
    name: "Saint-Valentin",
    description: "Carte spéciale pour la fête des amoureux",
    category: "love",
    colors: ["#ff4d4d", "#ff8080", "#ff6666", "#ffffff"],
    pattern: "gradient",
    message: "Bonne Saint-Valentin",
    style: "romantic",
    bgColor: "linear-gradient(135deg, #ff4d4d 0%, #ff8080 100%)",
    items: [
      {
        id: "text-1",
        type: "text",
        text: "Bonne Saint-Valentin",
        x: 50,
        y: 50,
        fontSize: 24,
        color: "#ffffff",
        fontFamily: "'Alex Brush', cursive",
        fontWeight: "bold",
        textAlign: "center",
      },
    ],
    isCustom: false,
    popularity: 94,
    hasEnvelope: true,
  },
];

export function EditCard({ ctx }: { ctx: any }) {
  const {
    canvasRef,
    onMouseMove,
    onMouseUp,
    onMouseDown,
    items = [],
    selectedId,
    setSelectedId,
    addText,
    setShowImagePicker,
    removeSelected,
    setItems,
    bgColor = "#ffffff",
    setBgColor,
    setBgImage,
    bgImage,
  } = ctx;

  const [activeTab, setActiveTab] = useState("elements");
  const [showVariables, setShowVariables] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showBackgroundPicker, setShowBackgroundPicker] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Utilisation du hook Groq Chat
  const { messages: chatMessages, isLoading, sendMessage } = useGroqChat(ctx);

  const selected = items.find((i: any) => i.id === selectedId) ?? null;

  // Fonction pour envoyer un message
  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;
    await sendMessage(userInput);
    setUserInput("");
  };

  // Gestion de la touche Entrée
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Gestion simplifiée du drag & drop pour mobile
  const handleTouchStart = (e: React.TouchEvent, itemId: string) => {
    try {
      e.preventDefault();
      setSelectedId(itemId);
      setIsDragging(true);
    } catch (error) {
      console.error("Erreur touch start:", error);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !selectedId) return;
    try {
      e.preventDefault();
    } catch (error) {
      console.error("Erreur touch move:", error);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Appliquer un modèle professionnel
  const applyProfessionalTemplate = (template: any) => {
    setBgColor(template.bgColor);
    setBgImage(null);

    // Effacer les éléments existants et ajouter ceux du template
    setItems(template.items || []);
  };

  // Fonctions pour les propriétés d'image
  const updateImageProperty = (property: string, value: any) => {
    setItems((prev: any[]) =>
      prev.map((item: any) =>
        item.id === selectedId ? { ...item, [property]: value } : item
      )
    );
  };

  const setImageAsBackground = () => {
    if (selected?.src) {
      setBgImage(selected.src);
      removeSelected();
    }
  };

  // Gestion de l'upload d'image
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;

        const newItem = {
          id: `image-${Date.now()}`,
          type: "image",
          src: imageUrl,
          x: 100,
          y: 100,
          width: 150,
          height: 150,
          borderRadius: 0,
          crop: "none",
          opacity: 100,
        };

        setItems((prev: any[]) => [...prev, newItem]);
        setSelectedId(newItem.id);
      };
      reader.readAsDataURL(file);
    }
  };

  // Style de papier professionnel amélioré
  const paperStyle = {
    backgroundColor: bgColor,
    backgroundImage: bgImage
      ? `url(${bgImage})`
      : bgColor.includes("gradient")
      ? bgColor
      : "none",
    backgroundSize: "cover",
    width: "95%",
    maxWidth: "600px",
    height: "400px",
    margin: "0 auto",
    boxShadow: `
      inset 0 0 40px rgba(0,0,0,0.08),
      0 12px 40px rgba(0,0,0,0.15),
      0 0 0 1px rgba(0,0,0,0.08)
    `,
    border: "1px solid rgba(0,0,0,0.1)",
    borderRadius: "16px",
    position: "relative" as const,
    overflow: "hidden",
    transition: "all 0.3s ease",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative min-h-screen">
      {/* Zone de design principale - Design amélioré */}
      <div className="lg:col-span-2">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50">
          <CardHeader className="pb-4 border-b bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Éditeur de Carte Professionnelle
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Créez des designs époustouflants en quelques clics
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white/80 px-3 py-2 rounded-full border">
                <Move className="h-4 w-4" />
                <span className="hidden sm:inline">Glissez pour déplacer</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div
              ref={canvasRef}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="relative rounded-2xl border-2 border-dashed border-gray-200 bg-gradient-to-br from-gray-50 to-white overflow-hidden mx-auto transition-all duration-300 hover:border-gray-300 hover:shadow-xl"
              style={paperStyle}
            >
              {items.map((it: any) => (
                <div
                  key={it.id}
                  onMouseDown={(e: any) => onMouseDown(e, it.id)}
                  onTouchStart={(e) => handleTouchStart(e, it.id)}
                  onClick={() => setSelectedId(it.id)}
                  className={`absolute cursor-move transition-all duration-200 p-1 ${
                    selectedId === it.id
                      ? "ring-3 ring-blue-500 ring-offset-2 rounded-lg z-10 transform scale-105"
                      : "hover:ring-2 hover:ring-blue-300 hover:ring-offset-1 rounded-lg hover:scale-102"
                  }`}
                  style={{
                    left: it.x,
                    top: it.y,
                    borderRadius:
                      it.type === "image" ? `${it.borderRadius}px` : "12px",
                  }}
                >
                  {it.type === "text" ? (
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        try {
                          setItems((prev: any[]) =>
                            prev.map((p: any) =>
                              p.id === it.id
                                ? { ...p, text: e.currentTarget.innerText }
                                : p
                            )
                          );
                        } catch (error) {
                          console.error("Erreur édition texte:", error);
                        }
                      }}
                      className="outline-none min-w-[80px] bg-white/90 backdrop-blur-md rounded-xl px-4 py-3 shadow-xl border border-white/60 transition-all duration-200 hover:bg-white hover:shadow-2xl"
                      style={{
                        color: it.color || "#000000",
                        fontSize: it.fontSize || "16px",
                        fontFamily: it.fontFamily || "Arial",
                        fontWeight: it.fontWeight || "normal",
                        textShadow: it.animation
                          ? "0 2px 8px rgba(0,0,0,0.2)"
                          : "none",
                      }}
                    >
                      {it.text || "Texte"}
                    </div>
                  ) : (
                    <img
                      src={it.src}
                      alt=""
                      draggable={false}
                      className="shadow-xl border-2 border-white/60 object-cover transition-all duration-200 hover:shadow-2xl hover:border-white/80"
                      style={{
                        width: it.width || "100px",
                        height: it.height || "100px",
                        borderRadius: it.borderRadius
                          ? `${it.borderRadius}px`
                          : "12px",
                        opacity: (it.opacity || 100) / 100,
                      }}
                    />
                  )}
                </div>
              ))}

              {items.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gradient-to-br from-transparent to-white/50">
                  <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60">
                    <ImageIcon2 className="h-16 w-16 mx-auto mb-4 opacity-60 text-gray-400" />
                    <p className="text-lg font-medium text-gray-600 mb-2">
                      Carte vierge
                    </p>
                    <p className="text-sm text-gray-500 max-w-xs">
                      Commencez par ajouter du contenu ou choisissez un modèle
                      professionnel
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Panneau de contrôle sur le côté - Design amélioré */}
      <div className="space-y-4">
        <Card className="border-0 shadow-lg bg-gradient-to-b from-white to-gray-50/50 overflow-hidden">
          <CardContent className="p-0">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="border-b bg-gradient-to-r from-gray-50 to-white">
                <TabsList className="grid grid-cols-3 w-full bg-transparent p-0 h-12">
                  <TabsTrigger
                    value="elements"
                    className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 font-medium transition-all"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Éléments
                  </TabsTrigger>
                  <TabsTrigger
                    value="background"
                    className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 font-medium transition-all"
                  >
                    <Palette className="h-4 w-4 mr-2" />
                    Fond
                  </TabsTrigger>
                  <TabsTrigger
                    value="properties"
                    className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 font-medium transition-all"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Propriétés
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="elements" className="p-4 space-y-4 m-0">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={addText}
                    className="flex flex-col items-center gap-2 h-auto py-4 border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 rounded-xl"
                  >
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Type className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium">Texte</span>
                  </Button>

                  <label className="flex flex-col items-center gap-2 h-auto py-4 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-green-300 hover:bg-green-50 transition-all duration-200">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Upload className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="text-sm font-medium">Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>

                  <Button
                    variant="outline"
                    onClick={() => setShowVariables(true)}
                    className="flex flex-col items-center gap-2 h-auto py-4 border-2 border-dashed border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 rounded-xl col-span-2"
                  >
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Plus className="h-5 w-5 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium">
                      Variables de texte
                    </span>
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="background" className="p-4 space-y-4 m-0">
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    Couleur de fond
                  </Label>
                  <div className="flex gap-2">
                    <div className="relative">
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => {
                          setBgColor(e.target.value);
                          setBgImage?.(null);
                        }}
                        className="h-12 w-12 rounded-xl border-2 border-gray-200 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                      />
                    </div>
                    <Input
                      value={bgColor}
                      onChange={(e) => {
                        setBgColor(e.target.value);
                        setBgImage?.(null);
                      }}
                      placeholder="#ffffff"
                      className="flex-1 h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500"
                    />
                  </div>
                </div>

                <Button
                  onClick={() => setShowBackgroundPicker(true)}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Layout className="h-4 w-4 mr-2" />
                  Modèles Professionnels
                </Button>

                <label className="flex items-center justify-center gap-3 w-full h-12 py-2 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
                  <ImageIcon className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Image de fond personnalisée
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          setBgImage(e.target?.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </TabsContent>

              <TabsContent value="properties" className="p-4 space-y-4 m-0">
                {selected ? (
                  <div className="space-y-4">
                    {selected.type === "text" ? (
                      <>
                        <div>
                          <Label className="text-sm font-medium mb-2 block">
                            Contenu du texte
                          </Label>
                          <Input
                            value={selected.text || ""}
                            onChange={(e) =>
                              setItems((prev: any[]) =>
                                prev.map((p: any) =>
                                  p.id === selected.id
                                    ? { ...p, text: e.target.value }
                                    : p
                                )
                              )
                            }
                            className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-sm font-medium mb-2 block">
                              Taille de police
                            </Label>
                            <Input
                              type="number"
                              value={selected.fontSize || 16}
                              onChange={(e) =>
                                setItems((prev: any[]) =>
                                  prev.map((p: any) =>
                                    p.id === selected.id
                                      ? {
                                          ...p,
                                          fontSize: Number(e.target.value),
                                        }
                                      : p
                                  )
                                )
                              }
                              className="h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <Label className="text-sm font-medium mb-2 block">
                              Couleur
                            </Label>
                            <div className="relative">
                              <input
                                type="color"
                                value={selected.color || "#000000"}
                                onChange={(e) =>
                                  setItems((prev: any[]) =>
                                    prev.map((p: any) =>
                                      p.id === selected.id
                                        ? { ...p, color: e.target.value }
                                        : p
                                    )
                                  )
                                }
                                className="h-12 w-full rounded-xl border-2 border-gray-200 cursor-pointer"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium mb-2 block">
                            Famille de police
                          </Label>
                          <select
                            value={selected.fontFamily || "Arial"}
                            onChange={(e) =>
                              setItems((prev: any[]) =>
                                prev.map((p: any) =>
                                  p.id === selected.id
                                    ? { ...p, fontFamily: e.target.value }
                                    : p
                                )
                              )
                            }
                            className="w-full h-12 rounded-xl border-2 border-gray-200 bg-background px-3 py-2 text-sm focus:border-blue-500"
                          >
                            <optgroup label="Professionnelles">
                              <option value="'Inter', sans-serif">Inter</option>
                              <option value="'Roboto', sans-serif">
                                Roboto
                              </option>
                              <option value="'Helvetica', sans-serif">
                                Helvetica
                              </option>
                            </optgroup>
                            <optgroup label="Élégantes">
                              <option value="'Playfair Display', serif">
                                Playfair Display
                              </option>
                              <option value="'Cormorant Garamond', serif">
                                Cormorant
                              </option>
                              <option value="'Lora', serif">Lora</option>
                            </optgroup>
                            <optgroup label="Modernes">
                              <option value="'Poppins', sans-serif">
                                Poppins
                              </option>
                              <option value="'Montserrat', sans-serif">
                                Montserrat
                              </option>
                              <option value="'Space Grotesk', sans-serif">
                                Space Grotesk
                              </option>
                            </optgroup>
                          </select>
                        </div>
                      </>
                    ) : (
                      // Propriétés pour les images
                      <>
                        <div>
                          <Label className="text-sm font-medium mb-2 block">
                            Bordure arrondie
                          </Label>
                          <div className="flex items-center gap-3">
                            <input
                              type="range"
                              min="0"
                              max="50"
                              value={selected.borderRadius || 0}
                              onChange={(e) =>
                                updateImageProperty(
                                  "borderRadius",
                                  Number(e.target.value)
                                )
                              }
                              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                            />
                            <span className="text-sm font-medium w-12 text-center bg-gray-100 px-2 py-1 rounded-lg">
                              {selected.borderRadius || 0}px
                            </span>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium mb-2 block">
                            Forme de l'image
                          </Label>
                          <div className="flex gap-2">
                            <Button
                              variant={
                                selected.crop === "none" ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() =>
                                updateImageProperty("crop", "none")
                              }
                              className="flex-1 h-12 rounded-xl border-2 data-[state=active]:bg-blue-100 data-[state=active]:border-blue-500 data-[state=active]:text-blue-700"
                            >
                              <Square className="h-4 w-4 mr-2" />
                              Carré
                            </Button>
                            <Button
                              variant={
                                selected.crop === "circle"
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() =>
                                updateImageProperty("crop", "circle")
                              }
                              className="flex-1 h-12 rounded-xl border-2 data-[state=active]:bg-blue-100 data-[state=active]:border-blue-500 data-[state=active]:text-blue-700"
                            >
                              <Circle className="h-4 w-4 mr-2" />
                              Cercle
                            </Button>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium mb-2 block">
                            Opacité
                          </Label>
                          <div className="flex items-center gap-3">
                            <input
                              type="range"
                              min="10"
                              max="100"
                              value={selected.opacity || 100}
                              onChange={(e) =>
                                updateImageProperty(
                                  "opacity",
                                  Number(e.target.value)
                                )
                              }
                              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                            />
                            <span className="text-sm font-medium w-12 text-center bg-gray-100 px-2 py-1 rounded-lg">
                              {selected.opacity || 100}%
                            </span>
                          </div>
                        </div>

                        <Button
                          onClick={setImageAsBackground}
                          className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          <Layout className="h-4 w-4 mr-2" />
                          Utiliser comme fond d'écran
                        </Button>
                      </>
                    )}

                    <Button
                      variant="destructive"
                      onClick={removeSelected}
                      className="w-full h-12 mt-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer l'élément
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-dashed border-gray-200">
                    <Settings className="h-12 w-12 mx-auto mb-3 opacity-40 text-gray-400" />
                    <p className="text-base font-medium text-gray-600 mb-1">
                      Aucun élément sélectionné
                    </p>
                    <p className="text-sm text-gray-500 max-w-xs mx-auto">
                      Cliquez sur un élément dans l'éditeur pour modifier ses
                      propriétés
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Panneau des variables */}
        {showVariables && (
          <TextVariablesPanel
            ctx={ctx}
            onClose={() => setShowVariables(false)}
          />
        )}
      </div>

      {/* Bouton flottant du chatbot amélioré */}
      {!isChatOpen && (
        <Button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 h-16 w-16 rounded-2xl shadow-2xl z-40 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-0 group transition-all duration-300 hover:scale-110"
          size="icon"
        >
          <div className="relative">
            <MessageCircle className="h-7 w-7 text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
          </div>
        </Button>
      )}

      {/* Fenêtre du chatbot améliorée */}
      {isChatOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden">
          {/* Header du chat amélioré */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <span className="font-bold text-lg">Assistant Design</span>
                <p className="text-blue-100 text-sm">IA créative</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsChatOpen(false)}
              className="h-8 w-8 text-white hover:bg-white/20 rounded-xl"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages du chat améliorés */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 transition-all duration-200 ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                      : "bg-white border border-gray-200 text-gray-800 shadow-lg"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {message.role === "assistant" ? (
                      <Bot className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                    <span className="text-xs font-medium opacity-80">
                      {message.role === "assistant" ? "Assistant IA" : "Vous"}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </p>
                  <span className="text-xs opacity-60 block mt-2 text-right">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl p-4 bg-white border border-gray-200 shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="h-4 w-4" />
                    <span className="text-xs font-medium opacity-70">
                      Assistant IA
                    </span>
                    <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
                  </div>
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input du chat amélioré */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Décrivez votre carte professionnelle..."
                className="flex-1 h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 bg-gray-50"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!userInput.trim() || isLoading}
                className="h-12 w-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                size="icon"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              💡 Exemple : "Carte corporate sobre avec logo et coordonnées"
            </p>
          </div>
        </div>
      )}

      {/* Modal des modèles professionnels amélioré */}
      {showBackgroundPicker && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden border border-gray-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Modèles Professionnels
                </h3>
                <p className="text-gray-600 mt-1">
                  Choisissez un design adapté à vos besoins
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowBackgroundPicker(false)}
                className="h-10 w-10 rounded-xl hover:bg-gray-200"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {UNIFIED_TEMPLATES.map((template) => (
                  <div
                    key={template.id}
                    className="cursor-pointer group border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-blue-500 hover:shadow-2xl transition-all duration-300 bg-white"
                    onClick={() => {
                      applyProfessionalTemplate(template);
                      setShowBackgroundPicker(false);
                    }}
                  >
                    <div
                      className="w-full h-40 relative group-hover:scale-105 transition-transform duration-300"
                      style={{
                        background: template.bgColor,
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className="text-center px-4 py-3 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg m-4"
                          style={{
                            color: template.colors[0],
                            fontFamily:
                              template.style === "luxury"
                                ? "'Playfair Display', serif"
                                : "'Inter', sans-serif",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          {template.message}
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
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-center">
                <Button
                  onClick={() => setShowBackgroundPicker(false)}
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
