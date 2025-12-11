import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Template } from "@/api/services/templateService";
import { Edit, Trash2, Eye, Calendar } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface TemplatesListProps {
  templates: Template[];
  loading: boolean;
  error: string | null;
  onEdit?: (template: Template) => void;
  onDelete?: (id: number) => Promise<void>;
  onPreview?: (template: Template) => void;
}

export const TemplatesList: React.FC<TemplatesListProps> = ({
  templates,
  loading,
  error,
  onEdit,
  onDelete,
  onPreview,
}) => {
  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce template ?")) return;
    try {
      if (onDelete) {
        await onDelete(id);
        toast.success("Template supprimé avec succès");
      }
    } catch (err) {
      toast.error("Erreur lors de la suppression");
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="border-0 shadow-lg">
            <CardContent className="p-0">
              <Skeleton className="h-48 w-full rounded-t-lg" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6 text-center">
          <p className="text-red-600 font-medium mb-2">Erreur de chargement</p>
          <p className="text-sm text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (templates.length === 0) {
    return (
      <Card className="border-dashed border-2">
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground mb-4">Aucun template trouvé</p>
          <p className="text-sm text-muted-foreground">
            Créez votre premier template pour commencer
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Résumé */}
      <div className="text-sm text-gray-600">
        {templates.length} template{templates.length > 1 ? "s" : ""} trouvé
        {templates.length > 1 ? "s" : ""}
      </div>

      {/* Grille des templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card
            key={template.id}
            className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
          >
            <CardContent className="p-0">
              {/* Image de prévisualisation */}
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                {template.preview_image ? (
                  <img
                    src={template.preview_image}
                    alt={template.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-sm">Pas d'aperçu</span>
                  </div>
                )}
                {/* Overlay au survol */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  {onPreview && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onPreview(template)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Aperçu
                    </Button>
                  )}
                </div>
              </div>

              {/* Contenu */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-foreground line-clamp-1">
                    {template.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                    {template.description}
                  </p>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {new Date(template.created_at).toLocaleDateString("fr-FR")}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  {onEdit && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => onEdit(template)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Éditer
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(template.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Supprimer
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
