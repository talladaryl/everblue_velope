import { generateId } from "./editor";

export function createMediaItem({ src, type = "image", x = 50, y = 50 }) {
  return {
    id: generateId(type),
    type,
    src,
    x,
    y,
    width: type === "video" ? 200 : 150,
    height: type === "video" ? 150 : 150,
    borderRadius: 0,
    opacity: 100,
    rotation: 0,
    flipX: false,
    flipY: false,
    shadow: { enabled: false, color: "#000000", blur: 5, offsetX: 2, offsetY: 2 },
    filters: { brightness: 100, contrast: 100, saturation: 100, blur: 0, grayscale: 0 },
    ...(type === "video" ? { autoPlay: false, loop: false, muted: true, playing: false } : {}),
    ...(type === "gif" ? { animated: true, playing: true } : {}),
  };
}
