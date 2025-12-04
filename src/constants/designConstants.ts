// Constantes pour les polices et modèles de design

// ============================================
// POLICES - 60+ polices organisées par catégorie
// ============================================

export const FONT_CATEGORIES = [
  {
    name: "Délirantes & Psychédéliques",
    fonts: [
      { value: "'Monoton', cursive", label: "Monoton - Néon 80s" },
      { value: "'Eater', cursive", label: "Eater - Zombie" },
      { value: "'Creepster', cursive", label: "Creepster - Monstre" },
      { value: "'Butcherman', cursive", label: "Butcherman - Horreur" },
      { value: "'Metal Mania', cursive", label: "Metal Mania - Heavy Metal" },
      { value: "'Fascinate Inline', cursive", label: "Fascinate - Art Déco" },
      { value: "'Nosifer', cursive", label: "Nosifer - Sang" },
      { value: "'Bungee Shade', cursive", label: "Bungee Shade - 3D" },
      { value: "'Rubik Moonrocks', cursive", label: "Rubik Moonrocks - Spatial" },
      { value: "'Rubik Wet Paint', cursive", label: "Rubik Wet Paint - Peinture" },
      { value: "'Rubik Glitch', cursive", label: "Rubik Glitch - Glitch" },
    ]
  },
  {
    name: "Gothique & Médiéval",
    fonts: [
      { value: "'UnifrakturMaguntia', cursive", label: "Fraktur - Gothique Allemand" },
      { value: "'UnifrakturCook', cursive", label: "Fraktur Cook - Gothique" },
      { value: "'MedievalSharp', cursive", label: "Medieval Sharp - Moyen-Âge" },
      { value: "'Pirata One', cursive", label: "Pirata One - Pirate" },
      { value: "'Almendra Display', cursive", label: "Almendra - Fantaisie" },
      { value: "'Uncial Antiqua', cursive", label: "Uncial Antiqua - Ancien" },
      { value: "'Cinzel', serif", label: "Cinzel - Romain" },
      { value: "'Cinzel Decorative', cursive", label: "Cinzel Decorative - Orné" },
    ]
  },
  {
    name: "Cartoon & BD",
    fonts: [
      { value: "'Bangers', cursive", label: "Bangers - Comics" },
      { value: "'Bungee', cursive", label: "Bungee - Bold" },
      { value: "'Bungee Inline', cursive", label: "Bungee Inline - Rayé" },
      { value: "'Fredoka One', cursive", label: "Fredoka - Rond" },
      { value: "'Luckiest Guy', cursive", label: "Luckiest Guy - Fun" },
      { value: "'Permanent Marker', cursive", label: "Permanent Marker - Marqueur" },
      { value: "'Rock Salt', cursive", label: "Rock Salt - Craie" },
      { value: "'Caveat', cursive", label: "Caveat - Manuscrit" },
      { value: "'Kalam', cursive", label: "Kalam - Écriture" },
      { value: "'Patrick Hand', cursive", label: "Patrick Hand - Main" },
    ]
  },
  {
    name: "Western & Vintage",
    fonts: [
      { value: "'Rye', cursive", label: "Rye - Western" },
      { value: "'Frijole', cursive", label: "Frijole - Mexicain" },
      { value: "'Smokum', cursive", label: "Smokum - Cowboy" },
    ]
  },
  {
    name: "Futuriste & Tech",
    fonts: [
      { value: "'Orbitron', sans-serif", label: "Orbitron - Sci-Fi" },
      { value: "'Audiowide', cursive", label: "Audiowide - Électro" },
      { value: "'Rajdhani', sans-serif", label: "Rajdhani - Tech" },
      { value: "'Exo 2', sans-serif", label: "Exo 2 - Futur" },
      { value: "'Teko', sans-serif", label: "Teko - Sport" },
      { value: "'Russo One', sans-serif", label: "Russo One - Militaire" },
      { value: "'Black Ops One', cursive", label: "Black Ops - Armée" },
      { value: "'Press Start 2P', cursive", label: "Press Start - Pixel" },
      { value: "'VT323', monospace", label: "VT323 - Terminal" },
      { value: "'Share Tech Mono', monospace", label: "Share Tech - Code" },
    ]
  },
  {
    name: "Calligraphie Élégante",
    fonts: [
      { value: "'Great Vibes', cursive", label: "Great Vibes - Élégant" },
      { value: "'Dancing Script', cursive", label: "Dancing Script - Dansant" },
      { value: "'Pacifico', cursive", label: "Pacifico - Décontracté" },
      { value: "'Lobster', cursive", label: "Lobster - Rétro" },
      { value: "'Satisfy', cursive", label: "Satisfy - Fluide" },
      { value: "'Sacramento', cursive", label: "Sacramento - Script" },
      { value: "'Tangerine', cursive", label: "Tangerine - Fin" },
      { value: "'Alex Brush', cursive", label: "Alex Brush - Pinceau" },
      { value: "'Allura', cursive", label: "Allura - Romantique" },
      { value: "'Pinyon Script', cursive", label: "Pinyon Script - Classique" },
      { value: "'Italianno', cursive", label: "Italianno - Italien" },
      { value: "'Marck Script', cursive", label: "Marck Script - Signature" },
      { value: "'Niconne', cursive", label: "Niconne - Doux" },
      { value: "'Petit Formal Script', cursive", label: "Petit Formal - Formel" },
      { value: "'Herr Von Muellerhoff', cursive", label: "Herr Von - Aristocrate" },
      { value: "'Mrs Saint Delafield', cursive", label: "Mrs Saint - Victorien" },
      { value: "'Rouge Script', cursive", label: "Rouge Script - Français" },
      { value: "'Sevillana', cursive", label: "Sevillana - Espagnol" },
    ]
  },
  {
    name: "Professionnelles",
    fonts: [
      { value: "'Inter', sans-serif", label: "Inter - Moderne" },
      { value: "'Poppins', sans-serif", label: "Poppins - Géométrique" },
      { value: "'Montserrat', sans-serif", label: "Montserrat - Élégant" },
      { value: "'Space Grotesk', sans-serif", label: "Space Grotesk - Tech" },
      { value: "'Playfair Display', serif", label: "Playfair - Luxe" },
      { value: "'Lora', serif", label: "Lora - Classique" },
      { value: "'Cormorant Garamond', serif", label: "Cormorant - Raffiné" },
    ]
  },
];

