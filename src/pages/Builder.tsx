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
  Image as ImageIcon, // renamed to avoid colliding with window.Image
  Type,
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
  // optional flag if needed by modal
  isBackground?: boolean;
}

type EditorItem = TextItem | ImageItem;

interface Guest {
  id: string;
  name: string;
  email: string;
  valid: boolean;
  message?: string;
  // nouveaux champs demandés
  location?: string;
  date?: string;
  time?: string;
}
interface BuilderTemplate {
  id: string;
  name: string;
  description?: string;
  bgColor: string;
  bgImage?: string | null; // <- added
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

export default function Builder() {
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState<Step>(0);

  // Canvas state
  const [bgColor, setBgColor] = useState<string>("#F3F4F6");
  // NEW: background image dataURL (if an image is set as background)
  const [bgImage, setBgImage] = useState<string | null>(null);

  const [items, setItems] = useState<EditorItem[]>([initialText()]);
  const [selectedId, setSelectedId] = useState<string | null>(items[0].id);
  const [templates, setTemplates] = useState<BuilderTemplate[]>(defaultTemplates);

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
  const [variableFilter, setVariableFilter] = useState(""); // small helper for variables panel visibility

  // For preview: which guest to preview with
  const [previewGuestId, setPreviewGuestId] = useState<string | null>(null);
  // preview step is handled via `step === 2`
  const selected = useMemo(
    () => items.find((i) => i.id === selectedId) || null,
    [items, selectedId]
  );

  // Drag handlers
  const onMouseDown = (e: React.MouseEvent, id: string) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const item = items.find((i) => i.id === id);
    if (!item) return;
    setSelectedId(id);
    const offsetX = e.clientX - (rect.left + item.x);
    const offsetY = e.clientY - (rect.top + item.y);
    dragRef.current = { id, offsetX, offsetY };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragRef.current) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const { id, offsetX, offsetY } = dragRef.current;
    const x = e.clientX - rect.left - offsetX;
    const y = e.clientY - rect.top - offsetY;
    setItems((prev) =>
      prev.map((it) =>
        it.id === id
          ? ({
              ...it,
              x: Math.max(0, Math.min(x, rect.width - 10)),
              y: Math.max(0, Math.min(y, rect.height - 10)),
            } as EditorItem)
          : it
      )
    );
  };

  const onMouseUp = () => {
    dragRef.current = null;
  };

  // Template actions
  const handleSaveTemplate = async () => {
    const name = prompt("Nom du modèle:");
    if (!name) return;

    // Extraire la palette de couleurs des éléments (jusqu'à 3 couleurs)
    const palette = items
      .filter((item) => item.type === "text")
      .slice(0, 3)
      .map((item) => (item as TextItem).color);

    // Compléter avec des couleurs par défaut si nécessaire
    const defaults = ["#3B82F6", "#10B981", "#8B5CF6"];
    while (palette.length < 3) {
      palette.push(defaults[palette.length]);
    }

    const newTemplate: BuilderTemplate = {
      id: nanoid(),
      name,
      description: `Modèle personnalisé créé le ${new Date().toLocaleDateString()}`,
      bgColor,
      bgImage: bgImage ?? null, // persist background image
      items: JSON.parse(JSON.stringify(items)),
      createdAt: new Date(),
      palette,
      isCustom: true,
    } as unknown as BuilderTemplate;

    // Optionnel: générer une miniature (si utile) — generateThumbnail peut renvoyer une dataURL
    try {
      if (generateThumbnail) {
        try {
          const thumbnail = await generateThumbnail({
            items: newTemplate.items,
            bgColor: newTemplate.bgColor,
          } as any);
          if (thumbnail) {
            // si votre type Template attend une propriété thumbnail, vous pouvez l'ajouter :
            // (newTemplate as any).thumbnail = thumbnail;
          }
        } catch (err) {
          // Ignorer les erreurs de génération de miniature
          console.error("Erreur génération miniature:", err);
        }
      }
    } catch {
      // ignore thumbnail errors
    }

    try {
      await saveTemplate(newTemplate);
      // mettre à jour l'état local pour feedback immédiat
      setTemplates((prev) => [...prev, newTemplate]);
      toast("Modèle sauvegardé", {
        description: `"${name}" a été ajouté à vos modèles.`,
      });
    } catch (err) {
      toast("Erreur", { description: "Impossible de sauvegarder le modèle." });
    }
  };

  // NOUVELLE FONCTION : Sauvegarde et redirection vers l'accueil
  const handleSaveAndGoHome = async () => {
    const name = prompt("Nom du modèle:");
    if (!name) return;

    try {
      // Extraire la palette de couleurs des éléments
      const palette = items
        .filter((item) => item.type === "text")
        .slice(0, 3)
        .map((item) => (item as TextItem).color);

      // Compléter avec des couleurs par défaut si nécessaire
      const defaults = ["#3B82F6", "#10B981", "#8B5CF6"];
      while (palette.length < 3) {
        palette.push(defaults[palette.length]);
      }

      const newTemplate: BuilderTemplate = {
        id: nanoid(),
        name,
        description: `Modèle personnalisé créé le ${new Date().toLocaleDateString()}`,
        bgColor,
        bgImage: bgImage ?? null,
        items: JSON.parse(JSON.stringify(items)),
        createdAt: new Date(),
        palette,
        isCustom: true,
      } as unknown as BuilderTemplate;

      // Sauvegarder le template
      await saveTemplate(newTemplate);

      toast("Modèle sauvegardé", {
        description: `"${name}" a été ajouté à vos modèles. Redirection vers l'accueil...`,
      });

      // Redirection vers l'accueil après 1.5 secondes
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err);
      toast("Erreur", {
        description: "Impossible de sauvegarder le modèle.",
      });
    }
  };

  const loadTemplate = (template: BuilderTemplate) => {
    // if template has explicit bgImage, use it
    if (template.bgImage) {
      setBgImage(template.bgImage);
    } else {
      setBgImage(null);
    }
    if (
      typeof template.bgColor === "string" &&
      template.bgColor.startsWith("url(")
    ) {
      // extrait le contenu entre url(...)
      const match = template.bgColor.match(/^url\((.*)\)$/);
      if (match) {
        const url = match[1].replace(/^['"]|['"]$/g, "");
        setBgImage(url);
      } else {
        setBgColor(template.bgColor);
        // keep previously set bgImage (if any) or clear
      }
    } else {
      setBgColor(template.bgColor);
      // bgImage already set above if present
    }
    setItems(JSON.parse(JSON.stringify(template.items || [])));
    setSelectedId(template.items?.[0]?.id || null);
    toast("Modèle chargé", { description: `"${template.name}" appliqué.` });
  };

  const deleteTemplate = (templateId: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== templateId));
    toast("Modèle supprimé");
  };

  // Controls actions
  const addText = () => {
    const t = initialText();
    setItems((prev) => [...prev, t]);
    setSelectedId(t.id);
  };

  // Modifiée pour supporter le background image et l'image normale
  const addImage = (file: File, isBackground: boolean = false) => {
    const reader = new FileReader();
    reader.onload = () => {
      // use global Image constructor (not the icon)
      const imgEl = new window.Image();
      imgEl.onload = () => {
        if (isBackground) {
          // set image as background
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
          setItems((prev) => [...prev, item]);
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

  // Replace image src for an existing image item
  const replaceImage = (file: File, id: string) => {
    const reader = new FileReader();
    reader.onload = () => {
      const imgEl = new window.Image();
      imgEl.onload = () => {
        setItems((prev) =>
          prev.map((it) =>
            it.id === id && it.type === "image"
              ? ({
                  ...(it as ImageItem),
                  src: String(reader.result),
                  width: Math.min(800, imgEl.width),
                  height: Math.min(800, imgEl.height),
                } as ImageItem)
              : it
          )
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
    setItems((prev) => prev.filter((i) => i.id !== selectedId));
    setSelectedId(null);
  };

  // Guests import - extended to parse location/date/time if present
  const handleCSV = (file: File) => {
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
            name,
            email,
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

  // when adding manual guest include new fields
  const addGuest = () =>
    setGuests((g) => [
      ...g,
      {
        id: nanoid(),
        name: "Invité",
        email: "email@example.com",
        valid: true,
        location: "",
        date: "",
        time: "",
      },
    ]);

  // Nouvelle fonction pour appliquer un thème de papier (peut être image ou couleur)
  const applyPaperTheme = (theme: PaperTheme) => {
    if (theme.value && theme.value.startsWith("url(")) {
      // si le thème contient une image url/data, on l'applique comme bgImage
      setBgImage(theme.value);
    } else {
      setBgColor(theme.value);
      setBgImage(null);
    }
  };

  // Nouvelle fonction pour insérer des variables dans le texte
  const handleInsertVariable = (variable: string) => {
    if (selected && selected.type === "text") {
      const textItem = selected as TextItem;
      const newText = textItem.text + variable;

      setItems((prev) =>
        prev.map((p) =>
          p.id === selectedId
            ? ({
                ...(p as TextItem),
                text: newText,
              } as EditorItem)
            : p
        )
      );
    }
  };

  // helper: replace variable tokens in text using guest object (ajout lieu/date/heure)
  const replaceVariables = (text: string, guest?: Guest) => {
    if (!guest) return text;
    return text.replace(
      /{{\s*([\w]+)\s*}}|{\s*([\w]+)\s*}|%([\w]+)%/g,
      (_m, g1, g2, g3) => {
        const key = (g1 || g2 || g3 || "").toLowerCase();
        if (!key) return "";
        if (["name", "nom", "fullname"].includes(key)) return guest.name || "";
        if (["email", "mail"].includes(key)) return guest.email || "";
        if (["location", "lieu", "adresse"].includes(key))
          return guest.location || "";
        if (["date"].includes(key)) return guest.date || "";
        if (["time", "heure", "horaire"].includes(key)) return guest.time || "";
        // fallback to any property on guest
        // @ts-ignore
        return guest[key] ?? "";
      }
    );
  };

  useEffect(() => {
    // si URL contient ?template=ID on charge le template (search dans default + saved)
    const params = new URLSearchParams(location.search);
    const tid = params.get("template");
    if (!tid) return;
    (async () => {
      try {
        // chercher dans templates par défaut
        const foundDefault = defaultTemplates.find((t) => t.id === tid);
        if (foundDefault) {
          loadTemplate(foundDefault);
          return;
        }
        // chercher dans saved templates via utilitaire
        const saved = (await Promise.resolve(getTemplates())) || [];
        const foundSaved = Array.isArray(saved)
          ? saved.find((t: any) => t.id === tid)
          : undefined;
        if (foundSaved) {
          loadTemplate(foundSaved);
        }
      } catch (err) {
        console.error("Erreur chargement template depuis URL:", err);
      }
    })();
  }, [location.search]);

  // Render helpers
  // Steps navigation - Version améliorée avec design moderne
  const StepNav = () => {
    const labels = ["Design", "Détails", "Prévisualisation", "Envoi"];
    return (
      <div className="relative">
        {/* Ligne de progression */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 hidden md:block">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{
              width: `${((step + 1) / labels.length) * 100}%`,
            }}
          />
        </div>

        {/* Étapes cliquables */}
        <nav
          aria-label="Étapes"
          className="relative flex justify-between gap-2 md:gap-4"
        >
          {labels.map((label, i) => (
            <button
              key={label}
              onClick={() => setStep(i as Step)}
              className={`group flex flex-col items-center gap-1 md:gap-2 transition-all ${
                step === i
                  ? "scale-105"
                  : "hover:scale-105 opacity-70 hover:opacity-100"
              }`}
              aria-current={step === i ? "step" : undefined}
            >
              <div
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-xs md:text-sm transition-all ${
                  step === i
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/50"
                    : step > i
                    ? "bg-green-500 text-white"
                    : "bg-white border-2 border-gray-300 text-gray-600 group-hover:border-blue-400 group-hover:text-blue-600"
                }`}
              >
                {step > i ? "✓" : i + 1}
              </div>
              <span
                className={`text-xs md:text-sm font-medium transition-all ${
                  step === i
                    ? "text-blue-600"
                    : "text-gray-600 group-hover:text-blue-600"
                }`}
              >
                {label}
              </span>
            </button>
          ))}
        </nav>
      </div>
    );
  };

  const ctx = {
    // core state & handlers used by steps
    step,
    setStep,
    canvasRef,
    onMouseMove,
    onMouseUp,
    onMouseDown,
    items,
    setItems,
    selectedId,
    setSelectedId,
    addText,
    addImage,
    replaceImage,
    setShowImagePicker,
    setShowTextVariables,
    setBgColor,
    setBgImage,
    bgColor,
    bgImage,
    templates,
    setTemplates,
    loadTemplate,
    deleteTemplate,
    handleSaveTemplate,
    handleSaveAndGoHome,
    guests,
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="border-b bg-white/80 backdrop-blur-sm p-4 shadow-sm">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Bouton Retour à l'accueil */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Accueil
            </Button>

            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Builder d'invitations
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Créez des invitations élégantes en quelques clics
              </p>
            </div>
          </div>
          <StepNav />
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
            // ajoute comme image normale
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

      {/* Text variables panel */}
      {/* {showTextVariables && (
        <TextVariablesPanel
          isOpen={showTextVariables}
          onClose={() => setShowTextVariables(false)}
          onInsertVariable={handleInsertVariable}
        />
      )} */}
    </div>
  );
}
