import React from "react";
import { DESIGN_CATEGORIES } from "../data/categories";
import { useLanguage } from "@/contexts/LanguageContext";

interface CategoryFiltersProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export const CategoryFilters: React.FC<CategoryFiltersProps> = ({ 
  activeCategory, 
  setActiveCategory 
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {DESIGN_CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setActiveCategory(cat.id)}
          className={`px-4 py-2 text-sm font-medium transition-all whitespace-nowrap rounded-lg
            ${
              activeCategory === cat.id 
                ? "bg-blue-600 text-white shadow-md" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
        >
          {t(`homePage.categories.${cat.id}`)}
        </button>
      ))}
    </div>
  );
};
