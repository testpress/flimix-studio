import type { RowLayoutPreset } from './schema';

export interface LayoutPresetConfig {
  id: RowLayoutPreset;
  label: string;
  cols: number;
  class: string;
  previewClass: string;
  widths: number[]; 
}

export const ROW_LAYOUT_PRESETS: LayoutPresetConfig[] = [
  { 
    id: '1-col', 
    label: '1 Column', 
    cols: 1, 
    class: 'grid-cols-1',
    previewClass: 'grid-cols-1',
    widths: [100]
  },
  { 
    id: '2-col', 
    label: '2 Columns (50/50)', 
    cols: 2, 
    class: 'grid-cols-2',
    previewClass: 'grid-cols-2',
    widths: [50, 50]
  },
  { 
    id: '2-col-heavy-left', 
    label: '2 Columns (66/33)', 
    cols: 2, 
    class: 'grid-cols-[2fr_1fr]',
    previewClass: 'grid-cols-[2fr_1fr]',
    widths: [66, 34]
  },
  { 
    id: '2-col-heavy-right', 
    label: '2 Columns (33/66)', 
    cols: 2, 
    class: 'grid-cols-[1fr_2fr]',
    previewClass: 'grid-cols-[1fr_2fr]',
    widths: [34, 66]
  },
  { 
    id: '3-col', 
    label: '3 Columns', 
    cols: 3, 
    class: 'grid-cols-3',
    previewClass: 'grid-cols-3',
    widths: [33, 34, 33]
  },
  { 
    id: '3-col-wide-center', 
    label: '3 Columns (Wide Center)', 
    cols: 3, 
    class: 'grid-cols-[1fr_2fr_1fr]',
    previewClass: 'grid-cols-[1fr_2fr_1fr]',
    widths: [25, 50, 25]
  },
  { 
    id: '4-col', 
    label: '4 Columns', 
    cols: 4, 
    class: 'grid-cols-4',
    previewClass: 'grid-cols-4',
    widths: [25, 25, 25, 25]
  },
];

