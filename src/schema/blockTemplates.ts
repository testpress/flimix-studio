// Block template definitions for the inserter sidebar
export interface BlockTemplate {
  type: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const blockTemplates: BlockTemplate[] = [
  {
    type: 'hero',
    name: 'Hero Block',
    description: 'Large banner with title, subtitle, and CTA button',
    icon: 'Layout',
    color: 'bg-gradient-to-r from-blue-500 to-purple-600'
  },
  {
    type: 'text',
    name: 'Text Block',
    description: 'Simple text content with formatting options',
    icon: 'Type',
    color: 'bg-gradient-to-r from-green-500 to-teal-600'
  },
  {
    type: 'section',
    name: 'Section Block',
    description: 'Container for organizing multiple blocks',
    icon: 'Square',
    color: 'bg-gradient-to-r from-orange-500 to-red-600'
  }
];

// Helper function to get available block types
export function getAvailableBlockTypes(): string[] {
  return blockTemplates.map(template => template.type);
}

// Helper function to get all block templates
export function getAllBlockTemplates(): BlockTemplate[] {
  return [...blockTemplates];
} 