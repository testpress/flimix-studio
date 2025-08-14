import type { FooterBlockProps } from './schema';
import { generateUniqueId } from '@utils/id';

export const FooterLibraryItem = {
  type: 'footer' as const,
  name: 'Footer',
  description: 'Display multiple navigational link columns and social icons in footer',
  icon: 'CreditCard' as const, // Lucide icon for footer
  defaultProps: {
    items: [
      {
        id: generateUniqueId(),
        title: 'Company',
        links: [
          { id: generateUniqueId(), label: 'About Us', url: '/about' },
          { id: generateUniqueId(), label: 'Careers', url: '/careers' }
        ]
      },
      {
        id: generateUniqueId(),
        title: 'Support',
        links: [
          { id: generateUniqueId(), label: 'Help Center', url: '/help' },
          { id: generateUniqueId(), label: 'Contact Us', url: '/contact' }
        ]
      }
    ],
    socialLinks: [
      { id: generateUniqueId(), platform: 'linkedin', url: 'https://www.linkedin.com/company/testpress/posts/?feedView=all' },
      { id: generateUniqueId(), platform: 'instagram', url: 'https://www.instagram.com/testpress_official?igsh=Nmw1Mmg0Y2R0Mm5h' }
    ],
    branding: '© 2025 Flimix Inc. All rights reserved.',
  } as FooterBlockProps,
};
