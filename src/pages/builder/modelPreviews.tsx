import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { CSSRulePlugin } from "gsap/CSSRulePlugin";

// Enregistrer les plugins GSAP
if (typeof window !== "undefined") {
  gsap.registerPlugin(CSSRulePlugin);
}

// Couleurs disponibles pour les enveloppes
export const ENVELOPE_COLORS = [
  { id: "green", primary: "#26452b", secondary: "#283c2b", accent: "#7873A7", name: "Vert" },
  { id: "red", primary: "#ae4243", secondary: "#ff6b6b", accent: "#ee5253", name: "Rouge" },
  { id: "blue", primary: "#004d66", secondary: "#0077B2", accent: "#006699", name: "Bleu" },
  { id: "gold", primary: "#967b5c", secondary: "#ba9872", accent: "#d4af37", name: "Or" },
  { id: "pink", primary: "#ff9eb5", secondary: "#ffc6d9", accent: "#d87a8d", name: "Rose" },
  { id: "purple", primary: "#6b5b95", secondary: "#8b7bb5", accent: "#a99bc5", name: "Violet" },
];

// Composant de sélection de couleur d'enveloppe
export function EnvelopeColorPicker({ 
  selectedColor, 
  onColorChange 
}: { 
  selectedColor: string; 
  onColorChange: (colorId: string) => void;
}) {
  return (
    <div className="flex gap-2 p-2">
      {ENVELOPE_COLORS.map((color) => (
        <button
          key={color.id}
          onClick={() => onColorChange(color.id)}
          className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
            selectedColor === color.id 
              ? "border-white ring-2 ring-offset-2 ring-blue-500" 
              : "border-gray-300"
          }`}
          style={{ backgroundColor: color.primary }}
          title={color.name}
        />
      ))}
    </div>
  );
}

// Interface pour les props des modèles
interface ModelPreviewProps {
  items: any[];
  bgColor: string;
  bgImage?: string | null;
  onClose?: () => void;
  guest?: any;
  envelopeColor?: string;
  onEnvelopeColorChange?: (colorId: string) => void;
}

// Interface pour CardPreview
interface CardPreviewProps {
  items: any[];
  bgColor: string;
  bgImage?: string | null;
  scale?: number;
  width?: number;
  height?: number;
}

// Texture de papier identique à EditCard
const PAPER_TEXTURE = `url("data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`;

// Composant CardPreview (identique à votre version)
function CardPreview({ items, bgColor, bgImage, scale = 0.5, width = 600, height = 400 }: CardPreviewProps) {
  const scaledWidth = width * scale;
  const scaledHeight = height * scale;

  const paperStyle: React.CSSProperties = {
    width: `${scaledWidth}px`,
    height: `${scaledHeight}px`,
    position: "relative",
    overflow: "hidden",
    borderRadius: "0px",
    backgroundColor: bgImage ? "transparent" : (bgColor || "#FAF8F4"),
    backgroundImage: bgImage
      ? `url(${bgImage}), ${PAPER_TEXTURE}`
      : bgColor?.includes("gradient")
      ? `${bgColor}, ${PAPER_TEXTURE}`
      : `${bgColor || "#FAF8F4"}, ${PAPER_TEXTURE}`,
    backgroundBlendMode: bgImage ? "overlay, multiply" : "normal, multiply",
    backgroundSize: bgImage ? "cover, auto" : "cover, auto",
    backgroundPosition: "center",
    boxShadow: `
      0 ${20 * scale}px ${60 * scale}px rgba(0, 0, 0, 0.08),
      0 ${5 * scale}px ${20 * scale}px rgba(0, 0, 0, 0.04),
      0 ${1 * scale}px ${5 * scale}px rgba(0, 0, 0, 0.02),
      inset 0 0 0 1px rgba(255, 255, 255, 0.6),
      inset 0 0 ${60 * scale}px rgba(0, 0, 0, 0.02),
      inset 0 0 ${20 * scale}px rgba(0, 0, 0, 0.01),
      0 0 0 1px #E8E4DC,
      0 0 0 2px rgba(255, 255, 255, 0.8),
      0 ${4 * scale}px ${12 * scale}px rgba(0, 0, 0, 0.05)
    `,
    border: "none",
    transition: "all 0.3s ease",
    backdropFilter: "blur(0.3px)",
  };

  return (
    <div style={paperStyle}>
      {items.map((item: any, index: number) => (
        <div
          key={item.id || index}
          style={{
            position: "absolute",
            left: `${(item.x || 0) * scale}px`,
            top: `${(item.y || 0) * scale}px`,
            transform: `
              rotate(${item.rotation || 0}deg)
              scaleX(${item.flipX ? -1 : 1})
              scaleY(${item.flipY ? -1 : 1})
            `,
            filter: item.filters ? `
              brightness(${item.filters.brightness || 100}%)
              contrast(${item.filters.contrast || 100}%)
              saturate(${item.filters.saturation || 100}%)
              blur(${(item.filters.blur || 0) * scale}px)
              grayscale(${item.filters.grayscale || 0}%)
            ` : "none",
            opacity: (item.opacity || 100) / 100,
          }}
        >
          {item.type === "text" ? (
            <div
              style={{
                color: item.color || "#000000",
                fontSize: `${(item.fontSize || 16) * scale}px`,
                fontFamily: item.fontFamily || "Arial",
                fontWeight: item.fontWeight || "normal",
                textAlign: item.textAlign || "left",
                textShadow: item.textShadow || "none",
                backgroundColor: "transparent",
                border: "none",
                boxShadow: "none",
                padding: "0",
                margin: "0",
                lineHeight: 1.4,
                wordBreak: "break-word",
                whiteSpace: "pre-wrap",
              }}
            >
              {item.text || "Texte"}
            </div>
          ) : item.type === "image" || item.type === "gif" ? (
            <img
              src={item.src}
              alt=""
              style={{
                width: `${(item.width || 150) * scale}px`,
                height: `${(item.height || 150) * scale}px`,
                borderRadius: `${(item.borderRadius || 0) * scale}px`,
                objectFit: "cover",
                boxShadow: `0 ${4 * scale}px ${12 * scale}px rgba(0,0,0,0.15)`,
                border: `${2 * scale}px solid rgba(255,255,255,0.6)`,
              }}
            />
          ) : item.type === "video" ? (
            <video
              src={item.src}
              autoPlay={item.autoPlay}
              loop={item.loop}
              muted={item.muted}
              style={{
                width: `${(item.width || 200) * scale}px`,
                height: `${(item.height || 150) * scale}px`,
                borderRadius: `${(item.borderRadius || 12) * scale}px`,
                objectFit: "cover",
                boxShadow: `0 ${4 * scale}px ${12 * scale}px rgba(0,0,0,0.15)`,
                border: `${2 * scale}px solid rgba(255,255,255,0.6)`,
              }}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}

// Modèle 1: Simple and Basic - Version épurée avec uniquement votre carte
export function PreviewModel1({ items, bgColor, bgImage, onClose, guest, envelopeColor = "green", onEnvelopeColorChange }: ModelPreviewProps) {
  const flapRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [localEnvColor, setLocalEnvColor] = useState(envelopeColor);

  // Obtenir les couleurs selon la sélection
  const colors = ENVELOPE_COLORS.find(c => c.id === localEnvColor) || ENVELOPE_COLORS[0];

  useEffect(() => {
    // Réinitialiser quand les couleurs changent ou au montage
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    if (flapRef.current && letterRef.current && shadowRef.current) {
      // Réinitialiser les positions
      gsap.set(flapRef.current, {
        rotationX: 0,
        transformOrigin: "top",
        zIndex: 30
      });
      
      gsap.set(letterRef.current, { 
        y: 0,
        z: 0,
        zIndex: 15
      });
      
      gsap.set(shadowRef.current, {
        width: 200,
        boxShadow: "50px 100px 10px 5px rgba(238, 238, 243, 0.7)",
      });

      // Créer une timeline unifiée
      const tl = gsap.timeline({ paused: true });
      
      // 1. Le flap se soulève
      tl.to(flapRef.current, {
        duration: 0.5,
        rotationX: 180,
        transformOrigin: "top",
        ease: "power2.out"
      })
      // 2. Réduire le z-index du flap
      .to(flapRef.current, {
        zIndex: 10,
        duration: 0.01
      }, "-=0.1")
      // 3. La carte monte
      .to(letterRef.current, {
        y: -200,
        duration: 0.9,
        ease: "back.inOut(1.5)",
        zIndex: 40
      }, "-=0.1")
      // 4. La carte redescend un peu
      .to(letterRef.current, {
        duration: 0.7,
        ease: "back.out(.4)",
        y: -5,
        z: 250
      })
      // 5. L'ombre s'agrandit
      .to(shadowRef.current, {
        width: 450,
        boxShadow: "-75px 150px 10px 5px rgba(238, 238, 243, 0.7)",
        ease: "back.out(.2)",
        duration: 0.7
      }, "-=0.5");

      timelineRef.current = tl;
    }

    return () => {
      timelineRef.current?.kill();
    };
  }, [localEnvColor]);

  const openCard = () => {
    if (!isOpen && timelineRef.current) {
      timelineRef.current.play();
      setIsOpen(true);
    }
  };

  const closeCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOpen && timelineRef.current) {
      timelineRef.current.reverse();
      setIsOpen(false);
    }
  };

  const handleColorChange = (colorId: string) => {
    setLocalEnvColor(colorId);
    onEnvelopeColorChange?.(colorId);
  };

  return (
    <div
      style={{
        minHeight: "400px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        padding: "20px",
      }}
    >
      {/* Sélecteur de couleur */}
      <EnvelopeColorPicker selectedColor={localEnvColor} onColorChange={handleColorChange} />
      
      <div
        style={{ 
          position: "relative",
          perspective: "600px",
          width: "300px",
          height: "180px",
          marginTop: "20px",
        }}
      >
        {/* Enveloppe - Conteneur principal */}
        <div
          onClick={openCard}
          style={{
            position: "relative",
            width: "300px", 
            height: "180px", 
            cursor: "pointer",
          }}
        >
          {/* Base de l'enveloppe - SIMPLIFIÉE */}
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backgroundColor: colors.primary,
              zIndex: 20,
            }}
          />

          {/* Flap (rabat) */}
          <div
            ref={flapRef}
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              width: "0",
              height: "0",
              borderTop: `115px solid ${colors.secondary}`,
              borderLeft: "150px solid transparent",
              borderRight: "150px solid transparent",
              boxSizing: "border-box",
              zIndex: 30,
              transformOrigin: "top",
              transformStyle: "preserve-3d",
            }}
          />
        </div>

        {/* VOTRE CARTE dans l'enveloppe */}
        <div
          ref={letterRef}
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            width: "280px",
            height: "160px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 15,
            background: "transparent",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Conteneur pour votre carte avec bouton de fermeture */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
            }}
          >
            {/* Bouton fermer */}
            <button
              onClick={closeCard}
              style={{
                position: "absolute",
                right: "-10px",
                top: "-10px",
                fontSize: "18px",
                cursor: "pointer",
                userSelect: "none",
                color: colors.accent,
                zIndex: 50,
                background: "rgba(255, 255, 255, 0.95)",
                borderRadius: "50%",
                width: "30px",
                height: "30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: "1",
                border: `2px solid ${colors.accent}`,
                padding: "0",
                margin: "0",
                fontWeight: "bold",
              }}
            >
              ×
            </button>

            {/* VOTRE CARTE (CardPreview) */}
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CardPreview 
                items={items}
                bgColor={bgColor}
                bgImage={bgImage}
                scale={0.35}
                width={600}
                height={400}
              />
            </div>
          </div>
        </div>

        {/* Ombre */}
        <div
          ref={shadowRef}
          style={{
            position: "absolute",
            width: "200px",
            height: "10px",
            background: "transparent",
            borderRadius: "50%",
            boxShadow: "50px 100px 10px 5px rgba(238, 238, 243, 0.7)",
            bottom: "-30px",
            left: "50px",
            zIndex: 5,
          }}
        />
      </div>

      {/* Indicateur d'état */}
      <div style={{ 
        marginTop: "30px", 
        color: colors.secondary, 
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        textAlign: "center",
        padding: "10px 15px",
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "8px",
        border: `1px solid ${colors.accent}20`,
      }}>
        {isOpen ? "✓ Carte ouverte - Cliquez sur ✕ pour fermer" : "Cliquez sur l'enveloppe pour ouvrir"}
      </div>
    </div>
  );
}

// Modèle 2: Birthday Card - Version épurée
export function PreviewModel2({ items, bgColor, bgImage, onClose, guest, envelopeColor = "red", onEnvelopeColorChange }: ModelPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localEnvColor, setLocalEnvColor] = useState(envelopeColor);
  
  // Obtenir les couleurs selon la sélection
  const colors = ENVELOPE_COLORS.find(c => c.id === localEnvColor) || ENVELOPE_COLORS[1]; // Rouge par défaut

  const toggleEnvelope = () => {
    setIsOpen(!isOpen);
  };

  const handleColorChange = (colorId: string) => {
    setLocalEnvColor(colorId);
    onEnvelopeColorChange?.(colorId);
  };

  return (
    <div
      style={{
        minHeight: "400px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        padding: "20px",
        background: bgColor || "#feca57",
      }}
    >
      {/* Sélecteur de couleur */}
      <EnvelopeColorPicker selectedColor={localEnvColor} onColorChange={handleColorChange} />
      
      <div
        onClick={toggleEnvelope}
        style={{
          width: "300px",
          height: "150px",
          backgroundColor: colors.primary,
          position: "relative",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        {/* Partie supérieure de l'enveloppe (le flap) */}
        <div
          className={`envelope-top ${isOpen ? "envelope-top-close" : ""}`}
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "0",
            borderBottom: `100px solid ${colors.primary}`,
            borderLeft: "110px solid transparent",
            borderRight: "110px solid transparent",
            transform: "translateY(-100%)",
            transformOrigin: "bottom",
            transition: "all 0.3s ease",
            zIndex: 3,
          }}
        />

        {/* Corps de l'enveloppe */}
        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          {/* Face avant */}
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "75px",
              backgroundColor: colors.secondary,
              bottom: "0",
              zIndex: 2,
            }}
          />

          {/* Côté gauche */}
          <div
            style={{
              position: "absolute",
              width: "0",
              height: "0",
              borderTop: "75px solid transparent",
              borderLeft: `110px solid ${colors.accent}`,
              borderBottom: "75px solid transparent",
              left: "0",
              bottom: "0",
              zIndex: 3,
            }}
          />

          {/* Côté droit */}
          <div
            style={{
              position: "absolute",
              width: "0",
              height: "0",
              borderTop: "75px solid transparent",
              borderRight: `110px solid ${colors.accent}`,
              borderBottom: "75px solid transparent",
              right: "0",
              bottom: "0",
              zIndex: 3,
            }}
          />
        </div>

        {/* VOTRE CARTE qui sort de l'enveloppe */}
        <div
          className={`paper ${isOpen ? "paper-close" : ""}`}
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            width: "260px",
            height: "100px",
            marginTop: isOpen ? "0" : "-60px",
            zIndex: isOpen ? 2 : 3,
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
          }}
        >
          {/* Conteneur pour votre carte avec bouton de fermeture */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
            }}
          >
            {/* Bouton fermer (visible seulement quand ouvert) */}
            {isOpen && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                style={{
                  position: "absolute",
                  right: "-10px",
                  top: "-10px",
                  fontSize: "16px",
                  cursor: "pointer",
                  color: colors.accent,
                  zIndex: 50,
                  background: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "50%",
                  width: "25px",
                  height: "25px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: "1",
                  border: `2px solid ${colors.accent}`,
                  padding: "0",
                  margin: "0",
                  fontWeight: "bold",
                }}
              >
                ×
              </button>
            )}

            {/* VOTRE CARTE (CardPreview) */}
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CardPreview 
                items={items}
                bgColor={bgColor}
                bgImage={bgImage}
                scale={0.35}
                width={600}
                height={400}
              />
            </div>
          </div>
        </div>

        {/* Styles inline pour les animations */}
        <style>{`
          .envelope-top-close {
            transform: translateY(-100%) rotateX(180deg) !important;
            border-bottom: 100px solid ${colors.secondary} !important;
            z-index: 4 !important;
          }
          .paper-close {
            margin-top: 0 !important;
            z-index: 2 !important;
          }
        `}</style>
      </div>

      {/* Indicateur d'état */}
      <div style={{ 
        marginTop: "30px", 
        color: colors.accent, 
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        textAlign: "center",
        padding: "10px 15px",
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "8px",
        border: `1px solid ${colors.accent}20`,
      }}>
        {isOpen ? "✓ Carte ouverte - Cliquez sur ✕ ou l'enveloppe pour fermer" : "Cliquez sur l'enveloppe pour ouvrir"}
      </div>
    </div>
  );
}

