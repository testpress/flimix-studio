import type { Block } from '@blocks/shared/Block';

export interface BlockFormProps {
  block: Block;
  updateProps: (newProps: Partial<any>) => void;
} 