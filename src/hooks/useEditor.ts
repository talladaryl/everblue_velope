import { useRef, useState, useCallback } from "react";
import { generateId } from "@/utils/editor";

export type CanvasItemType = "text" | "image" | "video";

export interface CanvasItem {
id: string;
type: CanvasItemType;
x: number;
y: number;
width: number;
height: number;
rotation: number;
opacity: number;
text?: string;
fontSize?: number;
color?: string;
fontFamily?: string;
fontWeight?: string;
textAlign?: string;
src?: string;
filters?: {
brightness: number;
contrast: number;
grayscale: number;
blur: number;
saturation: number;
};
customCss?: string;
zIndex?: number;
}

export default function useEditor(initialItems: CanvasItem[] = []) {
const canvasRef = useRef<HTMLDivElement | null>(null);
const [items, setItems] = useState<CanvasItem[]>(initialItems);
const [selectedId, setSelectedId] = useState<string | null>(null);
const [bgColor, setBgColor] = useState<string>("#ffffff");
const [bgImage, setBgImage] = useState<string | null>(null);

const dragState = useRef<{ id?: string; offsetX?: number; offsetY?: number }>({});

const selectedItem = items.find((i) => i.id === selectedId) || null;

const addItem = useCallback((type: CanvasItemType) => {
const id = generateId(type);
let newItem: CanvasItem = {
id,
type,
x: 50,
y: 50,
width: 200,
height: type === "text" ? 50 : 200,
rotation: 0,
opacity: 1,
filters: { brightness: 100, contrast: 100, grayscale: 0, blur: 0, saturation: 100 },
};


if (type === "text") {
  newItem = {
    ...newItem,
    text: "Nouveau texte",
    fontSize: 16,
    color: "#000000",
    fontFamily: "'Inter', sans-serif",
    fontWeight: "normal",
    textAlign: "left",
  };
} else if (type === "image" || type === "video") {
  newItem = { ...newItem, src: "" };
}

setItems((s) => [...s, newItem]);
setSelectedId(id);


}, []);

const removeSelected = useCallback(() => {
setItems((prev) => prev.filter((i) => i.id !== selectedId));
setSelectedId(null);
}, [selectedId]);

const updateItem = useCallback((id: string, patch: Partial<CanvasItem>) => {
setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
}, []);

const updateItemProperty = useCallback((property: keyof CanvasItem, value: any) => {
if (!selectedId) return;
setItems((prev) =>
prev.map((it) => (it.id === selectedId ? { ...it, [property]: value } : it))
);
}, [selectedId]);

const setSelectedItem = useCallback((item: CanvasItem | null) => {
setSelectedId(item?.id || null);
}, []);

const onMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>, id?: string) => {
if (!canvasRef.current) return;
const rect = canvasRef.current.getBoundingClientRect();
dragState.current = {
id,
offsetX: e.clientX - rect.left,
offsetY: e.clientY - rect.top,
};
setSelectedId(id ?? null);
}, []);

const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
if (!dragState.current.id || !canvasRef.current) return;
const rect = canvasRef.current.getBoundingClientRect();
const x = e.clientX - rect.left;
const y = e.clientY - rect.top;


setItems((prev) =>
  prev.map((it) =>
    it.id === dragState.current.id
      ? { ...it, x: it.x + (x - (dragState.current.offsetX ?? 0)), y: it.y + (y - (dragState.current.offsetY ?? 0)) }
      : it
  )
);

dragState.current.offsetX = x;
dragState.current.offsetY = y;


}, []);

const onMouseUp = useCallback(() => {
dragState.current = {};
}, []);

const setImageAsBackground = useCallback((itemOrSrc: CanvasItem | string) => {
if (typeof itemOrSrc === "string") {
setBgImage(itemOrSrc);
} else if (itemOrSrc?.src) {
setBgImage(itemOrSrc.src);
setItems((prev) => prev.filter((i) => i.id !== itemOrSrc.id));
setSelectedId(null);
}
}, []);

return {
canvasRef,
items,
selectedItem,
bgColor,
bgImage,
addItem,
removeSelected,
updateItem,
updateItemProperty,
setSelectedItem,
onMouseDown,
onMouseMove,
onMouseUp,
setImageAsBackground,
};
}
