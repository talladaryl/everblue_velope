import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Filter,
  Grid,
  List,
  ArrowRight,
  Sparkles,
  Eye,
  Edit3,
  Star,
  Zap,
  Palette,
  Download,
  Share2,
  Calendar,
  MapPin,
  Users,
  Crown,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AuthModal } from "@/components/AuthModal";

// Images réelles de Pexels/Pinterest pour chaque catégorie
const mockCards = [
  {
    id: "1",
    title: "Mariage Élégant",
    category: "Mariage",
    featured: true,
    premium: true,
    image:
      "https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=600",
    icon: "💍",
  },
  {
    id: "2",
    title: "Anniversaire Festif",
    category: "Anniversaire",
    featured: false,
    premium: false,
    image:
      "https://images.pexels.com/photos/1556704/pexels-photo-1556704.jpeg?auto=compress&cs=tinysrgb&w=600",
    icon: "🎂",
  },
  {
    id: "3",
    title: "Événement d'Entreprise",
    category: "Professionnel",
    featured: true,
    premium: true,
    image:
      "https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=600",
    icon: "💼",
  },
  {
    id: "4",
    title: "Célébration de Noël",
    category: "Noël",
    featured: false,
    premium: false,
    image:
      "https://images.pexels.com/photos/1303085/pexels-photo-1303085.jpeg?auto=compress&cs=tinysrgb&w=600",
    icon: "🎄",
  },
  {
    id: "5",
    title: "Soirée Élégante",
    category: "Soirée",
    featured: true,
    premium: true,
    image:
      "https://images.pexels.com/photos/2741923/pexels-photo-2741923.jpeg?auto=compress&cs=tinysrgb&w=600",
    icon: "🎉",
  },
  {
    id: "6",
    title: "Baptême Angélique",
    category: "Baptême",
    featured: false,
    premium: false,
    image:
      "https://images.pexels.com/photos/761963/pexels-photo-761963.jpeg?auto=compress&cs=tinysrgb&w=600",
    icon: "👼",
  },
  {
    id: "7",
    title: "Réunion d'Affaires",
    category: "Professionnel",
    featured: false,
    premium: false,
    image:
      "https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg?auto=compress&cs=tinysrgb&w=600",
    icon: "📊",
  },
  {
    id: "8",
    title: "Mariage Romantique",
    category: "Mariage",
    featured: true,
    premium: true,
    image:
      "https://images.pexels.com/photos/1024960/pexels-photo-1024960.jpeg?auto=compress&cs=tinysrgb&w=600",
    icon: "🌹",
  },
];

const categories = [
  "Tous",
  "Mariage",
  "Anniversaire",
  "Professionnel",
  "Noël",
  "Baptême",
  "Soirée",
];

const features = [
  {
    icon: Palette,
    title: "Design Personnalisable",
    description: "Modifiez chaque détail pour créer une invitation unique",
  },
  {
    icon: Zap,
    title: "Création Rapide",
    description: "Générez des invitations professionnelles en quelques minutes",
  },
  {
    icon: Download,
    title: "Téléchargement Illimité",
    description: "Accédez à tous vos designs en haute qualité",
  },
  {
    icon: Share2,
    title: "Partage Facile",
    description: "Envoyez vos invitations par email ou réseaux sociaux",
  },
];

