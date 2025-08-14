import type { Block } from '@blocks/shared/Block';

// Social links limit constant
export const SOCIAL_LINKS_LIMIT = 4;

// Footer items (columns) limit constant
export const FOOTER_ITEMS_LIMIT = 4;

// Footer links per item limits
export const FOOTER_LINKS_MIN = 1;
export const FOOTER_LINKS_MAX = 3;

// Available social media platforms
export type SocialPlatform = 'twitter' | 'facebook' | 'instagram' | 'whatsapp' | 'linkedin' | 'youtube' | 'discord';

export interface FooterLinkItem {
  id: string;
  label: string;
  url: string;
  external?: boolean;
}

export interface FooterColumn {
  id: string;
  title?: string;
  links: FooterLinkItem[];
}

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  url: string;
}

export interface FooterBlockProps {
  items: FooterColumn[];
  socialLinks?: SocialLink[];
  branding?: string;
}

export interface FooterBlock extends Omit<Block, 'props'> {
  type: 'footer';
  props: FooterBlockProps;
}
