import type { FAQAccordionBlockProps } from './schema';
import { generateUniqueId } from '@utils/id';

// FAQ Accordion block template for library
export const FAQAccordionLibraryItem = {
  type: 'faq-accordion' as const,
  name: 'FAQ Accordion',
  description: 'Display frequently asked questions in a collapsible accordion layout',
  icon: 'HelpCircle' as const,
  defaultProps: {
    title: 'Frequently Asked Questions',
    items: [
      {
        id: generateUniqueId(),
        question: 'Can I cancel anytime?',
        answer: 'Yes, you can cancel your subscription at any time from the account settings. Simply go to your account preferences and select the cancellation option. No questions asked and no hidden fees.',
        style: {
          backgroundColor: '#ffffff',
          textColor: '#000000',
          fontWeight: 'normal',
          padding: 'sm',
          margin: 'md',
          borderRadius: 'md',
        },
      },
      {
        id: generateUniqueId(),
        question: 'Do you offer 4K content?',
        answer: 'Yes, many titles are available in 4K Ultra HD quality. We continuously update our library with the latest high-resolution content. Check the content details page to see available quality options for each title.',
        style: {
          backgroundColor: '#ffffff',
          textColor: '#000000',
          fontWeight: 'normal',
          padding: 'sm',
          margin: 'md',
          borderRadius: 'md',
        },
      },
    ],
    defaultOpenIndex: 0,
  } as FAQAccordionBlockProps,
}; 