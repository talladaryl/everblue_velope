export interface EditorItemBase {
  id: string;
  x: number;
  y: number;
}

export interface TextItem extends EditorItemBase {
  type: "text";
  text: string;
  fontSize: number;
  fontWeight: number;
  color: string;
  letterSpacing: number;
  textAlign: "left" | "center" | "right";
  fontFamily: string;
}

export interface ImageItem extends EditorItemBase {
  type: "image";
  src: string;
  width: number;
  height: number;
}

export type EditorItem = TextItem | ImageItem;

export interface Template {
  id: string;
  name: string;
  description: string;
  bgColor: string;
  items: EditorItem[];
  createdAt: Date;
  palette: string[];
  thumbnail?: string;
  isCustom?: boolean;
}

// Ajoutez ces types à votre fichier existant
export interface PaperTheme {
  id: string;
  name: string;
  type: 'color' | 'gradient' | 'texture' | 'pattern';
  value: string;
  category: 'mariage' | 'anniversaire' | 'bapteme' | 'entreprise' | 'autre';
  thumbnail: string;
}

export interface EnvelopeStyle {
  id: string;
  name: string;
  component: React.ComponentType<EnvelopePreviewProps>;
  thumbnail: string;
}

export interface ImageItem extends EditorItemBase {
  type: "image";
  src: string;
  width: number;
  height: number;
  isBackground?: boolean;
  opacity?: number;
}

// Variable pour les noms
export interface TextVariable {
  key: string;
  label: string;
  defaultValue: string;
}

// @/types/index.ts
export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  colors: string[];
  preview: string;
  bgColor: string;
  items: TemplateItem[];
  envelope?: {
    bgColor: string;
    items: TemplateItem[];
  };
  createdAt: Date;
  isCustom: boolean;
  popularity: number;
  hasEnvelope: boolean;
}

export interface TemplateItem {
  id: string;
  type: 'text' | 'image' | 'video' | 'gif';
  text?: string;
  src?: string;
  x: number;
  y: number;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  fontWeight?: string;
  textAlign?: string;
  width?: number;
  height?: number;
  borderRadius?: number;
  opacity?: number;
  rotation?: number;
  flipX?: boolean;
  flipY?: boolean;
  shadow?: {
    enabled: boolean;
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
  };
  filters?: {
    brightness: number;
    contrast: number;
    saturation: number;
    blur: number;
    grayscale: number;
  };
}