// Modèle 3: Simple and Basic Card - Version corrigée avec couverture complète
export function PreviewModel3({ items, bgColor, bgImage, onClose, guest, envelopeColor = "gold", onEnvelopeColorChange }: ModelPreviewProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [localEnvColor, setLocalEnvColor] = useState(envelopeColor);
  
  // Obtenir les couleurs selon la sélection
  const colors = ENVELOPE_COLORS.find(c => c.id === localEnvColor) || ENVELOPE_COLORS[3]; // Or par défaut

  const handleColorChange = (colorId: string) => {
    setLocalEnvColor(colorId);
    onEnvelopeColorChange?.(colorId);
  };

  return (
    <div
      style={{
        minHeight: "400px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        padding: "20px",
        background: bgColor || "transparent",
      }}
    >
      {/* Sélecteur de couleur */}
      <EnvelopeColorPicker selectedColor={localEnvColor} onColorChange={handleColorChange} />
      
      <div
        className="envelope-model3"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: "relative",
          cursor: "pointer",
          width: "250px",
          height: "200px",
          marginTop: "20px",
        }}
      >
        {/* Dos de l'enveloppe (base) */}
        <div
          style={{
            position: "relative",
            width: "250px",
            height: "200px",
            backgroundColor: colors.primary,
            zIndex: 1,
          }}
        />

        {/* VOTRE CARTE dans l'enveloppe */}
        <div
          className={`letter ${isHovered ? "letter-hover" : ""}`}
          style={{
            position: "absolute",
            backgroundColor: "transparent",
            width: "230px",
            height: "180px",
            top: "10px",
            left: "10px",
            transition: "transform 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2,
          }}
        >
          {/* Conteneur pour votre carte */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
            }}
          >
            {/* Bouton fermer (toujours visible sur ce modèle) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsHovered(false);
              }}
              style={{
                position: "absolute",
                right: "-10px",
                top: "-10px",
                fontSize: "16px",
                cursor: "pointer",
                color: colors.accent,
                zIndex: 50,
                background: "rgba(255, 255, 255, 0.95)",
                borderRadius: "50%",
                width: "25px",
                height: "25px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: "1",
                border: `2px solid ${colors.accent}`,
                padding: "0",
                margin: "0",
                fontWeight: "bold",
                opacity: isHovered ? 1 : 0,
                transition: "opacity 0.2s ease",
              }}
            >
              ×
            </button>

            {/* VOTRE CARTE (CardPreview) */}
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CardPreview 
                items={items}
                bgColor={bgColor}
                bgImage={bgImage}
                scale={0.35}
                width={600}
                height={400}
              />
            </div>
          </div>
        </div>

        {/* COUVERTURE DU BAS - Partie avant de l'enveloppe */}
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            zIndex: 3,
            overflow: "hidden",
          }}
        >
          {/* Côté droit de la couverture */}
          <div
            style={{
              position: "absolute",
              borderRight: `130px solid ${colors.secondary}`,
              borderTop: "100px solid transparent",
              borderBottom: "100px solid transparent",
              height: "0",
              width: "0",
              top: "0",
              left: "120px",
            }}
          />

          {/* Côté gauche de la couverture */}
          <div
            style={{
              position: "absolute",
              borderLeft: `130px solid ${colors.secondary}`,
              borderTop: "100px solid transparent",
              borderBottom: "100px solid transparent",
              height: "0",
              width: "0",
              top: "0",
              left: "0",
            }}
          />

          {/* Partie inférieure de la couverture */}
          <div
            style={{
              position: "absolute",
              top: "100px", // Ajusté pour correspondre à la hauteur des triangles
              left: "0",
              width: "100%",
              height: "100px",
              backgroundColor: colors.secondary,
            }}
          />
        </div>

        {/* Flap supérieur (rabat) - AU-DESSUS de la couverture */}
        <div
          className={`top ${isHovered ? "top-hover" : ""}`}
          style={{
            position: "absolute",
            borderTop: `105px solid ${colors.accent}`,
            borderLeft: "125px solid transparent",
            borderRight: "125px solid transparent",
            height: "0",
            width: "0",
            top: "0",
            left: "0",
            transformOrigin: "top",
            transition: "transform 0.4s ease",
            zIndex: 4, // Au-dessus de tout
          }}
        />

        {/* Ombre sous l'enveloppe */}
        <div
          style={{
            position: "absolute",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            width: "250px",
            height: "10px",
            top: "210px",
            borderRadius: "50%",
            zIndex: 0,
          }}
        />

        {/* Styles inline pour les animations */}
        <style>{`
          .letter-hover {
            transform: translateY(-100px) !important;
            z-index: 5 !important; /* Au-dessus du flap quand sorti */
          }
          .top-hover {
            transform: rotateX(160deg) !important;
            z-index: 3 !important; /* Passe derrière la carte quand ouvert */
          }
        `}</style>
      </div>

      {/* Indicateur d'état */}
      <div style={{ 
        marginTop: "40px", 
        color: colors.accent, 
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        textAlign: "center",
        padding: "10px 15px",
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "8px",
        border: `1px solid ${colors.accent}20`,
      }}>
        {isHovered ? "✓ Carte sortie - Passez la souris ailleurs ou cliquez ✕" : "Passez la souris sur l'enveloppe"}
      </div>
    </div>
  );
}

