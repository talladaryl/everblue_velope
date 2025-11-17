// src/components/home/DesignPreview.tsx
import React, { useEffect, useRef } from "react";
import { Template } from "@/types";
import {
  Model1,
  Model2,
  Model3,
  Model4,
  Model5,
  Model7,
  Model8,
  Model9,
  Model11,
} from "./ModelComponents";

interface DesignPreviewProps {
  design?: Template | null;
  colorOverride?: string;
  isModal?: boolean;
}

const DesignPreview: React.FC<DesignPreviewProps> = React.memo(
  ({ design, colorOverride, isModal = false }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!design || !containerRef.current) return;

      // Animation automatique pour l'aperçu
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });

      switch (design.preview) {
        case "simple":
          const letter = containerRef.current.querySelector(".letter");
          if (letter) {
            tl.to(letter, {
              y: -60,
              opacity: 1,
              duration: 1.5,
              ease: "back.out(1.2)",
            })
              .to(letter, { y: -40, duration: 1, ease: "power2.out" })
              .to(letter, { y: -60, duration: 1, ease: "power2.in" });
          }
          break;
        case "birthday":
          const flap = containerRef.current.querySelector(".envelope_top");
          const paper = containerRef.current.querySelector(".paper");
          if (flap && paper) {
            tl.to(flap, { rotationX: -180, duration: 1, ease: "power2.out" })
              .to(
                paper,
                { y: -40, duration: 0.8, ease: "back.out(1.2)" },
                "-=0.6"
              )
              .to(paper, { y: 0, duration: 0.8, ease: "power2.in" })
              .to(
                flap,
                { rotationX: 0, duration: 1, ease: "power2.out" },
                "-=0.8"
              );
          }
          break;
        case "simple-hover":
          const hoverLetter = containerRef.current.querySelector(".letter");
          if (hoverLetter) {
            tl.to(hoverLetter, {
              y: -50,
              duration: 1.5,
              ease: "back.out(1.2)",
            }).to(hoverLetter, { y: 0, duration: 1.5, ease: "power2.in" });
          }
          break;
        default:
          // Animation de pulsation par défaut
          const element = containerRef.current.querySelector(
            ".envelope, .envlope-wrapper, .container-valentine"
          );
          if (element) {
            tl.to(element, { scale: 1.05, duration: 1, ease: "power2.out" }).to(
              element,
              { scale: 1, duration: 1, ease: "power2.in" }
            );
          }
      }

      return () => {
        tl.kill();
      };
    }, [design]);

    if (!design) {
      return (
        <div className="w-full h-32 sm:h-40 flex items-center justify-center text-sm text-muted-foreground bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg">
          Aperçu indisponible
        </div>
      );
    }

    const bgStyle: React.CSSProperties = design.bgColor
      ? { background: design.bgColor }
      : colorOverride
      ? { background: colorOverride }
      : { background: "linear-gradient(135deg, #e2e8f0 0%, #c7d2fe 100%)" };

    const wrapperStyle: React.CSSProperties = isModal
      ? {
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }
      : { width: "100%", height: 200 };

    const getPreviewComponent = () => {
      switch (design.preview) {
        case "simple":
          return <Model1 />;
        case "birthday":
          return <Model2 />;
        case "simple-hover":
          return <Model3 />;
        case "love":
          return <Model4 />;
        case "valentine":
          return <Model5 />;
        case "heart":
          return <Model11 />;
        case "extravagant":
          return <Model7 />;
        case "basic":
          return <Model8 />;
        case "fly":
          return <Model9 />;
        default:
          return <Model1 />;
      }
    };

    return (
      <div
        ref={containerRef}
        className="rounded-lg overflow-hidden shadow-inner"
        style={{ ...bgStyle, ...wrapperStyle }}
      >
        <div className="w-full h-full flex items-center justify-center p-4">
          {getPreviewComponent()}
        </div>
      </div>
    );
  }
);

DesignPreview.displayName = "DesignPreview";

export default DesignPreview;
