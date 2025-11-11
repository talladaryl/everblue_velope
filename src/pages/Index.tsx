import React from "react";
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Home,
  Plus,
  Mail,
  HelpCircle,
  Inbox,
  Smartphone,
  LogOut,
  Search,
  Star,
  Calendar,
  Users,
  Palette,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Template } from "@/types";
import { getTemplates, removeTemplate } from "@/utils/storage";

/* --- Small UI charts (inline, lightweight) --- */
const generateSparkData = (seed: number, points = 7) => {
  // deterministic-ish pseudo data from seed
  const out: number[] = [];
  let v = (seed % 10) + 3;
  for (let i = 0; i < points; i++) {
    v = Math.max(1, Math.round(v + Math.sin((seed + i) * 0.7) * 2));
    out.push(v);
  }
  return out;
};

const Sparkline: React.FC<{
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}> = ({ data, color = "#2563eb", width = 120, height = 28 }) => {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const len = data.length;
  const stepX = width / Math.max(1, len - 1);
  const points = data
    .map((d, i) => {
      const x = i * stepX;
      const y =
        max === min ? height / 2 : height - ((d - min) / (max - min)) * height;
      return `${x},${y}`;
    })
    .join(" ");
  const polylinePoints = points;
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="block"
    >
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={polylinePoints}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const MiniBars: React.FC<{ data: number[]; color?: string }> = ({
  data,
  color = "#059669",
}) => {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1 h-8">
      {data.map((d, i) => (
        <div
          key={i}
          style={{ height: `${(d / max) * 100}%` }}
          className="w-1.5 bg-[rgba(0,0,0,0.08)] rounded-sm"
        />
      ))}
      <style>{`.w-1.5 { width: 6px } .w-1.5 { background: ${color} }`}</style>
    </div>
  );
};

/* Designs par défaut */
const DEFAULT_DESIGNS: Template[] = [
  {
    id: "1",
    name: "Dazzling Dress Invitation",
    description: "Invitation élégante pour quinceañera avec robe scintillante.",
    palette: ["#2C2C54", "#EA2027", "#FDA7DC"],
    bgColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    items: [],
    createdAt: new Date(),
    isCustom: false,
  },
  {
    id: "2",
    name: "Golden Wedding",
    description: "Modèle élégant doré pour mariages classieux.",
    palette: ["#FFD700", "#FFE55C", "#FFF9C4"],
    bgColor: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
    items: [],
    createdAt: new Date(),
    isCustom: false,
  },
  {
    id: "3",
    name: "Design Tropical",
    description: "Modèle élégant avec des feuilles tropicales.",
    palette: ["#00B894", "#00cec9", "#ffeaa7"],
    bgColor: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    items: [],
    createdAt: new Date(),
    isCustom: false,
  },
  {
    id: "4",
    name: "Fête d'été",
    description: "Invitation vibrante pour une fête d'été.",
    palette: ["#FDCB6E", "#EE5A24", "#2C3A47"],
    bgColor: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    items: [],
    createdAt: new Date(),
    isCustom: false,
  },
  {
    id: "5",
    name: "Design Classique",
    description: "Invitation sobre et élégante pour tout événement.",
    palette: ["#2C2C54", "#636E72", "#2D3436"],
    bgColor: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    items: [],
    createdAt: new Date(),
    isCustom: false,
  },
  {
    id: "6",
    name: "Jungle Urbaine",
    description: "Thème moderne avec motifs de plantes et d'animaux.",
    palette: ["#00B894", "#60A3BC", "#A29BFE"],
    bgColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    items: [],
    createdAt: new Date(),
    isCustom: false,
  },
];

