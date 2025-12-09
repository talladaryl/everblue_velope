// pages/Builder.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Save,
  Download,
  Eye,
  Plus,
  Trash2,
  Palette,
  Home,
  Image as ImageIcon,
  Type,
  Send,
} from "lucide-react";
import Papa from "papaparse";
import { nanoid } from "nanoid";
import { cn } from "@/lib/utils";
import EnvelopePreview from "./EnvelopePreview";
import { Template } from "@/types";
import { saveTemplate, generateThumbnail, getTemplates } from "@/utils/storage";

// Nouvelles importations demandées
import { PAPER_THEMES } from "@/constants/paperThemes";
import { TEXT_VARIABLES } from "@/constants/textVariables";
import ImagePickerModal from "@/components/ImagePickerModal";
import { TextVariablesPanel } from "@/components/TextVariablesPanel";
import { PaperTheme, TextVariable } from "@/types";

import StepDesign from "./builder/StepDesign";
import StepDetails from "./builder/StepDetails";
import StepPreviewImproved from "./builder/StepPreviewImproved";
import StepSendImproved from "./builder/StepSendImproved";

// Importation du modal de sauvegarde
import { SaveTemplateModal } from "@/components/SaveTemplateModal";
import { useSaveTemplate } from "@/hooks/useSaveTemplate";
import { LoadingSpinner } from "@/components/LoadingSpinner";

// Types
interface EditorItemBase {
  id: string;
  x: number;
  y: number;
}
interface TextItem extends EditorItemBase {
  type: "text";
  text: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  letterSpacing: number;
  textAlign: "left" | "center" | "right";
  fontFamily: string;
}
interface ImageItem extends EditorItemBase {
  type: "image";
  src: string;
  width: number;
  height: number;
  isBackground?: boolean;
}

type EditorItem = TextItem | ImageItem;

interface Guest {
  id: string;
  name: string;
  full_name?: string;
  email: string;
  phone?: string;
  valid: boolean;
  message?: string;
  location?: string;
  date?: string;
  time?: string;
  plus_one_allowed?: boolean;
}

interface BuilderTemplate {
  id: string;
  name: string;
  description?: string;
  bgColor: string;
  bgImage?: string | null;
  items: EditorItem[];
  createdAt: Date;
  palette?: string[];
  isCustom?: boolean;
  thumbnail?: string;
}

// Étapes maintenant 0..3 (Design, Détails, Prévisualisation, Envoi)
type Step = 0 | 1 | 2 | 3;

// Helpers
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialText = (): TextItem => ({
  id: nanoid(),
  type: "text",
  x: 40,
  y: 40,
  text: "Votre texte ici",
  fontSize: 24,
  fontWeight: 600,
  color: "#222222",
  letterSpacing: 0,
  textAlign: "left",
  fontFamily: "system-ui, sans-serif",
});

const defaultTemplates: BuilderTemplate[] = [
  {
    id: "default-1",
    name: "Moderne",
    bgColor: "#F3F4F6",
    items: [
      {
        ...initialText(),
        text: "Vous êtes invité!",
        x: 50,
        y: 50,
        fontSize: 32,
        color: "#1e40af",
      },
      {
        ...initialText(),
        text: "Rejoignez-nous pour une occasion spéciale",
        x: 50,
        y: 100,
        fontSize: 18,
        fontWeight: 400,
        color: "#4b5563",
      },
    ],
    createdAt: new Date(),
  },
];

