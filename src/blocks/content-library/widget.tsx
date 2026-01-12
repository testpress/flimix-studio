
import React, { useEffect, useState, useRef, useCallback } from 'react';
import type { ContentLibraryBlock } from './schema';
import { contentApi, type Content } from '@api/content';
import { useSelection } from '@context/SelectionContext';
import BlockControls from '@layout/BlockControls';

interface ContentLibraryWidgetProps {
  block: ContentLibraryBlock;
  onSelect?: (block: ContentLibraryBlock) => void;
  isSelected?: boolean;
  onRemove?: () => void;
}

const ContentLibraryWidget: React.FC<ContentLibraryWidgetProps> = ({ 
  block, 
  onSelect, 
  isSelected,
  onRemove 
}) => {
  const { props, style } = block;

  const paddingClass = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }[style?.padding || 'lg'];

  const marginClass = {
    none: 'm-0',
    sm: 'm-4',
    md: 'm-6',
    lg: 'm-8',
  }[style?.margin || 'none'];

  const containerStyle = style?.backgroundColor ? { backgroundColor: style.backgroundColor } : {};
  
  const [items, setItems] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const observerTarget = useRef<HTMLDivElement>(null);
  const PAGE_SIZE = 10;
  const { isReadOnly } = useSelection();

  const handleItemClick = (item: Content) => {
    if (isReadOnly && item.url) {
      window.location.href = item.url;
    }
  };

  // Use ref for loading to avoid dependency cycles in fetchItems
  const loadingRef = useRef(loading);
  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  const fetchItems = useCallback(async (pageIndex: number, reset: boolean = false) => {
    if (loadingRef.current) return; // Prevent double fetch
    setLoading(true);
    try {
      const newItems = await contentApi.search({
        contentType: props.contentTypeId,
        limit: PAGE_SIZE,
        offset: pageIndex * PAGE_SIZE,
      });

      if (newItems.length < PAGE_SIZE) {
        setHasMore(false);
      }

      setItems(prev => reset ? newItems : [...prev, ...newItems]);
      setPage(prev => reset ? 1 : prev + 1);
    } catch (error) {
      console.error("Failed to fetch library content:", error);
    } finally {
      setLoading(false);
    }
  }, [props.contentTypeId]);

  // Reset when content type changes
  useEffect(() => {
    setItems([]);
    setPage(0);
    setHasMore(true);
    fetchItems(0, true);
  }, [props.contentTypeId, fetchItems]);

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchItems(page);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [items, hasMore, loading, page, fetchItems]);


  // 1. Calculate Columns based on Item Size
  const gridCols = {
    small: 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6',
    medium: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    large: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  }[props.itemSize || 'medium'];

  // 2. Calculate Aspect Ratio based on Item Shape
  const aspectRatio = {
    landscape: 'aspect-video', // 16:9
    portrait: 'aspect-[2/3]',
    square: 'aspect-square',
  }[props.itemShape || 'landscape'];

  // 3. Calculate Gap
  const gap = {
    small: 'gap-2',
    medium: 'gap-6',
    large: 'gap-10',
  }[props.itemGap || 'medium'];

  const titleAlignmentClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[props.titleAlignment || 'left'];

  const SkeletonItem = () => (
    <div className={`flex flex-col justify-between p-1 bg-neutral-900 border border-neutral-800 rounded-2xl`}>
      <div className="relative w-full">
        <div className={`bg-neutral-800 w-full ${aspectRatio} rounded-xl animate-pulse`}></div>
      </div>
    </div>
  );

  return (
    <div 
      className={`relative group ${isSelected ? 'ring-2 ring-blue-500' : ''} ${marginClass}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(block);
      }}
    >
        {/* Editor Overlay Controls */}
      {isSelected && (
        <>
            <div className="absolute -top-8 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-t flex items-center gap-2 z-10">
                <span>Content Library</span>
            </div>
             <BlockControls 
                canMoveUp={false}
                canMoveDown={false}
                onRemove={onRemove}
             />
        </>
      )}

      {/* Main Content Area */}
      <div 
        className={`bg-black min-h-[500px] ${paddingClass}`}
        style={containerStyle}
      >
        {/* Optional Block Title */}
        {props.title && (
          <div className={`mb-6 ${titleAlignmentClass}`}>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              {props.title}
            </h2>
          </div>
        )}

        {/* Grid */}
        <div className={`grid ${gridCols} ${gap}`}>
           {/* Render Actual Items */}
           {items.map((item) => (
              <div 
                key={item.id} 
                onClick={(e) => {
                  e.stopPropagation();
                  handleItemClick(item);
                }}
                className={`group/card relative ${aspectRatio} bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-gray-600 transition-all cursor-pointer`}
              >
                {/* Image */}
                {(item.poster || item.thumbnail || item.cover) ? (
                    <img src={item.poster || item.thumbnail || item.cover || ''} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-700">
                        <span className="text-4xl font-bold opacity-20">?</span>
                    </div>
                )}
                
                {/* Overlay Info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                    {props.showTitle && <h3 className="text-white font-medium truncate">{item.title}</h3>}
                    {props.showSubtitle && item.subtitle && (
                      <p className="text-gray-300 text-xs truncate mt-0.5">{item.subtitle}</p>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 mt-2">
                        {props.showYear && item.details?.release_year && <span>{item.details.release_year}</span>}
                        {props.showRating && item.details?.imdb_rating && (
                            <span className="bg-yellow-500/20 text-yellow-500 px-1 rounded">{item.details.imdb_rating}</span>
                        )}
                        {props.showGenres && item.genres && item.genres.length > 0 && (
                            <span className="bg-gray-700/50 text-gray-300 px-1 rounded">{item.genres[0]}</span>
                        )}
                    </div>
                </div>
             </div>
          ))}

          {/* Render Skeletons when Loading */}
          {loading && Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <SkeletonItem key={`skeleton-${i}`} />
          ))}
        </div>

        {/* Sentinel / Empty State Messages */}
        <div ref={observerTarget} className="py-8 flex justify-center w-full">
            {!loading && !hasMore && items.length > 0 && (
                <span className="text-gray-600 text-sm">End of list</span>
            )}
            {!loading && items.length === 0 && (
                <span className="text-gray-500">{props.emptyStateMessage || 'No content found.'}</span>
            )}
        </div>
      </div>
    </div>
  );
};

export default ContentLibraryWidget;
