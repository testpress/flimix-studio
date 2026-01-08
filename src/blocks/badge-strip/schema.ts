import type { Block } from '@type/block';
import type { StyleProps } from '@type/style';

// Badge strip item limit constant
export const BADGE_STRIP_ITEM_LIMIT = 10;

export interface BadgeStripItem {
  id: string;
  label?: string;
  icon?: string;       // Lucide icon name (e.g., 'Award', 'Star', 'CheckCircle')
  link?: string;
  tooltip?: string;
  style?: StyleProps;  // Item-level styling
}

export interface BadgeStripBlockProps {
  items: BadgeStripItem[];
  wrap?: boolean; // Always true, not configurable
}

export interface BadgeStripBlock extends Omit<Block, 'props'> {
  type: 'badge-strip';
  props: BadgeStripBlockProps;
}