function Builder() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState<Step>(0);

  // Canvas state
  const [bgColor, setBgColor] = useState<string>("#F3F4F6");
  const [bgImage, setBgImage] = useState<string | null>(null);

  const [items, setItems] = useState<EditorItem[]>([initialText()]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [templates, setTemplates] =
    useState<BuilderTemplate[]>(defaultTemplates);

  // Drag state
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{
    id: string;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  // Guests state
  const [guests, setGuests] = useState<Guest[]>([]);

  // Count of valid emails (used in UI / buttons)
  const validCount = guests.filter((g) => g.valid).length;

  // Send state
  const [sendMode, setSendMode] = useState<"all" | "personalize">("all");

  // Nouveaux états demandés
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showTextVariables, setShowTextVariables] = useState(false);
  const [variableFilter, setVariableFilter] = useState("");

  // For preview: which guest to preview with
  const [previewGuestId, setPreviewGuestId] = useState<string | null>(null);

  // Template et Event tracking
  const [templateId, setTemplateId] = useState<number | null>(null);
  const [eventId, setEventId] = useState<number | null>(null);
  const [previewModel, setPreviewModel] = useState<string>("default");

  // Modèle de prévisualisation sélectionné (pour l'envoi)
  const [selectedModelId, setSelectedModelId] = useState<string>("default");

  // État pour la sauvegarde
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // État pour le loader
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Chargement...");

  // Hook de sauvegarde
  const { saving, saveTemplate, updateTemplate } = useSaveTemplate();

  // Correction: Gestion sécurisée de selected
  const selected = useMemo(() => {
    if (!selectedId || !items?.length) return null;
    return items.find((i) => i?.id === selectedId) || null;
  }, [items, selectedId]);

  // Initialiser selectedId avec le premier item
  useEffect(() => {
    if (items?.length > 0 && !selectedId) {
      setSelectedId(items[0]?.id || null);
    }
  }, [items, selectedId]);

  // Extraire les variables du contenu (utile pour la sauvegarde)
  const extractVariables = (): string[] => {
    const variables = new Set<string>();
    const regex = /\{\{(\w+)\}\}/g;

    if (!items || !Array.isArray(items)) return [];

    items.forEach((item: any) => {
      if (item?.type === "text" && item.text) {
        let match: RegExpExecArray | null;
        while ((match = regex.exec(item.text)) !== null) {
          variables.add(match[1]);
        }
      }
    });

    return Array.from(variables);
  };

  // Gérer la sauvegarde du template
  const handleSaveTemplate = async (payload: any) => {
    try {
      // Validation des données
      if (!payload || !payload.title) {
        toast.error("Erreur de validation", {
          description: "Le titre du template est requis.",
        });
        return;
      }

      // Préparer les données du template
      const templateData = {
        items: items ? JSON.parse(JSON.stringify(items)) : [],
        bgColor: bgColor || "#F3F4F6",
        bgImage: bgImage || null,
        selectedModelId: selectedModelId || "default",
        variables: extractVariables(),
      };

      console.log("💾 Sauvegarde du template:", {
        title: payload.title,
        itemsCount: templateData.items.length,
        hasTemplateId: !!templateId,
      });

      // Convertir selectedModelId en number si nécessaire
      let modelPreviewId: number | null = null;
      if (selectedModelId && selectedModelId !== "default") {
        const parsed = parseInt(selectedModelId, 10);
        if (!isNaN(parsed)) {
          modelPreviewId = parsed;
        }
      }

      const savePayload = {
        title: payload.title,
        model_preview_id: modelPreviewId,
        data: templateData,
        thumbnail: null,
      };

      let savedTemplate;

      if (templateId) {
        // Mise à jour d'un template existant
        console.log("🔄 Mise à jour du template ID:", templateId);
        savedTemplate = await updateTemplate(templateId, savePayload);
      } else {
        // Création d'un nouveau template
        console.log("✨ Création d'un nouveau template");
        savedTemplate = await saveTemplate(savePayload);

        // Stocker l'ID du template nouvellement créé
        if (savedTemplate && savedTemplate.id) {
          console.log("✅ Template créé avec ID:", savedTemplate.id);
          setTemplateId(savedTemplate.id);
        }
      }

      setSavedSuccess(true);
      toast.success("Template sauvegardé avec succès!", {
        description: `"${payload.title}" a été sauvegardé.`,
      });

      // Fermer le modal après un court délai (pas de redirection)
      setTimeout(() => {
        setSavedSuccess(false);
        setShowSaveModal(false);
      }, 1500);
    } catch (error: any) {
      console.error("❌ Erreur sauvegarde:", error);
      toast.error("Erreur de sauvegarde", {
        description:
          error.response?.data?.message ||
          "Impossible de sauvegarder le template.",
      });
    }
  };

  // Drag handlers avec validations
  const onMouseDown = (e: React.MouseEvent, id: string) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect || !id) return;

    const item = items?.find((i) => i?.id === id);
    if (!item) return;

    setSelectedId(id);
    const offsetX = e.clientX - (rect.left + (item.x || 0));
    const offsetY = e.clientY - (rect.top + (item.y || 0));
    dragRef.current = { id, offsetX, offsetY };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragRef.current || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    if (!rect) return;

    const { id, offsetX, offsetY } = dragRef.current;
    const x = e.clientX - rect.left - offsetX;
    const y = e.clientY - rect.top - offsetY;

    setItems(
      (prev) =>
        prev?.map((it) =>
          it?.id === id
            ? ({
                ...it,
                x: Math.max(0, Math.min(x, rect.width - 10)),
                y: Math.max(0, Math.min(y, rect.height - 10)),
              } as EditorItem)
            : it
        ) || []
    );
  };

  const onMouseUp = () => {
    dragRef.current = null;
  };

  // Template actions (ancienne méthode - gardée pour compatibilité)
  const handleSaveTemplateOld = async () => {
    const name = prompt("Nom du modèle:");
    if (!name) return;

    const palette =
      items
        ?.filter((item) => item?.type === "text")
        ?.slice(0, 3)
        ?.map((item) => (item as TextItem)?.color)
        ?.filter(Boolean) || [];

    const defaults = ["#3B82F6", "#10B981", "#8B5CF6"];
    while (palette.length < 3) {
      palette.push(defaults[palette.length]);
    }

    const newTemplate: BuilderTemplate = {
      id: nanoid(),
      name,
      description: `Modèle personnalisé créé le ${new Date().toLocaleDateString()}`,
      bgColor: bgColor || "#F3F4F6",
      bgImage: bgImage || null,
      items: items ? JSON.parse(JSON.stringify(items)) : [],
      createdAt: new Date(),
      palette,
      isCustom: true,
    } as BuilderTemplate;

    try {
      if (generateThumbnail) {
        try {
          const thumbnail = await generateThumbnail({
            items: newTemplate.items,
            bgColor: newTemplate.bgColor,
          } as any);
          if (thumbnail) {
            // optionnel
          }
        } catch (err) {
          console.error("Erreur génération miniature:", err);
        }
      }
    } catch {
      // ignore thumbnail errors
    }

    try {
      await saveTemplate(newTemplate);
      setTemplates((prev) => [...(prev || []), newTemplate]);
      toast("Modèle sauvegardé", {
        description: `"${name}" a été ajouté à vos modèles.`,
      });
    } catch (err) {
      toast("Erreur", { description: "Impossible de sauvegarder le modèle." });
    }
  };

  const handleSaveAndGoHome = async () => {
    const name = prompt("Nom du modèle:");
    if (!name) return;

    try {
      const palette =
        items
          ?.filter((item) => item?.type === "text")
          ?.slice(0, 3)
          ?.map((item) => (item as TextItem)?.color)
          ?.filter(Boolean) || [];

      const defaults = ["#3B82F6", "#10B981", "#8B5CF6"];
      while (palette.length < 3) {
        palette.push(defaults[palette.length]);
      }

      const newTemplate: BuilderTemplate = {
        id: nanoid(),
        name,
        description: `Modèle personnalisé créé le ${new Date().toLocaleDateString()}`,
        bgColor: bgColor || "#F3F4F6",
        bgImage: bgImage || null,
        items: items ? JSON.parse(JSON.stringify(items)) : [],
        createdAt: new Date(),
        palette,
        isCustom: true,
      } as BuilderTemplate;

      await saveTemplate(newTemplate);

      toast("Modèle sauvegardé", {
        description: `"${name}" a été ajouté à vos modèles.`,
      });
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
      toast("Erreur", {
        description: "Impossible de sauvegarder le modèle.",
      });
    }
  };

  const loadTemplate = (template: BuilderTemplate) => {
    if (!template) return;

    if (template.bgImage) {
      setBgImage(template.bgImage);
    } else {
      setBgImage(null);
    }

    if (
      typeof template.bgColor === "string" &&
      template.bgColor.startsWith("url(")
    ) {
      const match = template.bgColor.match(/^url\((.*)\)$/);
      if (match) {
        const url = match[1].replace(/^['"]|['"]$/g, "");
        setBgImage(url);
      } else {
        setBgColor(template.bgColor || "#F3F4F6");
      }
    } else {
      setBgColor(template.bgColor || "#F3F4F6");
    }

    setItems(JSON.parse(JSON.stringify(template.items || [])));
    setSelectedId(template.items?.[0]?.id || null);
    toast("Modèle chargé", { description: `"${template.name}" appliqué.` });
  };

  // Charger un template depuis l'API (avec structure complète)
  const loadTemplateFromAPI = (apiTemplate: any) => {
    if (!apiTemplate) return;

    console.log("🔄 loadTemplateFromAPI appelé avec:", apiTemplate);

    // Utiliser "data" au lieu de "structure" (nouveau format)
    let templateData = {};
    try {
      templateData =
        typeof apiTemplate.data === "string"
          ? JSON.parse(apiTemplate.data)
          : apiTemplate.data || {};
    } catch (error) {
      console.error("❌ Erreur parsing JSON:", error);
      templateData = {};
    }

    console.log("📦 Données parsées du template:", templateData);

    // Charger les items - vérifier plusieurs emplacements possibles
    let itemsToLoad: any[] = [];

    if (
      templateData.items &&
      Array.isArray(templateData.items) &&
      templateData.items.length > 0
    ) {
      console.log(
        "✅ Items trouvés dans templateData.items:",
        templateData.items.length
      );
      itemsToLoad = templateData.items;
    } else if (
      apiTemplate.items &&
      Array.isArray(apiTemplate.items) &&
      apiTemplate.items.length > 0
    ) {
      console.log(
        "✅ Items trouvés dans apiTemplate.items:",
        apiTemplate.items.length
      );
      itemsToLoad = apiTemplate.items;
    } else {
      console.warn("⚠️ Aucun item trouvé - création d'un item par défaut");
      itemsToLoad = [initialText()];
    }

    // S'assurer que tous les items ont un ID
    itemsToLoad = itemsToLoad.map((item) => ({
      ...item,
      id: item?.id || nanoid(),
    }));

    console.log("📝 Items à charger:", itemsToLoad.length);
    setItems(JSON.parse(JSON.stringify(itemsToLoad)));
    setSelectedId(itemsToLoad[0]?.id || null);

    // Charger bgColor
    if (templateData.bgColor) {
      console.log("🎨 bgColor chargé:", templateData.bgColor);
      setBgColor(templateData.bgColor);
    } else {
      console.log("🎨 bgColor par défaut: #F3F4F6");
      setBgColor("#F3F4F6");
    }

    // Charger bgImage
    if (templateData.bgImage) {
      console.log(
        "🖼️ bgImage chargé:",
        templateData.bgImage.substring(0, 50) + "..."
      );
      setBgImage(templateData.bgImage);
    } else {
      console.log("🖼️ Pas de bgImage");
      setBgImage(null);
    }

    // Charger selectedModelId
    if (templateData.selectedModelId) {
      console.log(
        "📋 selectedModelId depuis data:",
        templateData.selectedModelId
      );
      setSelectedModelId(String(templateData.selectedModelId));
    } else if (apiTemplate.model_preview_id) {
      console.log(
        "📋 model_preview_id depuis template:",
        apiTemplate.model_preview_id
      );
      setSelectedModelId(String(apiTemplate.model_preview_id));
    } else {
      console.log("📋 selectedModelId par défaut: default");
      setSelectedModelId("default");
    }

    // Stocker l'ID du template pour les mises à jour
    if (apiTemplate.id) {
      console.log("🆔 Template ID stocké pour mises à jour:", apiTemplate.id);
      setTemplateId(apiTemplate.id);
    }

    toast.success("Modèle chargé avec succès!", {
      description: `"${apiTemplate.title || "Modèle sans nom"}" chargé avec ${
        itemsToLoad.length
      } éléments.`,
    });

    console.log("✅ Chargement terminé!");
  };

  const deleteTemplate = (templateId: string) => {
    setTemplates((prev) => prev?.filter((t) => t?.id !== templateId) || []);
    toast("Modèle supprimé");
  };

  // Controls actions
  const addText = () => {
    const t = initialText();
    setItems((prev) => [...(prev || []), t]);
    setSelectedId(t.id);
  };

  const addImage = (file: File, isBackground: boolean = false) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const imgEl = new window.Image();
      imgEl.onload = () => {
        if (isBackground) {
          setBgImage(String(reader.result));
        } else {
          const item: ImageItem = {
            id: nanoid(),
            type: "image",
            x: 80,
            y: 80,
            src: String(reader.result),
            width: Math.min(260, imgEl.width),
            height: Math.min(180, imgEl.height),
            isBackground: false,
          };
          setItems((prev) => [...(prev || []), item]);
          setSelectedId(item.id);
        }
      };
      imgEl.onerror = (err) => {
        console.error("Erreur chargement image:", err);
        toast("Erreur image", {
          description: "Impossible de lire le fichier image.",
        });
      };
      imgEl.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const replaceImage = (file: File, id: string) => {
    if (!file || !id) return;

    const reader = new FileReader();
    reader.onload = () => {
      const imgEl = new window.Image();
      imgEl.onload = () => {
        setItems(
          (prev) =>
            prev?.map((it) =>
              it?.id === id && it.type === "image"
                ? ({
                    ...(it as ImageItem),
                    src: String(reader.result),
                    width: Math.min(800, imgEl.width),
                    height: Math.min(800, imgEl.height),
                  } as ImageItem)
                : it
            ) || []
        );
      };
      imgEl.onerror = () => {
        toast("Erreur image", { description: "Fichier image invalide." });
      };
      imgEl.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeSelected = () => {
    if (!selectedId) return;
    setItems((prev) => prev?.filter((i) => i?.id !== selectedId) || []);
    setSelectedId(null);
  };

  // Guests import - extended to parse location/date/time if present
  const handleCSV = (file: File) => {
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        const rows = res.data as any[];
        const parsed: Guest[] = rows.map((r) => {
          const name = String(r.name || r.nom || r.Nom || "").trim();
          const email = String(r.email || r.Email || r.mail || "").trim();
          const locationField = String(
            r.location || r.lieu || r.adresse || ""
          ).trim();
          const dateField = String(r.date || r.Date || "").trim();
          const timeField = String(r.time || r.heure || r.Heure || "").trim();
          return {
            id: nanoid(),
            name: name || "Invité",
            email: email || "",
            valid: emailRegex.test(email),
            location: locationField || undefined,
            date: dateField || undefined,
            time: timeField || undefined,
          };
        });
        setGuests(parsed);
        setStep(1 as Step);
        toast("Contacts importés", {
          description: `${parsed.length} invités ajoutés.`,
        });
      },
    });
  };

  const addGuest = () =>
    setGuests((g) => [
      ...(g || []),
      {
        id: nanoid(),
        name: "Invité",
        email: "email@example.com",
        valid: false,
        location: "",
        date: "",
        time: "",
      },
    ]);

  const applyPaperTheme = (theme: PaperTheme) => {
    if (theme?.value && theme.value.startsWith("url(")) {
      setBgImage(theme.value);
    } else {
      setBgColor(theme?.value || "#F3F4F6");
      setBgImage(null);
    }
  };

  const handleInsertVariable = (variable: string) => {
    if (!selected || selected.type !== "text" || !selectedId) return;

    const textItem = selected as TextItem;
    const newText = (textItem.text || "") + variable;

    setItems(
      (prev) =>
        prev?.map((p) =>
          p?.id === selectedId
            ? ({
                ...(p as TextItem),
                text: newText,
              } as EditorItem)
            : p
        ) || []
    );
  };

  const replaceVariables = (text: string, guest?: any) => {
    if (!text || !guest) return text || "";

    return text.replace(
      /{{\s*([\w]+)\s*}}|{\s*([\w]+)\s*}|%([\w]+)%/g,
      (_m, g1, g2, g3) => {
        const key = (g1 || g2 || g3 || "").toLowerCase();
        if (!key) return "";
        if (["name", "nom", "fullname", "full_name"].includes(key))
          return guest.full_name || guest.name || "";
        if (["email", "mail"].includes(key)) return guest.email || "";
        if (["location", "lieu", "adresse"].includes(key))
          return guest.location || "";
        if (["date"].includes(key)) return guest.date || "";
        if (["time", "heure", "horaire"].includes(key)) return guest.time || "";
        if (["phone", "telephone", "tel"].includes(key))
          return guest.phone || "";
        return guest[key] ?? "";
      }
    );
  };

  // Chargement initial des templates
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    let tid = params.get("template");
    if (!tid) {
      console.log("ℹ️ Aucun template ID dans l'URL");
      setIsLoading(false);
      return;
    }

    console.log("🔍 Chargement du template ID:", tid, "Type:", typeof tid);

    (async () => {
      // Afficher le loader
      setIsLoading(true);
      setLoadingMessage("Chargement du modèle...");

      try {
        // Vérifier si c'est un template par défaut
        const foundDefault = defaultTemplates.find((t) => t?.id === tid);
        if (foundDefault) {
          console.log("✅ Template par défaut trouvé:", foundDefault.name);
          loadTemplate(foundDefault);
          return;
        }

        // Nettoyer l'ID si nécessaire (retirer "api-" ou "local-")
        let cleanId = tid;
        if (tid.startsWith("api-")) {
          cleanId = tid.replace("api-", "");
          console.log("🔄 ID nettoyé: api-" + cleanId + " → " + cleanId);
        }

        // Vérifier si c'est un ID numérique (template API)
        const numericId = parseInt(cleanId, 10);
        if (!isNaN(numericId)) {
          console.log(
            "🌐 Chargement depuis l'API avec ID numérique:",
            numericId
          );
          const { templateService } = await import(
            "@/api/services/templateService"
          );
          const apiTemplate = await templateService.getTemplate(numericId);

          if (apiTemplate) {
            console.log("✅ Template API chargé:", apiTemplate.title);
            loadTemplateFromAPI(apiTemplate);
            return;
          } else {
            console.warn(
              "⚠️ Template non trouvé dans l'API pour ID:",
              numericId
            );
            toast.error("Template introuvable", {
              description: `Le template avec l'ID ${numericId} n'existe pas.`,
            });
          }
        } else {
          console.log(
            "💾 ID non numérique, recherche dans le stockage local..."
          );
        }

        // Fallback: chercher dans le stockage local
        console.log("💾 Recherche dans le stockage local pour ID:", tid);
        const saved = (await Promise.resolve(getTemplates())) || [];
        const foundSaved = Array.isArray(saved)
          ? saved.find((t: any) => t?.id === tid)
          : undefined;
        if (foundSaved) {
          console.log("✅ Template local trouvé:", foundSaved.name);
          loadTemplate(foundSaved);
        } else {
          console.warn("⚠️ Template introuvable dans le stockage local");
          toast.error("Template introuvable", {
            description: `Le template "${tid}" n'a pas été trouvé.`,
          });
        }
      } catch (err: any) {
        console.error("❌ Erreur chargement template:", err);
        console.error("Détails:", err.response?.data || err.message);
        toast.error("Erreur de chargement", {
          description:
            err.response?.data?.message || "Impossible de charger le template.",
        });
      } finally {
        // Masquer le loader après un court délai pour une transition fluide
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    })();
  }, [location.search]);

  // Nouveau StepNav compact, professionnel et CENTRÉ
  const StepNav = () => {
    const labels = ["Design", "Détails", "Prévisualisation", "Envoi"];
    const icons = [
      <Palette className="h-3.5 w-3.5" />,
      <Type className="h-3.5 w-3.5" />,
      <Eye className="h-3.5 w-3.5" />,
      <Send className="h-3.5 w-3.5" />,
    ];

    return (
      <nav className="flex items-center bg-white border border-gray-200 rounded-lg p-0.5 mx-auto w-fit">
        {labels.map((label, i) => {
          const isActive = step === i;
          const isCompleted = step > i;

          return (
            <button
              key={label}
              onClick={() => setStep(i as Step)}
              className={`
              relative flex items-center justify-center sm:justify-start gap-1.5 px-3 py-2 rounded text-xs font-medium transition-all
              min-w-[70px] sm:min-w-[95px]
              ${
                isActive
                  ? "bg-gray-900 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }
            `}
              aria-current={isActive ? "step" : undefined}
              title={label}
            >
              {/* Indicateur de progression */}
              {isCompleted && !isActive && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-[8px] text-white">✓</span>
                </div>
              )}

              {/* Contenu */}
              <div
                className={`
              ${
                isActive
                  ? "text-white"
                  : isCompleted
                  ? "text-green-600"
                  : "text-gray-500"
              }
            `}
              >
                {icons[i]}
              </div>
              <span className="hidden sm:inline font-medium">{label}</span>
            </button>
          );
        })}
      </nav>
    );
  };

  // Préparer le contexte avec toutes les vérifications
  const ctx = {
    step,
    setStep,
    canvasRef,
    onMouseMove,
    onMouseUp,
    onMouseDown,
    items: items || [],
    setItems,
    selectedId,
    setSelectedId,
    selected,
    addText,
    addImage,
    replaceImage,
    setShowImagePicker,
    setShowTextVariables,
    setBgColor,
    setBgImage,
    bgColor: bgColor || "#F3F4F6",
    bgImage,
    templates: templates || [],
    setTemplates,
    loadTemplate,
    deleteTemplate,
    handleSaveTemplate: handleSaveTemplateOld, // ancienne méthode
    handleSaveAndGoHome,
    guests: guests || [],
    setGuests,
    validCount,
    handleCSV,
    addGuest,
    previewGuestId,
    setPreviewGuestId,
    handleInsertVariable,
    replaceVariables,
    variableFilter,
    setVariableFilter,
    sendMode,
    setSendMode,
    removeSelected,
    templateId,
    setTemplateId,
    eventId,
    setEventId,
    previewModel,
    setPreviewModel,
    selectedModelId,
    setSelectedModelId,
  };

  // Si loading, afficher seulement le spinner
  if (isLoading) {
    return <LoadingSpinner message={loadingMessage} size="lg" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-4 py-3">
        <div className="container flex items-center justify-between gap-4">
          {/* Retour + Titre réduit */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="h-7 w-7"
              title="Retour"
            >
              <Home className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-300 hidden sm:inline">|</span>
            <h1 className="text-sm font-medium text-gray-700 hidden sm:inline">
              Éditeur
            </h1>
          </div>

          {/* Navigation compacte */}
          <div className="flex-1 max-w-2xl">
            <StepNav />
          </div>

          {/* Actions contextuelles - Bouton de sauvegarde seulement à l'étape Design */}
          <div className="flex items-center gap-2">
            {step === 0 && (
              <Button
                variant="default"
                size="sm"
                onClick={() => setShowSaveModal(true)}
                className="h-7 px-2.5 text-xs bg-blue-600 hover:bg-blue-700"
                title="Sauvegarder le modèle"
                disabled={saving}
              >
                <Save className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">
                  {saving ? "Sauvegarde..." : "Sauvegarder"}
                </span>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container py-6">
        {step === 0 && <StepDesign ctx={ctx} />}
        {step === 1 && <StepDetails ctx={ctx} />}
        {step === 2 && <StepPreviewImproved ctx={ctx} />}
        {step === 3 && <StepSendImproved ctx={ctx} />}
      </main>

      {/* ImagePicker Modal */}
      {showImagePicker && (
        <ImagePickerModal
          isOpen={showImagePicker}
          onClose={() => setShowImagePicker(false)}
          onSelectImage={(file: File) => {
            addImage(file, false);
            setShowImagePicker(false);
          }}
          onSelectTheme={(theme: PaperTheme) => {
            applyPaperTheme(theme);
            setShowImagePicker(false);
          }}
          onSetAsBackground={(fileOrFlag: File | boolean) => {
            if (fileOrFlag instanceof File) {
              addImage(fileOrFlag, true);
            }
          }}
        />
      )}

      {/* Modal de sauvegarde */}
      <SaveTemplateModal
        open={showSaveModal}
        onOpenChange={setShowSaveModal}
        onSave={handleSaveTemplate}
        loading={saving}
        data={{
          items: items || [],
          bgColor: bgColor || "#F3F4F6",
          bgImage: bgImage || null,
          selectedModelId: selectedModelId || "default",
          variables: extractVariables(),
        }}
        modelPreviewId={
          selectedModelId && selectedModelId !== "default"
            ? parseInt(selectedModelId, 10)
            : null
        }
      />
    </div>
  );
}

export default Builder;