// Liste plate de toutes les polices
export const ALL_FONTS = FONT_CATEGORIES.flatMap(cat => cat.fonts);

// ============================================
// IMAGES CDN - Haute qualité depuis Unsplash
// ============================================
export const IMAGES = {
  birthday1: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80",
  birthday2: "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?w=600&q=80",
  wedding1: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80",
  wedding2: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80",
  flowers1: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600&q=80",
  flowers2: "https://images.unsplash.com/photo-1518882605630-8eb294a1c6c4?w=600&q=80",
  christmas1: "https://images.unsplash.com/photo-1512389142860-9c449e58a814?w=600&q=80",
  easter1: "https://images.unsplash.com/photo-1521967906867-14ec9d64bee8?w=600&q=80",
  baptism1: "https://images.unsplash.com/photo-1544776193-352d25ca82cd?w=600&q=80",
  elegant1: "https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=600&q=80",
  paper1: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  nature1: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80",
};


// ============================================
// MODÈLES PROFESSIONNELS - 20+ designs
// ============================================

export interface ProfessionalTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  layout: string;
  bgColor: string;
  borderStyle: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
  image?: string;
  imagePosition?: string;
  textShadow?: string;
  boxShadow?: string;
  items: any[];
  editable: boolean;
}

export const PROFESSIONAL_TEMPLATES: ProfessionalTemplate[] = [
  // ========== ANNIVERSAIRE ==========
  {
    id: "pro-birthday-1",
    name: "Anniversaire Élégant",
    description: "Design split avec photo et message festif",
    category: "birthday",
    layout: "split-left",
    bgColor: "#FFF8E7",
    borderStyle: "solid",
    borderColor: "#D4AF37",
    borderWidth: 4,
    borderRadius: 0,
    image: IMAGES.birthday1,
    imagePosition: "left",
    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
    boxShadow: "0 10px 40px rgba(0,0,0,0.15), inset 0 0 100px rgba(255,255,255,0.5)",
    items: [
      { id: "t1", type: "text", text: "Joyeux Anniversaire!", x: 320, y: 80, fontSize: 32, color: "#8B4513", fontFamily: "'Great Vibes', cursive", fontWeight: "bold", textAlign: "center" },
      { id: "t2", type: "text", text: "Vous êtes invité(e)", x: 320, y: 150, fontSize: 18, color: "#5D4037", fontFamily: "'Playfair Display', serif", textAlign: "center" },
    ],
    editable: true,
  },
  {
    id: "pro-birthday-2",
    name: "Fête Colorée",
    description: "Design festif avec ballons",
    category: "birthday",
    layout: "split-right",
    bgColor: "#FFE4E1",
    borderStyle: "double",
    borderColor: "#FF69B4",
    borderWidth: 6,
    borderRadius: 16,
    image: IMAGES.birthday2,
    imagePosition: "right",
    boxShadow: "0 8px 32px rgba(255,105,180,0.3)",
    items: [
      { id: "t1", type: "text", text: "C'est la Fête!", x: 40, y: 60, fontSize: 36, color: "#FF1493", fontFamily: "'Bangers', cursive", fontWeight: "bold", textAlign: "left" },
      { id: "t2", type: "text", text: "{{age}} ans", x: 40, y: 130, fontSize: 48, color: "#FF69B4", fontFamily: "'Fredoka One', cursive", textAlign: "left" },
    ],
    editable: true,
  },
  {
    id: "pro-birthday-3",
    name: "Anniversaire Chic",
    description: "Style minimaliste sophistiqué",
    category: "birthday",
    layout: "bordered",
    bgColor: "#FFFAF0",
    borderStyle: "solid",
    borderColor: "#2F4F4F",
    borderWidth: 2,
    borderRadius: 0,
    boxShadow: "0 4px 20px rgba(0,0,0,0.1), inset 0 0 60px rgba(255,250,240,0.8)",
    items: [
      { id: "t1", type: "text", text: "HAPPY BIRTHDAY", x: 300, y: 100, fontSize: 42, color: "#2F4F4F", fontFamily: "'Cinzel', serif", fontWeight: "bold", textAlign: "center" },
      { id: "t2", type: "text", text: "{{name}}", x: 300, y: 180, fontSize: 28, color: "#D4AF37", fontFamily: "'Great Vibes', cursive", textAlign: "center" },
    ],
    editable: true,
  },

  // ========== MARIAGE ==========
  {
    id: "pro-wedding-1",
    name: "Mariage Romantique",
    description: "Design élégant avec photo",
    category: "wedding",
    layout: "split-left",
    bgColor: "#FDF5E6",
    borderStyle: "double",
    borderColor: "#D4AF37",
    borderWidth: 8,
    borderRadius: 0,
    image: IMAGES.wedding1,
    imagePosition: "left",
    boxShadow: "0 15px 50px rgba(0,0,0,0.2), inset 0 0 80px rgba(253,245,230,0.9)",
    items: [
      { id: "t1", type: "text", text: "Save the Date", x: 350, y: 60, fontSize: 24, color: "#8B7355", fontFamily: "'Pinyon Script', cursive", textAlign: "center" },
      { id: "t2", type: "text", text: "Marie & Jean", x: 350, y: 120, fontSize: 38, color: "#5D4037", fontFamily: "'Great Vibes', cursive", fontWeight: "bold", textAlign: "center" },
      { id: "t3", type: "text", text: "{{date}}", x: 350, y: 200, fontSize: 20, color: "#D4AF37", fontFamily: "'Cinzel', serif", textAlign: "center" },
    ],
    editable: true,
  },
  {
    id: "pro-wedding-2",
    name: "Mariage Champêtre",
    description: "Style rustique avec fleurs",
    category: "wedding",
    layout: "overlay",
    bgColor: "#F5F5DC",
    borderStyle: "solid",
    borderColor: "#8FBC8F",
    borderWidth: 3,
    borderRadius: 8,
    image: IMAGES.flowers1,
    imagePosition: "background",
    boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
    items: [
      { id: "t1", type: "text", text: "Nous nous marions", x: 300, y: 100, fontSize: 36, color: "#FFFFFF", fontFamily: "'Sacramento', cursive", fontWeight: "bold", textAlign: "center", textShadow: "2px 2px 8px rgba(0,0,0,0.7)" },
    ],
    editable: true,
  },
  {
    id: "pro-wedding-3",
    name: "Mariage Moderne",
    description: "Design épuré contemporain",
    category: "wedding",
    layout: "minimal",
    bgColor: "#FFFFFF",
    borderStyle: "solid",
    borderColor: "#000000",
    borderWidth: 1,
    borderRadius: 0,
    boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
    items: [
      { id: "t1", type: "text", text: "WEDDING", x: 300, y: 80, fontSize: 14, color: "#000000", fontFamily: "'Space Grotesk', sans-serif", textAlign: "center" },
      { id: "t2", type: "text", text: "EMMA & LUCAS", x: 300, y: 150, fontSize: 48, color: "#000000", fontFamily: "'Cinzel', serif", fontWeight: "bold", textAlign: "center" },
    ],
    editable: true,
  },

  // ========== BAPTÊME ==========
  {
    id: "pro-baptism-1",
    name: "Baptême Doux",
    description: "Design tendre tons pastel",
    category: "baptism",
    layout: "split-right",
    bgColor: "#E6F3FF",
    borderStyle: "solid",
    borderColor: "#87CEEB",
    borderWidth: 3,
    borderRadius: 20,
    image: IMAGES.baptism1,
    imagePosition: "right",
    boxShadow: "0 8px 30px rgba(135,206,235,0.3), inset 0 0 50px rgba(255,255,255,0.8)",
    items: [
      { id: "t1", type: "text", text: "Mon Baptême", x: 40, y: 80, fontSize: 32, color: "#4682B4", fontFamily: "'Dancing Script', cursive", fontWeight: "bold", textAlign: "left" },
      { id: "t2", type: "text", text: "{{name}}", x: 40, y: 150, fontSize: 28, color: "#5F9EA0", fontFamily: "'Allura', cursive", textAlign: "left" },
    ],
    editable: true,
  },
  {
    id: "pro-baptism-2",
    name: "Baptême Rose",
    description: "Design féminin délicat",
    category: "baptism",
    layout: "bordered",
    bgColor: "#FFF0F5",
    borderStyle: "dashed",
    borderColor: "#FFB6C1",
    borderWidth: 3,
    borderRadius: 30,
    boxShadow: "0 10px 40px rgba(255,182,193,0.3)",
    items: [
      { id: "t1", type: "text", text: "Baptême de", x: 300, y: 100, fontSize: 24, color: "#DB7093", fontFamily: "'Satisfy', cursive", textAlign: "center" },
      { id: "t2", type: "text", text: "{{name}}", x: 300, y: 160, fontSize: 42, color: "#C71585", fontFamily: "'Great Vibes', cursive", fontWeight: "bold", textAlign: "center" },
    ],
    editable: true,
  },

  // ========== PÂQUES ==========
  {
    id: "pro-easter-1",
    name: "Pâques Printanier",
    description: "Design coloré festif",
    category: "easter",
    layout: "split-left",
    bgColor: "#FFFACD",
    borderStyle: "solid",
    borderColor: "#9ACD32",
    borderWidth: 4,
    borderRadius: 12,
    image: IMAGES.easter1,
    imagePosition: "left",
    boxShadow: "0 8px 30px rgba(154,205,50,0.3)",
    items: [
      { id: "t1", type: "text", text: "Joyeuses Pâques!", x: 350, y: 100, fontSize: 36, color: "#6B8E23", fontFamily: "'Pacifico', cursive", fontWeight: "bold", textAlign: "center" },
    ],
    editable: true,
  },
  {
    id: "pro-easter-2",
    name: "Pâques Élégant",
    description: "Style raffiné",
    category: "easter",
    layout: "bordered",
    bgColor: "#F0FFF0",
    borderStyle: "double",
    borderColor: "#228B22",
    borderWidth: 6,
    borderRadius: 0,
    boxShadow: "0 10px 40px rgba(34,139,34,0.2)",
    items: [
      { id: "t1", type: "text", text: "HAPPY EASTER", x: 300, y: 120, fontSize: 38, color: "#228B22", fontFamily: "'Cinzel Decorative', cursive", fontWeight: "bold", textAlign: "center" },
    ],
    editable: true,
  },

  // ========== NOËL ==========
  {
    id: "pro-christmas-1",
    name: "Noël Traditionnel",
    description: "Design classique rouge et or",
    category: "christmas",
    layout: "split-right",
    bgColor: "#8B0000",
    borderStyle: "solid",
    borderColor: "#FFD700",
    borderWidth: 5,
    borderRadius: 0,
    image: IMAGES.christmas1,
    imagePosition: "right",
    boxShadow: "0 15px 50px rgba(139,0,0,0.4)",
    items: [
      { id: "t1", type: "text", text: "Joyeux Noël", x: 40, y: 100, fontSize: 42, color: "#FFD700", fontFamily: "'Great Vibes', cursive", fontWeight: "bold", textAlign: "left" },
      { id: "t2", type: "text", text: "2025", x: 40, y: 180, fontSize: 28, color: "#FFFFFF", fontFamily: "'Cinzel', serif", textAlign: "left" },
    ],
    editable: true,
  },
  {
    id: "pro-christmas-2",
    name: "Noël Moderne",
    description: "Design épuré contemporain",
    category: "christmas",
    layout: "minimal",
    bgColor: "#1C1C1C",
    borderStyle: "solid",
    borderColor: "#C0C0C0",
    borderWidth: 2,
    borderRadius: 0,
    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
    items: [
      { id: "t1", type: "text", text: "MERRY", x: 300, y: 100, fontSize: 48, color: "#FFFFFF", fontFamily: "'Orbitron', sans-serif", fontWeight: "bold", textAlign: "center" },
      { id: "t2", type: "text", text: "CHRISTMAS", x: 300, y: 170, fontSize: 32, color: "#C0C0C0", fontFamily: "'Orbitron', sans-serif", textAlign: "center" },
    ],
    editable: true,
  },

  // ========== ÉLÉGANT ==========
  {
    id: "pro-elegant-1",
    name: "Invitation Royale",
    description: "Design luxueux bordure dorée",
    category: "elegant",
    layout: "bordered",
    bgColor: "#1a1a2e",
    borderStyle: "double",
    borderColor: "#D4AF37",
    borderWidth: 8,
    borderRadius: 0,
    boxShadow: "0 20px 60px rgba(0,0,0,0.4), inset 0 0 100px rgba(212,175,55,0.1)",
    items: [
      { id: "t1", type: "text", text: "Vous êtes invité", x: 300, y: 100, fontSize: 32, color: "#D4AF37", fontFamily: "'Cinzel Decorative', cursive", fontWeight: "bold", textAlign: "center" },
      { id: "t2", type: "text", text: "{{event}}", x: 300, y: 180, fontSize: 24, color: "#FFFFFF", fontFamily: "'Playfair Display', serif", textAlign: "center" },
    ],
    editable: true,
  },
  {
    id: "pro-elegant-2",
    name: "Carte Prestige",
    description: "Design premium texture papier",
    category: "elegant",
    layout: "overlay",
    bgColor: "#F5F5F5",
    borderStyle: "solid",
    borderColor: "#2F2F2F",
    borderWidth: 1,
    borderRadius: 0,
    image: IMAGES.paper1,
    imagePosition: "background",
    boxShadow: "0 15px 50px rgba(0,0,0,0.2)",
    items: [
      { id: "t1", type: "text", text: "INVITATION", x: 300, y: 120, fontSize: 36, color: "#2F2F2F", fontFamily: "'Cinzel', serif", fontWeight: "bold", textAlign: "center" },
    ],
    editable: true,
  },

  // ========== NATURE ==========
  {
    id: "pro-nature-1",
    name: "Jardin Fleuri",
    description: "Design avec fleurs",
    category: "nature",
    layout: "split-left",
    bgColor: "#F0FFF0",
    borderStyle: "solid",
    borderColor: "#228B22",
    borderWidth: 3,
    borderRadius: 8,
    image: IMAGES.flowers2,
    imagePosition: "left",
    boxShadow: "0 10px 40px rgba(34,139,34,0.2)",
    items: [
      { id: "t1", type: "text", text: "Garden Party", x: 350, y: 100, fontSize: 36, color: "#228B22", fontFamily: "'Sacramento', cursive", fontWeight: "bold", textAlign: "center" },
    ],
    editable: true,
  },
  {
    id: "pro-nature-2",
    name: "Forêt Enchantée",
    description: "Design nature mystique",
    category: "nature",
    layout: "overlay",
    bgColor: "#2F4F4F",
    borderStyle: "solid",
    borderColor: "#8FBC8F",
    borderWidth: 4,
    borderRadius: 0,
    image: IMAGES.nature1,
    imagePosition: "background",
    boxShadow: "0 15px 50px rgba(0,0,0,0.3)",
    items: [
      { id: "t1", type: "text", text: "Into the Wild", x: 300, y: 120, fontSize: 42, color: "#FFFFFF", fontFamily: "'Permanent Marker', cursive", fontWeight: "bold", textAlign: "center", textShadow: "3px 3px 10px rgba(0,0,0,0.8)" },
    ],
    editable: true,
  },

  // ========== MINIMALISTE ==========
  {
    id: "pro-minimal-1",
    name: "Pure White",
    description: "Design épuré blanc",
    category: "minimal",
    layout: "minimal",
    bgColor: "#FFFFFF",
    borderStyle: "solid",
    borderColor: "#E0E0E0",
    borderWidth: 1,
    borderRadius: 0,
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    items: [
      { id: "t1", type: "text", text: "INVITATION", x: 300, y: 150, fontSize: 24, color: "#333333", fontFamily: "'Inter', sans-serif", fontWeight: "bold", textAlign: "center" },
    ],
    editable: true,
  },
  {
    id: "pro-minimal-2",
    name: "Dark Mode",
    description: "Design sombre élégant",
    category: "minimal",
    layout: "minimal",
    bgColor: "#121212",
    borderStyle: "solid",
    borderColor: "#333333",
    borderWidth: 1,
    borderRadius: 0,
    boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
    items: [
      { id: "t1", type: "text", text: "EVENT", x: 300, y: 150, fontSize: 32, color: "#FFFFFF", fontFamily: "'Space Grotesk', sans-serif", fontWeight: "bold", textAlign: "center" },
    ],
    editable: true,
  },
];

// Types de bordures disponibles
export const BORDER_STYLES = [
  { value: "solid", label: "Solide" },
  { value: "dashed", label: "Tirets" },
  { value: "dotted", label: "Points" },
  { value: "double", label: "Double" },
  { value: "groove", label: "Rainure" },
  { value: "ridge", label: "Crête" },
  { value: "inset", label: "Incrusté" },
  { value: "outset", label: "Relief" },
];
