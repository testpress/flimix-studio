import type { BlockType } from '@blocks/shared/Block';
import { generateUniqueId } from '@utils/id';
import { HeroLibraryItem, TextLibraryItem, SectionLibraryItem, PosterGridLibraryItem, CarouselLibraryItem, TestimonialLibraryItem, SpacerLibraryItem, DividerLibraryItem, FeatureCalloutLibraryItem, FAQAccordionLibraryItem, ImageLibraryItem } from '@blocks/shared/Library';

/**
 * Creates a new block of the specified type with default values and a unique ID
 * @param type - The type of block to create ('text', 'hero', 'section', 'posterGrid', 'carousel', 'testimonial', 'spacer', 'divider', 'featureCallout', 'faq-accordion', 'image')
 * @returns A new block with minimal valid properties
 */
export function createBlock(type: BlockType['type']): BlockType {
  const id = generateUniqueId();

  switch (type) {
    case 'text':
      return {
        type: 'text',
        id,
        props: TextLibraryItem.defaultProps,
        style: {
          padding: 'md',
          textAlign: 'left'
        }
      };

    case 'hero':
      return {
        type: 'hero',
        id,
        props: HeroLibraryItem.defaultProps,
        style: {
          padding: 'lg',
          textAlign: 'center'
        }
      };

    case 'section':
      return {
        type: 'section',
        id,
        props: SectionLibraryItem.defaultProps,
        style: {
          padding: 'md',
          backgroundColor: '#f8f9fa'
        },
        children: []
      };

    case 'posterGrid':
      return {
        type: 'posterGrid',
        id,
        props: PosterGridLibraryItem.defaultProps,
        style: {
          padding: 'md',
          textAlign: 'left'
        }
      };

    case 'carousel':
      return {
        type: 'carousel',
        id,
        props: {
          ...CarouselLibraryItem.defaultProps,
          items: CarouselLibraryItem.defaultProps.items?.map(item => ({
            ...item,
            id: generateUniqueId(),
          })) || [],
        },
        style: {
          padding: 'md',
          textAlign: 'left'
        }
      };

    case 'testimonial':
      return {
        type: 'testimonial',
        id,
        props: {
          ...TestimonialLibraryItem.defaultProps,
          items: TestimonialLibraryItem.defaultProps.items?.map(item => ({
            ...item,
            id: generateUniqueId(),
          })) || [],
        },
        style: {
          padding: 'md',
          textAlign: 'center'
        }
      };

    case 'spacer':
      return {
        type: 'spacer',
        id,
        props: SpacerLibraryItem.defaultProps,
      };

    case 'divider':
      return {
        type: 'divider',
        id,
        props: DividerLibraryItem.defaultProps,
        style: {
          backgroundColor: '#000000',
          margin: 'sm'
        }
      };

    case 'featureCallout':
      return {
        type: 'featureCallout',
        id,
        props: {
          ...FeatureCalloutLibraryItem.defaultProps,
          items: FeatureCalloutLibraryItem.defaultProps.items?.map(item => ({
            ...item,
            id: generateUniqueId(),
          })) || [],
        },
        style: {
          padding: 'md',
          textAlign: 'center'
        }
      };

    case 'faq-accordion':
      return {
        type: 'faq-accordion',
        id,
        props: {
          ...FAQAccordionLibraryItem.defaultProps,
          items: FAQAccordionLibraryItem.defaultProps.items?.map(item => ({
            ...item,
            id: generateUniqueId(),
          })) || [],
        },
        style: {
          padding: 'md',
          textAlign: 'left'
        }
      };

    case 'image':
      return {
        type: 'image',
        id,
        props: ImageLibraryItem.defaultProps,
        style: {
          padding: 'md',
        }
      };

    default:
      // This will cause a compile-time error if a case is missed.
      const exhaustiveCheck: never = type;
      throw new Error(`Unhandled block type: ${exhaustiveCheck}`);
  }
}

/**
 * Creates a deep copy of a block with new unique IDs for the block and all its children
 * Used for duplicating blocks in the editor
 * @param block - The block to duplicate
 * @returns A deep copy of the block with new IDs
 */
export function duplicateBlockWithNewIds(block: BlockType): BlockType {
  const newId = generateUniqueId();
  const duplicated: BlockType = {
    ...block,
    id: newId,
    children: block.children?.map(child => duplicateBlockWithNewIds(child)),
  } as BlockType;
  return duplicated;
}

/**
 * Updates the children array of a parent block in the block tree
 * Used for modifying block hierarchy when blocks are moved, added, or removed
 * @param blocks - Array of blocks to update
 * @param parentId - ID of the parent block
 * @param newChildren - New children array
 * @returns Updated blocks array
 */
export function updateBlockChildren(
  blocks: BlockType[], 
  parentId: string, 
  newChildren: BlockType[]
): BlockType[] {
  return blocks.map(block => {
    if (block.id === parentId) {
      return {
        ...block,
        children: newChildren
      } as BlockType;
    }
    return block;
  });
} 