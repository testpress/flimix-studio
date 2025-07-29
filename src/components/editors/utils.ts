import { get, set } from 'lodash';

/**
 * Get a nested property value from an object using dot notation
 * @param obj - The object to get the property from
 * @param path - The dot-notation path (e.g., 'ctaButton.label')
 * @param defaultValue - Default value if property doesn't exist
 * @returns The property value or default value
 */
export function getNestedValue(obj: any, path: string, defaultValue: any = ''): any {
  return get(obj, path, defaultValue);
}

/**
 * Set a nested property value in an object using dot notation
 * @param obj - The object to set the property in
 * @param path - The dot-notation path (e.g., 'ctaButton.label')
 * @param value - The value to set
 * @returns A new object with the updated property
 */
export function setNestedValue(obj: any, path: string, value: any): any {
  const newObj = { ...obj };
  set(newObj, path, value);
  return newObj;
}

/**
 * Update a specific property in block props using dot notation
 * @param currentProps - Current block props
 * @param path - The dot-notation path to update
 * @param value - The new value
 * @returns Updated props object
 */
export function updateBlockProps(currentProps: any, path: string, value: any): any {
  return setNestedValue(currentProps, path, value);
} 