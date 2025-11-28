import type { RowLayoutBlockProps } from "./schema";


export const RowLayoutLibraryItem = {
  type: 'rowLayout' as const,
  name: 'Row Layout',
  description: 'Arrange content in horizontal columns.',
  icon: 'Layout' as const,
  defaultProps: {} as RowLayoutBlockProps
};
