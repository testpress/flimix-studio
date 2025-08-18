import React from 'react';
import BaseWidget from '@blocks/shared/BaseWidget';
import type { BaseWidgetProps } from '@blocks/shared/BaseWidget';
import type { FooterBlock, FooterColumn } from './schema';
import { FOOTER_ITEMS_LIMIT } from './schema';
import { useSelection } from '@context/SelectionContext';
import ItemsControl from '@blocks/shared/ItemsControl';
import { generateUniqueId } from '@utils/id';
import { Twitter, Facebook, Instagram, MessageCircle, Linkedin, Youtube, Gamepad2, Share2 } from 'lucide-react';

interface FooterWidgetProps extends Omit<BaseWidgetProps<FooterBlock>, 'block'> {
  block: FooterBlock;
}

const FooterWidget: React.FC<FooterWidgetProps> = ({
  block, onSelect, isSelected, canMoveUp, canMoveDown, onMoveUp, onMoveDown, onDuplicate, onRemove
}) => {
  const { items, socialLinks, branding } = block.props;
  const { style } = block;
  const { addBlockItem, selectArrayItem, isItemSelected, moveBlockItemLeft, moveBlockItemRight, removeBlockItem } = useSelection();

  // Handle padding - if it's a predefined value, use Tailwind class, otherwise use inline style
  const paddingClass = style?.padding === 'lg' ? 'p-6' : style?.padding === 'md' ? 'p-4' : style?.padding === 'sm' ? 'p-2' : style?.padding === 'none' ? 'p-0' : 'p-4';
  const paddingStyle = style?.padding && !['lg', 'md', 'sm', 'none'].includes(style.padding) ? { padding: style.padding } : {};

  // Handle margin - if it's a predefined value, use Tailwind class, otherwise use inline style
  const marginClass = style?.margin === 'lg' ? 'm-8' : style?.margin === 'md' ? 'm-6' : style?.margin === 'sm' ? 'm-4' : style?.margin === 'none' ? 'm-0' : '';
  const marginStyle = style?.margin && !['lg', 'md', 'sm', 'none'].includes(style.margin) ? { margin: style.margin } : {};

  // Handle background color
  const backgroundColorStyle = style?.backgroundColor ? { backgroundColor: style.backgroundColor } : {};

  // Handle text color - default to white text
  const isHexColor = style?.textColor && style.textColor.startsWith('#');
  const textColorClass = !isHexColor ? (style?.textColor || 'text-white') : '';
  const textColorStyle = isHexColor ? { color: style.textColor } : {};

  // Handle text alignment
  const textAlignClass = style?.textAlign === 'center' ? 'text-center' : style?.textAlign === 'right' ? 'text-right' : 'text-left';

  // Handle border radius
  const borderRadiusClass = style?.borderRadius === 'lg' ? 'rounded-xl' : style?.borderRadius === 'md' ? 'rounded-lg' : style?.borderRadius === 'sm' ? 'rounded-md' : style?.borderRadius === 'none' ? 'rounded-none' : 'rounded-lg';
  const borderRadiusStyle = style?.borderRadius && !['lg', 'md', 'sm', 'none'].includes(style.borderRadius) ? { borderRadius: style.borderRadius } : {};

  // Handle box shadow
  const boxShadowClass = style?.boxShadow === 'lg' ? 'shadow-lg' : style?.boxShadow === 'md' ? 'shadow-md' : style?.boxShadow === 'sm' ? 'shadow-sm' : style?.boxShadow === 'none' ? 'shadow-none' : 'shadow-none';

  // Check if we're at the footer items limit
  const isAtFooterItemsLimit = (items?.length || 0) >= FOOTER_ITEMS_LIMIT;

  // Available social media platforms with Lucide icons
  const platformIcons: Record<string, React.ReactNode> = {
    twitter: <Twitter className="w-4 h-4" />,
    facebook: <Facebook className="w-4 h-4" />,
    instagram: <Instagram className="w-4 h-4" />,
    whatsapp: <MessageCircle className="w-4 h-4" />,
    linkedin: <Linkedin className="w-4 h-4" />,
    youtube: <Youtube className="w-4 h-4" />,
    discord: <Gamepad2 className="w-4 h-4" />
  };

  const handleSelect = (footerBlock: FooterBlock) => {
    onSelect?.(footerBlock);
  };

  const handleAddItem = () => {
    if (isAtFooterItemsLimit) return;

    const newColumn: FooterColumn = {
      id: generateUniqueId(),
      title: 'New Item',
      links: [
        { id: generateUniqueId(), label: 'New Link', url: '/new-link' }
      ]
    };
    const newId = addBlockItem(block.id, newColumn);
    selectArrayItem(block.id, newId);
  };

  const handleItemClick = (itemId: string) => {
    selectArrayItem(block.id, itemId);
  };

  if (!items || items.length === 0) {
    return (
      <BaseWidget
        block={block}
        onSelect={handleSelect}
        isSelected={isSelected}
        canMoveUp={canMoveUp}
        canMoveDown={canMoveDown}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onDuplicate={onDuplicate}
        onRemove={onRemove}
        onAddItem={!isAtFooterItemsLimit ? handleAddItem : undefined}
        className={`${paddingClass} ${marginClass} ${textAlignClass} ${borderRadiusClass} ${boxShadowClass}`}
        style={{ ...backgroundColorStyle, ...textColorStyle, ...paddingStyle, ...marginStyle, ...borderRadiusStyle }}
      >
        <div className="text-center">
          <p className="text-gray-500">No footer items added</p>
          <p className="text-sm text-gray-400 mt-1">Click the + button to add your first item</p>
        </div>
      </BaseWidget>
    );
  }

  return (
    <BaseWidget
      block={block}
      onSelect={handleSelect}
      isSelected={isSelected}
      canMoveUp={canMoveUp}
      canMoveDown={canMoveDown}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onDuplicate={onDuplicate}
      onRemove={onRemove}
      onAddItem={!isAtFooterItemsLimit ? handleAddItem : undefined}
      className={`${paddingClass} ${marginClass} ${textAlignClass} ${borderRadiusClass} ${boxShadowClass}`}
      style={{ ...backgroundColorStyle, ...textColorStyle, ...paddingStyle, ...marginStyle, ...borderRadiusStyle }}
    >
      <div className="flex flex-row gap-8 mb-6">
        {items && items.map((col, index) => (
          <div key={col.id} className="flex-1 relative group min-w-0">
            {/* ItemsControl positioned above content to avoid overlapping */}
            <div className="mb-2 flex justify-center">
              <ItemsControl 
                index={index}
                count={items.length}
                onMoveLeft={() => moveBlockItemLeft(block.id, index)}
                onMoveRight={() => moveBlockItemRight(block.id, index)}
                onRemove={() => removeBlockItem(block.id, col.id)}
                className="flex space-x-1 bg-white/95 rounded-lg p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              />
            </div>
            
            <div 
              onClick={() => handleItemClick(col.id)}
              className={`cursor-pointer transition-all duration-200 p-4 rounded-lg ${
                isItemSelected(block.id, col.id) ? 'ring-2 ring-blue-500 ring-offset-1' : 'hover:ring-1 hover:ring-blue-300'
              }`}
            >
              {col.title && (
                <h4 className={`font-semibold mb-3 text-lg ${textColorClass}`} style={textColorStyle}>
                  {col.title}
                </h4>
              )}
              <ul className="space-y-2">
                {col.links && col.links.map((link) => (
                  <li key={link.id}>
                    <a 
                      href={link.url} 
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className={`hover:underline transition-colors duration-200 ${textColorClass}`}
                      style={textColorStyle}
                      onClick={(e) => e.stopPropagation()} // Prevent column selection when clicking links
                    >
                      {link.label}
                      {link.external && (
                        <span className="ml-1 text-xs opacity-70">↗</span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {socialLinks && socialLinks.length > 0 && (
        <div className="flex gap-4 mt-6 pt-6 border-t border-gray-200">
          <span className={`text-sm font-medium ${textColorClass}`} style={textColorStyle}>
            Follow us:
          </span>
          <div className="flex gap-3">
            {socialLinks.map((social) => (
              <a 
                key={social.id} 
                href={social.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity duration-200"
                title={`Follow us on ${social.platform}`}
              >
                <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
                  {platformIcons[social.platform] || <Share2 className="w-4 h-4" />}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {branding && (
        <div className={`mt-6 pt-6 border-t border-gray-200 text-sm opacity-70 ${textColorClass}`} style={textColorStyle}>
          {branding}
        </div>
      )}
    </BaseWidget>
  );
};

export default FooterWidget;
