import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, Crown, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SettingsMenu } from "@/components/SettingsMenu";

interface HeaderProps {
  onOpenLogin: () => void;
  user?: {
    name: string;
  } | null;
}

export const Header = ({ onOpenLogin, user }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Everblue
            </h1>
          </div>

          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a
                href="/"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 px-3 py-2 text-sm font-medium"
              >
                Accueil
              </a>
              <a
                href="#catalog"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 px-3 py-2 text-sm font-medium"
              >
                Modèles
              </a>
              <a
                href="/pricing"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 px-3 py-2 text-sm font-medium"
              >
                Tarifs
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 px-3 py-2 text-sm font-medium"
              >
                Aide
              </a>
            </div>
          </nav>

          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              <SettingsMenu />
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-gray-700">Bonjour, {user.name}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/designs")}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Mon Espace
                  </Button>
                </div>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={onOpenLogin}>
                    <LogIn className="h-4 w-4 mr-2" />
                    Connexion
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={onOpenLogin}
                  >
                    Créer mon invitation
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <SettingsMenu />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border">
              <a
                href="/"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium transition-colors duration-200"
              >
                Accueil
              </a>
              <a
                href="#catalog"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium transition-colors duration-200"
              >
                Modèles
              </a>
              <a
                href="/pricing"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium transition-colors duration-200"
              >
                Tarifs
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium transition-colors duration-200"
              >
                Aide
              </a>
              <div className="pt-4 pb-3 border-t border space-y-3">
                {user ? (
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => navigate("/designs")}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Bonjour, {user.name}
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={onOpenLogin}
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Connexion
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white w-full"
                      onClick={onOpenLogin}
                    >
                      Créer mon invitation
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
