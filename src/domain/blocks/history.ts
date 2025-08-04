import type { Block } from '@blocks/shared/Block';

/**
 * Block State History Utilities
 * 
 * Domain-specific utilities for managing block state in the editor.
 * These functions handle creating snapshots of block states for undo/redo functionality.
 */

/**
 * Creates a deep copy of blocks array using structuredClone
 * Used for creating snapshots of block state for undo functionality
 * @param blocks - Array of blocks to clone
 * @returns Deep copy of the blocks array with preserved type
 */
export function cloneBlocks<T extends Block>(blocks: T[]): T[] {
  return structuredClone(blocks);
} 