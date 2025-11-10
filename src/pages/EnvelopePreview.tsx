import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { EditorItem } from "./Builder";

interface EnvelopePreviewProps {
  items: EditorItem[];
  bgColor: string;
  onClose: () => void;
}

export default function EnvelopePreview({
  items,
  bgColor,
  onClose,
}: EnvelopePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const envelopeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = () => {
      const container = containerRef.current;
      const envelope = envelopeRef.current;

      if (!container || !envelope) return;

      // Animation améliorée
      envelope.style.transform = "rotateY(180deg)";

      setTimeout(() => {
        const card = envelope.querySelector(".card") as HTMLElement;
        if (card) {
          card.style.transform = "translateY(-200px)";
          card.style.zIndex = "100";
        }
      }, 800);

      setTimeout(() => {
        const card = envelope.querySelector(".card") as HTMLElement;
        if (card) {
          card.style.transform = "translateY(0) scale(1.05)";
        }
      }, 1600);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("click", handleClick);
      return () => container.removeEventListener("click", handleClick);
    }
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold">Prévisualisation</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6">
          <div
            ref={containerRef}
            className="envelope-container mx-auto cursor-pointer"
            style={{ width: "500px", height: "350px", position: "relative" }}
          >
            <div
              ref={envelopeRef}
              className="envelope w-full h-full relative transition-transform duration-1000"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Face avant de l'enveloppe - Version améliorée */}
              <div
                className="envFace front absolute w-full h-full rounded-lg flex items-center justify-center border-2 border-gray-300 shadow-xl"
                style={{
                  backfaceVisibility: "hidden",
                  background:
                    "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                }}
              >
                <div className="text-center p-8">
                  <div className="mb-4">
                    <div className="w-16 h-1 bg-gray-400 mx-auto mb-2"></div>
                    <div className="w-12 h-1 bg-gray-400 mx-auto"></div>
                  </div>
                  <h1 className="text-xl font-bold text-gray-700 mb-2">
                    À: Cher Invité
                  </h1>
                  <p className="text-gray-600 text-sm">
                    Cliquez pour ouvrir l'invitation
                  </p>
                </div>

                {/* Cachet de cire */}
                <div className="absolute bottom-6 right-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-8 h-8 border-2 border-white/30 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Dos de l'enveloppe - Version simplifiée */}
              <div
                className="envFace back absolute w-full h-full rounded-lg"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(-180deg)",
                  background:
                    "linear-gradient(135deg, #e3e8f0 0%, #b8c6db 100%)",
                  border: "2px solid #cbd5e1",
                }}
              >
                {/* Fermeture de l'enveloppe */}
                <div className="absolute top-0 left-0 w-full h-1/2 overflow-hidden rounded-t-lg">
                  <div
                    className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-b from-gray-300/80 to-transparent"
                    style={{ clipPath: "polygon(0% 0%, 100% 0%, 50% 100%)" }}
                  ></div>
                </div>
              </div>

              {/* Carte d'invitation - Version améliorée */}
              <div className="card absolute w-[90%] h-[85%] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 shadow-2xl">
                <div
                  className="w-full h-full rounded-lg border-2 border-white shadow-lg"
                  style={{
                    background: bgColor,
                    backdropFilter: "blur(10px)",
                  }}
                >
                  {/* Contenu de l'invitation */}
                  <div className="greetings relative h-full w-full flex items-center justify-center p-6">
                    <div className="content bg-white/95 backdrop-blur-sm rounded-lg p-6 shadow-lg max-w-sm w-full border border-gray-200">
                      {items
                        .filter((item) => item.type === "text")
                        .map((item, index) => (
                          <div
                            key={item.id}
                            className="mb-3 last:mb-0 text-center"
                            style={{
                              color: (item as any).color,
                              fontSize: `${Math.max(
                                14,
                                (item as any).fontSize * 0.7
                              )}px`,
                              fontWeight: (item as any).fontWeight,
                              fontFamily: (item as any).fontFamily,
                              textAlign: (item as any).textAlign as any,
                              letterSpacing: `${(item as any).letterSpacing}px`,
                              lineHeight: "1.4",
                            }}
                          >
                            {(item as any).text}
                          </div>
                        ))}

                      {/* Message par défaut si pas de texte */}
                      {items.filter((item) => item.type === "text").length ===
                        0 && (
                        <div className="text-center space-y-3">
                          <div
                            className="text-lg font-semibold"
                            style={{ color: "#1f2937" }}
                          >
                            Vous êtes invité !
                          </div>
                          <div className="text-sm" style={{ color: "#6b7280" }}>
                            Rejoignez-nous pour un moment exceptionnel
                          </div>
                        </div>
                      )}

                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <p className="text-gray-600 text-xs text-center mb-4">
                          Nous avons hâte de vous voir lors de cet événement
                          spécial !
                        </p>
                        <div className="text-center">
                          <button
                            className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-sm shadow-md"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                          >
                            Voir les détails
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-6 space-y-3">
            <p className="text-sm text-gray-600">
              Cliquez sur l'enveloppe pour voir l'animation d'ouverture
            </p>
            <div className="flex justify-center gap-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <Button
              onClick={onClose}
              className="px-8 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800"
            >
              Fermer la prévisualisation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
