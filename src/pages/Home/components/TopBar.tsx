import React from "react";
import { Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TopBarProps {
  search: string;
  setSearch: (value: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ search, setSearch }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4 mb-6">
      {/* Barre de recherche */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
        <input
          type="text"
          placeholder="Rechercher un modèle..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Bouton Nouveau modèle */}
      <button
        onClick={() => navigate("/builder")}
        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow-md"
      >
        <Plus className="w-5 h-5" />
        <span className="hidden sm:inline">Nouveau modèle</span>
      </button>
    </div>
  );
};
