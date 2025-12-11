import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PreviewModel1 } from "./builder/modelPreviews";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Home, Share2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";

/**
 * Page publique pour afficher une invitation avec animation
 * URL: /invitation/:token
 */
export default function InvitationView() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [invitation, setInvitation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Image de fond Pexels
  const backgroundImage =
    "https://images.pexels.com/photos/7130537/pexels-photo-7130537.jpeg";

  useEffect(() => {
    loadInvitation();
  }, [token]);

  const loadInvitation = async () => {
    try {
      setLoading(true);

      if (!token) {
        setError("Token d'invitation manquant");
        setLoading(false);
        return;
      }

      // Importer le service d'invitation
      const { invitationService } = await import(
        "@/api/services/invitationService"
      );

      // Récupérer l'invitation (API ou localStorage)
      const invitationData = await invitationService.getByToken(token);

      if (!invitationData) {
        setError("Invitation introuvable ou expirée");
        setLoading(false);
        return;
      }

      // Vérifier si l'invitation est expirée
      if (invitationData.expiresAt) {
        const expiryDate = new Date(invitationData.expiresAt);
        if (expiryDate < new Date()) {
          setError("Cette invitation a expiré");
          setLoading(false);
          return;
        }
      }

      setInvitation(invitationData);
      setLoading(false);

      console.log("✅ Invitation chargée:", invitationData.recipientName);
    } catch (err: any) {
      console.error("❌ Erreur chargement invitation:", err);
      setError("Impossible de charger l'invitation");
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Mon invitation",
        text: "Découvrez mon invitation personnalisée !",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Lien copié dans le presse-papier !");
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <LoadingSpinner message="Chargement de votre invitation..." size="lg" />
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Invitation introuvable
          </h1>
          <p className="text-gray-600 mb-6">
            {error || "Cette invitation n'existe pas ou a expiré."}
          </p>
          <Button
            onClick={() => navigate("/designs")}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Home className="mr-2 h-4 w-4" />
            Retour aux designs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Menu avec logo EV */}
      <header className="relative z-20 pt-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo EV */}
            <button
              onClick={() => navigate("/designs")}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center font-bold text-lg rounded-md shadow-md">
                EV
              </div>
              <span className="text-white font-medium hidden md:inline text-shadow">
                Everblue
              </span>
            </button>

            {/* Navigation */}
            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate("/designs")}
                variant="ghost"
                className="text-white hover:bg-white/20 bg-white/10 backdrop-blur-sm"
              >
                <Home className="mr-2 h-4 w-4" />
                Designs
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in text-shadow-lg">
            Votre Invitation
          </h1>
          <p className="text-xl text-white/90 animate-fade-in animation-delay-200 text-shadow">
            Cliquez sur l'enveloppe pour découvrir votre carte
          </p>
        </div>

        {/* Animation d'enveloppe */}
        <div className="flex items-center justify-center mb-8 animate-fade-in animation-delay-400">
          <div className="bg-white/15 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
            <PreviewModel1
              items={invitation.items}
              bgColor={invitation.bgColor}
              bgImage={invitation.bgImage}
              onClose={() => {}}
              guest={{ name: invitation.recipientName, email: "" }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 justify-center animate-fade-in animation-delay-600">
          <Button
            onClick={handleShare}
            className="bg-blue-500 hover:bg-blue-600 text-white border-none shadow-lg"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Partager
          </Button>
          <Button
            onClick={() => navigate("/designs")}
            className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border border-white/30"
          >
            <Home className="mr-2 h-4 w-4" />
            Créer ma propre invitation
          </Button>
        </div>
      </div>

      {/* Pied de page simple */}
      <footer className="relative z-10 py-4 mt-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-white/80 text-sm">
            <p>Everblue 2025</p>
          </div>
        </div>
      </footer>

      {/* Styles pour les animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }
        .animation-delay-600 {
          animation-delay: 0.6s;
          opacity: 0;
        }
        .text-shadow {
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        .text-shadow-lg {
          text-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
}
