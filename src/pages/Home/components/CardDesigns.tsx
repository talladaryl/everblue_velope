import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface CardDesignProps {
  type: string;
  colors: string[];
  scale?: number;
  data?: any; // Données du template personnalisé
}

// Texture de papier identique à EditCard
const PAPER_TEXTURE = `url("data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`;

export const CardDesigns: React.FC<CardDesignProps> = ({ type, colors, scale = 1, data }) => {
  const { t } = useLanguage();
  
  const renderDesign = () => {
    // Si c'est un template personnalisé avec des données
    if (type === "custom" && data) {
      const { items = [], bgColor = "#ffffff", bgImage = null } = data;
      
      const paperStyle = {
        backgroundColor: bgImage ? "transparent" : (bgColor || "#FAF8F4"),
        backgroundImage: bgImage
          ? `url(${bgImage}), ${PAPER_TEXTURE}`
          : bgColor.includes("gradient")
          ? `${bgColor}, ${PAPER_TEXTURE}`
          : `${bgColor || "#FAF8F4"}, ${PAPER_TEXTURE}`,
        backgroundBlendMode: bgImage ? "overlay, multiply" : "normal, multiply",
        backgroundSize: bgImage ? "cover, auto" : "cover, auto",
        width: "100%",
        height: "100%",
        position: "relative" as const,
        overflow: "hidden",
      };

      return (
        <div style={paperStyle}>
          {items.map((it: any) => (
            <div
              key={it.id}
              className="absolute"
              style={{
                left: it.x,
                top: it.y,
                borderRadius: it.type !== "text" ? `${it.borderRadius || 0}px` : "0px",
                transform: `
                  rotate(${it.rotation || 0}deg)
                  scaleX(${it.flipX ? -1 : 1})
                  scaleY(${it.flipY ? -1 : 1})
                `,
                filter: `
                  brightness(${it.filters?.brightness || 100}%)
                  contrast(${it.filters?.contrast || 100}%)
                  saturate(${it.filters?.saturation || 100}%)
                  blur(${it.filters?.blur || 0}px)
                  grayscale(${it.filters?.grayscale || 0}%)
                  ${
                    it.shadow?.enabled
                      ? `drop-shadow(${it.shadow.offsetX}px ${it.shadow.offsetY}px ${it.shadow.blur}px ${it.shadow.color})`
                      : ""
                  }
                `,
                opacity: (it.opacity || 100) / 100,
              }}
            >
              {it.type === "text" ? (
                <div
                  style={{
                    color: it.color || "#000000",
                    fontSize: `${it.fontSize || 16}px`,
                    fontFamily: it.fontFamily || "Arial",
                    fontWeight: it.fontWeight || "normal",
                    textAlign: it.textAlign || "left",
                    textShadow: it.textShadow || "none",
                    lineHeight: 1.4,
                    wordBreak: "break-word",
                    whiteSpace: "pre-wrap",
                    padding: "4px",
                  }}
                >
                  {it.text || "Texte"}
                </div>
              ) : it.type === "video" ? (
                <video
                  src={it.src}
                  autoPlay={it.autoPlay}
                  loop={it.loop}
                  muted={it.muted}
                  className="object-cover"
                  style={{
                    width: it.width || "200px",
                    height: it.height || "150px",
                  }}
                />
              ) : (
                <img
                  src={it.src}
                  alt=""
                  draggable={false}
                  className="object-cover"
                  style={{
                    width: it.width || "150px",
                    height: it.height || "150px",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      );
    }

    switch (type) {
      case "birthday-split":
        return (
          <div className="w-full h-full flex">
            <div 
              className="w-1/2 flex items-center justify-center"
              style={{ backgroundColor: colors[0] }}
            >
              <img
                src="https://images.pexels.com/photos/1729797/pexels-photo-1729797.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Birthday"
                className="w-full h-full object-cover"
              />
            </div>
            <div 
              className="w-1/2 flex flex-col items-center justify-center p-2"
              style={{ backgroundColor: colors[1] }}
            >
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-white mb-1" style={{ fontFamily: "'Pacifico', cursive" }}>
                {t("homePage.cardDesigns.happyBirthday")}
              </h2>
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-white text-center" style={{ fontFamily: "'Pacifico', cursive" }}>
                {t("homePage.cardDesigns.birthday")}
              </h1>
            </div>
          </div>
        );

      case "wedding-elegant":
        return (
          <div 
            className="w-full h-full flex flex-col items-center justify-center p-3 sm:p-6 lg:p-8 relative"
            style={{ backgroundColor: colors[2] }}
          >
            <div className="absolute top-3 left-3 right-3 bottom-3 sm:top-6 sm:left-6 sm:right-6 sm:bottom-6 border-2" style={{ borderColor: colors[0] }} />
            <h3 className="text-[10px] sm:text-sm lg:text-xl mb-1 sm:mb-3 text-center px-2" style={{ fontFamily: "'Great Vibes', cursive", color: colors[0] }}>
              {t("homePage.cardDesigns.weddingInvitation")}
            </h3>
            <h1 className="text-xl sm:text-3xl lg:text-5xl font-bold mb-1 sm:mb-2" style={{ fontFamily: "'Playfair Display', serif", color: colors[0] }}>
              Jean & Marie
            </h1>
            <p className="text-[10px] sm:text-sm lg:text-lg mt-1 sm:mt-3" style={{ fontFamily: "'Cormorant Garamond', serif", color: colors[0] }}>
              15 Juin 2024
            </p>
          </div>
        );

      case "baptism-collage":
        return (
          <div 
            className="w-full h-full p-2 sm:p-4 relative"
            style={{ backgroundColor: colors[1] }}
          >
            <div className="absolute top-6 left-2 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-lg overflow-hidden shadow-lg transform -rotate-6">
              <img src="https://images.pexels.com/photos/1648387/pexels-photo-1648387.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Baby" className="w-full h-full object-cover" />
            </div>
            <div className="absolute top-4 right-4 w-14 h-14 sm:w-20 sm:h-20 lg:w-28 lg:h-28 rounded-lg overflow-hidden shadow-lg transform rotate-12">
              <img src="https://images.pexels.com/photos/1648375/pexels-photo-1648375.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Baby" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-14 left-6 w-20 h-20 sm:w-28 sm:h-28 lg:w-36 lg:h-36 rounded-lg overflow-hidden shadow-lg transform rotate-3">
              <img src="https://images.pexels.com/photos/1648358/pexels-photo-1648358.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Baby" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-10 right-2 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-lg overflow-hidden shadow-lg transform -rotate-12">
              <img src="https://images.pexels.com/photos/1648398/pexels-photo-1648398.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Baby" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-sm p-3 sm:p-5 lg:p-6 rounded-2xl shadow-xl text-center">
                <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold mb-1" style={{ fontFamily: "'Quicksand', sans-serif", color: colors[0] }}>
                  {t("homePage.cardDesigns.baptism")}
                </h2>
                <p className="text-sm sm:text-lg lg:text-xl" style={{ fontFamily: "'Quicksand', sans-serif", color: colors[2] }}>
                  {t("homePage.cardDesigns.of")} Lucas
                </p>
              </div>
            </div>
          </div>
        );







      case "anniversary-romantic":
        return (
          <div 
            className="w-full h-full flex items-center justify-center p-3 sm:p-6 lg:p-8 relative"
            style={{ backgroundColor: colors[0] }}
          >
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <div className="text-5xl sm:text-7xl lg:text-9xl">❤️</div>
            </div>
            <div className="text-center z-10">
              <h3 className="text-xs sm:text-lg lg:text-2xl text-white mb-1 sm:mb-3" style={{ fontFamily: "'Great Vibes', cursive" }}>
                {t("homePage.cardDesigns.happyAnniversary")}
              </h3>
              <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold text-white mb-2 sm:mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                25 {t("homePage.cardDesigns.years")}
              </h1>
              <p className="text-[10px] sm:text-base lg:text-xl text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {t("homePage.cardDesigns.loveAndHappiness")}
              </p>
            </div>
          </div>
        );



      default:
        return (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <p>{t("homePage.cardDesigns.designNotAvailable")}</p>
          </div>
        );
    }
  };

  return (
    <div 
      className="w-full h-full"
      style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
    >
      {renderDesign()}
    </div>
  );
};
