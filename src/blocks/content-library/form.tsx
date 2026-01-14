
import React from 'react';
import type { BlockFormProps } from '@type/form';
import type { ContentLibraryBlockProps, ContentLibraryItemSize, ContentLibraryItemGap, ContentLibraryItemShape } from './schema';
import { Settings, Grid3X3, Layers, Type, Calendar, Star } from 'lucide-react';
import { contentApi, type ContentType } from '@api/content';

const ContentLibraryForm: React.FC<BlockFormProps> = ({ block, updateProps }) => {
  const props = block.props as ContentLibraryBlockProps;
  const [contentTypes, setContentTypes] = React.useState<ContentType[]>([]);

  React.useEffect(() => {
    async function loadContentTypes() {
      try {
        const types = await contentApi.fetchContentTypes();
        setContentTypes(types);
      } catch (error) {
        console.error('Failed to load content types:', error);
      }
    }
    loadContentTypes();
  }, []);

  const onChange = (newProps: Partial<ContentLibraryBlockProps>) => {
    updateProps(newProps);
  };

  return (
    <div className="space-y-6 p-4">
      {/* Content Source Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
          <Settings size={18} className="text-gray-500" />
          <h3 className="font-medium text-gray-700">Content Source</h3>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-400 block">Content Type</label>
          <select
            value={props.content_type_id}
            onChange={(e) => onChange({ content_type_id: Number(e.target.value) })}
            className="w-full bg-gray-50 border border-gray-300 rounded p-2 text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
          >
            {contentTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4 pt-4 border-t border-gray-100">
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-400 block">Block Title (Optional)</label>
            <input
              type="text"
              value={props.title || ''}
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder="e.g., Latest Movies"
              className="w-full bg-gray-50 border border-gray-300 rounded p-2 text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-400 block">Title Alignment</label>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              {['left', 'center', 'right'].map((align) => (
                <button
                  key={align}
                  onClick={() => onChange({ title_alignment: align as 'left' | 'center' | 'right' })}
                  className={`flex-1 py-1.5 text-xs font-medium rounded capitalize transition-all ${(props.title_alignment || 'left') === align
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  {align}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Layout Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
          <Grid3X3 size={18} className="text-gray-500" />
          <h3 className="font-medium text-gray-700">Layout</h3>
        </div>

        <div className="space-y-4">
          {/* Item Size */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-400 block">Item Size</label>
            <select
              value={props.item_size || 'medium'}
              onChange={(e) => onChange({ item_size: e.target.value as ContentLibraryItemSize })}
              className="w-full bg-gray-50 border border-gray-300 rounded p-2 text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          {/* Item Gap */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-400 block">Item Gap</label>
            <select
              value={props.item_gap || 'medium'}
              onChange={(e) => onChange({ item_gap: e.target.value as ContentLibraryItemGap })}
              className="w-full bg-gray-50 border border-gray-300 rounded p-2 text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>

          {/* Item Shape */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-400 block">Item Shape</label>
            <select
              value={props.item_shape || 'landscape'}
              onChange={(e) => onChange({ item_shape: e.target.value as ContentLibraryItemShape })}
              className="w-full bg-gray-50 border border-gray-300 rounded p-2 text-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="landscape">Landscape</option>
              <option value="portrait">Portrait</option>
              <option value="square">Square</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appearance Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 pb-2 border-b border-gray-200">
          <Layers size={18} className="text-gray-500" />
          <h3 className="font-medium text-gray-700">Appearance</h3>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center space-x-2">
              <Type size={14} className="text-gray-400" />
              <span className="text-sm text-gray-700">Show Title</span>
            </div>
            <input
              type="checkbox"
              checked={props.show_title}
              onChange={(e) => onChange({ show_title: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center space-x-2">
              <Type size={14} className="text-gray-400" />
              <span className="text-sm text-gray-700">Show Subtitle</span>
            </div>
            <input
              type="checkbox"
              checked={props.show_subtitle}
              onChange={(e) => onChange({ show_subtitle: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center space-x-2">
              <Type size={14} className="text-gray-400" />
              <span className="text-sm text-gray-700">Show Genres</span>
            </div>
            <input
              type="checkbox"
              checked={props.show_genres}
              onChange={(e) => onChange({ show_genres: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center space-x-2">
              <Star size={14} className="text-gray-400" />
              <span className="text-sm text-gray-700">Show Rating</span>
            </div>
            <input
              type="checkbox"
              checked={props.show_rating}
              onChange={(e) => onChange({ show_rating: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center space-x-2">
              <Calendar size={14} className="text-gray-400" />
              <span className="text-sm text-gray-700">Show Year</span>
            </div>
            <input
              type="checkbox"
              checked={props.show_year}
              onChange={(e) => onChange({ show_year: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default ContentLibraryForm;