const Index = () => {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [customTemplates, setCustomTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setLoading(true);
        const maybe = await Promise.resolve(getTemplates());
        const saved = Array.isArray(maybe) ? (maybe as Template[]) : [];
        setCustomTemplates(saved);
      } catch (error) {
        console.error("Erreur chargement templates:", error);
        setCustomTemplates([]);
      } finally {
        setLoading(false);
      }
    };
    loadTemplates();
  }, []);

  const handleDeleteTemplate = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Supprimer ce modèle ?")) return;
    try {
      await Promise.resolve(removeTemplate?.(id));
    } catch (err) {
      console.error("Erreur suppression template:", err);
    }
    setCustomTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  const allDesigns = useMemo(() => {
    return [
      ...DEFAULT_DESIGNS,
      ...(Array.isArray(customTemplates) ? customTemplates : []),
    ];
  }, [customTemplates]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    let designs = allDesigns;
    if (activeTab === "custom")
      designs = Array.isArray(customTemplates) ? customTemplates : [];
    else if (activeTab === "default") designs = DEFAULT_DESIGNS;
    return designs.filter((d) => {
      const name = (d.name || "").toString().toLowerCase();
      const desc = (d.description || "").toString().toLowerCase();
      return name.includes(q) || desc.includes(q);
    });
  }, [query, activeTab, allDesigns, customTemplates]);

  const stats = useMemo(
    () => ({
      total: allDesigns.length,
      custom: Array.isArray(customTemplates) ? customTemplates.length : 0,
      default: DEFAULT_DESIGNS.length,
    }),
    [allDesigns.length, customTemplates]
  );

  const SkeletonGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <Card
          key={i}
          className="bg-white/80 backdrop-blur-sm border-0 shadow-sm"
        >
          <CardContent className="p-0">
            <Skeleton className="h-32 sm:h-40 w-full rounded-t-lg" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
              <div className="flex justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const formatDate = (d: any) => {
    try {
      const date = d ? new Date(d) : new Date();
      return date.toLocaleDateString("fr-FR");
    } catch {
      return new Date().toLocaleDateString("fr-FR");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="grid md:grid-cols-[260px_1fr] min-h-screen gap-6">
        {/* Sidebar visible on md+, kept hidden on small screens for simplicity */}
        <aside className="hidden md:flex md:flex-col md:gap-6 p-4 md:p-6 bg-white/90 backdrop-blur-sm border-r border-gray-200/60 shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Everblue
                </div>
                <p className="text-xs text-muted-foreground">
                  Créateur d'invitations
                </p>
              </div>
            </div>
          </div>

          <nav className="space-y-2 flex-1">
            <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-sm transition-all w-full text-left">
              <Home size={18} />
              <span>Mes invitations</span>
              <Badge
                variant="secondary"
                className="ml-auto bg-white/20 text-white"
              >
                {stats.total}
              </Badge>
            </button>
            <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-accent hover:text-accent-foreground transition-all w-full text-left">
              <Palette size={18} />
              <span>Mes designs</span>
            </button>
            <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-accent hover:text-accent-foreground transition-all w-full text-left">
              <Mail size={18} />
              <span>Mes messages</span>
              <Badge variant="destructive" className="ml-auto">
                4
              </Badge>
            </button>
            <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-accent hover:text-accent-foreground transition-all w-full text-left">
              <Calendar size={18} />
              <span>Événements</span>
            </button>
            <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-accent hover:text-accent-foreground transition-all w-full text-left">
              <Users size={18} />
              <span>Invitations reçues</span>
            </button>
          </nav>

          <nav className="space-y-2">
            <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-accent hover:text-accent-foreground transition-all w-full text-left">
              <HelpCircle size={18} />
              <span>Centre d'aide</span>
            </button>
            <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-accent hover:text-accent-foreground transition-all w-full text-left">
              <Smartphone size={18} />
              <span>Application mobile</span>
            </button>
          </nav>

          <div className="mt-auto">
            <Separator className="my-4" />
            <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-accent hover:text-accent-foreground transition-all w-full text-left text-red-600 hover:text-red-700">
              <LogOut size={18} />
              <span>Déconnexion</span>
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="p-4 md:p-6">
          <header className="mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                  Galerie de Designs
                </h1>
                <p className="text-muted-foreground text-sm md:text-base max-w-2xl">
                  Créez des invitations uniques en choisissant parmi nos modèles
                  ou en démarrant de zéro
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden sm:block max-w-xs">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Rechercher un design, événement, thème..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="pl-10 py-2 bg-white/80 backdrop-blur-sm border-0 shadow-sm focus:shadow-md transition-all text-sm"
                    />
                  </div>
                </div>

                <Button
                  onClick={() => navigate("/builder")}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg transition-all duration-300 whitespace-nowrap text-sm"
                  size="sm"
                >
                  <Plus size={16} />
                  Nouveau Design
                </Button>
              </div>
            </div>

            {/* Stats with small graphs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xl font-bold text-gray-900">
                        {stats.total}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Designs Total
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <Sparkline
                        data={generateSparkData(stats.total)}
                        color="#1d4ed8"
                        width={120}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        7 jours
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xl font-bold text-gray-900">
                        {stats.custom}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Personnalisés
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <MiniBars
                        data={generateSparkData(stats.custom)}
                        color="#059669"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        activité
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xl font-bold text-gray-900">
                        {stats.default}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Modèles Prêts
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <Sparkline
                        data={generateSparkData(stats.default)}
                        color="#7c3aed"
                        width={120}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        trend
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </header>

          {/* Grid of designs */}
          {loading ? (
            <SkeletonGrid />
          ) : (
            <div>
              <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filtered.map((design) => {
                  const bg =
                    typeof design.bgColor === "string"
                      ? design.bgColor
                      : undefined;
                  const palette = Array.isArray(design.palette)
                    ? design.palette
                    : [];
                  const items = Array.isArray(design.items) ? design.items : [];
                  return (
                    <Card
                      key={design.id}
                      className="group cursor-pointer bg-white/90 backdrop-blur-sm border-0 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                      onClick={() => navigate(`/builder?template=${design.id}`)}
                    >
                      <div className="relative h-40 sm:h-48 overflow-hidden">
                        <div
                          className="w-full h-full flex items-center justify-center p-4 transition-transform duration-500 group-hover:scale-105"
                          style={{
                            background:
                              bg || "linear-gradient(135deg,#f3f4f6,#e6eefc)",
                          }}
                        >
                          {items.length > 0 ? (
                            items.slice(0, 2).map((item: any, index: number) =>
                              item?.type === "text" ? (
                                <div
                                  key={item.id ?? index}
                                  className="absolute text-center font-medium drop-shadow-sm"
                                  style={{
                                    left: `${18 + index * 10}%`,
                                    top: `${28 + index * 15}%`,
                                    color: item.color || "#000000",
                                    fontSize: `${Math.max(
                                      12,
                                      (item.fontSize || 20) / 2
                                    )}px`,
                                    fontWeight: item.fontWeight || 600,
                                    fontFamily: item.fontFamily || "system-ui",
                                    textAlign: item.textAlign as any,
                                    maxWidth: "70%",
                                  }}
                                >
                                  {item.text}
                                </div>
                              ) : null
                            )
                          ) : (
                            <div className="text-center">
                              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Palette className="h-5 w-5 text-white/80" />
                              </div>
                              <p className="text-white/90 text-sm font-medium">
                                {design.name}
                              </p>
                            </div>
                          )}

                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/16 transition-all duration-300 flex items-center justify-center">
                            <Button
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white/95 text-gray-900 hover:bg-white shadow-lg border-0 text-sm"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Utiliser
                            </Button>
                          </div>
                        </div>

                        {/* Palette */}
                        <div className="absolute top-3 right-3 flex gap-1.5">
                          {palette.slice(0, 3).map((color, index) => (
                            <div
                              key={index}
                              className="w-3 h-3 rounded-full border-2 border-white/80 shadow-sm"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>

                        {/* Delete button */}
                        <button
                          onClick={(e) => handleDeleteTemplate(e, design.id)}
                          className="absolute top-3 left-3 bg-white/90 rounded-full p-1 shadow-sm hover:bg-red-50 z-20"
                          title="Supprimer le modèle"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      </div>

                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className="text-sm md:text-base font-semibold line-clamp-1 text-gray-900">
                            {design.name || "Sans titre"}
                          </CardTitle>
                        </div>

                        <CardDescription className="text-xs md:text-sm line-clamp-2 mb-3 text-gray-600">
                          {design.description || ""}
                        </CardDescription>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(design.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Palette className="h-3 w-3" />
                            {items.length || 0} éléments
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {/* New card */}
                <Card
                  className="group cursor-pointer bg-gradient-to-br from-blue-50/80 to-purple-50/80 border-2 border-dashed border-blue-300 hover:border-blue-400 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 backdrop-blur-sm"
                  onClick={() => navigate("/builder")}
                >
                  <CardContent className="p-6 flex flex-col items-center justify-center text-center h-48">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Plus className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="font-semibold text-base mb-1 text-gray-900">
                      Nouveau Design
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Créez une invitation unique depuis zéro
                    </p>
                  </CardContent>
                </Card>
              </section>

              {filtered.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center mx-auto mb-4">
                    <Search className="h-10 w-10 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Aucun design trouvé
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Aucun design ne correspond à votre recherche. Essayez de
                    modifier vos critères ou créez un nouveau design
                    personnalisé.
                  </p>
                  <Button
                    onClick={() => navigate("/builder")}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg px-6"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Créer un Nouveau Design
                  </Button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
