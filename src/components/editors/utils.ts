/**
 * Get a nested property value from an object using dot notation
 * @param obj - The object to get the property from
 * @param path - The dot-notation path (e.g., 'ctaButton.label')
 * @param defaultValue - Default value if property doesn't exist
 * @returns The property value or default value
 */
export function getNestedValue(obj: any, path: string, defaultValue: any = ''): any {
  if (!obj || !path) return defaultValue;
  
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return defaultValue;
    }
    current = current[key];
  }
  
  return current !== undefined ? current : defaultValue;
}

/**
 * Set a nested property value in an object using dot notation
 * @param obj - The object to set the property in
 * @param path - The dot-notation path (e.g., 'ctaButton.label')
 * @param value - The value to set
 * @returns A new object with the updated property
 */
export function setNestedValue(obj: any, path: string, value: any): any {
  if (!obj || !path) return obj;
  
  const keys = path.split('.');
  const newObj = { ...obj };
  let current = newObj;
  
  // Navigate to the parent of the target property
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== 'object' || current[key] === null) {
      current[key] = {};
    }
    current = current[key];
  }
  
  // Set the final property
  const finalKey = keys[keys.length - 1];
  current[finalKey] = value;
  
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