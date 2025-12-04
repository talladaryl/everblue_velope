import React from "react";
import { DESIGN_CATEGORIES } from "../data/categories";

interface CategoryFiltersProps {
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

export const CategoryFilters: React.FC<CategoryFiltersProps> = ({ 
  activeCategory, 
  setActiveCategory 
}) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {DESIGN_CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setActiveCategory(cat.id)}
          className={`px-4 py-2 text-sm font-medium transition-all whitespace-nowrap
            ${
              activeCategory === cat.id 
                ? "bg-blue-600 text-white shadow-md" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};
