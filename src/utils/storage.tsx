import { Template } from "@/types";

const STORAGE_KEY = "everblue-templates";

export async function getTemplates() {
  const raw = localStorage.getItem("everblue_templates");
  return raw ? JSON.parse(raw) : [];
}

export async function saveTemplate(template: any) {
  try {
    const key = "everblue_templates";
    const current = await getTemplates();
    const updated = [
      ...current.filter((t: any) => t.id !== template.id),
      template,
    ];
    localStorage.setItem(key, JSON.stringify(updated));
    return template;
  } catch (err) {
    console.error("saveTemplate error", err);
    throw err;
  }
}

export async function removeTemplate(id: string) {
  try {
    const key = "everblue_templates";
    const current = await getTemplates();
    const updated = Array.isArray(current)
      ? current.filter((t: any) => t.id !== id)
      : [];
    localStorage.setItem(key, JSON.stringify(updated));
    return true;
  } catch (err) {
    console.error("removeTemplate error", err);
    return false;
  }
}

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
