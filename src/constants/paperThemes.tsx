import { PaperTheme } from "@/types";

export const PAPER_THEMES: PaperTheme[] = [
  // Mariage
  {
    id: "wedding-gold",
    name: "Or Élégant",
    type: "gradient",
    value: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
    category: "mariage",
    thumbnail: "🎨",
  },
  {
    id: "wedding-rose",
    name: "Rose Romantique",
    type: "gradient",
    value: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    category: "mariage",
    thumbnail: "💖",
  },
  {
    id: "wedding-classic",
    name: "Blanc Classique",
    type: "color",
    value: "#FFFFFF",
    category: "mariage",
    thumbnail: "⚪",
  },

  // Anniversaire
  {
    id: "birthday-party",
    name: "Fête Colorée",
    type: "gradient",
    value: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    category: "anniversaire",
    thumbnail: "🎉",
  },
  {
    id: "birthday-fun",
    name: "Fun Vibrant",
    type: "gradient",
    value: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    category: "anniversaire",
    thumbnail: "🎈",
  },

  // Baptême
  {
    id: "baptism-blue",
    name: "Bleu Céleste",
    type: "gradient",
    value: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    category: "bapteme",
    thumbnail: "👶",
  },
  {
    id: "baptism-soft",
    name: "Pastel Doux",
    type: "gradient",
    value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    category: "bapteme",
    thumbnail: "✨",
  },

  // Entreprise
  {
    id: "corporate-blue",
    name: "Bleu Professionnel",
    type: "color",
    value: "#1e40af",
    category: "entreprise",
    thumbnail: "💼",
  },
  {
    id: "corporate-gray",
    name: "Gris Élégant",
    type: "gradient",
    value: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
    category: "entreprise",
    thumbnail: "🏢",
  },

  // Textures
  {
    id: "texture-paper",
    name: "Papier Texture",
    type: "texture",
    value:
      "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E\")",
    category: "autre",
    thumbnail: "📄",
  },
];
