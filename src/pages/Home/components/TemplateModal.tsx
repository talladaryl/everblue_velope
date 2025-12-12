import React, { useState } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";
import { CardDesigns } from "./CardDesigns";
import { useNavigate } from "react-router-dom";
import { useTemplates } from "@/hooks/useTemplates";
import { toast } from "@/components/ui/sonner";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { TemplatePreviewModal } from "@/components/TemplatePreviewModal";
import { useLanguage } from "@/contexts/LanguageContext";

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: any;
  allTemplates: any[];
}

export const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  onClose,
  template,
  allTemplates,
}) => {
  const navigate = useNavigate();
  const { deleteTemplate } = useTemplates();
  const { t } = useLanguage();
  const [currentTemplate, setCurrentTemplate] = useState(template);
  const [selectedColors, setSelectedColors] = useState(template?.colors || []);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Mettre à jour le template quand il change
  React.useEffect(() => {
    if (template) {
      setCurrentTemplate(template);
      setSelectedColors(template.colors);
    }
  }, [template]);

  // Gérer la suppression
  const handleDelete = async () => {
    if (!currentTemplate.isCustom) {
      toast.error(t("homePage.templateModal.cannotDeleteDefault"), {
        description: t("homePage.templateModal.cannotDeleteDefaultDesc"),
      });
      setShowDeleteConfirm(false);
      return;
    }

    try {
      // Utiliser apiId en priorité pour les templates API, sinon l'ID
      const templateId = currentTemplate.apiId || currentTemplate.id;
      console.log("🗑️ Tentative de suppression du template:", templateId);

      // Appeler l'API de suppression via le hook
      await deleteTemplate(templateId);

      toast.success(t("homePage.templateModal.deleteSuccess"), {
        description: t("homePage.templateModal.deleteSuccessDesc"),
      });

      // Fermer les modals
      setShowDeleteConfirm(false);
      onClose();

      // Recharger la page pour mettre à jour la liste
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error: any) {
      console.error("❌ Erreur suppression:", error);
      toast.error(t("homePage.templateModal.deleteError"), {
        description:
          error.response?.data?.message ||
          t("homePage.templateModal.deleteErrorDesc"),
      });
      setShowDeleteConfirm(false);
    }
  };

  // Gérer la modification
  const handleEdit = () => {
    if (currentTemplate.isCustom) {
      const templateId = currentTemplate.apiId || currentTemplate.id;
      navigate(`/builder?template=${templateId}`);
    } else {
      navigate("/builder");
    }
    onClose();
  };

  // Gérer le preview - Nouvelle version avec modal d'animation
  const handlePreview = () => {
    console.log("🎬 Ouverture du preview pour:", currentTemplate.title);
    console.log("📦 Données du template:", currentTemplate.data);
    setShowPreview(true);
  };

  // Extraire les données du template pour le preview
  const getTemplateData = () => {
    // Vérifier que currentTemplate existe
    if (!currentTemplate) {
      return {
        items: [],
        bgColor: "#ffffff",
        bgImage: null,
      };
    }

    // Si le template a des données personnalisées (API ou local)
    if (currentTemplate.data) {
      const data =
        typeof currentTemplate.data === "string"
          ? JSON.parse(currentTemplate.data)
          : currentTemplate.data;

      return {
        items: data.items || [],
        bgColor: data.bgColor || "#ffffff",
        bgImage: data.bgImage || null,
      };
    }

    // Sinon, retourner des valeurs par défaut
    return {
      items: [],
      bgColor: "#ffffff",
      bgImage: null,
    };
  };

  const templateData = currentTemplate
    ? getTemplateData()
    : { items: [], bgColor: "#ffffff", bgImage: null };

  const currentIndex = allTemplates.findIndex(
    (t) => t.id === currentTemplate?.id
  );

  const handlePrevious = () => {
    const prevIndex =
      currentIndex > 0 ? currentIndex - 1 : allTemplates.length - 1;
    const prevTemplate = allTemplates[prevIndex];
    setCurrentTemplate(prevTemplate);
    setSelectedColors(prevTemplate.colors);
  };

  const handleNext = () => {
    const nextIndex =
      currentIndex < allTemplates.length - 1 ? currentIndex + 1 : 0;
    const nextTemplate = allTemplates[nextIndex];
    setCurrentTemplate(nextTemplate);
    setSelectedColors(nextTemplate.colors);
  };

  if (!isOpen || !currentTemplate) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm">
      {/* Navigation Arrows */}
      <button
        onClick={handlePrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Modal Content */}
      <div className="h-full flex items-center justify-center p-4">
        <div className="bg-white shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row">
          {/* Left: Card Preview */}
          <div className="w-full md:w-1/2 bg-secondary p-6 flex items-center justify-center">
            <div className="w-full max-w-sm">
              {/* Carte avec effet d'ombre double décalée */}
              <div className="relative aspect-[3/4]">
                {/* Ombre décalée - 2ème niveau */}
                <div
                  className="absolute top-3 left-3 w-full h-full bg-neutral-300/40"
                  style={{ filter: "blur(2px)" }}
                />
                {/* Ombre décalée - 1er niveau */}
                <div
                  className="absolute top-1.5 left-1.5 w-full h-full bg-neutral-400/50"
                  style={{ filter: "blur(1px)" }}
                />
                {/* Carte principale avec texture papier premium */}
                <div className="relative w-full h-full overflow-hidden premium-paper-texture shadow-xl">
                  <CardDesigns
                    type={currentTemplate.type}
                    colors={selectedColors}
                    scale={1}
                    data={currentTemplate.data}
                  />
                </div>
              </div>
              {/* Backside supported badge */}
              <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                </svg>
                <span>{t("homePage.templateModal.backsideSupported")}</span>
              </div>
            </div>
          </div>

          {/* Right: Options */}
          <div className="w-full md:w-1/2 flex flex-col">
            {/* Header */}
            <div className="p-6 border-b flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold text-foreground">
                    {currentTemplate.title}
                  </h2>
                  <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                    <Heart className="w-5 h-5 text-gray-400" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                    <Share2 className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {currentTemplate.designer}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Color Options */}
              <div className="mb-6">
                <div className="flex gap-2 mb-4">
                  {selectedColors.map((color, index) => (
                    <div key={index} className="relative">
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => {
                          const newColors = [...selectedColors];
                          newColors[index] = e.target.value;
                          setSelectedColors(newColors);
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        title={`${t("homePage.templateModal.changeColor")} ${index + 1}`}
                      />
                      <button
                        className="w-10 h-10 rounded-full border-2 border shadow-sm transition-transform hover:scale-110 hover:border-gray-400"
                        style={{ backgroundColor: color }}
                      />
                    </div>
                  ))}
                  <button
                    className="w-10 h-10 rounded-full border-2 border flex items-center justify-center bg-gradient-to-br from-red-500 via-yellow-500 to-blue-500 hover:scale-110 transition-transform"
                    onClick={() => {
                      // Ajouter une nouvelle couleur
                      setSelectedColors([...selectedColors, "#000000"]);
                    }}
                  >
                    <span className="text-white text-xs font-bold">+</span>
                  </button>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="space-y-3">
                {/* Modifier */}
                <button
                  onClick={handleEdit}
                  className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <Pencil className="w-5 h-5" />
                  <span>{t("homePage.templateModal.edit")}</span>
                </button>

                {/* Preview */}
                <button
                  onClick={handlePreview}
                  className="w-full py-3 border-2 border-blue-500 text-blue-600 hover:bg-blue-50 font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Eye className="w-5 h-5" />
                  <span>{t("homePage.templateModal.preview")}</span>
                </button>

                {/* Supprimer (seulement pour les templates custom) */}
                {currentTemplate.isCustom && (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full py-3 border-2 border-red-500 text-red-600 hover:bg-red-50 font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span>{t("homePage.templateModal.delete")}</span>
                  </button>
                )}
              </div>

              {/* Info Text */}
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <Pencil className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>
                  {t("homePage.templateModal.customizationInfo")}
                </p>
              </div>
            </div>

            {/* Footer Description */}
            <div className="p-6 border-t bg-secondary">
              <p className="text-xs text-gray-600 leading-relaxed">
                {t("homePage.templateModal.footerDescription")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogue de confirmation de suppression */}
      <ConfirmDialog
        open={showDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title={t("homePage.templateModal.deleteConfirmTitle")}
        description={t("homePage.templateModal.deleteConfirmDescription")}
        confirmText={t("homePage.templateModal.deleteConfirmButton")}
        cancelText={t("homePage.templateModal.cancelButton")}
        isDestructive={true}
      />

      {/* Modal de prévisualisation avec animation d'enveloppe */}
      <TemplatePreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        items={templateData.items}
        bgColor={templateData.bgColor}
        bgImage={templateData.bgImage}
        templateTitle={currentTemplate.title}
      />
    </div>
  );
};
