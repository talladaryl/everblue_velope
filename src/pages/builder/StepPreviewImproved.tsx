import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Layout,
  Smartphone,
  Monitor,
  Tablet,
} from "lucide-react";
import { ResponsivePreview } from "@/components/ResponsivePreview";
import {
  replaceVariablesInItems,
  extractVariablesFromItems,
  validateTemplateForGuest,
} from "@/utils/variableSubstitution";
// Importez les modèles originaux
import {
  PreviewModel1 as OriginalModel1,
  PreviewModel2 as OriginalModel2,
  PreviewModel3 as OriginalModel3,
  PreviewModel4 as OriginalModel4,
  PreviewModel5 as OriginalModel5,
  PreviewModel6 as OriginalModel6,
  PreviewModel7 as OriginalModel7,
  PreviewModel8 as OriginalModel8,
  PreviewModel9 as OriginalModel9,
  PreviewModel10 as OriginalModel10,
  PreviewModel11 as OriginalModel11,
  PreviewModel12 as OriginalModel12,
} from "./modelPreviews";

// Importez le correcteur
import { withCardFix } from "@/components/withCardFix";

// Enveloppez CHAQUE modèle
const PreviewModel1 = withCardFix(OriginalModel1);
const PreviewModel2 = withCardFix(OriginalModel2);
const PreviewModel3 = withCardFix(OriginalModel3);
const PreviewModel4 = withCardFix(OriginalModel4);
const PreviewModel5 = withCardFix(OriginalModel5);
const PreviewModel6 = withCardFix(OriginalModel6);
const PreviewModel7 = withCardFix(OriginalModel7);
const PreviewModel8 = withCardFix(OriginalModel8);
const PreviewModel9 = withCardFix(OriginalModel9);
const PreviewModel10 = withCardFix(OriginalModel10);
const PreviewModel11 = withCardFix(OriginalModel11);
const PreviewModel12 = withCardFix(OriginalModel12);
// Constantes pour le style du papier
const PAPER_TEXTURE = `url("data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`;

const getAvailableModels = (t: (key: string) => string) => [
  { id: "default", name: t("preview.models.default.name"), description: t("preview.models.default.description") },
  { id: "model1", name: "Modèle 1", description: "Simple and Basic" },
  { id: "model2", name: "Modèle 2", description: "Elegant Design" },
  { id: "model3", name: "Modèle 3", description: "Modern Style" },
  { id: "model4", name: "Modèle 4", description: "Classic Look" },
  { id: "model5", name: "Modèle 5", description: "Premium Design" },
  { id: "model6", name: "Modèle 6", description: "Luxury Style" },
  { id: "model7", name: "Modèle 7", description: "Contemporary" },
  { id: "model8", name: "Modèle 8", description: "Minimalist" },
  { id: "model9", name: "Modèle 9", description: "Artistic" },
  { id: "model10", name: "Modèle 10", description: "Professional" },
  { id: "model11", name: "Modèle 11", description: "Creative" },
  { id: "model12", name: "Modèle 12", description: "Elegant" },
];

