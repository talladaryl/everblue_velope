import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PreviewModel1 } from "./builder/modelPreviews";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Home, Download, Share2 } from "lucide-react";
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
      const { invitationService } = await import("@/api/services/invitationService");
      
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
    return <LoadingSpinner message="Chargement de votre invitation..." size="lg" />;
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Invitation introuvable
          </h1>
          <p className="text-gray-600 mb-6">
            {error || "Cette invitation n'existe pas ou a expiré."}
          </p>
          <Button onClick={() => navigate("/")} className="w-full">
            <Home className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Effets de fond */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Contenu */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
             Votre Invitation 
          </h1>
          <p className="text-xl text-white/80 animate-fade-in animation-delay-200">
            Cliquez sur l'enveloppe pour découvrir votre carte
          </p>
        </div>

        {/* Animation d'enveloppe */}
        <div className="flex items-center justify-center mb-8 animate-fade-in animation-delay-400">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl">
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
            variant="outline"
            className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Partager
          </Button>
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20"
          >
            <Home className="mr-2 h-4 w-4" />
            Créer ma propre invitation
          </Button>
        </div>
      </div>

      {/* Styles pour les animations */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
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
      `}</style>
    </div>
  );
}