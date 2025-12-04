import React, { useState } from "react";
import { CategoryFilters } from "./components/CategoryFilters";
import TemplateGrid from "./components/TemplateGrid";
import { HOME_TEMPLATES } from "./data/homeTemplates";
import { TopBar } from "./components/TopBar";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  // Filtrage des templates
  const filteredTemplates = HOME_TEMPLATES.filter((template) => {
    const matchesCategory = activeCategory === "all" || template.category === activeCategory;
    const matchesSearch = template.title.toLowerCase().includes(search.toLowerCase()) ||
                         template.designer.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-4 md:p-6 flex flex-col gap-4">
      <TopBar search={search} setSearch={setSearch} />

      <CategoryFilters
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {/* Affichage du nombre de résultats */}
      {search && (
        <div className="text-sm text-gray-600">
          {filteredTemplates.length} résultat{filteredTemplates.length > 1 ? 's' : ''} trouvé{filteredTemplates.length > 1 ? 's' : ''}
        </div>
      )}

      <TemplateGrid items={filteredTemplates} />

      {/* Message si aucun résultat */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-2">Aucun modèle trouvé</p>
          <p className="text-gray-400 text-sm">
            Essayez de modifier votre recherche ou de changer de catégorie
          </p>
        </div>
      )}
    </div>
  );
}
