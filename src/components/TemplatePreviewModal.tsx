import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { PreviewModel1 } from "@/pages/builder/modelPreviews";

interface TemplatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: any[];
  bgColor: string;
  bgImage?: string | null;
  templateTitle?: string;
}

export function TemplatePreviewModal({
  isOpen,
  onClose,
  items,
  bgColor,
  bgImage,
  templateTitle,
}: TemplatePreviewModalProps) {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Petit délai pour que le modal s'affiche avant de lancer l'animation
      const timer = setTimeout(() => {
        setShouldAnimate(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setShouldAnimate(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={onClose}
    >
      {/* Bouton de fermeture flottant en haut à droite */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-[110] p-3 bg-white/90 hover:bg-white rounded-full shadow-2xl transition-all hover:scale-110"
        title="Fermer"
      >
        <X className="h-6 w-6 text-gray-800" />
      </button>

      {/* Titre flottant en haut */}
      {templateTitle && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[110] bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-2xl">
          <h2 className="text-lg font-bold text-gray-800">{templateTitle}</h2>
        </div>
      )}

      {/* Conteneur transparent - Juste l'enveloppe qui flotte */}
      <div
        className="relative flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Message d'info flottant en haut de l'enveloppe */}
        {items && items.length > 0 ? (
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 z-[105] bg-white/90 backdrop-blur-md px-4 py-2 rounded-lg shadow-lg">
            <p className="text-gray-700 text-sm font-medium">
              ✨ Cliquez sur l'enveloppe pour l'ouvrir
            </p>
          </div>
        ) : (
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 z-[105] bg-yellow-50/95 backdrop-blur-md border border-yellow-200 rounded-lg p-4 shadow-lg max-w-md">
            <p className="text-yellow-800 text-sm font-medium">
              ⚠️ Ce template n'a pas encore de contenu personnalisé.
            </p>
            <p className="text-yellow-700 text-xs mt-1">
              Cliquez sur "Modifier" pour créer votre design.
            </p>
          </div>
        )}

        {/* PreviewModel1 avec animation - L'enveloppe flotte dans le vide */}
        {shouldAnimate && (
          <div className="transform transition-all duration-500 hover:scale-105">
            <PreviewModel1
              items={items || []}
              bgColor={bgColor || "#ffffff"}
              bgImage={bgImage}
              onClose={onClose}
            />
          </div>
        )}
      </div>

      {/* Bouton Fermer flottant en bas */}
      <button
        onClick={onClose}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[110] px-8 py-3 bg-white/90 hover:bg-white text-gray-800 font-semibold rounded-full shadow-2xl transition-all hover:scale-105"
      >
        Fermer l'aperçu
      </button>
    </div>
  );
}
