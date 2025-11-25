/**
 * Utilitaire pour normaliser et corriger les modèles de templates
 */

export interface NormalizedItem {
  id: string;
  type: "text" | "image" | "video" | "gif" | "shape";
  x: number;
  y: number;
  width: number;
  height: number;
  // Propriétés texte
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number | string;
  color?: string;
  textAlign?: "left" | "center" | "right";
  textShadow?: string;
  letterSpacing?: number;
  // Propriétés image/vidéo
  src?: string;
  borderRadius?: number;
  opacity?: number;
  rotation?: number;
  flipX?: boolean;
  flipY?: boolean;
  // Propriétés vidéo
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  // Filtres
  filters?: {
    brightness?: number;
    contrast?: number;
    saturation?: number;
    blur?: number;
    grayscale?: number;
  };
  // Ombre
  shadow?: {
    enabled: boolean;
    color?: string;
    blur?: number;
    offsetX?: number;
    offsetY?: number;
  };
}

/**
 * Normalise un item pour s'assurer qu'il a toutes les propriétés requises
 */
export function normalizeItem(item: any): NormalizedItem {
  const normalized: NormalizedItem = {
    id: item.id || `item-${Date.now()}`,
    type: item.type || "text",
    x: item.x ?? 0,
    y: item.y ?? 0,
    width: item.width ?? (item.type === "text" ? 200 : 150),
    height: item.height ?? (item.type === "text" ? 50 : 150),
  };

  // Propriétés texte
  if (item.type === "text") {
    normalized.text = item.text || "Texte";
    normalized.fontSize = item.fontSize ?? 16;
    normalized.fontFamily = item.fontFamily || "Arial, sans-serif";
    normalized.fontWeight = item.fontWeight ?? 400;
    normalized.color = item.color || "#000000";
    normalized.textAlign = item.textAlign || "left";
    normalized.textShadow = item.textShadow || "none";
    normalized.letterSpacing = item.letterSpacing ?? 0;
  }

  // Propriétés image/vidéo
  if (item.type === "image" || item.type === "gif" || item.type === "video") {
    normalized.src = item.src || "";
    normalized.borderRadius = item.borderRadius ?? 0;
    normalized.opacity = item.opacity ?? 100;
    normalized.rotation = item.rotation ?? 0;
    normalized.flipX = item.flipX ?? false;
    normalized.flipY = item.flipY ?? false;
  }

  // Propriétés vidéo
  if (item.type === "video") {
    normalized.autoPlay = item.autoPlay ?? false;
    normalized.loop = item.loop ?? false;
    normalized.muted = item.muted ?? true;
  }

  // Filtres
  normalized.filters = {
    brightness: item.filters?.brightness ?? 100,
    contrast: item.filters?.contrast ?? 100,
    saturation: item.filters?.saturation ?? 100,
    blur: item.filters?.blur ?? 0,
    grayscale: item.filters?.grayscale ?? 0,
  };

  // Ombre
  normalized.shadow = {
    enabled: item.shadow?.enabled ?? false,
    color: item.shadow?.color || "#000000",
    blur: item.shadow?.blur ?? 5,
    offsetX: item.shadow?.offsetX ?? 2,
    offsetY: item.shadow?.offsetY ?? 2,
  };

  return normalized;
}

/**
 * Normalise tous les items d'un modèle
 */
export function normalizeItems(items: any[]): NormalizedItem[] {
  if (!Array.isArray(items)) {
    return [];
  }
  return items.map(normalizeItem);
}

/**
 * Valide qu'un item a les propriétés minimales requises
 */
export function validateItem(item: NormalizedItem): boolean {
  if (!item.id || !item.type) {
    return false;
  }

  if (item.type === "text") {
    return !!item.text && item.fontSize !== undefined && item.color !== undefined;
  }

  if (item.type === "image" || item.type === "gif" || item.type === "video") {
    return !!item.src && item.width !== undefined && item.height !== undefined;
  }

  return true;
}

/**
 * Valide tous les items d'un modèle
 */
export function validateItems(items: NormalizedItem[]): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  items.forEach((item, index) => {
    if (!validateItem(item)) {
      errors.push(`Item ${index} (${item.type}) est invalide`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Crée un style CSS pour un item normalisé
 */
export function getItemStyle(item: NormalizedItem): React.CSSProperties {
  const style: React.CSSProperties = {
    position: "absolute",
    left: `${item.x}px`,
    top: `${item.y}px`,
    width: `${item.width}px`,
    height: `${item.height}px`,
    opacity: (item.opacity ?? 100) / 100,
    transform: `
      rotate(${item.rotation ?? 0}deg)
      scaleX(${item.flipX ? -1 : 1})
      scaleY(${item.flipY ? -1 : 1})
    `,
    filter: `
      brightness(${item.filters?.brightness ?? 100}%)
      contrast(${item.filters?.contrast ?? 100}%)
      saturate(${item.filters?.saturation ?? 100}%)
      blur(${item.filters?.blur ?? 0}px)
      grayscale(${item.filters?.grayscale ?? 0}%)
      ${
        item.shadow?.enabled
          ? `drop-shadow(${item.shadow.offsetX}px ${item.shadow.offsetY}px ${item.shadow.blur}px ${item.shadow.color})`
          : ""
      }
    `,
  };

  if (item.type === "text") {
    return {
      ...style,
      color: item.color,
      fontSize: `${item.fontSize}px`,
      fontFamily: item.fontFamily,
      fontWeight: item.fontWeight,
      textAlign: item.textAlign,
      textShadow: item.textShadow,
      letterSpacing: `${item.letterSpacing}px`,
      display: "flex",
      alignItems: "center",
      justifyContent: item.textAlign === "center" ? "center" : "flex-start",
      padding: "8px",
      wordWrap: "break-word",
      whiteSpace: "pre-wrap",
    };
  }

  if (item.type === "image" || item.type === "gif") {
    return {
      ...style,
      borderRadius: `${item.borderRadius}px`,
      objectFit: "cover",
    };
  }

  if (item.type === "video") {
    return {
      ...style,
      borderRadius: `${item.borderRadius}px`,
      objectFit: "cover",
    };
  }

  return style;
}