export default function StepPreviewImproved({ ctx }: { ctx: any }) {
  const { t } = useLanguage();
  const {
    guests = [],
    previewGuestId,
    setPreviewGuestId,
    setStep,
    items = [],
    bgImage,
    bgColor = "#ffffff",
    replaceVariables,
    selectedModelId = "default",
    setSelectedModelId,
  } = ctx;

  const [showFullPreview, setShowFullPreview] = useState(false);
  const [currentGuestIndex, setCurrentGuestIndex] = useState(0);
  // Utiliser le state du contexte pour le modèle sélectionné
  const selectedModel = selectedModelId;
  const setSelectedModel = setSelectedModelId || ((v: string) => {});
  const [previewItems, setPreviewItems] = useState<any[]>([]);
  const [activeDevice, setActiveDevice] = useState("desktop"); // "mobile", "tablet", "desktop"

  // Obtenir les modèles avec traductions
  const AVAILABLE_MODELS = getAvailableModels(t);

  // Trouver l'invité sélectionné
  const guest = guests.find((g: any) => g.id === previewGuestId) ?? guests[0];
  const guestIndex = guests.findIndex((g: any) => g.id === guest?.id) ?? 0;

  // Extraire les variables du template
  const templateVariables = extractVariablesFromItems(items);

  // Valider le template pour l'invité actuel
  const validation = validateTemplateForGuest(items, guest);

  // Fonction pour remplacer les variables
  const replaceVariablesInText = (text: string, guestData: any): string => {
    if (!text || !guestData) return text;

    let result = text;

    // Remplacer toutes les variables
    result = result.replace(/\{\{name\}\}/g, guestData.name || "");
    result = result.replace(
      /\{\{first_name\}\}/g,
      guestData.name?.split(" ")[0] || ""
    );
    result = result.replace(
      /\{\{last_name\}\}/g,
      guestData.name?.split(" ").slice(1).join(" ") || ""
    );
    result = result.replace(/\{\{email\}\}/g, guestData.email || "");
    result = result.replace(/\{\{location\}\}/g, guestData.location || "");
    result = result.replace(/\{\{lieu\}\}/g, guestData.location || "");
    result = result.replace(/\{\{date\}\}/g, guestData.date || "");
    result = result.replace(/\{\{time\}\}/g, guestData.time || "");
    result = result.replace(/\{\{heure\}\}/g, guestData.time || "");

    return result;
  };

  // Mettre à jour les items avec les variables remplacées
  useEffect(() => {
    if (guest && items && items.length > 0) {
      const processedItems = items.map((it: any) => {
        if (it.type === "text" && it.text) {
          return {
            ...it,
            text: replaceVariablesInText(it.text, guest),
          };
        }
        return it;
      });
      setPreviewItems(processedItems);
    } else {
      setPreviewItems(items || []);
    }
  }, [items, guest]);

  const renderModelPreview = () => {
    // Props communes pour tous les modèles - style identique à EditCard
    const commonProps = {
      items: previewItems,
      bgColor: bgColor,
      bgImage: bgImage,
      onClose: () => setShowFullPreview(false),
      guest: guest,
    };

    // Dimensions selon l'appareil sélectionné
    const getModelScale = () => {
      switch (activeDevice) {
        case "mobile":
          return 0.5;
        case "tablet":
          return 0.7;
        case "desktop":
          return 0.9;
        default:
          return 0.8;
      }
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
        return (
          <div className="flex items-center justify-center p-8">
            <div className="text-center text-muted-foreground">
              <Eye className="h-12 w-12 mx-auto mb-4 opacity-40" />
              <p className="text-lg font-medium">{t("preview.models.selectModel")}</p>
            </div>
          </div>
        );
    }
  };

  // Naviguer entre les invités
  const handlePreviousGuest = () => {
    if (guestIndex > 0) {
      const newGuest = guests[guestIndex - 1];
      setPreviewGuestId(newGuest.id);
      setCurrentGuestIndex(guestIndex - 1);
    }
  };

  const handleNextGuest = () => {
    if (guestIndex < guests.length - 1) {
      const newGuest = guests[guestIndex + 1];
      setPreviewGuestId(newGuest.id);
      setCurrentGuestIndex(guestIndex + 1);
    }
  };

  // Classes CSS pour les différentes tailles d'appareils
  const deviceClasses = {
    mobile: "w-80 h-[600px] mx-auto",
    tablet: "w-[768px] h-[1024px] mx-auto",
    desktop: "w-full max-w-4xl h-[600px] mx-auto",
  };

  // Composant FIXE qui remplace TOUS les modèles problématiques
  const FixedPreviewModel = ({ items, paperStyle, textStyle }: any) => {
    return (
      <div style={paperStyle} className="w-full h-full">
        {/* Affiche tous les items exactement comme dans EditCard */}
        {items.map((it: any) => {
          const isText = it.type === "text";
          const isImage = it.type === "image";

          const itemStyle: React.CSSProperties = {
            position: "absolute",
            left: `${it.x}px`,
            top: `${it.y}px`,
            transform: `
            rotate(${it.rotation || 0}deg)
            scaleX(${it.flipX ? -1 : 1})
            scaleY(${it.flipY ? -1 : 1})
          `,
            opacity: (it.opacity || 100) / 100,
          };

          if (isText) {
            return (
              <div
                key={it.id}
                style={{
                  ...itemStyle,
                  color: it.color || "#000000",
                  fontSize: `${it.fontSize || 16}px`,
                  fontFamily: it.fontFamily || "Arial",
                  fontWeight: it.fontWeight || "normal",
                  textAlign: it.textAlign || "left",
                  textShadow: it.textShadow || "none",
                  lineHeight: 1.4,
                  backgroundColor: "transparent", // IMPORTANT: pas de fond blanc
                  border: "none", // IMPORTANT: pas de bordure
                  padding: "0", // IMPORTANT: pas de padding
                  margin: "0", // IMPORTANT: pas de margin
                  ...textStyle,
                }}
                className="outline-none"
              >
                {it.text || "Texte"}
              </div>
            );
          }

          if (isImage) {
            return (
              <img
                key={it.id}
                src={it.src}
                alt=""
                style={{
                  ...itemStyle,
                  width: it.width || "150px",
                  height: it.height || "150px",
                  objectFit: "cover",
                  borderRadius: it.borderRadius
                    ? `${it.borderRadius}px`
                    : "0px", // Bords carrés par défaut
                }}
                className="absolute"
              />
            );
          }

          return null;
        })}
      </div>
    );
  };

  if (!guest) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {t("preview.noGuest.title")}. {t("preview.noGuest.description")}
          </AlertDescription>
        </Alert>
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setStep(1)}>
            {t("preview.noGuest.backButton")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-enter">
      {/* En-tête simplifié */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">
          {t("preview.title")}
        </h2>
        <p className="text-gray-600">
          {t("preview.subtitle")}
        </p>
      </div>

      {/* Conteneur principal avec layout amélioré */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Sidebar des contrôles */}
        <div className="xl:col-span-1 space-y-6">
          {/* Carte de sélection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="h-5 w-5 text-blue-600" />
                {t("preview.configuration.title")}
              </CardTitle>
              <CardDescription>
                {t("preview.configuration.subtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sélection de l'invité */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700">
                  {t("preview.configuration.guestLabel")} ({guestIndex + 1} / {guests.length})
                </label>
                <Select value={guest.id} onValueChange={setPreviewGuestId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {guests.map((g: any, index: number) => (
                      <SelectItem key={g.id} value={g.id}>
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">
                              {g.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {g.email}
                            </p>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sélection du modèle */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700">
                  {t("preview.configuration.modelLabel")}
                </label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_MODELS.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">
                            {model.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {model.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sélecteur d'appareil */}
              {selectedModel !== "default" && (
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700">
                    {t("preview.configuration.deviceLabel")}
                  </label>
                  <div className="flex gap-2 p-1 bg-gray-100">
                    {[
                      { id: "mobile", icon: Smartphone, label: t("preview.configuration.devices.mobile") },
                      { id: "tablet", icon: Tablet, label: t("preview.configuration.devices.tablet") },
                      { id: "desktop", icon: Monitor, label: t("preview.configuration.devices.desktop") },
                    ].map((device) => {
                      const Icon = device.icon;
                      const isActive = activeDevice === device.id;
                      return (
                        <button
                          key={device.id}
                          onClick={() => setActiveDevice(device.id)}
                          className={`flex-1 flex flex-col items-center gap-1 p-3 ${
                            isActive
                              ? "bg-white text-blue-600"
                              : "text-muted-foreground hover:text-gray-700"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="text-xs font-medium">
                            {device.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Carte d'information de l'invité */}
          <Card className="bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900 flex items-center gap-2">
                <Eye className="h-5 w-5" />
                {t("preview.guestInfo.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 flex items-center justify-center text-white font-bold">
                    {guest.full_name?.charAt(0) || "?"}
                  </div>
                  <div>
                    <p className="font-semibold text-blue-900">
                      {guest.full_name}
                    </p>
                    <p className="text-sm text-blue-700">{guest.email}</p>
                  </div>
                </div>

                <div className="grid gap-2">
                  {guest.location && (
                    <div className="flex items-center gap-2 text-sm text-blue-800">
                      <div className="w-2 h-2 bg-blue-500"></div>
                      <span>
                        <strong>{t("preview.guestInfo.location")}</strong> {guest.location}
                      </span>
                    </div>
                  )}
                  {guest.date && (
                    <div className="flex items-center gap-2 text-sm text-blue-800">
                      <div className="w-2 h-2 bg-blue-500"></div>
                      <span>
                        <strong>{t("preview.guestInfo.date")}</strong>{" "}
                        {new Date(guest.date).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  )}
                  {guest.time && (
                    <div className="flex items-center gap-2 text-sm text-blue-800">
                      <div className="w-2 h-2 bg-blue-500"></div>
                      <span>
                        <strong>{t("preview.guestInfo.time")}</strong> {guest.time}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Zone d'aperçu principale */}
        <div className="xl:col-span-3 space-y-6">
          {/* Alertes de validation */}
          {!validation.valid && (
            <Alert className="bg-orange-50 border-orange-200">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>{t("preview.validation.warning")}</strong> {validation.errors.join(" ")}
              </AlertDescription>
            </Alert>
          )}

          {validation.valid && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>{t("preview.validation.success")}</strong>
              </AlertDescription>
            </Alert>
          )}

          {/* Aperçu du modèle avec design épuré - SANS fond blanc */}
          {selectedModel !== "default" && (
            <Card className="border-0 shadow-none bg-transparent">
              <CardHeader className="bg-gray-900 text-white rounded-t-lg">
                <div className="flex items-center justify-between">
                  <CardTitle>{t("preview.livePreview.title")}</CardTitle>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {AVAILABLE_MODELS.find((m) => m.id === selectedModel)?.name}
                  </Badge>
                </div>
                <CardDescription className="text-gray-300">
                  {t("preview.livePreview.description")}{" "}
                  {activeDevice === "mobile"
                    ? t("preview.configuration.devices.mobile")
                    : activeDevice === "tablet"
                    ? t("preview.configuration.devices.tablet")
                    : t("preview.configuration.devices.desktop")}
                </CardDescription>
              </CardHeader>
              <CardContent
                className="p-6"
                style={{ backgroundColor: "transparent" }}
              >
                <div className="flex justify-center items-center">
                  {/* Conteneur principal - UNIQUEMENT la carte, pas de fond */}
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width:
                        activeDevice === "mobile"
                          ? "320px"
                          : activeDevice === "tablet"
                          ? "600px"
                          : "100%",
                      maxWidth:
                        activeDevice === "desktop" ? "800px" : undefined,
                      backgroundColor: "transparent",
                    }}
                  >
                    {/* Rendu direct du modèle - SANS conteneur blanc */}
                    {renderModelPreview()}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation simplifiée */}
          <div className="flex flex-col md:flex-row justify-between gap-4 pt-6">
            <Button
              variant="outline"
              onClick={() => setStep(1)}
              className="w-full md:w-auto px-8 py-3 border border"
            >
              {t("preview.navigation.backToDetails")}
            </Button>
            <Button
              onClick={() => setStep(3)}
              className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-3"
            >
              <span>{t("preview.navigation.continueToSend")}</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Modal de prévisualisation plein écran */}
      {showFullPreview && (
        <ResponsivePreview
          items={previewItems}
          bgColor={bgColor}
          bgImage={bgImage}
          guest={guest}
          onClose={() => setShowFullPreview(false)}
          title={t("preview.fullPreview.title")}
          showGuestInfo={true}
        />
      )}
    </div>
  );
}
