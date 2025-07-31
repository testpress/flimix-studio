import type { BlockType } from './blockTypes';

// Block template definitions for the inserter sidebar
export interface BlockTemplate {
  type: BlockType['type'];
  name: string;
  description: string;
  icon: 'Layout' | 'Type' | 'Square';
}

export const blockTemplates: BlockTemplate[] = [
  {
    type: 'hero',
    name: 'Hero Block',
    description: 'Large banner with title, subtitle, and CTA button',
    icon: 'Layout'
  },
  {
    type: 'text',
    name: 'Text Block',
    description: 'Simple text content with formatting options',
    icon: 'Type'
  },
  {
    type: 'section',
    name: 'Section Block',
    description: 'Container for organizing multiple blocks',
    icon: 'Square'
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