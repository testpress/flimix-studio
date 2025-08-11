import type { Block } from '@blocks/shared/Block';

// FAQ item limit constant
export const FAQ_ACCORDION_ITEM_LIMIT = 5;

// FAQ accordion item interface
export interface FAQAccordionItem {
  id: string;
  question: string;
  answer: string;
  style?: {
    backgroundColor?: string;
    textColor?: string;
    fontWeight?: 'normal' | 'bold';
    padding?: 'sm' | 'md' | 'lg';
    margin?: 'sm' | 'md' | 'lg';
    borderRadius?: 'none' | 'sm' | 'md' | 'lg';
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
  defaultOpenIndex?: number; // Index of the default open question
} 