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
      {/* Conteneur du modal */}
      <div
        className="relative bg-white rounded-lg shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Aperçu de l'invitation</h2>
            {templateTitle && (
              <p className="text-sm text-blue-100 mt-1">{templateTitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
            title="Fermer"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Contenu - Animation d'enveloppe */}
        <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="flex flex-col items-center justify-center">
            {/* Info */}
            <div className="mb-6 text-center">
              {items && items.length > 0 ? (
                <p className="text-gray-600 text-sm">
                  L'animation se lance automatiquement. Cliquez sur l'enveloppe pour l'ouvrir.
                </p>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm font-medium">
                    ⚠️ Ce template n'a pas encore de contenu personnalisé.
                  </p>
                  <p className="text-yellow-700 text-xs mt-1">
                    Cliquez sur "Modifier" pour créer votre design.
                  </p>
                </div>
              )}
            </div>

            {/* PreviewModel1 avec animation */}
            {shouldAnimate && (
              <div className="w-full flex items-center justify-center">
                <PreviewModel1
                  items={items || []}
                  bgColor={bgColor || "#ffffff"}
                  bgImage={bgImage}
                  onClose={onClose}
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 rounded-b-lg border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
