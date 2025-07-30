import type { BlockType, TextBlock, HeroBlock, SectionBlock } from '../schema/blockTypes';

/**
 * Generates a unique ID for blocks
 * @returns A unique string ID
 */
function generateUniqueId(): string {
  return crypto.randomUUID?.() ?? `block-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Creates a new block of the specified type with default values and a unique ID
 * @param type - The type of block to create ('text', 'hero', 'section')
 * @returns A new block with minimal valid properties
 */
export function createBlock(type: string): BlockType {
  const id = generateUniqueId();

  switch (type) {
    case 'text':
      return {
        type: 'text',
        id,
        props: {
          content: 'New text'
        },
        style: {
          padding: 'md',
          textAlign: 'left'
        }
      } as TextBlock;

    case 'hero':
      return {
        type: 'hero',
        id,
        props: {
          title: 'New hero',
          subtitle: 'Add your subtitle here',
          backgroundImage: '',
          ctaButton: {
            label: 'Learn More',
            link: '#'
          }
        },
        style: {
          padding: 'lg',
          textAlign: 'center'
        }
      } as HeroBlock;

    case 'section':
      return {
        type: 'section',
        id,
        props: {
          title: 'New section',
          description: 'Section description'
        },
        style: {
          padding: 'md',
          backgroundColor: '#f8f9fa'
        },
        children: []
      } as SectionBlock;

    default:
      throw new Error(`Unknown block type: ${type}`);
  }
} 