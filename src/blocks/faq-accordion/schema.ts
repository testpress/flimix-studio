import type { Block } from '@type/block';

// FAQ item limit constant
export const FAQ_ACCORDION_ITEM_LIMIT = 5;

// FAQ accordion item interface
export interface FAQAccordionItem {
  id: string;
  question: string;
  answer: string;
  style?: {
    background_color?: string;
    text_color?: string;
    font_weight?: 'normal' | 'bold';
    padding?: 'sm' | 'md' | 'lg';
    margin?: 'sm' | 'md' | 'lg';
    border_radius?: 'none' | 'sm' | 'md' | 'lg';
    box_shadow?: 'none' | 'sm' | 'md' | 'lg';
  };
}

// FAQ accordion block interface
export interface FAQAccordionBlock extends Omit<Block, 'props'> {
  type: 'faq-accordion';
  props: FAQAccordionBlockProps;
}

// FAQ accordion block props interface
export interface FAQAccordionBlockProps {
  title?: string;
  items: FAQAccordionItem[];
  default_open_index?: number; // Index of the default open question
} 