// constants/fonts.ts - Collection de polices extravagantes et créatives

// Polices système et Google Fonts organisées par catégorie
export const FONT_CATEGORIES = {
  psychedelic: {
    name: "Délirantes & Psychédéliques",
    fonts: [
      { name: "Jokerman", value: "'Jokerman', fantasy", description: "Grunge déstructuré avec ombres flottantes" },
      { name: "Chiller", value: "'Chiller', cursive", description: "Effet sang gouttant/épouvante" },
      { name: "Ravie", value: "'Ravie', fantasy", description: "Bulles explosives 3D" },
      { name: "Algerian", value: "'Algerian', fantasy", description: "Style arabe/kitsch années 70" },
      { name: "Bauhaus 93", value: "'Bauhaus 93', fantasy", description: "Design Bauhaus poussé à l'extrême" },
      { name: "Desdemona", value: "'Desdemona', fantasy", description: "Gothique baroque surchargé" },
      { name: "Stencil", value: "'Stencil', fantasy", description: "Militaire pixelisé extrême" },
      { name: "Blackletter", value: "'Blackletter', serif", description: "Gothique médiéval extrême" },
      { name: "Old English Text MT", value: "'Old English Text MT', serif", description: "Moyen-Âge dramatique" },
      { name: "Lucida Blackletter", value: "'Lucida Blackletter', serif", description: "Gothique cérémonial" },
    ]
  },
  distorted: {
    name: "Déformées & Distordues",
    fonts: [
      { name: "Goudy Stout", value: "'Goudy Stout', serif", description: "Énorme, obèse, déformée" },
      { name: "Braggadocio", value: "'Braggadocio', fantasy", description: "Art déco explosif" },
      { name: "Kino MT", value: "'Kino MT', fantasy", description: "Cinéma expressionniste allemand" },
      { name: "Agency FB", value: "'Agency FB', sans-serif", description: "Machine à écrire psychédélique" },
      { name: "Bernhard Fashion", value: "'Bernhard Fashion', serif", description: "Modèle des années 20 déjanté" },
      { name: "Castellar", value: "'Castellar', serif", description: "Monumentale romaine" },
      { name: "Pristina", value: "'Pristina', cursive", description: "Lianes végétales entrelacées" },
      { name: "Viner Hand ITC", value: "'Viner Hand ITC', cursive", description: "Écriture ivre/tremblante" },
      { name: "Tempus Sans ITC", value: "'Tempus Sans ITC', fantasy", description: "Pixel art rétro extrême" },
      { name: "Vladimir Script", value: "'Vladimir Script', cursive", description: "Calligraphie slave ornée" },
    ]
  },
  cartoon: {
    name: "Cartoon & BD Extrêmes",
    fonts: [
      { name: "Blippo", value: "'Blippo', fantasy", description: "Ronds bulles extrêmes (années 70)" },
      { name: "Hobo", value: "'Hobo Std', fantasy", description: "Vagabond déglinguée" },
      { name: "Arnold Böcklin", value: "'Arnold Boecklin', fantasy", description: "Style Art Nouveau halluciné" },
      { name: "Frankfurter", value: "'Frankfurter', fantasy", description: "Comics allemand psychédélique" },
      { name: "Brush Script MT", value: "'Brush Script MT', cursive", description: "Pinceau éclaboussé" },
      { name: "Charlemagne", value: "'Charlemagne Std', serif", description: "Carolingien dramatique" },
      { name: "Cooper Black", value: "'Cooper Black', serif", description: "Obèse vintage extrême" },
      { name: "Neuland", value: "'Neuland', fantasy", description: "Art primitif africain" },
      { name: "Peignot", value: "'Peignot', sans-serif", description: "Décontractée délirante" },
      { name: "Whimsy", value: "'Whimsy', fantasy", description: "Fantaisie enfantine exagérée" },
    ]
  },
  gothic: {
    name: "Gothique & Ténébreuses",
    fonts: [
      { name: "Cloister Black", value: "'Cloister Black', serif", description: "Manuscrit démoniaque" },
      { name: "Fette Fraktur", value: "'Fette Fraktur', serif", description: "Gothique allemand intense" },
      { name: "Lucida Calligraphy", value: "'Lucida Calligraphy', cursive", description: "Calligraphie gothique" },
      { name: "Matura MT Script", value: "'Matura MT Script Capitals', cursive", description: "Capitale gothique ornée" },
      { name: "Oldtown", value: "'Oldtown', serif", description: "Médiéval villageois" },
      { name: "Parchment", value: "'Parchment', fantasy", description: "Parchemin brûlé" },
      { name: "Blackmoor", value: "'Blackmoor', serif", description: "Ténébreuse moyenâgeuse" },
      { name: "Gothic", value: "'Century Gothic', sans-serif", description: "Gothique simple mais puissant" },
      { name: "Engravers MT", value: "'Engravers MT', serif", description: "Gravé dans la pierre" },
      { name: "Curlz MT", value: "'Curlz MT', fantasy", description: "Boucles gothiques" },
    ]
  },
  modern: {
    name: "Modernes Extrêmes",
    fonts: [
      { name: "Bank Gothic", value: "'Bank Gothic', sans-serif", description: "Futuriste militaire" },
      { name: "Eurostile", value: "'Eurostile', sans-serif", description: "Science-fiction années 60" },
      { name: "Microgramma", value: "'Microgramma', sans-serif", description: "Futuriste géométrique" },
      { name: "OCR A Extended", value: "'OCR A Extended', monospace", description: "Lecteur optique déformé" },
      { name: "Techno", value: "'Share Tech Mono', monospace", description: "Électronique numérique" },
      { name: "Wide Latin", value: "'Wide Latin', serif", description: "Étirée à l'extrême" },
      { name: "Britannic Bold", value: "'Britannic Bold', sans-serif", description: "British pompier" },
      { name: "Impact", value: "'Impact', sans-serif", description: "Impact maximum" },
      { name: "Haettenschweiler", value: "'Haettenschweiler', sans-serif", description: "Condensée extrême" },
      { name: "Arial Black", value: "'Arial Black', sans-serif", description: "Noir massif" },
    ]
  },
  googleFonts: {
    name: "Google Fonts Délirantes",
    fonts: [
      { name: "Monoton", value: "'Monoton', cursive", description: "Néon années 80 psychédélique", cdn: true },
      { name: "UnifrakturMaguntia", value: "'UnifrakturMaguntia', cursive", description: "Gothique allemand pur", cdn: true },
      { name: "Eater", value: "'Eater', cursive", description: "Zombie/sanglant", cdn: true },
      { name: "Rye", value: "'Rye', cursive", description: "Western spaghetti extrême", cdn: true },
      { name: "Frijole", value: "'Frijole', cursive", description: "Cartoon western déjanté", cdn: true },
      { name: "Smokum", value: "'Smokum', cursive", description: "Cowboy vintage usé", cdn: true },
      { name: "Creepster", value: "'Creepster', cursive", description: "Monstre poilu", cdn: true },
      { name: "Butcherman", value: "'Butcherman', cursive", description: "Horreur gore", cdn: true },
      { name: "Metal Mania", value: "'Metal Mania', cursive", description: "Heavy metal extrême", cdn: true },
      { name: "Fascinate Inline", value: "'Fascinate Inline', cursive", description: "Art déco psychédélique", cdn: true },
    ]
  },
  classic: {
    name: "Classiques Élégantes",
    fonts: [
      { name: "Playfair Display", value: "'Playfair Display', serif", description: "Élégance éditoriale", cdn: true },
      { name: "Dancing Script", value: "'Dancing Script', cursive", description: "Script dansant", cdn: true },
      { name: "Great Vibes", value: "'Great Vibes', cursive", description: "Calligraphie romantique", cdn: true },
      { name: "Pacifico", value: "'Pacifico', cursive", description: "Surf vintage", cdn: true },
      { name: "Lobster", value: "'Lobster', cursive", description: "Script bold", cdn: true },
      { name: "Satisfy", value: "'Satisfy', cursive", description: "Signature élégante", cdn: true },
      { name: "Sacramento", value: "'Sacramento', cursive", description: "Script fin", cdn: true },
      { name: "Tangerine", value: "'Tangerine', cursive", description: "Calligraphie délicate", cdn: true },
      { name: "Alex Brush", value: "'Alex Brush', cursive", description: "Pinceau artistique", cdn: true },
      { name: "Allura", value: "'Allura', cursive", description: "Script romantique", cdn: true },
    ]
  }
};

// Liste plate de toutes les polices pour le sélecteur
export const ALL_FONTS = Object.values(FONT_CATEGORIES).flatMap(cat => cat.fonts);

// Google Fonts CDN URLs
export const GOOGLE_FONTS_URL = "https://fonts.googleapis.com/css2?family=" + 
  ALL_FONTS
    .filter(f => f.cdn)
    .map(f => f.name.replace(/ /g, '+'))
    .join('&family=') + 
  "&display=swap";

// Polices par défaut (système)
export const DEFAULT_FONTS = [
  { name: "Arial", value: "Arial, sans-serif" },
  { name: "Helvetica", value: "Helvetica, sans-serif" },
  { name: "Times New Roman", value: "'Times New Roman', serif" },
  { name: "Georgia", value: "Georgia, serif" },
  { name: "Verdana", value: "Verdana, sans-serif" },
  { name: "Courier New", value: "'Courier New', monospace" },
  { name: "Comic Sans MS", value: "'Comic Sans MS', cursive" },
  { name: "Trebuchet MS", value: "'Trebuchet MS', sans-serif" },
  { name: "Palatino", value: "'Palatino Linotype', serif" },
  { name: "Garamond", value: "Garamond, serif" },
];
