/**
 * Swaps two elements in an array by their indices
 * @param array - The array to swap elements in
 * @param from - Index of the first element
 * @param to - Index of the second element
 * @returns A new array with the elements swapped
 */
export function swap<T>(array: T[], from: number, to: number): T[] {
  if (from < 0 || from >= array.length || to < 0 || to >= array.length) {
    return array;
  }
  
  const newArray = [...array];
  [newArray[from], newArray[to]] = [newArray[to], newArray[from]];
  return newArray;
}

/**
 * Checks if a block is a top-level block (not nested inside a section)
 * @param blockId - The ID of the block to check
 * @param blocks - Array of top-level blocks
 * @returns True if the block is a top-level block
 */
export function isTopLevelBlock(blockId: string, blocks: any[]): boolean {
  return blocks.some(block => block.id === blockId);
} 