import type { SectionBlockProps } from '@schema/blockTypes';

export interface EditorField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'image' | 'color' | 'boolean' | 'select';
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
}

// Section block editor schema
export const sectionEditorFields: EditorField[] = [
  { 
    key: 'title', 
    label: 'Title', 
    type: 'text',
    placeholder: 'Enter section title...'
  },
  { 
    key: 'description', 
    label: 'Description', 
    type: 'textarea',
    placeholder: 'Enter section description...'
  }
];

// Section block template for library
export const SectionLibraryItem = {
  type: 'section' as const,
  name: 'Section Block',
  description: 'Container for organizing multiple blocks',
  icon: 'Square' as const,
  defaultProps: {
    title: 'Section Title',
    description: 'Section description goes here...'
  } as SectionBlockProps
}; 