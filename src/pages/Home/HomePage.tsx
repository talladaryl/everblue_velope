import React, { useState, useEffect } from "react";
import { CategoryFilters } from "./components/CategoryFilters";
import TemplateGrid from "./components/TemplateGrid";
import { HOME_TEMPLATES } from "./data/homeTemplates";
import { TopBar } from "./components/TopBar";
import { useTemplates } from "@/hooks/useTemplates";
import { localTemplateStorage } from "@/utils/localTemplateStorage";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const { templates: apiTemplates, loading, fetchTemplates } = useTemplates();
  const [localTemplates, setLocalTemplates] = useState<any[]>([]);

  // Recharger les templates au montage du composant
  useEffect(() => {
    fetchTemplates();
    // Charger les templates locaux
    const locals = localTemplateStorage.getAll();
    console.log("📦 Templates locaux chargés:", locals.length);
    setLocalTemplates(locals);
  }, []);

  // Combiner les templates par défaut, API et locaux
  const allTemplates = [
    ...HOME_TEMPLATES,
    // Templates de l'API
    ...apiTemplates.map((t) => ({
      id: `api-${t.id}`,
      apiId: t.id,
      type: "custom",
      title: t.title,
      designer: "Mes Templates (Serveur)",
      colors: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"],
      category: "custom",
      isCustom: true,
      data: t.data,
      model_preview_id: t.model_preview_id,
    })),
    // Templates locaux
    ...localTemplates.map((t) => ({
      id: t.id,
      localId: t.id,
      type: "custom",
      title: t.title,
      designer: "Mes Templates (Local)",
      colors: ["#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"],
      category: "custom",
      isCustom: true,
      isLocal: true,
      data: t.data,
      model_preview_id: t.model_preview_id,
    })),
  ];

  // Filtrage des templates
  const filteredTemplates = allTemplates.filter((template) => {
    const matchesCategory = activeCategory === "all" || template.category === activeCategory;
    const matchesSearch =
            (template.title?.toLowerCase() || "").includes(search.toLowerCase()) ||
            (template.designer?.toLowerCase() || "").includes(search.toLowerCase());
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

      {/* Loader pendant le chargement */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Chargement des templates...</span>
        </div>
      )}

      {!loading && <TemplateGrid items={filteredTemplates} />}

      {/* Message si aucun résultat */}
      {!loading && filteredTemplates.length === 0 && (
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