// Modèle 4: Love Card - Version corrigée
export function PreviewModel4({ items, bgColor, bgImage, onClose, guest, envelopeColor = "blue", onEnvelopeColorChange }: ModelPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localEnvColor, setLocalEnvColor] = useState(envelopeColor);
  const letterRef = useRef<HTMLDivElement>(null);
  
  // Obtenir les couleurs selon la sélection
  const colors = ENVELOPE_COLORS.find(c => c.id === localEnvColor) || ENVELOPE_COLORS[2]; // Bleu par défaut

  useEffect(() => {
    // Ajouter les keyframes CSS pour les cœurs
    const style = document.createElement("style");
    style.textContent = `
      @keyframes slideUp { 
        0% { top: 0; }
        100% { top: -600px; }
      }
      @keyframes sideSway {
        0% { margin-left: 0px; }
        100% { margin-left: 50px; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleColorChange = (colorId: string) => {
    setLocalEnvColor(colorId);
    onEnvelopeColorChange?.(colorId);
  };

  return (
    <div
      style={{
        minHeight: "500px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        padding: "20px",
        background: bgColor || "#e8f4f8",
      }}
    >
      {/* Sélecteur de couleur */}
      <EnvelopeColorPicker selectedColor={localEnvColor} onColorChange={handleColorChange} />
      
      <div className="envlope-wrapper" style={{ 
        height: "380px", 
        marginTop: "20px",
        position: "relative",
        width: "280px",
      }}>
        <div
          id="envelope-model4"
          className={isOpen ? "open" : "close"}
          onClick={() => setIsOpen(!isOpen)}
          style={{
            position: "relative",
            width: "280px",
            height: "180px",
            borderBottomLeftRadius: "6px",
            borderBottomRightRadius: "6px",
            top: "150px",
            backgroundColor: colors.primary,
            boxShadow: "0 4px 20px rgba(0,0,0,.2)",
            cursor: "pointer",
          }}
        >
          {/* Flap (rabat) */}
          <div
            className="flap-model4"
            style={{
              position: "absolute",
              width: "0",
              height: "0",
              zIndex: isOpen ? 1 : 5,
              borderLeft: "140px solid transparent",
              borderRight: "140px solid transparent",
              borderBottom: "82px solid transparent",
              borderTop: "98px solid " + colors.primary,
              transformOrigin: "top",
              top: "0",
              left: "0",
            }}
          />

          {/* Poche de l'enveloppe (corps) */}
          <div
            className="pocket-model4"
            style={{
              position: "absolute",
              width: "0",
              height: "0",
              borderLeft: "140px solid " + colors.secondary,
              borderRight: "140px solid " + colors.secondary,
              borderBottom: "90px solid " + colors.accent,
              borderTop: "90px solid transparent",
              borderBottomLeftRadius: "6px",
              borderBottomRightRadius: "6px",
              bottom: "0",
              left: "0",
              zIndex: 3,
            }}
          />

          {/* VOTRE CARTE dans l'enveloppe - CACHÉE quand fermé */}
          <div
            ref={letterRef}
            className={`letter-model4 ${isOpen ? "letter-open" : ""}`}
            style={{
              position: "absolute",
              backgroundColor: "transparent",
              width: "252px", // 90% de 280px
              height: "162px", // 90% de 180px
              top: "9px", // 5% de 180px
              left: "14px", // 5% de 280px
              borderRadius: "6px",
              zIndex: isOpen ? 4 : 2,
              overflow: "hidden",
              visibility: isOpen ? "visible" : "hidden",
              opacity: isOpen ? 1 : 0,
            }}
          >
            {/* Conteneur pour votre carte avec bouton de fermeture */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
              }}
            >
              {/* Bouton fermer (visible seulement quand ouvert) */}
              {isOpen && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                  style={{
                    position: "absolute",
                    right: "5px",
                    top: "5px",
                    fontSize: "16px",
                    cursor: "pointer",
                    color: colors.accent,
                    zIndex: 50,
                    background: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "50%",
                    width: "25px",
                    height: "25px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: "1",
                    border: `2px solid ${colors.accent}`,
                    padding: "0",
                    margin: "0",
                    fontWeight: "bold",
                  }}
                >
                  ×
                </button>
              )}

              {/* VOTRE CARTE (CardPreview) - TAILLE CORRIGÉE */}
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "10px",
                }}
              >
                <CardPreview 
                  items={items}
                  bgColor={bgColor}
                  bgImage={bgImage}
                  scale={0.42} // AUGMENTÉ pour remplir l'espace
                  width={600}
                  height={400}
                />
              </div>
            </div>
          </div>

          {/* Cœurs qui montent (optionnel) */}
          {isOpen && (
            <div
              className="hearts-model4"
              style={{
                position: "absolute",
                top: "90px",
                left: "0",
                right: "0",
                zIndex: 2,
              }}
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`heart-model4 a${i}`}
                  style={{
                    position: "absolute",
                    bottom: "0",
                    right: "10%",
                    pointerEvents: "none",
                    opacity: 1,
                    animation: `slideUp ${4 + i}s linear 1, sideSway ${
                      2 + i
                    }s ease-in-out ${2 + i * 2} alternate`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Indicateur d'état */}
      <div style={{ 
        marginTop: "180px", 
        color: colors.accent, 
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        textAlign: "center",
        padding: "10px 15px",
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "8px",
        border: `1px solid ${colors.accent}20`,
      }}>
        {isOpen ? "✓ Carte ouverte - Cliquez sur ✕ ou l'enveloppe pour fermer" : "Cliquez sur l'enveloppe pour ouvrir"}
      </div>

      {/* Styles inline pour les animations */}
      <style>{`
        .flap-model4 {
          transition: transform .4s ease, z-index .6s;
        }
        .open .flap-model4 {
          transform: rotateX(180deg);
          transition: transform .4s ease, z-index .6s;
          z-index: 1;
        }
        .close .flap-model4 {
          transform: rotateX(0deg);
          transition: transform .4s .6s ease, z-index 1s;
          z-index: 5;
        }
        .close .letter-model4 {
          transform: translateY(0px); 
          transition: transform .4s ease, opacity .4s ease, visibility .4s ease;
          z-index: 2;
          opacity: 0;
          visibility: hidden;
        }
        .open .letter-model4 {
          transform: translateY(-60px);
          transition: transform .4s .6s ease, opacity .4s .6s ease, visibility .4s .6s ease;
          z-index: 4;
          opacity: 1;
          visibility: visible;
        }
        .heart-model4:before, .heart-model4:after {
          position: absolute;
          content: "";
          left: 25px;
          top: 0;
          width: 25px;
          height: 40px;
          background: #D00000;
          border-radius: 25px 25px 0 0;
          transform: rotate(-45deg);
          transform-origin: 0 100%;
        }
        .heart-model4:after {
          left: 0;
          transform: rotate(45deg);
          transform-origin: 100% 100%;
        }
        .a1 { left: 20%; transform: scale(0.6); }
        .a2 { left: 55%; transform: scale(1); }
        .a3 { left: 10%; transform: scale(0.8); }
      `}</style>
    </div>
  );
}

// Modèle 5: Valentine Card - Version épurée
export function PreviewModel5({ items, bgColor, bgImage, onClose, guest, envelopeColor = "pink", onEnvelopeColorChange }: ModelPreviewProps) {
  const [isActive, setIsActive] = useState(false);
  const [localEnvColor, setLocalEnvColor] = useState(envelopeColor);
  
  // Obtenir les couleurs selon la sélection
  const colors = ENVELOPE_COLORS.find(c => c.id === localEnvColor) || ENVELOPE_COLORS[4]; // Rose par défaut

  const handleColorChange = (colorId: string) => {
    setLocalEnvColor(colorId);
    onEnvelopeColorChange?.(colorId);
  };

  return (
    <div
      style={{
        minHeight: "500px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        padding: "20px",
        background: "linear-gradient(135deg, #ff6b6b, #f06292)",
      }}
    >
      {/* Sélecteur de couleur */}
      <EnvelopeColorPicker selectedColor={localEnvColor} onColorChange={handleColorChange} />
      
      <div
        className={`envelope-model5 ${isActive ? "active" : ""}`}
        style={{
          position: "relative",
          width: "300px",
          height: "200px",
          margin: "20px auto 0",
          cursor: "pointer",
          perspective: "1000px",
        }}
        onClick={() => setIsActive(!isActive)}
      >
        {/* Dos de l'enveloppe */}
        <div
          className="envelope-back-model5"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            background: colors.primary,
            borderRadius: "5px",
            zIndex: 1,
          }}
        />

        {/* Intérieur de l'enveloppe (triangle supérieur) */}
        <div
          className="envelope-inner-model5"
          style={{
            position: "absolute",
            width: "100%",
            height: "50%",
            top: "0",
            background: "#fff",
            clipPath: "polygon(0 0, 50% 100%, 100% 0)",
            zIndex: 2,
          }}
        />

        {/* Face avant de l'enveloppe */}
        <div
          className="envelope-front-model5"
          style={{
            position: "absolute",
            width: "100%",
            height: "50%",
            bottom: "0",
            background: colors.secondary,
            borderRadius: "0 0 5px 5px",
            zIndex: 4,
          }}
        />

        {/* Flap (rabat) de l'enveloppe */}
        <div
          className="envelope-flap-model5"
          style={{
            position: "absolute",
            width: "100%",
            height: "50%",
            top: "0",
            background: colors.accent,
            clipPath: "polygon(0 0, 50% 100%, 100% 0)",
            transformOrigin: "top",
            transition: "transform 0.5s ease",
            zIndex: 5,
          }}
        />

        {/* VOTRE CARTE - CACHÉE quand fermé */}
        <div
          className={`letter-model5 ${isActive ? "letter-active" : ""}`}
          style={{
            position: "absolute",
            width: "90%",
            height: "80%",
            background: "transparent",
            top: "10%",
            left: "5%",
            padding: "15px",
            boxSizing: "border-box",
            transition: "all 0.5s ease",
            transform: "translateY(0)",
            borderRadius: "5px",
            zIndex: 3,
            visibility: isActive ? "visible" : "hidden",
            opacity: isActive ? 1 : 0,
            overflow: "hidden",
          }}
        >
          {/* Conteneur pour votre carte avec bouton de fermeture */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
            }}
          >
            {/* Bouton fermer (visible seulement quand ouvert) */}
            {isActive && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsActive(false);
                }}
                style={{
                  position: "absolute",
                  right: "5px",
                  top: "5px",
                  fontSize: "16px",
                  cursor: "pointer",
                  color: colors.accent,
                  zIndex: 50,
                  background: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "50%",
                  width: "25px",
                  height: "25px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: "1",
                  border: `2px solid ${colors.accent}`,
                  padding: "0",
                  margin: "0",
                  fontWeight: "bold",
                }}
              >
                ×
              </button>
            )}

            {/* VOTRE CARTE (CardPreview) - TAILLE OPTIMISÉE */}
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CardPreview 
                items={items}
                bgColor={bgColor}
                bgImage={bgImage}
                scale={0.37} // Optimisé pour cet espace
                width={600}
                height={400}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Indicateur d'état */}
      <div style={{ 
        marginTop: "30px", 
        color: "#fff", 
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        textAlign: "center",
        padding: "10px 15px",
        background: "rgba(255, 255, 255, 0.2)",
        borderRadius: "8px",
        border: `1px solid rgba(255, 255, 255, 0.3)`,
      }}>
        {isActive ? "✓ Carte ouverte - Cliquez sur ✕ ou l'enveloppe pour fermer" : "Cliquez sur l'enveloppe pour ouvrir"}
      </div>

      {/* Styles inline pour les animations */}
      <style>{`
        .envelope-model5.active .envelope-flap-model5 {
          transform: rotateX(180deg);
        }
        .envelope-model5.active .letter-model5 {
          transform: translateY(-80px);
          z-index: 6;
        }
      `}</style>
    </div>
  );
}

// Modèle 6: Simple Card - Version corrigée avec meilleure visibilité
export function PreviewModel6({ items, bgColor, bgImage, onClose, guest, envelopeColor = "green", onEnvelopeColorChange }: ModelPreviewProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [localEnvColor, setLocalEnvColor] = useState(envelopeColor);
  
  // Obtenir les couleurs selon la sélection
  const colors = ENVELOPE_COLORS.find(c => c.id === localEnvColor) || ENVELOPE_COLORS[0]; // Vert par défaut

  const handleColorChange = (colorId: string) => {
    setLocalEnvColor(colorId);
    onEnvelopeColorChange?.(colorId);
  };

  return (
    <div
      style={{
        minHeight: "400px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        padding: "20px",
        background: bgColor || "#f2f2f2",
      }}
    >
      {/* Sélecteur de couleur */}
      <EnvelopeColorPicker selectedColor={localEnvColor} onColorChange={handleColorChange} />
      
      <div
        className="envelope-model6"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          position: "relative",
          width: "240px",
          height: "200px", // Augmenté pour donner plus d'espace
          margin: "100px auto 0",
        }}
      >
        {/* Base de l'enveloppe (partie inférieure) */}
        <div
          className="icon-envelope-model6"
          style={{
            position: "relative",
            width: "240px",
            height: "45px",
            backgroundColor: colors.primary,
            boxShadow: `0px 5px 0px ${colors.secondary}`,
            zIndex: 1,
            top: "155px", // Descendu pour laisser la place à la carte
          }}
        >
          {/* Triangles latéraux (côté gauche) */}
          <div
            style={{
              position: "absolute",
              top: "-75px",
              left: "0",
              width: "0",
              height: "0",
              borderStyle: "solid",
              borderWidth: "75px 0 0 120px",
              borderColor: "transparent transparent transparent " + colors.primary,
              zIndex: 1,
            }}
          />
          
          {/* Triangles latéraux (côté droit) */}
          <div
            style={{
              position: "absolute",
              top: "-75px",
              right: "0",
              width: "0",
              height: "0",
              borderStyle: "solid",
              borderWidth: "0 0 75px 120px",
              borderColor: "transparent transparent " + colors.primary + " transparent",
              zIndex: 1,
            }}
          />
        </div>

        {/* Flap (rabat supérieur) */}
        <div
          className={`header-model6 ${isHovered ? "header-hover" : ""}`}
          style={{
            position: "absolute",
            top: "80px", // Ajusté pour correspondre à la nouvelle position
            width: "0",
            height: "0",
            borderStyle: "solid",
            borderWidth: "0 120px 83px 120px",
            borderColor: `transparent transparent ${colors.secondary} transparent`,
            transform: "rotate(180deg)",
            transition: "all 1s ease",
            zIndex: 2,
          }}
        >
          {/* Intérieur du flap */}
          <div
            style={{
              position: "absolute",
              top: "9px",
              left: "-120px",
              width: "0",
              height: "0",
              borderStyle: "solid",
              borderWidth: "0 120px 75px 120px",
              borderColor: `transparent transparent ${colors.primary} transparent`,
            }}
          />
        </div>

        {/* VOTRE CARTE - PLUS GRANDE ET MIEUX VISIBLE */}
        <div
          className={`letter-content-model6 ${isHovered ? "letter-hover" : ""}`}
          style={{
            position: "absolute",
            width: "200px", // ÉLARGI de 150px à 200px
            height: isHovered ? "220px" : "0px", // AUGMENTÉ de 180px à 220px
            background: "transparent",
            left: "20px", // Recentré (45px → 20px)
            bottom: isHovered ? "-180px" : "0", // DESCEND bien plus bas
            opacity: isHovered ? 1 : 0,
            transition: "all 1s ease",
            padding: "15px",
            overflow: "visible", // Changé de hidden à visible
            zIndex: isHovered ? 10 : 0, // PLUS HAUT z-index quand visible
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: isHovered ? "translateY(-20px)" : "translateY(0)",
          }}
        >
          {/* Conteneur pour votre carte avec bouton de fermeture */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
            }}
          >
            {/* Bouton fermer (visible seulement quand ouvert) */}
            {isHovered && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsHovered(false);
                }}
                style={{
                  position: "absolute",
                  right: "-10px",
                  top: "-10px",
                  fontSize: "18px",
                  cursor: "pointer",
                  color: colors.accent,
                  zIndex: 50,
                  background: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: "1",
                  border: `2px solid ${colors.accent}`,
                  padding: "0",
                  margin: "0",
                  fontWeight: "bold",
                }}
              >
                ×
              </button>
            )}

            {/* VOTRE CARTE (CardPreview) - PLUS GRANDE */}
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CardPreview 
                items={items}
                bgColor={bgColor}
                bgImage={bgImage}
                scale={0.35} // AUGMENTÉ de 0.28 à 0.35
                width={600}
                height={400}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Indicateur d'état */}
      <div style={{ 
        marginTop: "120px", // Ajusté pour la nouvelle hauteur
        color: colors.secondary, 
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        textAlign: "center",
        padding: "10px 15px",
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "8px",
        border: `1px solid ${colors.accent}20`,
      }}>
        {isHovered ? "✓ Carte sortie - Passez la souris ailleurs ou cliquez ✕" : "Passez la souris sur l'enveloppe"}
      </div>

      {/* Styles inline pour les animations */}
      <style>{`
        .header-hover {
          top: 0px !important; // Ajusté pour la nouvelle animation
          transform: rotateY(180deg) !important;
          border-width: 0 120px 75px 120px !important;
        }
        .header-hover div {
          top: 0px !important;
          box-shadow: 0px 5px 0px ${colors.secondary} !important;
        }
        .letter-hover {
          transform: translateY(-20px) !important; // Légère remontée pour effet
        }
      `}</style>
    </div>
  );
}
// Modèle 7: Extravagant Card - Version fidèle au original
export function PreviewModel7({ items, bgColor, bgImage, onClose, guest, envelopeColor = "gold", onEnvelopeColorChange }: ModelPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCutting, setIsCutting] = useState(false);
  const [localEnvColor, setLocalEnvColor] = useState(envelopeColor);
  
  // Obtenir les couleurs selon la sélection
  const colors = ENVELOPE_COLORS.find(c => c.id === localEnvColor) || ENVELOPE_COLORS[3]; // Or par défaut

  const handleColorChange = (colorId: string) => {
    setLocalEnvColor(colorId);
    onEnvelopeColorChange?.(colorId);
  };

  const handleStickerClick = () => {
    if (!isCutting) {
      setIsCutting(true);
      // Simuler la coupure du sticker
      setTimeout(() => {
        setIsOpen(true);
      }, 500);
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
    setIsCutting(false);
  };

  return (
    <div
      style={{
        minHeight: "500px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        padding: "20px",
        background: bgColor || "#000", // Adaptable comme les autres
      }}
    >
      {/* Sélecteur de couleur */}
      <EnvelopeColorPicker selectedColor={localEnvColor} onColorChange={handleColorChange} />
      
      <div
        className="envelop-model7"
        style={{
          width: "240px", // 15rem
          height: "160px", // 10rem
          position: "relative",
          margin: "40px auto 0",
        }}
      >
        {/* Face avant de l'enveloppe */}
        <div
          className="envelop-front-paper"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            borderRadius: "10px", // 0.7rem
            border: `5px solid ${colors.secondary}`, // 0.35rem
            backgroundColor: colors.primary,
            clipPath: "polygon(100% 0%, 50% 70%, 0% 0%, 0% 100%, 100% 100%)",
            zIndex: 300,
          }}
        />

        {/* Flap supérieur */}
        <div
          className="envelop-up-paper"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            borderRadius: "10px",
            backgroundColor: colors.secondary,
            zIndex: isOpen ? 200 : 400,
            clipPath: "polygon(0% 0%, 100% 0%, 50% 81%)",
            transform: isOpen ? "rotateX(180deg)" : "rotateX(0deg)",
            transformOrigin: "bottom",
            transition: "all 0.25s ease",
            cursor: isOpen ? "default" : "pointer",
          }}
          onClick={isOpen ? undefined : () => setIsOpen(true)}
        />

        {/* Sticker (timbre) à couper */}
        <div
          className="envelop-sticker"
          style={{
            position: "absolute",
            width: "100%",
            height: "32px", // 20% de 160px
            top: "48px", // 30% de 160px
            left: "0",
            zIndex: 400,
            backgroundColor: "#f9f9f9",
            border: "4px solid #e2e2e2",
            backgroundImage: "url('https://www.freepnglogos.com/uploads/heart-png/emoji-heart-33.png')",
            backgroundSize: "24px",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            cursor: isCutting ? "default" : `url('https://i.postimg.cc/GtLCdKxR/sisors.png'), pointer`,
            transition: "all 0.5s ease",
            transform: isCutting ? "translateX(-80%)" : "translateX(0)",
          }}
          onClick={handleStickerClick}
        />

        {/* Faux sticker (pour l'effet) */}
        <div
          className="envelop-false-sticker"
          style={{
            position: "absolute",
            width: "20%",
            height: "32px",
            top: "48px",
            left: "80%",
            zIndex: 300,
            backgroundColor: "#f9f9f9",
            border: "4px solid #e2e2e2",
            backgroundImage: "url('https://www.freepnglogos.com/uploads/heart-png/emoji-heart-33.png')",
            backgroundSize: "24px",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: isCutting ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
        />

        {/* VOTRE CARTE - Contenu de l'enveloppe */}
        <div
          className="envelop-content"
          style={{
            position: "absolute",
            width: "100%",
            height: isOpen ? "176px" : "0", // 110% de 160px
            backgroundColor: "transparent",
            zIndex: 200,
            bottom: "0",
            left: "0",
            transition: "height 0.5s ease",
            overflow: "hidden",
            padding: isOpen ? "10px" : "0",
            boxSizing: "border-box",
          }}
        >
          {/* Conteneur pour votre carte avec bouton de fermeture */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              opacity: isOpen ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          >
            {/* Bouton fermer (visible seulement quand ouvert) */}
            {isOpen && (
              <button
                onClick={handleClose}
                style={{
                  position: "absolute",
                  right: "5px",
                  top: "5px",
                  fontSize: "16px",
                  cursor: "pointer",
                  color: colors.accent,
                  zIndex: 50,
                  background: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "50%",
                  width: "25px",
                  height: "25px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: "1",
                  border: `2px solid ${colors.accent}`,
                  padding: "0",
                  margin: "0",
                  fontWeight: "bold",
                }}
              >
                ×
              </button>
            )}

            {/* VOTRE CARTE (CardPreview) - TAILLE CORRIGÉE */}
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "5px",
              }}
            >
              <CardPreview 
                items={items}
                bgColor={bgColor}
                bgImage={bgImage}
                scale={0.28} // Adapté pour cette enveloppe
                width={600}
                height={400}
              />
            </div>
          </div>
        </div>

        {/* Dos de l'enveloppe */}
        <div
          className="envelop-back-paper"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            borderRadius: "10px",
            backgroundColor: colors.secondary,
            clipPath: "polygon(0% 0%, 100% 0%, 90% 100%, 0% 90%)",
            zIndex: 100,
          }}
        />
      </div>

      {/* Indicateur d'état avec instructions */}
      <div style={{ 
        marginTop: "40px", 
        color: colors.primary, 
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        textAlign: "center",
        padding: "10px 15px",
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "8px",
        border: `1px solid ${colors.accent}40`,
        maxWidth: "300px",
      }}>
        {!isCutting && !isOpen ? (
          <>
            <div style={{ marginBottom: "5px", fontWeight: "bold" }}>✂️ Cliquez sur le TIMBRE pour couper</div>
            <div style={{ fontSize: "12px", opacity: 0.8 }}>Utilisez les ciseaux pour ouvrir l'enveloppe</div>
          </>
        ) : isOpen ? (
          "✓ Enveloppe ouverte - Cliquez sur ✕ pour fermer"
        ) : (
          "✂️ Coupe en cours..."
        )}
      </div>

      {/* Styles inline pour le curseur des ciseaux */}
      <style>{`
        body {
          cursor: default;
        }
        .envelop-sticker:active {
          cursor: url('https://i.postimg.cc/GtXQ7WPZ/pngwing-com.png'), pointer !important;
        }
      `}</style>
    </div>
  );
}

// Modèle 8: Basic Card - Version avec position ajustée
export function PreviewModel8({ items, bgColor, bgImage, onClose, guest, envelopeColor = "pink", onEnvelopeColorChange }: ModelPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localEnvColor, setLocalEnvColor] = useState(envelopeColor);
  const flapRef = useRef<HTMLDivElement>(null);
  const letterRef = useRef<HTMLDivElement>(null);
  
  // Obtenir les couleurs selon la sélection
  const colors = ENVELOPE_COLORS.find(c => c.id === localEnvColor) || ENVELOPE_COLORS[4]; // Rose par défaut

  useEffect(() => {
    if (isOpen && flapRef.current && letterRef.current) {
      // Animation d'ouverture
      gsap.to(flapRef.current, {
        duration: 1.6,
        rotationX: -180,
        transformOrigin: "top center",
        ease: "power2.inOut"
      });
      
      gsap.to(letterRef.current, {
        duration: 0.32,
        y: -180, // RÉDUIT de -260 à -180 (sort moins haut)
        opacity: 1,
        ease: "power2.out",
        delay: 0.8
      });
    } else if (!isOpen && flapRef.current && letterRef.current) {
      // Animation de fermeture
      gsap.to(letterRef.current, {
        duration: 0.3,
        y: 0,
        opacity: 0,
        ease: "power2.in"
      });
      
      gsap.to(flapRef.current, {
        duration: 1,
        rotationX: 0,
        transformOrigin: "top center",
        ease: "power2.inOut",
        delay: 0.1
      });
    }
  }, [isOpen]);

  const handleColorChange = (colorId: string) => {
    setLocalEnvColor(colorId);
    onEnvelopeColorChange?.(colorId);
  };

  const handleOpen = () => {
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
  };

  return (
    <div
      style={{
        minHeight: "500px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        padding: "20px",
        background: bgColor || "#ffd6ea",
      }}
    >
      {/* Sélecteur de couleur */}
      <EnvelopeColorPicker selectedColor={localEnvColor} onColorChange={handleColorChange} />
      
      <div
        className="envelope-wrapper-model8"
        style={{
          width: "340px",
          height: "300px", // AUGMENTÉ de 220px à 300px pour plus d'espace
          position: "relative",
          display: "flex",
          alignItems: "flex-start", // Changé de center à flex-start
          justifyContent: "center",
          flexDirection: "column",
          gap: "18px",
          marginTop: "20px",
          paddingTop: "60px", // AJOUTÉ pour descendre l'enveloppe
        }}
      >
        {/* Enveloppe principale - DESCENDUE */}
        <div
          className={`envelope-model8 ${isOpen ? "open" : ""}`}
          onClick={handleOpen}
          style={{
            width: "320px",
            height: "180px",
            background: `linear-gradient(180deg, ${colors.primary}, ${colors.secondary})`,
            border: `2px solid ${colors.accent}`,
            borderRadius: "8px",
            position: "relative",
            boxShadow: "0 12px 30px rgba(20,10,40,0.12)",
            cursor: "pointer",
            perspective: "900px",
            margin: "0 auto", // Centrée horizontalement
          }}
        >
          {/* Flap (rabat) */}
          <div
            ref={flapRef}
            className="flap-model8"
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              width: "100%",
              height: "55%",
              background: `linear-gradient(180deg, ${colors.secondary}99, ${colors.accent}99)`,
              transformOrigin: "top center",
              transform: "rotateX(0deg)",
              borderBottom: `2px solid ${colors.accent}`,
              zIndex: 25,
              backfaceVisibility: "hidden",
            }}
          />

          {/* Bande décorative */}
          <div
            className="stripe-model8"
            style={{
              position: "absolute",
              bottom: "18px",
              left: "10%",
              width: "80%",
              height: "10px",
              background: "rgba(255, 255, 255, 0.35)",
              borderRadius: "6px",
              zIndex: 20,
            }}
          />
        </div>

        {/* VOTRE CARTE - Position ajustée */}
        <div
          ref={letterRef}
          className={`letter-model8 ${isOpen ? "popped" : ""}`}
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            top: "120px", // AUGMENTÉ de 36% (environ 110px) à 120px
            width: "280px",
            maxWidth: "280px",
            background: "transparent",
            padding: "15px",
            boxShadow: "0 18px 40px rgba(10,5,30,0.12)",
            borderRadius: "10px",
            zIndex: 35,
            opacity: 0,
            pointerEvents: "auto",
            whiteSpace: "pre-wrap",
          }}
        >
          {/* Conteneur pour votre carte avec bouton de fermeture */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
            }}
          >
            {/* Bouton fermer (visible seulement quand ouvert) */}
            {isOpen && (
              <button
                onClick={handleClose}
                style={{
                  position: "absolute",
                  right: "-10px",
                  top: "-10px",
                  fontSize: "18px",
                  cursor: "pointer",
                  color: colors.accent,
                  zIndex: 50,
                  background: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: "1",
                  border: `2px solid ${colors.accent}`,
                  padding: "0",
                  margin: "0",
                  fontWeight: "bold",
                }}
              >
                ×
              </button>
            )}

            {/* VOTRE CARTE (CardPreview) */}
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px",
              }}
            >
              <CardPreview 
                items={items}
                bgColor={bgColor}
                bgImage={bgImage}
                scale={0.4}
                width={600}
                height={400}
              />
            </div>
          </div>
        </div>

        {/* Indication (seulement quand fermé) */}
        {!isOpen && (
          <div
            className="hint-model8"
            style={{
              fontWeight: "700",
              color: colors.accent,
              userSelect: "none",
              fontSize: "16px",
              transition: "opacity .35s ease",
              marginTop: "20px",
              alignSelf: "center", // Centré
            }}
          >
            Cliquez sur l'enveloppe pour ouvrir
          </div>
        )}
      </div>

      {/* Indicateur d'état - DESCENDU aussi */}
      <div style={{ 
        marginTop: "60px", // RÉDUIT de 100px à 60px
        color: colors.accent, 
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        textAlign: "center",
        padding: "10px 15px",
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "8px",
        border: `1px solid ${colors.accent}20`,
      }}>
        {isOpen ? "✓ Carte ouverte - Cliquez sur ✕ pour fermer" : "Cliquez sur l'enveloppe pour ouvrir"}
      </div>
    </div>
  );
}

// Modèle 9: Fly Card - Version corrigée avec bonnes dimensions
export function PreviewModel9({ items, bgColor, bgImage, onClose, guest, envelopeColor = "purple", onEnvelopeColorChange }: ModelPreviewProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [localEnvColor, setLocalEnvColor] = useState(envelopeColor);
  
  // Obtenir les couleurs selon la sélection
  const colors = ENVELOPE_COLORS.find(c => c.id === localEnvColor) || ENVELOPE_COLORS[5]; // Violet par défaut

  const handleColorChange = (colorId: string) => {
    setLocalEnvColor(colorId);
    onEnvelopeColorChange?.(colorId);
  };

  return (
    <div
      style={{
        minHeight: "400px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        padding: "20px",
        background: bgColor || "transparent", // ADAPTÉ comme les autres
      }}
    >
      {/* Sélecteur de couleur */}
      <EnvelopeColorPicker selectedColor={localEnvColor} onColorChange={handleColorChange} />
      
      <div
        className="envelope_form_wrap-model9"
        style={{ 
          maxWidth: "300px", // RÉDUIT de 500px à 300px
          width: "300px",
          marginTop: "20px",
        }}
      >
        <div
          id="envelope_form-model9"
          className={isHovered ? "hovered" : ""}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{ width: "100%" }}
        >
          <div
            className="env_wrap-model9"
            style={{
              position: "relative",
              overflow: "hidden",
              paddingTop: "90%", // RÉDUIT de 110% à 90%
              background: `linear-gradient(0deg, ${colors.primary} 0%, ${colors.primary} 55%, rgba(255,255,255,0) 55%, rgba(255,255,255,0) 100%)`,
              width: "100%",
              cursor: "pointer",
            }}
          >
            {/* Contenu de la carte qui apparaît */}
            <div
              className="env_form_wrap-model9"
              style={{
                width: "calc(100% - 1rem)", // RÉDUIT les marges
                left: "0.5rem",
                padding: "0.75rem",
                background: "transparent", // TRANSPARENT comme les autres
                position: "absolute",
                height: "100%",
                zIndex: 2,
                transition: "all .4s ease-in-out",
                top: isHovered ? "0" : "100%",
                opacity: isHovered ? 1 : 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* VOTRE CARTE - TAILLE CORRIGÉE */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "70%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {/* Bouton fermer (visible seulement au hover) */}
                {isHovered && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsHovered(false);
                    }}
                    style={{
                      position: "absolute",
                      right: "0",
                      top: "0",
                      fontSize: "16px",
                      cursor: "pointer",
                      color: colors.accent,
                      zIndex: 50,
                      background: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "50%",
                      width: "25px",
                      height: "25px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      lineHeight: "1",
                      border: `2px solid ${colors.accent}`,
                      padding: "0",
                      margin: "0",
                      fontWeight: "bold",
                    }}
                  >
                    ×
                  </button>
                )}

                {/* VOTRE CARTE (CardPreview) - ÉCHELLE CORRIGÉE */}
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "10px",
                  }}
                >
                  <CardPreview 
                    items={items}
                    bgColor={bgColor}
                    bgImage={bgImage}
                    scale={0.3} // CORRIGÉ : 0.3 comme les autres modèles
                    width={600}
                    height={400}
                  />
                </div>
              </div>
            </div>

            {/* Flap supérieur de l'enveloppe */}
            <div
              className="env_top-model9"
              style={{
                position: "absolute",
                width: "100%",
                height: "45%", // AJUSTÉ
                top: "35%", // AJUSTÉ
                zIndex: isHovered ? 1 : 99,
                transition: "all .2s ease-in-out",
                transformOrigin: "top",
                transform: isHovered ? "rotateX(-180deg)" : "rotateX(0deg)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  transformOrigin: "top",
                  width: "100%",
                  height: "100%",
                  background: colors.secondary, // Couleur dynamique
                  clipPath: "polygon(50% 100%, 0 0, 100% 0)",
                  transition: "all .2s ease-in-out",
                }}
              />
            </div>

            {/* Partie inférieure de l'enveloppe */}
            <div
              className="env_bottom_wrap-model9"
              style={{
                height: "65%", // AJUSTÉ
                width: "100%",
                zIndex: 2,
                bottom: "0",
                position: "absolute",
              }}
            >
              <div
                className="env_bottom-model9"
                style={{
                  clipPath: "polygon(50% 50%, 100% 0, 100% 100%, 0 100%, 0 0)",
                  background: colors.primary, // Couleur dynamique
                  width: "100%",
                  height: "100%",
                }}
              >
                {/* Côtés de l'enveloppe */}
                <div style={{
                  position: "absolute",
                  background: colors.accent, // Couleur dynamique
                  width: "50%",
                  height: "100%",
                  clipPath: "polygon(100% 50%, 0 0, 0 100%)",
                }} />
                <div style={{
                  position: "absolute",
                  right: "0",
                  background: colors.accent, // Couleur dynamique
                  width: "50%",
                  height: "100%",
                  clipPath: "polygon(0 50%, 100% 0, 100% 100%)",
                }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Indicateur d'état - STYLE UNIFIÉ */}
      <div style={{ 
        marginTop: "30px", 
        color: colors.accent, 
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        textAlign: "center",
        padding: "10px 15px",
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "8px",
        border: `1px solid ${colors.accent}20`,
        maxWidth: "300px",
      }}>
        {isHovered ? "✓ Carte visible - Passez la souris ailleurs ou cliquez ✕" : "Passez la souris sur l'enveloppe"}
      </div>
    </div>
  );
}

// Modèle 10: Amour Card - Version corrigée
export function PreviewModel10({ items, bgColor, bgImage, onClose, guest, envelopeColor = "red", onEnvelopeColorChange }: ModelPreviewProps) {
  const [isActive, setIsActive] = useState(false);
  const [localEnvColor, setLocalEnvColor] = useState(envelopeColor);
  
  // Obtenir les couleurs selon la sélection
  const colors = ENVELOPE_COLORS.find(c => c.id === localEnvColor) || ENVELOPE_COLORS[1]; // Rouge par défaut

  const handleColorChange = (colorId: string) => {
    setLocalEnvColor(colorId);
    onEnvelopeColorChange?.(colorId);
  };

  return (
    <div
      style={{
        minHeight: "400px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        padding: "20px",
        background: bgColor || "darkred",
      }}
    >
      {/* Sélecteur de couleur */}
      <EnvelopeColorPicker selectedColor={localEnvColor} onColorChange={handleColorChange} />
      
      <div
        className="cssletter-model10"
        style={{
          position: "relative",
          width: "300px",
          height: "200px",
          marginTop: "20px",
        }}
      >
        <div
          className={`envelope-model10 ${isActive ? "active" : ""}`}
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            background: colors.primary,
            boxShadow: `inset 0 0 30px -5px ${colors.secondary}`,
          }}
        >
          {/* Bouton cœur pour ouvrir */}
          <button
            className="heart-model10"
            onClick={() => setIsActive(true)}
            style={{
              position: "absolute",
              boxShadow: "none",
              border: "none",
              width: "70px",
              height: "70px",
              background: `
                radial-gradient(circle at 60% 65%, ${colors.accent} 64%, transparent 65%) top left/50% 50%,
                radial-gradient(circle at 40% 65%, ${colors.accent} 64%, transparent 65%) top right/50% 50%,
                conic-gradient(from -45deg at 50% 85.5%, ${colors.accent} 90deg, transparent 0) bottom/100% 50%
              `,
              backgroundRepeat: "no-repeat",
              left: "50%",
              top: "70%",
              transform: "translate(-50%, -50%)",
              cursor: "pointer",
              zIndex: 4,
            }}
          >
            <span
              style={{
                transform: "translateY(-10px)",
                display: "block",
                color: "white",
                fontSize: "1rem",
                fontFamily: "cursive",
              }}
            >
              Ouvrir
            </span>
          </button>

          {/* Flap de l'enveloppe - CORRIGÉ */}
          <div
            className="envelope-flap-model10"
            style={{
              position: "absolute",
              top: "0",
              left: "0",
              width: "100%",
              height: "100%",
              zIndex: 3,
              transformOrigin: "top",
              transformStyle: "preserve-3d",
              transition: "transform 0.6s ease",
            }}
          >
            {/* Triangle du flap */}
            <div
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "0",
                height: "0",
                borderLeft: "150px solid transparent",
                borderRight: "150px solid transparent",
                borderBottom: "140px solid transparent",
                borderTop: "60px solid " + colors.secondary,
                transform: isActive ? "rotateX(180deg)" : "rotateX(0deg)",
                transformOrigin: "top",
              }}
            />
          </div>

          {/* VOTRE CARTE */}
          <div
            className={`letter-content-model10 ${isActive ? "active" : ""}`}
            style={{
              position: "absolute",
              width: "90%",
              height: "70%",
              background: "transparent",
              top: "15%",
              left: "5%",
              padding: "15px",
              boxSizing: "border-box",
              zIndex: isActive ? 2 : 0,
              opacity: isActive ? 1 : 0,
              transition: "all 0.5s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Conteneur pour votre carte avec bouton de fermeture */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
              }}
            >
              {/* Bouton fermer (visible seulement quand ouvert) */}
              {isActive && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsActive(false);
                  }}
                  style={{
                    position: "absolute",
                    right: "5px",
                    top: "5px",
                    fontSize: "16px",
                    cursor: "pointer",
                    color: colors.accent,
                    zIndex: 50,
                    background: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "50%",
                    width: "25px",
                    height: "25px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: "1",
                    border: `2px solid ${colors.accent}`,
                    padding: "0",
                    margin: "0",
                    fontWeight: "bold",
                  }}
                >
                  ×
                </button>
              )}

              {/* VOTRE CARTE (CardPreview) */}
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CardPreview 
                  items={items}
                  bgColor={bgColor}
                  bgImage={bgImage}
                  scale={0.3}
                  width={600}
                  height={400}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Indicateur d'état */}
      <div style={{ 
        marginTop: "30px", 
        color: "white", 
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        textAlign: "center",
        padding: "10px 15px",
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "8px",
        border: `1px solid rgba(255, 255, 255, 0.3)`,
      }}>
        {isActive ? "✓ Carte ouverte - Cliquez sur ✕ pour fermer" : "Cliquez sur le cœur pour ouvrir"}
      </div>
    </div>
  );
}

// Modèle 11: Heart Card - Version avec carte qui sort sur le côté
export function PreviewModel11({ items, bgColor, bgImage, onClose, guest, envelopeColor = "pink", onEnvelopeColorChange }: ModelPreviewProps) {
  const [isChecked, setIsChecked] = useState(false);
  const [localEnvColor, setLocalEnvColor] = useState(envelopeColor);
  
  // Obtenir les couleurs selon la sélection
  const colors = ENVELOPE_COLORS.find(c => c.id === localEnvColor) || ENVELOPE_COLORS[4]; // Rose par défaut

  const handleColorChange = (colorId: string) => {
    setLocalEnvColor(colorId);
    onEnvelopeColorChange?.(colorId);
  };

  return (
    <div
      style={{
        minHeight: "400px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        padding: "20px",
        background: bgColor || "#121212",
      }}
    >
      {/* Sélecteur de couleur */}
      <EnvelopeColorPicker selectedColor={localEnvColor} onColorChange={handleColorChange} />
      
      <div
        style={{
          width: "300px",
          height: "225px",
          margin: "20px auto 0",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Checkbox cachée pour l'état */}
        <input
          type="checkbox"
          id="check-model11"
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
          style={{ display: "none" }}
        />
        
        <label
          htmlFor="check-model11"
          style={{ 
            position: "absolute",
            cursor: "pointer",
            width: "100%",
            height: "100%",
          }}
        >
          {/* Enveloppe principale */}
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backgroundColor: colors.primary,
              border: `3px solid ${colors.secondary}`,
              borderRadius: "0 0 5px 5px",
              boxShadow: `0 8px 20px ${colors.accent}`,
              zIndex: 1,
            }}
          />

          {/* VOTRE CARTE - SORT SUR LE CÔTÉ DROIT */}
          <div
            style={{
              position: "absolute",
              width: "350px", // PLUS LARGE que l'enveloppe
              height: "250px", // PLUS HAUTE
              background: "transparent",
              left: isChecked ? "320px" : "150px", // SORT sur le côté droit
              top: isChecked ? "-20px" : "50%", // REMONTE un peu
              transform: isChecked ? "translateY(0)" : "translateY(-50%)",
              transition: "all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
              transitionDelay: isChecked ? "0.4s" : "0s",
              zIndex: 10, // AU-DESSUS de tout
              opacity: isChecked ? 1 : 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              boxSizing: "border-box",
              pointerEvents: isChecked ? "auto" : "none",
            }}
          >
            {/* Conteneur pour votre carte avec bouton de fermeture */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                background: "transparent",
                borderRadius: "10px",
                boxShadow: "0 15px 40px rgba(0,0,0,0.3)",
              }}
            >
              {/* Bouton fermer (visible seulement quand ouvert) */}
              {isChecked && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsChecked(false);
                  }}
                  style={{
                    position: "absolute",
                    right: "-10px",
                    top: "-10px",
                    fontSize: "18px",
                    cursor: "pointer",
                    color: colors.accent,
                    zIndex: 50,
                    background: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "50%",
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: "1",
                    border: `2px solid ${colors.accent}`,
                    padding: "0",
                    margin: "0",
                    fontWeight: "bold",
                  }}
                >
                  ×
                </button>
              )}

              {/* VOTRE CARTE (CardPreview) - PLUS GRANDE */}
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CardPreview 
                  items={items}
                  bgColor={bgColor}
                  bgImage={bgImage}
                  scale={0.45} // PLUS GRANDE pour lisibilité
                  width={600}
                  height={400}
                />
              </div>
            </div>
          </div>

          {/* Face avant de l'enveloppe */}
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backgroundColor: colors.secondary,
              clipPath: "polygon(50% 45%, 100% 0, 100% 100%, 0 100%, 0 0)",
              zIndex: 3,
            }}
          />

          {/* Flap arrière */}
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backgroundColor: colors.accent,
              clipPath: "polygon(0% 0%, 100% 0%, 100% 1%, 50% 56%, 0 1%)",
              transformOrigin: "top",
              transform: isChecked ? "rotateX(-180deg)" : "rotateX(0deg)",
              transition: "transform 0.4s ease-in-out",
              transitionDelay: isChecked ? "0s" : "0.2s",
              zIndex: 4,
            }}
          />

          {/* Flap avant */}
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backgroundColor: colors.primary,
              clipPath: "polygon(0 0, 100% 0, 50% 55%)",
              transformOrigin: "top",
              transform: isChecked ? "rotateX(-180deg) translateY(-3px)" : "rotateX(0deg)",
              transition: "transform 0.4s ease-in-out",
              transitionDelay: isChecked ? "0s" : "0.2s",
              zIndex: 5,
            }}
          />

          {/* Cœur */}
          <div
            style={{
              position: "absolute",
              zIndex: 6,
              cursor: "pointer",
              height: "80px",
              width: "94px",
              left: "50%",
              top: "50%",
              transform: isChecked
                ? "translate(-50%, -50%) translateX(-30px) rotate(-70deg)"
                : "translate(-50%, -50%)",
              transformOrigin: "center 70%",
              transition: "transform 0.4s ease-in-out",
              transitionDelay: isChecked ? "0s" : "0.3s",
            }}
          >
            {/* Forme du cœur */}
            <div
              style={{
                position: "absolute",
                width: "47px",
                height: "75px",
                backgroundColor: colors.accent,
                left: "47px",
                transformOrigin: "0 100%",
                transform: "rotate(-45deg)",
                borderRadius: "25px 25px 0 0",
              }}
            />
            <div
              style={{
                position: "absolute",
                width: "47px",
                height: "75px",
                backgroundColor: colors.accent,
                right: "47px",
                transformOrigin: "100% 100%",
                transform: "rotate(45deg)",
                borderRadius: "25px 25px 0 0",
              }}
            />
          </div>
        </label>
      </div>

      {/* Indicateur d'état */}
      <div style={{ 
        marginTop: "100px", 
        color: colors.accent, 
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        textAlign: "center",
        padding: "10px 15px",
        background: "rgba(255, 255, 255, 0.05)",
        borderRadius: "8px",
        border: `1px solid ${colors.accent}20`,
        maxWidth: "400px",
      }}>
        {isChecked ? "✓ Carte ouverte à droite - Cliquez sur ✕ pour fermer" : "Cliquez sur la lettre pour ouvrir"}
      </div>
    </div>
  );
}


// Modèle 12: Friend Card - Version corrigée
export function PreviewModel12({ items, bgColor, bgImage, onClose, guest, envelopeColor = "purple", onEnvelopeColorChange }: ModelPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localEnvColor, setLocalEnvColor] = useState(envelopeColor);
  
  // Obtenir les couleurs selon la sélection
  const colors = ENVELOPE_COLORS.find(c => c.id === localEnvColor) || ENVELOPE_COLORS[5]; // Violet par défaut

  const handleColorChange = (colorId: string) => {
    setLocalEnvColor(colorId);
    onEnvelopeColorChange?.(colorId);
  };

  const openLetter = () => {
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const closeLetter = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(false);
  };

  return (
    <div
      style={{
        minHeight: "400px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        padding: "20px",
        background: bgColor || "#F9F5F6",
      }}
    >
      {/* Sélecteur de couleur */}
      <EnvelopeColorPicker selectedColor={localEnvColor} onColorChange={handleColorChange} />
      
      <div
        className="letter-model12"
        style={{
          marginBottom: "0",
          maxWidth: "500px",
          width: "100%",
          marginTop: "20px",
        }}
      >
        <div
          className="envelope-model12"
          onClick={openLetter}
          style={{
            position: "relative",
            display: "flex",
            cursor: "pointer",
            justifyContent: "center",
            width: "100%",
            maxWidth: "400px",
            aspectRatio: "5/3",
            backgroundColor: colors.primary,
            margin: "0 auto",
          }}
        >
          {/* En-tête de l'enveloppe (expéditeur/destinataire) */}
          <ul
            className="envelopeHeader-model12"
            style={{
              bottom: "0",
              left: "0",
              padding: "5%",
              listStyle: "none",
              position: "absolute",
              color: colors.accent,
              zIndex: 5,
              margin: "0",
            }}
          >
            <li
              style={{
                display: "flex",
                fontSize: "14px",
                gap: ".4rem",
              }}
            >
              <p>from:</p>
              <p style={{ color: colors.secondary }}>{guest?.name || "Expéditeur"}</p>
            </li>
          </ul>

          {/* Flap supérieur (couverture) */}
          <svg
            className={`cover-model12 ${isOpen ? "open" : ""}`}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              fill: isOpen ? colors.primary : colors.secondary,
              zIndex: 5,
              transformOrigin: "top",
              transition: "fill 0.5s ease",
            }}
            viewBox="0 0 500 300"
          >
            <path d="M 0 0 L 500 0 L 275 150 Q 250 175 225 150 L 0 0 Z" />
          </svg>

          {/* VOTRE CARTE - CACHÉE sous l'enveloppe */}
          <div
            className={`letterSheet-model12 ${isOpen ? "zoomIn" : ""}`}
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              cursor: "pointer",
              transition: "1s ease-in-out",
              width: "90%",
              padding: "5%",
              gap: "5%",
              height: "100%",
              backgroundColor: "transparent",
              overflow: "hidden",
              position: "absolute",
              zIndex: isOpen ? 10 : 1,
              top: "0",
              left: "5%",
              opacity: isOpen ? 1 : 0,
              visibility: isOpen ? "visible" : "hidden",
            }}
          >
            {/* Titre */}
            <h2
              style={{
                width: "90%",
                color: colors.primary,
                fontSize: "18px",
                margin: "0 0 10px 0",
              }}
            >
              Cher Ami
            </h2>

            {/* Conteneur pour votre carte avec bouton de fermeture */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Bouton fermer (visible seulement quand ouvert) */}
              {isOpen && (
                <button
                  onClick={closeLetter}
                  style={{
                    position: "absolute",
                    right: "-10px",
                    top: "-10px",
                    fontSize: "18px",
                    cursor: "pointer",
                    color: colors.accent,
                    zIndex: 50,
                    background: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "50%",
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    lineHeight: "1",
                    border: `2px solid ${colors.accent}`,
                    padding: "0",
                    margin: "0",
                    fontWeight: "bold",
                  }}
                >
                  ×
                </button>
              )}

              {/* VOTRE CARTE (CardPreview) - AGRANDIE */}
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CardPreview 
                  items={items}
                  bgColor={bgColor}
                  bgImage={bgImage}
                  scale={0.4} // AGRANDI de 0.35 à 0.4
                  width={600}
                  height={400}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Indicateur d'état */}
      <div style={{ 
        marginTop: "30px", 
        color: colors.primary, 
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        textAlign: "center",
        padding: "10px 15px",
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "8px",
        border: `1px solid ${colors.accent}20`,
      }}>
        {isOpen ? "✓ Carte ouverte - Cliquez sur ✕ pour fermer" : "Cliquez sur l'enveloppe pour ouvrir"}
      </div>

      {/* Styles inline pour les animations */}
      <style>{`
        .envelope-model12::after {
          content: '';
          position: absolute;
          bottom: 0;
          border-left: 100% solid ${colors.accent};
          border-top: 60% solid transparent;
          pointer-events: none;
          z-index: 4;
        }
        .envelope-model12::before {
          content: '';
          pointer-events: none;
          position: absolute;
          bottom: 0;
          border-right: 100% solid ${colors.accent}99;
          border-top: 60% solid transparent;
          transform: perspective(400px);
          z-index: 3;
        }
        .cover-model12.open {
          animation: open-letter 2s ease-in-out forwards;
        }
        .letterSheet-model12.zoomIn {
          animation: zoom-sheet-up 2s ease forwards;
        }
        @keyframes open-letter {
          0% { transform: rotateX(0deg); opacity: 1; }
          50% { opacity: 0.8; }
          100% { transform: translateY(1px) rotateX(180deg); z-index: 2; opacity: 0.6; }
        }
        @keyframes zoom-sheet-up {
          0% { transform: translate(0%, 0%); opacity: 0; visibility: hidden; }
          30% { transform: translate(0%,-100%); opacity: 1; visibility: visible; }
          100% { transform: translate(0%, -30%); z-index: 10; opacity: 1; visibility: visible; }
        }
      `}</style>
    </div>
  );
}

