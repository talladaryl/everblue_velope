// Nouveau fichier: HomePage.tsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Plus,
  Palette,
  Calendar,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Edit,
  Heart,
  Star,
  Zap,
  Eye,
  Tag,
  Layers,
  Sparkles,
} from "lucide-react";
import { Template } from "@/types";
import { getTemplates, removeTemplate } from "@/utils/storage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import gsap from "gsap";
import { Badge } from "@/components/ui/badge";

// Catégories de designs
const DESIGN_CATEGORIES = [
  { id: "all", name: "Tous les designs", icon: Palette, count: 0 },
  { id: "simple", name: "Simple & Basique", icon: Star, count: 3 },
  { id: "birthday", name: "Anniversaire", icon: Zap, count: 1 },
  { id: "love", name: "Amour & Romance", icon: Heart, count: 3 },
  { id: "elegant", name: "Élégant", icon: Sparkles, count: 1 },
  { id: "modern", name: "Moderne", icon: Layers, count: 1 },
];

// Designs par défaut organisés par catégorie
const DEFAULT_DESIGNS_BY_CATEGORY = {
  simple: [
    {
      id: "simple-1",
      name: "Design Épuré",
      description: "Design minimaliste et élégant pour toutes occasions",
      category: "simple",
      colors: ["#283c2b", "#26452b", "#162819", "#0c170e"],
      preview: "simple",
      bgColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      items: [],
      createdAt: new Date(),
      isCustom: false,
      popularity: 95,
    },
    {
      id: "simple-2",
      name: "Carte Basique",
      description: "Design classique et intemporel",
      category: "simple",
      colors: ["#ffd6ea", "#ff9eb5", "#d87a8d", "#ffffff"],
      preview: "basic",
      bgColor: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
      items: [],
      createdAt: new Date(),
      isCustom: false,
      popularity: 88,
    },
    {
      id: "simple-3",
      name: "Simple Hover",
      description: "Animation au survol élégante",
      category: "simple",
      colors: ["#ffcea1", "#facba0", "#ffb169", "#ffffff"],
      preview: "simple-hover",
      bgColor: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      items: [],
      createdAt: new Date(),
      isCustom: false,
      popularity: 85,
    },
  ],
  birthday: [
    {
      id: "birthday-1",
      name: "Anniversaire Joyeux",
      description: "Carte festive pour célébrer un anniversaire",
      category: "birthday",
      colors: ["#ae4243", "#ff6b6b", "#ee5253", "#feca57"],
      preview: "birthday",
      bgColor: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      items: [],
      createdAt: new Date(),
      isCustom: false,
      popularity: 92,
    },
  ],
  love: [
    {
      id: "love-1",
      name: "Carte d'Amour",
      description: "Carte romantique pour déclarer votre flamme",
      category: "love",
      colors: ["#0077B2", "#D00000", "#ffffff", "#f8f6f7"],
      preview: "love",
      bgColor: "linear-gradient(135deg, #ff6b6b 0%, #f06292 100%)",
      items: [],
      createdAt: new Date(),
      isCustom: false,
      popularity: 96,
    },
    {
      id: "valentine-1",
      name: "Saint-Valentin",
      description: "Carte spéciale pour la fête des amoureux",
      category: "love",
      colors: ["#ff4d4d", "#ff8080", "#ff6666", "#ffffff"],
      preview: "valentine",
      bgColor: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      items: [],
      createdAt: new Date(),
      isCustom: false,
      popularity: 94,
    },
    {
      id: "heart-1",
      name: "Carte Cœur",
      description: "Design en forme de cœur animé",
      category: "love",
      colors: ["#ff5c8d", "#e26698", "#fdcedf", "#ffffff"],
      preview: "heart",
      bgColor: "linear-gradient(135deg, #ff6b6b 0%, #f06292 100%)",
      items: [],
      createdAt: new Date(),
      isCustom: false,
      popularity: 97,
    },
  ],
  elegant: [
    {
      id: "elegant-1",
      name: "Design Luxueux",
      description: "Carte raffinée pour les occasions spéciales",
      category: "elegant",
      colors: ["#ba9872", "#967b5c", "#a38564", "#f9f9f9"],
      preview: "extravagant",
      bgColor: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      items: [],
      createdAt: new Date(),
      isCustom: false,
      popularity: 90,
    },
  ],
  modern: [
    {
      id: "modern-1",
      name: "Design Moderne",
      description: "Style contemporain et dynamique",
      category: "modern",
      colors: ["#1b2049", "#c7c2c5", "#ffffff", "#23a0d9"],
      preview: "fly",
      bgColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      items: [],
      createdAt: new Date(),
      isCustom: false,
      popularity: 89,
    },
  ],
};

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [customTemplates, setCustomTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDesign, setSelectedDesign] = useState<Template | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cardColors, setCardColors] = useState<Record<string, string>>({});
  const [previewRef, setPreviewRef] = useState<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const previewTl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setLoading(true);
        const maybe = await getTemplates();
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

  // Combiner tous les designs
  const allDesigns = React.useMemo(() => {
    const defaultDesigns = Object.values(DEFAULT_DESIGNS_BY_CATEGORY).flat();
    return [...defaultDesigns, ...customTemplates];
  }, [customTemplates]);

  // Mettre à jour les comptes de catégories
  const categoriesWithCount = DESIGN_CATEGORIES.map((category) => {
    if (category.id === "all") {
      return { ...category, count: allDesigns.length };
    }
    const count = allDesigns.filter((d) => d.category === category.id).length;
    return { ...category, count };
  });

  // Filtrer les designs
  const filteredDesigns = React.useMemo(() => {
    const q = query.toLowerCase();
    let designs = allDesigns;

    if (activeCategory !== "all") {
      designs = designs.filter((d) => d.category === activeCategory);
    }

    return designs.filter((d) => {
      const name = (d.name || "").toString().toLowerCase();
      const desc = (d.description || "").toString().toLowerCase();
      return name.includes(q) || desc.includes(q);
    });
  }, [query, activeCategory, allDesigns]);

  const formatDate = (d?: string | Date) => {
    if (!d) return "";
    const date = d instanceof Date ? d : new Date(d);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("fr-FR");
  };

  const handleDeleteTemplate = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Supprimer ce modèle ?")) return;
    try {
      await removeTemplate?.(id);
      setCustomTemplates((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Erreur suppression template:", err);
    }
  };

  const openDesignModal = (design: Template) => {
    setSelectedDesign(design);
    setSelectedColor(design.colors?.[0] || cardColors[design.id] || "#000000");
    setCurrentSlide(allDesigns.findIndex((d) => d.id === design.id));
  };

  const closeDesignModal = () => {
    setSelectedDesign(null);
    setSelectedColor("");
  };

  const navigateSlide = (direction: "prev" | "next") => {
    const total = allDesigns.length;
    if (total === 0) return;
    const newIndex =
      direction === "prev"
        ? (currentSlide - 1 + total) % total
        : (currentSlide + 1) % total;
    setCurrentSlide(newIndex);
    const newDesign = allDesigns[newIndex];
    if (newDesign) {
      setSelectedDesign(newDesign);
      setSelectedColor(
        newDesign.colors?.[0] || cardColors[newDesign.id] || "#000000"
      );
    }
  };

  useEffect(() => {
    if (!selectedDesign) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        navigateSlide("prev");
      } else if (e.key === "ArrowRight") {
        navigateSlide("next");
      } else if (e.key === "Escape") {
        closeDesignModal();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedDesign, currentSlide, allDesigns]);

  // Animation de prévisualisation
  const playPreview = (design?: Template | null) => {
    if (!design) return;
    const container = previewRef;
    if (!container) return;

    if (previewTl.current) {
      previewTl.current.kill();
      previewTl.current = null;
    }

    const tl = gsap.timeline();
    previewTl.current = tl;

    // Animation selon le type de modèle
    switch (design.preview) {
      case "simple":
        const letter = container.querySelector(".letter");
        if (letter) {
          tl.to(letter, {
            y: -100,
            opacity: 1,
            duration: 1,
            ease: "back.out(1.2)",
          }).to(letter, { y: -80, duration: 0.5, ease: "power2.out" });
        }
        break;
      case "birthday":
        const flap = container.querySelector(".envelope_top");
        const paper = container.querySelector(".paper");
        if (flap)
          tl.to(flap, { rotationX: -180, duration: 0.8, ease: "power2.out" });
        if (paper)
          tl.to(
            paper,
            { y: -60, duration: 0.6, ease: "back.out(1.2)" },
            "-=0.4"
          );
        break;
      case "love":
        const loveFlap = container.querySelector(".flap");
        const loveLetter = container.querySelector(".letter");
        if (loveFlap)
          tl.to(loveFlap, {
            rotationX: 180,
            duration: 0.7,
            ease: "power2.out",
          });
        if (loveLetter)
          tl.to(
            loveLetter,
            { y: -80, duration: 0.5, ease: "back.out(1.2)" },
            "-=0.3"
          );
        break;
      default:
        const envelope = container.querySelector(
          ".envelope, .envlope-wrapper, .container-valentine"
        );
        if (envelope) {
          tl.to(envelope, {
            scale: 1.05,
            duration: 0.3,
            ease: "power2.out",
          }).to(envelope, { scale: 1, duration: 0.3, ease: "power2.in" });
        }
    }

    // Auto-reverse
    tl.to({}, { duration: 2 }).then(() => {
      if (previewTl.current) {
        previewTl.current.reverse();
        previewTl.current = null;
      }
    });
  };

  useEffect(() => {
    if (!selectedDesign && previewTl.current) {
      previewTl.current.kill();
      previewTl.current = null;
    }
  }, [selectedDesign]);

  const SkeletonGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <Card
          key={i}
          className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <CardContent className="p-0 overflow-hidden">
            <Skeleton className="h-48 w-full rounded-t-lg" />
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="flex justify-between items-center pt-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Composant DesignPreview avec animations automatiques
  const DesignPreview = React.memo(
    ({
      design,
      colorOverride,
      isModal = false,
    }: {
      design?: Template | null;
      colorOverride?: string;
      isModal?: boolean;
    }) => {
      const containerRef = useRef<HTMLDivElement>(null);

      useEffect(() => {
        if (!design || !containerRef.current) return;

        // Animation automatique pour l'aperçu
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });

        switch (design.preview) {
          case "simple":
            const letter = containerRef.current.querySelector(".letter");
            if (letter) {
              tl.to(letter, {
                y: -60,
                opacity: 1,
                duration: 1.5,
                ease: "back.out(1.2)",
              })
                .to(letter, { y: -40, duration: 1, ease: "power2.out" })
                .to(letter, { y: -60, duration: 1, ease: "power2.in" });
            }
            break;
          case "birthday":
            const flap = containerRef.current.querySelector(".envelope_top");
            const paper = containerRef.current.querySelector(".paper");
            if (flap && paper) {
              tl.to(flap, { rotationX: -180, duration: 1, ease: "power2.out" })
                .to(
                  paper,
                  { y: -40, duration: 0.8, ease: "back.out(1.2)" },
                  "-=0.6"
                )
                .to(paper, { y: 0, duration: 0.8, ease: "power2.in" })
                .to(
                  flap,
                  { rotationX: 0, duration: 1, ease: "power2.out" },
                  "-=0.8"
                );
            }
            break;
          case "simple-hover":
            const hoverLetter = containerRef.current.querySelector(".letter");
            if (hoverLetter) {
              tl.to(hoverLetter, {
                y: -50,
                duration: 1.5,
                ease: "back.out(1.2)",
              }).to(hoverLetter, { y: 0, duration: 1.5, ease: "power2.in" });
            }
            break;
          default:
            // Animation de pulsation par défaut
            const element = containerRef.current.querySelector(
              ".envelope, .envlope-wrapper, .container-valentine"
            );
            if (element) {
              tl.to(element, {
                scale: 1.05,
                duration: 1,
                ease: "power2.out",
              }).to(element, { scale: 1, duration: 1, ease: "power2.in" });
            }
        }

        return () => {
          tl.kill();
        };
      }, [design]);

      if (!design) {
        return (
          <div className="w-full h-32 sm:h-40 flex items-center justify-center text-sm text-muted-foreground bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg">
            Aperçu indisponible
          </div>
        );
      }

      const bgStyle: React.CSSProperties = design.bgColor
        ? { background: design.bgColor }
        : colorOverride
        ? { background: colorOverride }
        : { background: "linear-gradient(135deg, #e2e8f0 0%, #c7d2fe 100%)" };

      const wrapperStyle: React.CSSProperties = isModal
        ? {
            width: "100%",
            height: 400,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }
        : { width: "100%", height: 200 };

      const getPreviewComponent = () => {
        switch (design.preview) {
          case "simple":
            return <Model1 />;
          case "birthday":
            return <Model2 />;
          case "simple-hover":
            return <Model3 />;
          case "love":
            return <Model4 />;
          case "valentine":
            return <Model5 />;
          case "heart":
            return <Model11 />;
          case "extravagant":
            return <Model7 />;
          case "basic":
            return <Model8 />;
          case "fly":
            return <Model9 />;
          default:
            return <Model1 />;
        }
      };

      return (
        <div
          ref={containerRef}
          className="rounded-lg overflow-hidden shadow-inner"
          style={{ ...bgStyle, ...wrapperStyle }}
        >
          <div className="w-full h-full flex items-center justify-center p-4">
            {getPreviewComponent()}
          </div>
        </div>
      );
    }
  );

  // Modèles avec les designs exacts que vous avez fournis
  const Model1 = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
      <div className="model1-container">
        <div className="model1-content">
          <div
            className={`model1-envelope ${isOpen ? "opened" : ""}`}
            onClick={() => setIsOpen(true)}
          />
          <div className={`model1-letter ${isOpen ? "visible" : ""}`}>
            <div className="model1-body">
              <span
                className="model1-close"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
              >
                ×
              </span>
              <div className="model1-message">fin.</div>
            </div>
          </div>
          <div className="model1-shadow" />
        </div>
      </div>
    );
  };

  const Model2 = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
      <div className="model2-envelope" onClick={() => setIsOpen(!isOpen)}>
        <div
          className={`model2-envelope_top ${
            isOpen ? "model2-envelope_top_close" : ""
          }`}
        />
        <div className="model2-envelope_body">
          <div className={`model2-paper ${isOpen ? "model2-paper_close" : ""}`}>
            <span>Happy Birthday!</span>
          </div>
          <div className="model2-envelope_body_front" />
          <div className="model2-envelope_body_left" />
          <div className="model2-envelope_body_right" />
        </div>
      </div>
    );
  };

  const Model3 = () => {
    const [isHover, setIsHover] = React.useState(false);

    return (
      <div
        className="model3-envelope"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <div className="model3-back" />
        <div className={`model3-letter ${isHover ? "model3-lift" : ""}`}>
          <div className="model3-text">Remember To Change The World!</div>
        </div>
        <div className="model3-front" />
        <div className="model3-top" />
        <div className="model3-shadow" />
      </div>
    );
  };

  const Model4 = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
      <div className={`model4-envlope-wrapper ${isOpen ? "open" : "close"}`}>
        <div
          className={`model4-envelope ${isOpen ? "open" : "close"}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="model4-front model4-flap" />
          <div className="model4-front model4-pocket" />
          <div className="model4-letter">
            <div className="model4-words model4-line1" />
            <div className="model4-words model4-line2" />
            <div className="model4-words model4-line3" />
            <div className="model4-words model4-line4" />
          </div>
          <div className="model4-hearts">
            <div className="model4-heart model4-a1" />
            <div className="model4-heart model4-a2" />
            <div className="model4-heart model4-a3" />
          </div>
        </div>
      </div>
    );
  };

  const Model5 = () => {
    const [isActive, setIsActive] = React.useState(false);

    return (
      <div className="model5-container-valentine">
        <div
          className={`model5-envelope ${isActive ? "active" : ""}`}
          onClick={() => setIsActive(!isActive)}
        >
          <div className="model5-envelope-back" />
          <div className="model5-envelope-inner" />
          <div className="model5-letter">
            {isActive && (
              <div className="model5-letter-content">Your message</div>
            )}
          </div>
          <div className="model5-envelope-front" />
          <div className="model5-envelope-flap" />
        </div>
      </div>
    );
  };

  const Model7 = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
      <div className="model7-envelop" onClick={() => setIsOpen(!isOpen)}>
        <div className="model7-envelop__front-paper" />
        <div className="model7-envelop__back-paper" />
        <div className="model7-envelop__up-paper" />
        <div className="model7-envelop__sticker" />
        <div className="model7-envelop__false-sticker" />
        <div className="model7-envelop__content">
          <div className="model7-love-notes">
            <div className="model7-note">
              <div className="model7-note__text">
                <p>Hola amor...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const Model8 = () => {
    const [isOpened, setIsOpened] = React.useState(false);

    return (
      <div className="model8-page1" onClick={() => setIsOpened(true)}>
        <div className={`model8-envelope-wrapper ${isOpened ? "open" : ""}`}>
          <div className={`model8-envelope ${isOpened ? "open" : ""}`}>
            <div className="model8-flap" />
            <div className="model8-stripe" />
          </div>
          <div className={`model8-letter ${isOpened ? "popped" : ""}`}>
            Hey Lorraine... <button className="model8-next-btn">Next</button>
          </div>
        </div>
      </div>
    );
  };

  const Model9 = () => (
    <div className="model9-envelope_form_wrap">
      <div className="model9-env_wrap">
        <div className="model9-env_form_wrap">
          <h3>Drop in your email</h3>
        </div>
        <div className="model9-env_top" />
        <div className="model9-env_bottom_wrap">
          <div className="model9-env_bottom" />
        </div>
      </div>
    </div>
  );

  const Model11 = () => {
    const [isChecked, setIsChecked] = React.useState(false);

    return (
      <div className="model11-letter_ct">
        <input
          type="checkbox"
          id="model11-check"
          checked={isChecked}
          onChange={(e) => setIsChecked(e.target.checked)}
          className="model11-check"
        />
        <label htmlFor="model11-check" className="model11-label">
          <span className="model11-letter model11-main"></span>
          <div className="model11-note">
            <p className="model11-int">Dear [NAME],</p>
            <p>
              [MESSAGE]
              <br />
              [MESSAGE]
            </p>
            <p className="model11-sign">
              [greeting],
              <br />
              [OWN NAME]
            </p>
          </div>
          <span className="model11-front"></span>
          <span className="model11-letter model11-flap-bg"></span>
          <span className="model11-letter model11-flap"></span>
          <span className="model11-heart"></span>
        </label>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <header className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Galerie de Designs
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl max-w-2xl">
                Découvrez nos modèles d'invitations et créez des cartes uniques
                et mémorables
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:block max-w-md flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Rechercher un design..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="pl-10 py-3 bg-white/90 backdrop-blur-sm border-0 shadow-lg focus:shadow-xl transition-all rounded-2xl"
                  />
                </div>
              </div>

              <Button
                onClick={() => navigate("/builder")}
                className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all duration-300 whitespace-nowrap rounded-2xl text-base font-semibold"
              >
                <Plus size={20} />
                Nouveau Design
              </Button>
            </div>
          </div>

          {/* Catégories avec compteurs */}
          <div className="flex flex-wrap gap-3 mb-8">
            {categoriesWithCount.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={
                    activeCategory === category.id ? "default" : "outline"
                  }
                  onClick={() => setActiveCategory(category.id)}
                  className="flex items-center gap-3 rounded-xl px-4 py-2.5 transition-all duration-300 hover:scale-105"
                >
                  <Icon className="h-4 w-4" />
                  {category.name}
                  <Badge
                    variant="secondary"
                    className="ml-1 bg-white/50 text-xs"
                  >
                    {category.count}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <SkeletonGrid />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredDesigns.map((design) => {
                const overrideColor = cardColors[design.id];
                return (
                  <Card
                    key={design.id}
                    className="group cursor-pointer bg-white/95 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 overflow-hidden"
                    onClick={() => openDesignModal(design)}
                  >
                    <CardContent className="p-0">
                      {/* Badge de popularité */}
                      <div className="absolute top-3 right-3 z-10">
                        <Badge
                          variant="secondary"
                          className="bg-white/90 backdrop-blur-sm text-xs font-semibold"
                        >
                          {design.popularity}%
                        </Badge>
                      </div>

                      {/* Aperçu du design */}
                      <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50">
                        <DesignPreview
                          design={design}
                          colorOverride={overrideColor || undefined}
                        />
                      </div>

                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <CardTitle className="text-lg font-bold line-clamp-1 text-gray-900">
                            {design.name}
                          </CardTitle>
                        </div>

                        <CardDescription className="text-sm line-clamp-2 mb-4 text-gray-600 leading-relaxed">
                          {design.description}
                        </CardDescription>

                        {/* Palette de couleurs */}
                        <div className="flex gap-2 mb-4">
                          {design.colors?.slice(0, 4).map((color, index) => (
                            <button
                              key={index}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCardColors((prev) => ({
                                  ...prev,
                                  [design.id]: color,
                                }));
                              }}
                              className={`w-7 h-7 rounded-full border-2 transition-all hover:scale-110 ${
                                (cardColors[design.id] ||
                                  design.colors?.[0]) === color
                                  ? "border-blue-500 scale-110 ring-2 ring-blue-200"
                                  : "border-white shadow-md"
                              }`}
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(design.createdAt)}</span>
                          </div>
                          {design.isCustom ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) =>
                                handleDeleteTemplate(e, design.id)
                              }
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              <Sparkles className="h-3 w-3 mr-1" />
                              Modèle
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {/* Carte pour nouveau design */}
              <Card
                className="group cursor-pointer bg-gradient-to-br from-blue-50/90 to-purple-50/90 border-2 border-dashed border-blue-400 hover:border-blue-500 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 backdrop-blur-sm"
                onClick={() => navigate("/builder")}
              >
                <CardContent className="p-8 flex flex-col items-center justify-center text-center h-64">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                    <Plus className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-gray-900">
                    Nouveau Design
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Créez une invitation unique depuis zéro avec notre éditeur
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {filteredDesigns.length === 0 && !loading && (
            <div className="text-center py-20">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center mx-auto mb-6">
                <Search className="h-16 w-16 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                Aucun design trouvé
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto text-lg">
                Aucun design ne correspond à votre recherche. Essayez de
                modifier vos critères ou créez un nouveau design.
              </p>
              <Button
                onClick={() => navigate("/builder")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl px-8 py-3 text-base rounded-2xl"
              >
                <Plus className="h-5 w-5 mr-2" />
                Créer un Nouveau Design
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Modal de visualisation amélioré */}
      <Dialog open={!!selectedDesign} onOpenChange={closeDesignModal}>
        <DialogContent className="max-w-6xl w-full max-h-[90vh] overflow-hidden rounded-3xl p-0 border-0 shadow-2xl">
          <DialogHeader className="p-6 border-b bg-gradient-to-r from-slate-50 to-blue-50">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {selectedDesign?.name}
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeDesignModal}
                className="h-9 w-9 p-0 rounded-full hover:bg-white/50"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 h-full max-h-[70vh]">
            {/* Aperçu du design */}
            <div className="lg:col-span-3 flex flex-col p-8 bg-gradient-to-br from-gray-50 to-blue-50">
              <div className="flex-1 flex items-center justify-center rounded-2xl bg-white/50 backdrop-blur-sm p-8 shadow-inner min-h-[400px]">
                <div className="w-full h-full flex items-center justify-center">
                  <div
                    ref={setPreviewRef}
                    className="w-full h-full flex items-center justify-center"
                  >
                    <DesignPreview
                      design={selectedDesign}
                      colorOverride={selectedColor || undefined}
                      isModal
                    />
                  </div>
                </div>
              </div>

              {/* Navigation et contrôles */}
              <div className="flex items-center justify-between mt-6 px-2">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => navigateSlide("prev")}
                    className="flex items-center gap-2 rounded-xl px-4 py-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Précédent
                  </Button>

                  <Button
                    onClick={() => playPreview(selectedDesign)}
                    className="flex items-center gap-2 rounded-xl px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    <Eye className="h-4 w-4" />
                    Prévisualiser
                  </Button>
                </div>

                <span className="text-sm text-muted-foreground font-medium bg-white/50 px-3 py-1 rounded-full">
                  {currentSlide + 1} / {allDesigns.length}
                </span>

                <Button
                  variant="outline"
                  onClick={() => navigateSlide("next")}
                  className="flex items-center gap-2 rounded-xl px-4 py-2"
                >
                  Suivant
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Options de personnalisation */}
            <div className="lg:col-span-2 flex flex-col bg-white border-l">
              <div className="flex-1 overflow-auto p-6 space-y-6">
                <Card className="border-0 shadow-lg rounded-2xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Palette className="h-5 w-5 text-blue-600" />
                      Personnalisation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Sélection de couleur */}
                    <div>
                      <h4 className="text-sm font-medium mb-4 text-gray-700">
                        Couleur principale
                      </h4>
                      <div className="flex flex-wrap gap-3">
                        {selectedDesign?.colors?.map((color, index) => (
                          <button
                            key={index}
                            className={`w-10 h-10 rounded-xl border-3 transition-all hover:scale-110 ${
                              selectedColor === color
                                ? "border-blue-500 scale-110 ring-4 ring-blue-200"
                                : "border-gray-200 shadow-md"
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => {
                              setSelectedColor(color);
                              if (selectedDesign)
                                setCardColors((prev) => ({
                                  ...prev,
                                  [selectedDesign.id]: color,
                                }));
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Bouton d'édition principal */}
                    <Button
                      onClick={() => {
                        navigate(`/builder?template=${selectedDesign?.id}`);
                        closeDesignModal();
                      }}
                      className="w-full flex items-center gap-3 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      <Edit className="h-5 w-5" />
                      Éditer cette carte
                    </Button>

                    {/* Informations du design */}
                    <div className="space-y-4 pt-4 border-t">
                      <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Informations du design
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-muted-foreground">
                            Catégorie:
                          </span>
                          <Badge
                            variant="outline"
                            className="capitalize font-medium"
                          >
                            {selectedDesign?.category}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-muted-foreground">
                            Popularité:
                          </span>
                          <span className="font-semibold text-green-600">
                            {selectedDesign?.popularity}%
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-muted-foreground">
                            Éléments:
                          </span>
                          <span className="font-semibold">
                            {selectedDesign?.items?.length || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-muted-foreground">
                            Créé le:
                          </span>
                          <span className="font-medium">
                            {formatDate(selectedDesign?.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Styles CSS complets pour tous les modèles */}
      <style>{`
        /* ====== MODÈLE 1 - Simple & Basic ====== */
        .model1-container { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
        .model1-content { position: relative; width: 200px; height: 120px; }
        .model1-envelope { 
          width: 200px; 
          height: 120px; 
          background: linear-gradient(#cccbd7 0.5px, #26452b 0.5px);
          cursor: pointer; 
          border-radius: 4px;
          position: relative;
        }
        .model1-envelope::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 200px;
          border-top: 77px solid #7873A7;
          border-left: 100px solid transparent;
          border-right: 100px solid transparent;
          box-sizing: border-box;
          z-index: 30;
          transform-origin: top;
        }
        .model1-letter { 
          position: absolute;
          top: 5px;
          left: 5px;
          width: 190px;
          height: 110px;
          background: #f0eef6;
          border-radius: 2px;
          transform: translateY(0);
          opacity: 0;
          z-index: 15;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .model1-letter.visible { 
          transform: translateY(-80px); 
          opacity: 1;
        }
        .model1-close { 
          position: absolute;
          right: 5px;
          top: 2px;
          cursor: pointer;
          font-size: 16px;
        }
        .model1-message { 
          font-size: 24px;
          font-weight: 900;
          text-align: center;
        }
        .model1-shadow { 
          position: absolute;
          bottom: -3px;
          left: 50%;
          transform: translateX(-50%);
          width: 120px;
          height: 3px;
          border-radius: 50%;
          background: rgba(0,0,0,0.05);
        }

        /* ====== MODÈLE 2 - Birthday Card ====== */
        .model2-envelope { 
          width: 200px; 
          height: 100px; 
          background: #ae4243;
          position: relative;
          border-radius: 4px;
          overflow: hidden;
        }
        .model2-envelope_top { 
          border-bottom: 67px solid #ae4243;
          border-left: 73px solid transparent;
          border-right: 73px solid transparent;
          height: 0;
          width: 54px;
          position: absolute;
          transform: translateY(-100%);
          transform-origin: bottom;
          transition: .3s;
          z-index: 3;
        }
        .model2-envelope_top_close {
          transform: translateY(-100%) rotateX(180deg);
          border-bottom: 67px solid #ef5b5b;
          z-index: 4;
        }
        .model2-paper { 
          background: #fff;
          width: 173px;
          height: 67px;
          position: absolute;
          left: 50%;
          margin-left: -87px;
          margin-top: -40px;
          text-align: center;
          padding: 3px;
          line-height: 2.7em;
          font-size: 1em;
          z-index: 3;
          transition: .2s;
        }
        .model2-paper_close {
          margin-top: 0;
          z-index: 2;
        }

        /* ====== MODÈLE 3 - Simple Hover ====== */
        .model3-envelope { 
          position: relative;
          width: 160px;
          height: 128px;
          cursor: pointer;
        }
        .model3-back { 
          position: relative;
          width: 160px;
          height: 128px;
          background-color: #ffcea1;
          border-radius: 4px;
        }
        .model3-letter { 
          position: absolute;
          background-color: #fff;
          width: 147px;
          height: 115px;
          top: 6px;
          left: 6px;
          transition: .2s;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: #ffb169;
          text-align: center;
          padding: 10px;
          font-size: 12px;
        }
        .model3-letter.model3-lift { 
          transform: translateY(-60px); 
          z-index: 2;
        }

        /* ====== MODÈLE 4 - Love Card ====== */
        .model4-envlope-wrapper { width: 100%; max-width: 180px; }
        .model4-envelope { 
          width: 180px;
          height: 115px;
          border-bottom-left-radius: 4px;
          border-bottom-right-radius: 4px;
          margin: auto;
          background-color: #0077B2;
          position: relative;
          cursor: pointer;
          box-shadow: 0 2px 12px rgba(0,0,0,.12);
        }
        .model4-flap {
          border-left: 90px solid transparent;
          border-right: 90px solid transparent;
          border-bottom: 52px solid transparent;
          border-top: 63px solid #005a8c;
          transform-origin: top;
          position: absolute;
          top: 0;
          z-index: 3;
        }
        .model4-pocket {
          border-left: 90px solid #0077B2;
          border-right: 90px solid #0077B2;
          border-bottom: 57px solid #006699;
          border-top: 57px solid transparent;
          border-bottom-left-radius: 4px;
          border-bottom-right-radius: 4px;
          position: absolute;
          top: 0;
        }
        .model4-letter {
          position: relative;
          background-color: #fff;
          width: 90%;
          margin-left: auto;
          margin-right: auto;
          height: 90%;
          top: 5%;
          border-radius: 4px;
          box-shadow: 0 2px 12px rgba(0,0,0,.12);
        }
        .model4-words {
          position: absolute;
          left: 10%;
          width: 80%;
          height: 12%;
          background-color: #EEEFF0;
        }
        .model4-line1 { top: 15%; width: 20%; height: 6%; }
        .model4-line2 { top: 30%; }
        .model4-line3 { top: 50%; }
        .model4-line4 { top: 70%; }
        .model4-heart {
          width: 12px;
          height: 12px;
          background: #D00000;
          border-radius: 3px;
          display: inline-block;
          margin: 2px;
          position: absolute;
          bottom: 10px;
        }
        .model4-a1 { left: 20%; transform: scale(0.6); }
        .model4-a2 { left: 55%; transform: scale(1); }
        .model4-a3 { left: 10%; transform: scale(0.8); }

        /* ====== MODÈLE 5 - Valentine Card ====== */
        .model5-container-valentine { width: 100%; height: 100%; }
        .model5-envelope { 
          width: 200px;
          height: 133px;
          background: linear-gradient(135deg,#ff6b6b,#f06292);
          border-radius: 5px;
          position: relative;
          cursor: pointer;
        }
        .model5-letter { 
          position: absolute;
          width: 90%;
          height: 80%;
          left: 5%;
          top: 10%;
          background: #fff;
          border-radius: 4px;
          box-shadow: 0 5px 15px rgba(0,0,0,.08);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transform: translateY(0);
          transition: .4s;
        }
        .model5-envelope.active .model5-letter { 
          opacity: 1;
          transform: translateY(-50px);
        }

        /* ====== MODÈLE 7 - Extravagant Card ====== */
        .model7-envelop { 
          width: 120px;
          height: 80px;
          position: relative;
          margin: auto;
          cursor: pointer;
        }
        .model7-envelop__front-paper, .model7-envelop__back-paper { 
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: .5rem;
        }
        .model7-envelop__front-paper { 
          background: #ba9872;
          z-index: 300;
          clip-path: polygon(100% 0%,50% 70%,0% 0%,0% 100%,100% 100%);
        }
        .model7-love-notes .model7-note { 
          width: 95%;
          height: 30%;
          background: #f9f9f9;
          position: absolute;
          left: 2.5%;
          box-shadow: 0 0 3px rgba(0,0,0,.2);
        }

        /* ====== MODÈLE 8 - Basic Card ====== */
        .model8-page1 { width: 100%; height: 100%; }
        .model8-envelope-wrapper { 
          width: 200px;
          height: 138px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .model8-envelope { 
          width: 200px;
          height: 120px;
          background: linear-gradient(180deg,#ffd6ea,#ffb6cc);
          border-radius: 5px;
          cursor: pointer;
          perspective: 600px;
        }
        .model8-flap { 
          width: 100%;
          height: 55%;
          transform-origin: top;
          transition: transform 1s cubic-bezier(.2,.8,.25,1);
          background: linear-gradient(180deg,#ffd6e8,#ffb6cc);
        }
        .model8-envelope.open .model8-flap { 
          transform: rotateX(-180deg);
        }
        .model8-letter { 
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: 36%;
          width: 86%;
          max-width: 170px;
          background: #fff;
          padding: 12px;
          opacity: 0;
          transition: transform .3s, opacity .2s;
          font-size: 12px;
          text-align: center;
        }
        .model8-letter.popped { 
          transform: translateX(-50%) translateY(-120px);
          opacity: 1;
        }

        /* ====== MODÈLE 9 - Fly Card ====== */
        .model9-env_wrap { 
          width: 100%;
          padding-top: 110%;
          background: linear-gradient(0deg,#c7c2c5 0,#fff 55%,rgba(255,255,255,0) 55%);
          position: relative;
        }

        /* ====== MODÈLE 11 - Heart Card ====== */
        .model11-letter_ct {
          width: 240px;
          height: 180px;
          position: relative;
        }
        .model11-check { display: none; }
        .model11-label { position: absolute; width: 100%; height: 100%; cursor: pointer; }
        .model11-letter {
          width: 240px;
          height: 180px;
          background-color: pink;
          border: 3px solid palevioletred;
          position: absolute;
          border-radius: 0 0 5px 5px;
          transition: all 0.3s ease-in-out;
        }
        .model11-main { box-shadow: 0 6px 20px purple; }
        .model11-note {
          z-index: 1;
          position: absolute;
          width: 230px;
          height: 160px;
          margin: 6px 5px;
          background-color: whitesmoke;
          padding: 10px;
          font-size: 10px;
          color: purple;
        }
        .model11-heart {
          position: absolute;
          z-index: 4;
          cursor: pointer;
          height: 102px;
          width: 120px;
          scale: 20%;
          margin: 42px 61px;
          transition: transform 0.3s ease-in-out;
        }
        .model11-heart::before, .model11-heart::after {
          content: "";
          position: absolute;
          width: 60px;
          height: 96px;
          background-color: rgb(178, 34, 106);
        }
        .model11-heart::before {
          left: 60px;
          transform-origin: 0 100%;
          transform: rotate(-45deg);
          border-radius: 30px 30px 0 0;
        }
        .model11-heart::after {
          right: 60px;
          transform-origin: 100% 100%;
          transform: rotate(45deg);
          border-radius: 30px 30px 0 0;
        }

        /* Ajustements pour le modal */
        .DialogContent .model1-container,
        .DialogContent .model2-envelope,
        .DialogContent .model3-envelope,
        .DialogContent .model4-envlope-wrapper,
        .DialogContent .model5-container-valentine,
        .DialogContent .model7-envelop,
        .DialogContent .model8-page1,
        .DialogContent .model9-envelope_form_wrap,
        .DialogContent .model11-letter_ct {
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
}
