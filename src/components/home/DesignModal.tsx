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

interface DesignModalProps {
  editCard: Template | null;
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
  handleUseTemplate: (design: Template, colorOverride?: string) => void;
}

const DesignModal: React.FC<DesignModalProps> = ({
  editCard,
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
  handleUseTemplate,
}) => {
  if (!editCard) return null;

  // Composant DesignPreview réutilisable
  const DesignPreview = ({
    design,
    colorOverride,
  }: {
    design: Template;
    colorOverride?: string;
  }) => {
    const bgStyle: React.CSSProperties = design.bgColor
      ? { background: design.bgColor }
      : colorOverride
      ? { background: colorOverride }
      : { background: "linear-gradient(135deg, #e2e8f0 0%, #c7d2fe 100%)" };

    const getPreviewComponent = () => {
      switch (design.preview) {
        case "simple":
          return (
            <div className="model1-container scale-150">
              <div className="model1-content">
                <div className="model1-envelope opened" />
                <div className="model1-letter visible">
                  <div className="model1-body">
                    <span className="model1-close">×</span>
                    <div className="model1-message">fin.</div>
                  </div>
                </div>
                <div className="model1-shadow" />
              </div>
            </div>
          );
        case "birthday":
          return (
            <div className="model2-envelope scale-150">
              <div className="model2-envelope_top model2-envelope_top_close" />
              <div className="model2-envelope_body">
                <div className="model2-paper model2-paper_close">
                  <span>Happy Birthday!</span>
                </div>
                <div className="model2-envelope_body_front" />
                <div className="model2-envelope_body_left" />
                <div className="model2-envelope_body_right" />
              </div>
            </div>
          );
        case "simple-hover":
          return (
            <div className="model3-envelope scale-150">
              <div className="model3-back" />
              <div className="model3-letter model3-lift">
                <div className="model3-text">Remember To Change The World!</div>
              </div>
              <div className="model3-front" />
              <div className="model3-top" />
              <div className="model3-shadow" />
            </div>
          );
        case "love":
          return (
            <div className="model4-envlope-wrapper scale-150 open">
              <div className="model4-envelope open">
                <div className="model4-front model4-flap" />
                <div className="model4-front model4-pocket" />
                <div className="model4-letter">
                  <div className="model4-words model4-line1" />
                  <div className="model4-words model4-line2" />
                  <div className="model4-words model4-line3" />
                  <div className="model4-words model4-line4" />
                </div>
                <div className="model4-hearts">
                  <div className="model4-heart model4-a1" />
                  <div className="model4-heart model4-a2" />
                  <div className="model4-heart model4-a3" />
                </div>
              </div>
            </div>
          );
        case "valentine":
          return (
            <div className="model5-container-valentine scale-150">
              <div className="model5-envelope active">
                <div className="model5-envelope-back" />
                <div className="model5-envelope-inner" />
                <div className="model5-letter">
                  <div className="model5-letter-content">Your message</div>
                </div>
                <div className="model5-envelope-front" />
                <div className="model5-envelope-flap" />
              </div>
            </div>
          );
        case "heart":
          return (
            <div className="model11-letter_ct scale-150">
              <input
                type="checkbox"
                id="model11-check"
                checked={true}
                readOnly
                className="model11-check"
              />
              <label htmlFor="model11-check" className="model11-label">
                <span className="model11-letter model11-main"></span>
                <div className="model11-note">
                  <p className="model11-int">Dear [NAME],</p>
                  <p>
                    [MESSAGE]
                    <br />
                    [MESSAGE]
                  </p>
                  <p className="model11-sign">
                    [greeting],
                    <br />
                    [OWN NAME]
                  </p>
                </div>
                <span className="model11-front"></span>
                <span className="model11-letter model11-flap-bg"></span>
                <span className="model11-letter model11-flap"></span>
                <span className="model11-heart"></span>
              </label>
            </div>
          );
        case "extravagant":
          return (
            <div className="model7-envelop scale-150">
              <div className="model7-envelop__front-paper" />
              <div className="model7-envelop__back-paper" />
              <div className="model7-envelop__up-paper" />
              <div className="model7-envelop__sticker" />
              <div className="model7-envelop__false-sticker" />
              <div className="model7-envelop__content">
                <div className="model7-love-notes">
                  <div className="model7-note">
                    <div className="model7-note__text">
                      <p>Hola amor...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        case "basic":
          return (
            <div className="model8-page1 scale-150">
              <div className="model8-envelope-wrapper open">
                <div className="model8-envelope open">
                  <div className="model8-flap" />
                  <div className="model8-stripe" />
                </div>
                <div className="model8-letter popped">
                  Hey Lorraine...{" "}
                  <button className="model8-next-btn">Next</button>
                </div>
              </div>
            </div>
          );
        case "fly":
          return (
            <div className="model9-envelope_form_wrap scale-150">
              <div className="model9-env_wrap">
                <div className="model9-env_form_wrap">
                  <h3>Drop in your email</h3>
                </div>
                <div className="model9-env_top" />
                <div className="model9-env_bottom_wrap">
                  <div className="model9-env_bottom" />
                </div>
              </div>
            </div>
          );
        default:
          return (
            <div className="flex items-center justify-center w-full h-full">
              <div className="text-lg text-muted-foreground">
                Aperçu du modèle
              </div>
            </div>
          );
      }
    };

    return (
      <div
        className="rounded-2xl overflow-hidden shadow-2xl w-full h-full"
        style={bgStyle}
      >
        <div className="w-full h-full flex items-center justify-center p-8">
          {getPreviewComponent()}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={!!editCard} onOpenChange={closeDesignModal}>
      <DialogContent className="max-w-7xl w-full max-h-[90vh] overflow-hidden rounded-3xl p-0 border-0 shadow-2xl">
        <DialogHeader className="p-6 border-b bg-gradient-to-r from-slate-50 to-blue-50">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-foreground">
              {editCard.name}
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
          <div className="lg:col-span-2 flex flex-col p-8 bg-gradient-to-br from-gray-50 to-blue-50 min-h-[600px]">
            <div className="flex-1 flex items-center justify-center rounded-3xl bg-white/90 backdrop-blur-sm p-8 shadow-inner border">
              <div className="w-full h-full flex items-center justify-center">
                <div
                  ref={previewRef}
                  className="w-full h-full flex items-center justify-center"
                >
                  <DesignPreview
                    design={editCard}
                    colorOverride={selectedColor || undefined}
                  />
                </div>
              </div>
            </div>

            {/* Navigation et contrôles */}
            <div className="flex items-center justify-between mt-8 px-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => navigateSlide("prev")}
                  className="flex items-center gap-2 rounded-xl px-6 py-3 text-base"
                >
                  <ChevronLeft className="h-5 w-5" />
                  Précédent
                </Button>

                <Button
                  onClick={() => playPreview(editCard)}
                  className="flex items-center gap-2 rounded-xl px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all text-base"
                >
                  <Eye className="h-5 w-5" />
                  Prévisualiser
                </Button>
              </div>

              <span className="text-lg text-muted-foreground font-medium bg-white/80 px-4 py-2 rounded-full border">
                {currentSlide + 1} / {allDesigns.length}
              </span>

              <Button
                variant="outline"
                onClick={() => navigateSlide("next")}
                className="flex items-center gap-2 rounded-xl px-6 py-3 text-base"
              >
                Suivant
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Options de personnalisation - 1/3 de la largeur */}
          <div className="lg:col-span-1 flex flex-col bg-white border-l">
            <div className="flex-1 overflow-auto p-8 space-y-8">
              <Card className="border-0 shadow-2xl rounded-3xl">
                <CardHeader className="pb-6">
                  <CardTitle className="text-xl font-bold flex items-center gap-3">
                    <Palette className="h-6 w-6 text-blue-600" />
                    Personnalisation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  {/* Sélection de couleur */}
                  <div>
                    <h4 className="text-base font-semibold mb-4 text-gray-800">
                      Couleur principale
                    </h4>
                    <div className="flex flex-wrap gap-4">
                      {editCard.colors?.map((color, index) => (
                        <button
                          key={index}
                          className={`w-12 h-12 rounded-2xl border-4 transition-all hover:scale-110 ${
                            selectedColor === color
                              ? "border-blue-500 scale-110 ring-4 ring-blue-200"
                              : "border shadow-lg"
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => {
                            setSelectedColor(color);
                            setCardColors({
                              ...cardColors,
                              [editCard.id]: color,
                            });
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Bouton d'édition principal */}
                  <Button
                    onClick={() => {
                      handleUseTemplate(editCard, selectedColor);
                      closeDesignModal();
                    }}
                    className="w-full flex items-center gap-3 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg shadow-2xl hover:shadow-3xl transition-all"
                  >
                    <Edit className="h-6 w-6" />
                    Éditer cette carte
                  </Button>

                  {/* Informations du design */}
                  <div className="space-y-6 pt-6 border-t">
                    <h4 className="text-base font-semibold text-gray-800 flex items-center gap-3">
                      <Tag className="h-5 w-5" />
                      Informations du design
                    </h4>
                    <div className="space-y-4 text-base">
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-muted-foreground">
                          Catégorie:
                        </span>
                        <Badge
                          variant="secondary"
                          className="capitalize font-semibold text-sm"
                        >
                          {editCard.category}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-muted-foreground">
                          Popularité:
                        </span>
                        <span className="font-bold text-green-600">
                          {editCard.popularity}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-muted-foreground">Éléments:</span>
                        <span className="font-bold">
                          {editCard.items?.length || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-100">
                        <span className="text-muted-foreground">
                          Enveloppe:
                        </span>
                        <Badge
                          className={
                            editCard.hasEnvelope
                              ? "bg-green-600 text-white"
                              : "bg-secondary0 text-white"
                          }
                        >
                          {editCard.hasEnvelope ? "Incluse" : "Non incluse"}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center py-3">
                        <span className="text-muted-foreground">Créé le:</span>
                        <span className="font-semibold">
                          {formatDate(editCard.createdAt)}
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
