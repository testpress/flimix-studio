/**
 * Generates a unique ID for blocks
 * @returns A unique string ID
 */
export function generateUniqueId(): string {
  return crypto.randomUUID?.() ?? `block-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Generates a unique integer ID for block items
 * Uses timestamp + a counter to ensure uniqueness
 * @returns A unique numeric ID
 */
export const generateUniqueInt = (() => {
  let i = 0;
  return (): number => Date.now() * 1000 + i++;
})(); 