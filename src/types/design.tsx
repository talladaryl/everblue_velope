// types/design.ts
export interface DesignTemplate {
  id: string;
  name: string;
  colors: string[];
  pattern: "split" | "gradient" | "diagonal" | "vertical";
  message: string;
  style: string;
  category: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export interface DesignContextType {
  items: any[];
  setItems: (items: any[]) => void;
  bgColor: string;
  setBgColor: (color: string) => void;
  bgImage: string | null;
  setBgImage: (image: string | null) => void;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  addText: () => void;
  removeSelected: () => void;
}
