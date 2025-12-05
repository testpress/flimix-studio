/**
 * Generates a unique ID for blocks
 * @returns A unique string ID
 */
export function generateUniqueId(): string {
  return crypto.randomUUID?.() ?? `block-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Generates a unique integer ID for block items
 * Uses timestamp + random component to ensure uniqueness
 * @returns A unique numeric ID
 */
export function generateUniqueInt(): number {
  // Use timestamp (milliseconds since epoch) + random component
  // This ensures uniqueness even if called multiple times in quick succession
  return Date.now() * 1000 + Math.floor(Math.random() * 1000);
} 