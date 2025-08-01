import type { HeroBlockProps } from '@schema/blockTypes';

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

// Hero block template for library
export const HeroLibraryItem = {
  type: 'hero' as const,
  name: 'Hero Block',
  description: 'Large banner with title, subtitle, and CTA button',
  icon: 'Layout' as const,
  defaultProps: {
    title: 'Welcome to Flimix',
    subtitle: 'Stream your favorite content anywhere',
    backgroundImage: '',
    ctaButton: {
      label: 'Get Started',
      link: '/signup'
    }
  } as HeroBlockProps
}; 