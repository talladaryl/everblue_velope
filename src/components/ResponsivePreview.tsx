import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X, Smartphone, Monitor, AlertCircle, CheckCircle } from "lucide-react";
import { prepareTemplateForRendering } from "@/utils/variableSubstitution";

interface ResponsivePreviewProps {
  items: any[];
  bgColor: string;
  bgImage?: string | null;
  guest: any;
  onClose: () => void;
  title?: string;
  showGuestInfo?: boolean;
}

export const ResponsivePreview: React.FC<ResponsivePreviewProps> = ({
  items,
  bgColor,
  bgImage,
  guest,
  onClose,
  title = "Aperçu de l'invitation",
  showGuestInfo = true,
}) => {
  const [viewMode, setViewMode] = useState<"mobile" | "desktop">("desktop");
  const [isMobileScreen, setIsMobileScreen] = useState(false);

  // Détecter la taille de l'écran
  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Préparer le template avec les données de l'invité
  const {
    items: replacedItems,
    valid,
    variables,
  } = prepareTemplateForRendering(items, guest);

  // Déterminer le style de fond
  const backgroundStyle: React.CSSProperties = {
    backgroundColor: bgColor,
    backgroundImage: bgImage ? `url(${bgImage})` : undefined,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  // Dimensions selon le mode
  const previewDimensions = {
    mobile: { width: 375, height: 667 },
    desktop: { width: 800, height: 600 },
  };

  const dimensions = previewDimensions[viewMode];

  // Calculer l'échelle adaptée à l'écran
  const maxWidth = isMobileScreen ? window.innerWidth - 40 : 800;
  const scale = Math.min(1, maxWidth / dimensions.width);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 md:p-4">
      <Card className="w-full max-w-4xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b">
          <div>
            <CardTitle>{title}</CardTitle>
            {showGuestInfo && (
              <p className="text-sm text-gray-600 mt-1">
                Invité: <span className="font-semibold">{guest.full_name}</span>{" "}
                ({guest.email})
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Alertes */}
          {!valid && (
            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                Certaines variables n'ont pas pu être remplacées. Vérifiez les
                données de l'invité.
              </AlertDescription>
            </Alert>
          )}

          {valid && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Toutes les variables ont été remplacées avec succès.
              </AlertDescription>
            </Alert>
          )}

          {/* Contrôles de vue */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex gap-2 w-full md:w-auto">
              <Button
                variant={viewMode === "desktop" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("desktop")}
                className="flex-1 md:flex-none flex items-center justify-center gap-2"
              >
                <Monitor className="h-4 w-4" />
                <span className="hidden sm:inline">Desktop</span>
              </Button>
              <Button
                variant={viewMode === "mobile" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("mobile")}
                className="flex-1 md:flex-none flex items-center justify-center gap-2"
              >
                <Smartphone className="h-4 w-4" />
                <span className="hidden sm:inline">Mobile</span>
              </Button>
            </div>

            {/* Informations */}
            <div className="flex gap-2 flex-wrap justify-center md:justify-end">
              <Badge variant="outline" className="text-xs md:text-sm">
                {dimensions.width}x{dimensions.height}px
              </Badge>
              <Badge variant="outline" className="text-xs md:text-sm">
                {replacedItems.length} éléments
              </Badge>
            </div>
          </div>

          {/* Zone de prévisualisation */}
          <div className="flex justify-center overflow-auto pb-4 max-h-[70vh]">
            <div
              style={{
                width: `${dimensions.width}px`,
                height: `${dimensions.height}px`,
                ...backgroundStyle,
                borderRadius: "8px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
                position: "relative",
                overflow: "hidden",
                transform: `scale(${scale})`,
                transformOrigin: "top center",
                flexShrink: 0,
              }}
            >
              {/* Rendu des items */}
              {replacedItems.map((item: any, index: number) => (
                <div
                  key={index}
                  style={{
                    position: "absolute",
                    left: `${item.x}px`,
                    top: `${item.y}px`,
                    width: `${item.width}px`,
                    height: `${item.height}px`,
                    opacity: (item.opacity ?? 100) / 100,
                    transform: `
                      rotate(${item.rotation ?? 0}deg)
                      scaleX(${item.flipX ? -1 : 1})
                      scaleY(${item.flipY ? -1 : 1})
                    `,
                    filter: `
                      brightness(${item.filters?.brightness ?? 100}%)
                      contrast(${item.filters?.contrast ?? 100}%)
                      saturate(${item.filters?.saturation ?? 100}%)
                      blur(${item.filters?.blur ?? 0}px)
                      grayscale(${item.filters?.grayscale ?? 0}%)
                    `,
                  }}
                >
                  {item.type === "text" ? (
                    <div
                      style={{
                        color: item.color || "#000000",
                        fontSize: `${item.fontSize || 16}px`,
                        fontFamily: item.fontFamily || "Arial",
                        fontWeight: item.fontWeight || 400,
                        textAlign: item.textAlign || "left",
                        textShadow: item.textShadow || "none",
                        letterSpacing: `${item.letterSpacing || 0}px`,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                          item.textAlign === "center"
                            ? "center"
                            : item.textAlign === "right"
                            ? "flex-end"
                            : "flex-start",
                        padding: "8px",
                        wordWrap: "break-word",
                        whiteSpace: "pre-wrap",
                        overflow: "hidden",
                      }}
                    >
                      {item.text}
                    </div>
                  ) : item.type === "image" || item.type === "gif" ? (
                    <img
                      src={item.src}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: `${item.borderRadius || 0}px`,
                        objectFit: "cover",
                      }}
                    />
                  ) : item.type === "video" ? (
                    <video
                      src={item.src}
                      autoPlay={item.autoPlay}
                      loop={item.loop}
                      muted={item.muted}
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: `${item.borderRadius || 0}px`,
                        objectFit: "cover",
                      }}
                    />
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          {/* Informations sur les variables */}
          {Object.keys(variables).length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-sm mb-3">
                Variables remplacées:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(variables).map(([key, value]) => (
                  <div key={key} className="text-xs md:text-sm break-words">
                    <span className="font-mono text-gray-600">{key}:</span>
                    <span className="ml-2 text-gray-900 font-medium truncate">
                      {String(value || "—")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Boutons d'action */}
          <div className="flex flex-col md:flex-row justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onClose}
              className="w-full md:w-auto flex items-center justify-center gap-2"
            >
              <X className="h-4 w-4" />
              Fermer
            </Button>
            <Button
              onClick={onClose}
              className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              Continuer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
