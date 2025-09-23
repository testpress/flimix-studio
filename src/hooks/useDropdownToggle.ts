import { useState } from 'react';

/**
 * Custom hook for managing dropdown state in menu components.
 * 
 * This hook provides functionality to:
 * - Track multiple dropdown states simultaneously using a Set
 * - Toggle dropdowns open/closed
 * - Handle keyboard navigation (Escape key)
 * - Handle focus management for accessibility
 * 
 * @example
 * ```tsx
 * const MyMenuComponent = () => {
 *   const { toggleDropdown, isDropdownOpen, handleKeyDown, handleBlur } = useDropdownToggle();
 *   
 *   return (
 *     <div>
 *       <button 
 *         onClick={() => toggleDropdown('menu-item-1')}
 *         onKeyDown={(e) => handleKeyDown(e, 'menu-item-1')}
 *         onBlur={(e) => handleBlur(e, 'menu-item-1')}
 *       >
 *         Menu Item
 *       </button>
 *       {isDropdownOpen('menu-item-1') && (
 *         <div>Dropdown Content</div>
 *       )}
 *     </div>
 *   );
 * };
 * ```
 */
export const useDropdownToggle = () => {
  // Use Set to efficiently track multiple open dropdowns by their unique IDs
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());

  /**
   * Toggles a dropdown open/closed state.
   * If the dropdown is open, it closes it. If closed, it opens it.
   * 
   * @param itemId - Unique identifier for the dropdown item
   */
  const toggleDropdown = (itemId: string) => {
    setOpenDropdowns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId); // Close if open
      } else {
        newSet.add(itemId); // Open if closed
      }
      return newSet;
    });
  };

  /**
   * Explicitly closes a specific dropdown.
   * 
   * @param itemId - Unique identifier for the dropdown item to close
   */
  const closeDropdown = (itemId: string) => {
    setOpenDropdowns(prev => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
  };

  /**
   * Checks if a specific dropdown is currently open.
   * 
   * @param itemId - Unique identifier for the dropdown item
   * @returns true if the dropdown is open, false otherwise
   */
  const isDropdownOpen = (itemId: string) => {
    return openDropdowns.has(itemId);
  };

  /**
   * Handles keyboard events for dropdown navigation.
   * Currently supports the Escape key to close dropdowns.
   * 
   * @param event - Keyboard event
   * @param itemId - Unique identifier for the dropdown item
   */
  const handleKeyDown = (event: React.KeyboardEvent, itemId: string) => {
    if (event.key === 'Escape') {
      closeDropdown(itemId);
    }
  };

  /**
   * Handles focus events to close dropdowns when focus moves away.
   * This improves accessibility by automatically closing dropdowns
   * when users navigate away using keyboard or mouse.
   * 
   * @param event - Focus event
   * @param itemId - Unique identifier for the dropdown item
   */
  const handleBlur = (event: React.FocusEvent, itemId: string) => {
    // Close dropdown if focus moves outside the menu item and its dropdown
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      closeDropdown(itemId);
    }
  };

  return {
    openDropdowns,      // Set of currently open dropdown IDs (for debugging)
    toggleDropdown,    // Function to toggle dropdown open/closed
    closeDropdown,      // Function to explicitly close a dropdown
    isDropdownOpen,     // Function to check if dropdown is open
    handleKeyDown,      // Function to handle keyboard events
    handleBlur,         // Function to handle focus events
  };
};
