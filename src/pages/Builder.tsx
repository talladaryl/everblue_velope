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
import TextVariablesPanel from "@/components/TextVariablesPanel";
import { PaperTheme, TextVariable } from "@/types";


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
interface Template {
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

const defaultTemplates: Template[] = [
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
  const [templates, setTemplates] = useState<Template[]>(defaultTemplates);

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

    const newTemplate: Template = {
      id: nanoid(),
      name,
      description: `Modèle personnalisé créé le ${new Date().toLocaleDateString()}`,
      bgColor,
      bgImage: bgImage ?? null, // persist background image
      items: JSON.parse(JSON.stringify(items)),
      createdAt: new Date(),
      palette,
      isCustom: true,
    } as unknown as Template;

    // Optionnel: générer une miniature (si utile) — generateThumbnail peut renvoyer une dataURL
    try {
      const thumbnail = await generateThumbnail?.({
        items: newTemplate.items,
        bgColor: newTemplate.bgColor,
      })?.catch?.(() => undefined);
      if (thumbnail) {
        // si votre type Template attend une propriété thumbnail, vous pouvez l'ajouter :
        // (newTemplate as any).thumbnail = thumbnail;
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

      const newTemplate: Template = {
        id: nanoid(),
        name,
        description: `Modèle personnalisé créé le ${new Date().toLocaleDateString()}`,
        bgColor,
        bgImage: bgImage ?? null,
        items: JSON.parse(JSON.stringify(items)),
        createdAt: new Date(),
        palette,
        isCustom: true,
      } as unknown as Template;

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

  const loadTemplate = (template: Template) => {
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
    if (theme.type === "image" && theme.value) {
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
  // Steps as underline-only tabs, horizontally scrollable on small screens
  const StepNav = () => {
    const labels = ["Design", "Détails", "Prévisualisation", "Envoi"];
    return (
      <nav
        aria-label="Étapes"
        className="flex gap-3 overflow-x-auto px-1 py-1 lg:px-0 no-scrollbar"
      >
        {labels.map((label, i) => (
          <button
            key={label}
            onClick={() => setStep(i as Step)}
            className={cn(
              "flex-shrink-0 px-3 py-2 text-sm font-medium border-b-2 transition-colors",
              step === i
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-gray-700"
            )}
            aria-current={step === i ? "step" : undefined}
          >
            <span className="hidden sm:inline mr-2">{i + 1}.</span>
            {label}
          </button>
        ))}
      </nav>
    );
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
        {/* Step 0: Design */}
        {step === 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 animate-enter">
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Éditeur d'invitation
                  </CardTitle>
                  <CardDescription>
                    Glissez-déposez les éléments et personnalisez votre design
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="bg" className="text-sm font-medium">
                        Couleur de fond
                      </Label>
                      <input
                        id="bg"
                        type="color"
                        value={bgColor}
                        onChange={(e) => {
                          setBgColor(e.target.value);
                          setBgImage(null);
                        }}
                        className="h-8 w-8 rounded-md border bg-card cursor-pointer"
                      />
                    </div>

                    <Button
                      variant="outline"
                      onClick={addText}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Texte
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => setShowImagePicker(true)}
                      className="flex items-center gap-2"
                    >
                      <ImageIcon className="h-4 w-4" />
                      Image
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => setShowTextVariables((s) => !s)} // toggle (show only side panel)
                      className="flex items-center gap-2"
                    >
                      <Type className="h-4 w-4" />
                      Variables
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => setStep(2)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Prévisualiser
                    </Button>
                  </div>

                  <div
                    ref={canvasRef}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                    className="relative w-full max-w-full lg:max-w-3xl aspect-[16/9] rounded-xl border-2 border-dashed border-border bg-muted shadow-lg overflow-hidden"
                    style={{
                      // use bgImage if present else bgColor
                      background: bgImage
                        ? `url(${bgImage}) center/cover`
                        : bgColor,
                      backgroundSize: "cover",
                    }}
                  >
                    {items.map((it) => (
                      <div
                        key={it.id}
                        onMouseDown={(e) => onMouseDown(e, it.id)}
                        onClick={() => setSelectedId(it.id)}
                        className={cn(
                          "absolute cursor-move transition-all duration-150 p-1",
                          selectedId === it.id &&
                            "ring-2 ring-primary ring-offset-2 rounded"
                        )}
                        style={{ left: it.x, top: it.y }}
                      >
                        {it.type === "text" ? (
                          <div
                            contentEditable
                            suppressContentEditableWarning
                            onBlur={(e) =>
                              setItems((prev) =>
                                prev.map((p) =>
                                  p.id === it.id
                                    ? ({
                                        ...(p as TextItem),
                                        text: e.currentTarget.innerText,
                                      } as EditorItem)
                                    : p
                                )
                              )
                            }
                            className="outline-none min-w-[80px] bg-white/80 backdrop-blur-sm rounded px-2 py-1"
                            style={{
                              color: (it as TextItem).color,
                              letterSpacing:
                                (it as TextItem).letterSpacing + "px",
                              fontWeight: (it as TextItem).fontWeight,
                              fontSize: (it as TextItem).fontSize,
                              fontFamily: (it as TextItem).fontFamily,
                              textAlign: (it as TextItem).textAlign,
                            }}
                          >
                            {(it as TextItem).text}
                          </div>
                        ) : (
                          <img
                            src={(it as ImageItem).src}
                            alt=""
                            draggable={false}
                            className="rounded shadow-sm"
                            style={{
                              width: (it as ImageItem).width,
                              height: (it as ImageItem).height,
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Templates Section */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle>Modèles sauvegardés</CardTitle>
                  <CardDescription>
                    Utilisez ou sauvegardez vos designs préférés
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {templates.map((template) => (
                      <div
                        key={template.id}
                        className="border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer group relative"
                      >
                        <div
                          className="aspect-[16/9] rounded-md mb-2 border"
                          style={{ background: template.bgColor }}
                        >
                          {template.items.slice(0, 2).map(
                            (item, index) =>
                              item.type === "text" && (
                                <div
                                  key={index}
                                  className="absolute text-sm"
                                  style={{
                                    left: item.x / 4,
                                    top: item.y / 4,
                                    color: (item as TextItem).color,
                                    fontSize: (item as TextItem).fontSize / 2,
                                    fontWeight: (item as TextItem).fontWeight,
                                  }}
                                >
                                  {(item as TextItem).text}
                                </div>
                              )
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">
                            {template.name}
                          </span>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => loadTemplate(template)}
                            >
                              Charger
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteTemplate(template.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={handleSaveTemplate}
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Sauvegarder ce modèle
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Exporter
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Properties Panel */}
            <div className="space-y-6">
              {/* Déplacer le panel des variables en haut de la sidebar */}
              {showTextVariables && (
                <Card className="lg:sticky lg:top-6">
                  <CardHeader>
                    <CardTitle>Variables de texte</CardTitle>
                    <CardDescription>
                      Cliquez pour insérer une variable dans le texte. Utilisez
                      la recherche pour trouver rapidement.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Input
                      placeholder="Rechercher une variable..."
                      value={variableFilter}
                      onChange={(e) => setVariableFilter(e.target.value)}
                      aria-label="Rechercher une variable"
                      className="mb-2"
                    />
                    <div className="space-y-2 max-h-56 overflow-auto">
                      {/* If TextVariablesPanel supports props for filtering, pass it.
                          Otherwise keep existing component for listing. */}
                      <TextVariablesPanel
                        onInsertVariable={handleInsertVariable}
                        // @ts-ignore: optional filter prop if panel supports it
                        variableFilter={variableFilter}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="lg:sticky lg:top-6">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Propriétés</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selected && selected.type === "text" && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="text-sm">Taille</Label>
                          <Input
                            type="number"
                            value={(selected as TextItem).fontSize}
                            onChange={(e) =>
                              setItems((prev) =>
                                prev.map((p) =>
                                  p.id === selectedId
                                    ? ({
                                        ...(p as TextItem),
                                        fontSize: Number(e.target.value),
                                      } as EditorItem)
                                    : p
                                )
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">Graisse</Label>
                          <Input
                            type="number"
                            value={(selected as TextItem).fontWeight}
                            onChange={(e) =>
                              setItems((prev) =>
                                prev.map((p) =>
                                  p.id === selectedId
                                    ? ({
                                        ...(p as TextItem),
                                        fontWeight: Number(e.target.value),
                                      } as EditorItem)
                                    : p
                                )
                              )
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="text-sm">Interlettrage</Label>
                          <Input
                            type="number"
                            value={(selected as TextItem).letterSpacing}
                            onChange={(e) =>
                              setItems((prev) =>
                                prev.map((p) =>
                                  p.id === selectedId
                                    ? ({
                                        ...(p as TextItem),
                                        letterSpacing: Number(e.target.value),
                                      } as EditorItem)
                                    : p
                                )
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">Couleur</Label>
                          <input
                            type="color"
                            value={(selected as TextItem).color}
                            onChange={(e) =>
                              setItems((prev) =>
                                prev.map((p) =>
                                  p.id === selectedId
                                    ? ({
                                        ...(p as TextItem),
                                        color: e.target.value,
                                      } as EditorItem)
                                    : p
                                )
                              )
                            }
                            className="h-10 w-full rounded-md border bg-card cursor-pointer"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">Police</Label>
                        <Select
                          value={(selected as TextItem).fontFamily}
                          onValueChange={(v) =>
                            setItems((prev) =>
                              prev.map((p) =>
                                p.id === selectedId
                                  ? ({
                                      ...(p as TextItem),
                                      fontFamily: v,
                                    } as EditorItem)
                                  : p
                              )
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Police" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="system-ui, sans-serif">
                              Système
                            </SelectItem>
                            <SelectItem value="Georgia, serif">
                              Georgia
                            </SelectItem>
                            <SelectItem value="'Times New Roman', serif">
                              Times
                            </SelectItem>
                            <SelectItem value="'Trebuchet MS', sans-serif">
                              Trebuchet
                            </SelectItem>
                            <SelectItem value="'Arial', sans-serif">
                              Arial
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">Alignement</Label>
                        <Select
                          value={(selected as TextItem).textAlign}
                          onValueChange={(v: any) =>
                            setItems((prev) =>
                              prev.map((p) =>
                                p.id === selectedId
                                  ? ({
                                      ...(p as TextItem),
                                      textAlign: v,
                                    } as EditorItem)
                                  : p
                              )
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Alignement" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="left">Gauche</SelectItem>
                            <SelectItem value="center">Centre</SelectItem>
                            <SelectItem value="right">Droite</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="pt-4 flex gap-2">
                        <Button
                          variant="destructive"
                          onClick={removeSelected}
                          className="flex-1"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </Button>
                        <Button onClick={() => setStep(1)} className="flex-1">
                          Continuer →
                        </Button>
                      </div>
                    </>
                  )}

                  {/* Image properties */}
                  {selected && selected.type === "image" && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm w-20">Largeur</Label>
                        <Input
                          type="number"
                          value={(selected as ImageItem).width}
                          onChange={(e) =>
                            setItems((prev) =>
                              prev.map((p) =>
                                p.id === selectedId
                                  ? ({
                                      ...(p as ImageItem),
                                      width: Number(e.target.value),
                                    } as EditorItem)
                                  : p
                              )
                            )
                          }
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-sm w-20">Hauteur</Label>
                        <Input
                          type="number"
                          value={(selected as ImageItem).height}
                          onChange={(e) =>
                            setItems((prev) =>
                              prev.map((p) =>
                                p.id === selectedId
                                  ? ({
                                      ...(p as ImageItem),
                                      height: Number(e.target.value),
                                    } as EditorItem)
                                  : p
                              )
                            )
                          }
                        />
                      </div>
                      <div className="flex gap-2">
                        <label className="inline-flex items-center gap-2 cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f && selectedId) replaceImage(f, selectedId);
                            }}
                          />
                          <span className="px-3 py-2 rounded border bg-card">
                            Remplacer l'image
                          </span>
                        </label>
                        <Button
                          variant="outline"
                          onClick={() => {
                            if (selected && selected.type === "image") {
                              setBgImage((selected as ImageItem).src);
                              toast("Fond mis à jour", {
                                description: "L'image est définie comme fond.",
                              });
                            }
                          }}
                        >
                          Définir comme fond
                        </Button>
                      </div>
                      <div className="pt-2 flex gap-2">
                        <Button
                          variant="destructive"
                          onClick={removeSelected}
                          className="flex-1"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </Button>
                        <Button onClick={() => setStep(1)} className="flex-1">
                          Continuer →
                        </Button>
                      </div>
                    </div>
                  )}

                  {!selected && (
                    <div className="text-center py-8 text-muted-foreground">
                      <div className="rounded-full bg-muted p-3 w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                        <Eye className="h-6 w-6" />
                      </div>
                      <p className="text-sm">
                        Sélectionnez un élément pour modifier ses propriétés
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Si l'utilisateur veut insérer des variables */}
            </div>
          </div>
        )}

        {/* Step 1: Détails (guests) */}
        {step === 1 && (
          <div className="max-w-4xl mx-auto space-y-6 animate-enter">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des invités</CardTitle>
                <CardDescription>
                  Importez vos contacts ou ajoutez-les manuellement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Liste des invités</h3>
                    <p className="text-sm text-muted-foreground">
                      {guests.length} invités —{" "}
                      <Badge
                        variant={validCount > 0 ? "default" : "destructive"}
                      >
                        {validCount} valides
                      </Badge>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center">
                      <input
                        type="file"
                        accept=".csv"
                        className="hidden"
                        onChange={(e) =>
                          e.target.files && handleCSV(e.target.files[0])
                        }
                      />
                      <span className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-md border hover:bg-accent transition-colors">
                        <Download className="h-4 w-4" />
                        Importer CSV
                      </span>
                    </label>
                    <Button variant="outline" onClick={addGuest}>
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Lieu</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Heure</TableHead>
                        <TableHead>Statut</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {guests.map((g) => (
                        <TableRow key={g.id}>
                          <TableCell>
                            <Input
                              value={g.name}
                              onChange={(e) =>
                                setGuests((prev) =>
                                  prev.map((p) =>
                                    p.id === g.id
                                      ? { ...p, name: e.target.value }
                                      : p
                                  )
                                )
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={g.email}
                              onChange={(e) =>
                                setGuests((prev) =>
                                  prev.map((p) =>
                                    p.id === g.id
                                      ? {
                                          ...p,
                                          email: e.target.value,
                                          valid: emailRegex.test(
                                            e.target.value
                                          ),
                                        }
                                      : p
                                  )
                                )
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={g.location || ""}
                              onChange={(e) =>
                                setGuests((prev) =>
                                  prev.map((p) =>
                                    p.id === g.id
                                      ? { ...p, location: e.target.value }
                                      : p
                                  )
                                )
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={g.date || ""}
                              onChange={(e) =>
                                setGuests((prev) =>
                                  prev.map((p) =>
                                    p.id === g.id
                                      ? { ...p, date: e.target.value }
                                      : p
                                  )
                                )
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={g.time || ""}
                              onChange={(e) =>
                                setGuests((prev) =>
                                  prev.map((p) =>
                                    p.id === g.id
                                      ? { ...p, time: e.target.value }
                                      : p
                                  )
                                )
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={g.valid ? "default" : "destructive"}
                            >
                              {g.valid ? "Valide" : "Invalide"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex items-center justify-between">
                  <Button variant="outline" onClick={() => setStep(0)}>
                    ← Retour
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={addGuest}>
                      Ajouter invité
                    </Button>
                    <Button
                      onClick={() => {
                        if (guests.length && !previewGuestId) {
                          setPreviewGuestId(guests[0].id);
                        }
                        setStep(2);
                      }}
                      disabled={!guests.length || !validCount}
                    >
                      Continuer → (Prévisualisation)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Prévisualisation */}
        {step === 2 && (
          <div className="max-w-4xl mx-auto space-y-6 animate-enter">
            <Card>
              <CardHeader>
                <CardTitle>Prévisualisation</CardTitle>
                <CardDescription>
                  Voir l'invitation telle qu'elle arrivera chez l'invité (les
                  variables sont remplacées)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4 gap-4">
                  <div className="flex items-center gap-3">
                    <Label className="text-sm">Aperçu pour :</Label>
                    <Select
                      value={previewGuestId ?? ""}
                      onValueChange={(val) => setPreviewGuestId(val || null)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un invité" />
                      </SelectTrigger>
                      <SelectContent>
                        {guests.map((g) => (
                          <SelectItem key={g.id} value={g.id}>
                            {g.name} — {g.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      ← Retour
                    </Button>
                    <Button onClick={() => setStep(3)}>
                      Continuer → Envoi
                    </Button>
                  </div>
                </div>

                {/* Prepare items with variables replaced */}
                {(() => {
                  const guest =
                    guests.find((g) => g.id === previewGuestId) ?? guests[0];
                  const previewItems = items.map((it) =>
                    it.type === "text"
                      ? ({
                          ...(it as TextItem),
                          text: replaceVariables((it as TextItem).text, guest),
                        } as TextItem)
                      : it
                  );
                  // pass bgImage if present else bgColor
                  const previewBg = bgImage ? `url(${bgImage})` : bgColor;
                  return (
                    <div className="flex justify-center">
                      <div className="w-full max-w-3xl">
                        <EnvelopePreview
                          items={previewItems}
                          bgColor={previewBg}
                          // keep same prop name onClose for compatibility; here we go back to details
                          onClose={() => setStep(1)}
                        />
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Envoi */}
        {step === 3 && (
          <div className="max-w-4xl mx-auto space-y-6 animate-enter">
            <Card>
              <CardHeader>
                <CardTitle>Envoi des invitations</CardTitle>
                <CardDescription>
                  Configurez l'envoi de vos invitations personnalisées
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-base">Mode d'envoi</Label>
                  <RadioGroup
                    value={sendMode}
                    onValueChange={(v: "all" | "personalize") => setSendMode(v)}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="all" />
                      <Label htmlFor="all" className="cursor-pointer">
                        Envoyer à tous
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="personalize" id="personalize" />
                      <Label htmlFor="personalize" className="cursor-pointer">
                        Personnaliser par invité
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {sendMode === "personalize" && (
                  <div className="rounded-lg border p-6">
                    <h4 className="font-semibold mb-4">
                      Messages personnalisés
                    </h4>
                    <div className="grid gap-4">
                      {guests.map((g) => (
                        <div
                          key={g.id}
                          className="grid md:grid-cols-[200px_1fr] items-center gap-4 p-3 rounded-lg border"
                        >
                          <div className="text-sm font-medium">
                            {g.name}{" "}
                            <span className="text-muted-foreground">
                              ({g.email})
                            </span>
                          </div>
                          <Input
                            placeholder="Message personnalisé (optionnel)"
                            value={g.message || ""}
                            onChange={(e) =>
                              setGuests((prev) =>
                                prev.map((p) =>
                                  p.id === g.id
                                    ? { ...p, message: e.target.value }
                                    : p
                                )
                              )
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* NOUVEAU : Section de sauvegarde du modèle */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Save className="h-5 w-5" />
                      Sauvegarder le modèle
                    </CardTitle>
                    <CardDescription>
                      Enregistrez ce design pour le réutiliser plus tard
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/50">
                      <div className="flex-1">
                        <p className="text-sm font-medium mb-1">
                          Sauvegarder ce design comme modèle
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Ce modèle sera disponible dans votre galerie pour de
                          futures invitations
                        </p>
                      </div>
                      <Button
                        onClick={handleSaveAndGoHome}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                      >
                        <Save className="h-4 w-4" />
                        Sauvegarder et aller à l'accueil
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    ← Retour
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      toast("Email de test envoyé", {
                        description: "Vérifiez votre boîte mail.",
                      })
                    }
                  >
                    Envoyer un test
                  </Button>
                  <Button
                    onClick={() => {
                      toast("Invitations envoyées", {
                        description: `${validCount} emails en file d'envoi.`,
                      });
                    }}
                  >
                    Envoyer maintenant
                  </Button>
                </div>

                <Separator />
                <p className="text-sm text-muted-foreground">
                  Astuce: vous pourrez suivre les ouvertures et les réponses
                  (RSVP) depuis le tableau de bord. Nous pouvons brancher votre
                  backend Laravel pour l'envoi et le tracking.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
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
