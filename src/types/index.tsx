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
