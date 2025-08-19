import type { BlockType } from '@blocks/shared/Block';
import { generateUniqueId } from '@utils/id';
import { HeroLibraryItem, TextLibraryItem, SectionLibraryItem, PosterGridLibraryItem, CarouselLibraryItem, TestimonialLibraryItem, SpacerLibraryItem, DividerLibraryItem, FeatureCalloutLibraryItem, FAQAccordionLibraryItem, ImageLibraryItem, VideoLibraryItem, TabsLibraryItem, FooterLibraryItem } from '@blocks/shared/Library';
import type { TabsBlock } from '@blocks/tabs/schema';
import { CTAButtonLibraryItem } from '@blocks/cta-button/libraryItem';
import { BadgeStripLibraryItem } from '@blocks/badge-strip/libraryItem';

/**
 * Creates a new block of the specified type with default values and a unique ID
 * @param type - The type of block to create ('text', 'hero', 'section', 'posterGrid', 'carousel', 'testimonial', 'spacer', 'divider', 'featureCallout', 'faq-accordion', 'image', 'video')
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
          backgroundColor: '#000000'
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
          backgroundColor: '#ffffff',
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

    case 'video':
      return {
        type: 'video',
        id,
        props: VideoLibraryItem.defaultProps,
        style: {
          padding: 'md',
        }
      };

    case 'tabs':
      return {
        type: 'tabs',
        id,
        props: {
          ...TabsLibraryItem.defaultProps,
          tabs: (TabsLibraryItem.defaultProps as any).tabs.map((tab: any) => ({
            ...tab,
            children: tab.children?.map((child: any) => ({
              ...child,
              id: generateUniqueId(),
            })) || [],
          })),
        },
        style: {
          tabAlignment: 'left',
          tabStyle: 'pill',
          padding: 'md',
          backgroundColor: '#000000'
        }
      };

      case 'footer': {
        return {
          type: 'footer',
          id,
          props: {
            ...FooterLibraryItem.defaultProps,
            items: FooterLibraryItem.defaultProps.items?.map(column => ({
              ...column,
              id: generateUniqueId(),
              links: column.links?.map(link => ({
                ...link,
                id: generateUniqueId(),
              })) || [],
            })) || [],
            socialLinks: FooterLibraryItem.defaultProps.socialLinks?.map(social => ({
              ...social,
              id: generateUniqueId(),
            })) || [],
          },
          style: {
            padding: 'md',
            textAlign: 'left'
          }
        };
      }

      case 'cta-button': {
        return {
          type: 'cta-button',
          id,
          props: {
            ...CTAButtonLibraryItem.defaultProps,
          },
          style: {
            padding: 'md',
            textAlign: 'center'
          }
        };
      }

      case 'badge-strip': {
        return {
          type: 'badge-strip',
          id,
          props: {
            ...BadgeStripLibraryItem.defaultProps,
          },
          style: {
            padding: 'md',
            textAlign: 'center'
          }
        };
      }
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
  
  // Handle tabs blocks specially
  if (block.type === 'tabs') {
    const tabsBlock = block as TabsBlock;
    return {
      ...block,
      id: newId,
      props: {
        ...block.props,
        tabs: tabsBlock.props.tabs.map((tab: any) => ({
          ...tab,
          children: tab.children?.map((child: any) => duplicateBlockWithNewIds(child)) || []
        }))
      }
    } as BlockType;
  }
  
  // Handle regular blocks
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