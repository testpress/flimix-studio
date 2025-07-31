/**
 * Get a form field value from an object using dot notation path
 * Used for accessing nested form field values like 'ctaButton.label' in the editor
 * @param obj - The object containing the form data
 * @param fieldPath - The dot-notation path (e.g., 'ctaButton.label')
 * @param defaultValue - Default value if field doesn't exist
 * @returns The field value or default value
 */
export function getFormFieldValue(obj: any, fieldPath: string, defaultValue: any = ''): any {
  if (!obj || !fieldPath) return defaultValue;
  
  const keys = fieldPath.split('.');
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
 * Set a form field value in an object using dot notation path
 * Used for updating nested form field values like 'ctaButton.label' in the editor
 * @param obj - The object containing the form data
 * @param fieldPath - The dot-notation path (e.g., 'ctaButton.label')
 * @param value - The new field value
 * @returns A new object with the updated field value
 */
export function setFormFieldValue(obj: any, fieldPath: string, value: any): any {
  if (!obj || !fieldPath) return obj;
  
  const keys = fieldPath.split('.');
  const newObj = { ...obj };
  let current = newObj;
  
  // Navigate to the parent of the target field
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== 'object' || current[key] === null) {
      current[key] = {};
    }
    current = current[key];
  }
  
  // Set the final field value
  const finalKey = keys[keys.length - 1];
  current[finalKey] = value;
  
  return newObj;
}

/**
 * Update a form field in block props using dot notation path
 * Used by the DynamicPropsEditor to update block properties in the editor
 * @param currentProps - Current block props
 * @param fieldPath - The dot-notation path to update
 * @param value - The new field value
 * @returns Updated props object
 */
export function updateFormField(currentProps: any, fieldPath: string, value: any): any {
  return setFormFieldValue(currentProps, fieldPath, value);
} 