// design-steps/SelectDesign.tsx
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Trash2,
  Plus,
  Palette,
  Sparkles,
  Heart,
  Zap,
  Star,
  Layers,
} from "lucide-react";
import { getTemplates } from "@/utils/storage";

// Designs par défaut IDENTIQUES à ceux de la HomePage
import { UNIFIED_TEMPLATES } from "@/data/templates";

const DEFAULT_DESIGNS = UNIFIED_TEMPLATES;

export function SelectDesign({
  ctx,
  onDesignSelected,
}: {
  ctx: any;
  onDesignSelected?: (to?: "select" | "card" | "envelope") => void;
}) {
  const {
    templates: ctxTemplates = [],
    loadTemplate,
    deleteTemplate,
    toast,
    setCurrentTemplate,
  } = ctx;
  const [saved, setSaved] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const fromStorage = (await getTemplates()) || [];
        if (mounted) setSaved(Array.isArray(fromStorage) ? fromStorage : []);
      } catch (err) {
        console.error("load templates error", err);
        if (mounted) setSaved([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Combiner tous les designs (défaut + sauvegardés)
  const all = useMemo(() => {
    const map = new Map<string, any>();

    // Ajouter d'abord les designs par défaut
    DEFAULT_DESIGNS.forEach((t: any) => map.set(t.id, t));

    // Puis les templates du contexte
    (ctxTemplates || []).forEach((t: any) => map.set(t.id, t));

    // Enfin les templates sauvegardés
    (saved || []).forEach((t: any) => {
      if (!map.has(t.id)) map.set(t.id, t);
    });

    return Array.from(map.values());
  }, [ctxTemplates, saved]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let filteredDesigns = all;

    // Filtrer par catégorie
    if (selectedCategory !== "all") {
      filteredDesigns = filteredDesigns.filter(
        (t) => t.category === selectedCategory
      );
    }

    // Filtrer par recherche
    if (q) {
      filteredDesigns = filteredDesigns.filter(
        (t) =>
          (t.name || "").toLowerCase().includes(q) ||
          (t.description || "").toLowerCase().includes(q)
      );
    }

    return filteredDesigns;
  }, [all, query, selectedCategory]);

  const handleUse = (template: any) => {
    try {
      // Cloner le template pour éviter les mutations
      const clone = JSON.parse(JSON.stringify(template));

      // Sauvegarder le template complet dans le contexte
      if (typeof setCurrentTemplate === "function") {
        setCurrentTemplate(clone);
      }

      // Charger les éléments de la carte dans l'éditeur
      if (typeof loadTemplate === "function") {
        loadTemplate(clone);
      }

      // Passer à l'étape de modification de la carte
      if (typeof ctx?.setSubStep === "function") {
        ctx.setSubStep("card");
      } else {
        onDesignSelected?.("card");
      }

      toast?.("Modèle chargé", {
        description: `${template.name} prêt à la modification.`,
      });
    } catch (err) {
      console.error("handleUse error", err);
      toast?.("Erreur", { description: "Impossible de charger le modèle." });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "simple":
        return <Star className="h-4 w-4" />;
      case "birthday":
        return <Zap className="h-4 w-4" />;
      case "love":
        return <Heart className="h-4 w-4" />;
      case "elegant":
        return <Sparkles className="h-4 w-4" />;
      case "modern":
        return <Layers className="h-4 w-4" />;
      default:
        return <Palette className="h-4 w-4" />;
    }
  };

  const categories = [
    { id: "all", name: "Tous les designs", count: all.length },
    {
      id: "simple",
      name: "Simple & Basique",
      count: all.filter((d) => d.category === "simple").length,
    },
    {
      id: "birthday",
      name: "Anniversaire",
      count: all.filter((d) => d.category === "birthday").length,
    },
    {
      id: "love",
      name: "Amour & Romance",
      count: all.filter((d) => d.category === "love").length,
    },
    {
      id: "elegant",
      name: "Élégant",
      count: all.filter((d) => d.category === "elegant").length,
    },
    {
      id: "modern",
      name: "Moderne",
      count: all.filter((d) => d.category === "modern").length,
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between w-full gap-4">
            <div>
              <CardTitle>Choisir un design</CardTitle>
              <CardDescription>
                Sélectionnez un modèle existant pour le modifier. Le modèle sera
                chargé dans l'éditeur de carte.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <input
                aria-label="Rechercher"
                placeholder="Rechercher un design..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="px-3 py-2 rounded-md border bg-card text-sm w-full lg:w-64"
              />
            </div>
          </div>

          {/* Filtres par catégorie */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                {category.id !== "all" && getCategoryIcon(category.id)}
                {category.name}
                <span className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs">
                  {category.count}
                </span>
              </Button>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Chargement des modèles…
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Aucun modèle trouvé.
              </p>
              <Button onClick={() => onDesignSelected?.("card")}>
                <Plus className="h-4 w-4 mr-2" /> Créer un nouveau design
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((template) => (
                <Card
                  key={template.id}
                  className="group cursor-pointer hover:shadow-lg transition-all duration-300"
                >
                  <CardContent className="p-0">
                    {/* Aperçu du design */}
                    <div
                      className="aspect-[4/3] rounded-t-lg overflow-hidden relative bg-cover bg-center"
                      style={{
                        background: template.bgImage
                          ? `url(${template.bgImage}) center/cover`
                          : template.bgColor || "#f3f4f6",
                      }}
                      onClick={() => handleUse(template)}
                    >
                      {/* Aperçu des éléments texte */}
                      {Array.isArray(template.items) &&
                        template.items.map(
                          (item: any, index: number) =>
                            item.type === "text" && (
                              <div
                                key={index}
                                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                                style={{
                                  left: `${item.x}%`,
                                  top: `${item.y}%`,
                                  color: item.color,
                                  fontSize: `${Math.max(
                                    12,
                                    (item.fontSize || 16) / 1.5
                                  )}px`,
                                  fontFamily: item.fontFamily,
                                  fontWeight: item.fontWeight,
                                  textAlign: item.textAlign,
                                  textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                                }}
                              >
                                {item.text}
                              </div>
                            )
                        )}

                      {/* Badge de popularité */}
                      <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs">
                        {template.popularity}%
                      </div>

                      {/* Indicateur d'enveloppe */}
                      {template.hasEnvelope && (
                        <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs">
                          📮 Enveloppe
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm truncate">
                            {template.name}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {template.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          {getCategoryIcon(template.category)}
                          <span className="capitalize">
                            {template.category}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            onClick={() => handleUse(template)}
                            className="h-8 text-xs"
                          >
                            Charger
                          </Button>

                          {template.isCustom && deleteTemplate && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteTemplate?.(template.id);
                                setSaved((s) =>
                                  s.filter((x) => x.id !== template.id)
                                );
                              }}
                              title="Supprimer"
                              className="p-1 rounded hover:bg-muted text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bouton pour créer un nouveau design */}
      <div className="text-center">
        <Button
          onClick={() => onDesignSelected?.("card")}
          variant="outline"
          className="mx-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Créer un nouveau design vide
        </Button>
      </div>
    </div>
  );
}
