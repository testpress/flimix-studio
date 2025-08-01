export interface Field {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'image' | 'color' | 'boolean' | 'select';
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
} 