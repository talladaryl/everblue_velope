// src/components/home/DesignModal.tsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  Palette,
  Tag,
  X,
} from "lucide-react";
import { Template } from "@/types";
import DesignPreview from "./DesignPreview";

interface DesignModalProps {
  selectedDesign: Template | null;
  closeDesignModal: () => void;
  currentSlide: number;
  allDesigns: Template[];
  navigateSlide: (direction: "prev" | "next") => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  cardColors: Record<string, string>;
  setCardColors: (colors: Record<string, string>) => void;
  playPreview: (design: Template | null) => void;
  navigate: (path: string) => void;
  formatDate: (date?: string | Date) => string;
  previewRef: React.RefObject<HTMLDivElement>;
}

const DesignModal: React.FC<DesignModalProps> = ({
  selectedDesign,
  closeDesignModal,
  currentSlide,
  allDesigns,
  navigateSlide,
  selectedColor,
  setSelectedColor,
  cardColors,
  setCardColors,
  playPreview,
  navigate,
  formatDate,
  previewRef,
}) => {
  if (!selectedDesign) return null;

  return (
    <Dialog open={!!selectedDesign} onOpenChange={closeDesignModal}>
      <DialogContent className="max-w-7xl w-full max-h-[95vh] overflow-hidden rounded-3xl p-0 border-0 shadow-2xl">
        <DialogHeader className="p-6 border-b bg-gradient-to-r from-slate-50 to-blue-50">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {selectedDesign.name}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeDesignModal}
              className="h-9 w-9 p-0 rounded-full hover:bg-white/50"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 h-full">
          {/* Aperçu du design - 2/3 de la largeur */}
          <div className="lg:col-span-2 flex flex-col p-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-[600px]">
            <div className="flex-1 flex items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm p-4 shadow-inner">
              <div className="w-full h-full flex items-center justify-center">
                <div
                  ref={previewRef}
                  className="w-full h-full flex items-center justify-center scale-150" // Agrandissement ici
                >
                  <DesignPreview
                    design={selectedDesign}
                    colorOverride={selectedColor || undefined}
                    isModal
                  />
                </div>
              </div>
            </div>

            {/* Navigation et contrôles */}
            <div className="flex items-center justify-between mt-6 px-2">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigateSlide("prev")}
                  className="flex items-center gap-2 rounded-xl px-4 py-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Précédent
                </Button>

                <Button
                  onClick={() => playPreview(selectedDesign)}
                  className="flex items-center gap-2 rounded-xl px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  <Eye className="h-4 w-4" />
                  Prévisualiser
                </Button>
              </div>

              <span className="text-sm text-muted-foreground font-medium bg-white/50 px-3 py-1 rounded-full">
                {currentSlide + 1} / {allDesigns.length}
              </span>

              <Button
                variant="outline"
                onClick={() => navigateSlide("next")}
                className="flex items-center gap-2 rounded-xl px-4 py-2"
              >
                Suivant
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Options de personnalisation - 1/3 de la largeur */}
          <div className="lg:col-span-1 flex flex-col bg-white border-l">
            <div className="flex-1 overflow-auto p-6 space-y-6">
              <Card className="border-0 shadow-lg rounded-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Palette className="h-5 w-5 text-blue-600" />
                    Personnalisation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Sélection de couleur */}
                  <div>
                    <h4 className="text-sm font-medium mb-4 text-gray-700">
                      Couleur principale
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {selectedDesign.colors?.map((color, index) => (
                        <button
                          key={index}
                          className={`w-10 h-10 rounded-xl border-3 transition-all hover:scale-110 ${
                            selectedColor === color
                              ? "border-blue-500 scale-110 ring-4 ring-blue-200"
                              : "border-gray-200 shadow-md"
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => {
                            setSelectedColor(color);
                            setCardColors({
                              ...cardColors,
                              [selectedDesign.id]: color,
                            });
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Bouton d'édition principal */}
                  <Button
                    onClick={() => {
                      navigate(`/builder?template=${selectedDesign.id}`);
                      closeDesignModal();
                    }}
                    className="w-full flex items-center gap-3 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    <Edit className="h-5 w-5" />
                    Éditer cette carte
                  </Button>

                  {/* Informations du design */}
                  <div className="space-y-4 pt-4 border-t">
                    <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      Informations du design
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-muted-foreground">
                          Catégorie:
                        </span>
                        <Badge
                          variant="outline"
                          className="capitalize font-medium"
                        >
                          {selectedDesign.category}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-muted-foreground">
                          Popularité:
                        </span>
                        <span className="font-semibold text-green-600">
                          {selectedDesign.popularity}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-muted-foreground">Éléments:</span>
                        <span className="font-semibold">
                          {selectedDesign.items?.length || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-muted-foreground">Créé le:</span>
                        <span className="font-medium">
                          {formatDate(selectedDesign.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DesignModal;
