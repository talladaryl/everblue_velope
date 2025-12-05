/**
 * Service de sauvegarde des designs de cartes
 * Avec fallback localStorage si l'API échoue
 */

export interface CardDesign {
  id: string;
  title: string;
  bgColor: string;
  bgImage: string | null;
  items: any[];
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
}

const STORAGE_KEY = "card_designs";
const API_ENDPOINT = "/api/card-designs";

/**
 * Sauvegarder un design de carte
 * Essaie d'abord l'API, puis fallback localStorage
 */
export async function saveCardDesign(
  design: Omit<CardDesign, "id" | "createdAt" | "updatedAt">
): Promise<CardDesign> {
  const id = design.id || `design_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const now = new Date().toISOString();

  const cardDesign: CardDesign = {
    ...design,
    id,
    createdAt: now,
    updatedAt: now,
  };

  try {
    // Essayer de sauvegarder via l'API
    console.log("📤 Tentative de sauvegarde via API...");
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cardDesign),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const savedDesign = await response.json();
    console.log("✅ Design sauvegardé via API:", savedDesign.id);
    return savedDesign;
  } catch (apiError) {
    console.warn("⚠️ Sauvegarde API échouée, utilisation du localStorage:", apiError);

    // FALLBACK: Sauvegarder localement
    try {
      const designs = getLocalCardDesigns();
      const existingIndex = designs.findIndex((d) => d.id === id);

      if (existingIndex >= 0) {
        designs[existingIndex] = {
          ...cardDesign,
   tedAt:        upda