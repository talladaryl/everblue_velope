import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, Heart, Share2, Pencil } from "lucide-react";
import { CardDesigns } from "./CardDesigns";
import { useNavigate } from "react-router-dom";

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: any;
  allTemplates: any[];
}

export const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  onClose,
  template,
  allTemplates,
}) => {
  const navigate = useNavigate();
  const [currentTemplate, setCurrentTemplate] = useState(template);
  const [selectedColors, setSelectedColors] = useState(template?.colors || []);

  // Mettre à jour le template quand il change
  React.useEffect(() => {
    if (template) {
      setCurrentTemplate(template);
      setSelectedColors(template.colors);
    }
  }, [template]);

  const currentIndex = allTemplates.findIndex((t) => t.id === currentTemplate?.id);

  const handlePrevious = () => {
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : allTemplates.length - 1;
    const prevTemplate = allTemplates[prevIndex];
    setCurrentTemplate(prevTemplate);
    setSelectedColors(prevTemplate.colors);
  };

  const handleNext = () => {
    const nextIndex = currentIndex < allTemplates.length - 1 ? currentIndex + 1 : 0;
    const nextTemplate = allTemplates[nextIndex];
    setCurrentTemplate(nextTemplate);
    setSelectedColors(nextTemplate.colors);
  };

  if (!isOpen || !currentTemplate) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm">
      {/* Navigation Arrows */}
      <button
        onClick={handlePrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Modal Content */}
      <div className="h-full flex items-center justify-center p-4">
        <div className="bg-white shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row">
          {/* Left: Card Preview */}
          <div className="w-full md:w-1/2 bg-gray-50 p-6 flex items-center justify-center">
            <div className="w-full max-w-sm">
              {/* Carte avec effet d'ombre double décalée */}
              <div className="relative aspect-[3/4]">
                {/* Ombre décalée - 2ème niveau */}
                <div 
                  className="absolute top-3 left-3 w-full h-full bg-neutral-300/40"
                  style={{ filter: 'blur(2px)' }}
                />
                {/* Ombre décalée - 1er niveau */}
                <div 
                  className="absolute top-1.5 left-1.5 w-full h-full bg-neutral-400/50"
                  style={{ filter: 'blur(1px)' }}
                />
                {/* Carte principale avec texture papier premium */}
                <div className="relative w-full h-full overflow-hidden premium-paper-texture shadow-xl">
                  <CardDesigns
                    type={currentTemplate.type}
                    colors={selectedColors}
                    scale={1}
                  />
                </div>
              </div>
              {/* Backside supported badge */}
              <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                </svg>
                <span>Backside supported</span>
              </div>
            </div>
          </div>

          {/* Right: Options */}
          <div className="w-full md:w-1/2 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold text-gray-900">{currentTemplate.title}</h2>
                  <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                    <Heart className="w-5 h-5 text-gray-400" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                    <Share2 className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                <p className="text-sm text-gray-500">{currentTemplate.designer}</p>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Color Options */}
              <div className="mb-6">
                <div className="flex gap-2 mb-4">
                  {selectedColors.map((color, index) => (
                    <div key={index} className="relative">
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => {
                          const newColors = [...selectedColors];
                          newColors[index] = e.target.value;
                          setSelectedColors(newColors);
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        title={`Changer la couleur ${index + 1}`}
                      />
                      <button
                        className="w-10 h-10 rounded-full border-2 border-gray-200 shadow-sm transition-transform hover:scale-110 hover:border-gray-400"
                        style={{ backgroundColor: color }}
                      />
                    </div>
                  ))}
                  <button 
                    className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center bg-gradient-to-br from-red-500 via-yellow-500 to-blue-500 hover:scale-110 transition-transform"
                    onClick={() => {
                      // Ajouter une nouvelle couleur
                      setSelectedColors([...selectedColors, '#000000']);
                    }}
                  >
                    <span className="text-white text-xs font-bold">+</span>
                  </button>
                </div>
              </div>

              {/* Start Customizing Button */}
              <button
                onClick={() => {
                  navigate("/builder");
                  onClose();
                }}
                className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors shadow-md mb-4"
              >
                Commencer la personnalisation
              </button>

              {/* Preview Animation Button */}
              <button className="w-full py-3 border-2 border-green-500 text-green-600 hover:bg-green-50 font-semibold transition-colors mb-6 flex items-center justify-center gap-2">
                <span>Aperçu de l'animation</span>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>

              {/* Info Text */}
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <Pencil className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>
                  Vous aurez la possibilité de personnaliser entièrement le texte, l'arrière-plan et l'enveloppe de la carte.
                </p>
              </div>
            </div>

            {/* Footer Description */}
            <div className="p-6 border-t bg-gray-50">
              <p className="text-xs text-gray-600 leading-relaxed">
                Des touches modernes de couleurs texturées donnent à cette carte photo de vacances une ambiance artistique et bohème, tandis que le texte métallique disposé de manière moderne la garde fraîche pour la famille qui est "la plus joyeuse de toutes".
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
