/**
 * Generates a unique ID for blocks
 * @returns A unique string ID
 */
export function generateUniqueId(): string {
  return crypto.randomUUID?.() ?? `block-${Math.random().toString(36).slice(2, 9)}`;
} 