const HeroSection = ({ onOpenLogin }: { onOpenLogin: () => void }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100/50 via-transparent to-transparent"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-sm font-medium">
                <Sparkles className="h-4 w-4 mr-2" />
                Plateforme premium d'invitations
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Créez des
                <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  invitations
                </span>
                exceptionnelles
              </h1>

              <p className="text-xl text-gray-600 max-w-lg leading-relaxed">
                Transformez vos événements avec des invitations personnalisées
                conçues par des experts. Simple, rapide et professionnel.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="h-14 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group"
                onClick={onOpenLogin}
              >
                Commencer gratuitement
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="h-14 px-8 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300"
                onClick={() =>
                  document
                    .getElementById("catalog")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Voir les modèles
              </Button>
            </div>

            <div className="flex items-center space-x-8 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">500+</div>
                <div className="text-sm text-gray-600">Modèles Premium</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">25k+</div>
                <div className="text-sm text-gray-600">Clients satisfaits</div>
              </div>
              <div className="text-center">
                <div className="flex items-center text-2xl font-bold text-yellow-500">
                  4.9 <Star className="h-5 w-5 ml-1 fill-current" />
                </div>
                <div className="text-sm text-gray-600">Avis clients</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
                <div className="text-center mb-6">
                  <div className="text-2xl font-bold mb-2">Sophie & Thomas</div>
                  <div className="text-blue-100">
                    vous invitent à célébrer leur union
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <Calendar className="h-6 w-6 mx-auto mb-2 text-blue-200" />
                    <div className="font-semibold">15 Juin 2024</div>
                    <div className="text-sm text-blue-200">18h30</div>
                  </div>
                  <div className="text-center">
                    <MapPin className="h-6 w-6 mx-auto mb-2 text-blue-200" />
                    <div className="font-semibold">Château de Versailles</div>
                    <div className="text-sm text-blue-200">Salle des Fêtes</div>
                  </div>
                </div>

                <div className="text-center">
                  <Users className="h-6 w-6 mx-auto mb-2 text-blue-200" />
                  <div className="text-sm text-blue-200">
                    Code vestimentaire : Tenue de soirée
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-1 h-16 bg-gradient-to-b from-blue-600 to-transparent rounded-full"></div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Pourquoi choisir Everblue ?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez les fonctionnalités qui font de notre plateforme la
            solution idéale pour vos invitations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

const InvitationCard = ({
  title,
  category,
  featured,
  premium,
  image,
  onOpenLogin,
}: {
  title: string;
  category: string;
  featured: boolean;
  premium: boolean;
  image: string;
  onOpenLogin: () => void;
}) => {
  return (
    <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
      <CardContent className="p-0">
        <div className="relative overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          />

          {featured && (
            <div className="absolute top-3 left-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-500 text-white text-xs font-medium">
                <Sparkles className="h-3 w-3 mr-1" />
                Populaire
              </span>
            </div>
          )}

          {premium && (
            <div className="absolute top-3 right-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-medium">
                <Crown className="h-3 w-3 mr-1" />
                Premium
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="flex space-x-2">
              <Button
                size="sm"
                className="bg-white/90 backdrop-blur-sm text-gray-900 hover:bg-white"
              >
                <Eye className="h-4 w-4 mr-1" />
                Aperçu
              </Button>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={onOpenLogin}
              >
                <Edit3 className="h-4 w-4 mr-1" />
                Personnaliser
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-bold text-gray-900 text-lg line-clamp-1">
              {title}
            </h3>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
              {category}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Modèle {category.toLowerCase()} élégant et entièrement
            personnalisable
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1 text-yellow-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm text-gray-600">4.8</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
              onClick={onOpenLogin}
            >
              Utiliser
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const CatalogSection = ({ onOpenLogin }: { onOpenLogin: () => void }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredCards = mockCards.filter((card) => {
    const matchesSearch = card.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Tous" || card.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="catalog" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nos modèles d'invitations
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez notre collection de modèles premium conçus par des
            designers professionnels pour tous vos événements spéciaux
          </p>
        </div>

        <Card className="border-0 shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher un modèle..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 rounded-xl border-gray-300 focus:border-blue-500"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={
                      selectedCategory === category
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                    }
                  >
                    {category}
                  </Button>
                ))}
              </div>

              <div className="flex items-center space-x-2 bg-gray-100 rounded-xl p-1">
                <Button
                  size="sm"
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  onClick={() => setViewMode("grid")}
                  className="px-3 rounded-lg"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === "list" ? "default" : "ghost"}
                  onClick={() => setViewMode("list")}
                  className="px-3 rounded-lg"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between mb-8">
          <p className="text-gray-600">
            {filteredCards.length} modèle{filteredCards.length !== 1 ? "s" : ""}{" "}
            trouvé{filteredCards.length !== 1 ? "s" : ""}
          </p>
          <Button
            variant="outline"
            className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
          >
            <Filter className="h-4 w-4 mr-2" />
            Plus de filtres
          </Button>
        </div>

        <div
          className={`grid gap-8 ${
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1"
          }`}
        >
          {filteredCards.map((card, index) => (
            <div
              key={card.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <InvitationCard {...card} onOpenLogin={onOpenLogin} />
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl px-8"
            onClick={onOpenLogin}
          >
            Voir tous les modèles
          </Button>
        </div>
      </div>
    </section>
  );
};

export default function Index() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (userData: any) => {
    setUser(userData);
    setIsAuthOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onOpenLogin={() => setIsAuthOpen(true)} user={user} />
      <main>
        <HeroSection onOpenLogin={() => setIsAuthOpen(true)} />
        <FeaturesSection />
        <CatalogSection onOpenLogin={() => setIsAuthOpen(true)} />
      </main>
      <Footer />
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}
