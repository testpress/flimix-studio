import React from 'react';
import { Play, Plus, Info, ChevronRight, ChevronLeft, ArrowRight, ArrowLeft, Download } from 'lucide-react';

export type ButtonIconType = 
  | 'Play' 
  | 'Plus' 
  | 'Info' 
  | 'ChevronRight' 
  | 'ChevronLeft' 
  | 'ArrowRight' 
  | 'ArrowLeft' 
  | 'Download'
  | 'None';

interface ButtonIconProps {
  icon: ButtonIconType;
  size?: number;
  thickness?: 'thin' | 'normal' | 'thick';
}

export const ButtonIcon: React.FC<ButtonIconProps> = ({ icon, size = 16, thickness = 'normal' }) => {
  // Map thickness to stroke width with more noticeable differences
  const strokeWidth = thickness === 'thin' ? 1 : thickness === 'thick' ? 3 : 2;
  
  switch (icon) {
    case 'Play':
      return <Play size={size} strokeWidth={strokeWidth} />;
    case 'Plus':
      return <Plus size={size} strokeWidth={strokeWidth} />;
    case 'Info':
      return <Info size={size} strokeWidth={strokeWidth} />;
    case 'ChevronRight':
      return <ChevronRight size={size} strokeWidth={strokeWidth} />;
    case 'ChevronLeft':
      return <ChevronLeft size={size} strokeWidth={strokeWidth} />;
    case 'ArrowRight':
      return <ArrowRight size={size} strokeWidth={strokeWidth} />;
    case 'ArrowLeft':
      return <ArrowLeft size={size} strokeWidth={strokeWidth} />;
    case 'Download':
      return <Download size={size} strokeWidth={strokeWidth} />;
    case 'None':
    default:
      return null;
  }
};

// Define icon position type
export type ButtonIconPosition = 'left' | 'right' | 'none';

// Export all available icons for the preview panel
export const AVAILABLE_ICONS = [
  { type: 'Play', label: 'Play' },
  { type: 'Plus', label: 'Plus' },
  { type: 'Info', label: 'Info' },
  { type: 'ChevronRight', label: 'Chevron Right' },
  { type: 'ChevronLeft', label: 'Chevron Left' },
  { type: 'ArrowRight', label: 'Arrow Right' },
  { type: 'ArrowLeft', label: 'Arrow Left' },
  { type: 'Download', label: 'Download' },
  { type: 'None', label: 'No Icon' }
];
