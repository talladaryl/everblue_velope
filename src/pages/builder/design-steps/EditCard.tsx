import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
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
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Filter,
  Video,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";
import { TextVariablesPanel } from "./components/TextVariablesPanel";
import { useGroqChat } from "@/hooks/useGroqChat";
import {
  PROFESSIONAL_TEMPLATES,
  BORDER_STYLES,
  IMAGES,
} from "@/constants/designConstants";

// Templates unifiés
const UNIFIED_TEMPLATES = [
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
];

export function EditCard({ ctx }: { ctx: any }) {
  const { t } = useLanguage();
  const { theme } = useTheme();
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
  const chatMessagesEndRef = React.useRef<HTMLDivElement>(null);
  const previousActiveTabRef = React.useRef(activeTab);

  // Sauvegarder l'onglet actif pour éviter les changements non désirés
  React.useEffect(() => {
    previousActiveTabRef.current = activeTab;
  }, [activeTab]);

  // Utilisation du hook Groq Chat
  const {
    messages: chatMessages,
    isLoading,
    sendMessage,
    improvementState,
    applyImprovements,
    revertToOriginal,
  } = useGroqChat(ctx);

  // Scroll automatique vers le bas quand un nouveau message arrive
  React.useEffect(() => {
    if (isChatOpen && chatMessagesEndRef.current) {
      chatMessagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isChatOpen]);

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
    setItems(template.items || []);
  };

  // Fonction générique pour mettre à jour les propriétés
  // Ne change PAS l'onglet actif - reste sur "properties"
  const updateItemProperty = (property: string, value: any) => {
    setItems((prev: any[]) =>
      prev.map((item: any) =>
        item.id === selectedId ? { ...item, [property]: value } : item
      )
    );
    // Garder l'onglet "properties" actif après modification
    // Ne pas changer activeTab ici
  };

  const setImageAsBackground = () => {
    if (selected?.src) {
      setBgImage(selected.src);
      removeSelected();
    }
  };

  // Gestion de l'upload de médias
  const handleMediaUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    mediaType: "image" | "video" | "gif"
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const mediaUrl = e.target?.result as string;

        const newItem: any = {
          id: `${mediaType}-${Date.now()}`,
          type: mediaType,
          src: mediaUrl,
          x: 100,
          y: 100,
          width: mediaType === "video" ? 200 : 150,
          height: mediaType === "video" ? 150 : 150,
          borderRadius: 0,
          opacity: 100,
          rotation: 0,
          flipX: false,
          flipY: false,
          shadow: {
            enabled: false,
            color: "#000000",
            blur: 5,
            offsetX: 2,
            offsetY: 2,
          },
          filters: {
            brightness: 100,
            contrast: 100,
            saturation: 100,
            blur: 0,
            grayscale: 0,
          },
        };

        if (mediaType === "video") {
          newItem.autoPlay = false;
          newItem.loop = false;
          newItem.muted = true;
          newItem.playing = false;
        }

        if (mediaType === "gif") {
          newItem.animated = true;
          newItem.playing = true;
        }

        setItems((prev: any[]) => [...prev, newItem]);
        setSelectedId(newItem.id);
      };
      reader.readAsDataURL(file);
    }
  };

  // Contrôles vidéo/GIF
  const toggleMediaPlayback = () => {
    if (selected && (selected.type === "video" || selected.type === "gif")) {
      updateItemProperty("playing", !selected.playing);
    }
  };

  const toggleMute = () => {
    if (selected && selected.type === "video") {
      updateItemProperty("muted", !selected.muted);
    }
  };

  // Style de papier professionnel amélioré
  // Style de papier premium Greenvelope
  const PAPER_TEXTURE = `url("data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`;

  const paperStyle = {
    backgroundColor: bgImage ? "transparent" : bgColor || "#FAF8F4",
    backgroundImage: bgImage
      ? `url(${bgImage}), ${PAPER_TEXTURE}`
      : bgColor.includes("gradient")
      ? `${bgColor}, ${PAPER_TEXTURE}`
      : `${bgColor || "#FAF8F4"}, ${PAPER_TEXTURE}`,
    backgroundBlendMode: bgImage ? "overlay, multiply" : "normal, multiply",
    backgroundSize: bgImage ? "cover, auto" : "cover, auto",
    width: "95%",
    maxWidth: "600px",
    height: "400px",
    margin: "0 auto",
    boxShadow: `
    /* Ombres externes pour profondeur */
    0 20px 60px rgba(0, 0, 0, 0.08),
    0 5px 20px rgba(0, 0, 0, 0.04),
    0 1px 5px rgba(0, 0, 0, 0.02),
    
    /* Ombres internes pour effet bordure et texture */
    inset 0 0 0 1px rgba(255, 255, 255, 0.6),
    inset 0 0 60px rgba(0, 0, 0, 0.02),
    inset 0 0 20px rgba(0, 0, 0, 0.01),
    
    /* Effet d'épaisseur du carton */
    0 0 0 1px #E8E4DC,
    0 0 0 2px rgba(255, 255, 255, 0.8),
    
    /* Légère ombre portée raffinée */
    0 4px 12px rgba(0, 0, 0, 0.05)
  `,
    border: "none", // Pas de border traditionnelle
    borderRadius: "0px", // Bords carrés comme demandé
    position: "relative" as const,
    overflow: "hidden",
    transition: "all 0.3s ease",

    /* Effets visuels supplémentaires */
    backdropFilter: "blur(0.3px)",

    /* Pseudo-élément pour effet de grain plus sophistiqué */
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `
      repeating-linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.03) 0px,
        rgba(255, 255, 255, 0.03) 1px,
        transparent 1px,
        transparent 3px
      ),
      repeating-linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.01) 0px,
        rgba(0, 0, 0, 0.01) 1px,
        transparent 1px,
        transparent 3px
      )
    `,
      pointerEvents: "none",
      zIndex: 1,
      mixBlendMode: "overlay",
      opacity: 0.3,
    },

    /* Effet de bord "coupé net" avec léger dégradé */
    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      border: "2px solid transparent",
      background: `
      linear-gradient(
        to right,
        rgba(255, 255, 255, 0.2) 0%,
        rgba(255, 255, 255, 0.1) 15%,
        transparent 50%,
        rgba(255, 255, 255, 0.1) 85%,
        rgba(255, 255, 255, 0.2) 100%
      ) border-box,
      linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0.2) 0%,
        rgba(255, 255, 255, 0.1) 15%,
        transparent 50%,
        rgba(255, 255, 255, 0.1) 85%,
        rgba(255, 255, 255, 0.2) 100%
      ) border-box
    `,
      mask: "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
      WebkitMask:
        "linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)",
      maskComposite: "exclude",
      WebkitMaskComposite: "destination-out",
      pointerEvents: "none",
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative min-h-screen">
      {/* Zone de design principale */}
      <div className="lg:col-span-2">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50">
          <CardHeader className="pb-4 border-b bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-foreground">
                    {t("editCard.title")}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t("editCard.subtitle")}
                  </p>
                </div>
              </div>
              <div className={`flex items-center gap-2 text-sm text-muted-foreground px-3 py-2 rounded-full border ${
                theme === "dark" 
                  ? "bg-gray-800/80 border-gray-700" 
                  : "bg-white/80 border-gray-200"
              }`}>
                <Move className="h-4 w-4" />
                <span className="hidden sm:inline">{t("editCard.dragToMove")}</span>
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
              className="relative overflow-hidden mx-auto transition-all duration-300 paper-premium"
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
                      it.type !== "text" ? `${it.borderRadius}px` : "12px",
                    transform: `
                      ${selectedId === it.id ? "scale(1.05)" : ""}
                      rotate(${it.rotation || 0}deg)
                      scaleX(${it.flipX ? -1 : 1})
                      scaleY(${it.flipY ? -1 : 1})
                    `,
                    filter: `
                      brightness(${it.filters?.brightness || 100}%)
                      contrast(${it.filters?.contrast || 100}%)
                      saturate(${it.filters?.saturation || 100}%)
                      blur(${it.filters?.blur || 0}px)
                      grayscale(${it.filters?.grayscale || 0}%)
                      ${
                        it.shadow?.enabled
                          ? `drop-shadow(${it.shadow.offsetX}px ${it.shadow.offsetY}px ${it.shadow.blur}px ${it.shadow.color})`
                          : ""
                      }
                    `,
                    opacity: (it.opacity || 100) / 100,
                  }}
                >
                  {it.type === "text" ? (
                    <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      try {
                        // Vérifications en chaîne
                        const target = e?.currentTarget;
                        const itemId = it?.id;
                        
                        if (!target || !itemId) return;
                        
                        // Récupérer le texte de manière sécurisée
                        const newText = target.innerText?.trim() || 
                                      target.textContent?.trim() || 
                                      "";
                        
                        // Mettre à jour seulement si le texte a changé
                        const currentText = it?.text || "";
                        if (newText === currentText) return;
                        
                        setItems((prev: any[]) => {
                          try {
                            // S'assurer que prev est un tableau valide
                            if (!Array.isArray(prev) || prev.length === 0) {
                              console.warn("Items array is invalid or empty");
                              return prev || [];
                            }
                            
                            return prev.map((p: any) => {
                              // Vérifier chaque élément du tableau
                              if (!p || typeof p !== 'object') return p;
                              if (!p.id || p.id !== itemId) return p;
                              
                              return {
                                ...p,
                                text: newText,
                                // Mettre à jour le timestamp si nécessaire
                                updatedAt: new Date().toISOString()
                              };
                            });
                          } catch (mapError) {
                            console.error("Error mapping items:", mapError);
                            return prev; // Retourner l'ancien état en cas d'erreur
                          }
                        });
                        
                      } catch (error) {
                        console.error("Erreur lors de l'édition du texte:", error);
                        // Ne pas throw l'erreur pour éviter de casser l'UI
                      }
                    }}
                    className="outline-none min-w-[80px] bg-transparent px-4 py-3 transition-all duration-200"
                    style={{
                      color: it?.color || "#000000",
                      fontSize: `${it?.fontSize || 16}px`,
                      fontFamily: it?.fontFamily || "system-ui, -apple-system, sans-serif",
                      fontWeight: it?.fontWeight || "normal",
                      textAlign: it?.textAlign || "left",
                      textShadow: it?.textShadow || "none",
                      lineHeight: 1.4,
                      wordBreak: "break-word",
                      whiteSpace: "pre-wrap",
                      minHeight: "24px",
                      display: "inline-block",
                      // Ajouter un indicateur visuel pour les éléments vides
                      opacity: (!it?.text || it.text.trim() === "") ? 0.7 : 1,
                    }}
                    // Attributes pour améliorer l'accessibilité
                    role="textbox"
                    aria-label={`Élément texte éditable: ${it?.text || "vide"}`}
                    tabIndex={0}
                    // Éviter le copier/coller de mise en forme indésirable
                    onPaste={(e) => {
                      e.preventDefault();
                      const text = e.clipboardData.getData('text/plain');
                      document.execCommand('insertText', false, text);
                    }}
                    data-placeholder={!it?.text || it.text.trim() === "" ? t("builder.defaults.yourTextHere") : ""}
                  >
                    {it?.text || ""}
                  </div>
                  ) : it.type === "video" ? (
                    <div className="relative">
                      <video
                        src={it.src}
                        autoPlay={it.autoPlay}
                        loop={it.loop}
                        muted={it.muted}
                        className="shadow-xl border-2 border-white/60 object-cover rounded-xl"
                        style={{
                          width: it.width || "200px",
                          height: it.height || "150px",
                        }}
                      />
                      <div className="absolute bottom-2 right-2 flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMediaPlayback();
                          }}
                          className="bg-black/70 text-white p-1 rounded"
                        >
                          {it.playing ? (
                            <Pause className="h-3 w-3" />
                          ) : (
                            <Play className="h-3 w-3" />
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMute();
                          }}
                          className="bg-black/70 text-white p-1 rounded"
                        >
                          {it.muted ? (
                            <VolumeX className="h-3 w-3" />
                          ) : (
                            <Volume2 className="h-3 w-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={it.src}
                      alt=""
                      draggable={false}
                      className="shadow-xl border-2 border-white/60 object-cover transition-all duration-200 hover:shadow-2xl hover:border-white/80"
                      style={{
                        width: it.width || "150px",
                        height: it.height || "150px",
                      }}
                    />
                  )}
                </div>
              ))}

              {items.length === 0 && (
                <div className={`absolute inset-0 flex items-center justify-center text-muted-foreground ${
                  theme === "dark" 
                    ? "bg-gradient-to-br from-transparent to-gray-800/50" 
                    : "bg-gradient-to-br from-transparent to-white/50"
                }`}>
                  <div className={`text-center p-8 backdrop-blur-sm rounded-2xl shadow-lg border ${
                    theme === "dark" 
                      ? "bg-gray-800/80 border-gray-700/60" 
                      : "bg-white/80 border-white/60"
                  }`}>
                    <ImageIcon2 className="h-16 w-16 mx-auto mb-4 opacity-60 text-muted-foreground" />
                    <p className="text-lg font-medium text-muted-foreground mb-2">
                      {t("editCard.emptyCanvas.title")}
                    </p>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      {t("editCard.emptyCanvas.description")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Panneau de contrôle sur le côté - HAUTEUR AMÉLIORÉE */}
      <div className="space-y-4 h-180">
        <Card className="border-0 shadow-lg bg-gradient-to-b from-white to-gray-50/50 overflow-hidden h-180">
          <CardContent className="p-0 h-180 flex flex-col">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full flex-1 flex flex-col"
            >
              <div className="border-b bg-gradient-to-r from-gray-50 to-white">
                <TabsList className="grid grid-cols-3 w-full bg-transparent p-0 h-12">
                  <TabsTrigger
                    value="elements"
                    className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 font-medium transition-all"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    {t("editCard.tabs.elements")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="background"
                    className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 font-medium transition-all"
                  >
                    <Palette className="h-4 w-4 mr-2" />
                    {t("editCard.tabs.background")}
                  </TabsTrigger>
                  <TabsTrigger
                    value="properties"
                    className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 font-medium transition-all"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    {t("editCard.tabs.properties")}
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent
                value="elements"
                className="p-4 space-y-4 m-0 flex-1 overflow-y-auto"
              >
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={addText}
                    className="flex flex-col items-center gap-2 h-auto py-4 border-2 border-dashed border hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 rounded-xl"
                  >
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Type className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium">{t("editCard.elements.text")}</span>
                  </Button>

                  <label className="flex flex-col items-center gap-2 h-auto py-4 border-2 border-dashed border rounded-xl cursor-pointer hover:border-green-300 hover:bg-green-50 transition-all duration-200">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <ImageIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="text-sm font-medium">{t("editCard.elements.image")}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleMediaUpload(e, "image")}
                      className="hidden"
                    />
                  </label>

                  <label className="flex flex-col items-center gap-2 h-auto py-4 border-2 border-dashed border rounded-xl cursor-pointer hover:border-purple-300 hover:bg-purple-50 transition-all duration-200">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Video className="h-5 w-5 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium">{t("editCard.elements.video")}</span>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleMediaUpload(e, "video")}
                      className="hidden"
                    />
                  </label>

                  <label className="flex flex-col items-center gap-2 h-auto py-4 border-2 border-dashed border rounded-xl cursor-pointer hover:border-pink-300 hover:bg-pink-50 transition-all duration-200">
                    <div className="p-2 bg-pink-100 rounded-lg">
                      <ImageIcon2 className="h-5 w-5 text-pink-600" />
                    </div>
                    <span className="text-sm font-medium">{t("editCard.elements.gif")}</span>
                    <input
                      type="file"
                      accept="image/gif"
                      onChange={(e) => handleMediaUpload(e, "gif")}
                      className="hidden"
                    />
                  </label>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowVariables(true);
                      // Si un texte est sélectionné, passer en mode édition
                      if (selected && selected.type === "text") {
                        setActiveTab("properties");
                      }
                    }}
                    className="flex flex-col items-center gap-2 h-auto py-4 border-2 border-dashed border hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 rounded-xl col-span-2"
                  >
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Plus className="h-5 w-5 text-orange-600" />
                    </div>
                    <span className="text-sm font-medium">
                      {t("editCard.elements.textVariables")}
                    </span>
                  </Button>
                </div>
              </TabsContent>

              <TabsContent
                value="background"
                className="p-4 space-y-4 m-0 flex-1 overflow-y-auto"
              >
                <div>
                  <Label className="text-sm font-medium mb-2 block">
                    {t("editCard.background.backgroundColor")}
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
                        className="h-12 w-12 rounded-xl border-2 border cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                      />
                    </div>
                    <Input
                      value={bgColor}
                      onChange={(e) => {
                        setBgColor(e.target.value);
                        setBgImage?.(null);
                      }}
                      placeholder="#ffffff"
                      className="flex-1 h-12 rounded-xl border-2 border focus:border-blue-500"
                    />
                  </div>
                </div>

                <Button
                  onClick={() => setShowBackgroundPicker(true)}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Layout className="h-4 w-4 mr-2" />
                  {t("editCard.background.professionalTemplates")}
                </Button>

                <label className="flex items-center justify-center gap-3 w-full h-12 py-2 border-2 border-dashed border rounded-xl cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-gray-700">
                    {t("editCard.background.customBackground")}
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

              <TabsContent
                value="properties"
                className="p-4 m-0 flex-1 overflow-y-auto"
              >
                {selected ? (
                  <div className="h-[460px] overflow-y-auto">
                    {/* En-tête des propriétés */}
                    <div className="border-b pb-3">
                      <h3 className="font-bold text-lg text-foreground">
                        {t("editCard.properties.title")}
                      </h3>
                      <p className="text-sm text-muted-foreground capitalize">
                        {selected.type} {t("editCard.properties.selectedType")}
                      </p>
                    </div>

                    {selected.type === "text" ? (
                      <>
                        {/* SECTION TEXTE */}
                        <div className="space-y-4">
                          <h4 className="font-semibold text-md text-gray-800 border-l-4 border-blue-500 pl-2">
                            {t("editCard.properties.text.content")}
                          </h4>
                          <div>
                            <Label className="text-sm font-medium mb-2 block">
                              {t("editCard.properties.text.text")}
                            </Label>
                            <Input
                              value={selected.text || ""}
                              onChange={(e) =>
                                updateItemProperty("text", e.target.value)
                              }
                              className="h-12 rounded-xl border-2 border focus:border-blue-500"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-sm font-medium mb-2 block">
                                {t("editCard.properties.text.size")}
                              </Label>
                              <Input
                                type="number"
                                value={selected.fontSize || 16}
                                onChange={(e) =>
                                  updateItemProperty(
                                    "fontSize",
                                    Number(e.target.value)
                                  )
                                }
                                className="h-12 rounded-xl border-2 border focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <Label className="text-sm font-medium mb-2 block">
                                {t("editCard.properties.text.color")}
                              </Label>
                              <div className="relative">
                                <input
                                  type="color"
                                  value={selected.color || "#000000"}
                                  onChange={(e) =>
                                    updateItemProperty("color", e.target.value)
                                  }
                                  className="h-12 w-full rounded-xl border-2 border cursor-pointer"
                                />
                              </div>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium mb-2 block">
                              {t("editCard.properties.text.font")}
                            </Label>
                            <select
                              value={
                                selected.fontFamily || "'Inter', sans-serif"
                              }
                              onChange={(e) =>
                                updateItemProperty("fontFamily", e.target.value)
                              }
                              className="w-full h-12 rounded-xl border-2 border bg-background px-3 py-2 text-sm focus:border-blue-500"
                              style={{
                                fontFamily:
                                  selected.fontFamily || "'Inter', sans-serif",
                              }}
                            >
                              <optgroup label="🎭 Délirantes & Psychédéliques">
                                <option value="'Monoton', cursive">
                                  Monoton - Néon 80s
                                </option>
                                <option value="'Eater', cursive">
                                  Eater - Zombie
                                </option>
                                <option value="'Creepster', cursive">
                                  Creepster - Monstre
                                </option>
                                <option value="'Butcherman', cursive">
                                  Butcherman - Horreur
                                </option>
                                <option value="'Metal Mania', cursive">
                                  Metal Mania - Heavy Metal
                                </option>
                                <option value="'Fascinate Inline', cursive">
                                  Fascinate - Art Déco
                                </option>
                                <option value="'Nosifer', cursive">
                                  Nosifer - Sang
                                </option>
                                <option value="'Bungee Shade', cursive">
                                  Bungee Shade - 3D
                                </option>
                                <option value="'Rubik Moonrocks', cursive">
                                  Rubik Moonrocks - Spatial
                                </option>
                                <option value="'Rubik Wet Paint', cursive">
                                  Rubik Wet Paint - Peinture
                                </option>
                                <option value="'Rubik Glitch', cursive">
                                  Rubik Glitch - Glitch
                                </option>
                              </optgroup>
                              <optgroup label="⚔️ Gothique & Médiéval">
                                <option value="'UnifrakturMaguntia', cursive">
                                  Fraktur - Gothique Allemand
                                </option>
                                <option value="'UnifrakturCook', cursive">
                                  Fraktur Cook - Gothique
                                </option>
                                <option value="'MedievalSharp', cursive">
                                  Medieval Sharp - Moyen-Âge
                                </option>
                                <option value="'Pirata One', cursive">
                                  Pirata One - Pirate
                                </option>
                                <option value="'Almendra Display', cursive">
                                  Almendra - Fantaisie
                                </option>
                                <option value="'Uncial Antiqua', cursive">
                                  Uncial Antiqua - Ancien
                                </option>
                                <option value="'Cinzel', serif">
                                  Cinzel - Romain
                                </option>
                                <option value="'Cinzel Decorative', cursive">
                                  Cinzel Decorative - Orné
                                </option>
                              </optgroup>
                              <optgroup label="💥 Cartoon & BD">
                                <option value="'Bangers', cursive">
                                  Bangers - Comics
                                </option>
                                <option value="'Bungee', cursive">
                                  Bungee - Bold
                                </option>
                                <option value="'Bungee Inline', cursive">
                                  Bungee Inline - Rayé
                                </option>
                                <option value="'Fredoka One', cursive">
                                  Fredoka - Rond
                                </option>
                                <option value="'Luckiest Guy', cursive">
                                  Luckiest Guy - Fun
                                </option>
                                <option value="'Permanent Marker', cursive">
                                  Permanent Marker - Marqueur
                                </option>
                                <option value="'Rock Salt', cursive">
                                  Rock Salt - Craie
                                </option>
                                <option value="'Caveat', cursive">
                                  Caveat - Manuscrit
                                </option>
                                <option value="'Kalam', cursive">
                                  Kalam - Écriture
                                </option>
                                <option value="'Patrick Hand', cursive">
                                  Patrick Hand - Main
                                </option>
                              </optgroup>
                              <optgroup label="🤠 Western & Vintage">
                                <option value="'Rye', cursive">
                                  Rye - Western
                                </option>
                                <option value="'Frijole', cursive">
                                  Frijole - Mexicain
                                </option>
                                <option value="'Smokum', cursive">
                                  Smokum - Cowboy
                                </option>
                              </optgroup>
                              <optgroup label="🚀 Futuriste & Tech">
                                <option value="'Orbitron', sans-serif">
                                  Orbitron - Sci-Fi
                                </option>
                                <option value="'Audiowide', cursive">
                                  Audiowide - Électro
                                </option>
                                <option value="'Rajdhani', sans-serif">
                                  Rajdhani - Tech
                                </option>
                                <option value="'Exo 2', sans-serif">
                                  Exo 2 - Futur
                                </option>
                                <option value="'Teko', sans-serif">
                                  Teko - Sport
                                </option>
                                <option value="'Russo One', sans-serif">
                                  Russo One - Militaire
                                </option>
                                <option value="'Black Ops One', cursive">
                                  Black Ops - Armée
                                </option>
                                <option value="'Press Start 2P', cursive">
                                  Press Start - Pixel
                                </option>
                                <option value="'VT323', monospace">
                                  VT323 - Terminal
                                </option>
                                <option value="'Share Tech Mono', monospace">
                                  Share Tech - Code
                                </option>
                              </optgroup>
                              <optgroup label="✨ Calligraphie Élégante">
                                <option value="'Great Vibes', cursive">
                                  Great Vibes - Élégant
                                </option>
                                <option value="'Dancing Script', cursive">
                                  Dancing Script - Dansant
                                </option>
                                <option value="'Pacifico', cursive">
                                  Pacifico - Décontracté
                                </option>
                                <option value="'Lobster', cursive">
                                  Lobster - Rétro
                                </option>
                                <option value="'Satisfy', cursive">
                                  Satisfy - Fluide
                                </option>
                                <option value="'Sacramento', cursive">
                                  Sacramento - Script
                                </option>
                                <option value="'Tangerine', cursive">
                                  Tangerine - Fin
                                </option>
                                <option value="'Alex Brush', cursive">
                                  Alex Brush - Pinceau
                                </option>
                                <option value="'Allura', cursive">
                                  Allura - Romantique
                                </option>
                                <option value="'Pinyon Script', cursive">
                                  Pinyon Script - Classique
                                </option>
                                <option value="'Italianno', cursive">
                                  Italianno - Italien
                                </option>
                                <option value="'Marck Script', cursive">
                                  Marck Script - Signature
                                </option>
                                <option value="'Niconne', cursive">
                                  Niconne - Doux
                                </option>
                                <option value="'Petit Formal Script', cursive">
                                  Petit Formal - Formel
                                </option>
                                <option value="'Herr Von Muellerhoff', cursive">
                                  Herr Von - Aristocrate
                                </option>
                                <option value="'Mrs Saint Delafield', cursive">
                                  Mrs Saint - Victorien
                                </option>
                                <option value="'Rouge Script', cursive">
                                  Rouge Script - Français
                                </option>
                                <option value="'Sevillana', cursive">
                                  Sevillana - Espagnol
                                </option>
                              </optgroup>
                              <optgroup label="💼 Professionnelles">
                                <option value="'Inter', sans-serif">
                                  Inter - Moderne
                                </option>
                                <option value="'Poppins', sans-serif">
                                  Poppins - Géométrique
                                </option>
                                <option value="'Montserrat', sans-serif">
                                  Montserrat - Élégant
                                </option>
                                <option value="'Space Grotesk', sans-serif">
                                  Space Grotesk - Tech
                                </option>
                                <option value="'Playfair Display', serif">
                                  Playfair - Luxe
                                </option>
                                <option value="'Lora', serif">
                                  Lora - Classique
                                </option>
                                <option value="'Cormorant Garamond', serif">
                                  Cormorant - Raffiné
                                </option>
                              </optgroup>
                            </select>
                          </div>

                          {/* Ombre du texte */}
                          <div>
                            <Label className="text-sm font-medium mb-2 block">
                              {t("editCard.properties.text.textShadow")}
                            </Label>
                            <select
                              value={selected.textShadow || "none"}
                              onChange={(e) =>
                                updateItemProperty("textShadow", e.target.value)
                              }
                              className="w-full h-10 rounded-xl border-2 border bg-background px-3 py-2 text-sm focus:border-blue-500"
                            >
                              <option value="none">{t("editCard.properties.text.shadowOptions.none")}</option>
                              <option value="1px 1px 2px rgba(0,0,0,0.3)">
                                {t("editCard.properties.text.shadowOptions.light")}
                              </option>
                              <option value="2px 2px 4px rgba(0,0,0,0.4)">
                                {t("editCard.properties.text.shadowOptions.medium")}
                              </option>
                              <option value="3px 3px 6px rgba(0,0,0,0.5)">
                                {t("editCard.properties.text.shadowOptions.strong")}
                              </option>
                              <option value="4px 4px 8px rgba(0,0,0,0.6)">
                                {t("editCard.properties.text.shadowOptions.veryStrong")}
                              </option>
                              <option value="0 0 10px rgba(255,255,255,0.8)">
                                {t("editCard.properties.text.shadowOptions.whiteGlow")}
                              </option>
                              <option value="0 0 10px rgba(255,215,0,0.8)">
                                {t("editCard.properties.text.shadowOptions.goldGlow")}
                              </option>
                              <option value="2px 2px 0px #000000">
                                {t("editCard.properties.text.shadowOptions.blackOutline")}
                              </option>
                              <option value="3px 3px 0px #FFD700">
                                {t("editCard.properties.text.shadowOptions.goldOutline")}
                              </option>
                            </select>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-sm font-medium mb-2 block">
                                {t("editCard.properties.text.alignment")}
                              </Label>
                              <select
                                value={selected.textAlign || "left"}
                                onChange={(e) =>
                                  updateItemProperty(
                                    "textAlign",
                                    e.target.value
                                  )
                                }
                                className="w-full h-12 rounded-xl border-2 border bg-background px-3 py-2 text-sm focus:border-blue-500"
                              >
                                <option value="left">{t("editCard.properties.text.alignmentOptions.left")}</option>
                                <option value="center">{t("editCard.properties.text.alignmentOptions.center")}</option>
                                <option value="right">{t("editCard.properties.text.alignmentOptions.right")}</option>
                              </select>
                            </div>
                            <div>
                              <Label className="text-sm font-medium mb-2 block">
                                {t("editCard.properties.text.weight")}
                              </Label>
                              <select
                                value={selected.fontWeight || "normal"}
                                onChange={(e) =>
                                  updateItemProperty(
                                    "fontWeight",
                                    e.target.value
                                  )
                                }
                                className="w-full h-12 rounded-xl border-2 border bg-background px-3 py-2 text-sm focus:border-blue-500"
                              >
                                <option value="normal">{t("editCard.properties.text.weightOptions.normal")}</option>
                                <option value="bold">{t("editCard.properties.text.weightOptions.bold")}</option>
                                <option value="lighter">{t("editCard.properties.text.weightOptions.lighter")}</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      // SECTION MÉDIAS (Images, Vidéos, GIFs)
                      <>
                        {/* PROPRIÉTÉS DE BASE */}
                        <div className="space-y-4">
                          <h4 className="font-semibold text-md text-gray-800 border-l-4 border-green-500 pl-2">
                            {t("editCard.properties.media.base")}
                          </h4>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-sm font-medium mb-2 block">
                                {t("editCard.properties.media.width")}
                              </Label>
                              <Input
                                type="number"
                                value={selected.width || 150}
                                onChange={(e) =>
                                  updateItemProperty(
                                    "width",
                                    Number(e.target.value)
                                  )
                                }
                                className="h-10 rounded-lg border-2 border focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <Label className="text-sm font-medium mb-2 block">
                                {t("editCard.properties.media.height")}
                              </Label>
                              <Input
                                type="number"
                                value={selected.height || 150}
                                onChange={(e) =>
                                  updateItemProperty(
                                    "height",
                                    Number(e.target.value)
                                  )
                                }
                                className="h-10 rounded-lg border-2 border focus:border-blue-500"
                              />
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium mb-2 block">
                              {t("editCard.properties.media.opacity")}
                            </Label>
                            <div className="flex items-center gap-3">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={selected.opacity || 100}
                                onChange={(e) =>
                                  updateItemProperty(
                                    "opacity",
                                    Number(e.target.value)
                                  )
                                }
                                className={`flex-1 h-2 rounded-lg appearance-none cursor-pointer ${
                                  theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                                }`}
                              />
                              <span className="text-sm font-medium w-12 text-center bg-tertiary px-2 py-1 rounded-lg">
                                {selected.opacity || 100}%
                              </span>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium mb-2 block">
                              {t("editCard.properties.media.rotation")}
                            </Label>
                            <div className="flex items-center gap-3">
                              <input
                                type="range"
                                min="0"
                                max="360"
                                value={selected.rotation || 0}
                                onChange={(e) =>
                                  updateItemProperty(
                                    "rotation",
                                    Number(e.target.value)
                                  )
                                }
                                className={`flex-1 h-2 rounded-lg appearance-none cursor-pointer ${
                                  theme === "dark" ? "bg-gray-700" : "bg-gray-200"
                                }`}
                              />
                              <span className="text-sm font-medium w-12 text-center bg-tertiary px-2 py-1 rounded-lg">
                                {selected.rotation || 0}°
                              </span>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium mb-2 block">
                              {t("editCard.properties.media.flip")}
                            </Label>
                            <div className="flex gap-2">
                              <Button
                                variant={selected.flipX ? "default" : "outline"}
                                size="sm"
                                onClick={() =>
                                  updateItemProperty("flipX", !selected.flipX)
                                }
                                className="flex-1 h-10"
                              >
                                <FlipHorizontal className="h-4 w-4 mr-2" />
                                {t("editCard.properties.media.horizontal")}
                              </Button>
                              <Button
                                variant={selected.flipY ? "default" : "outline"}
                                size="sm"
                                onClick={() =>
                                  updateItemProperty("flipY", !selected.flipY)
                                }
                                className="flex-1 h-10"
                              >
                                <FlipVertical className="h-4 w-4 mr-2" />
                                {t("editCard.properties.media.vertical")}
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* STYLE ET BORDURES */}
                        <div className="space-y-4">
                          <h4 className="font-semibold text-md text-gray-800 border-l-4 border-purple-500 pl-2">
                            {t("editCard.properties.media.style")}
                          </h4>

                          <div>
                            <Label className="text-sm font-medium mb-2 block">
                              {t("editCard.properties.media.borderRadius")}
                            </Label>
                            <div className="flex items-center gap-3">
                              <input
                                type="range"
                                min="0"
                                max="50"
                                value={selected.borderRadius || 0}
                                onChange={(e) =>
                                  updateItemProperty(
                                    "borderRadius",
                                    Number(e.target.value)
                                  )
                                }
                                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                              />
                              <span className="text-sm font-medium w-12 text-center bg-tertiary px-2 py-1 rounded-lg">
                                {selected.borderRadius || 0}px
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label className="text-sm font-medium mb-2 block">
                                {t("editCard.properties.media.borderColor")}
                              </Label>
                              <input
                                type="color"
                                value={selected.borderColor || "#000000"}
                                onChange={(e) =>
                                  updateItemProperty(
                                    "borderColor",
                                    e.target.value
                                  )
                                }
                                className="h-10 w-full rounded-lg border-2 border cursor-pointer"
                              />
                            </div>
                            <div>
                              <Label className="text-sm font-medium mb-2 block">
                                {t("editCard.properties.media.thickness")}
                              </Label>
                              <Input
                                type="number"
                                min="0"
                                max="20"
                                value={selected.borderWidth || 0}
                                onChange={(e) =>
                                  updateItemProperty(
                                    "borderWidth",
                                    Number(e.target.value)
                                  )
                                }
                                className="h-10 rounded-lg border-2 border focus:border-blue-500"
                              />
                            </div>
                          </div>
                        </div>

                        {/* OMBRES */}
                        <div className="space-y-4">
                          <h4 className="font-semibold text-md text-gray-800 border-l-4 border-yellow-500 pl-2">
                            {t("editCard.properties.media.shadows")}
                          </h4>

                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">
                              {t("editCard.properties.media.enableShadow")}
                            </Label>
                            <input
                              type="checkbox"
                              checked={selected.shadow?.enabled || false}
                              onChange={(e) =>
                                updateItemProperty("shadow", {
                                  ...selected.shadow,
                                  enabled: e.target.checked,
                                })
                              }
                              className="h-4 w-4 rounded border"
                            />
                          </div>

                          {selected.shadow?.enabled && (
                            <>
                              <div>
                                <Label className="text-sm font-medium mb-2 block">
                                  {t("editCard.properties.media.shadowColor")}
                                </Label>
                                <input
                                  type="color"
                                  value={selected.shadow?.color || "#000000"}
                                  onChange={(e) =>
                                    updateItemProperty("shadow", {
                                      ...selected.shadow,
                                      color: e.target.value,
                                    })
                                  }
                                  className="h-10 w-full rounded-lg border-2 border cursor-pointer"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <Label className="text-sm font-medium mb-2 block">
                                    {t("editCard.properties.media.blur")}
                                  </Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    max="50"
                                    value={selected.shadow?.blur || 5}
                                    onChange={(e) =>
                                      updateItemProperty("shadow", {
                                        ...selected.shadow,
                                        blur: Number(e.target.value),
                                      })
                                    }
                                    className="h-10 rounded-lg border-2 border focus:border-blue-500"
                                  />
                                </div>
                                <div>
                                  <Label className="text-sm font-medium mb-2 block">
                                    {t("editCard.properties.media.offsetX")}
                                  </Label>
                                  <Input
                                    type="number"
                                    min="-50"
                                    max="50"
                                    value={selected.shadow?.offsetX || 2}
                                    onChange={(e) =>
                                      updateItemProperty("shadow", {
                                        ...selected.shadow,
                                        offsetX: Number(e.target.value),
                                      })
                                    }
                                    className="h-10 rounded-lg border-2 border focus:border-blue-500"
                                  />
                                </div>
                              </div>

                              <div>
                                <Label className="text-sm font-medium mb-2 block">
                                  {t("editCard.properties.media.offsetY")}
                                </Label>
                                <Input
                                  type="number"
                                  min="-50"
                                  max="50"
                                  value={selected.shadow?.offsetY || 2}
                                  onChange={(e) =>
                                    updateItemProperty("shadow", {
                                      ...selected.shadow,
                                      offsetY: Number(e.target.value),
                                    })
                                  }
                                  className="h-10 rounded-lg border-2 border focus:border-blue-500"
                                />
                              </div>
                            </>
                          )}
                        </div>

                        {/* FILTRES */}
                        <div className="space-y-4">
                          <h4 className="font-semibold text-md text-gray-800 border-l-4 border-red-500 pl-2">
                            {t("editCard.properties.media.filters")}
                          </h4>

                          <div>
                            <Label className="text-sm font-medium mb-2 block">
                              {t("editCard.properties.media.brightness")}
                            </Label>
                            <div className="flex items-center gap-3">
                              <input
                                type="range"
                                min="0"
                                max="200"
                                value={selected.filters?.brightness || 100}
                                onChange={(e) =>
                                  updateItemProperty("filters", {
                                    ...selected.filters,
                                    brightness: Number(e.target.value),
                                  })
                                }
                                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                              />
                              <span className="text-sm font-medium w-12 text-center bg-tertiary px-2 py-1 rounded-lg">
                                {selected.filters?.brightness || 100}%
                              </span>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium mb-2 block">
                              {t("editCard.properties.media.contrast")}
                            </Label>
                            <div className="flex items-center gap-3">
                              <input
                                type="range"
                                min="0"
                                max="200"
                                value={selected.filters?.contrast || 100}
                                onChange={(e) =>
                                  updateItemProperty("filters", {
                                    ...selected.filters,
                                    contrast: Number(e.target.value),
                                  })
                                }
                                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                              />
                              <span className="text-sm font-medium w-12 text-center bg-tertiary px-2 py-1 rounded-lg">
                                {selected.filters?.contrast || 100}%
                              </span>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium mb-2 block">
                              {t("editCard.properties.media.saturation")}
                            </Label>
                            <div className="flex items-center gap-3">
                              <input
                                type="range"
                                min="0"
                                max="200"
                                value={selected.filters?.saturation || 100}
                                onChange={(e) =>
                                  updateItemProperty("filters", {
                                    ...selected.filters,
                                    saturation: Number(e.target.value),
                                  })
                                }
                                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                              />
                              <span className="text-sm font-medium w-12 text-center bg-tertiary px-2 py-1 rounded-lg">
                                {selected.filters?.saturation || 100}%
                              </span>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium mb-2 block">
                              Flou
                            </Label>
                            <div className="flex items-center gap-3">
                              <input
                                type="range"
                                min="0"
                                max="20"
                                value={selected.filters?.blur || 0}
                                onChange={(e) =>
                                  updateItemProperty("filters", {
                                    ...selected.filters,
                                    blur: Number(e.target.value),
                                  })
                                }
                                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                              />
                              <span className="text-sm font-medium w-12 text-center bg-tertiary px-2 py-1 rounded-lg">
                                {selected.filters?.blur || 0}px
                              </span>
                            </div>
                          </div>

                          <div>
                            <Label className="text-sm font-medium mb-2 block">
                              {t("editCard.properties.media.grayscale")}
                            </Label>
                            <div className="flex items-center gap-3">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={selected.filters?.grayscale || 0}
                                onChange={(e) =>
                                  updateItemProperty("filters", {
                                    ...selected.filters,
                                    grayscale: Number(e.target.value),
                                  })
                                }
                                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                              />
                              <span className="text-sm font-medium w-12 text-center bg-tertiary px-2 py-1 rounded-lg">
                                {selected.filters?.grayscale || 0}%
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* CONTRÔLES VIDÉO/GIF */}
                        {(selected.type === "video" ||
                          selected.type === "gif") && (
                          <div className="space-y-4">
                            <h4 className="font-semibold text-md text-gray-800 border-l-4 border-blue-500 pl-2">
                              {t("editCard.properties.media.mediaControls")}
                            </h4>

                            <div className="grid grid-cols-2 gap-3">
                              <Button
                                onClick={toggleMediaPlayback}
                                variant={
                                  selected.playing ? "outline" : "default"
                                }
                                className="h-10"
                              >
                                {selected.playing ? (
                                  <Pause className="h-4 w-4 mr-2" />
                                ) : (
                                  <Play className="h-4 w-4 mr-2" />
                                )}
                                {selected.playing ? t("editCard.properties.media.pause") : t("editCard.properties.media.play")}
                              </Button>

                              {selected.type === "video" && (
                                <Button
                                  onClick={toggleMute}
                                  variant={
                                    selected.muted ? "outline" : "default"
                                  }
                                  className="h-10"
                                >
                                  {selected.muted ? (
                                    <VolumeX className="h-4 w-4 mr-2" />
                                  ) : (
                                    <Volume2 className="h-4 w-4 mr-2" />
                                  )}
                                  {selected.muted ? t("editCard.properties.media.sound") : t("editCard.properties.media.mute")}
                                </Button>
                              )}
                            </div>

                            {selected.type === "video" && (
                              <>
                                <div className="flex items-center justify-between">
                                  <Label className="text-sm font-medium">
                                    {t("editCard.properties.media.autoPlay")}
                                  </Label>
                                  <input
                                    type="checkbox"
                                    checked={selected.autoPlay || false}
                                    onChange={(e) =>
                                      updateItemProperty(
                                        "autoPlay",
                                        e.target.checked
                                      )
                                    }
                                    className="h-4 w-4 rounded border"
                                  />
                                </div>

                                <div className="flex items-center justify-between">
                                  <Label className="text-sm font-medium">
                                    {t("editCard.properties.media.loop")}
                                  </Label>
                                  <input
                                    type="checkbox"
                                    checked={selected.loop || false}
                                    onChange={(e) =>
                                      updateItemProperty(
                                        "loop",
                                        e.target.checked
                                      )
                                    }
                                    className="h-4 w-4 rounded border"
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        )}

                        {/* BOUTON FOND D'ÉCRAN */}
                        <Button
                          onClick={setImageAsBackground}
                          className="w-full h-12 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                        >
                          <Layout className="h-4 w-4 mr-2" />
                          {t("editCard.properties.media.useAsBackground")}
                        </Button>
                      </>
                    )}

                    {/* BOUTON SUPPRIMER */}
                    <Button
                      variant="destructive"
                      onClick={removeSelected}
                      className="w-full h-12 mt-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t("editCard.properties.deleteElement")}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-dashed border h-full flex items-center justify-center">
                    <div>
                      <Settings className="h-12 w-12 mx-auto mb-3 opacity-40 text-muted-foreground" />
                      <p className="text-base font-medium text-muted-foreground mb-1">
                        {t("editCard.properties.noSelection.title")}
                      </p>
                      <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                        {t("editCard.properties.noSelection.description")}
                      </p>
                    </div>
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

      {/* Bouton flottant du chatbot */}
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

      {/* Fenêtre du chatbot */}
      {isChatOpen && (
        <div className={`fixed bottom-6 right-6 w-96 h-[500px] rounded-2xl shadow-2xl border z-50 flex flex-col overflow-hidden ${
          theme === "dark" 
            ? "bg-gray-800 border-gray-700" 
            : "bg-white border-gray-200"
        }`}>
          {/* Header du chat */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <span className="font-bold text-lg">{t("editCard.chat.title")}</span>
                <p className="text-blue-100 text-sm">{t("editCard.chat.subtitle")}</p>
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

          {/* Messages du chat */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {chatMessages.map((message, index) => {
              const isLastMessage = index === chatMessages.length - 1;
              const showActionButtons =
                isLastMessage &&
                improvementState.isImprovementMode &&
                improvementState.analysis &&
                message.role === "assistant";

              return (
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
                        : theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-gray-100 shadow-lg"
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
                        {message.role === "assistant" ? t("editCard.chat.assistant") : t("editCard.chat.you")}
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

                    {/* Boutons d'action uniquement sur le dernier message d'amélioration */}
                    {showActionButtons && (
                      <div className="flex gap-2 mt-3 pt-3 border-t border">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            applyImprovements();
                            // NE PAS fermer le chat
                          }}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-2 h-auto"
                          size="sm"
                        >
                          {t("editCard.chat.apply")}
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            revertToOriginal();
                            // NE PAS fermer le chat
                          }}
                          variant="outline"
                          className="flex-1 text-xs py-2 h-auto border"
                          size="sm"
                        >
                          {t("editCard.chat.cancel")}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl p-4 bg-white border border shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Bot className="h-4 w-4" />
                    <span className="text-xs font-medium opacity-70">
                      {t("editCard.chat.assistant")}
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
            {/* Élément invisible pour le scroll automatique */}
            <div ref={chatMessagesEndRef} />
          </div>

          {/* Input du chat */}
          <div className="p-4 border-t border bg-white">
            <div className="flex gap-2">
              <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t("editCard.chat.placeholder")}
                className="flex-1 h-12 rounded-xl border-2 border focus:border-blue-500 bg-secondary"
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
              {t("editCard.chat.examples")}
            </p>
          </div>
        </div>
      )}

      {/* Modal des modèles professionnels - NOUVEAU */}
      {showBackgroundPicker && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden border border">
            <div className="flex justify-between items-center p-6 border-b border bg-gradient-to-r from-gray-50 to-white">
              <div>
                <h3 className="text-2xl font-bold text-foreground">
                  {t("editCard.templates.title")}
                </h3>
                <p className="text-muted-foreground mt-1">
                  {t("editCard.templates.subtitle")}
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

            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {/* Filtres par catégorie */}
              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  "all",
                  "birthday",
                  "wedding",
                  "baptism",
                  "easter",
                  "christmas",
                  "elegant",
                  "nature",
                  "minimal",
                ].map((cat) => (
                  <button
                    key={cat}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-tertiary hover:bg-blue-100 hover:text-blue-700 transition-colors capitalize"
                  >
                    {cat === "all" ? t("editCard.templates.categories.all") : t(`editCard.templates.categories.${cat}`)}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {PROFESSIONAL_TEMPLATES.map((template) => (
                  <div
                    key={template.id}
                    className="cursor-pointer group overflow-hidden hover:shadow-2xl transition-all duration-300"
                    style={{
                      borderStyle: template.borderStyle,
                      borderColor: template.borderColor,
                      borderWidth: `${template.borderWidth}px`,
                      borderRadius: `${template.borderRadius}px`,
                      boxShadow:
                        template.boxShadow || "0 4px 20px rgba(0,0,0,0.1)",
                    }}
                    onClick={() => {
                      // Appliquer le modèle professionnel
                      setBgColor(template.bgColor);
                      if (
                        template.image &&
                        template.imagePosition === "background"
                      ) {
                        setBgImage(template.image);
                      } else {
                        setBgImage(null);
                      }
                      // Ajouter les items du template
                      const newItems = template.items.map(
                        (item: any, idx: number) => ({
                          ...item,
                          id: `pro-${template.id}-${idx}-${Date.now()}`,
                        })
                      );
                      // Ajouter l'image si layout split
                      if (
                        template.image &&
                        template.imagePosition !== "background"
                      ) {
                        newItems.push({
                          id: `img-${template.id}-${Date.now()}`,
                          type: "image",
                          src: template.image,
                          x: template.imagePosition === "left" ? 20 : 320,
                          y: 20,
                          width: 250,
                          height: 360,
                          borderRadius: template.borderRadius,
                        });
                      }
                      setItems(newItems);
                      setShowBackgroundPicker(false);
                    }}
                  >
                    {/* Aperçu du modèle */}
                    <div
                      className="w-full h-48 relative group-hover:scale-[1.02] transition-transform duration-300"
                      style={{
                        backgroundColor: template.bgColor,
                        backgroundImage:
                          template.image &&
                          template.imagePosition === "background"
                            ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${template.image})`
                            : "none",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      {/* Layout split avec image */}
                      {template.image &&
                        template.imagePosition !== "background" && (
                          <div className="absolute inset-0 flex">
                            {template.imagePosition === "left" && (
                              <>
                                <div className="w-1/2 h-full">
                                  <img
                                    src={template.image}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="w-1/2 h-full flex items-center justify-center p-4">
                                  <div className="text-center">
                                    {template.items[0] && (
                                      <p
                                        style={{
                                          fontFamily:
                                            template.items[0].fontFamily,
                                          color: template.items[0].color,
                                          fontSize: "14px",
                                          fontWeight:
                                            template.items[0].fontWeight,
                                          textShadow:
                                            template.items[0].textShadow,
                                        }}
                                      >
                                        {template.items[0].text}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </>
                            )}
                            {template.imagePosition === "right" && (
                              <>
                                <div className="w-1/2 h-full flex items-center justify-center p-4">
                                  <div className="text-center">
                                    {template.items[0] && (
                                      <p
                                        style={{
                                          fontFamily:
                                            template.items[0].fontFamily,
                                          color: template.items[0].color,
                                          fontSize: "14px",
                                          fontWeight:
                                            template.items[0].fontWeight,
                                          textShadow:
                                            template.items[0].textShadow,
                                        }}
                                      >
                                        {template.items[0].text}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="w-1/2 h-full">
                                  <img
                                    src={template.image}
                                    alt=""
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        )}

                      {/* Layout sans image split */}
                      {(!template.image ||
                        template.imagePosition === "background") && (
                        <div className="absolute inset-0 flex items-center justify-center p-4">
                          <div className="text-center">
                            {template.items[0] && (
                              <p
                                style={{
                                  fontFamily: template.items[0].fontFamily,
                                  color: template.items[0].color,
                                  fontSize: "16px",
                                  fontWeight: template.items[0].fontWeight,
                                  textShadow:
                                    template.items[0].textShadow ||
                                    template.textShadow,
                                }}
                              >
                                {template.items[0].text}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Badge catégorie */}
                      <span className="absolute top-2 right-2 text-xs font-medium px-2 py-1 bg-white/90 text-gray-700 rounded-full capitalize shadow">
                        {template.category}
                      </span>
                    </div>

                    {/* Info du modèle */}
                    <div className="p-4 bg-white">
                      <p className="text-lg font-bold text-foreground">
                        {template.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {template.description}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs px-2 py-1 bg-tertiary rounded">
                          {template.layout}
                        </span>
                        <span className="text-xs px-2 py-1 bg-tertiary rounded">
                          {template.borderStyle}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border bg-secondary">
              <div className="flex justify-center">
                <Button
                  onClick={() => setShowBackgroundPicker(false)}
                  variant="outline"
                  className="rounded-xl border-2 border hover:border-gray-400"
                >
                  {t("editCard.templates.close")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
