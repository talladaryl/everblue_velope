import { Mail, Phone } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-blue-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">Everblue</h3>
            <p className="text-blue-200 mb-6 max-w-md text-lg">
              Créez des invitations mémorables qui impressionneront vos invités.
              Votre événement mérite le meilleur.
            </p>
            <div className="flex space-x-6">
              <div className="flex items-center text-blue-200">
                <Mail className="h-5 w-5 mr-2" />
                contact@everblue.fr
              </div>
              <div className="flex items-center text-blue-200">
                <Phone className="h-5 w-5 mr-2" />
                (+237) 658 940 985
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white text-lg mb-4">
              Navigation
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="/"
                  className="text-blue-200 hover:text-white transition-colors duration-200"
                >
                  Accueil
                </a>
              </li>
              <li>
                <a
                  href="#catalog"
                  className="text-blue-200 hover:text-white transition-colors duration-200"
                >
                  Modèles
                </a>
              </li>
              <li>
                <a
                  href="/pricing"
                  className="text-blue-200 hover:text-white transition-colors duration-200"
                >
                  Tarifs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-blue-200 hover:text-white transition-colors duration-200"
                >
                  Aide
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white text-lg mb-4">Support</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-blue-200 hover:text-white transition-colors duration-200"
                >
                  Centre d'aide
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-blue-200 hover:text-white transition-colors duration-200"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-blue-200 hover:text-white transition-colors duration-200"
                >
                  Tutoriels
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-blue-200 hover:text-white transition-colors duration-200"
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-blue-300">
            © 2024 Everblue. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};
