/**
 * Utilitaire pour la substitution dynamique des variables dans les templates
 */

export interface GuestData {
  id: string;
  name: string;
  email: string;
  location?: string;
  date?: string;
  time?: string;
  [key: string]: any;
}

/**
 * Extrait toutes les variables d'une chaîne de caractères
 * Format: {{variable_name}}
 */
export function extractVariables(text: string): string[] {
  if (!text) return [];
  const regex = /\{\{(\w+)\}\}/g;
  const variables = new Set<string>();
  let match;

  while ((match = regex.exec(text)) !== null) {
    variables.add(match[1]);
  }

  return Array.from(variables);
}

/**
 * Extrait toutes les variables d'un ensemble d'items
 */
export function extractVariablesFromItems(items: any[]): string[] {
  if (!Array.isArray(items)) return [];

  const variables = new Set<string>();

  items.forEach((item) => {
    if (item.type === "text" && item.text) {
      extractVariables(item.text).forEach((v) => variables.add(v));
    }
  });

  return Array.from(variables);
}

/**
 * Mappe les données de l'invité aux variables disponibles
 */
export function mapGuestToVariables(guest: GuestData): Record<string, string> {
  return {
    // Noms
    name: guest.name || "",
    first_name: guest.name?.split(" ")[0] || "",
    last_name: guest.name?.split(" ").slice(1).join(" ") || "",
    // Contact
    email: guest.email || "",
    // Événement
    location: guest.location || "",
    lieu: guest.location || "", // Alias français
    date: guest.date || "",
    time: guest.time || "",
    heure: guest.time || "", // Alias français
    // Autres
    ...guest, // Inclure toutes les propriétés personnalisées
  };
}

/**
 * Remplace les variables dans une chaîne de caractères
 */
export function replaceVariables(text: string, guest: GuestData): string {
  if (!text) return "";

  const variables = mapGuestToVariables(guest);
  let result = text;

  // Remplacer chaque variable
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
    result = result.replace(regex, String(value || ""));
  });

  return result;
}

/**
 * Remplace les variables dans un item
 */
export function replaceVariablesInItem(item: any, guest: GuestData): any {
  const replaced = { ...item };

  if (item.type === "text" && item.text) {
    replaced.text = replaceVariables(item.text, guest);
  }

  return replaced;
}

/**
 * Remplace les variables dans tous les items
 */
export function replaceVariablesInItems(items: any[], guest: GuestData): any[] {
  if (!Array.isArray(items)) return [];

  return items.map((item) => replaceVariablesInItem(item, guest));
}

/**
 * Valide que toutes les variables requises sont disponibles
 */
export function validateVariables(
  requiredVariables: string[],
  guest: GuestData
): { valid: boolean; missing: string[] } {
  const variables = mapGuestToVariables(guest);
  const missing = requiredVariables.filter((v) => !variables[v]);

  return {
    valid: missing.length === 0,
    missing,
  };
}

/**
 * Génère un aperçu des variables pour un invité
 */
export function generateVariablePreview(guest: GuestData): Record<string, string> {
  return {
    "Nom complet": guest.name || "Non défini",
    "Prénom": guest.name?.split(" ")[0] || "Non défini",
    "Email": guest.email || "Non défini",
    "Lieu": guest.location || "Non défini",
    "Date": guest.date || "Non défini",
    "Heure": guest.time || "Non défini",
  };
}

/**
 * Crée un résumé des variables utilisées dans un template
 */
export function summarizeTemplateVariables(items: any[]): {
  variables: string[];
  count: number;
  preview: string;
} {
  const variables = extractVariablesFromItems(items);
  const preview = variables.map((v) => `{{${v}}}`).join(", ");

  return {
    variables,
    count: variables.length,
    preview,
  };
}

/**
 * Valide qu'un template peut être rendu pour un invité
 */
export function validateTemplateForGuest(
  items: any[],
  guest: GuestData
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const requiredVariables = extractVariablesFromItems(items);

  const validation = validateVariables(requiredVariables, guest);
  if (!validation.valid) {
    errors.push(
      `Variables manquantes: ${validation.missing.join(", ")}`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Prépare un template pour le rendu avec les données d'un invité
 */
export function prepareTemplateForRendering(
  items: any[],
  guest: GuestData
): { items: any[]; variables: Record<string, string>; valid: boolean } {
  const validation = validateTemplateForGuest(items, guest);
  const replacedItems = replaceVariablesInItems(items, guest);
  const variables = mapGuestToVariables(guest);

  return {
    items: replacedItems,
    variables,
    valid: validation.valid,
  };
}
