export interface Field {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'image' | 'color' | 'boolean' | 'select' | 'number';
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
  min?: number;
  max?: number;
}

// Define a type for form field values with specific types for form controls
export type FieldValue = string | boolean | number | Record<string, unknown>;

// Define a recursive type for nested form data structures
export type NestedFormData = {
  [key: string]: FieldValue | NestedFormData;
}; 