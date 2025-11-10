import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Save, Download, Eye, Plus, Trash2, Palette, Home } from "lucide-react";
import Papa from "papaparse";
import { nanoid } from "nanoid";
import { cn } from "@/lib/utils";
import EnvelopePreview from "./EnvelopePreview";
import { Template } from "@/types";
import { saveTemplate, generateThumbnail } from "@/utils/storage";

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
}

type EditorItem = TextItem | ImageItem;

interface Guest {
  id: string;
  name: string;
  email: string;
  valid: boolean;
  message?: string;
}
interface Template {
  id: string;
  name: string;
  bgColor: string;
  items: EditorItem[];
  createdAt: Date;
}

type Step = 0 | 1 | 2; // 0: Design, 1: Details, 2: Send

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
  const [step, setStep] = useState<Step>(0);
  const [showPreview, setShowPreview] = useState(false);

  // Canvas state
  const [bgColor, setBgColor] = useState<string>("#F3F4F6");
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

  // Send state
  const [sendMode, setSendMode] = useState<"all" | "personalize">("all");

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
        description: "Impossible de sauvegarder le modèle." 
      });
    }
  };

  const loadTemplate = (template: Template) => {
    setBgColor(template.bgColor);
    setItems(JSON.parse(JSON.stringify(template.items)));
    setSelectedId(template.items[0]?.id || null);
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

  const addImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const item: ImageItem = {
          id: nanoid(),
          type: "image",
          x: 80,
          y: 80,
          src: String(reader.result),
          width: Math.min(260, img.width),
          height: Math.min(180, img.height),
        };
        setItems((prev) => [...prev, item]);
        setSelectedId(item.id);
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeSelected = () => {
    if (!selectedId) return;
    setItems((prev) => prev.filter((i) => i.id !== selectedId));
    setSelectedId(null);
  };

  // Guests import
  const handleCSV = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        const rows = res.data as any[];
        const parsed: Guest[] = rows.map((r) => {
          const name = String(r.name || r.nom || r.Nom || "").trim();
          const email = String(r.email || r.Email || r.mail || "").trim();
          return { id: nanoid(), name, email, valid: emailRegex.test(email) };
        });
        setGuests(parsed);
        setStep(1 as Step);
        toast("Contacts importés", {
          description: `${parsed.length} invités ajoutés.`,
        });
      },
    });
  };

  const validCount = guests.filter((g) => g.valid).length;

  // Render helpers
  const StepNav = () => (
    <div className="flex items-center gap-4">
      {[0, 1, 2].map((i) => (
        <button
          key={i}
          onClick={() => setStep(i as Step)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200",
            step === i
              ? "bg-primary text-primary-foreground shadow-md border-primary"
              : "bg-card hover:bg-accent hover:shadow-sm border-border"
          )}
        >
          <span
            className={cn(
              "inline-flex h-6 w-6 items-center justify-center rounded-full border text-sm font-medium",
              step === i ? "border-primary-foreground" : "border-border"
            )}
          >
            {i + 1}
          </span>
          {i === 0 && "Design"}
          {i === 1 && "Détails"}
          {i === 2 && "Envoi"}
        </button>
      ))}
    </div>
  );

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
        {/* Step 1: Design */}
        {step === 0 && (
          <div className="grid lg:grid-cols-[1fr_400px] gap-8 animate-enter">
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
                        onChange={(e) => setBgColor(e.target.value)}
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
                    <label className="inline-flex items-center">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          e.target.files && addImage(e.target.files[0])
                        }
                      />
                      <span className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-md border hover:bg-accent transition-colors">
                        <Plus className="h-4 w-4" />
                        Image
                      </span>
                    </label>
                    <Button
                      variant="outline"
                      onClick={() => setShowPreview(true)}
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
                    className="relative w-full max-w-3xl aspect-[16/9] rounded-xl border-2 border-dashed border-border bg-muted shadow-lg overflow-hidden"
                    style={{ background: bgColor }}
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
                            className="outline-none min-w-[80px]"
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
                    <Button onClick={handleSaveTemplate} className="flex items-center gap-2">
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
              <Card className="sticky top-6">
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
            </div>
          </div>
        )}

        {/* Steps 2 and 3 remain similar but with improved styling */}
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
                    <Button
                      variant="outline"
                      onClick={() =>
                        setGuests((g) => [
                          ...g,
                          {
                            id: nanoid(),
                            name: "Invité",
                            email: "email@example.com",
                            valid: true,
                          },
                        ])
                      }
                    >
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
                  <Button
                    onClick={() => setStep(2)}
                    disabled={!guests.length || !validCount}
                  >
                    Continuer →
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 2 && (
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
                          Ce modèle sera disponible dans votre galerie pour de futures invitations
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
                  <Button variant="outline" onClick={() => setStep(1)}>
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
                      // Optionnel: rediriger après envoi
                      // setTimeout(() => navigate("/"), 2000);
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

      {/* Preview Modal */}
      {showPreview && (
        <EnvelopePreview
          items={items}
          bgColor={bgColor}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
}