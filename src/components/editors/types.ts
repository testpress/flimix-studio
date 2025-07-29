import type { Block } from '../../schema/blockTypes';

export interface BlockEditorProps {
  block: Block;
  updateProps: (newProps: Partial<any>) => void;
} 