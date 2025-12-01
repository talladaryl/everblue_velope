import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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

const AVAILABLE_MODELS = [
  { id: "default", name: "Aperçu Simple", description: "Affichage basique" },
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
  const {
    guests = [],
    previewGuestId,
    setPreviewGuestId,
    setStep,
    items = [],
    bgImage,
    bgColor = "#ffffff",
    replaceVariables,
  } = ctx;

  const [showFullPreview, setShowFullPreview] = useState(false);
  const [currentGuestIndex, setCurrentGuestIndex] = useState(0);
  const [selectedModel, setSelectedModel] = useState("default");
  const [previewItems, setPreviewItems] = useState<any[]>([]);
  const [activeDevice, setActiveDevice] = useState("desktop"); // "mobile", "tablet", "desktop"

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

  const previewBg = bgImage ? `url(${bgImage})` : bgColor;

  // Fonction pour rendre le modèle sélectionné
  const renderModelPreview = () => {
    const commonProps = {
      items: previewItems,
      bgColor: previewBg,
      onClose: () => setShowFullPreview(false),
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
        return null;
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

  if (!guest) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Aucun invité trouvé. Veuillez retourner à l'étape précédente pour
            ajouter des invités.
          </AlertDescription>
        </Alert>
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setStep(1)}>
            ← Retour
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-enter">
      {/* En-tête simplifié */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">
          Prévisualisation de l'invitation
        </h2>
        <p className="text-gray-600">
          Vérifiez comment votre invitation s'affichera pour chaque invité
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
                Configuration
              </CardTitle>
              <CardDescription>
                Sélectionnez un invité et un modèle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sélection de l'invité */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700">
                  Invité ({guestIndex + 1} / {guests.length})
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
                            <p className="font-medium text-gray-900 truncate">
                              {g.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
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
                  Modèle de design
                </label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_MODELS.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {model.name}
                          </span>
                          <span className="text-xs text-gray-500">
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
                    Aperçu sur
                  </label>
                  <div className="flex gap-2 p-1 bg-gray-100">
                    {[
                      { id: "mobile", icon: Smartphone, label: "Mobile" },
                      { id: "tablet", icon: Tablet, label: "Tablette" },
                      { id: "desktop", icon: Monitor, label: "Desktop" },
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
                              : "text-gray-500 hover:text-gray-700"
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
                Informations de l'invité
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
                        <strong>Lieu:</strong> {guest.location}
                      </span>
                    </div>
                  )}
                  {guest.date && (
                    <div className="flex items-center gap-2 text-sm text-blue-800">
                      <div className="w-2 h-2 bg-blue-500"></div>
                      <span>
                        <strong>Date:</strong>{" "}
                        {new Date(guest.date).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  )}
                  {guest.time && (
                    <div className="flex items-center gap-2 text-sm text-blue-800">
                      <div className="w-2 h-2 bg-blue-500"></div>
                      <span>
                        <strong>Heure:</strong> {guest.time}
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
                <strong>Attention:</strong> {validation.errors.join(" ")}
              </AlertDescription>
            </Alert>
          )}

          {validation.valid && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Parfait!</strong> Toutes les variables ont été
                remplacées avec succès pour cet invité.
              </AlertDescription>
            </Alert>
          )}

          {/* Aperçu du modèle avec design épuré */}
          {selectedModel !== "default" && (
            <Card>
              <CardHeader className="bg-gray-900 text-white">
                <div className="flex items-center justify-between">
                  <CardTitle>Aperçu en direct</CardTitle>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {AVAILABLE_MODELS.find((m) => m.id === selectedModel)?.name}
                  </Badge>
                </div>
                <CardDescription className="text-gray-300">
                  Visualisation sur{" "}
                  {activeDevice === "mobile"
                    ? "mobile"
                    : activeDevice === "tablet"
                    ? "tablette"
                    : "desktop"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex justify-center">
                  <div className={`${deviceClasses[activeDevice]}`}>
                    <div className="relative w-full h-full">
                      {/* Cadre de l'appareil - sans bordures arrondies */}
                      <div
                        className={`absolute inset-0 border border-gray-300 bg-white overflow-hidden ${
                          activeDevice === "mobile"
                            ? ""
                            : activeDevice === "tablet"
                            ? ""
                            : ""
                        }`}
                      >
                        {/* Barre de statut pour mobile/tablette */}
                        {(activeDevice === "mobile" ||
                          activeDevice === "tablet") && (
                          <div className="h-6 bg-gray-900 flex items-center justify-center relative">
                            <div className="w-16 h-1 bg-gray-600"></div>
                            <div className="absolute left-4 text-white text-xs">
                              {activeDevice === "mobile" ? "9:41" : ""}
                            </div>
                          </div>
                        )}

                        {/* Contenu de l'aperçu */}
                        <div
                          className={`w-full h-full bg-white overflow-auto ${
                            activeDevice === "mobile"
                              ? "h-[calc(100%-24px)]"
                              : activeDevice === "tablet"
                              ? "h-[calc(100%-24px)]"
                              : "h-full"
                          }`}
                        >
                          {renderModelPreview()}
                        </div>
                      </div>
                    </div>
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
              className="w-full md:w-auto px-8 py-3 border border-gray-300"
            >
              ← Retour aux détails
            </Button>
            <Button
              onClick={() => setStep(3)}
              className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-3"
            >
              <span>Continuer vers l'envoi</span>
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
          title="Aperçu complet de l'invitation"
          showGuestInfo={true}
        />
      )}
    </div>
  );
}
