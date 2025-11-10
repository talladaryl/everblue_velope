import { Template } from "@/types";

const STORAGE_KEY = "everblue-templates";

export const saveTemplate = (template: Template): void => {
  const existing = getTemplates();
  const updated = [...existing.filter((t) => t.id !== template.id), template];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getTemplates = (): Template[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

export const deleteTemplate = (templateId: string): void => {
  const existing = getTemplates();
  const updated = existing.filter((t) => t.id !== templateId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const generateThumbnail = (template: Template): string => {
  // Cette fonction génère une miniature basique
  // En production, vous voudrez peut-être générer une vraie image
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${template.bgColor}"/>
      ${template.items
        .slice(0, 3)
        .map((item, index) => {
          if (item.type === "text") {
            return `
            <text x="${item.x / 4}" y="${item.y / 4 + 20}" 
                  font-family="${item.fontFamily}" 
                  font-size="${item.fontSize / 2}" 
                  font-weight="${item.fontWeight}" 
                  fill="${item.color}">
              ${item.text}
            </text>
          `;
          }
          return "";
        })
        .join("")}
      ${
        template.isCustom
          ? `
        <rect x="10" y="10" width="40" height="20" rx="4" fill="rgba(0,0,0,0.1)"/>
        <text x="30" y="23" text-anchor="middle" font-size="10" fill="white">Perso</text>
      `
          : ""
      }
    </svg>
  `)}`;
};
