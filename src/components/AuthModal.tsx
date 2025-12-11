import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // 👈 Import de Axios

// ====================================================================
// ⚠️ CONFIGURATION CLÉ
// Remplacez par l'URL de votre backend Laravel (ex: 'http://localhost:8000')
const API_BASE_URL = "http://localhost:8000";
// ====================================================================

// Instance Axios configurée pour l'authentification par session/cookie
const api = axios.create({
  baseURL: API_BASE_URL,
  // IMPORTANT : Autorise l'envoi de cookies d'authentification (Sanctum)
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: any) => void;
}

export const AuthModal = ({ isOpen, onClose, onLogin }: AuthModalProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  // Nouveaux états pour la 2FA
  const [is2FA, setIs2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError(null);
  };

  /**
   * Récupère les données utilisateur après une connexion réussie (standard ou 2FA)
   */
  const fetchUserAndCompleteLogin = async () => {
    setIsLoading(true);
    try {
      // Utiliser votre route /api/auth/me (vous avez listé cette route)
      const userResponse = await api.get("/auth/me");

      onLogin(userResponse.data);
      setIs2FA(false); // Réinitialiser l'état 2FA
      setTwoFactorCode("");
      setIsLoading(false);
      onClose();
      navigate("/designs");
      return true;
    } catch (err) {
      console.error("Erreur lors de la récupération de l'utilisateur:", err);
      setError(
        "Connexion réussie, mais impossible de récupérer les données utilisateur."
      );
      setIsLoading(false);
      return false;
    }
  };

  /**
   * Fonction utilitaire pour effectuer la requête API (Sanctum, 2FA, Login/Register)
   * @param endpoint 'login', 'register', ou 'two-factor-challenge'
   * @param payload Les données du formulaire
   */
  const performAuthRequest = async (endpoint: string, payload: any) => {
    setIsLoading(true);
    setError(null);

    // 1. Obtenir le cookie CSRF (Crucial pour les requêtes POST/PUT/PATCH/DELETE de Sanctum)
    try {
      await api.get("/sanctum/csrf-cookie");
    } catch (csrfError) {
      setError(
        "Impossible d'établir la connexion sécurisée (CSRF). Vérifiez le domaine."
      );
      setIsLoading(false);
      return false;
    }

    try {
      const requestEndpoint = endpoint; // sera '/login', '/register', ou '/two-factor-challenge'

      const response = await api.post(requestEndpoint, payload);

      // 2. Connexion/Inscription/2FA réussie (Statut 200)
      if (response.status === 200) {
        // Pour le login, Fortify renvoie 200, puis nous récupérons l'utilisateur
        // Pour le register, Fortify connecte et renvoie 200, puis nous récupérons l'utilisateur
        // Pour la 2FA, Fortify valide et renvoie 200, puis nous récupérons l'utilisateur
        await fetchUserAndCompleteLogin();
        return true;
      }

      // Cas peu probable, mais on arrête le chargement
      setIsLoading(false);
      return false;
    } catch (err: any) {
      setIsLoading(false);
      const status = err.response?.status;
      const message = err.response?.data?.message || err.message;

      // 3. Gestion de l'erreur 2FA (Code 403 ou 422 avec message spécifique)
      // L'API Fortify/Sanctum renvoie un 403 avec un message pour le 2FA si c'est requis
      if (status === 403 && message.includes("Two Factor Authentication")) {
        setIs2FA(true); // Passer au mode 2FA
        setError("Double authentification requise. Entrez votre code.");
        return false;
      }

      // 4. Échec général de la connexion/validation (Statut 422 - Unprocessable Entity)
      if (status === 422 && err.response?.data?.errors) {
        const firstError = Object.values(
          err.response.data.errors
        )[0] as string[];
        setError(firstError[0] || "Erreur de validation.");
      } else {
        setError(message || "Échec de l'opération. Identifiants incorrects.");
      }

      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Gérer le flux 2FA
    if (is2FA) {
      const payload = {
        code: twoFactorCode,
      };
      // L'endpoint est celui de Fortify pour valider le code 2FA
      performAuthRequest("two-factor-challenge", payload);
      return;
    }

    // Flux standard (Login/Register)
    const payload = {
      email: formData.email,
      password: formData.password,
      ...(isLogin ? {} : { name: formData.name }),
      // Ajoutez 'remember' si vous l'avez dans le formulaire
      // remember: isLogin ? rememberMe : undefined,
    };

    if (isLogin) {
      performAuthRequest("login", payload);
    } else {
      performAuthRequest("register", payload);
    }
  };

  // Fonction pour réinitialiser le formulaire et revenir à la connexion
  const resetToLogin = () => {
    setIs2FA(false);
    setTwoFactorCode("");
    setError(null);
    setIsLogin(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-md mx-4 border-0 shadow-2xl rounded-2xl">
        <CardHeader className="relative text-center pb-4">
          <Button
            variant="ghost"
            onClick={onClose}
            className="absolute right-4 top-4 h-8 w-8 p-0 hover:bg-gray-100"
            disabled={isLoading}
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </Button>
          <CardTitle className="text-3xl font-extrabold text-foreground mt-2">
            {is2FA ? "Code 2FA Requis" : isLogin ? "Connexion" : "Inscription"}
          </CardTitle>
          <p className="text-gray-600 mt-2">
            {is2FA
              ? "Veuillez entrer le code de votre application d'authentification."
              : isLogin
              ? "Content de vous revoir !"
              : "Rejoignez notre communauté en quelques secondes"}
          </p>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ======================================================= */}
            {/* CHAMPS DE FORMULAIRE STANDARD (Masqués si 2FA) */}
            {/* ======================================================= */}
            {!is2FA && (
              <>
                {/* Champ Nom (uniquement pour l'inscription) */}
                {!isLogin && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium text-gray-700"
                    >
                      Nom complet
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Votre nom"
                        value={formData.name}
                        onChange={handleChange}
                        className="pl-10 h-12 rounded-xl border focus:border-blue-500 focus:ring-blue-500 transition duration-150"
                        required={!isLogin}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                )}

                {/* Champ Email */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Adresse email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 h-12 rounded-xl border focus:border-blue-500 focus:ring-blue-500 transition duration-150"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Champ Mot de passe */}
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Mot de passe
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10 pr-10 h-12 rounded-xl border focus:border-blue-500 focus:ring-blue-500 transition duration-150"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition duration-150"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ======================================================= */}
            {/* CHAMP 2FA (Affiché si is2FA) */}
            {/* ======================================================= */}
            {is2FA && (
              <div className="space-y-2">
                <Label
                  htmlFor="twoFactorCode"
                  className="text-sm font-medium text-gray-700"
                >
                  Code 2FA
                </Label>
                <div className="relative">
                  <Input
                    id="twoFactorCode"
                    name="twoFactorCode"
                    type="text"
                    placeholder="Entrez votre code à 6 chiffres"
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value)}
                    className="pl-4 h-12 rounded-xl border focus:border-blue-500 focus:ring-blue-500 transition duration-150"
                    required
                    disabled={isLoading}
                    autoFocus
                  />
                </div>
              </div>
            )}

            {/* Affichage de l'erreur */}
            {error && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm transition duration-300 ease-in-out">
                {error}
              </div>
            )}

            {/* Options supplémentaires (Mot de passe oublié, Se souvenir de moi) */}
            {isLogin && !is2FA && (
              <div className="flex items-center justify-between">
                {/* Checkbox "Se souvenir de moi" */}
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border text-blue-600 focus:ring-blue-500"
                    name="remember"
                    disabled={isLoading}
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    Se souvenir de moi
                  </span>
                </label>
                <a
                  href="#"
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium transition duration-150"
                >
                  Mot de passe oublié ?
                </a>
              </div>
            )}

            {/* Bouton de Soumission */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl text-lg font-medium shadow-lg transition duration-300 ease-in-out"
              disabled={isLoading || (is2FA && twoFactorCode.length < 6)}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Traitement...
                </>
              ) : is2FA ? (
                "Valider le code 2FA"
              ) : isLogin ? (
                "Se connecter"
              ) : (
                "S'inscrire"
              )}
            </Button>

            {/* Lien de basculement entre Login/Register */}
            <div className="text-center">
              {!is2FA ? (
                <p className="text-sm text-gray-600">
                  {isLogin ? "Pas de compte ? " : "Déjà un compte ? "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError(null);
                    }}
                    className="text-blue-600 hover:text-blue-500 font-medium transition duration-150"
                    disabled={isLoading}
                  >
                    {isLogin ? "S'inscrire" : "Se connecter"}
                  </button>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={resetToLogin}
                  className="text-sm text-gray-600 hover:text-blue-600 font-medium transition duration-150"
                  disabled={isLoading}
                >
                  Revenir au mot de passe / Utiliser un code de récupération
                </button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
