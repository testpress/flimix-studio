import type { TextBlockProps } from '@schema/blockTypes';

export interface EditorField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'image' | 'color' | 'boolean' | 'select';
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
}

// Text block editor schema
export const textEditorFields: EditorField[] = [
  { 
    key: 'content', 
    label: 'Content', 
    type: 'textarea',
    placeholder: 'Enter text content...',
    required: true
  }
];

// Text block template for library
export const TextLibraryItem = {
  type: 'text' as const,
  name: 'Text Block',
  description: 'Simple text content with formatting options',
  icon: 'Type' as const,
  defaultProps: {
    content: 'Enter your text content here...'
  } as TextBlockProps
}; 