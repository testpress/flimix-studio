import React from 'react';
import type { FooterSchema } from '@editor/footer/schema';

interface FooterPreviewProps {
  footerSchema: FooterSchema;
  selectedItemId: string | null;
  onItemSelect: (id: string) => void;
}

const FooterPreview: React.FC<FooterPreviewProps> = ({
  footerSchema,
  selectedItemId,
  onItemSelect
}) => {
  return (
    <div 
      className="border-t border-gray-800"
      style={{
        backgroundColor: footerSchema.style?.backgroundColor || '#111111',
        color: footerSchema.style?.textColor || '#cccccc',
        padding: footerSchema.style?.padding || '40px 20px'
      }}
    >
      <div className="px-4">
        <div className="flex flex-wrap">
          {/* Columns */}
          {footerSchema.items
            .filter(item => item.type === 'column')
            .map((column, index) => (
              <div 
                key={column.id || index} 
                className={`w-1/4 px-4 mb-6 cursor-pointer ${selectedItemId === column.id ? 'ring-2 ring-blue-500 rounded' : ''}`}
                onClick={() => onItemSelect(column.id || '')}
              >
                {column.label && (
                  <h4 className="font-medium mb-3">{column.label}</h4>
                )}
                <ul className="space-y-2">
                  {column.items?.map((link, linkIndex) => (
                    <li 
                      key={link.id || linkIndex}
                      className={`cursor-pointer ${selectedItemId === link.id ? 'ring-2 ring-blue-500 rounded px-2' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onItemSelect(link.id || '');
                      }}
                    >
                      <a href="#" className="hover:underline" onClick={(e) => e.preventDefault()}>
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          }
        </div>
        
        {/* Row Items */}
        {footerSchema.items
          .filter(item => item.type === 'row')
          .map((row, index) => (
            <div 
              key={row.id || index} 
              className={`flex justify-center space-x-4 mt-6 pt-6 border-t border-gray-700 cursor-pointer ${selectedItemId === row.id ? 'ring-2 ring-blue-500 rounded' : ''}`}
              onClick={() => onItemSelect(row.id || '')}
            >
              {row.items?.map((item, itemIndex) => (
                <div 
                  key={item.id || itemIndex} 
                  className={`${item.icon ? 'w-10 h-10 rounded-full overflow-hidden' : 'px-3 py-1'} flex items-center justify-center cursor-pointer ${selectedItemId === item.id ? 'ring-2 ring-blue-500 rounded' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onItemSelect(item.id || '');
                  }}
                >
                  {item.icon ? (
                    <img 
                      src={item.icon}
                      alt={item.label || 'Item'}
                      onError={(e) => {
                        e.currentTarget.src = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7r0TBgU8-SuHKlgfTmNzdQoMrk3nU5tFarg&s';
                      }}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    <span className="text-white text-sm whitespace-nowrap">{item.label}</span>
                  )}
                </div>
              ))}
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default FooterPreview;
