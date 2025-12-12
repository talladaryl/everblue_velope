import React from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export const AddCardButton: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div 
      className="group cursor-pointer transition-all duration-300 hover:-translate-y-1"
      onClick={() => navigate("/builder")}
    >
      {/* Bandeau vide pour alignement */}
      <div className="h-[18px] mb-1.5" />

      {/* Card Design Preview */}
      <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden border-2 border-dashed border-neutral-300 group-hover:border-blue-500 transition-all duration-300 bg-neutral-50 group-hover:bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-neutral-200 group-hover:bg-blue-500 transition-colors duration-300 flex items-center justify-center">
            <Plus className="w-8 h-8 text-neutral-500 group-hover:text-white transition-colors duration-300" />
          </div>
          <p className="text-sm font-medium text-neutral-600 group-hover:text-blue-600 transition-colors duration-300">
            {t("homePage.addCard.createTemplate")}
          </p>
        </div>
      </div>

      {/* Infos */}
      <div className="mt-2 flex flex-col gap-0.5">
        <h3 className="font-medium text-xs text-neutral-800 leading-tight">{t("homePage.addCard.newTemplate")}</h3>
        <p className="text-[10px] text-neutral-500">{t("homePage.addCard.custom")}</p>
      </div>
    </div>
  );
};
