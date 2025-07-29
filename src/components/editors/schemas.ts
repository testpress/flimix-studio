export interface EditorField {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'image' | 'color' | 'boolean' | 'select';
  placeholder?: string;
  options?: { value: string; label: string }[];
  required?: boolean;
}

// Hero block editor schema
export const heroEditorFields: EditorField[] = [
  { 
    key: 'title', 
    label: 'Title', 
    type: 'text',
    placeholder: 'Enter hero title...',
    required: true
  },
  { 
    key: 'subtitle', 
    label: 'Subtitle', 
    type: 'text',
    placeholder: 'Enter hero subtitle...'
  },
  { 
    key: 'backgroundImage', 
    label: 'Background Image URL', 
    type: 'image',
    placeholder: 'Enter image URL...'
  },
  { 
    key: 'ctaButton.label', 
    label: 'CTA Label', 
    type: 'text',
    placeholder: 'Enter CTA button text...'
  },
  { 
    key: 'ctaButton.link', 
    label: 'CTA Link', 
    type: 'text',
    placeholder: 'Enter CTA button link...'
  }
];

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

// Schema registry for dynamic lookup
export const blockEditorSchemas: Record<string, EditorField[]> = {
  hero: heroEditorFields,
  text: textEditorFields,
  section: sectionEditorFields,
}; 