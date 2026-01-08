import React from 'react';
import BlockWidgetWrapper from '@layout/BlockWidgetWrapper';
import type { BlockWidgetWrapperProps } from '@layout/BlockWidgetWrapper';
import type { BadgeStripBlock, BadgeStripItem } from './schema';
import { BADGE_STRIP_ITEM_LIMIT } from './schema';
import { useSelection } from '@context/SelectionContext';
import { useBlockEditing } from '@context/BlockEditingContext';
import BlockItemControl from '@layout/BlockItemControl';
import { generateUniqueId } from '@utils/id';
import { Award, Star, CheckCircle, Monitor, Volume2, Smartphone, Sun, Globe, Zap, Shield, Heart, Camera, Music, Video, Gamepad2, Palette } from 'lucide-react';

interface BadgeStripWidgetProps extends Omit<BlockWidgetWrapperProps<BadgeStripBlock>, 'block'> {
  block: BadgeStripBlock;
}

// Extracted BadgeDisplay component to eliminate duplication
interface BadgeDisplayProps {
  item: BadgeStripItem;
  children: React.ReactNode;
}

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ 
  item, 
  children 
}) => {
  return (
    <div className="relative">
      {children}
      
      {/* Tailwind CSS Tooltip - positioned below the item */}
      {item.tooltip && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
          {item.tooltip}
          {/* Tooltip arrow pointing up */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
        </div>
      )}
    </div>
  );
};

