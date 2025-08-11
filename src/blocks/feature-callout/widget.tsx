import React from 'react';
import BaseWidget from '@blocks/shared/BaseWidget';
import type { BaseWidgetProps } from '@blocks/shared/BaseWidget';
import type { FeatureCalloutBlock } from './schema';
import { FEATURE_CALLOUT_ITEM_LIMIT } from './schema';
import { useSelection } from '@context/SelectionContext';
import ItemsControl from '@blocks/shared/ItemsControl';
import { generateUniqueId } from '@utils/id';
import { 
  Clapperboard, Film, Video, Play, Star, Heart, Zap, Rocket,
  Shield, CheckCircle, Award, Gift, Lightbulb, Target, TrendingUp,
  Users, Globe, Smartphone, Monitor, Tv, Headphones, Music,
  Camera, Image, FileText, BookOpen, GraduationCap, Briefcase,
  Home, MapPin, Phone, Mail, MessageCircle, ThumbsUp, Smile
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface FeatureCalloutWidgetProps extends Omit<BaseWidgetProps, 'block'> {
  block: FeatureCalloutBlock;
}

const FeatureCalloutWidget: React.FC<FeatureCalloutWidgetProps> = ({ 
  block, 
  onSelect, 
  isSelected = false,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onRemove
}) => {
  const { props, style } = block;
  const { title, subtitle, items, alignment, itemSize, showIcons, showDescriptions } = props;
  
  const { addBlockItem, selectArrayItem, isItemSelected, moveBlockItemLeft, moveBlockItemRight, removeBlockItem } = useSelection();
  
  // Icon mapping for Feature Callout
  const iconMap: Record<string, LucideIcon> = {
    Clapperboard, Film, Video, Play, Star, Heart, Zap, Rocket,
    Shield, CheckCircle, Award, Gift, Lightbulb, Target, TrendingUp,
    Users, Globe, Smartphone, Monitor, Tv, Headphones, Music,
    Camera, Image, FileText, BookOpen, GraduationCap, Briefcase,
    Home, MapPin, Phone, Mail, MessageCircle, ThumbsUp, Smile
  };
  
  // Function to render icon
  const renderIcon = (iconName: string) => {
    // Try to get the icon from our icon map
    const IconComponent = iconMap[iconName];
    
    if (IconComponent) {
      return <IconComponent size={40}/>;
    }
    
    // Fallback to text if icon not found
    return <span className="text-2xl text-gray-400">{iconName}</span>;
  };
  
  // Handle text color - if it's a hex value, use inline style, otherwise use Tailwind class
  const isHexColor = style?.textColor && style.textColor.startsWith('#');
  const textColorClass = !isHexColor ? (style?.textColor || 'text-gray-900') : '';
  const textColorStyle = isHexColor ? { color: style.textColor } : {};

  // Determine background styling
  const hasCustomBackground = !!style?.backgroundColor;
  const defaultBackgroundClass = 'bg-gray-50';
  const backgroundClass = hasCustomBackground ? '' : defaultBackgroundClass;

  // Build complete style object for BaseWidget
  const widgetStyle: React.CSSProperties = {
    backgroundColor: hasCustomBackground ? style.backgroundColor : undefined,
    color: isHexColor ? style.textColor : undefined,
    borderRadius: style?.borderRadius === 'none' ? '0' : 
                 style?.borderRadius === 'sm' ? '0.25rem' : 
                 style?.borderRadius === 'md' ? '0.5rem' : 
                 style?.borderRadius === 'lg' ? '1rem' : undefined,
    margin: style?.margin === 'none' ? '0' : 
            style?.margin === 'sm' ? '0.5rem' : 
            style?.margin === 'md' ? '1rem' : 
            style?.margin === 'lg' ? '1.5rem' : undefined,
    boxShadow: style?.boxShadow === 'none' ? 'none' : 
               style?.boxShadow === 'sm' ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 
               style?.boxShadow === 'md' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 
               style?.boxShadow === 'lg' ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' : undefined,
    maxWidth: style?.maxWidth || undefined,
  };

  // Alignment classes - use style.textAlign if available, otherwise fall back to block alignment
  const textAlignment = style?.textAlign || alignment;
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  // Item size classes
  const itemSizeClasses = {
    small: 'p-3 text-sm',
    medium: 'p-4 text-base',
    large: 'p-6 text-lg'
  };

  // Grid columns based on item count
  const getGridCols = (itemCount: number) => {
    if (itemCount <= 2) return 'grid-cols-1 sm:grid-cols-2';
    if (itemCount <= 4) return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4';
    return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
  };

  const handleAddItem = () => {
    const currentItemCount = items?.length || 0;
    
    if (currentItemCount >= FEATURE_CALLOUT_ITEM_LIMIT) {
      return; // Don't add more items if at limit
    }
    
    const defaultItem = {
      id: generateUniqueId(),
      icon: 'Star',
      label: 'New Feature',
      description: 'Feature description',
      style: {
        backgroundColor: '#ffffff',
        textColor: '#000000',
        padding: 'md' as const,
        margin: 'sm' as const,
        borderRadius: 'md' as const,
        boxShadow: 'md' as const,
      }
    };
    const newId = addBlockItem(block.id, defaultItem);
    selectArrayItem(block.id, newId);
  };

  const handleItemClick = (itemId: string) => {
    selectArrayItem(block.id, itemId);
  };

  // Check if we're at the item limit
  const isAtItemLimit = (items?.length || 0) >= FEATURE_CALLOUT_ITEM_LIMIT;

  return (
    <BaseWidget 
      block={block} 
      onSelect={onSelect} 
      isSelected={isSelected}
      canMoveUp={canMoveUp}
      canMoveDown={canMoveDown}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onDuplicate={onDuplicate}
      onRemove={onRemove}
      onAddItem={!isAtItemLimit ? handleAddItem : undefined}
      className={`relative ${backgroundClass}`}
      style={widgetStyle}
    >
      <div className={`${alignmentClasses[textAlignment]} ${style?.padding === 'lg' ? 'p-12' : style?.padding === 'md' ? 'p-8' : 'p-6'}`}>
        {/* Title */}
        {title && (
          <h2 className={`text-3xl md:text-4xl font-bold mb-2 ${textColorClass}`} style={textColorStyle}>
            {title}
          </h2>
        )}
        
        {/* Subtitle */}
        {subtitle && (
          <p className={`text-lg md:text-xl mb-8 opacity-80 ${textColorClass}`} style={textColorStyle}>
            {subtitle}
          </p>
        )}
        
        {/* Feature Items Grid */}
        {items && items.length > 0 ? (
          <div className={`grid ${getGridCols(items.length)} gap-6`}>
            {items.map((item, index) => {
              // Build item-specific styles
              const itemStyle: React.CSSProperties = {
                backgroundColor: item.style?.backgroundColor || undefined,
                color: item.style?.textColor || undefined,
                padding: item.style?.padding === 'sm' ? '0.75rem' : 
                         item.style?.padding === 'lg' ? '1.5rem' : '1rem',
                margin: item.style?.margin === 'sm' ? '0.25rem' : 
                        item.style?.margin === 'lg' ? '0.75rem' : '0.5rem',
                borderRadius: item.style?.borderRadius === 'none' ? '0' : 
                             item.style?.borderRadius === 'sm' ? '0.25rem' : 
                             item.style?.borderRadius === 'lg' ? '1rem' : '0.5rem',
                boxShadow: item.style?.boxShadow === 'none' ? 'none' : 
                           item.style?.boxShadow === 'sm' ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 
                           item.style?.boxShadow === 'lg' ? '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' : 
                           '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              };

              // Handle item text color
              const isItemHexColor = item.style?.textColor && item.style.textColor.startsWith('#');
              const itemTextColorClass = !isItemHexColor ? '' : '';
              const itemTextColorStyle = isItemHexColor && item.style?.textColor ? { color: item.style.textColor } : {};

              // Debug: Check if item is selected
              const isSelected = isItemSelected(block.id, item.id);
              return (
                <div 
                  key={item.id} 
                  className={`relative bg-white rounded-lg shadow-md ${itemSizeClasses[itemSize || 'medium']} text-center transition-transform duration-200 hover:scale-105 hover:shadow-lg cursor-pointer group ${
                    isSelected 
                      ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-white' 
                      : ''
                  }`}
                  style={{
                    ...itemStyle,
                    // Remove conflicting styles when selected to let Tailwind ring work
                    boxShadow: isSelected ? undefined : itemStyle.boxShadow,
                    position: 'relative',
                    zIndex: isSelected ? 10 : 0,
                  }}
                  onClick={() => handleItemClick(item.id)}
                >
                  {/* Icon */}
                  {showIcons && item.icon && (
                    <div className="mb-3 flex justify-center">
                      {renderIcon(item.icon)}
                    </div>
                  )}
                  
                  {/* Label */}
                  <h3 className={`font-semibold mb-2 ${itemTextColorClass}`} style={itemTextColorStyle}>
                    {item.label}
                  </h3>
                  
                  {/* Description */}
                  {showDescriptions && item.description && (
                    <p className={`text-sm leading-relaxed ${itemTextColorClass}`} style={itemTextColorStyle}>
                      {item.description}
                    </p>
                  )}

                  {/* Item Controls */}
                  <ItemsControl 
                    index={index}
                    count={items.length}
                    onMoveLeft={() => moveBlockItemLeft(block.id, index)}
                    onMoveRight={() => moveBlockItemRight(block.id, index)}
                    onRemove={() => removeBlockItem(block.id, item.id)}
                    className="absolute top-2 right-2 flex space-x-1 bg-white/95 rounded-lg p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No feature items yet. Click the + button to add items.</p>
          </div>
        )}
      </div>
    </BaseWidget>
  );
};

export default FeatureCalloutWidget; 