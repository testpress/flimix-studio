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
 * Moves an item from one position to another in an array
 * @param array - The array to move the item in
 * @param fromIndex - Current index of the item to move
 * @param toIndex - Target index to move the item to
 * @returns A new array with the item moved to the new position
 */
export function moveItemInArray<T>(array: T[], fromIndex: number, toIndex: number): T[] {
  // Validate indices
  if (fromIndex < 0 || fromIndex >= array.length || toIndex < 0 || toIndex >= array.length) {
    return array;
  }
  
  const newArray = [...array];
  // splice(startIndex, deleteCount) - Remove 1 item at current position
  const [movedItem] = newArray.splice(fromIndex, 1);
  // splice(startIndex, deleteCount, itemToInsert) - Insert item at new position, remove 0 items
  newArray.splice(toIndex, 0, movedItem);
  return newArray;
} 