const BadgeStripWidget: React.FC<BadgeStripWidgetProps> = ({ 
  block, onSelect, isSelected, canMoveUp, canMoveDown, onMoveUp, onMoveDown, onDuplicate, onRemove 
}) => {
  const { props, style } = block;
  const { items } = props;
  const { selectBlockItem, isItemSelected: isItemSelectedFromContext } = useSelection();
  const { addBlockItem, moveBlockItemLeft, moveBlockItemRight, removeBlockItem } = useBlockEditing();

  // Get alignment from block style, default to center
  const alignment = style?.textAlign || 'center';
  const alignmentClass = alignment === 'left' ? 'justify-start' :
                         alignment === 'right' ? 'justify-end' : 'justify-center';

  // Clean object maps for CSS classes
  const paddingClass = { lg: 'p-6', md: 'p-4', sm: 'p-2', none: 'p-0' }[style?.padding ?? 'md'];
  const marginClass = { lg: 'm-8', md: 'm-6', sm: 'm-4', none: 'm-0' }[style?.margin ?? 'none'];
  const borderRadiusClass = { lg: 'rounded-lg', md: 'rounded-md', sm: 'rounded-sm', none: 'rounded-none' }[style?.borderRadius ?? 'none'];
  
  // Handle box shadow - custom CSS values for better visibility on dark backgrounds
  const getBoxShadowStyle = (shadowType: string | undefined) => {
    switch (shadowType) {
      case 'lg': return '0 20px 25px -5px rgba(255, 255, 255, 0.3), 0 10px 10px -5px rgba(255, 255, 255, 0.2)';
      case 'md': return '0 10px 15px -3px rgba(255, 255, 255, 0.3), 0 4px 6px -2px rgba(255, 255, 255, 0.2)';
      case 'sm': return '0 4px 6px -1px rgba(255, 255, 255, 0.3), 0 2px 4px -1px rgba(255, 255, 255, 0.2)';
      default: return undefined;
    }
  };
  const boxShadowStyle = getBoxShadowStyle(style?.boxShadow ?? 'none');

  // Icon mapping for rendering
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Award, Star, CheckCircle, Monitor, Volume2, Smartphone, Sun, Globe, 
    Zap, Shield, Heart, Camera, Music, Video, Gamepad2, Palette
  };

  const handleAddItem = () => {
    const currentItemCount = items?.length || 0;
    
    if (currentItemCount >= BADGE_STRIP_ITEM_LIMIT) {
      return; // Don't add more items if at limit
    }
    
    const newItem: BadgeStripItem = {
      id: generateUniqueId(),
      label: 'New Badge',
      icon: 'Award'
    };
    addBlockItem(block.id, newItem);
  };

  const handleItemClick = (itemId: string) => {
    selectBlockItem(block.id, itemId);
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName];
    if (IconComponent) {
      return <IconComponent className="w-5 h-5" />;
    }
    // Fallback for custom icon names
    return <span className="w-5 h-5 flex items-center justify-center text-xs font-mono bg-gray-200 rounded">?</span>;
  };

  // Helper function to get item styling classes
  const getItemStyleClasses = (item: BadgeStripItem) => {
    const itemPaddingClass = { lg: 'p-4', md: 'p-3', sm: 'p-2', none: 'p-0' }[item.style?.padding ?? 'md'];
    const itemMarginClass = { lg: 'm-4', md: 'm-3', sm: 'm-2', none: 'm-0' }[item.style?.margin ?? 'sm'];
    const itemBorderRadiusClass = { lg: 'rounded-xl', md: 'rounded-lg', sm: 'rounded-md', none: 'rounded-none' }[item.style?.borderRadius ?? 'md'];
    // Don't include shadow classes - will be handled by inline styles
    
    return `${itemPaddingClass} ${itemMarginClass} ${itemBorderRadiusClass}`;
  };
  
  // Helper function to get item box shadow styles
  const getItemBoxShadowStyle = (item: BadgeStripItem) => {
    return getBoxShadowStyle(item.style?.boxShadow ?? 'none');
  };

  // Check if we're at the item limit
  const isAtItemLimit = (items?.length || 0) >= BADGE_STRIP_ITEM_LIMIT;

  return (
    <div style={{ boxShadow: boxShadowStyle }}>
      <BlockWidgetWrapper
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
        className={`${paddingClass} ${marginClass} ${borderRadiusClass}`}
        style={{
          backgroundColor: style?.backgroundColor || '#000000'
        }}
      >
      <div className={`flex ${alignmentClass} flex-wrap gap-4`}>
        {items.map((item, index) => {
          const isItemSelected = isItemSelectedFromContext(block.id, item.id);
          
          return (
            <div key={item.id} className="relative group mt-4">
              {/* ItemsControl - positioned at the top, visible on hover */}
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <BlockItemControl
                  index={index}
                  count={items.length}
                  onMoveLeft={() => moveBlockItemLeft(block.id, index)}
                  onMoveRight={() => moveBlockItemRight(block.id, index)}
                  onRemove={() => removeBlockItem(block.id, item.id)}
                  showMoveControls={items.length > 1}
                  showRemoveControl={true}
                  className="flex space-x-1 bg-white/95 rounded-lg p-1.5 shadow-lg border border-gray-300"
                />
              </div>
              
              {/* Badge Item */}
              {item.link && item.link !== '#' ? (
                // Badge with real link - use anchor tag
                <BadgeDisplay
                  item={item}
                >
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 text-sm transition-all cursor-pointer ${getItemStyleClasses(item)} ${
                      isItemSelected 
                        ? 'ring-2 ring-blue-500 ring-offset-1' 
                        : 'hover:ring-1 hover:ring-blue-300'
                    }`}
                    style={{
                      backgroundColor: item.style?.backgroundColor || '#000000',
                      color: item.style?.textColor || '#ffffff',
                      boxShadow: isItemSelected ? undefined : getItemBoxShadowStyle(item),
                    }}
                    onClick={(e) => {
                      e.preventDefault(); // Prevent page reload
                      e.stopPropagation();
                      window.open(item.link!, '_blank');
                    }}
                  >
                    {item.icon && renderIcon(item.icon)}
                    {item.label && <span className="font-medium">{item.label}</span>}
                  </a>
                </BadgeDisplay>
              ) : (
                // Badge without link - use div tag
                <BadgeDisplay
                  item={item}
                >
                  <div
                    className={`flex items-center gap-2 text-sm transition-all cursor-pointer ${getItemStyleClasses(item)} ${
                      isItemSelected 
                        ? 'ring-2 ring-blue-500 ring-offset-1' 
                        : 'hover:ring-1 hover:ring-blue-300'
                    }`}
                    style={{
                      backgroundColor: item.style?.backgroundColor || '#000000',
                      color: item.style?.textColor || '#ffffff',
                      boxShadow: isItemSelected ? undefined : getItemBoxShadowStyle(item),
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItemClick(item.id);
                    }}
                  >
                    {item.icon && renderIcon(item.icon)}
                    {item.label && <span className="font-medium">{item.label}</span>}
                  </div>
                </BadgeDisplay>
              )}
            </div>
          );
        })}
      </div>
      
      {items.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">🏷️</span>
          </div>
          <p className="text-sm font-medium">No badges added yet</p>
          <p className="text-xs text-gray-400">Click the + button above to add your first badge</p>
        </div>
      )}
      </BlockWidgetWrapper>
    </div>
  );
};

export default BadgeStripWidget;
