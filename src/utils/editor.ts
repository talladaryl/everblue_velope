export function generateId(prefix = "id") {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function updateItemInList(items: any[], id: string, patch: any) {
  return items.map((it) => (it.id === id ? { ...it, ...patch } : it));
}
