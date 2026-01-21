import React, { useState, useEffect } from 'react';
import BlockWidgetWrapper from '@layout/BlockWidgetWrapper';
import type { BlockWidgetWrapperProps } from '@layout/BlockWidgetWrapper';
import type { NavigationContainerBlock, NavigationItem } from './schema';
import { useSelection } from '@context/SelectionContext';
import { useBlockEditing } from '@context/BlockEditingContext';
import ItemWidget from './ItemWidget';

interface NavigationContainerWidgetProps extends Omit<BlockWidgetWrapperProps, 'block'> {
  block: NavigationContainerBlock;
}

const NavigationContainerWidget: React.FC<NavigationContainerWidgetProps> = ({
  block,
  onSelect,
  isSelected = false,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onRemove,
}) => {
  const { selectBlockItem, isItemSelected, isReadOnly } = useSelection();
  const { moveBlockItemUp, moveBlockItemDown, removeBlockItem } = useBlockEditing();
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  const { 
    items = [], 
    alignment,
    font_size,
    icon_size,
    hide_icons,
    hover,
    colors,
  } = block.props;

  // Extract nested configs with defaults
  const hoverEffect = hover?.effect;
  const disableHover = hover?.disabled || false;

  // Auto-open dropdown when a dropdown item is selected
  useEffect(() => {
    if (!isReadOnly) {
      items.forEach(item => {
        if (item.type === 'dropdown' && isItemSelected(block.id, item.id)) {
          setOpenDropdowns(prev => {
            const newSet = new Set(prev);
            newSet.add(item.id);
            return newSet;
          });
        }
      });
    }
  }, [items, isItemSelected, block.id, isReadOnly]);

  // Handle removing an item
  const handleRemoveItem = (itemId: string) => {
    removeBlockItem(block.id, itemId);
  };

  // Handle moving item up
  const handleMoveItemUp = (index: number) => {
    moveBlockItemUp(block.id, index);
  };

  // Handle moving item down
  const handleMoveItemDown = (index: number) => {
    moveBlockItemDown(block.id, index);
  };

  // Handle item click for selection
  const handleItemClick = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    selectBlockItem(block.id, itemId);
  };

  // Handle preview click (navigation)
  const handlePreviewClick = (item: NavigationItem) => {
    if (item.type === 'dropdown') {
      toggleDropdown(item.id);
      return;
    }

    if (!item.link) return;

    if (item.type === 'anchor') {
      try {
        const targetId = item.link.startsWith('#') ? item.link : `#${item.link}`;
        const element = document.querySelector(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } catch (err) {
        console.error('Invalid anchor selector', err);
      }
    } else if (item.type === 'external') {
      window.open(item.link, '_blank');
    } else {
      // Internal
      window.location.href = item.link;
    }
  };

  // Toggle dropdown
  const toggleDropdown = (itemId: string) => {
    setOpenDropdowns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Get alignment classes
  const getAlignmentClass = () => {
    switch (alignment) {
      case 'left':
        return 'justify-start';
      case 'right':
        return 'justify-end';
      case 'center':
        return 'justify-center';
      default:
        return 'justify-start';
    }
  };

  // Get font size class
  const getFontSizeClass = (size?: string) => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'lg':
        return 'text-lg';
      case 'md':
      default:
        return 'text-base';
    }
  };

  return (
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
    >
      <nav
        className="relative"
        style={{ 
          backgroundColor: block.style?.background_color,
          paddingTop: block.style?.padding_top,
          paddingRight: block.style?.padding_right,
          paddingBottom: block.style?.padding_bottom,
          paddingLeft: block.style?.padding_left,
          marginTop: block.style?.margin_top,
          marginRight: block.style?.margin_right,
          marginBottom: block.style?.margin_bottom,
          marginLeft: block.style?.margin_left,
        }}
      >
        {/* Navigation Items */}
        <div
          className={`flex items-center ${getAlignmentClass()}`}
          style={{ gap: `${block.props.item_gap ?? 24}px` }}
        >
          {items.map((item, index) => (
            <ItemWidget
              key={item.id}
              item={item}
              index={index}
              block={block}
              openDropdowns={openDropdowns}
              hoveredItemId={hoveredItemId}
              setHoveredItemId={setHoveredItemId}
              toggleDropdown={toggleDropdown}
              handleMoveItemUp={handleMoveItemUp}
              handleMoveItemDown={handleMoveItemDown}
              handleRemoveItem={handleRemoveItem}
              handleItemClick={handleItemClick}
              handlePreviewClick={handlePreviewClick}
              colors={colors}
              hoverEffect={hoverEffect}
              disableHover={disableHover}
              hide_icons={hide_icons}
              icon_size={icon_size}
              font_size={font_size}
              getFontSizeClass={getFontSizeClass}
              isSelected={isSelected}
              isReadOnly={isReadOnly}
            />
          ))}
        </div>
      </nav>
    </BlockWidgetWrapper>
  );
};

export default NavigationContainerWidget;
