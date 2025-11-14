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
import { Trash2, Plus } from "lucide-react";
import { getTemplates } from "@/utils/storage";

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
  } = ctx;
  const [saved, setSaved] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

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

  const all = useMemo(() => {
    // merge unique by id (ctxTemplates may already include saved); prefer ctxTemplates first
    const map = new Map<string, any>();
    (ctxTemplates || []).forEach((t: any) => map.set(t.id, t));
    (saved || []).forEach((t: any) => {
      if (!map.has(t.id)) map.set(t.id, t);
    });
    return Array.from(map.values());
  }, [ctxTemplates, saved]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter(
      (t) =>
        (t.name || "").toLowerCase().includes(q) ||
        (t.description || "").toLowerCase().includes(q)
    );
  }, [all, query]);

  const makeDeepClone = (obj: any) => {
    try {
      // prefer structuredClone if available (keeps functions/others safer)
      // @ts-ignore
      if (typeof structuredClone === "function") return structuredClone(obj);
    } catch {}
    // fallback
    return JSON.parse(JSON.stringify(obj));
  };

  const handleUse = (template: any) => {
    try {
      // clone to avoid mutating stored template
      const clone =
        typeof structuredClone === "function"
          ? structuredClone(template)
          : JSON.parse(JSON.stringify(template));
      // mark editable copy (optional)
      clone._editable = true;

      // load cloned template into builder state
      if (typeof loadTemplate === "function") loadTemplate(clone);

      // prefer ctx.setSubStep if available, else fallback to onDesignSelected
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div>
              <CardTitle>Choisir un design</CardTitle>
              <CardDescription>
                Sélectionnez un modèle existant pour le modifier
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <input
                aria-label="Rechercher"
                placeholder="Rechercher..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="px-3 py-2 rounded-md border bg-card text-sm"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Chargement des modèles…
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-muted-foreground">
                Aucun modèle trouvé.
              </p>
              <div className="mt-4">
                <Button onClick={() => onDesignSelected?.("card")}>
                  <Plus className="h-4 w-4 mr-2" /> Créer un design
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((t) => (
                <div
                  key={t.id}
                  className="border rounded-lg p-3 group hover:shadow-md transition-shadow relative"
                >
                  <div
                    className="aspect-[16/9] rounded-md mb-3 overflow-hidden bg-cover bg-center"
                    style={{
                      background: t.bgImage
                        ? `url(${t.bgImage}) center/cover`
                        : t.bgColor,
                    }}
                    onClick={() => handleUse(t)}
                  >
                    {/* small preview text overlay */}
                    {Array.isArray(t.items) &&
                      t.items.slice(0, 2).map(
                        (it: any, i: number) =>
                          it.type === "text" && (
                            <div
                              key={i}
                              className="absolute text-sm"
                              style={{
                                left: (it.x || 10) / 3 + "%",
                                top: (it.y || 10) / 3 + "%",
                                color: it.color,
                                fontSize: Math.max(10, (it.fontSize || 16) / 2),
                                fontWeight: it.fontWeight,
                              }}
                            >
                              {it.text}
                            </div>
                          )
                      )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{t.name}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {t.description}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleUse(t)}
                      >
                        Charger
                      </Button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTemplate?.(t.id);
                          setSaved((s) => s.filter((x) => x.id !== t.id));
                        }}
                        title="Supprimer"
                        className="p-1 rounded hover:bg-muted"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
