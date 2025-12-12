// components/TemplateCard.jsx
import React from "react";
import { CardDesigns } from "./CardDesigns";
import { useLanguage } from "@/contexts/LanguageContext";;

interface TemplateCardProps {
  template: any;
  onClick: () => void;
  isLandscape?: boolean;
}

export default function TemplateCard({ template, onClick, isLandscape = false }: TemplateCardProps) {
  const { title, designer, colors = [], type, data } = template;
  const { t } = useLanguage();

  return (
    <div 
      className="group cursor-pointer transition-all duration-300 hover:-translate-y-1"
      onClick={onClick}
    >
      {/* Bandeau Backside supported */}
      <div className="flex items-center gap-1.5 px-1 py-1 text-[9px] text-neutral-400 mb-1.5">
        <svg 
          className="w-2.5 h-2.5" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>
        <span className="uppercase tracking-wider">{t("homePage.templateModal.backsideSupported")}</span>
      </div>

      {/* Card Design Preview avec effet d'ombre double décalée */}
      <div className={`relative w-full ${isLandscape ? 'aspect-[4/3]' : 'aspect-[3/4]'}`}>
        {/* Ombre décalée - 2ème niveau */}
        <div 
          className="absolute top-2 left-2 w-full h-full bg-neutral-300/40"
          style={{
            filter: 'blur(1px)',
          }}
        />
        {/* Ombre décalée - 1er niveau */}
        <div 
          className="absolute top-1 left-1 w-full h-full bg-neutral-400/50"
          style={{
            filter: 'blur(0.5px)',
          }}
        />
        {/* Carte principale avec texture papier premium */}
        <div className="relative w-full h-full overflow-hidden premium-paper-texture">
          <CardDesigns type={type} colors={colors} scale={1} data={data} />
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white px-3 py-1.5 text-xs font-semibold shadow-lg rounded-full">
              {t("homePage.templateCard.viewDetails")}
            </span>
          </div>
        </div>
        
        {/* Badge "Paysage" pour les cartes en mode paysage */}
        {isLandscape && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-full shadow-lg uppercase tracking-wider">
            Wide
          </div>
        )}
      </div>

      {/* Infos */}
      <div className="mt-2 flex flex-col gap-0.5">
        <h3 className="font-medium text-xs text-neutral-800 leading-tight">{title}</h3>
        <p className="text-[10px] text-neutral-500">{designer}</p>

        {/* Pastilles de couleur */}
        <div className="flex mt-1.5 gap-1">
          {colors.map((c: string, i: number) => (
            <span
              key={i}
              className="w-3 h-3 rounded-full border border-neutral-200 shadow-sm"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
