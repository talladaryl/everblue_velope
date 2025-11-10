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
} from "lucide-react";
import { Template } from "@/types";
import { getTemplates } from "@/utils/storage";

// Designs par défaut - CORRIGÉ (utilisation de 'name' au lieu de 'title')
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

  // Charger les templates sauvegardés (protection contre undefined / formats différents)
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

  const allDesigns = useMemo(() => {
    // ensure customTemplates is always an array
    return [
      ...DEFAULT_DESIGNS,
      ...(Array.isArray(customTemplates) ? customTemplates : []),
    ];
  }, [customTemplates]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    let designs = allDesigns;

    if (activeTab === "custom") {
      designs = Array.isArray(customTemplates) ? customTemplates : [];
    } else if (activeTab === "default") {
      designs = DEFAULT_DESIGNS;
    }

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

  // Squelettes de chargement
  const SkeletonGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <Card
          key={i}
          className="bg-white/80 backdrop-blur-sm border-0 shadow-sm"
        >
          <CardContent className="p-0">
            <Skeleton className="h-48 w-full rounded-t-lg" />
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
      <div className="grid md:grid-cols-[280px_1fr] min-h-screen">
        {/* Sidebar améliorée */}
        <aside className="hidden md:flex md:flex-col md:gap-6 p-6 bg-white/90 backdrop-blur-sm border-r border-gray-200/60 shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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

        {/* Main content amélioré */}
        <main className="p-6">
          <header className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div className="space-y-2">
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                  Galerie de Designs
                </h1>
                <p className="text-muted-foreground text-base lg:text-lg max-w-2xl">
                  Créez des invitations uniques en choisissant parmi nos modèles
                  ou en démarrant de zéro
                </p>
              </div>

              <Button
                onClick={() => navigate("/builder")}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 whitespace-nowrap"
                size="lg"
              >
                <Plus size={20} />
                Nouveau Design
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-blue-100/80">
                      <Star className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.total}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Designs Total
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-green-100/80">
                      <Plus className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.custom}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Personnalisés
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-purple-100/80">
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {stats.default}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Modèles Prêts
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Barre de recherche et filtres */}
            <div className="space-y-4">
              <div className="relative max-w-2xl">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Rechercher un design, événement, thème..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-11 py-3 bg-white/80 backdrop-blur-sm border-0 shadow-sm focus:shadow-md transition-all text-base"
                />
              </div>

              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="bg-white/80 backdrop-blur-sm border-0 p-1.5 gap-1">
                  <TabsTrigger
                    value="all"
                    className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
                  >
                    Tous les designs
                    <Badge
                      variant="secondary"
                      className="ml-1 h-5 px-1.5 text-xs"
                    >
                      {stats.total}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="custom"
                    className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white"
                  >
                    Mes créations
                    <Badge
                      variant="secondary"
                      className="ml-1 h-5 px-1.5 text-xs"
                    >
                      {stats.custom}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="default"
                    className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
                  >
                    Modèles
                    <Badge
                      variant="secondary"
                      className="ml-1 h-5 px-1.5 text-xs"
                    >
                      {stats.default}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </header>

          {/* Grille de designs améliorée */}
          {loading ? (
            <SkeletonGrid />
          ) : (
            <>
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                      <div className="relative h-48 overflow-hidden">
                        {/* Miniature du design */}
                        <div
                          className="w-full h-full flex items-center justify-center p-4 transition-transform duration-500 group-hover:scale-105"
                          style={{
                            background:
                              bg || "linear-gradient(135deg,#f3f4f6,#e6eefc)",
                          }}
                        >
                          {/* Aperçu du contenu */}
                          {items.length > 0 ? (
                            items.slice(0, 2).map((item: any, index: number) =>
                              item?.type === "text" ? (
                                <div
                                  key={item.id ?? index}
                                  className="absolute text-center font-medium drop-shadow-sm"
                                  style={{
                                    left: `${20 + index * 10}%`,
                                    top: `${30 + index * 15}%`,
                                    color: item.color || "#000000",
                                    fontSize: `${Math.max(
                                      14,
                                      (item.fontSize || 24) / 2
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
                              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Palette className="h-6 w-6 text-white/80" />
                              </div>
                              <p className="text-white/90 text-sm font-medium">
                                {design.name}
                              </p>
                            </div>
                          )}

                          {/* Badge personnalisé */}
                          {design.isCustom && (
                            <Badge className="absolute top-3 left-3 bg-green-500 hover:bg-green-600 border-0 shadow-sm">
                              <Sparkles className="h-3 w-3 mr-1" />
                              Personnel
                            </Badge>
                          )}

                          {/* Overlay au hover */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                            <Button
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white/95 text-gray-900 hover:bg-white shadow-lg border-0"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Utiliser
                            </Button>
                          </div>
                        </div>

                        {/* Palette de couleurs */}
                        <div className="absolute top-3 right-3 flex gap-1.5">
                          {palette.slice(0, 3).map((color, index) => (
                            <div
                              key={index}
                              className="w-4 h-4 rounded-full border-2 border-white/80 shadow-sm"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className="text-base font-semibold line-clamp-1 text-gray-900">
                            {design.name || "Sans titre"}
                          </CardTitle>
                        </div>

                        <CardDescription className="text-sm line-clamp-2 mb-3 text-gray-600">
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

                {/* Carte "Créer nouveau" */}
                <Card
                  className="group cursor-pointer bg-gradient-to-br from-blue-50/80 to-purple-50/80 border-2 border-dashed border-blue-300 hover:border-blue-400 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 backdrop-blur-sm"
                  onClick={() => navigate("/builder")}
                >
                  <CardContent className="p-8 flex flex-col items-center justify-center text-center h-64">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Plus className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-gray-900">
                      Nouveau Design
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Créez une invitation unique depuis zéro
                    </p>
                  </CardContent>
                </Card>
              </section>

              {/* Message si aucun résultat */}
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
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg px-8"
                    size="lg"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Créer un Nouveau Design
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
